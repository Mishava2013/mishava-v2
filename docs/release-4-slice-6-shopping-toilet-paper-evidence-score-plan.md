# Release 4 Slice 6 Shopping Toilet Paper Evidence-to-Score Readiness Plan

## Purpose

Plan the next narrow Shopping proof-of-concept category: toilet paper.

This is a planning slice only. Do not implement code, migrations, seeds, product records, evidence records, score snapshots, image records, or UI changes in this slice.

## Source of Truth

- `docs/release-4-slice-5-shopping-images-visual-trust-result.md`
- `docs/release-4-slice-4-shopping-cleanup-real-data-depth-result.md`
- `docs/release-4-slice-3-result.md`
- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-1-result.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-4-slice-5-typecheck-sanity-result.md`

## Context

The post-Slice-5 typecheck sanity gate is complete and safe:

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm test` passed, `140/140`.
- `npm run build` passed.
- Migrations were not touched during the gate.
- The old Supabase project was not touched.
- No product features were added during the gate.

Release 4 Shopping currently has:

- real-data guardrails;
- Shopping Priorities;
- score/trust popup readiness;
- no-paid-ranking and no-commission protections;
- 8 real baby diapers/wipes products;
- 8 real Target places-to-buy rows;
- conservative image metadata;
- polished non-photo image fallbacks;
- honest score states.

## Goal

Add toilet paper as the next narrow Shopping POC category and plan the first evidence-to-score readiness path without inventing Mishava scores.

Toilet paper is a useful early category because real products often make inspectable claims around recycled content, post-consumer recycled content, bamboo or FSC sourcing, virgin fiber reliance, bleaching/process language, packaging, price, and retailer availability.

## Scope

Shopping toilet paper category and evidence-to-score readiness only.

Do not build:

- checkout
- Plus
- Local inventory
- Business, Gov, or Corporate workflows
- AI scoring
- affiliate/referral/commission logic
- final tissue scoring methodology
- final SDG scoring
- broad household goods expansion
- business self-serve catalog

Do not add:

- fake products
- fake sellers
- fake evidence
- fake images
- fake scores
- copied outside scores represented as Mishava scores
- payment influence on score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or trust outcomes

Do not touch the old Supabase project:

- `mishava / tghbfautnxblfxrtkdqb`

## 1. Category Focus

Add one new narrow Shopping POC category:

- toilet paper

Recommended product-count target:

- 8 to 12 real toilet paper products

The product set should be large enough to show category comparison but small enough for careful source review.

Recommended mix:

- mainstream national brands;
- recycled-content brands;
- bamboo/tree-free brands;
- store/private-label options;
- at least one lower-price mainstream option where real source data is available;
- at least one multi-roll family pack where count/package details are clear.

Do not activate a product unless it has approved real-source metadata. If the product has real source metadata but not enough reviewed evidence, the product should remain `Score pending` or `Evidence profile pending`.

## 2. Recommended Product List Strategy

Start from product candidates, not final product claims.

Recommended candidate sources:

- manufacturer or brand product pages;
- retailer product pages such as Target, Walmart, Costco, Amazon, Grove, Thrive Market, or brand-owned stores only when the URL is a real public product/source record;
- brand sustainability or sourcing policy pages;
- package/product pages that state recycled, bamboo, FSC, chlorine-free, plastic-free, or packaging claims;
- recognized third-party scorecards or NGO reports only as evidence references, not as Mishava scores.

Recommended candidate mix to review:

- Charmin mainstream product;
- Cottonelle mainstream product;
- Angel Soft or Quilted Northern mainstream product;
- Target store/private-label product;
- Costco/Kirkland or Walmart/Great Value private-label product if source data is clear;
- Seventh Generation recycled-content product;
- Who Gives A Crap recycled or bamboo product;
- Reel bamboo product;
- Cloud Paper bamboo product;
- Caboo bamboo product;
- 365/Whole Foods or similar store/private-label recycled option if source data is clear.

Implementation should choose only 8 to 12 products whose source URLs, package details, and places-to-buy can be reviewed. Candidate names should not become active production data unless source review passes.

## 3. Product Data Checklist

Each active toilet paper product should include:

- product name;
- brand/manufacturer;
- category: `toilet-paper`;
- parent category or shelf: `household`;
- package/count details;
- roll count and sheet count where available;
- ply where available;
- product summary derived from reviewed source metadata;
- source URL;
- source name;
- source review status;
- source captured/reviewed date;
- reviewer identifier where available;
- image metadata status;
- image fallback state if no approved image exists;
- evidence/trust status;
- score state;
- places to buy where available.

