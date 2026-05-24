import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("structured claims require evidence references and review status", () => {
  const migration = read("supabase/migrations/202605240007_release_3_slice_2_scoring_pipeline.sql");

  assert.match(migration, /add column if not exists status text not null default 'draft'/);
  assert.match(migration, /structured_claims_status_check/);
  assert.match(migration, /'draft', 'reviewed', 'accepted', 'rejected'/);
  assert.match(migration, /structured_claims_require_evidence_reference/);
  assert.match(migration, /cardinality\(evidence_item_ids\) > 0/);
});

test("draft and rejected claims do not enter draft score snapshots", () => {
  const workflow = read("src/lib/scoring-workflows.ts");

  assert.match(workflow, /\{ organization_id: input\.organizationId, status: "accepted" \}/);
  assert.match(workflow, /Draft score snapshots require accepted evidence-backed claims/);
  assert.match(workflow, /reviewStructuredClaim/);
  assert.match(workflow, /status: "accepted" \| "rejected"/);
});

test("accepted claims can enter a private draft score snapshot without fake score values", () => {
  const workflow = read("src/lib/scoring-workflows.ts");

  assert.match(workflow, /acceptedClaims/);
  assert.match(workflow, /source_claim_ids: acceptedClaims\.map/);
  assert.match(workflow, /source_evidence_item_ids: evidenceIds/);
  assert.match(workflow, /overall_score: null/);
  assert.match(workflow, /snapshot_status: "draft"/);
  assert.match(workflow, /visibility: "private"/);
  assert.match(workflow, /published_at: null/);
});

test("draft score snapshot creation writes an audit event", () => {
  const workflow = read("src/lib/scoring-workflows.ts");

  assert.match(workflow, /action: "score_snapshot\.draft_created"/);
  assert.match(workflow, /subjectTable: "score_snapshots"/);
  assert.match(workflow, /claim_count: acceptedClaims\.length/);
  assert.match(workflow, /evidence_count: evidenceSnapshot\.length/);
});

test("scoring version lifecycle supports draft publishing and immutable published versions", () => {
  const migration = read("supabase/migrations/202605240007_release_3_slice_2_scoring_pipeline.sql");
  const workflow = read("src/lib/scoring-workflows.ts");

  assert.match(migration, /scoring_versions_status_check/);
  assert.match(migration, /'draft', 'published', 'archived'/);
  assert.match(migration, /prevent_published_scoring_version_mutation/);
  assert.match(migration, /published scoring_versions are immutable; create a new version/);
  assert.match(migration, /scoring_versions_no_published_update/);
  assert.match(migration, /scoring_versions_no_published_delete/);
  assert.match(workflow, /createDraftScoringVersion/);
  assert.match(workflow, /publishScoringVersion/);
  assert.match(workflow, /action: "scoring_version\.created"/);
  assert.match(workflow, /action: "scoring_version\.published"/);
});

test("draft snapshots are private by default and public snapshots require published status", () => {
  const migration = read("supabase/migrations/202605240007_release_3_slice_2_scoring_pipeline.sql");
  const workflow = read("src/lib/scoring-workflows.ts");

  assert.match(migration, /add column if not exists snapshot_status text not null default 'draft'/);
  assert.match(migration, /snapshot_status = 'published'/);
  assert.match(migration, /published_at is not null/);
  assert.match(migration, /visibility in \('public_summary', 'public_full_record'\)/);
  assert.match(workflow, /visibility: "private"/);
  assert.match(workflow, /published_at: null/);
});

test("Slice 2 migration does not seed fake scores or products", () => {
  const migration = read("supabase/migrations/202605240007_release_3_slice_2_scoring_pipeline.sql");

  assert.doesNotMatch(migration, /insert into score_snapshots/i);
  assert.doesNotMatch(migration, /insert into structured_claims/i);
  assert.doesNotMatch(migration, /insert into shopping_products/i);
  assert.doesNotMatch(migration, /overall_score\s*=\s*[0-9]/i);
});
