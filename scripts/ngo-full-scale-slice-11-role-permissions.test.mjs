import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("central NGO permission matrix defines launch roles and expected permissions", () => {
  const permissions = read("src/lib/ngo-permissions.ts");

  assert.match(permissions, /export type NgoRole = "ngo_owner" \| "ngo_admin" \| "ngo_member" \| "ngo_viewer"/);
  assert.match(permissions, /export type NgoPermission/);
  assert.match(permissions, /manage_team/);
  assert.match(permissions, /manage_billing/);
  assert.match(permissions, /create_evidence/);
  assert.match(permissions, /edit_evidence/);
  assert.match(permissions, /archive_evidence/);
  assert.match(permissions, /upload_files/);
  assert.match(permissions, /create_reports/);
  assert.match(permissions, /edit_reports/);
  assert.match(permissions, /share_reports/);
  assert.match(permissions, /view_reports/);
  assert.match(permissions, /view_evidence/);
  assert.match(permissions, /view_billing/);
  assert.match(permissions, /view_audit_summary/);
  assert.match(permissions, /admin_support/);
  assert.match(permissions, /ngoRolePermissionMatrix/);
  assert.match(permissions, /ngo_owner:[\s\S]*"manage_team"[\s\S]*"share_reports"/);
  assert.match(permissions, /ngo_member:[\s\S]*"create_evidence"[\s\S]*"edit_reports"/);
  assert.match(permissions, /ngo_viewer:[\s\S]*"view_reports"[\s\S]*"view_evidence"/);
});

test("auth helpers use the central NGO permission matrix instead of scattered role arrays", () => {
  const auth = read("src/lib/auth.ts");

  assert.match(auth, /rolesHaveNgoPermission/);
  assert.match(auth, /hasNgoPermission/);
  assert.match(auth, /return hasNgoPermission\(session, organizationId, "manage_team"\)/);
  assert.match(auth, /return hasNgoPermission\(session, organizationId, "create_evidence"\)/);
  assert.match(auth, /return hasNgoPermission\(session, organizationId, "view_evidence"\)/);
});

test("team helpers support audited role changes and last-owner protection", () => {
  const team = read("src/lib/ngo-team.ts");

  assert.match(team, /updateTeamMemberRole/);
  assert.match(team, /normalizeMembershipStatus\(membership\.status\) !== "active"/);
  assert.match(team, /currentRole === "ngo_owner" && newRole !== "ngo_owner"/);
  assert.match(team, /countActiveOwners\(client, organizationId\)/);
  assert.match(team, /team\.member_role_changed/);
  assert.match(team, /team\.last_owner_change_blocked/);
  assert.match(team, /At least one active owner is required/);
  assert.match(team, /Choose a different role before saving/);
});

test("team page exposes role-change UI, permission summaries, inactive-state labels, and management guardrails", () => {
  const page = read("src/app/org/team/page.tsx");
  const actions = read("src/app/org/team/actions.ts");

  assert.match(page, /updateTeamMemberRoleAction/);
  assert.match(page, /member\.permissionSummary/);
  assert.match(page, /membershipStatusLabel/);
  assert.match(page, /Removed/);
  assert.match(page, /Suspended/);
  assert.match(page, /The last owner cannot\s+be demoted/);
  assert.match(page, /invite, revoke, remove, or change roles/);
  assert.match(actions, /updateTeamMemberRole/);
  assert.match(actions, /redirect\("\/org\/team\?updated=member_role_changed"\)/);
});

test("viewer report page stays read-only while member roles can create reports", () => {
  const reportsPage = read("src/app/org/reports/page.tsx");

  assert.match(reportsPage, /canManageNgoReports/);
  assert.match(reportsPage, /const canManageReports = canManageNgoReports\(session, organizationId\)/);
  assert.match(reportsPage, /!canManageReports \?/);
  assert.match(reportsPage, /Report editing requires member access/);
  assert.match(reportsPage, /cannot create or edit\s+NGO reports/);
});
