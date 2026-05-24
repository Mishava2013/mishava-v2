# Release 4 Slice 1 Shopping POC Real-Data Readiness Plan

Status: planning only. Do not implement Release 4 Slice 1 code or migrations
from this document until explicitly approved.

Source context:

- `docs/release-3-slice-3-result.md`
- `docs/release-3-scoring-foundation-plan.md`
- `docs/release-2-5-live-verification-result.md`
- Existing shopping schema: `supabase/migrations/202605240005_shopping_poc.sql`
- Existing shopping helper: `src/lib/shopping.ts`

## Goal

Release 4 Slice 1 should make Shopping ready for a real-data proof of concept.

The goal is not to make the whole internet searchable yet. The goal is to define
and then build a safe, narrow path where real products, real places to buy, and
real score/snapshot readiness can appear in Mishava Shopping without fake data,
paid placement, invented scores, affiliate/commission ranking, or public claims
that scoring is complete.

The first proof of concept should focus on a small, reviewable category such as
baby items, diapers, wipes, toys, or another simple consumer category selected
for real data availability and low operational complexity.

## 1. Existing Shopping Foundation

Already exists:

- `/shopping`
- `/shopping/products/[slug]`
- `/shopping/categories/[slug]`
- `shopping_products`
- `shopping_places_to_buy`
- `shopping_priority_profiles`
- Real-data-only empty states.
- Product score display requires `score_snapshot_id` and `score_published_at`
  when `evidence_score` is non-null.
- Public can read active products and places to buy.
- Admin/methodology roles can create shopping products.
- Shopping priorities require at least 12 answers before personalization is
  enabled.

Current limitation:

- There is no product ingestion/admin workflow.
- There is no real-data source approval process.
- There is no source/capture audit trail for product rows.
- There is no tested workflow for attaching places to buy.
- There is no tested workflow for attaching published score snapshots.
- There is no live data set for the POC.

## 2. Real Product Ingestion Readiness

Slice 1 should define a controlled ingestion path for real shopping records.

Minimum acceptable product source:

- Official brand/product page.
- Retailer product page.
- Local store supplied product listing.
- Business/seller catalog entry submitted through Mishava later.
- Publicly available product data with source URL.
- Manually reviewed product record created by Mishava admin/methodology user.

Required product fields:

- `name`
- `brand_name`, when known
- `category`
- `product_url`, when available
- `image_url`, only when rights/usage are acceptable or externally referenced
  safely
- `active`
- `created_by`
- source/capture metadata, if added in Slice 1

Recommended additional fields to consider:

- `source_name`
- `source_url`
- `source_captured_at`
- `source_review_status`: `draft`, `reviewed`, `approved`, `rejected`
- `data_origin`: `manual_admin`, `brand_page`, `retailer_page`,
  `local_store_submission`, `business_catalog`
- `reviewed_by`
- `reviewed_at`

Important:

- Do not seed fake product rows.
- Do not create placeholder product cards as real shopping results.
- Do not create invented prices, seller names, scores, or availability.
- A product may be active only when enough real source metadata exists to
  explain why it appears.

## 3. Places-To-Buy Readiness

Places to buy should connect users outward to real sellers, not make Mishava the
seller of record.

Minimum place-to-buy fields:

- `product_id`
- `seller_name`
- `seller_type`
- `url`, when available
- `price_cents`, if observed
- `currency`, if price is recorded
- `availability_status`, if observed
- `fulfillment_notes`
- `local_pickup`
- `local_delivery`
- `last_checked_at`
- `active`

Allowed seller types:

- `external_retailer`
- `brand_direct`
- `local_store`
- `mishava_hosted`

Rules:

- Places to buy must not be ranked by commission or payment.
- Mishava should not show fake availability.
- If price is unknown, display price as unavailable rather than inventing one.
- If last checked date is stale, display that clearly.
- Local stores can appear when they sell or can source the product.
- Local pickup/delivery should be explicit, not inferred.

Future local delivery note:

- Local delivery networks are out of scope for Slice 1.
- Slice 1 can preserve data fields for local pickup/delivery, but must not build
  an Uber-like delivery marketplace.

## 4. Score Display Rules

Shopping should support two labels:

- `Evidence Score` for users without completed shopping priorities.
- `Your Values Score` for users with completed shopping priorities.

Rules:

- No score appears unless real scoring data exists.
- `evidence_score` must require a linked score snapshot and publication time.
- `Your Values Score` is a user overlay, not a rewrite of the base evidence
  score.
- Score details should open on demand, not crowd the product shelf.
- If a product has no score snapshot, show pending evidence/trust context.
- Do not show public scoring claims if scoring is provisional/private/draft.

Existing schema guardrail:

```txt
shopping_products_score_requires_snapshot
```

This should remain in place.

Recommended Slice 1 check:

- Confirm live database rejects a product with `evidence_score` but no
  `score_snapshot_id` and `score_published_at`.

## 5. Ranking And Sorting Rules

Allowed shopping ranking/sorting factors:

- search match
- evidence score, only when real/published
- user preference match, only when priorities are complete
- evidence coverage
- evidence recency
- verification confidence
- category fit
- local/distance fit
- availability
- price, when user chooses price sorting
- rating, only if the rating source is real and clearly identified later

Forbidden factors:

- payment status
- subscription tier
- hosted profile status
- claimed profile status
- sponsorship
- ad spend
- paid boost
- sales commission
- affiliate/referral fee
- paid placement

Important wording:

- Avoid using "relevance" publicly if it could confuse users into thinking it is
  a trust score.
- Prefer user-facing sort labels such as:
  - Best match
  - Evidence Score
  - Your Values Score
  - Price
  - Distance
  - Availability

Internal "best match" must still exclude payment/commission.

## 6. POC Category Choice

