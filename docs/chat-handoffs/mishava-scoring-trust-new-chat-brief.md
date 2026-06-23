# Mishava Scoring + Trust New-Chat Brief

Date: 2026-06-23

## Purpose

This brief starts a focused Mishava Scoring + Trust chat. Use it with:

- `docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/chat-handoffs/mishava-shopping-chat-handoff.md`
- `docs/chat-handoffs/mishava-research-evidence-chat-handoff.md`

## Current State

Mishava has a scoring/trust foundation, but final public scores are not ready.

Current estimate: **50-55% scoring/trust foundation complete**.

What is built:

- Evidence items.
- Structured claims.
- Scoring versions.
- Private draft score snapshots.
- Score-pending Shopping UI.
- Toilet paper evidence dimensions.
- Supplier/manufacturer transparency.
- Shopping Priorities setup.
- Payment firewall.
- AI-control wrapper and provider import guard.

What is not built:

- Final Mishava Scores.
- Final toilet paper scoring methodology.
- Numeric Personal Values Match.
- Public category methodology page.
- Source/claim review admin queue.
- Correction/appeal workflow tied to score publication.

## Core Rule

Mishava must score from reviewed evidence, not ads, payment, AI guesses, or outside score copying.

Payment, affiliate, commission, sponsorship, plan status, hosted profiles, Stripe status, or business relationships must not affect:

- score
- ranking
- verification
- trust badge
- publishing
- supplier approval
- seller approval
- NGO escalation
- payment/access decisions
- legal/compliance conclusions

AI is suggestion-only and human-review-required. No AI provider calls are currently enabled.

## Recommended First Task

**Plan Mishava Scoring + Trust Slice 1: Toilet Paper Structured Claim Template and Preliminary Evidence Match Rules.**

Why this is first:

- Toilet paper is the current live guided-preview category.
- It already has real products, source metadata, supplier transparency, and evidence cards.
- Users need a more useful explanation than only `Score pending`.
- Final Mishava Scores would be premature.

## First Slice Goal

Create a safe plan for a non-final preliminary evidence match layer.

The user should be able to understand:

- what Mishava found
- what Mishava still needs
- why a score is pending
- which evidence supports which claim
- which evidence does not prove enough yet
- why outside scorecards are references only
- why manufacturer/supplier uncertainty matters
- why this is not medical advice

## Required Claim Areas For Toilet Paper

- Product identity.
- Brand.
- Private-label owner, if applicable.
- Parent company.
- Manufacturer.
- Supplier.
- Retailer/place-to-buy source.
- Recycled content.
- Post-consumer recycled content.
- Bamboo/tree-free/FSC claims.
- Virgin fiber reliance.
- Bleaching/process claims.
- Fragrance/free-from/comfort claims, only if source-supported.
- Packaging claims.
- Source freshness.
- Third-party tissue scorecard references as context only.

## Safe User-Facing Labels

Use:

- `Mishava is still reviewing this`
- `What Mishava found`
- `What Mishava still needs`
- `Score not ready yet`
- `Evidence gap`
- `Outside reference only`
- `Some reviewed evidence`
- `Not enough reviewed evidence`

Avoid:

- final Mishava Score
- certified score
- verified product, unless a specific review workflow supports it
- best for Crohn's
- safe for Crohn's
- non-irritating
- medically recommended
- guaranteed safe

## Data/Code Areas To Review First

- `src/lib/scoring.ts`
- `src/lib/scoring-workflows.ts`
- `src/lib/shopping.ts`
- `src/lib/ai-control.ts`
- `src/app/shopping/products/[slug]/page.tsx`
- `src/app/shopping/categories/[slug]/page.tsx`
- `scripts/payment-firewall.test.mjs`
- `scripts/ai-control-foundation.test.mjs`
- `scripts/ai-provider-import-guard.test.mjs`
- `scripts/release-4-shopping.test.mjs`
- `supabase/migrations/202605240001_foundation.sql`
- `supabase/migrations/202605240003_scoring_guardrails.sql`
- `supabase/migrations/202605240007_release_3_slice_2_scoring_pipeline.sql`
- `supabase/migrations/202605260007_release_4_slice_6_toilet_paper_evidence_readiness.sql`
- `supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql`
- `supabase/migrations/202605260009_release_4_slice_7_shopping_research_tasks.sql`

## Verification Baseline

Latest audit checks:

- `npm test`: passed, **176/176**
- Scoring/payment/AI/Shopping subset: passed, **45/45**
- `supabase migration list --linked`: passed/aligned
- `npm run build`: passed

Known local caveats:

- Standalone `npm run typecheck` can fail before build-generated Next route types exist.
- `npm run lint` currently fails locally because the Next ESLint plugin cannot resolve `fast-glob`.
- Treat those as tooling issues, not scoring/trust product failures, unless they recur after dependency refresh.

## Suggested Opening Prompt

```text
Plan Mishava Scoring + Trust Slice 1: Toilet Paper Structured Claim Template and Preliminary Evidence Match Rules.

Use docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md and docs/chat-handoffs/mishava-scoring-trust-new-chat-brief.md as source of truth.

Scope:
Toilet paper scoring/trust planning only.

Do not implement final Mishava Scores.
Do not add AI provider calls.
Do not add product features outside scoring/trust planning.
Do not add checkout, Plus, Local inventory, Business/Gov/Corporate, crawler/scraping, affiliate/referral/commission logic, fake scores, fake evidence, fake suppliers, fake manufacturers, fake images, or medical claims.
Do not copy outside scorecards as Mishava Scores.
Do not allow payment to affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, report conclusions, supplier approval, seller approval, NGO escalation, payment/access decisions, or legal/compliance conclusions.

Plan:
1. Toilet paper structured claim template.
2. Reviewed-only preliminary evidence match rules.
3. Coverage/recency/confidence labels.
4. Source hierarchy.
5. Product/brand/parent/manufacturer/supplier/retailer evidence separation.
6. Shopping Priorities mapping without fake values scores.
7. Plain-language user-facing score-pending/preview language.
8. Tests.
9. Acceptance criteria.

Commit only the planning document.
```

## Ready For New Chat?

Yes. The audit is complete enough to start a focused Scoring + Trust chat. The next chat should avoid broad product expansion and stay tightly scoped to the first reviewed, non-final toilet paper evidence match plan.
