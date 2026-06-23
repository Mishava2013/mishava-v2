import { createHash } from "node:crypto";

import type { SupabaseServerClient } from "./supabase/server";

export type AiFeatureKey =
  | "ngo.evidence_parsing"
  | "ngo.report_reviewer_notes"
  | "shopping.product_research"
  | "shopping.supplier_document_parse"
  | "support.triage_summary";

export type AiAttemptStatus =
  | "allowed"
  | "blocked"
  | "cache_hit"
  | "failed"
  | "unavailable"
  | "over_budget";

export type AiReviewStatus = "suggestion_only";

export type AiSuggestionEnvelope<TSuggestion extends Record<string, unknown>> = {
  reviewStatus: AiReviewStatus;
  requiresHumanReview: true;
  canAffectTrustOutcome: false;
  canAffectScore: false;
  canAffectRanking: false;
  suggestion: TSuggestion | null;
  fallbackMessage?: string;
};

export type AiControlledRequest<TInput extends Record<string, unknown>> = {
  feature: AiFeatureKey;
  actionType: string;
  input: TInput;
  organizationId?: string | null;
  userId?: string | null;
  environment?: "development" | "preview" | "production" | "test";
  sourceTable?: string | null;
  sourceId?: string | null;
  promptVersion?: string;
  modelName?: string;
  estimatedCostCents?: number;
  requestedOutcome?: AiForbiddenOutcome;
  client?: SupabaseServerClient;
  featureConfig?: Partial<Record<AiFeatureKey, AiFeatureControl>>;
  budgetSnapshot?: AiBudgetSnapshot;
  cache?: AiSuggestionCache;
};

export type AiFeatureControl = {
  enabled: boolean;
  reason: string;
};

export type AiBudgetSnapshot = {
  organizationMonthlyLimitCents?: number;
  organizationMonthToDateCents?: number;
  userMonthlyLimitCents?: number;
  userMonthToDateCents?: number;
  environmentLimitCents?: number;
  environmentMonthToDateCents?: number;
};

export type AiSuggestionCache = {
  get(contentHash: string): Promise<AiSuggestionEnvelope<Record<string, unknown>> | null>;
  set?(
    contentHash: string,
    value: AiSuggestionEnvelope<Record<string, unknown>>,
  ): Promise<void>;
};

export type AiControlResult<TSuggestion extends Record<string, unknown>> = {
  ok: boolean;
  status: AiAttemptStatus;
  feature: AiFeatureKey;
  actionType: string;
  contentHash: string;
  suggestion: AiSuggestionEnvelope<TSuggestion>;
  message: string;
};

export type AiUsageLogInput = {
  client?: SupabaseServerClient;
  organizationId?: string | null;
  userId?: string | null;
  productSurface: string;
  workflow: string;
  status: AiAttemptStatus;
  sourceTable?: string | null;
  sourceId?: string | null;
  estimatedCostCents?: number;
  modelName?: string;
  promptVersion?: string;
  inputHash: string;
  reason: string;
};

export type AiForbiddenOutcome =
  | "score"
  | "ranking"
  | "verification"
  | "trust_badge"
  | "publishing"
  | "supplier_approval"
  | "seller_approval"
  | "ngo_escalation"
  | "payment_access_decision"
  | "legal_compliance_conclusion";

const forbiddenOutcomes: AiForbiddenOutcome[] = [
  "score",
  "ranking",
  "verification",
  "trust_badge",
  "publishing",
  "supplier_approval",
  "seller_approval",
  "ngo_escalation",
  "payment_access_decision",
  "legal_compliance_conclusion",
];

export const AI_FORBIDDEN_OUTCOMES: ReadonlySet<AiForbiddenOutcome> = new Set(
  forbiddenOutcomes,
);

