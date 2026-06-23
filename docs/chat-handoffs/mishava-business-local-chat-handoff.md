# Mishava Business / Local / Supplier Chat Handoff

Date: 2026-06-23

## Current Status

Business, Local, supplier, and seller surfaces are mostly planned. The existing Shopping supplier/manufacturer model gives a useful starting point, but claim flow and self-service profiles are not built.

## Percent Estimate

- Business/Local foundation: **15-20%**.

## What Is Built

- Reserved/public surfaces.
- Payment/no-paid-ranking principles.
- Supplier/manufacturer transparency concepts from Shopping.
- Product/company relationship model direction.

## What Is Live

- Basic public Business/Local pages or reserved surfaces may render.
- No full claim workflow is live.

## What Is Planned Only

- Business profiles.
- Local profiles.
- Supplier/seller profiles.
- Claim flow.
- Catalog ownership.
- Evidence submission.
- Supplier-to-seller connections.

## What Is Blocked

- Identity/ownership verification model.
- Admin review workflow.
- Evidence submission review state.

## What Must Not Be Touched

- Shopping final scores.
- Paid ranking/placement.
- Gov/Corporate claims.
- Old Supabase and `dsuupr-am`.

## Key Guardrails

- Businesses cannot buy credibility.
- Claiming a profile does not verify claims.
- Seller, retailer, brand owner, manufacturer, and supplier must remain separate.
- Evidence submissions require review status.

## Recommended First 3 Tasks

1. Plan Business/Local claim flow.
2. Define profile and ownership states.
3. Build minimal claim request foundation with no trust outcome effect.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`

## Suggested Opening Message

```text
We are starting the Mishava Business/Local/Supplier focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-business-local-chat-handoff.md as source of truth. Focus on profile claiming, supplier/seller relationships, and evidence submission. Do not build paid placement, checkout, final scoring, Gov/Corporate surfaces, fake claims, or old Supabase work.
```

