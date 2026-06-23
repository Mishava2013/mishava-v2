import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("central AI control module exists and does not integrate a provider", () => {
  const control = read("src/lib/ai-control.ts");

  assert.match(control, /export async function requestControlledAiSuggestion/);
  assert.match(control, /export function stableAiContentHash/);
  assert.match(control, /export async function logAiUsageAttempt/);
  assert.match(control, /Provider calls intentionally do not exist yet/);
  assert.doesNotMatch(control, /from ["']openai["']/i);
  assert.doesNotMatch(control, /from ["']@anthropic/i);
  assert.doesNotMatch(control, /fetch\(["'`](https:\/\/api\.openai|https:\/\/api\.anthropic)/i);
});

test("AI feature controls are deny-by-default", () => {
  const control = read("src/lib/ai-control.ts");

  const features = [
    "ngo.evidence_parsing",
    "ngo.report_reviewer_notes",
    "shopping.product_research",
    "shopping.supplier_document_parse",
    "support.triage_summary",
  ];

  for (const feature of features) {
    assert.match(control, new RegExp(`"${feature}": \\{\\s*enabled: false`, "s"));
  }

  assert.match(control, /featureConfig\?: Partial<Record<AiFeatureKey, AiFeatureControl>>/);
});

test("AI suggestions are typed as suggestion-only and require human review", () => {
  const control = read("src/lib/ai-control.ts");

  assert.match(control, /export type AiReviewStatus = "suggestion_only"/);
  assert.match(control, /requiresHumanReview: true/);
  assert.match(control, /canAffectTrustOutcome: false/);
  assert.match(control, /canAffectScore: false/);
  assert.match(control, /canAffectRanking: false/);
});

test("AI control blocks every forbidden trust and access outcome", () => {
  const control = read("src/lib/ai-control.ts");

  const forbiddenOutcomes = [
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

  for (const outcome of forbiddenOutcomes) {
    assert.match(control, new RegExp(`"${outcome}"`));
  }

  assert.match(control, /requestedOutcome\?: AiForbiddenOutcome/);
  assert.match(control, /AI_FORBIDDEN_OUTCOMES\.has\(request\.requestedOutcome\)/);
  assert.match(control, /export function assertAiCannotAffectOutcome/);
});

test("AI control evaluates budgets before any provider point", () => {
  const control = read("src/lib/ai-control.ts");

  assert.match(control, /export type AiBudgetSnapshot/);
  assert.match(control, /organizationMonthlyLimitCents/);
  assert.match(control, /userMonthlyLimitCents/);
  assert.match(control, /environmentLimitCents/);
  assert.match(control, /export function evaluateAiBudget/);
  assert.match(control, /status: "over_budget"/);
  assert.match(control, /Provider calls intentionally do not exist yet/);

  const budgetIndex = control.indexOf("const budgetResult = evaluateAiBudget");
  const providerIndex = control.indexOf("Provider calls intentionally do not exist yet");
  assert.ok(budgetIndex > -1, "budget check should exist");
  assert.ok(providerIndex > -1, "provider-disabled marker should exist");
  assert.ok(budgetIndex < providerIndex, "budget check must happen before provider point");
});

test("AI control checks cache before any provider point and logs cache hits", () => {
  const control = read("src/lib/ai-control.ts");

  assert.match(control, /export type AiSuggestionCache/);
  assert.match(control, /const cachedSuggestion = await request\.cache\?\.get\(contentHash\)/);
  assert.match(control, /status: "cache_hit"/);
  assert.match(control, /modelName: "cache"/);

  const cacheIndex = control.indexOf("const cachedSuggestion = await request.cache?.get");
  const providerIndex = control.indexOf("Provider calls intentionally do not exist yet");
  assert.ok(cacheIndex > -1, "cache check should exist");
  assert.ok(providerIndex > -1, "provider-disabled marker should exist");
  assert.ok(cacheIndex < providerIndex, "cache check must happen before provider point");
});

test("AI usage logging covers allowed, blocked, failed, unavailable, over-budget, and cache-hit statuses", () => {
  const control = read("src/lib/ai-control.ts");

  for (const status of [
    "allowed",
    "blocked",
    "cache_hit",
    "failed",
    "unavailable",
    "over_budget",
  ]) {
    assert.match(control, new RegExp(`"${status}"`));
  }

  assert.match(control, /client\.insert\("ai_usage_ledger"/);
  assert.match(control, /organization_id: input\.organizationId \?\? null/);
  assert.match(control, /actor_user_id: input\.userId \?\? null/);
  assert.match(control, /product_surface: input\.productSurface/);
  assert.match(control, /workflow: input\.workflow/);
  assert.match(control, /estimated_cost_cents: input\.estimatedCostCents \?\? 0/);
  assert.match(control, /model_name: input\.modelName \?\? "none"/);
  assert.match(control, /prompt_version: input\.promptVersion \?\? "unknown"/);
});

test("AI fallback preserves manual workflow when AI is disabled or unavailable", () => {
  const control = read("src/lib/ai-control.ts");

  assert.match(control, /AI suggestions are unavailable right now/);
  assert.match(control, /structured review workflow/);
  assert.match(control, /reviewed manually/);
  assert.match(control, /status: "unavailable"/);
});

test("AI minimize docs describe the wrapper and future-provider gate", () => {
  const direction = read("docs/mishava-ai-minimize-architecture-direction.md");
  const result = read("docs/mishava-ai-control-foundation-result.md");

  assert.match(direction, /central AI service wrapper/i);
  assert.match(direction, /Feature flags default to denied/i);
  assert.match(result, /No real AI provider integration was added/);
  assert.match(result, /deny-by-default/);
  assert.match(result, /suggestion-only/);
  assert.match(result, /budget/);
  assert.match(result, /cache/);
  assert.match(result, /usage logging/);
});