export const AI_FEATURE_CONTROLS: Record<AiFeatureKey, AiFeatureControl> = {
  "ngo.evidence_parsing": {
    enabled: false,
    reason: "Provider calls are disabled until budget, cache, and review controls are approved.",
  },
  "ngo.report_reviewer_notes": {
    enabled: false,
    reason: "Internal reviewer notes are planned, but provider calls are not enabled.",
  },
  "shopping.product_research": {
    enabled: false,
    reason: "Shopping research remains human-reviewed and provider-disabled.",
  },
  "shopping.supplier_document_parse": {
    enabled: false,
    reason: "Supplier parsing may suggest fields later, but cannot approve suppliers.",
  },
  "support.triage_summary": {
    enabled: false,
    reason: "Support triage summaries are planned as suggestion-only assistance.",
  },
};

const AI_UNAVAILABLE_MESSAGE =
  "AI suggestions are unavailable right now, but you can continue using Mishava's structured review workflow. Your work can still be reviewed manually.";

export function stableAiContentHash(input: Record<string, unknown>) {
  return createHash("sha256")
    .update(stableJson(input))
    .digest("hex");
}

export function createSuggestionOnlyEnvelope<TSuggestion extends Record<string, unknown>>(
  suggestion: TSuggestion | null,
  fallbackMessage = AI_UNAVAILABLE_MESSAGE,
): AiSuggestionEnvelope<TSuggestion> {
  return {
    reviewStatus: "suggestion_only",
    requiresHumanReview: true,
    canAffectTrustOutcome: false,
    canAffectScore: false,
    canAffectRanking: false,
    suggestion,
    fallbackMessage,
  };
}

export async function requestControlledAiSuggestion<
  TInput extends Record<string, unknown>,
  TSuggestion extends Record<string, unknown>,
>(
  request: AiControlledRequest<TInput>,
): Promise<AiControlResult<TSuggestion>> {
  const contentHash = stableAiContentHash(request.input);
  const featureControl = {
    ...AI_FEATURE_CONTROLS[request.feature],
    ...request.featureConfig?.[request.feature],
  };

  if (request.requestedOutcome && AI_FORBIDDEN_OUTCOMES.has(request.requestedOutcome)) {
    return logAndReturn<TInput, TSuggestion>(request, {
      contentHash,
      status: "blocked",
      message: `AI cannot affect ${request.requestedOutcome}.`,
    });
  }

  if (!featureControl.enabled) {
    return logAndReturn<TInput, TSuggestion>(request, {
      contentHash,
      status: "blocked",
      message: featureControl.reason,
    });
  }

  const budgetResult = evaluateAiBudget({
    snapshot: request.budgetSnapshot,
    estimatedCostCents: request.estimatedCostCents ?? 0,
  });

  if (!budgetResult.ok) {
    return logAndReturn<TInput, TSuggestion>(request, {
      contentHash,
      status: "over_budget",
      message: budgetResult.message,
    });
  }

  const cachedSuggestion = await request.cache?.get(contentHash);

  if (cachedSuggestion) {
    await logAiUsageAttempt({
      client: request.client,
      organizationId: request.organizationId,
      userId: request.userId,
      productSurface: productSurfaceForFeature(request.feature),
      workflow: request.actionType,
      sourceTable: request.sourceTable,
      sourceId: request.sourceId,
      status: "cache_hit",
      estimatedCostCents: 0,
      modelName: "cache",
      promptVersion: request.promptVersion ?? "unknown",
      inputHash: contentHash,
      reason: "AI suggestion served from cache before any provider call.",
    });

    return {
      ok: true,
      status: "cache_hit",
      feature: request.feature,
      actionType: request.actionType,
      contentHash,
      suggestion: cachedSuggestion as AiSuggestionEnvelope<TSuggestion>,
      message: "Cached suggestion returned. Human review is still required.",
    };
  }

  // Provider calls intentionally do not exist yet. Future provider integrations
  // must be added behind this point and must preserve the guardrails above.
  return logAndReturn<TInput, TSuggestion>(request, {
    contentHash,
    status: "unavailable",
    message: AI_UNAVAILABLE_MESSAGE,
  });
}

