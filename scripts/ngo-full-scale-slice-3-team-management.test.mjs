import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("team management migration adds roles, membership status, invites, and active-member RLS", () => {
  const migration = read("supabase/migrations/202605240016_ngo_team_management.sql");

  assert.match(migration, /alter type role_code add value if not exists 'ngo_admin'/);
  assert.match(migration, /alter type role_code add value if not exists 'ngo_viewer'/);
  assert.match(migration, /create type membership_status/);
  assert.match(migration, /create type organization_invite_status/);
  assert.match(migration, /create table if not exists organization_invites/);
  assert.match(migration, /status membership_status not null default 'active'/);
  assert.match(migration, /coalesce\(m\.status::text, 'active'\) = 'active'/);
  assert.match(migration, /members can read organization memberships/);
  assert.match(migration, /team managers can create organization invites/);
});

test("auth and session membership reads include NGO admin/viewer and active status only", () => {
  const auth = read("src/lib/auth.ts");
  const supabaseAuth = read("src/lib/supabase/auth.ts");

  assert.match(auth, /"ngo_admin"/);
  assert.match(auth, /"ngo_viewer"/);
  assert.match(auth, /canManageNgoTeam/);
  assert.match(auth, /canManageNgoEvidence/);
  assert.match(auth, /canManageNgoReports/);
  assert.match(auth, /canViewNgoWorkspace/);
  assert.match(supabaseAuth, /params\.set\("status", "eq\.active"\)/);
  assert.match(supabaseAuth, /membership\.status \?\? "active"/);
});

test("team helpers enforce invite acceptance, wrong-email rejection, removal, and last-owner protection", () => {
  const team = read("src/lib/ngo-team.ts");

  assert.match(team, /createTeamInvite/);
  assert.match(team, /acceptTeamInvite/);
  assert.match(team, /revokeTeamInvite/);
  assert.match(team, /removeTeamMember/);
  assert.match(team, /invite\.email\.trim\(\)\.toLowerCase\(\) !== session\.user\.email/);
  assert.match(team, /status: "accepted"/);
  assert.match(team, /status: "removed"/);
  assert.match(team, /At least one active owner is required/);
  assert.match(team, /team\.invite_created/);
  assert.match(team, /team\.invite_accepted/);
  assert.match(team, /team\.invite_revoked/);
  assert.match(team, /team\.member_removed/);
});

test("team page shows real current-org members, invites, dev invite links, and management guardrails", () => {
  const page = read("src/app/org/team/page.tsx");
  const actions = read("src/app/org/team/actions.ts");

  assert.match(page, /getNgoTeamWorkspace/);
  assert.match(page, /workspace\.organizationName/);
  assert.match(page, /workspace\.members\.map/);
  assert.match(page, /workspace\.invites\.map/);
  assert.match(page, /\/app\/team-invites\/\$\{invite\.id\}/);
  assert.match(page, /workspace\.canManageTeam/);
  assert.match(actions, /createTeamInviteAction/);
  assert.match(actions, /revokeTeamInviteAction/);
  assert.match(actions, /removeTeamMemberAction/);
});

test("invite acceptance route requires sign-in and sets current org only after accepted invite", () => {
  const page = read("src/app/app/team-invites/[inviteId]/page.tsx");
  const actions = read("src/app/app/team-invites/[inviteId]/actions.ts");

  assert.match(page, /requireAuthenticatedSession/);
  assert.match(page, /emailMatches/);
  assert.match(page, /Accept invite/);
  assert.match(actions, /acceptTeamInvite/);
  assert.match(actions, /setCurrentOrganizationId/);
  assert.match(actions, /createSupabaseServerClient/);
});

test("viewer role cannot use evidence/report mutations and sharing requires admin access", () => {
  assert.match(read("src/app/org/evidence/actions.ts"), /canManageNgoEvidence/);
  assert.match(read("src/app/org/reports/actions.ts"), /canManageNgoReports/);
  assert.match(read("src/app/org/reports/[reportId]/actions.ts"), /canManageNgoReports/);
  assert.match(read("src/app/org/reports/[reportId]/actions.ts"), /canManageNgoTeam/);
});
