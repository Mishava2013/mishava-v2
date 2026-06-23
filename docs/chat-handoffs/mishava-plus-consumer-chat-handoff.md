# Mishava Plus / Consumer Accounts Chat Handoff

Date: 2026-06-23

## Current Status

Plus/consumer account value is early. Shopping Priorities exist, but saved products, alerts, following, comparison tools, and household profiles are planned only.

## Percent Estimate

- Plus/consumer foundation: **18-22%**.

## What Is Built

- Shopping Priorities route.
- Account requirement for saved preferences.
- Values Match guardrails.
- Public browsing without login.

## What Is Live

- Shopping Priorities path exists behind auth.
- Shopping preview can be browsed publicly.

## What Is Planned Only

- Saved products.
- Watchlists/following.
- Alerts.
- Comparison tools.
- Household/family needs.
- Privacy controls.
- Paid Plus subscription.

## What Is Blocked

- Values Match needs reviewed evidence.
- Plus monetization should wait.
- Privacy controls need planning before sensitive preference expansion.

## What Must Not Be Touched

- Medical claims.
- Final scores.
- Checkout/subscriptions unless scoped.
- Old Supabase and `dsuupr-am`.

## Key Guardrails

- No medical suitability claims.
- No fake personalized scores.
- Payment cannot improve ranking/trust.
- Personal priorities do not change base Evidence Score.

## Recommended First 3 Tasks

1. Audit Shopping Priorities for first-user clarity.
2. Plan saved products/watchlist.
3. Plan privacy controls for consumer preferences.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`
- `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`

## Suggested Opening Message

```text
We are starting the Mishava Plus/Consumer focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-plus-consumer-chat-handoff.md as source of truth. Focus on saved preferences, saved products, alerts, comparisons, and privacy controls. Do not build medical claims, final scores, paid ranking, checkout, or fake values matches.
```

