import { paymentFirewall } from "./foundation";

export type PillarId = "labor" | "environment" | "governance" | "community";
export type Level = "Low" | "Medium" | "High";
export type Recency = "Fresh" | "Recent" | "Stale";
export type Confidence = "low" | "medium" | "high";

export type IndicatorScore = {
  id: string;
  pillarId: PillarId;
  label: string;
  value: number;
  weight: number;
  evidenceIds: string[];
  factIds: string[];
  confidence: Confidence;
  coverage: Level;
  recency: Recency;
};

export type PillarScore = {
  id: PillarId;
  name: string;
  score: number;
  summary: string;
  indicators: IndicatorScore[];
  evidenceCoverage: Level;
  recency: Recency;
  confidence: Confidence;
};

export type ScoringVersion = {
  code: string;
  name: string;
  active: boolean;
  pillarWeights: Record<PillarId, number>;
  indicatorWeights: Record<string, number>;
};

export type RankableResult = {
  id: string;
  relevanceScore: number;
  mishavaScore: number;
  userPreferenceMatch: number;
  evidenceCoverageScore: number;
  evidenceRecencyScore: number;
  verificationConfidence: number;
  categoryFit: number;
  locationOrLogisticsFit: number;
  availabilityFit: number;
  createdAt: string;
  paymentStatus?: string;
  subscriptionTier?: string;
  hostedProfileEnabled?: boolean;
  adSpend?: number;
  sponsorship?: string;
  paidBoost?: boolean;
  salesCommission?: number;
};

export const defaultScoringVersion: ScoringVersion = {
  code: "Mishava_Scoring_V2.01_2026.05.24",
  name: "Mishava V2.0 evidence-first scoring foundation",
  active: false,
  pillarWeights: {
    labor: 0.25,
    environment: 0.25,
    governance: 0.25,
    community: 0.25,
  },
  indicatorWeights: {},
};

export const coverageWeight: Record<Level, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export const recencyWeight: Record<Recency, number> = {
  Fresh: 3,
  Recent: 2,
  Stale: 1,
};

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function weightedAverage(items: Array<{ value: number; weight: number }>) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight <= 0) {
    return null;
  }

  const total = items.reduce(
    (sum, item) => sum + clampScore(item.value) * item.weight,
    0,
  );

  return Number((total / totalWeight).toFixed(2));
}

export function calculatePillarScore(
  pillarId: PillarId,
  indicators: IndicatorScore[],
) {
  const matchingIndicators = indicators.filter(
    (indicator) => indicator.pillarId === pillarId,
  );

  return weightedAverage(matchingIndicators);
}

export function calculateOverallScore(
  pillars: PillarScore[],
  scoringVersion: ScoringVersion = defaultScoringVersion,
) {
  const weightedPillars = pillars.map((pillar) => ({
    value: pillar.score,
    weight: scoringVersion.pillarWeights[pillar.id] ?? 0,
  }));

  return weightedAverage(weightedPillars);
}

export function scoreLabel(score: number | null) {
  if (score === null) return "Insufficient evidence";
  if (score >= 90) return "Very strong evidence profile";
  if (score >= 80) return "Strong evidence profile";
  if (score >= 70) return "Moderate evidence profile";
  if (score >= 60) return "Limited evidence profile";
  return "Weak or concerning evidence profile";
}

export function assertRankingInputsRespectPaymentFirewall(result: RankableResult) {
  const forbiddenKeys = paymentFirewall.forbiddenRankingInputs;
  const presentForbiddenInputs = forbiddenKeys.filter((key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
      letter.toUpperCase(),
    ) as keyof RankableResult;
    return result[camelKey] !== undefined && result[camelKey] !== null;
  });

  if (presentForbiddenInputs.length > 0) {
    throw new Error(
      `Forbidden ranking inputs present: ${presentForbiddenInputs.join(", ")}`,
    );
  }
}

export function calculateResultRank(result: RankableResult) {
  assertRankingInputsRespectPaymentFirewall(result);

  return Number(
    (
      result.relevanceScore +
      result.mishavaScore +
      result.userPreferenceMatch +
      result.evidenceCoverageScore +
      result.evidenceRecencyScore +
      result.verificationConfidence +
      result.categoryFit +
      result.locationOrLogisticsFit +
      result.availabilityFit
    ).toFixed(4),
  );
}

export function rankResults(results: RankableResult[]) {
  return [...results].sort((left, right) => {
    const rightRank = calculateResultRank(right);
    const leftRank = calculateResultRank(left);

    if (rightRank !== leftRank) {
      return rightRank - leftRank;
    }

    if (right.evidenceCoverageScore !== left.evidenceCoverageScore) {
      return right.evidenceCoverageScore - left.evidenceCoverageScore;
    }

    if (right.evidenceRecencyScore !== left.evidenceRecencyScore) {
      return right.evidenceRecencyScore - left.evidenceRecencyScore;
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

export function buildScoreExplanation({
  score,
  coverage,
  recency,
  verification,
  confidence,
  why,
}: {
  score: number | null;
  coverage: Level | "Pending";
  recency: Recency | "Pending";
  verification: string;
  confidence: Confidence | "pending";
  why: string;
}) {
  return {
    score,
    label: scoreLabel(score),
    coverage,
    recency,
    verification,
    confidence,
    why,
  };
}

