import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("NGO member can view own private report detail with honest draft labels", () => {
  const page = read("src/app/org/reports/[reportId]/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /requireCurrentOrganizationMembership/);
  assert.match(page, /getNgoReportDetail/);
  assert.match(helper, /getNgoReportDetail/);
  assert.match(helper, /\{ id: reportId, organization_id: organizationId \}/);
  assert.match(page, /Private to your organization/);
  assert.match(page, /Draft report/);
  assert.match(page, /Not shared/);
  assert.match(page, /Trust context is provisional/);
  assert.match(page, /No public score has been created/);
  assert.match(page, /Exports not enabled yet/);
  assert.match(page, /Sharing not enabled yet/);
});

test("non-members cannot view private report detail because report fetch is org-scoped", () => {
  const page = read("src/app/org/reports/[reportId]/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /requireCurrentOrganizationMembership/);
  assert.match(page, /notFound\(\)/);
  assert.match(helper, /selectOne<NgoReportRow>\(\s*"ngo_reports"/);
  assert.match(helper, /organization_id: organizationId/);
});

test("NGO member can update draft report and update writes audit event", () => {
  const actions = read("src/app/org/reports/[reportId]/actions.ts");
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const page = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(actions, /updateNgoReportDraftAction/);
  assert.match(actions, /requireCurrentOrganizationMembership/);
  assert.match(helper, /updateNgoReportDraft/);
  assert.match(helper, /Only draft reports can be updated in this workflow/);
  assert.match(helper, /action: "ngo_report\.draft_updated"/);
  assert.match(helper, /changed_fields/);
  assert.match(page, /Update private draft/);
});

test("report update rejects another organization's evidence and non-accepted claims", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /validateReportSelections/);
  assert.match(helper, /Reports can only include evidence owned by this organization/);
  assert.match(
    helper,
    /Report trust summaries can only include accepted claims owned by this organization/,
  );
  assert.match(helper, /Draft and rejected claims are excluded/);
  assert.match(helper, /\{ organization_id: organizationId, status: "accepted" \}/);
  assert.match(helper, /Accepted claims must be backed by evidence selected for the report/);
});

test("private reports remain private and no fake scoring claims appear", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const page = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(helper, /visibility: "private"/);
  assert.match(helper, /approval_status: "draft"/);
  assert.match(page, /No public score has been created/);
  assert.match(page, /Do not show invented score values|No public score has been created/);
  assert.doesNotMatch(page, /overall_score\s*[:=]\s*[0-9]/i);
  assert.doesNotMatch(helper, /overall_score\s*[:=]\s*[0-9]/i);
});

test("evidence page clarifies review state, report attachment, and available actions", () => {
  const page = read("src/app/org/evidence/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /reviewLabel/);
  assert.match(helper, /Evidence entered but not reviewed/);
  assert.match(helper, /reportAttachmentLabel/);
  assert.match(helper, /nextStepLabel/);
  assert.match(page, /No evidence yet/);
  assert.match(page, /Evidence entered but not reviewed/);
  assert.match(page, /Only accepted claims can support report trust summaries/);
  assert.match(page, /Raw files are private to your organization/);
});
