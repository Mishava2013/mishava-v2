# Mishava Research + Evidence Operations New-Chat Brief

Date: 2026-06-23

## Current Status

Mishava Research + Evidence Operations has a useful foundation but is not yet a complete operations system.

Current estimate: **54-59% foundation complete**.

Built:

- Core evidence records.
- Structured claims.
- Shopping source metadata.
- Shopping evidence cards.
- Supplier/manufacturer transparency for toilet paper.
- Shopping research task status model.
- NGO evidence/file/report foundations.
- AI-control guardrails with provider calls disabled.

Missing:

- Product-not-found research queue.
- Source review queue UI.
- Claim template registry.
- Stale/conflicting source workflow.
- Reviewer assignment/history.
- Final scoring support.

## What The New Chat Should Focus On

The new chat should focus on:

- Product-not-found requests.
- Source review workflow.
- Research task statuses.
- Evidence gap visibility.
- Human-reviewed claims.
- Reusable source metadata.
- Review queues and operational controls.

## What The New Chat Should Not Touch

Do not touch:

- Final scoring.
- AI provider calls.
- Autonomous crawler/scraping.
- Checkout, Plus, Local inventory, Business/Gov/Corporate expansion unless explicitly scoped.
- Affiliate/referral/commission logic.
- Fake products, sources, claims, suppliers, manufacturers, evidence, images, or scores.
- DNS/domains/Vercel/Supabase settings.
- `dsuupr-am`.
- Old Supabase.

## Percent Estimates

- Overall research/evidence operations: **54-59%**
- Shopping research task readiness: **55-65%**
- Product-not-found queue: **10-20%**
- Source metadata readiness: **65-75%**
- Claim template readiness: **20-30%**
- Human review workflow: **35-45%**
- Evidence gap visibility: **70-78%**
- Supplier/manufacturer evidence readiness: **65-75% for toilet paper**, **45-55% platform-wide**
- NGO evidence operations: **70-80% for supported pilot**
- AI-assisted research readiness: **25-35%**
- Admin/review queue readiness: **20-30%**

## First Recommended Task

**Plan Mishava Research + Evidence Slice 1: Product-Not-Found Research Queue and Source Review Workflow.**

Why:

- Shopping Slice 14 needs a safe way for users to search/request products without creating fake records.
- Research tasks already exist internally, so this is the natural bridge from foundation to usable operations.
- It keeps final scoring blocked until reviewed evidence and methodology are ready.

## Key Guardrails

- No fake evidence.
- No fake sources.
- No fake claims.
- No fake products.
- No fake suppliers or manufacturers.
- No copied outside scores as Mishava Scores.
- No final score before reviewed evidence and approved scoring logic.
- No paid ranking or commission-driven ordering.
- No medical claims.
- No AI final trust outcomes.
- AI can suggest only after future approval; humans decide.
- Missing evidence remains visible.
- Mishava is not the store.
- Payment cannot influence trust outcomes.

## Key Docs

- `docs/chat-handoffs/mishava-research-evidence-deep-current-state-audit.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/chat-handoffs/mishava-research-evidence-chat-handoff.md`
- `docs/chat-handoffs/mishava-shopping-chat-handoff.md`
- `docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/operations/ngo-file-review-and-upload-safety-runbook.md`
- `docs/mishava-ai-minimize-architecture-direction.md`
- `docs/mishava-ai-control-foundation-result.md`

## Suggested Opening Message For New Chat

```text
We are starting a focused Mishava Research + Evidence Operations chat.

Use docs/chat-handoffs/mishava-research-evidence-deep-current-state-audit.md and docs/chat-handoffs/mishava-research-evidence-new-chat-brief.md as source of truth.

Focus on product-not-found requests, source review, research tasks, evidence gaps, human-reviewed claims, and operational workflow.

Do not build final scores, AI provider calls, autonomous crawling/scraping, checkout, affiliate/commission logic, fake data, DNS/Vercel/Supabase changes, dsuupr-am work, or old Supabase work.
```

## Suggested First Codex Prompt

```text
Plan Mishava Research + Evidence Slice 1: Product-Not-Found Research Queue and Source Review Workflow.

Source of truth:
- docs/chat-handoffs/mishava-research-evidence-deep-current-state-audit.md
- docs/chat-handoffs/mishava-research-evidence-new-chat-brief.md
- docs/mishava-v2-current-state-category-review.md
- docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md
- docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md

Scope:
Research/evidence operations planning only.

Do not implement code yet.
Do not add products.
Do not add migrations.
Do not add final scoring.
Do not add AI provider calls.
Do not build crawler/scraping.
Do not create fake products, fake sources, fake claims, fake evidence, fake suppliers, fake manufacturers, fake scores, or fake images.
Do not change DNS/domains/Vercel/Supabase/Stripe/payment.
Do not touch dsuupr-am.
Do not touch old Supabase.

Plan:
1. Product-not-found user flow.
2. Minimum request fields.
3. Research task creation and statuses.
4. Source review workflow.
5. Claim/source/gap relationship.
6. Human review roles and audit trail.
7. User-facing labels.
8. Tests and acceptance criteria.

Commit only the planning document.
```

## Ready For Focused Chat?

Yes. Research + Evidence Operations is ready for a focused planning/build chat, as long as the next work stays on product-not-found and source-review operations rather than final scoring or AI automation.
