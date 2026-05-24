import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

const forbiddenSnakeCaseInputs = [
  "payment_status",
  "subscription_tier",
  "hosted_profile_enabled",
  "claimed_profile_status",
  "sponsorship_status",
  "ad_spend",
  "paid_boost",
  "sales_commission",
  "affiliate_fee",
  "referral_fee",
];

const forbiddenCamelCaseInputs = [
  "paymentStatus",
  "subscriptionTier",
  "hostedProfileEnabled",
  "claimedProfileStatus",
  "sponsorshipStatus",
  "adSpend",
  "paidBoost",
  "salesCommission",
  "affiliateFee",
  "referralFee",
];

test("payment firewall helper separates billable tools from trust calculation surfaces", () => {
  const foundation = read("src/lib/foundation.ts");
  const scoring = read("src/lib/scoring.ts");

  for (const surface of [
    "billable_entitlements",
    "profile_tools",
    "hosted_pages",
    "catalogs",
    "reports",
  ]) {
    assert.match(foundation, new RegExp(`"${surface}"`));
  }

  for (const surface of [
    "score_calculation",
    "ranking_calculation",
    "verification_status",
    "credibility_labels",
  ]) {
    assert.match(foundation, new RegExp(`"${surface}"`));
  }

  assert.match(scoring, /assertBillableEntitlementsDoNotContainTrustControls/);
});

test("forbidden paid visibility concepts are listed in helpers and not rankable result inputs", () => {
  const foundation = read("src/lib/foundation.ts");
  const scoring = read("src/lib/scoring.ts");
  const rankableResultType = scoring.match(/export type RankableResult = \{[\s\S]*?\n\};/)?.[0] ?? "";

  for (const input of forbiddenSnakeCaseInputs) {
    assert.match(foundation, new RegExp(`"${input}"`));
  }

  for (const input of forbiddenCamelCaseInputs) {
    assert.doesNotMatch(rankableResultType, new RegExp(`${input}\\??:`));
  }
});

test("ranking formula migration records full allowed and forbidden input boundaries", () => {
  const migration = read("supabase/migrations/202605240006_release_3_slice_1_firewalls.sql");

  for (const allowedInput of [
    "search_match",
    "evidence_score",
    "user_preference_match",
    "evidence_coverage",
    "evidence_recency",
    "verification_confidence",
    "category_fit",
    "local_distance_availability",
  ]) {
    assert.match(migration, new RegExp(`'${allowedInput}'`));
  }

  for (const forbiddenInput of forbiddenSnakeCaseInputs) {
    assert.match(migration, new RegExp(`'${forbiddenInput}'`));
  }

  assert.match(migration, /payment_inputs_used = false/);
});

test("score snapshots are protected by append-only triggers", () => {
  const migration = read("supabase/migrations/202605240006_release_3_slice_1_firewalls.sql");

  assert.match(migration, /prevent_score_snapshot_mutation/);
  assert.match(migration, /score_snapshots_no_update/);
  assert.match(migration, /before update on score_snapshots/);
  assert.match(migration, /score_snapshots_no_delete/);
  assert.match(migration, /before delete on score_snapshots/);
  assert.match(migration, /score_snapshots are append-only/);
});

test("snapshot visibility policies require publication and org membership", () => {
  const migration = read("supabase/migrations/202605240004_release_2_5_cleanup.sql");

  assert.match(migration, /public can read published public score snapshots/);
  assert.match(migration, /published_at is not null/);
  assert.match(migration, /visibility in \('public_summary', 'public_full_record'\)/);
  assert.match(migration, /members can read organization score snapshots/);
  assert.match(migration, /is_org_member\(organization_id\)/);
});
