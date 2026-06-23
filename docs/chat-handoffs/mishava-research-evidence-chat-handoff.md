# Mishava Research And Evidence Operations Chat Handoff

Date: 2026-06-23

## Current Status

Research/evidence operations have a good model foundation but limited operations tooling. Shopping research tasks, source hierarchy, supplier transparency, and evidence cards exist. The next work is product lookup, research requests, and source-review queues.

## Percent Estimate

- Research/data ops foundation: **50-55%**.

## What Is Built

- Research task status model.
- Supplier/manufacturer transparency fields.
- Source hierarchy planning.
- Evidence source cards.
- Product/company/private-label/manufacturer/supplier/retailer separation.
- Human-review guardrails.

## What Is Live

- Toilet paper product pages show source-backed evidence cards.
- Supplier/manufacturer unknowns appear as gaps.

## What Is Planned Only

- Product-not-found research requests.
- Source review admin UI.
- Research task queue UI.
- Stale source review cadence.
- AI-assisted source suggestions behind control layer.

## What Is Blocked

- No full research admin workflow.
- No approved AI provider adapter.
- No autonomous crawler or scraping.

## What Must Not Be Touched

- Final scoring.
- AI provider calls.
- Checkout/affiliate logic.
- Old Supabase and `dsuupr-am`.

## Key Guardrails

- No fake sources or claims.
- Source URL and review status required.
- Research tasks do not become verified facts.
- AI suggestions cannot verify claims.
- Outside scores are references only.

## Recommended First 3 Tasks

1. Add product lookup/search over existing records.
2. Add product-not-found research request.
3. Add minimal internal source-review queue.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md`
- `docs/mishava-ai-minimize-architecture-direction.md`

## Suggested Opening Message

```text
We are starting the Mishava Research + Evidence Operations focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-research-evidence-chat-handoff.md as source of truth. Focus on source review, research tasks, evidence gaps, product lookup, and human-reviewed claims. Do not build AI providers, autonomous scraping, final scores, fake evidence, or paid ranking.
```

