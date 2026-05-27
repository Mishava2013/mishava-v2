# Release 4 Slice 7: Toilet Paper Supplier Transparency and Costco/Kruger Coverage Plan

## Goal

Make the toilet paper category honest enough for a controlled preview with the interested user by adding supplier/manufacturer transparency and targeted Costco/Kirkland and Kruger Products coverage.

This slice should close the major readiness gaps identified in `docs/release-4-shopping-poc-readiness-audit.md` without creating scores, checkout, affiliate logic, fake evidence, or unsupported manufacturer/supplier claims.

## Scope

In scope:

- Toilet paper product data only.
- Supplier/manufacturer transparency model.
- Costco/Kirkland Signature toilet paper coverage where real source data is available.
- Kruger Products coverage where real source data is available, likely Cashmere and/or Purex.
- Backfill of transparency metadata for the existing toilet paper POC products.
- Product detail / trust popup clarity for supplier confidence and evidence gaps.
- Tests proving no guessed suppliers, fake scores, or paid-ranking influence.

Out of scope:

- Checkout.
- Plus.
- Local inventory.
- Business, Gov, or Corporate.
- AI scoring.
- Affiliate, referral, commission, sponsored ranking, or paid placement logic.
- Fake products, sellers, evidence, images, or scores.
- Copying outside scores as Mishava Scores.
- Final tissue scoring methodology.
- Full supplier database.
- Broad household expansion.
- Product image sourcing.
- Business self-serve catalog.
- Old Supabase project changes.

## Current State

Shopping is **internal-demo-ready** but not yet **controlled-preview-ready** for the toilet paper user.

Current toilet paper category:

- 9 active toilet paper products.
- Product mix includes mainstream, recycled, bamboo/tree-free, and Target private-label.
- All scores are pending.
- External scorecards are evidence references only.
- No real product images are shown.
- Costco/Kirkland Signature is missing.
- Kruger Products / Cashmere / Purex are missing.
- The model has `brand_name`, but it does not separate retailer, private-label owner, manufacturer, supplier, evidence source, and confidence.

## Data Model Changes

Add supplier/manufacturer transparency fields to `shopping_products`.

Recommended fields:

- `retailer_name text`
- `brand_display_name text`
- `private_label_owner text`
- `manufacturer_name text`
- `supplier_name text`
- `manufacturer_source_url text`
- `supplier_source_url text`
- `manufacturer_confidence text`
- `supplier_confidence text`
- `supplier_notes text`
- `supplier_reviewed_at timestamptz`
- `supplier_reviewed_by uuid null`

Recommended confidence values:

- `verified`
- `likely`
- `unverified`
- `unknown`

Validation rules:

- Active products may have unknown manufacturer/supplier, but unknown must be explicit.
- `manufacturer_confidence = 'verified'` requires `manufacturer_name` and `manufacturer_source_url`.
- `supplier_confidence = 'verified'` requires `supplier_name` and `supplier_source_url`.
- `likely` should require explanatory `supplier_notes`.
- `unknown` or `unverified` should show as evidence gaps in UI.
- Retailer, brand, private-label owner, manufacturer, and supplier must not be collapsed into one field unless evidence supports it.
- No product can become `score_ready` for a supplier-sensitive scoring path when required manufacturer/supplier evidence is missing.

Migration approach:

1. Add fields with nullable defaults.
2. Add confidence check constraints.
3. Add verified-source check constraints.
4. Backfill existing toilet paper products conservatively.
5. Keep score fields null and `mishava_evidence_review_status` below `score_ready`.

## Costco / Kirkland Handling

Add at least one Kirkland Signature toilet paper product if reviewed source data is available.

Candidate product strategy:

- Prefer current Costco product page/source for a Kirkland Signature bath tissue / toilet paper product.
- Use Costco as retailer where the product is sold by Costco.
- Use Costco as private-label owner only where source supports Kirkland Signature ownership.
- Do **not** set Costco as manufacturer unless a reliable source says Costco manufactures that product.

Required metadata:

- `brand_display_name`: `Kirkland Signature`
- `retailer_name`: `Costco`
- `private_label_owner`: `Costco` if source supports Kirkland Signature as Costco private label
- `manufacturer_name`: `Manufacturer not verified` or null if not publicly verified
- `supplier_name`: `Supplier not verified` or null if not publicly verified
- `manufacturer_confidence`: `unknown` or `unverified` unless verified
- `supplier_confidence`: `unknown` or `unverified` unless verified
- `supplier_notes`: note that supplier/manufacturer may vary by region/time if evidence is limited

UI requirements:

- Show “Manufacturer/supplier not verified.”
- Show “Supplier may vary” when applicable.
- Show score pending due to supplier/manufacturer evidence gap.
- Do not give Costco credit or blame for manufacturing claims unless evidence supports the relationship.

Trust/scoring rules:

- No Kirkland Mishava Score in this slice.
- No copied outside scores.
- No manufacturing, sourcing, recycled-content, bleaching/process, or packaging claims unless source-backed.

## Kruger Products Handling

Important correction: **Kruger, not Kroger.**

Treat Kruger Products as a tissue manufacturer / brand owner / product company, not as a grocery retailer.

Product strategy:

