# Release 4 Slice 1 Result: Shopping POC Real-Data Readiness

Status: implemented and live migration applied to the clean Mishava V2 Supabase project.

Source context:

- `docs/release-4-slice-1-shopping-poc-real-data-plan.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-2-5-live-verification-result.md`

## Scope Implemented

Release 4 Slice 1 keeps Shopping narrow and real-data-only. The first proof-of-concept category is baby products, including diapers and wipes.

Implemented:

- Shopping storefront now defaults the POC shelf to `baby-products` when no search query is present.
- Shopping category routes for baby products, diapers, and wipes clearly state that only real records are shown.
- Product cards use safe trust labels:
  - `Evidence Score` only when a published score snapshot exists.
  - `Draft trust context` when a snapshot exists but is not a public score.
  - `Score pending` when no reviewed scoring data exists.
- Product detail pages show product, brand/seller context, category, source/review status, places to buy, evidence/trust status, and the no-paid-ranking explanation.
- Places-to-buy display supports seller name, external URL, price when known, availability, source freshness, pickup, delivery, and fulfillment notes.
- Places-to-buy ordering uses availability, then price, then seller name.
- Shopping helpers do not use commission, affiliate, sponsorship, paid placement, subscription, hosted profile, or claimed profile inputs for ordering.

Not implemented:

- Full Shopping.
- Local inventory.
- Checkout.
- Affiliate/referral/commission logic.
- Plus monetization.
- AI scoring.
- Business, Local, Gov, Corporate, or additional product surfaces.

## Database / Migration

Migration applied:

- `202605240009_release_4_slice_1_shopping_real_data.sql`

Clean project:

- Name: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Old project not modified:

- `mishava / tghbfautnxblfxrtkdqb`

Migration changes:

- Added source/review metadata to `shopping_products`:
  - `source_name`
  - `source_url`
  - `source_captured_at`
  - `source_review_status`
  - `data_origin`
  - `reviewed_by`
  - `reviewed_at`
- Added source/review metadata to `shopping_places_to_buy`:
  - `source_url`
  - `source_captured_at`
  - `source_review_status`
  - `reviewed_by`
  - `reviewed_at`
- Added constraints requiring active shopping products to have approved real source metadata.
- Added constraints requiring active places to buy to have approved real source metadata.
- Added no product, seller, evidence, score, price, or availability seed data.

## Real Data Status

No real product records were added in this slice.

The app currently shows real-data-only empty states when no approved baby product records exist. This is intentional. Mishava should not show placeholder diapers, wipes, places to buy, evidence, prices, or score values as if they were real.

## Live Checks Performed

Live migration status:

- Migrations `202605240001` through `202605240009` are applied remotely on `mishava-v2-dev`.

Live constraint check:

- Attempted to insert an active `shopping_products` row without approved source metadata.
- Result: rejected with Postgres check constraint `shopping_products_active_requires_real_source`.

Live read check:

- Queried active `baby-products` shopping records.
- Result: `[]`
- Queried places-to-buy source metadata fields.
- Result: `[]`

This confirms the new fields are present and the active-record source guardrail is live.

## Tests Run

- `npm test`
- `npm run lint`
- `npm run build`

Test coverage added or updated:

- Shopping results read from the database and do not use placeholder product data.
- Product detail pages read places to buy from the database.
- Shopping schema still requires a score snapshot before public score values.
- Shopping migration does not seed fake products or places to buy.
- Active shopping records require real source metadata.
- Products without real scoring data show pending/draft trust context instead of invented scores.
- Places-to-buy sorting excludes commission, affiliate, sponsorship, and paid placement.
- Payment firewall tests from Release 3 still pass.

## Known Limitations

- There is no product ingestion/admin workflow yet.
- There is no real baby product data set yet.
- There is no full public scoring UI.
- There is no Shopping Priorities overlay in product ordering yet.
- `Your Values Score` remains withheld until valid Shopping Priorities are implemented.
- There is no local inventory or local delivery workflow.
- There is no checkout or payment flow.
- There is no affiliate/referral/commission model.
- Product image sourcing and rights handling still need a policy-backed workflow.
- Score display depends on published score snapshots; no invented score fallback exists.

## Remaining Shopping Readiness Work

Recommended next work:

1. Define the real product ingestion/review workflow for baby products.
2. Add admin-safe creation/editing for reviewed shopping products and places to buy.
3. Add source capture notes and reviewer audit events for product and place review.
4. Add a tiny real baby-products data set only after sources, rights, and review rules are approved.
5. Add product-to-business linkage when Business profiles are ready.
6. Add Shopping Priorities ordering only after the questionnaire and preference model are locked.

## Final Confirmation

Release 4 Slice 1 did not add fake products, fake stores, fake evidence, fake scores, commissions, affiliate logic, checkout, Plus, Local, Business, Gov, or Corporate work.

Shopping remains honest: if Mishava does not yet have reviewed evidence and real records, it says so.
