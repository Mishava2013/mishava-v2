# Release 4 Slice 8: Toilet Paper Evidence-to-Score Preview Plan

## Source of Truth

- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/release-4-shopping-poc-readiness-audit.md`
- `docs/release-4-slice-6-shopping-toilet-paper-evidence-score-result.md`
- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-3-result.md`
- `docs/release-3-slice-1-result.md`

## Goal

Plan the first honest toilet paper evidence-to-score preview so a real early user can search toilet paper and understand Mishava's early trust and match view without fake final scores, medical claims, copied third-party scores, or paid-ranking influence.

This preview should be practical and human-centered. The first use case includes a mom with Crohn's who may care about comfort, fragrance/free-from claims, softness, affordability, and sourcing transparency, but Mishava must not claim that any product is medically safe, best for Crohn's, guaranteed non-irritating, or clinically recommended.

## Scope

Toilet paper evidence-to-score preview only.

This slice may plan UI copy, data requirements, scoring-preview rules, Shopping Priorities mapping, and tests for the toilet paper preview.

## Non-Goals

- Checkout
- Plus
- Local inventory
- Business, Gov, or Corporate
- AI scoring
- Live autonomous crawler or scraping system
- Affiliate, referral, commission, sponsored ranking, or paid-placement logic
- Fake scores, fake evidence, fake suppliers, fake manufacturers, fake products, or fake images
- Copying outside scores as Mishava Scores
- Medical recommendation engine or medical claims
- Final tissue scoring methodology
- Full Mishava Shopping scoring engine
- Product image sourcing
- Broad household goods expansion
- Old Supabase project changes

## User Preview Goal

The first toilet paper preview user should be able to:

- Open Shopping and find the toilet paper category easily.
- See real toilet paper products, including Costco/Kirkland, Cashmere, Purex, and the existing mainstream, recycled, bamboo/tree-free, and private-label records where available.
- See what Mishava knows from reviewed sources.
- See what Mishava does not know yet.
- Understand retailer, brand, private-label owner, manufacturer, supplier, and confidence level as separate concepts.
- See supplier/manufacturer evidence gaps without Mishava guessing.
- See early evidence and match states without any final Mishava Score.
- Understand that Mishava is not the store and does not rank by payment, affiliate fees, or commissions.

## User-Facing Score Language

Use conservative labels:

- `Evidence Score Preview`
- `Your Values Match Preview`
- `Score pending`
- `Evidence profile incomplete`
- `External evidence available`
- `Mishava review not finalized`
- `Not a final Mishava Score`
- `More evidence needed`

Avoid:

- `Final Mishava Score`
- `Certified score`
- `Medical-safe score`
- `Best for Crohn's`
- `Guaranteed non-irritating`
- `Doctor recommended`
- `Verified healthy`
- Any language that implies clinical suitability or medical advice

Recommended plain-language disclaimer:

> Mishava can help compare evidence and gaps, but this is not medical advice. Product comfort and irritation experiences vary by person.

## Required Data and Evidence Fields

Use existing Slice 6 and Slice 7 fields where possible before adding schema.

Toilet paper preview should depend on:

- `name`
- `brand_name`
- `brand_display_name`
- `retailer_name`
- `private_label_owner`
- `parent_company`
- `manufacturer_name`
- `supplier_name`
- `supplier_role`
- `supplier_region`
- `manufacturer_confidence`
- `supplier_confidence`
- `manufacturer_source_url`
- `supplier_source_url`
- `evidence_gap_notes`
- `supplier_reviewed_at`
- `source_name`
- `source_url`
- `source_captured_at`
- `source_review_status`
- `package_details`
- `product_url`
- `recycled_content_claim`
- `post_consumer_recycled_content_claim`
- `bamboo_fsc_claim`
- `virgin_fiber_claim`
- `bleaching_process_claim`
- `packaging_claim`
- `brand_sourcing_policy_url`
- `external_evidence_reference_url`
- `external_evidence_reference_notes`
- `mishava_evidence_review_status`
- `evidence_score`
- `score_snapshot_id`
- `score_published_at`
- place-to-buy price, availability, freshness, and source fields where safely verified