- Add Cashmere and/or Purex toilet paper products where source data is available.
- Prefer official Kruger Products, Cashmere, Purex, retailer, or product pages with stable product identity.
- Track the consumer-facing brand separately from Kruger Products.

Required metadata:

- `brand_display_name`: consumer-facing product brand, such as `Cashmere` or `Purex`
- `manufacturer_name` or `private_label_owner`: `Kruger Products` only where source supports it
- `manufacturer_confidence`: `verified` only with a source URL
- `supplier_confidence`: `unknown` or `unverified` if the exact production supplier/facility is not sourced
- `supplier_notes`: describe missing fiber sourcing, certification, bleaching/process, packaging, or supplier details

Evidence rules:

- Do not invent recycled-content claims.
- Do not invent FSC, bamboo, virgin-fiber, bleaching/process, packaging, or environmental claims.
- If source details are missing, store and display the gap.
- No Kruger Mishava Score until reviewed evidence and scoring logic support it.

## Existing Product Backfill Plan

Backfill transparency metadata for existing toilet paper products:

- Charmin
- Cottonelle
- Angel Soft
- Quilted Northern
- Scott
- up&up
- Seventh Generation
- Reel
- Caboo

Backfill rules:

- Set `brand_display_name` from the current product brand.
- Set `retailer_name = Target` only for records whose source/place-to-buy is Target.
- For Target private-label up&up, set `private_label_owner = Target` where source supports it; do not set Target as manufacturer unless verified.
- For mainstream brands, use manufacturer/brand-owner only if source supports it.
- For bamboo/recycled brands, preserve existing claim text but keep supplier/manufacturer confidence conservative.
- Use `verified` only with source URLs.
- Use `unknown` or `unverified` when the role is not source-backed.

No existing toilet paper product should become `score_ready` in Slice 7.

## UI Changes

Update product detail and trust popup to show:

- Retailer.
- Brand.
- Private-label owner, if applicable.
- Manufacturer.
- Supplier.
- Manufacturer confidence.
- Supplier confidence.
- Manufacturer/supplier evidence source links.
- “Manufacturer/supplier not verified” when appropriate.
- “Supplier may vary” when appropriate.
- “Score pending due to manufacturer/supplier evidence gaps” where applicable.
- “Outside evidence references are not Mishava Scores.”

Product card/category UI should add a compact signal:

- `Supplier verified`
- `Supplier unknown`
- `Private label`
- `Manufacturer not verified`

Avoid cluttering cards with full sourcing detail; reserve detail for product pages and popup.

## Data Quality Rules

Required for active products:

- Existing source-reviewed product metadata.
- Explicit manufacturer/supplier confidence values.
- Source URLs for verified manufacturer/supplier claims.
- Explicit unknown/unverified labels when source evidence is missing.

Forbidden:

- Treating retailer as manufacturer by default.
- Treating private-label owner as supplier by default.
- Treating Kruger as product brand when the consumer-facing brand is Cashmere/Purex.
- Treating Costco as Kirkland manufacturer without evidence.
- Scoring supplier-sensitive claims when manufacturer/supplier evidence is missing.
- Copying external scorecard scores as Mishava Scores.

## Implementation Order

1. Add model fields and constraints.
2. Backfill existing toilet paper records conservatively.
3. Add Costco/Kirkland record if a current reviewed source is available.
4. Add Kruger/Cashmere/Purex records if current reviewed sources are available.
5. Update Shopping helper types and select columns.
6. Add supplier/manufacturer evidence labels/helpers.
7. Update product detail UI.
8. Update trust popup checked/missing context.
9. Add category/card compact tags.
10. Add tests.
11. Apply migration only to `mishava-v2-dev / snnscnodegbyqexnopvf`.
12. Create result document.

## Tests Required

Add or extend tests proving:

- Costco/Kirkland product does not treat Costco as manufacturer without evidence.
- Kirkland private-label owner and manufacturer/supplier can be different.
- Unknown Kirkland manufacturer/supplier appears as an evidence gap.
- Kruger Products is not misspelled or confused with Kroger.
- Kruger products correctly separate consumer brand from Kruger Products where source supports it.
- Products can show manufacturer/supplier unknown without failing.
- Verified manufacturer/supplier claims require source URLs.
- No fake supplier/manufacturer data is accepted as verified.
- Private-label owner and manufacturer can be separate.
- Outside scorecards are evidence references, not Mishava Scores.
- All new toilet paper products remain score pending.
- Payment, affiliate, commission, sponsorship, and paid placement fields remain excluded from ranking.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## Acceptance Criteria

Slice 7 can be accepted only if:

- Costco/Kirkland coverage is present or explicitly deferred because a safe current source could not be verified.
- Kruger Products coverage is present or explicitly deferred because safe current source data could not be verified.
- Supplier/manufacturer uncertainty is explicit.
- No supplier or manufacturer is guessed.
- Private-label owner, retailer, manufacturer, and supplier can be displayed separately.
- Supplier evidence gaps are visible on product detail and trust explanation surfaces.
- Score states remain honest and pending.
- No outside score becomes a Mishava Score.
- No checkout, Plus, Local inventory, Business, Gov, Corporate, AI scoring, affiliate, commission, or payment-influence logic is added.
- The old Supabase project is untouched.