export function evaluateAiBudget({
  snapshot,
  estimatedCostCents,
}: {
  snapshot?: AiBudgetSnapshot;
  estimatedCostCents: number;
}) {
  if (!snapshot) return { ok: true as const, message: "No active budget snapshot." };

  const checks = [
    {
      label: "organization",
      limit: snapshot.organizationMonthlyLimitCents,
      spent: snapshot.organizationMonthToDateCents,
    },
    {
      label: "user",
      limit: snapshot.userMonthlyLimitCents,
      spent: snapshot.userMonthToDateCents,
    },
    {
      label: "environment",
      limit: snapshot.environmentLimitCents,
      spent: snapshot.environmentMonthToDateCents,
    },
  ];

  for (const check of checks) {
    if (
      typeof check.limit === "number" &&
      typeof check.spent === "number" &&
      check.spent + estimatedCostCents > check.limit
    ) {
      return {
        ok: false as const,
        message: `AI ${check.label} budget would be exceeded.`,
      };
    }
  }

  return { ok: true as const, message: "Budget check passed." };
}

export async function logAiUsageAttempt(input: AiUsageLogInput) {
  if (!input.client) return;

  await input.client.insert("ai_usage_ledger", {
    organization_id: input.organizationId ?? null,
    actor_user_id: input.userId ?? null,
    product_surface: input.productSurface,
    workflow: input.workflow,
    source_table: input.sourceTable ?? null,
    source_id: input.sourceId ?? null,
    status: mapAiAttemptToLedgerStatus(input.status),
    billable: false,
    covered_by_plan: false,
    estimated_cost_cents: input.estimatedCostCents ?? 0,
    actual_cost_cents: 0,
    model_name: input.modelName ?? "none",
    prompt_version: input.promptVersion ?? "unknown",
    completed_at: new Date().toISOString(),
  });
}

export function assertAiCannotAffectOutcome(outcome: AiForbiddenOutcome) {
  if (AI_FORBIDDEN_OUTCOMES.has(outcome)) {
    return {
      ok: false as const,
      status: "blocked" as const,
      message: `AI cannot affect ${outcome}.`,
    };
  }

  return { ok: true as const, status: "allowed" as const };
}

function logAndReturn<
  TInput extends Record<string, unknown>,
  TSuggestion extends Record<string, unknown>,
>(
  request: AiControlledRequest<TInput>,
  result: {
    contentHash: string;
    status: AiAttemptStatus;
    message: string;
  },
): Promise<AiControlResult<TSuggestion>> {
  return logAiUsageAttempt({
    client: request.client,
    organizationId: request.organizationId,
    userId: request.userId,
    productSurface: productSurfaceForFeature(request.feature),
    workflow: request.actionType,
    sourceTable: request.sourceTable,
    sourceId: request.sourceId,
    status: result.status,
    estimatedCostCents: request.estimatedCostCents ?? 0,
    modelName: request.modelName ?? "none",
    promptVersion: request.promptVersion ?? "unknown",
    inputHash: result.contentHash,
    reason: result.message,
  }).then(() => ({
    ok: result.status === "allowed" || result.status === "cache_hit",
    status: result.status,
    feature: request.feature,
    actionType: request.actionType,
    contentHash: result.contentHash,
    suggestion: createSuggestionOnlyEnvelope<TSuggestion>(null, result.message),
    message: result.message,
  }));
}

function productSurfaceForFeature(feature: AiFeatureKey) {
  if (feature.startsWith("ngo.")) return "ngo";
  if (feature.startsWith("shopping.")) return "shopping";
  if (feature.startsWith("support.")) return "support";
  return "platform";
}

function mapAiAttemptToLedgerStatus(status: AiAttemptStatus) {
  if (status === "cache_hit" || status === "allowed") return "completed";
  if (status === "failed") return "failed";
  if (status === "blocked" || status === "over_budget" || status === "unavailable") {
    return "canceled";
  }
  return "queued";
}

function stableJson(value: unknown): string {
  if (typeof value === "undefined") {
    return '"__undefined__"';
  }

  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
    .join(",")}}`;
}
