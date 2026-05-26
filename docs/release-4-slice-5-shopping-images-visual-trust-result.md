# Release 4 Slice 5 Shopping Product Images and Visual Trust Polish Result

## Status

Release 4 Slice 5 is implemented for the baby diapers and wipes Shopping proof of concept.

This slice added conservative image metadata, polished non-photo fallback cards, and clearer score/source/commerce trust-state treatment. It did not add real product images because image rights have not been reviewed and approved yet.

## What Was Implemented

- Added a reusable `ShoppingProductImage` component.
- Added a clean fallback treatment for products without approved image rights.
- Added approved-image gating in Shopping domain helpers.
- Updated Shopping landing product cards to use the fallback image treatment.
- Updated baby diapers/wipes category product cards to use the fallback image treatment.
- Updated product detail pages with a larger image/fallback area near product identity and score state.
- Added clearer visual badge classes for score state, source state, and commerce boundary language.
- Improved places-to-buy empty language so missing sellers do not imply placeholder stores or checkout links.
- Updated score/trust explanation helper to record that no approved product image is displayed when image rights are not approved.

## Image Metadata Fields

Added image metadata fields to `shopping_products`:

- `image_alt_text`
- `image_source_url`
- `image_source_type`
- `image_review_status`
- `image_last_reviewed_at`
- `image_rights_notes`

Approved product imagery now requires:

- image URL
- alt text
- image source URL
- image source type
- image review timestamp
- image rights notes
- `image_review_status = 'approved'`

## Real Product Images Displayed

No real product images are displayed in this slice.

The existing 8 baby diapers/wipes POC products were set to:

- `image_review_status = 'missing'`
- no image URL
- no image alt text

This keeps the UI visually cleaner while avoiding unsafe scraped, hotlinked, generated, or misleading product images.

## Fallback Behavior

Products without approved image metadata render a non-photo fallback card.

The fallback:

- does not look like a real product photo
- uses category/subcategory initials
- shows a product type label such as `Diaper product` or `Baby wipes`
- explains that the product image is not available or is pending rights review
- preserves a stable product-card layout on desktop and mobile

## Visual and Trust-State Improvements

Improved visual treatment for:

- `Score pending`
- `Evidence profile pending`
- source reviewed/approved state
- source freshness
- no paid ranking
- no commission
- no paid placement
- `Mishava is not the store`

The visual treatment is text-based and does not rely on color alone.

## Migration Applied

Applied to the clean Mishava V2 Supabase project only:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`
- Migration: `202605260006_release_4_slice_5_shopping_image_metadata.sql`

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.

## Live Checks Performed

Live row verification against the clean V2 project confirmed:

- 8 active Shopping POC products
- all 8 have `image_review_status = 'missing'`
- 0 active POC products have image URLs
- 0 active POC products have image alt text

This confirms the app is using the fallback path and not displaying unreviewed product imagery.

## Tests Run

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `supabase migration list --linked`

Note: the first `npm run build` attempt hit an ignored local `.next/diagnostics` cache removal error. Clearing the ignored `.next` build cache and rerunning `npm run build` completed successfully.

## Known Limitations

- No real product images are displayed yet.
- No image upload/review admin workflow was added.
- No image rights review queue was added.
- No image CDN or storage workflow was added.
- The fallback is intentionally generic and does not represent actual packaging.
- The first Shopping POC still covers only baby diapers and wipes.
- Products still show score-pending/evidence-profile-pending states because no reviewed evidence scores or published shopping score snapshots were added.

## Remaining Shopping Readiness Work

- Add a minimal image rights review workflow.
- Add a safe image upload/storage path if manually uploaded images are approved.
- Add real approved image URLs only after rights review.
- Add stale-image review handling.
- Continue improving card density and mobile storefront polish.
- Add reviewed evidence and score snapshots before showing Evidence Score values.
- Keep Your Values Score withheld until priorities and evidence-backed scoring support it.

## Confirmation

- No fake product images were added.
- No generated product images were added.
- No fake products were added.
- No fake sellers were added.
- No fake evidence was added.
- No fake scores were added.
- No checkout was added.
- No Plus work was added.
- No Local inventory was added.
- No Business, Gov, or Corporate work was added.
- No AI scoring was added.
- No affiliate/referral/commission logic was added.
- No payment influence on score, ranking, visibility, verification, credibility labels, or trust outcomes was added.
- The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
