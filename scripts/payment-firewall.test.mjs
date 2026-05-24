import test from "node:test";
import assert from "node:assert/strict";

const forbiddenRankingInputs = [
  "paymentStatus",
  "subscriptionTier",
  "hostedProfileEnabled",
  "adSpend",
  "sponsorship",
  "paidBoost",
  "salesCommission",
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

test("ranking rejects payment-derived inputs", () => {
  assert.throws(
    () =>
      rankValue({
        ...unpaid,
        paymentStatus: "paid",
      }),
    /Forbidden ranking inputs present: paymentStatus/,
  );

  assert.throws(
    () =>
      rankValue({
        ...unpaid,
        paidBoost: true,
      }),
    /Forbidden ranking inputs present: paidBoost/,
  );
});

