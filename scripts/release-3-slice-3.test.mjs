import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("NGO evidence library shows real evidence metadata and linked claims", () => {
  const page = read("src/app/org/evidence/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /getNgoEvidenceLibrary/);
  assert.match(page, /Evidence library/);
  assert.match(page, /item\.title/);
  assert.match(page, /item\.source_type/);
  assert.match(page, /item\.source_name/);
  assert.match(page, /item\.url/);
  assert.match(page, /item\.notes/);
  assert.match(page, /item\.visibility/);
  assert.match(page, /item\.verification_status/);
  assert.match(page, /item\.linkedStructuredClaimsCount/);
  assert.match(page, /item\.hasAuditTrail/);
  assert.match(helper, /evidence_items/);
  assert.match(helper, /structured_claims/);
  assert.match(helper, /audit_events/);
});

test("structured claim drafts are connected to evidence and audited", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const actions = read("src/app/org/evidence/actions.ts");

  assert.match(actions, /createStructuredClaimDraftAction/);
  assert.match(helper, /createStructuredClaimDraft/);
  assert.match(helper, /evidenceItemId/);
  assert.match(helper, /evidence_item_ids: \[input\.evidenceItemId\]/);
  assert.match(helper, /status: "draft"/);
  assert.match(helper, /action: "structured_claim\.draft_created"/);
  assert.match(helper, /Evidence item was not found for this organization/);
});

test("NGO reports store org linkage, evidence, accepted claims, and private defaults", () => {
  const migration = read("supabase/migrations/202605240008_release_3_slice_3_ngo_reports.sql");
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const reportsPage = read("src/app/org/reports/page.tsx");

  assert.match(migration, /add column if not exists organization_id/);
  assert.match(migration, /add column if not exists created_by/);
  assert.match(migration, /add column if not exists structured_claim_ids/);
  assert.match(migration, /add column if not exists score_snapshot_id/);
  assert.match(migration, /visibility = 'private'/);
  assert.match(helper, /createNgoReportDraft/);
  assert.match(helper, /selectedEvidenceIds/);
  assert.match(helper, /selectedClaimIds/);
  assert.match(helper, /status: "accepted"/);
  assert.match(helper, /visibility: "private"/);
  assert.match(helper, /approval_status: "draft"/);
  assert.match(helper, /created_by: session\.user\.id/);
  assert.match(reportsPage, /Save private draft packet/);
});

test("reports reject another organization's evidence and non-accepted claims", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /Reports can only include evidence owned by this organization/);
  assert.match(helper, /Reports can only include accepted claims owned by this organization/);
  assert.match(helper, /Accepted claims must be backed by evidence selected for the report/);
  assert.match(
    helper,
    /\{ organization_id: input\.organizationId, status: "accepted" \}/,
  );
  assert.match(helper, /allowedAcceptedClaimIds/);
});

test("report creation writes audit event and does not expose reports publicly by default", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const reportsPage = read("src/app/org/reports/page.tsx");

  assert.match(helper, /action: "ngo_report\.draft_created"/);
  assert.match(helper, /subjectTable: "ngo_reports"/);
  assert.match(reportsPage, /Raw evidence remains private/);
  assert.match(reportsPage, /Packets are private by default/);
  assert.match(reportsPage, /does not invent a score/);
  assert.match(reportsPage, /Sharing/);
  assert.match(reportsPage, /Open report to share/);
});

test("Slice 3 does not add fake scores, AI workflows, or shopping scope", () => {
  const migration = read("supabase/migrations/202605240008_release_3_slice_3_ngo_reports.sql");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.doesNotMatch(migration, /insert into score_snapshots/i);
  assert.doesNotMatch(migration, /insert into shopping_products/i);
  assert.doesNotMatch(migration, /overall_score\s*=\s*[0-9]/i);
  assert.doesNotMatch(helper, /ai_assisted: true/);
});
