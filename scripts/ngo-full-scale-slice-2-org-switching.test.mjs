import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("middleware protects org routes without trusting current org cookie alone", () => {
  const middleware = read("middleware.ts");

  assert.match(middleware, /protectedPrefixes = \["\/app", "\/org", "\/admin"\]/);
  assert.match(middleware, /supabaseAccessTokenCookieName/);
  assert.doesNotMatch(middleware, /currentOrganizationCookieName/);
  assert.doesNotMatch(middleware, /organization_required/);
});

test("current organization membership helper falls back safely and rejects stale orgs", () => {
  const authServer = read("src/lib/auth-server.ts");

  assert.match(authServer, /getCurrentOrganizationId/);
  assert.match(authServer, /session\.memberships\.length === 1/);
  assert.match(authServer, /hasSelectedOrganization = hasOrganizationMembership/);
  assert.match(authServer, /\/app\?org=invalid/);
  assert.match(authServer, /\/app\?org=select/);
  assert.match(authServer, /clearCurrentOrganizationId/);
});

test("organization switcher state only uses active session memberships", () => {
  const context = read("src/lib/organization-context.ts");

  assert.match(context, /getOrganizationSwitcherState/);
  assert.match(context, /session\.memberships\.map/);
  assert.match(context, /organizations\.length === 1/);
  assert.match(context, /hasStaleSelection/);
  assert.match(context, /canSelectOrganization/);
  assert.match(context, /membership\.organizationId === organizationId/);
});

test("switch action validates membership, rejects non-member orgs, and sets current org", () => {
  const action = read("src/app/app/organization-actions.ts");

  assert.match(action, /requireAuthenticatedSession/);
  assert.match(action, /canSelectOrganization\(session, organizationId\)/);
  assert.match(action, /clearCurrentOrganizationId/);
  assert.match(action, /redirect\("\/app\?org=invalid"\)/);
  assert.match(action, /setCurrentOrganizationId\(organizationId\)/);
  assert.match(action, /safeReturnTo/);
});

test("app and org layouts render the switcher while org routes retain membership checks", () => {
  const appLayout = read("src/app/app/layout.tsx");
  const orgLayout = read("src/app/org/layout.tsx");

  assert.match(appLayout, /OrganizationSwitcher/);
  assert.match(appLayout, /getOrganizationSwitcherState/);
  assert.match(appLayout, /requireAuthenticatedSession/);
  assert.match(orgLayout, /OrganizationSwitcher/);
  assert.match(orgLayout, /requireCurrentOrganizationMembership/);
  assert.match(orgLayout, /getOrganizationSwitcherState/);
});

test("core org pages continue to rely on selected server-side organization membership", () => {
  assert.match(read("src/app/org/evidence/page.tsx"), /requireCurrentOrganizationMembership/);
  assert.match(read("src/app/org/reports/page.tsx"), /requireCurrentOrganizationMembership/);
  assert.match(read("src/app/org/reports/[reportId]/page.tsx"), /requireCurrentOrganizationMembership/);
});
