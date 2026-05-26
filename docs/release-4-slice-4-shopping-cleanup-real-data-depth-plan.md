# Release 4 Slice 4: Shopping Cleanup and Real Product Data Depth Plan

Date: 2026-05-26

## Purpose

Release 4 Slice 4 should make the Shopping proof of concept feel deeper, clearer, and more credible without turning it into full Shopping.

NGO is now limited launch-ready with operational constraints, and Mishava is returning to the broader roadmap. Shopping already has:

- real-data-only database guardrails,
- no fake product/score seed data,
- Shopping Priorities,
- safe score/trust popup states,
- no-paid-ranking and no-commission language,
- payment firewall protections from Release 3.

This slice should deepen one narrow real category and clean up the experience around honest data states.

## Scope

Shopping cleanup and real product data depth only.

Do not build:

- checkout,
- Plus,
- Local inventory,
- Business, Gov, or Corporate workflows,
- AI scoring,
- affiliate, referral, or commission logic,
- fake products, fake sellers, fake evidence, or fake scores.

Payment, subscription tier, hosted profile status, claimed profile status, sponsorship, ad spend, commission, affiliate fees, referral fees, or paid placement must not affect score, ranking, visibility, verification, credibility labels, methodology outputs, or trust outcomes.

## 1. Category Focus

Use one narrow category first:

- baby diapers/wipes

Recommended first product-count target:

- **8 to 12 active reviewed products** across diapers and wipes.
- **2 to 4 distinct brands/manufacturers** if real source coverage supports it.
- **At least 1 real place-to-buy URL per active product**, preferably 2 where source quality allows.
- Products without complete source review should remain inactive or display only in internal review flows.

Minimum credible product set rules:

- Use real brand/product names.
- Use real product source URLs.
- Use real retailer/place-to-buy URLs.
- Do not add placeholder products.
- Do not add fake sellers.
- Do not invent prices, availability, evidence, certifications, claims, or scores.
- If a product lacks sufficient trust/scoring evidence, show `Score pending` or `Evidence profile pending`.

## 2. Product Data Depth

Required product fields before a record can be active:

- product name,
- brand/manufacturer,
- category and subcategory,
- product image source if legally safe,
- description or short summary,
- size/count/package details,
- product source URL,
- source name,
- source review status,
- source last reviewed date,
- evidence/trust status,
- score state,
- at least one place-to-buy record where available.

Product image policy:

- Prefer manufacturer/retailer images only when usage is legally safe or clearly permitted.
- If rights are unclear, use a text-only product card or a neutral placeholder state that does not imply a real image was sourced.
- Track image source URL and review status if images are used.

Source review states:

- `unreviewed`
- `reviewed`
- `stale`
- `rejected`

Active public products should require reviewed real-source metadata.

## 3. Places To Buy

Required fields:

- retailer/seller name,
- product URL,
- price if known,
- availability if known,
- source/freshness status,
- last reviewed date,
- pickup/delivery/fulfillment notes if available,
- clear `Mishava is not the store` language.

Places-to-buy rules:

- No commission sorting.
- No affiliate ranking.
- No paid placement.
- No sponsored ranking.
- No fake stores.
- No checkout.
- No hidden monetization.
- Unknown price or availability should display as unknown, not guessed.

Allowed ordering factors:

- availability status,
- known price,
- seller name,
- source freshness.

Forbidden ordering factors:

- commission,
- affiliate fee,
- referral fee,
- sponsorship,
- ad spend,
- subscription tier,
- hosted profile status,
- claimed profile status,
- paid placement.

## 4. Evidence And Trust Display

Allowed states:

- `Evidence Score` only if supported by real reviewed scoring data and a public/published score snapshot.
- `Draft trust context` if partial real evidence exists but is not a public score.
- `Score pending` if reviewed evidence is insufficient.
- `Evidence profile pending` if product/company evidence is missing.
- `Your Values Score` only if user priorities and evidence-backed scoring support it.

Rules:

- Do not invent score values.
- Do not display a personalized score number unless the user has saved priorities and the product has enough evidence-backed scoring inputs.
- Do not make a pending score look like a bad score.
- Do not imply certification, endorsement, or legal compliance unless verified by a real source.
- Keep Shopping Priorities separate from the base Evidence Score.

## 5. Score / Trust Popup Cleanup

Improve the existing score/trust popup so it can explain real-data depth more clearly.

The popup should clarify:

- what is known,
- what is missing,
- source freshness,
- evidence coverage,
- evidence recency,
- confidence or verification status,
- what has been checked,
- what has not been checked,
- why score is pending when evidence is insufficient,
- why `Your Values Score` is unavailable or pending,
- that payment/commission does not affect ranking,
- that Shopping Priorities do not change the base Evidence Score.

The popup must stay accessible:

- keyboard open/close,
- Escape close,
- focus handling,
- semantic labels,
- screen-reader-friendly status text,
- no color-only status communication,
- mobile-friendly layout.

## 6. Shopping UX Cleanup

Improve Shopping clarity without making the page feel broken.

Plan cleanup for:

- empty states,
- baby category page copy,
- product card hierarchy,
- product detail completeness,
- mobile layout,
- filter/sort labels,
- no-paid-ranking language,
- no-commission language,
- real-data-only messaging.

Recommended copy posture:

- Honest and calm.
- Avoid apologetic dead-end language.
- Explain that Mishava only shows reviewed real records.
- Make missing data feel like part of the trust model, not a site failure.

Empty state should say, in plain language:

