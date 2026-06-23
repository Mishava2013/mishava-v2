# Mishava Shopping Chat Handoff

Date: 2026-06-23

## Current Status

Mishava Shopping is live on the clean Vercel project at `https://shopping.mishava.org`. It is ready for a guided preview, especially for toilet paper, but it is not broad public beta. The next step is product lookup/search and a research-request path, not final scoring.

## Percent Estimate

- Guided preview readiness: **82-86%**.
- Broad public beta readiness: **42-48%**.

## What Is Built

- Live Shopping landing.
- Baby diapers/wipes POC category.
- Toilet paper POC category.
- Costco/Kirkland, Cashmere, Purex coverage.
- Supplier/manufacturer transparency.
- Evidence cards on toilet paper product detail pages.
- Shopping Priorities account path.
- Plain-language senior-friendly copy.
- Score pending / evidence gap language.
- No paid ranking/no commission guardrails.

## What Is Live

- `https://shopping.mishava.org`
- `/shopping`
- `/shopping/categories/toilet-paper`
- Kirkland, Cashmere, Purex detail pages.

## What Is Planned Only

- Product lookup/search over existing records.
- Product-not-found research request.
- Preliminary evidence/match state.
- Product/source admin workflow.
- Final scoring.
- Checkout/Plus.

## What Is Blocked

- Final scores need reviewed claims and scoring methodology.
- Values Match needs priorities plus reviewed evidence.
- Product images need rights-cleared strategy before using real photos.
- Research ops remain manual.

## What Must Not Be Touched

- NGO auth/onboarding unless specifically scoped.
- `dsuupr-am`.
- Old Supabase.
- DNS/domains.
- AI provider behavior.

## Key Guardrails

- No fake products, sellers, evidence, sources, scores, suppliers, or images.
- No medical claims.
- No affiliate/commission ranking.
- Payment cannot affect ranking, evidence, trust, or visibility.
- Outside scorecards are evidence references only.

## Recommended First 3 Tasks

1. Implement Slice 14 product lookup/search and product-not-found research request.
2. Add a report-problem / correction path for Shopping product data.
3. Add minimal source-review admin workflow.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`
- `docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md`
- `docs/release-4-slice-12c-live-first-user-evidence-post-deploy-verification-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`

## Suggested Opening Message

```text
We are starting the Mishava Shopping focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-shopping-chat-handoff.md as source of truth. Focus on live Shopping next steps, especially Slice 14 product lookup/search and research-request flow. Do not add final scores, checkout, Plus, affiliate/commission logic, medical claims, fake data, DNS changes, dsuupr-am work, or old Supabase work.
```