Recommended first POC candidates:

- Baby diapers.
- Baby wipes.
- Baby lotion/wash.
- Toys with simple product identity.

Why these are good candidates:

- Easy for consumers to understand.
- Trust concerns matter to buyers.
- Product pages are usually public.
- Places to buy are easy to verify.
- They avoid complex supply-chain mapping at first.

Categories to avoid in early POC:

- Automotive.
- Electronics with complex parts/supply chains.
- Products requiring deep safety/regulatory interpretation before display.
- Any category where source data is too thin or legal claims are unusually
  sensitive.

## 7. Admin-Safe Product Entry Path

Slice 1 should plan a narrow admin-safe way to create real shopping records.

Possible first implementation:

- Admin-only form or server action.
- Product draft created from manually entered real source URL and product data.
- Product stays inactive until reviewed.
- Place-to-buy rows can be attached after product creation.
- Audit event records product creation/update.
- No public product display until `active = true`.

Required controls:

- Admin/methodology-only access.
- Source URL required for product activation unless the product is a local store
  submission with internal evidence.
- Product creation/update writes audit events.
- Score field cannot be manually invented.
- Product active state requires review metadata.

Potential table additions:

- `shopping_products.source_name`
- `shopping_products.source_url`
- `shopping_products.source_captured_at`
- `shopping_products.source_review_status`
- `shopping_products.data_origin`
- `shopping_products.reviewed_by`
- `shopping_products.reviewed_at`

Potential place-to-buy additions:

- `shopping_places_to_buy.source_url`
- `shopping_places_to_buy.source_captured_at`
- `shopping_places_to_buy.review_status`
- `shopping_places_to_buy.reviewed_by`
- `shopping_places_to_buy.reviewed_at`

## 8. Public Shopping UX Readiness

The public shopping page should feel familiar, like a modern shopping/search
experience, while remaining evidence-led.

Expected UX elements:

- Big search input.
- Department/category chips.
- Filter sidebar or filter drawer.
- Sort control.
- Product grid.
- Product card.
- Places-to-buy path.
- Score badge or score pending label.
- Score detail popover later.
- Real-data empty state when no products exist.

Product card should show:

- Product name.
- Brand/provider.
- Product image, only if real and safe to display.
- Evidence Score or Your Values Score label when available.
- Pending evidence label when score is unavailable.
- Availability/place-to-buy hint.

Product card should not show:

- Sponsored.
- Promoted.
- Featured because paid.
- Premium placement.
- Paid trust labels.

## 9. Privacy And Consumer Priority Readiness

Shopping priorities exist but need careful rules.

Rules:

- Shopping is usable without completing priorities.
- Users who complete priorities see `Your Values Score`.
- Users who do not complete priorities see `Evidence Score` or pending evidence.
- Priorities should not be sold, shared, or used for sensitive microtargeting.
- Users should be able to retake priorities later.
- The system may prompt users over time to answer more questions, but should not
  block normal shopping after the minimum threshold is reached.

Slice 1 should not expand the questionnaire unless explicitly approved.

## 10. Tests Required Before Slice 1 Acceptance

Planned tests:

- Shopping products are read from database, not fake local arrays.
- No seed migration inserts fake products.
- A product score requires a score snapshot and published time.
- Payment/firewall ranking tests still pass.
- Product admin helper rejects product activation without real source metadata,
  if helper is implemented.
- Place-to-buy helper rejects missing seller name/product link.
- Places to buy do not use commission/affiliate fields.
- Product result sorting does not accept payment-derived fields.
- Public shopping can show empty state without fake cards.
- Product detail can show no places to buy without invented sellers.
- Build/lint/test pass.

Live checks if migration/helper is added:

- Apply only to `mishava-v2-dev / snnscnodegbyqexnopvf`.
- Confirm old project `mishava / tghbfautnxblfxrtkdqb` is not modified.
- Confirm product score constraint rejects fake score without snapshot.
- Confirm active product can be created only through authorized workflow.
- Confirm anonymous users can read active products only.
- Confirm inactive/draft products are not publicly visible.

## 11. Non-Goals

Release 4 Slice 1 should not include:

- Whole-internet crawling.
- AI product ingestion.
- AI price extraction.
- Fake product rows.
- Fake prices.
- Fake sellers.
- Fake scores.
- Affiliate or commission ranking.
- Sponsored placement.
- Paid visibility.
- Public claims that scoring is complete.
- Final SDG scoring math.
- Consumer Plus score reports.
- Local delivery marketplace.
- Business catalog tooling beyond what is required for Shopping POC planning.
- Full admin merchandising console.

## 12. Recommended Build Order For Future Implementation

1. Review current shopping tables against real-data requirements.
2. Add minimal source/review metadata to shopping product/place tables, if
   needed.
3. Add admin-safe product/place creation helpers.
4. Add audit events for product/place creation and activation.
5. Add tests for no fake data, source required, and score snapshot requirement.
6. Add or tighten public filtering so only active reviewed products appear.
7. Add POC data manually only from real, documented source URLs.
8. Run build/lint/test.
9. Apply migrations to clean V2 Supabase only, if migrations are included.
10. Document Release 4 Slice 1 result after implementation.

## 13. Acceptance Criteria For Future Implementation

Release 4 Slice 1 can be accepted only when:

- Shopping POC uses real product/source records only.
- No fake products, prices, sellers, places to buy, or scores are introduced.
- Score display remains blocked unless a real published snapshot exists.
- Payment, sponsorship, subscription, commission, affiliate, and hosted status
  cannot affect ranking or score display.
- Product and place-to-buy creation are audit logged.
- Public users can see only active approved shopping records.
- Empty states remain honest when real data is missing.
- Tests pass.
- Live migration/checks pass if database changes are included.
- The old Supabase project is not modified.