Required active-record rule:

- active products require approved real-source metadata;
- products lacking approved source metadata should remain inactive or hidden from the public Shopping POC;
- no placeholder toilet paper product should be treated as production data.

## 4. Evidence Data Checklist

Plan evidence fields around claims that are actually available from reviewed sources:

- recycled content percentage, if available;
- post-consumer recycled content percentage, if available;
- bamboo/tree-free material claim, if available;
- FSC certification claim, if available;
- other certification or standards claim, if available;
- virgin forest fiber reliance or virgin pulp statement, if available;
- bleaching/process language, such as chlorine-free or elemental chlorine-free claims, if available;
- packaging claim, such as plastic-free, recyclable, recycled paper, or reduced packaging, if available;
- company/brand sourcing policy link, if available;
- manufacturing location or country-of-origin claim, if available and source-backed;
- third-party scorecard/reference notes, if available;
- source freshness/review date.

Evidence records should distinguish:

- product-level claims;
- brand/company-level policies;
- retailer product listing data;
- external reference or third-party report data.

Important evidence boundary:

Outside scorecards, sustainability rankings, or NGO score reports may be recorded as evidence references/source notes. They must not be copied into Mishava as a Mishava Evidence Score, Your Values Score, ranking score, or final trust conclusion.

## 5. Evidence-to-Score Readiness Path

Slice 6 should prepare the category for future scoring without calculating or displaying invented scores.

First safe path:

1. Product source is reviewed.
2. Evidence item is created from the reviewed source.
3. Structured claim draft is created from the evidence item.
4. Human review marks the claim accepted or rejects it.
5. Product remains score pending until a published scoring version supports tissue/toilet-paper inputs.
6. Evidence Score appears only when Mishava-reviewed evidence and approved scoring logic support it.
7. Your Values Score appears only when user priorities and evidence-backed scoring data make it valid.

Fallback states:

- `Score pending`
- `Evidence profile pending`
- `Draft trust context`
- `External evidence available`
- `Mishava review not finalized`
- `More evidence needed`
- `Your Values Score unavailable`

Scoring readiness should preserve Release 3 Slice 1 guardrails:

- payment fields are forbidden inputs;
- score snapshots remain append-only;
- public score values require published score snapshots;
- no payment, subscription, hosted profile, sponsorship, commission, affiliate, referral, or paid placement factor can affect score/ranking/trust outputs.

## 6. Source and Review Rules

For product records:

- Use manufacturer, brand, retailer, or reviewed public source URLs.
- Store the source URL and source name.
- Store the source captured/reviewed date.
- Mark source review status explicitly.
- Do not activate a record unless real-source metadata is approved.

For evidence records:

- Preserve source URL and review metadata.
- Identify whether the source is product-level, brand-level, company-policy, retailer listing, or external report/reference.
- Keep reviewer and review timestamp where available.
- Do not turn evidence references into score values automatically.

For images:

- Continue using polished non-photo fallbacks unless approved image rights exist.
- Do not scrape, hotlink, or reuse product imagery unless source/rights review is documented.
- No generated product images.

For stale data:

- Prefer a clear `source stale` or `review needed` state over silently continuing to imply freshness.
- Price and availability should be treated as freshness-sensitive.

## 7. Places to Buy

Add real places-to-buy only where reviewed URLs exist.

Fields:

- retailer/seller name;
- product URL;
- price if known;
- availability if known;
- source/freshness status;
- last reviewed date;
- fulfillment notes if known;
- pickup/delivery/shipping notes if known.

Rules:

- no fake stores;
- no affiliate links;
- no commission sorting;
- no paid placement;
- no sponsored ranking;
- no checkout;
- clear `Mishava is not the store` language.

Ordering must not use:

- commission;
- affiliate fee;
- referral fee;
- paid placement;
- sponsorship;
- subscription tier;
- hosted profile status;
- claimed profile status;
- any payment-derived field.

## 8. Trust Popup Readiness

The Shopping trust popup should support toilet paper-specific explanation without creating a score.

It should explain:

- what is known;
- what is missing;
- whether recycled-content claims are reviewed;
- whether post-consumer recycled content claims are reviewed;
- whether bamboo/tree-free claims are reviewed;
- whether FSC/certification claims are reviewed;
- whether virgin-fiber reliance or sourcing policy has been reviewed;
- whether bleaching/process claims have been reviewed;
- whether packaging claims have been reviewed;
- source freshness;
- evidence coverage and confidence;
- no paid ranking;
- no commission;
- score pending if Mishava has not finalized scoring;
- Shopping Priorities do not change the base Evidence Score.

