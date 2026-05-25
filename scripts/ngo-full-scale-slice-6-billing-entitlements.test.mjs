import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("NGO billing model contains locked pricing, setup options, and no-paid-trust language", () => {
  const billing = read("src/lib/ngo-billing.ts");
  const page = read("src/app/org/billing/page.tsx");

  assert.match(billing, /name: "Free NGO Profile"/);
  assert.match(billing, /monthlyPriceCents: 0/);
  assert.match(billing, /name: "Grassroots"/);
  assert.match(billing, /monthlyPriceCents: 1900/);
  assert.match(billing, /annualPriceCents: 19000/);
  assert.match(billing, /name: "Growth"/);
  assert.match(billing, /monthlyPriceCents: 5900/);
  assert.match(billing, /annualPriceCents: 59000/);
  assert.match(billing, /name: "Trust Pro"/);
  assert.match(billing, /monthlyPriceCents: 12900/);
  assert.match(billing, /annualPriceCents: 129000/);
  assert.match(billing, /name: "Network \/ Foundation \/ Association"/);
  assert.match(billing, /Self-Serve Setup/);
  assert.match(billing, /Basic Assisted Setup/);
  assert.match(billing, /Guided Evidence Setup/);
  assert.match(billing, /Full Trust Profile Buildout/);
  assert.match(billing, /Network Setup/);
  assert.match(page, /noPaidTrustOutcomeMessage/);
});

test("NGO entitlements define feature limits without trust outcome controls", () => {
  const billing = read("src/lib/ngo-billing.ts");
  const scoring = read("src/lib/scoring.ts");

  for (const limit of [
    "evidenceItems",
    "activePrivateFiles",
    "storageBytes",
    "reports",
    "activeShareGrants",
    "teamMembers",
    "reportTemplates",
  ]) {
    assert.match(billing, new RegExp(`${limit}:`));
  }

  assert.match(billing, /Entitlements are feature and capacity limits only|noPaidTrustOutcomeMessage/);
  assert.doesNotMatch(scoring, /planKey\??:/);
  assert.doesNotMatch(scoring, /billingStatus\??:/);
});

test("server-side feature gates protect evidence, files, reports, share grants, and invites", () => {
  const workflows = read("src/lib/release-2-5-workflows.ts");
  const files = read("src/lib/evidence-files.ts");
  const reports = read("src/lib/ngo-evidence-reports.ts");
  const team = read("src/lib/ngo-team.ts");

  assert.match(workflows, /check: "evidence_item_create"/);
  assert.match(files, /check: "evidence_file_upload"/);
  assert.match(files, /enforceNgoStorageEntitlement/);
  assert.match(reports, /check: "report_create"/);
  assert.match(reports, /check: "share_grant_create"/);
  assert.match(team, /check: "team_member_invite"/);
  assert.match(billingText(), /ngo_entitlement\.limit_reached/);
});

test("billing page shows usage, locked plans, setup services, and test-mode status without secrets", () => {
  const page = read("src/app/org/billing/page.tsx");

  assert.match(page, /getNgoBillingWorkspace/);
  assert.match(page, /Usage and limits/);
  assert.match(page, /Available NGO plans/);
  assert.match(page, /Setup services/);
  assert.match(page, /Test mode \/ billing not live yet/);
  assert.match(page, /Free NGO self-serve path works without Stripe/);
  assert.doesNotMatch(page, /STRIPE_SECRET_KEY/);
  assert.doesNotMatch(page, /sk_live_/);
  assert.doesNotMatch(page, /sk_test_/);
});

test("payment firewall includes NGO plan and billing fields as forbidden ranking influence", () => {
  const foundation = read("src/lib/foundation.ts");
  const paymentTest = read("scripts/payment-firewall.test.mjs");

  for (const input of [
    "plan_key",
    "billing_status",
    "stripe_subscription_status",
    "setup_service_purchase",
    "sponsored_network_status",
  ]) {
    assert.match(foundation, new RegExp(`"${input}"`));
  }

  for (const input of [
    "planKey",
    "billingStatus",
    "stripeSubscriptionStatus",
    "setupServicePurchase",
    "sponsoredNetworkStatus",
  ]) {
    assert.match(paymentTest, new RegExp(`"${input}"`));
  }
});

test("result document records no production billing and no trust outcome influence", () => {
  const result = read("docs/ngo-full-scale-slice-6-billing-entitlements-result.md");

  assert.match(result, /No production billing was implemented/);
  assert.match(result, /Stripe status: test-mode placeholder/);
  assert.match(result, /payment does not affect trust outcomes/i);
  assert.match(result, /Shopping;/);
  assert.match(result, /Corporate;/);
  assert.match(result, /consumer billing/);
});

function billingText() {
  return read("src/lib/ngo-billing.ts");
}
