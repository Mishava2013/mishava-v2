# Release 4 Slice 7: Shopping Research Pipeline and Supplier Transparency Result

## Summary

Implemented the first reusable Shopping research pipeline foundation and supplier/manufacturer transparency model for the toilet paper POC.

This slice keeps Mishava evidence-first: retailer, brand, private-label owner, manufacturer, and supplier are separate fields; unknown supplier/manufacturer identity is shown as an evidence gap instead of guessed; outside scorecards remain evidence references only and are not Mishava Scores.

## What Was Implemented

- Added supplier/manufacturer transparency fields to `shopping_products`:
  - `retailer_name`
  - `brand_display_name`
  - `private_label_owner`
  - `parent_company`
  - `manufacturer_name`
  - `supplier_name`
  - `supplier_role`
  - `supplier_region`
  - `manufacturer_source_url`
  - `supplier_source_url`
  - `manufacturer_confidence`
  - `supplier_confidence`
  - `evidence_gap_notes`
  - `supplier_reviewed_at`
  - `supplier_reviewed_by`
- Added confidence validation:
  - `verified`
  - `likely`
  - `unverified`
  - `unknown`
- Added guardrails so:
  - verified manufacturer requires a manufacturer name and source URL
  - verified supplier requires a supplier name and source URL
  - active products must carry explicit supplier/manufacturer context
  - toilet paper cannot become `score_ready` without supplier/manufacturer context
- Added a reusable toilet paper research template in `src/lib/shopping.ts`.
- Added supplier transparency helpers for UI and scoring explanation context.
- Updated Shopping product cards and product detail pages to show supplier/manufacturer gaps.

## Costco / Kirkland Handling

Added one Costco/Kirkland toilet paper record:

- `Kirkland Signature Bath Tissue - 2-Ply - 380 Sheets - 30 Rolls`
- Retailer: Costco
- Brand: Kirkland Signature
- Private-label owner: Costco
- Manufacturer: unknown
- Supplier: unknown
- Confidence: unknown / unknown
- Evidence gap note: manufacturer and supplier are not publicly verified in the reviewed source; supplier may vary by region or time.

Mishava does not treat Costco as the manufacturer or supplier without evidence.

## Kruger Products Handling

Added two Kruger Products brand records:

- `Cashmere Bathroom Tissue`
- `Purex Bathroom Tissue`

For these records:

- Consumer brand is tracked separately from Kruger Products.
- Kruger Products is recorded as manufacturer/brand owner where the reviewed source supports it.
- Supplier details remain unknown.
- Fiber sourcing, recycled content, bleaching/process, packaging, and supplier details remain evidence gaps.
- No Kruger score or outside score was copied as a Mishava Score.

## Migration

Added migration:

- `supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql`

Migration status:

- Applied to clean V2 Supabase project `mishava-v2-dev / snnscnodegbyqexnopvf`.
- `supabase migration list --linked` shows local and remote aligned through `202605260008`.
- Old Supabase project was not touched.

## Tests Run

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm test` - passed, 145/145.
- `npm run build` - passed.
- `supabase db push --linked` - applied `202605260008` after moving the active-product context constraint after the data backfill.
- `supabase migration list --linked` - aligned.

## Known Limitations

- This is not a final tissue scoring methodology.
- No Mishava Scores were created for Costco/Kirkland, Cashmere, Purex, or any other toilet paper product.
- Costco/Kirkland supplier identity remains unknown unless a stronger public source is reviewed later.
- Kruger Products records do not yet include full product-level sourcing, recycled content, bleaching/process, packaging, or supplier details.
- No autonomous research crawler, AI scoring, or full supplier database was added.

## Remaining Shopping Work

- Backfill supplier transparency for all existing Shopping categories with more precise sources over time.
- Add internal review/task UI if a full research queue becomes necessary.
- Continue product-specific toilet paper evidence review before any controlled user preview.
- Keep developing category-specific evidence templates before scoring.

## Scope Confirmation

- No fake products, sellers, evidence, suppliers, manufacturers, images, or scores were added.
- No outside score was copied as a Mishava Score.
- No checkout, Plus, Local inventory, Business, Gov, Corporate, AI scoring, affiliate, referral, commission, sponsored ranking, or payment influence was added.
- Payment does not affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or report trust conclusions.
- Old Supabase project was not touched.
