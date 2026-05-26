import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("Slice 15 migration creates private AI parse jobs and suggestions", () => {
  const migration = read(
    "supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql",
  );

  assert.match(migration, /create table if not exists ai_evidence_parse_jobs/);
  assert.match(migration, /create table if not exists ai_evidence_suggestions/);
  assert.match(migration, /organization_id uuid not null references organizations/);
  assert.match(migration, /evidence_item_id uuid not null references evidence_items/);
  assert.match(migration, /requested_by uuid references auth\.users/);
  assert.match(migration, /provider text not null default 'not_configured'/);
  assert.match(migration, /model text not null default 'none'/);
  assert.match(migration, /prompt_version text not null default 'ngo-evidence-suggestion-v0'/);
  assert.match(migration, /status in \('queued', 'completed', 'failed', 'canceled'\)/);
  assert.match(migration, /status in \('suggested', 'reviewed', 'accepted', 'rejected'\)/);
  assert.match(migration, /reviewed_by uuid references auth\.users/);
  assert.match(migration, /reviewed_at timestamptz/);
  assert.match(migration, /token_input_count integer/);
  assert.match(migration, /estimated_cost_cents integer/);
  assert.match(migration, /alter table structured_claims[\s\S]*source_ai_suggestion_id/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /using \(is_org_member\(organization_id\)\)/);
  assert.doesNotMatch(migration, /public evidence library|raw file sharing/i);
});

test("AI evidence helper is suggestion-only and does not call a provider", () => {
  const helper = read("src/lib/ai-evidence-parsing.ts");

  assert.match(helper, /createAiEvidenceParseJob/);
  assert.match(helper, /createAiEvidenceSuggestion/);
  assert.match(helper, /reviewAiEvidenceSuggestion/);
  assert.match(helper, /listAiEvidenceSuggestions/);
  assert.match(helper, /provider: "not_configured"/);
  assert.match(helper, /model: "none"/);
  assert.match(helper, /raw_files_sent_to_ai: false/);
  assert.match(helper, /trust_outcome_automated: false/);
  assert.match(helper, /AI suggestion requires an evidence reference/);
  assert.match(helper, /Suspicious, rejected, or failed-scan files cannot be used for AI suggestions/);
  assert.doesNotMatch(helper, /openai|anthropic|fetch\(/i);
});

test("human review is mandatory before AI suggestions create reviewed draft claims", () => {
  const helper = read("src/lib/ai-evidence-parsing.ts");

  assert.match(helper, /hasNgoPermission\(session, input\.organizationId, "edit_evidence"\)/);
  assert.match(helper, /suggestion\.status === "accepted" \|\| suggestion\.status === "rejected"/);
  assert.match(helper, /status: "reviewed"/);
  assert.match(helper, /source_ai_suggestion_id: suggestion\.id/);
  assert.match(helper, /ai\.suggestion_accepted/);
  assert.match(helper, /ai\.suggestion_rejected/);
  assert.match(helper, /AI suggestion accepted as a reviewed draft claim/);
  assert.doesNotMatch(helper, /status: "accepted",\s*created_by/s);
});

test("evidence UI labels AI suggestions as private draft assistance", () => {
  const page = read("src/app/org/evidence/page.tsx");
  const actions = read("src/app/org/evidence/actions.ts");
  const reports = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /AI-assisted suggestions/);
  assert.match(page, /Human review is required/);
  assert.match(page, /does not affect score, ranking, verification, or\s+report trust context by itself/);
  assert.match(page, /Accept as reviewed draft claim/);
  assert.match(page, /Reject suggestion/);
  assert.match(actions, /reviewAiEvidenceSuggestionAction/);
  assert.match(actions, /reviewAiEvidenceSuggestion/);
  assert.match(reports, /aiSuggestionSummaries/);
  assert.match(reports, /aiSuggestionLabel/);
});

test("privacy language documents suggestion-only AI posture", () => {
  const legal = read("src/lib/legal-pages.ts");
  const foundation = read("src/lib/foundation.ts");

  assert.match(legal, /AI-assisted evidence suggestions/);
  assert.match(legal, /human review before becoming structured claim drafts/);
  assert.match(legal, /Raw evidence files are not sent to AI/);
  assert.match(legal, /must not create final trust outcomes, scores, rankings/);
  assert.match(foundation, /ai_parse_status/);
  assert.match(foundation, /ai_suggestion_status/);
  assert.match(foundation, /ai_provider/);
  assert.match(foundation, /ai_model/);
  assert.match(foundation, /ai_confidence/);
});

test("Slice 15 result documents provider deferral and trust outcome boundaries", () => {
  const result = read("docs/ngo-full-scale-slice-15-ai-evidence-parsing-result.md");

  assert.match(result, /suggestion-only/i);
  assert.match(result, /human review is mandatory/i);
  assert.match(result, /No real AI provider integration was added/i);
  assert.match(result, /no raw files are sent to AI/i);
  assert.match(result, /no trust outcomes are automated/i);
  assert.match(result, /old Supabase project was not touched/i);
  assert.match(result, /This slice did not add/);
});
