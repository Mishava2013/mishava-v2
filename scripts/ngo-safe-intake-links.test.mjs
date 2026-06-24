import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("safe intake migration is private-by-default with staff-only RLS", () => {
  const migration = read("supabase/migrations/202606230001_ngo_safe_intake_links.sql");

  assert.match(migration, /create table if not exists ngo_safe_intake_links/);
  assert.match(migration, /create table if not exists ngo_safe_intake_submissions/);
  assert.match(migration, /token text not null unique/);
  assert.match(migration, /status text not null default 'active'/);
  assert.match(migration, /pending_review/);
  assert.match(migration, /accepted_for_evidence_review/);
  assert.match(migration, /share_outside_ngo text/);
  assert.match(migration, /retaliation_concern text/);
  assert.match(migration, /worker_name_private text/);
  assert.match(migration, /immigration_concern text/);
  assert.match(migration, /safe_contact_method text/);
  assert.match(migration, /alter table ngo_safe_intake_links enable row level security/);
  assert.match(migration, /alter table ngo_safe_intake_submissions enable row level security/);
  assert.match(migration, /org members can read safe intake links/);
  assert.match(migration, /org members can read safe intake submissions/);
  assert.doesNotMatch(migration, /\bto\s+anon\b/i);
  assert.doesNotMatch(migration, /for\s+select\s+to\s+public/i);
  assert.doesNotMatch(migration, /for\s+insert\s+to\s+public/i);
});

test("public intake route is account-free and uses required plain-language wording", () => {
  const page = read("src/app/intake/[token]/page.tsx");
  const action = read("src/app/intake/[token]/actions.ts");

  assert.match(page, /Start your intake/);
  assert.match(page, /Tell us what happened/);
  assert.match(page, /Send to the organization/);
  assert.match(page, /You do not need a Mishava account/);
  assert.match(page, /Nothing becomes public/);
  assert.match(page, /This is not legal advice/);
  assert.match(page, /This form does not create a\s+public accusation, public report, legal conclusion, score, or AI\s+decision/);
  assert.match(page, /Should your name stay private/);
  assert.match(page, /Are you worried about retaliation/);
  assert.match(page, /Safest way to contact you/);
  assert.match(page, /Add a photo or file/);
  assert.match(page, /safeIntakeIssueOptions/);
  assert.match(page, /safeIntakeIndustryOptions/);
  assert.match(page, /safeIntakeActorOptions/);
  assert.match(action, /createSafeIntakeSubmission/);
  assert.match(action, /createSupabaseServerClient/);
  assert.doesNotMatch(page, /requireCurrentOrganizationMembership|getCurrentSession/);
  assert.doesNotMatch(action, /requireCurrentOrganizationMembership|getCurrentSession/);
  assert.doesNotMatch(page, /Stripe|checkout|payment required|score this/i);
});

test("staff intake workspace creates links and reviews private submissions only inside org", () => {
  const page = read("src/app/org/intake/page.tsx");
  const action = read("src/app/org/intake/actions.ts");
  const evidencePage = read("src/app/org/evidence/page.tsx");

  assert.match(page, /Create safe intake links/);
  assert.match(page, /without a Mishava\s+account/);
  assert.match(page, /This is not a public complaint portal/);
  assert.match(page, /Create intake link/);
  assert.match(page, /NGO-only review queue/);
  assert.match(page, /Nothing is published\s+from this queue/);
  assert.match(page, /Save review/);
  assert.match(page, /Move to evidence review/);
  assert.match(page, /Nothing public created/);
  assert.match(action, /requireCurrentOrganizationMembership/);
  assert.match(action, /canManageNgoEvidence/);
  assert.match(action, /createSafeIntakeLink/);
  assert.match(action, /reviewSafeIntakeSubmission/);
  assert.match(action, /updateSafeIntakeLinkStatus/);
  assert.match(evidencePage, /Open safe intake links/);
  assert.match(evidencePage, /Submissions stay private until your organization reviews/);
});

test("safe intake helper keeps submissions private and suggestion-free", () => {
  const helper = read("src/lib/ngo-safe-intake.ts");

  assert.match(helper, /source_type: "safe_intake_submission"/);
  assert.match(helper, /visibility: "private"/);
  assert.match(helper, /verification_status: "unverified"/);
  assert.match(helper, /lifecycle_status: "draft"/);
  assert.match(helper, /created_by: null/);
  assert.match(helper, /uploaded_by: null/);
  assert.match(helper, /public_complaint_portal: false/);
  assert.match(helper, /client_account_required: false/);
  assert.match(helper, /staff_review_required: true/);
  assert.match(helper, /public_report_created: false/);
  assert.match(helper, /public_score_created: false/);
  assert.match(helper, /accepted_for_evidence_review/);
  assert.match(helper, /ngo_evidence_submissions/);
  assert.match(helper, /workerRightsIssueCategories/);
  assert.match(helper, /workerRightsIndustryTags/);
  assert.match(helper, /workerRightsActorTypes/);
  assert.doesNotMatch(helper, /openai|anthropic|gemini|generateScore|ranking/i);
  assert.doesNotMatch(helper, /stripe|checkout|payment/i);
});