The popup should keep status text accessible and avoid color-only communication.

## 9. Shopping UX Notes

Toilet paper should feel like a real early category without pretending it is complete.

Recommended UX changes for implementation:

- add toilet paper to Shopping department/category navigation only when records exist or a useful real-data-only empty state exists;
- add a category page title such as `Toilet paper`;
- show `Score pending` and `Evidence profile pending` visibly on cards;
- show fallback image cards that do not imply real package photography;
- show `External evidence available` only when a reviewed outside reference exists;
- show `Mishava review not finalized` when evidence exists but claims are not accepted;
- keep `No paid ranking`, `No commission`, and `Mishava is not the store` near places-to-buy.

## 10. Minimal Data/Admin Workflow

Do not build a full public catalog admin unless truly needed.

Smallest safe workflow:

- use migration/seed or an internal source-of-truth module for the first reviewed POC records;
- require reviewed source metadata before active display;
- document reviewer/date on each source;
- use existing evidence/claim structures where possible;
- keep unsupported products hidden or score-pending;
- defer full product admin until data maintenance pressure is real.

If implementation requires a migration, apply only to:

- `mishava-v2-dev / snnscnodegbyqexnopvf`

Do not apply anything to:

- `mishava / tghbfautnxblfxrtkdqb`

## 11. Tests Required

Add or extend tests proving:

- toilet paper products require approved real-source metadata;
- toilet paper product detail does not invent Mishava scores;
- outside scorecards are evidence references, not Mishava scores;
- products without enough reviewed evidence show `Score pending`;
- products with partial reviewed evidence can show `Draft trust context` or `External evidence available` without a score;
- places-to-buy ordering ignores payment, affiliate, referral, commission, sponsorship, and paid placement;
- no paid field can affect ranking, visibility, verification, credibility labels, or trust outcomes;
- image fallback works when no approved image exists;
- unapproved image metadata does not render as product imagery;
- `Your Values Score` remains withheld unless priorities and published evidence-backed scoring support it;
- no fake/demo product fixtures are treated as production data;
- existing Shopping Priorities tests still pass;
- existing score/trust popup tests still pass;
- existing payment firewall tests still pass;
- `npm run typecheck` passes;
- `npm run lint` passes;
- `npm test` passes;
- `npm run build` passes.

## 12. Non-Goals

Do not implement:

- final tissue scoring methodology;
- full SDG scoring;
- checkout;
- affiliate revenue;
- referral logic;
- commission logic;
- product image scraping;
- AI product image generation;
- AI scoring;
- Local inventory;
- broad household goods expansion;
- business self-serve catalog;
- public scoring UI;
- copied third-party scores as Mishava scores.

## 13. Acceptance Criteria

Slice 6 implementation can begin only if:

- toilet paper remains the only new category;
- the category uses real products and real reviewed sources;
- active products require approved real-source metadata;
- evidence is clearly separated from Mishava scoring;
- outside scorecards are references only, not Mishava scores;
- score states remain honest;
- no fake products, sellers, evidence, images, or scores are added;
- no checkout, affiliate, referral, commission, or paid placement logic is added;
- payment cannot affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or trust outcomes;
- the category is useful enough to show a real interested person as an early preview;
- old Supabase remains untouched.

## Recommended Implementation Order

1. Add category constants/navigation support for `toilet-paper`.
2. Define the reviewed product candidate list and choose 8 to 12 products with real source URLs.
3. Add source-reviewed product records with score-pending states only.
4. Add reviewed places-to-buy rows where real retailer URLs and freshness data exist.
5. Add evidence-reference structures for toilet paper claims without producing scores.
6. Add structured claim draft/review path hooks only where current evidence models support them.
7. Update product cards/detail pages and trust popup copy for toilet-paper evidence types.
8. Add tests for real-source requirements, score honesty, outside-scorecard boundaries, image fallback, and payment firewall ordering.
9. Run typecheck, lint, tests, and build.

## Final Planning Recommendation

Implement Slice 6 as a real-data category expansion plus evidence-to-score readiness pass, not as a scoring launch.

The right first preview is:

- real toilet paper products;
- real source URLs;
- real places to buy where available;
- evidence references and reviewed claim status;
- no fake score numbers;
- clear `Score pending` or `Draft trust context` states;
- no paid ranking or commission influence.

That is enough to show how Mishava would begin evaluating toilet paper without overstating what Mishava has verified.
