# Mishava Scoring And Trust Chat Handoff

Date: 2026-06-23

## Current Status

Mishava has scoring foundations, but no final public Mishava Scores for Shopping. Score-pending behavior is intentional. The next scoring work should define reviewed structured claims and a non-final Evidence Score Preview rubric.

## Percent Estimate

- Scoring/trust foundation: **48-53%**.

## What Is Built

- Score snapshot foundations.
- Structured claim workflow.
- Draft/rejected claims excluded from trust summaries.
- Payment firewall tests.
- Score pending display.
- Values Match eligibility guardrails.

## What Is Live

- Shopping pages show pending/evidence-preview language.
- NGO report previews avoid fake final scores.
- No paid trust outcomes language is visible.

## What Is Planned Only

- Category-specific scoring models.
- Final Mishava Scores.
- Numeric Personal Values Match.
- Coverage/recency/confidence rubric.
- Public methodology versioning pages for each category.

## What Is Blocked

- Reviewed structured claims are needed.
- Category scoring model approval is needed.
- Public correction/appeal process needs stronger workflow.

## What Must Not Be Touched

- Payment firewall.
- AI final-outcome restrictions.
- Shopping product expansion unless scoring task explicitly needs examples.
- Old Supabase and `dsuupr-am`.

## Key Guardrails

- No fake scores.
- No outside score copied as Mishava Score.
- No AI final scoring.
- No payment, affiliate, commission, sponsorship, plan, or billing influence.
- Missing evidence remains visible.

## Recommended First 3 Tasks

1. Define toilet paper structured claim template.
2. Draft Evidence Score Preview rubric.
3. Add tests proving preview state cannot publish final scores.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md`

## Suggested Opening Message

```text
We are starting the Mishava Scoring + Trust Methodology focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-scoring-trust-chat-handoff.md as source of truth. Focus on reviewed claims, score preview rules, coverage/recency/confidence, and versioned methodology. Do not create final public scores, AI scoring, paid ranking, fake evidence, or medical claims.
```

