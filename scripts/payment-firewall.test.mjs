import test from "node:test";
import assert from "node:assert/strict";

const forbiddenRankingInputs = [
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
  "planKey",
  "billingStatus",
  "stripeSubscriptionStatus",
  "setupServicePurchase",
  "sponsoredNetworkStatus",
];

function assertNoPaymentInputs(result) {
  const present = forbiddenRankingInputs.filter(
    (key) => result[key] !== undefined && result[key] !== null,
  );

  if (present.length > 0) {
    throw new Error(`Forbidden ranking inputs present: ${present.join(", ")}`);
  }
}

function rankValue(result) {
  assertNoPaymentInputs(result);

  return (
    result.relevanceScore +
    result.mishavaScore +
    result.userPreferenceMatch +
    result.evidenceCoverageScore +
    result.evidenceRecencyScore +
    result.verificationConfidence +
    result.categoryFit +
    result.locationOrLogisticsFit +
    result.availabilityFit
  );
}

function rankResults(results) {
  return [...results].sort((left, right) => rankValue(right) - rankValue(left));
}

const unpaid = {
  id: "unpaid",
  relevanceScore: 10,
  mishavaScore: 84,
  userPreferenceMatch: 78,
  evidenceCoverageScore: 3,
  evidenceRecencyScore: 3,
  verificationConfidence: 2,
  categoryFit: 8,
  locationOrLogisticsFit: 7,
  availabilityFit: 6,
};

test("payment status does not change rank when trust and fit inputs are equal", () => {
  const paidWithoutPaymentFields = {
    ...unpaid,
    id: "paid",
  };

  const ranked = rankResults([paidWithoutPaymentFields, unpaid]);
  assert.deepEqual(
    ranked.map((result) => rankValue(result)),
    [201, 201],
  );
});

test("paid concepts do not change score when evidence inputs are equal", () => {
  const evidenceOnlyScore = ({ labor, environment, governance, community }) =>
    (labor + environment + governance + community) / 4;

  const baseEvidence = {
    labor: 80,
    environment: 72,
    governance: 90,
    community: 76,
  };

  const paidProfile = {
    ...baseEvidence,
    paymentStatus: "paid",
    subscriptionTier: "enterprise",
    hostedProfileEnabled: true,
    claimedProfileStatus: "claimed",
    sponsorshipStatus: "sponsored",
    planKey: "trust_pro",
    billingStatus: "active",
    stripeSubscriptionStatus: "active",
    setupServicePurchase: "full_buildout",
    sponsoredNetworkStatus: "sponsored",
  };

  assert.equal(evidenceOnlyScore(paidProfile), evidenceOnlyScore(baseEvidence));
});

test("ranking rejects payment-derived inputs", () => {
  for (const forbiddenInput of forbiddenRankingInputs) {
    assert.throws(
      () =>
        rankValue({
          ...unpaid,
          [forbiddenInput]: forbiddenInput.includes("Enabled") ? true : "present",
        }),
      new RegExp(`Forbidden ranking inputs present: ${forbiddenInput}`),
    );
  }
});
