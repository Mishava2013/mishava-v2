import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("report owner can create scoped share grant and non-members are blocked by org guard", () => {
  const actions = read("src/app/org/reports/[reportId]/actions.ts");
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const page = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(actions, /createNgoReportShareGrantAction/);
  assert.match(actions, /requireCurrentOrganizationMembership/);
  assert.match(helper, /createNgoReportShareGrant/);
  assert.match(helper, /Share grants can only be created for private reports owned by this organization/);
  assert.match(helper, /visibility: "approved_viewer"/);
  assert.match(helper, /status: "active"/);
  assert.match(page, /Create scoped share grant/);
});

test("share grant migration stores organization, recipient name, and status", () => {
  const migration = read("supabase/migrations/202605240011_ngo_share_grants_slice_2.sql");

  assert.match(migration, /create type share_grant_status as enum \('active', 'revoked'\)/);
  assert.match(migration, /add column if not exists organization_id/);
  assert.match(migration, /add column if not exists granted_to_name/);
  assert.match(migration, /add column if not exists status share_grant_status/);
  assert.match(migration, /members can create share grants/);
  assert.match(migration, /members can revoke share grants/);
  assert.match(migration, /r\.visibility = 'private'/);
});

test("share and revoke actions write audit events", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /action: "ngo_report\.share_grant_created"/);
  assert.match(helper, /action: "ngo_report\.share_grant_revoked"/);
  assert.match(helper, /subjectTable: "ngo_share_grants"/);
  assert.match(helper, /raw_evidence_exposed: false/);
  assert.match(helper, /revoked_at/);
  assert.match(helper, /status: "revoked"/);
});

test("revoked and expired grants block shared report access", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /getSharedNgoReportByGrant/);
  assert.match(helper, /isShareGrantActive/);
  assert.match(helper, /grant\.status === "active"/);
  assert.match(helper, /!grant\.revoked_at/);
  assert.match(helper, /!grant\.expires_at \|\| Date\.parse\(grant\.expires_at\) > now/);
  assert.match(helper, /granted_to_email\.toLowerCase\(\) !== session\.user\.email\.toLowerCase\(\)/);
});

test("shared grant view exposes only report summary and allowed evidence summaries", () => {
  const page = read("src/app/shared/ngo-reports/[grantId]/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /requireAuthenticatedSession/);
  assert.match(page, /getSharedNgoReportByGrant/);
  assert.match(page, /Shared by the NGO/);
  assert.match(page, /Raw evidence not exposed/);
  assert.match(page, /Allowed evidence summaries/);
  assert.match(page, /Raw notes, source files, internal URLs, and workspace details/);
  assert.match(helper, /selectedEvidence = evidence/);
  assert.doesNotMatch(helper, /notes: item\.notes/);
  assert.doesNotMatch(page, /org\/reports/);
  assert.doesNotMatch(page, /org\/evidence/);
});

test("private reports remain private unless grant exists and no public report library is added", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const orgPage = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(helper, /visibility: "private"/);
  assert.match(orgPage, /Private to your organization/);
  assert.match(orgPage, /Not shared/);
  assert.match(orgPage, /Shared/);
  assert.match(orgPage, /Revoked/);
  assert.match(orgPage, /Expires/);
  assert.match(orgPage, /Raw evidence is not shared by default/);
  assert.throws(() => read("src/app/reports/page.tsx"));
  assert.throws(() => read("src/app/shared/ngo-reports/page.tsx"));
});