Potential future fields, only if needed:

- `softness_comfort_claim`
- `fragrance_free_claim`
- `dye_free_claim`
- `lotion_free_claim`
- `septic_safe_claim`
- `sheets_per_roll`
- `roll_count`
- `total_sheets`
- `price_per_100_sheets`
- `sensitive_use_evidence_notes`

These fields must remain source-backed claims, not medical claims.

## Toilet Paper Evidence Dimensions

Plan the first dimensions as reviewed evidence signals, not final score factors:

- Softness/comfort claim, only if source-supported.
- Fragrance/free-from claim, only if source-supported.
- Recycled content.
- Post-consumer recycled content.
- Bamboo/tree-free/FSC claims.
- Virgin fiber reliance.
- Bleaching/process claims.
- Packaging claims.
- Brand/manufacturer/supplier transparency.
- Retailer/source freshness.
- Price/value where verified by current source records.
- Third-party scorecard/reference notes as evidence context only.

Each dimension should show one of:

- `Reviewed`
- `Source recorded`
- `External reference only`
- `Missing`
- `Not reviewed`
- `Not applicable`

## Shopping Priorities Mapping

Map priorities to preview explanations without inventing scores:

- Environmental priority:
  - recycled content
  - post-consumer recycled content
  - bamboo/tree-free/FSC claims
  - virgin fiber reliance
  - packaging claims
- Sensitive-use priority:
  - fragrance/free-from claims
  - comfort/softness claims
  - lotion/dye claims if source-supported later
  - clear reminder that Mishava is not making medical claims
- Affordability priority:
  - price if verified
  - package count
  - sheets/roll or unit value if safely calculated from source-backed fields
- Transparency priority:
  - manufacturer confidence
  - supplier confidence
  - private-label owner clarity
  - evidence gaps
- Retailer preference:
  - place-to-buy availability where source-backed
  - no local inventory claims yet

If the user has not completed Shopping Priorities:

- Show a prompt to complete priorities.
- Keep the product state as `Evidence Score Preview` / `Score pending`.
- Do not show a personal match value.

If priorities exist but evidence is incomplete:

- Show `Your Values Match Preview unavailable` or `Partial match context`.
- Explain which evidence is missing.
- Do not invent a numeric values score.

## Evidence-to-Score Preview Rules

The preview method should be simple, auditable, and intentionally limited:

- No final scoring version unless it is explicitly approved later.
- Use only reviewed structured claims for preview facts.
- Do not use unreviewed research tasks as score facts.
- Do not use raw source notes as accepted claims without human review.
- Missing evidence should reduce confidence or show `Evidence profile incomplete`.
- Outside scorecards are references only and cannot become Mishava Scores.
- Payment, affiliate, commission, sponsored, billing, or paid-placement fields must be excluded.
- Supplier/manufacturer unknowns must remain visible evidence gaps.
- Costco/Kirkland must not treat Costco as manufacturer without evidence.
- Kruger/Cashmere/Purex must separate consumer brand from Kruger Products where supported.

Recommended preview states:

- `Score pending`: no reviewed structured claims or scoring version.
- `Evidence profile incomplete`: some reviewed source metadata exists but required evidence is missing.
- `External evidence available`: outside references exist but are not Mishava Scores.
- `Evidence Score Preview`: enough reviewed claims exist to explain early evidence direction, but no final score.
- `Your Values Match Preview`: only when user priorities and reviewed claims are both sufficient.

## Product Page Plan

Toilet paper product detail should show:

