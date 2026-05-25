import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("Supabase Auth-aware server and browser utilities exist without exposing service role to browser", () => {
  const auth = read("src/lib/supabase/auth.ts");
  const server = read("src/lib/supabase/server.ts");
  const browser = read("src/lib/supabase/browser.ts");

  assert.match(auth, /signUpWithPassword/);
  assert.match(auth, /signInWithPassword/);
  assert.match(auth, /requestPasswordReset/);
  assert.match(auth, /getAuthSessionFromAccessToken/);
  assert.match(server, /createSupabaseAuthenticatedServerClient/);
  assert.match(server, /authorizationKey/);
  assert.match(browser, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(browser, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("auth pages and actions cover sign-up, sign-in, sign-out, reset, update, and callback", () => {
  const actions = read("src/app/auth/actions.ts");

  assert.match(read("src/app/auth/sign-up/page.tsx"), /signUpAction/);
  assert.match(read("src/app/auth/sign-in/page.tsx"), /\/auth\/sign-in\/submit/);
  assert.match(read("src/app/auth/sign-in/submit/route.ts"), /signInWithPassword/);
  assert.match(
    read("src/app/auth/sign-in/submit/route.ts"),
    /supabaseAccessTokenCookieName/,
  );
  assert.match(read("src/app/auth/sign-out/page.tsx"), /signOutAction/);
  assert.match(read("src/app/auth/reset-password/page.tsx"), /requestPasswordResetAction/);
  assert.match(read("src/app/auth/update-password/page.tsx"), /updatePasswordAction/);
  assert.match(read("src/app/auth/callback/page.tsx"), /Email verification/);
  assert.match(actions, /setSupabaseAuthCookies/);
  assert.match(actions, /clearAuthCookies/);
});

test("route protection bridges Supabase Auth tokens before falling back to temporary cookie sessions", () => {
  const middleware = read("middleware.ts");
  const authServer = read("src/lib/auth-server.ts");

  assert.match(middleware, /supabaseAccessTokenCookieName/);
  assert.match(middleware, /readMiddlewareSupabaseSession/);
  assert.match(middleware, /parseSessionCookieValue/);
  assert.match(middleware, /isAdminSession\(session\)/);
  assert.match(authServer, /getAuthSessionFromAccessToken/);
  assert.match(authServer, /parseSessionCookieValue/);
  assert.match(authServer, /currentOrganizationCookieName/);
});

test("NGO onboarding maps real Supabase auth user to memberships and current org", () => {
  const onboarding = read("src/app/ngo/onboarding/actions.ts");
  const workflow = read("src/lib/release-2-5-workflows.ts");

  assert.match(onboarding, /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/);
  assert.match(onboarding, /setCurrentOrganizationId/);
  assert.match(workflow, /user_id: session\.user\.id/);
  assert.match(workflow, /role: "ngo_owner"/);
  assert.match(workflow, /created_by: session\.user\.id/);
});

test("NGO evidence, report, and shared report paths use authenticated clients where user RLS can apply", () => {
  assert.match(
    read("src/app/org/evidence/actions.ts"),
    /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/,
  );
  assert.match(
    read("src/app/org/evidence/page.tsx"),
    /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/,
  );
  assert.match(
    read("src/app/org/reports/actions.ts"),
    /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/,
  );
  assert.match(
    read("src/app/org/reports/[reportId]/actions.ts"),
    /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/,
  );
  assert.match(
    read("src/app/shared/ngo-reports/[grantId]/page.tsx"),
    /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/,
  );
});

test("auth foundation migration adds structured claim policies for member-scoped draft flow", () => {
  const migration = read("supabase/migrations/202605240012_ngo_auth_foundation.sql");

  assert.match(migration, /members can read structured claims/);
  assert.match(migration, /members can create structured claim drafts/);
  assert.match(migration, /members can update structured claim drafts/);
  assert.match(migration, /is_org_member\(organization_id\)/);
  assert.match(migration, /created_by = auth\.uid\(\)/);
});
