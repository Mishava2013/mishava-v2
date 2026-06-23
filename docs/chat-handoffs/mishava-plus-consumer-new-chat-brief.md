# Mishava Plus / Consumer Accounts New-Chat Brief

Date: June 23, 2026

## Short Current Status

Mishava Plus / Consumer Accounts is early. Shopping account creation, sign-in popup routing, and Shopping Priorities exist, but the actual Plus value layer is mostly not built yet.

Current estimate: **22-28% overall readiness**.

Shopping itself can be previewed, but Plus/Consumer is not ready as a standalone pilot or paid product.

## Percent Estimates

- Overall Plus/Consumer readiness: **22-28%**
- Consumer account readiness: **45-55%**
- Shopping Priorities readiness: **58-68%**
- Saved products/watchlist readiness: **8-14%**
- Product/company following readiness: **4-10%**
- Alerts/notifications readiness: **3-8%**
- Personal Values Match readiness: **18-28%**
- Family/household preference readiness: **0-5%**
- Privacy controls readiness: **18-25%**
- Paid Plus readiness: **3-8%**
- Payment firewall readiness: **85-92%**
- Public launch readiness: **10-16%**

## What The New Chat Should Focus On

First focus: **Saved Products / Watchlist and Consumer Account Privacy Flow**.

Why:

- It gives a signed-in shopper a useful reason to create an account.
- It is safer than paid Plus.
- It does not require final scores.
- It can preserve score-pending honesty.
- It creates the foundation for alerts later.

## What The New Chat Should Not Touch

- Paid Plus billing.
- Checkout.
- Final Mishava Scores.
- Final Values Match numbers.
- Medical/care recommendations.
- AI provider calls.
- Affiliate/referral/commission logic.
- Product ranking changes.
- NGO/Business/Gov/Corporate workflows.
- DNS/domains/Vercel/Supabase settings.
- `dsuupr-am`.
- Old Supabase.

## First Recommended Task

**Plan Saved Products / Watchlist and Consumer Account Privacy Flow**

The output should be a planning document only. Implementation should wait until the saved-item data model, RLS, privacy rules, and UI copy are clear.

## Key Guardrails

- No paid ranking.
- No paid trust outcomes.
- No fake scores.
- No fake evidence.
- No final values match without reviewed evidence and approved methodology.
- No medical claims.
- No AI final trust outcomes.
- No affiliate/commission-driven ranking.
- Consumer preferences and saved items remain private unless explicitly shared.
- Missing evidence remains visible.
- Mishava is not the store.
- Payment/Plus cannot affect scores, rankings, evidence, verification, credibility labels, or trust outputs.

## Key Docs

- `docs/chat-handoffs/mishava-plus-consumer-deep-current-state-audit.md`
- `docs/chat-handoffs/mishava-plus-consumer-chat-handoff.md`
- `docs/chat-handoffs/mishava-shopping-chat-handoff.md`
- `docs/chat-handoffs/mishava-scoring-trust-chat-handoff.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`
- `docs/mishava-ai-minimize-architecture-direction.md`

## Suggested Opening Message For A New ChatGPT Chat

```text
We are starting a focused Mishava Plus / Consumer Accounts chat.

Use docs/chat-handoffs/mishava-plus-consumer-deep-current-state-audit.md and docs/chat-handoffs/mishava-plus-consumer-new-chat-brief.md as source of truth.

Mishava Shopping is live, and Shopping Priorities exist, but saved products, watchlists, follows, alerts, family profiles, and paid Plus are not built yet.

Focus first on saved products/watchlist and consumer privacy. Do not build paid Plus, checkout, final scores, final Values Match, medical claims, AI provider calls, affiliate/commission logic, or ranking changes.
```

## Suggested First Codex Prompt

```text
Plan Saved Products / Watchlist and Consumer Account Privacy Flow.

Use:
- docs/chat-handoffs/mishava-plus-consumer-deep-current-state-audit.md
- docs/chat-handoffs/mishava-plus-consumer-new-chat-brief.md
- docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md
- docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md
- docs/mishava-v2-current-state-category-review.md

Do not implement yet.

Goal:
Plan the first real Mishava Plus / Consumer account value after Shopping Priorities: saved products/watchlist with privacy controls.

Scope:
- save product
- unsave product
- view saved products
- allow score-pending products to be saved
- keep saved products private
- define RLS policies
- show evidence/score status changes safely
- prepare for future alerts without implementing alerts
- ensure payment/Plus cannot affect ranking, scores, evidence, or trust labels

Do not build paid Plus, checkout, alerts, family profiles, medical claims, AI personalization, final Values Match, affiliate logic, or scoring changes.

Output:
- implementation plan
- data model proposal
- UI flow
- privacy/RLS rules
- tests
- non-goals
- acceptance criteria
```

## Ready For New Focused Chat?

Yes. Plus/Consumer is ready for a focused planning chat. It is not ready for paid Plus implementation or broad consumer pilot work until saved products, privacy controls, and live auth/priorities QA are stronger.