- Product identity.
- Brand and consumer-facing brand.
- Retailer/place-to-buy.
- Private-label owner, if applicable.
- Parent company, if available.
- Manufacturer and supplier.
- Manufacturer/supplier confidence.
- Source URLs where safe.
- Package details.
- Evidence dimensions.
- What Mishava knows.
- What Mishava does not know.
- Evidence gaps.
- Why no final score exists yet.
- Early match preview only if reviewed evidence and user priorities support it.
- No-paid-ranking/no-commission language.
- `Mishava is not the store` language.

For Costco/Kirkland:

- Show Costco as retailer/private-label owner where supported.
- Show manufacturer/supplier as unknown unless verified.
- Explain supplier may vary by region/time if applicable.
- Keep score pending.

For Kruger/Cashmere/Purex:

- Show Cashmere/Purex as consumer brand.
- Show Kruger Products as manufacturer/brand owner where source-backed.
- Keep unresolved sourcing, fiber, packaging, bleaching/process, and supplier claims as evidence gaps.
- Keep score pending until reviewed claims and scoring version support it.

## Category and Search UX Plan

Shopping should make toilet paper easy to find:

- Keep `/shopping/categories/toilet-paper` reachable from Shopping.
- Product cards should show product name, brand, trust state, supplier/manufacturer gap badge, source freshness, no-paid-ranking/no-commission labels, and image fallback.
- Search should match toilet paper product names, brands, retailer/source, manufacturer, supplier, and private-label owner.
- Sort/filter labels should not imply final score ranking while scores are pending.
- If a product lacks enough evidence, show `Score pending` and `Evidence profile incomplete` rather than a numeric score.
- If a product lacks places-to-buy data, show a clean empty state.
- Mobile layout should keep badges readable and avoid burying evidence gaps.

## Data Review Order

Implementation should proceed in this order:

1. Confirm product list includes Costco/Kirkland, Cashmere, Purex, and the existing mainstream/recycled/bamboo/private-label products.
2. Create or verify source-backed evidence dimensions for each product.
3. Identify which claims are reviewed structured claims versus source notes/research tasks.
4. Add preview helper labels that are separate from final score helpers.
5. Add product page and card copy for evidence dimensions and gaps.
6. Connect Shopping Priorities only as explanatory match context.
7. Add tests around no fake scores, no medical claims, no copied outside scores, and no paid-ranking influence.

## Tests Required

Add or extend tests proving:

- Toilet paper products with incomplete evidence do not show final Mishava Scores.
- Early preview only uses reviewed claims.
- Unreviewed research tasks do not create scores.
- Outside scorecards are not Mishava Scores.
- Shopping Priorities do not create fake values scores without evidence.
- Sensitive-use language does not make medical claims.
- Payment, affiliate, commission, billing, sponsored, and paid-placement fields remain excluded.
- Supplier/manufacturer unknown remains visible as an evidence gap.
- Costco/Kirkland does not treat Costco as manufacturer without evidence.
- Kruger/Cashmere/Purex separate consumer brand and Kruger Products where supported.
- Product cards and product detail show score pending/evidence incomplete states.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## Preview Readiness Decision

Before showing the early user, all must be true:

- Toilet paper category opens cleanly.
- Product pages are understandable.
- Costco/Kirkland and Kruger/Cashmere/Purex are visible where records exist.
- No fake scores appear.
- No medical claims appear.
- Evidence gaps are visible.
- Supplier/manufacturer uncertainty is explicit.
- Shopping Priorities flow works or gracefully prompts.
- Early preview language is clear.
- Mobile view is usable enough for a normal user.
- `Mishava is not the store`, `No paid ranking`, and `No commission` language is visible.

## Acceptance Criteria

Slice 8 can be implemented only if:

- The first user can look up toilet paper.
- The experience is useful even if scores remain preview/pending.
- The app clearly separates evidence, gaps, preview states, and final scores.
- Personal match is shown only when supported by reviewed evidence and user priorities.
- No medical claims are made.
- No fake scores, fake evidence, fake supplier/manufacturer claims, or copied outside scores are introduced.
- No paid ranking, commission, affiliate, or payment influence is added.
- Old Supabase project remains untouched.
