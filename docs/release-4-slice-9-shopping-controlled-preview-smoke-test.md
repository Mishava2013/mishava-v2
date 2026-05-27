# Release 4 Slice 9: Shopping Controlled Preview Smoke Test

## Scope

This smoke test checked the current Mishava Shopping proof of concept for a controlled early preview, especially the toilet paper user. No product features, product rows, migrations, scoring logic, checkout, Plus, Local inventory, Business/Gov/Corporate surfaces, AI scoring, crawler/scraping, affiliate/referral/commission logic, fake products, fake sellers, fake evidence, fake images, fake suppliers, fake manufacturers, fake scores, or medical claims were added.

Old Supabase project status: not touched.

## Source of Truth

- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/release-4-shopping-poc-readiness-audit.md`
- `docs/release-4-slice-6-shopping-toilet-paper-evidence-score-result.md`
- `docs/release-4-slice-5-shopping-images-visual-trust-result.md`
- `docs/release-4-slice-4-shopping-cleanup-real-data-depth-result.md`

## Readiness Rating

Rating: **controlled preview ready, with guided-preview caveats**.

Mishava Shopping is ready to show the toilet paper category to a real interested user as an early, guided evidence/gap walkthrough. It is not public beta ready. The experience is honest about incomplete evidence, supplier uncertainty, score-pending states, and the absence of medical claims.

Best use right now:

- A controlled preview with a short framing note.
- Desktop-first or large-screen review.
- A user who understands this is a preview of Mishava's evidence model, not a finished shopping/scoring product.

Not ready for:

- Public beta.
- Final Mishava Scores.
- Medical suitability claims.
- Unguided broad consumer traffic.
- Checkout or commission-based commerce.

## Smoke Test Summary

### 1. Shopping Landing Page

Result: **pass with polish note**.

Verified:

- Toilet paper is easy to find in the Shopping navigation/category links.
- Baby products/diapers/wipes remain visible.
- Real-data and evidence-first language is visible.
- No-paid-ranking language is visible.
- Score pending / evidence-preview language is visible.
- Product cards use non-photo fallback visuals when no approved image exists.

Polish note:

- The landing page says payment does not change placement and shows no-paid-ranking/no-commission labels, but the exact phrase `Mishava is not the store` is clearer on category and product detail pages than on the landing page.

Screenshot:

- `screenshots/release-4-slice-9-shopping-landing.png`

### 2. Toilet Paper Category

Result: **pass**.

Verified:

- Category opens cleanly.
- Products display correctly.
- Costco/Kirkland appears.
- Cashmere appears.
- Purex appears.
- Product cards show honest score/match state.
- Image fallbacks are clear and non-misleading.
- Product cards do not imply final scores when scores are pending.
- No-paid-ranking language is visible.
- The category includes no-medical-advice language.
- Supplier/manufacturer evidence gaps are visible.

Screenshot:

- `screenshots/release-4-slice-9-toilet-paper-category.png`

### 3. Product Detail Pages

Result: **pass**.

Checked:

- Costco/Kirkland: `kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls`
- Cashmere: `cashmere-bathroom-tissue-kruger-products`
- Purex: `purex-bathroom-tissue-kruger-products`
- Mainstream product: `charmin-ultra-soft-toilet-paper-18-mega-rolls`
- Recycled/tree-free product: `seventh-generation-100-recycled-toilet-paper-24-rolls`

Verified:

- Product identity is shown.
- Brand is shown.
- Retailer/place-to-buy context is shown where available.
- Private-label owner is shown where applicable.
- Parent company/manufacturer/supplier transparency is shown where supported.
- Unknown supplier/manufacturer is shown as an evidence gap.
- Research/evidence status is shown.
- Evidence dimensions are shown.
- Outside scorecards are described as evidence references only, not Mishava Scores.
- No final Mishava Score appears for score-pending products.
- No medical claims appear.
- Score pending / preview language is clear.
- No-paid-ranking and no-commission language is visible.
- `Mishava is not the store` language is visible.

Screenshots:

- `screenshots/release-4-slice-9-kirkland-detail.png`
- `screenshots/release-4-slice-9-cashmere-detail.png`
- `screenshots/release-4-slice-9-purex-detail.png`
- `screenshots/release-4-slice-9-charmin-detail.png`
- `screenshots/release-4-slice-9-seventh-generation-detail.png`

### 4. Shopping Priorities / Values Preview

Result: **pass**.

Verified from the current UI/copy and tests:

- Shopping Priorities are treated as a future personalization layer.
- If evidence is incomplete, no fake `Your Values Score` appears.
- The product pages state that priorities do not change the base Evidence Score.
- `Your Values Match Preview` remains unavailable/pending when evidence is insufficient.
- Existing automated tests confirm values score eligibility requires priorities and published evidence.

### 5. Trust Popup

Result: **pass**.

Checked on Costco/Kirkland product detail.

Verified:

- Popup opens from `Why this score?`.
- Popup explains score-pending state.
- Popup explains known/missing evidence.
- Popup explains source freshness / source status.
- Popup includes no-paid-ranking/no-commission boundaries.
- Popup preserves the rule that outside evidence references are not Mishava Scores.

Screenshot:

- `screenshots/release-4-slice-9-trust-popup.png`

### 6. Mobile / Readability Smoke

Result: **partial**.

Verified:

- Desktop and default browser screenshots are readable.
- Category and product pages have clear headings, badges, fallback images, and tables.
- The content structure is understandable and keyboard/browser accessible at the inspected viewport.

Limitation:

- The in-app browser automation tool did not expose viewport resizing for a true mobile screenshot. Attempted mobile captures stayed at `1280x720`. A real-device or responsive-browser pass should happen before public beta and before sending to a user who is likely to review only on mobile.

Screenshots captured during the attempted mobile pass:

- `screenshots/release-4-slice-9-mobile-shopping-landing.png`
- `screenshots/release-4-slice-9-mobile-toilet-paper-category.png`
- `screenshots/release-4-slice-9-mobile-kirkland-detail.png`

## Toilet Paper User Decision

Can the toilet paper user be invited to view it?

**Yes, for a controlled guided preview.**

Recommended boundaries:

- Frame it as an early evidence/gap walkthrough.
- Ask the user to use desktop or a larger screen for the first pass if possible.
- Make clear that scores are pending and this is not medical advice.
- Ask for feedback on whether the evidence gaps and product distinctions are understandable.

Exact language to use when sharing:

> This is an early Mishava Shopping preview for toilet paper. It shows real product records, source context, supplier/manufacturer transparency, and evidence gaps. Scores are still pending where Mishava has not completed reviewed scoring logic. This is not medical advice and does not claim any product is safe or suitable for Crohn's or any medical condition. Mishava is not the store, does not offer checkout, and does not rank products by commission or paid placement. I would love your feedback on whether the product pages help you understand what Mishava knows, what is missing, and what you would want compared next.

## Top Blockers

Before controlled preview:

- No hard blocker found for a guided preview.
- Confirm the deployed/live URL is reachable before sending it to the user.

Before public beta:

- True mobile viewport/device review.
- Clearer `Mishava is not the store` language on the Shopping landing page.
- More polished values-priorities prompt from product detail when values match is unavailable.
- More reviewed structured claims before any Evidence Score Preview is displayed as anything more than pending.
- Feedback/report issue flow for users to flag wrong product data, stale source links, or missing supplier evidence.

## Top Polish Items

- Add the exact `Mishava is not the store` phrase to the Shopping landing page.
- Add a small `Early preview` banner on product detail pages near the product title.
- Improve mobile card density and table readability after a real mobile pass.
- Make `Your Values Match Preview unavailable` more actionable by linking directly to Shopping Priorities.
- Add a visible `Report an issue with this product data` path.

## Recommended Next 3 Shopping Slices

1. **Release 4 Slice 10: Shopping Controlled Preview Feedback and Issue Reporting**
   - Add a lightweight feedback/report issue flow for product data, source freshness, supplier uncertainty, and confusing score language.
   - Keep it non-commerce and non-scoring.

2. **Release 4 Slice 11: Reviewed Structured Claims for Toilet Paper**
   - Convert a tiny set of source-backed toilet paper evidence into reviewed structured claims.
   - Preserve score-pending status unless the scoring preview method is explicitly supported.

3. **Release 4 Slice 12: First Evidence Score Preview Method Audit**
   - Define and test the first limited, versioned Evidence Score Preview method for one category.
   - Keep outside scorecards as references only and keep payment/firewall exclusions explicit.

## Technical Checks

Commands run:

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm test` — passed, 150/150.
- `npm run build` — passed.
- `supabase migration list --linked` — passed/aligned through `202605260009`.

Browser/local checks:

- Local dev server: `http://127.0.0.1:3000`.
- Shopping landing screenshot captured.
- Toilet paper category screenshot captured.
- Costco/Kirkland detail screenshot captured.
- Cashmere detail screenshot captured.
- Purex detail screenshot captured.
- Charmin detail screenshot captured.
- Seventh Generation detail screenshot captured.
- Kirkland trust popup screenshot captured.

## Confirmations

- No new product features were added.
- No products were added.
- No migrations were added.
- No checkout was built.
- No Plus surface was built.
- No Local inventory was built.
- No Business/Gov/Corporate work was added.
- No AI scoring was added.
- No crawler or scraping system was added.
- No affiliate/referral/commission logic was added.
- No fake products, sellers, evidence, images, suppliers, manufacturers, or scores were added.
- No outside score was copied as a Mishava Score.
- No medical claims were added.
- Payment still cannot affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or report conclusions.
- Old Supabase project was not touched.

