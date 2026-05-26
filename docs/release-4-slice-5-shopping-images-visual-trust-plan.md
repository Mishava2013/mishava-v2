# Release 4 Slice 5 Shopping Product Images and Visual Trust Polish Plan

## Purpose

Release 4 Slice 5 should make the baby diapers and wipes Shopping POC feel more visually credible while staying honest about evidence limits, image rights, and score readiness.

This is a planning slice only. It should not implement product images, visual changes, database changes, or new product surfaces yet.

## Source of Truth

- `docs/release-4-slice-4-shopping-cleanup-real-data-depth-result.md`
- `docs/release-4-slice-3-result.md`
- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-1-result.md`

## Goal

Plan the next Shopping POC slice: product images, visual polish, and trust-state clarity for the baby diapers/wipes category.

The slice should help Shopping feel more like a credible storefront without pretending that scoring, image rights, or evidence review are more complete than they are.

## Scope

Shopping product images and visual trust polish only.

Do not build:

- checkout
- Plus
- Local inventory
- Business, Gov, or Corporate flows
- AI scoring
- affiliate/referral/commission logic
- broad category expansion
- final scoring math
- business self-serve catalog

Do not add:

- fake products
- fake sellers
- fake evidence
- fake scores
- fake or generated product images
- unsafe scraped images
- paid influence on score, ranking, visibility, verification, credibility labels, or trust outcomes

## 1. Product Image Source Rules

Allowed image sources:

- Manufacturer or brand image URL if the source permits this usage.
- Retailer image URL only if usage is legally safe and reviewed.
- Manually uploaded product image only if Mishava has clear rights to use it.
- Clean placeholder image/card when no safe product image exists.

Rules:

- Do not use fake generated product images.
- Do not use misleading generic product images.
- Do not hotlink images unless the source terms and technical behavior allow it.
- Track image source URL and review status before active display.
- Track rights notes where useful.
- Fallback cards must look intentional and polished, not broken.
- Product identity should remain clear even when no image is available.

Recommendation:

Start with a rights-safe placeholder/fallback system and metadata fields first. Add real product images only after source rights are reviewed product by product.

## 2. Image Metadata

Plan fields on the Shopping product record or a related image metadata table:

- `image_url`
- `image_alt_text`
- `image_source_url`
- `image_source_type`
- `image_review_status`
- `image_last_reviewed_at`
- `image_rights_notes`

Recommended source type values:

- `manufacturer`
- `brand`
- `retailer`
- `manual_upload`
- `placeholder`

Recommended review status values:

- `missing`
- `pending_review`
- `approved`
- `rejected`
- `stale`

Display rule:

Only images with approved rights/review status should render as product imagery. Anything else should use the clean fallback state.

## 3. Shopping Visual Polish

Plan improvements to:

- Shopping landing page
- baby diapers/wipes category page
- product cards
- product detail page
- places-to-buy section
- score/trust badges
- mobile layout

Product card improvements:

- Add a stable image/fallback area with consistent aspect ratio.
- Keep product name, brand, package details, source freshness, and score state scan-friendly.
- Make `Score pending` and `Evidence profile pending` easy to notice without alarming users.
- Keep source-reviewed language visible but compact.
- Avoid card layouts that shift when images are missing.

Product detail improvements:

- Show a larger image/fallback area near product identity.
- Keep package details, brand/manufacturer, source URL, and freshness together.
- Separate trust context from places-to-buy so commercial actions do not look like scoring inputs.
- Add clear “Mishava is not the store” language near places-to-buy.

Places-to-buy improvements:

- Make retailer, price, availability, and freshness easier to compare.
- Keep outbound links visually distinct from Mishava trust badges.
- Continue to avoid any checkout, affiliate, sponsored, or paid-ranking framing.

Mobile improvements:

- Keep image/fallback, product identity, score state, and source freshness visible without horizontal scrolling.
- Keep trust popup triggers easy to tap.
- Avoid oversized cards that make the category page feel sparse.

## 4. Trust-State Clarity

Plan better visual treatment for:

- `Score pending`
- `Evidence profile pending`
- `Draft trust context`
- `Evidence Score` if later available
- `Your Values Score` withheld until valid
- `Source reviewed`
- `Source stale`
- `Source missing`
- `Mishava is not the store`
- `No paid ranking`
- `No commission`

Rules:

- No color-only status communication.
- Use compact text labels plus accessible descriptions.
- Payment/commission language should be visible but not overwhelming.
- Trust badges must not imply certification, final scoring, or verified outcomes.
- `Your Values Score` must not appear unless user priorities and supported evidence-backed scoring data make it valid.

Recommended badge groups:

- Source: `Source reviewed`, `Needs review`, `Stale source`
- Score: `Score pending`, `Evidence profile pending`, `Draft trust context`
- Commerce boundary: `No checkout`, `No commission`, `Mishava is not the store`

## 5. Empty and Fallback States

Plan states:

- No product image available.
- Image source pending review.
- Image source rejected or unsafe.
- No places-to-buy available.
- Source stale.
- Evidence missing.
- Shopping Priorities not completed.
- Your Values Score unavailable.

Fallback image/card guidance:

- Use a quiet, brand-consistent placeholder card.
- Include product category text such as `Diaper product` or `Baby wipes`.
- Include a short label such as `Product image pending rights review`.
- Do not use generic baby/product photography that could be mistaken for the real product.

Real-data-only empty states:

- Keep the tone useful and calm.
- Explain that Mishava only displays reviewed real product/source records.
- Avoid making the page feel broken or unfinished.

## 6. Tests Required

Plan tests for:

- Product cards render a clean fallback when no image exists.
- Product detail renders a clean fallback when no image exists.
- Image alt text exists where an approved image exists.
- Image metadata requires review status before active display if image fields are implemented.
- Unapproved, rejected, stale, or missing image metadata does not render as product imagery.
- No fake/generated product image fixtures are treated as production data.
- Score states remain honest.
- `Your Values Score` remains withheld unless valid.
- Paid fields remain excluded from ranking.
- Commission/affiliate/payment fields do not affect ordering.
- Product cards expose source/trust status.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## 7. Non-Goals

Release 4 Slice 5 should not include:

- checkout
- affiliate links
- image scraping pipeline
- AI product image generation
- Local inventory
- broad category expansion
- final scoring math
- business self-serve catalog
- Plus
- fake images
- fake scores
- fake products
- fake stores

## 8. Acceptance Criteria

Slice 5 implementation can begin only if:

- Image source rules are conservative.
- Shopping looks better without misleading users.
- No unsafe image usage is introduced.
- Image fallbacks are polished and clear.
- Trust states remain honest.
- No score is invented.
- Payment, commission, sponsorship, affiliate, subscription, hosted profile, and paid placement fields remain excluded from ranking and trust outcomes.
- The baby diapers/wipes category remains the only active Shopping POC category for this slice.

## Recommended Implementation Order

1. Add image metadata fields or a product image metadata table.
2. Add safe rendering helpers that only display approved image records.
3. Add polished image fallback components for product cards and product detail pages.
4. Update Shopping cards and product detail layout with stable image/fallback regions.
5. Improve trust-state badges and source freshness visual hierarchy.
6. Add tests for image fallbacks, approved-image gating, score honesty, and paid-field exclusion.
7. Run typecheck, lint, tests, and build.

## Final Planning Recommendation

Implement Slice 5 first with polished fallbacks and metadata guardrails, then add real product images only when the image rights source is reviewed and explicitly approved. This keeps Shopping visually stronger without creating legal risk or trust confusion.
