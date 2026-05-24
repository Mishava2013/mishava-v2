import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("/app, /org, and /admin are protected by middleware", () => {
  const middleware = read("middleware.ts");

  assert.match(middleware, /matcher: \["\/app\/:path\*", "\/org\/:path\*", "\/admin\/:path\*"\]/);
  assert.match(middleware, /isAdminSession\(session\)/);
  assert.match(middleware, /hasOrganizationMembership\(session, organizationId\)/);
});

test("server layouts enforce auth, admin, and org membership", () => {
  assert.match(read("src/app/app/layout.tsx"), /requireAuthenticatedSession/);
  assert.match(read("src/app/admin/layout.tsx"), /requireAdminSession/);
  assert.match(read("src/app/org/layout.tsx"), /requireCurrentOrganizationMembership/);
});

test("non-membership isolation is represented in helpers and policies", () => {
  assert.match(read("src/lib/auth.ts"), /hasOrganizationMembership/);
  assert.match(read("supabase/migrations/202605240004_release_2_5_cleanup.sql"), /is_org_member/);
  assert.match(read("supabase/migrations/202605240004_release_2_5_cleanup.sql"), /members can create evidence/);
});

test("NGO onboarding writes organization, membership, ngo profile, and audit event", () => {
  const workflow = read("src/lib/release-2-5-workflows.ts");

  assert.match(workflow, /insert<InsertedRow>\("organizations"/);
  assert.match(workflow, /insert\("organization_memberships"/);
  assert.match(workflow, /insert\("ngo_profiles"/);
  assert.match(workflow, /insert\(\s*"audit_events"/);
  assert.match(workflow, /ngo_profile\.created/);
});

test("evidence creation writes evidence, links NGO submission, and writes audit event", () => {
  const workflow = read("src/lib/release-2-5-workflows.ts");

  assert.match(workflow, /insert<InsertedRow>\("evidence_items"/);
  assert.match(workflow, /selectOne<InsertedRow>\(\s*"ngo_profiles"/);
  assert.match(workflow, /insert\("ngo_evidence_submissions"/);
  assert.match(workflow, /evidence\.created/);
});

test("score snapshots require publication and public visibility for public read", () => {
  const migration = read("supabase/migrations/202605240004_release_2_5_cleanup.sql");

  assert.match(migration, /drop policy if exists "public can read public score snapshots"/);
  assert.match(migration, /published_at is not null/);
  assert.match(migration, /visibility in \('public_summary', 'public_full_record'\)/);
});