- Mishava is adding reviewed products in this category.
- Products are hidden until their source metadata is reviewed.
- Scores are withheld until evidence supports them.

## 7. Data Ingestion / Admin Workflow

Plan the smallest non-public workflow needed to add real products safely.

Minimum workflow:

1. Admin/support user creates a draft product record.
2. Admin/support user adds source URL, brand/manufacturer, category, package details, and optional image source.
3. Admin/support user adds one or more places-to-buy with source URL and freshness date.
4. Reviewer marks product source metadata as reviewed.
5. Reviewer marks place-to-buy metadata as reviewed.
6. Product can become active only after required real-source metadata is reviewed.
7. Stale records are flagged and remain visible only if the UI clearly shows freshness status.

Do not build a full admin product catalog unless this workflow cannot be safely managed with existing admin/support patterns.

Source review roles:

- Admin/support can draft product metadata.
- Admin/support or future shopping reviewer can mark sources reviewed.
- Reviewer identity and review date should be captured.
- Source-review actions should create audit events where practical.

Stale data handling:

- A source should become stale after a defined interval, recommended starting point: 60 to 90 days.
- Stale price/availability should not be shown as current.
- Product can remain visible with a freshness warning if the base product source is still valid.
- Places-to-buy with stale price/availability should show `last reviewed` and avoid implying current availability.

## Product Data Checklist

Before activating a product:

- [ ] Product name is real.
- [ ] Brand/manufacturer is real.
- [ ] Category is `baby-products`, `diapers`, or `wipes`.
- [ ] Package details are present where available.
- [ ] Product source URL is present.
- [ ] Source review status is reviewed.
- [ ] Source last reviewed date is present.
- [ ] Product image source is reviewed or omitted.
- [ ] Trust/score state is honest.
- [ ] At least one real place-to-buy exists where available.
- [ ] No score is shown without real reviewed score data.
- [ ] No affiliate, commission, sponsorship, or paid placement field affects ordering.

Before activating a place-to-buy:

- [ ] Retailer/seller name is real.
- [ ] Product URL is real.
- [ ] Price is real or omitted.
- [ ] Availability is real or omitted.
- [ ] Source review status is reviewed.
- [ ] Last reviewed date is present.
- [ ] No commission/affiliate/referral field is used.
- [ ] The UI says Mishava is not the store.

## Real-Data Rules

- Real records only.
- Reviewed source metadata required for active public records.
- Missing price/availability must stay missing.
- Scores stay pending until real reviewed scoring data exists.
- Product cards and detail pages must not imply Mishava has checked evidence it has not checked.
- Product records should be hidden, draft, or pending until source requirements are met.
- Real data can be thin, but it cannot be invented.

## Implementation Order

Recommended build order for the future implementation slice:

1. Review current Shopping schema and helpers for product/source/freshness fields.
2. Add any small missing fields needed for image source/freshness/review tracking.
3. Add or tighten active-record constraints if current source metadata is incomplete.
4. Add admin-safe backend helpers for draft product and place-to-buy review.
5. Improve Shopping empty/category/product card/detail states.
6. Improve score/trust popup content for source freshness and missing-data reasons.
7. Add a tiny reviewed baby diapers/wipes data set only if real sources are ready.
8. Add tests for source requirements, pending score states, and no-paid-ranking protections.
9. Run typecheck, lint, tests, and build.
10. Apply any needed migration only to `mishava-v2-dev / snnscnodegbyqexnopvf`.

## Tests Required

Add or extend tests proving:

- active shopping products require approved real-source metadata,
- active places-to-buy require approved real-source metadata,
- product detail does not invent scores,
- products without enough evidence show safe pending/draft states,
- places-to-buy ordering ignores commission, affiliate, referral, sponsorship, and payment,
- paid fields cannot affect ranking,
- product cards expose source/trust status,
- product detail exposes source/freshness status,
- `Your Values Score` remains withheld unless valid,
- no fake/demo product fixtures are treated as production data,
- no checkout, Plus, Local inventory, affiliate logic, or AI scoring was added,
- `npm run typecheck` passes,
- `npm run lint` passes,
- `npm test` passes,
- `npm run build` passes.

## Non-Goals

Exclude:

- checkout,
- Plus,
- affiliate revenue,
- referral revenue,
- commission logic,
- local inventory,
- broad product indexing,
- full marketplace,
- AI scoring,
- final SDG scoring math,
- Business expansion,
- Local expansion,
- Gov expansion,
- Corporate expansion,
- product claims that are not supported by reviewed sources,
- product reviews or user-generated shopping ratings.

## Acceptance Criteria

Slice 4 can be implemented only if:

- category remains narrow,
- data is real or clearly absent,
- score states are honest,
- places-to-buy are real and not commission-driven,
- payment/affiliate/commission fields remain excluded from ranking,
- product cards and detail pages explain source/trust state clearly,
- `Your Values Score` remains withheld unless valid,
- no fake products, stores, evidence, prices, availability, or scores are introduced,
- Shopping feels more credible without pretending it is complete.

## Recommended Next Implementation Slice

Implement this as:

**Release 4 Slice 4A: Shopping Baby Products Real-Data Review Flow**

Recommended first slice boundary:

- add source/freshness UI cleanup,
- add admin-safe review helpers only if needed,
- add no fake seed data,
- optionally add the first reviewed real product records only after source URLs and image rights are confirmed.

If product source review is not ready, implement UI/data-depth cleanup first and leave the category in a stronger real-data-only empty state.
