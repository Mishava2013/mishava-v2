# Mishava AI Control Foundation Result

Date: June 23, 2026

Source of truth:

- `docs/mishava-ai-minimize-architecture-direction.md`
- `docs/mishava-ai-minimize-conflict-audit.md`

## What Changed

Added a central AI control foundation so future Mishava AI work has to pass through one safety layer before any provider integration is considered.

New module:

- `src/lib/ai-control.ts`

New test file:

- `scripts/ai-control-foundation.test.mjs`

Updated documentation:

- `docs/mishava-ai-minimize-architecture-direction.md`

## Control Layer Behavior

The new wrapper is deny-by-default. All configured AI features are disabled unless explicitly allowed by feature-level configuration.

Current feature keys:

- `ngo.evidence_parsing`
- `ngo.report_reviewer_notes`
- `shopping.product_research`
- `shopping.supplier_document_parse`
- `support.triage_summary`

No real AI provider integration was added. The control layer contains no OpenAI, Anthropic, or other provider SDK call. It also does not make provider `fetch` calls.

## Suggestion-Only Output

The wrapper returns typed suggestion-only envelopes:

- `reviewStatus: "suggestion_only"`
- `requiresHumanReview: true`
- `canAffectTrustOutcome: false`
- `canAffectScore: false`
- `canAffectRanking: false`

This keeps future AI outputs separated from verified facts, scores, rankings, publishing, and approval workflows.

## Forbidden Outcomes

The guardrail layer explicitly blocks AI from affecting:

- scores
- rankings
- verification
- trust badges
- publishing
- supplier approval
- seller approval
- NGO escalation
- payment/access decisions
- legal/compliance conclusions

## Budget, Cache, and Logging Hooks

The foundation includes structure for:

- organization monthly budget checks
- user monthly budget checks
- environment monthly budget checks
- stable content hashes
- cache lookup before the future provider point
- usage logging to `ai_usage_ledger` when a Supabase server client is supplied
- statuses for allowed, blocked, failed, cache-hit, unavailable, and over-budget AI attempts

The current layer does not yet calculate live month-to-date usage from Supabase. It accepts a budget snapshot so future callers can supply the relevant totals before a provider call is allowed.

## Fallback Behavior

When AI is disabled, blocked, unavailable, or over budget, the wrapper returns a clear fallback message and does not block the manual workflow:

> AI suggestions are unavailable right now, but you can continue using Mishava's structured review workflow. Your work can still be reviewed manually.

## Tests Added

The new guardrail tests verify:

- a central AI control module exists
- no real provider integration exists
- feature controls default to disabled
- AI outputs are suggestion-only
- forbidden trust/access outcomes are blocked
- budget checks happen before the future provider point
- cache checks happen before the future provider point
- usage logging is structured for all attempt statuses
- fallback language preserves manual review

## Remaining Gaps

Before enabling any real AI provider, Mishava still needs:

- live budget snapshot retrieval from Supabase
- persistent AI cache storage
- provider adapter implementation behind the wrapper
- migration support if richer logging fields are needed beyond the existing `ai_usage_ledger` schema

Provider-import enforcement was added in the follow-up
`docs/mishava-ai-control-enforcement-result.md`, which documents the direct
provider import guard and the approved future adapter path.

## Confirmation

- No real AI provider calls were added.
- No product UI was changed to call AI.
- No AI scoring, ranking, verification, trust badge, publishing, supplier approval, seller approval, NGO escalation, payment/access, legal, or compliance conclusion behavior was added.
- AI remains suggestion-only and human-review-required.
