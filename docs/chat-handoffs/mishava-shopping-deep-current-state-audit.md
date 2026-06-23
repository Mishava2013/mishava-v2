# Mishava Shopping Deep Current-State Audit

Date: June 23, 2026

Purpose: document the current state of Mishava Shopping before starting a focused new chat. This is a review and handoff document only. It does not add product features, products, migrations, DNS/domain changes, Vercel changes, Supabase changes, Stripe/payment, AI provider calls, crawler/scraping, or old-project changes.

## Executive Summary

Mishava Shopping is intended to help users compare products by evidence instead of ads, affiliate incentives, or unsupported marketing claims. The long-term workflow is: create a free Shopping account, save Shopping Priorities, look up a product, see what Mishava knows from real sources, see what is still missing, receive a preliminary evidence/match state when safe, and withhold final Mishava Scores until reviewed evidence and approved scoring logic support them.

Current status:
- `https://shopping.mishava.org` is live.
- It is served by the clean Mishava V2 deployment path, according to prior cutover/verification docs.
- Live route checks in this audit returned HTTP 200 for the Shopping landing, toilet paper category, Kirkland detail, Cashmere detail, Purex detail, and existing-record search.
- Slice 13 senior-friendly copy is live: "Compare products by evidence, not ads," "Mishava is not the store," "No paid ranking," "No commission sorting," and "Mishava is still reviewing this product" appear in live output.
- Shopping is ready for a first older-user guided preview, desktop-first.
- Shopping is not ready for broad public beta or broad self-serve product search.

Genuinely done:
- Live Shopping landing and category/product pages.
- Baby diapers/wipes POC with 8 real reviewed source-backed products.
- Toilet paper POC with 12 real source-backed product records, including Costco/Kirkland, Cashmere, and Purex.
- Real places-to-buy/source rows where available.
- Conservative image metadata and non-photo fallbacks.
- Supplier/manufacturer transparency fields and evidence gap display.
- Shopping Priorities account path.
- Source/evidence cards on toilet paper product pages.
- Score pending/evidence gap language.
- Research task table and source hierarchy/readiness helpers.
- Payment, commission, affiliate, medical-claim, fake-score, and AI-final-outcome guardrails.

Not done:
- Product-not-found research request flow.
- Full product lookup/search experience for products not already in Mishava.
- Human research operations UI/admin queue.
- Reviewed structured claims for scoring.
- Final Evidence Scores or final Your Values Scores.
- Numeric preliminary match.
- Rights-cleared real product images.
- Broad category coverage.
- Checkout, Plus, Local inventory, Business/Gov/Corporate expansion, autonomous web crawler, or AI scoring.

Only planned:
- Release 4 Slice 14 product lookup/search and product-not-found research-request flow.
- Preliminary evidence/match state that remains clearly non-final.
- Source review/admin workflow.
- First reviewed toilet paper claim set.
- Evidence Score Preview rubric.

Blocked:
- Final scores are blocked by reviewed structured claims, scoring methodology/versioning, coverage/recency/confidence rules, and published score snapshots.
- Values Match is blocked by saved priorities plus reviewed product evidence plus a supported calculation.
- Broad public beta is blocked by product lookup/research-request flow, data ops, support/corrections, more categories, image rights strategy, and manual/live testing.

Honest next step:
- Implement Release 4 Slice 14: product lookup/search and research-request flow. It should search existing records by product, brand, category, retailer/source, parent company, manufacturer, private-label owner, and supplier. If not found, it should offer a research request without inventing a product or score.

Irresponsible claims right now:
- "Mishava has final product scores."
- "Mishava has audited/certified these products."
- "Mishava recommends products for Crohn's or any medical condition."
- "Mishava has comprehensive product search."
- "Mishava has complete supplier proof."
- "Mishava Shopping is a full marketplace."
- "Mishava earns commissions" or "paid placement affects ranking."
- "AI verified this product."

## Percent Estimates

Shopping guided preview readiness: 84-87%.
- Why: live domain works, toilet paper path is coherent, first older-user desktop path is ready, and source/evidence gap language is visible.
- Higher if: a guided user walkthrough passes with screenshots and no confusion.
- Lower if: live auth/sign-up or mobile path fails during real use.
- Biggest uncertainty: actual older-user comprehension without a technical guide.

Shopping broad public beta readiness: 43-49%.
- Why: current system is a narrow POC, not a broad product-search platform.
- Higher if: Slice 14 product lookup/research request, data ops, issue reporting, more categories, and source review workflows are built.
- Lower if: search expectations remain mismatched with the narrow data set.
- Biggest uncertainty: research/data maintenance capacity.

Product lookup/search readiness: 45-52%.
- Why: search works for existing records by name/brand/category and related identity fields in `getShoppingProducts`; live `/shopping?q=Kirkland` returns HTTP 200.
- Higher if: not-found research requests are added and user wording explains the limited index.
- Lower if: users expect Google-like product search today.
- Biggest uncertainty: how to connect user requests to internal research tasks without creating fake records.

Account/priorities readiness: 70-78%.
- Why: free Shopping account copy exists, sign-up routes are Shopping-aware, sign-in popup preserves context, and priorities route saves 12 starter answers.
- Higher if: a real account creation, sign-in, sign-out, and priorities save pass on live Shopping.
- Lower if: live Auth redirect/email settings fail.
- Biggest uncertainty: live Supabase Auth/email behavior, not repo code.

Evidence/source card readiness: 76-83%.
- Why: toilet paper detail pages show source title/type/review status/freshness/confidence/supports/does-not-prove/gaps.
- Higher if: more reviewed product/company sources are added and browser screenshots confirm every target product.
- Lower if: source cards feel too dense for non-technical users.
- Biggest uncertainty: user comprehension of "source supports" versus "source does not prove."

Preliminary evidence match readiness: 35-45%.
- Why: the wording and data structures are partly present, but there is no real qualitative match engine beyond "Personal match is not ready yet."
- Higher if: qualitative, non-numeric preliminary match is implemented from reviewed sources and saved priorities.
- Lower if: any preliminary output looks like a final score.
- Biggest uncertainty: defining a useful non-final match state that does not overclaim.

Final Mishava scoring readiness: 18-25%.
- Why: score snapshot foundations and guardrails exist, but final Shopping scoring methodology is not active.
- Higher if: category scoring models, reviewed claims, score snapshots, methodology pages, and corrections/appeals are built.
- Lower if: final scores are rushed from incomplete evidence.
- Biggest uncertainty: approved scoring methodology and review capacity.

Research/data operations readiness: 38-48%.
- Why: research task table/statuses and source hierarchy exist, but admin workflow, assignment, request intake, and review process are minimal.
- Higher if: product request intake, research queue, source review, stale checks, and admin review UI are added.
- Lower if: research remains manual and undocumented.
- Biggest uncertainty: operating model for source freshness and review ownership.

Senior-friendly usability readiness: 78-85%.
- Why: Slice 13 simplified homepage, category, product detail, and priorities language.
- Higher if: first older-user walkthrough succeeds with only light guidance.
- Lower if: product detail still feels too dense or the sign-in/account prompt distracts.
- Biggest uncertainty: actual user behavior on mobile and desktop.

Category/product coverage readiness: 30-38%.
- Why: two narrow categories are present, but broad household/product coverage is not built.
- Higher if: next categories follow the same real-data/source-gated pattern.
- Lower if: users expect common grocery/retail search coverage.
- Biggest uncertainty: how fast real-source data can be maintained.

## Product Workflow Map

Shopping homepage:
- Status: built, live, tested, user-facing quality good for guided preview.
- Live route: `https://shopping.mishava.org` and `/shopping`.
- Main risk: users may still expect all products/search results, while the index is narrow.

Category browse:
- Status: built for baby products, diapers, wipes, toilet paper; other department links use query searches and may return no results.
- Live: yes for the main POC categories.
- Risk: "Household," "Personal care," "Toys," and "Local picks" are not full categories yet.

Toilet paper category:
- Status: built, live, tested, guided-preview ready.
- Live route: `/shopping/categories/toilet-paper`.
- Quality: clear enough for desktop guided preview.
- Risk: no final scores; product details are still dense.

Baby diapers/wipes category:
- Status: built and source-backed with 8 products.
- Live: likely via `/shopping/categories/baby-products`, `/shopping/categories/diapers`, `/shopping/categories/wipes`; not re-screenshotted in this audit.
- Risk: less evidence-depth polish than toilet paper.

Product detail page:
- Status: built, live for target toilet paper products, tested.
- Quality: strong transparency, but lengthy.
- Risk: older users may need guidance through source cards and evidence dimensions.

Source/evidence cards:
- Status: built for toilet paper detail pages using current product/source/places data.
- Live: verified on Kirkland output.
- Risk: source cards are generated from product/source fields, not a full external evidence table with human review records for every claim.

Company/source information:
- Status: built for supplier/manufacturer transparency.
- Live: verified on Kirkland output.
- Risk: many manufacturer/supplier identities remain unknown, correctly shown as gaps.

Account creation from Shopping:
- Status: built and Shopping-aware.
- Live: routes exist; full real account creation not tested in this audit.
- Risk: Supabase Auth email/redirect configuration can still affect the live user experience.

Sign-in from Shopping:
- Status: popup entry points and context preservation tested in repo.
- Live: sign-in prompt appears in live HTML for unauthenticated Shopping pages.
- Risk: needs manual browser click testing after each deployment because this was historically fragile.

Shopping Priorities questionnaire:
- Status: built behind auth, stores 12 starter questions and automatic-zero preferences.
- Live: route exists; account-required behavior not browser-tested in this audit.
- Risk: priorities are useful later, but no final/personal match appears today.

Product lookup/search:
- Status: partially built for existing records.
- Live: `/shopping?q=Kirkland` returns HTTP 200; not-found query shows "No matching products found."
- Risk: no product-not-found research request.

Product-not-found state:
- Status: partially built as empty state only.
- Live: yes, but it only says to try existing categories.
- Risk: this is the clearest Slice 14 gap.

Research-request flow:
- Status: not built for users.
- Existing foundation: internal `shopping_research_tasks` table exists.
- Risk: users cannot yet ask Mishava to research a missing product.

Preliminary evidence/match state:
- Status: partially planned, not fully built.
- Live: current pages say "Personal match is not ready yet."
- Risk: premature match language could be confused with a final score if implemented carelessly.

Score pending explanation:
- Status: built and live.
- Quality: clear, especially after Slice 13.
- Risk: "score not ready" can still feel like a missing feature unless paired with useful evidence.

No-medical-advice guardrails:
- Status: built and tested.
- Live: Kirkland output includes "This is not medical advice" and no medical suitability guarantee.
- Risk: sensitive-use claims must remain source-backed only.

Return flow after login:
- Status: repo tests cover Shopping return paths and stale surface protection.
- Live: not fully browser-tested in this audit.
- Risk: live Auth redirects and cookies require real manual proof.

Mobile vs desktop flow:
- Status: mobile screenshots were captured in Slice 13 and described as usable with caveats.
- Current recommendation: desktop-first guided preview.
- Risk: mobile density on product detail pages.

## Live Shopping Deployment

Live checks performed on June 23, 2026:
- `https://shopping.mishava.org`: HTTP 200, Vercel, matched path `/shopping`.
- `https://shopping.mishava.org/shopping/categories/toilet-paper`: HTTP 200, matched path `/shopping/categories/[slug]`.
- `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls`: HTTP 200, matched path `/shopping/products/[slug]`.
- `https://shopping.mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products`: HTTP 200.
- `https://shopping.mishava.org/shopping/products/purex-bathroom-tissue-kruger-products`: HTTP 200.
- `https://shopping.mishava.org/shopping?q=Kirkland`: HTTP 200.
- Not-found query `DefinitelyNotARealMishavaProduct123`: returned the Shopping page with "No matching products found."

Current live markers observed:
- "Compare products by evidence, not ads."
- "Mishava is not the store."
- "No paid ranking."
- "No commission sorting."
- "Mishava is still reviewing this product."
- "Personal match is not ready yet."
- "Not a product photo" fallback image treatment.
- "What Mishava found."
- "What Mishava still needs."
- "Company/source information."
- "This is not medical advice."
- "Outside scorecards may be evidence references, but they are not Mishava Scores."

Deployment caveats:
- Prior docs confirm the clean Vercel project is `mishava-v2` and Shopping domain cutover is complete.
- Local old remote `origin` historically pointed to `dsuupr-am`; use clean remote/project paths only.
- No DNS/domain/Vercel changes were made in this audit.

Screenshots:
- Existing Slice 13 screenshots are documented under `screenshots/release-4-slice-13/` and remain ignored/uncommitted.
- This audit used HTTP/live HTML checks rather than capturing new screenshots.

## Current Product And Category Coverage

Categories present:
- Baby products.
- Diapers.
- Wipes.
- Toilet paper.
- Query links for household, personal care, toys, and local picks exist but are not true broad categories yet.

Baby diapers/wipes products present: 8 real reviewed Target-source products.
- Pampers Swaddlers Sensitive Disposable Diapers - Size 7 - 44ct.
- Huggies Little Snugglers Diapers - Size 1 - 32ct.
- Millie Moon Luxury Disposable Diapers - Size 8 - 40ct.
- Dyper Charcoal Enhanced Diapers - Size 4 - 44ct.
- Disposable Diapers - Size 4 - 200ct - up&up.
- WaterWipes Sensitive+ Newborn & Baby Wipes - 540ct.
- Huggies Natural Care Sensitive Unscented Baby Wipes - 960ct.
- Pampers Sensitive Baby Wipes - 36ct.

Toilet paper products present: 12 real source-backed records.
- Charmin Ultra Soft Toilet Paper - 18 Mega Rolls.
- Cottonelle Ultra Clean Toilet Paper - 24 Mega Rolls.
- Angel Soft Toilet Paper - 18 Mega Rolls.
- Quilted Northern Ultra Plush Toilet Paper - 18 Mega Rolls.
- Scott 1000 Toilet Paper - 20 Rolls.
- Soft & Strong Toilet Paper - 30 Mega Rolls - up&up.
- Seventh Generation 100% Recycled Toilet Paper - 24 Rolls.
- Reel Premium Bamboo Toilet Paper - 24 Rolls.
- Caboo Tree Free Bamboo Toilet Paper - 24 Rolls.
- Kirkland Signature Bath Tissue - 2-Ply - 380 Sheets - 30 Rolls.
- Cashmere Bathroom Tissue.
- Purex Bathroom Tissue.

Real-source backed:
- Active records require source metadata and approved/reviewed status constraints.
- Product images are intentionally fallback unless rights are approved.
- Places-to-buy rows exist for the baby set and toilet paper set where available.

Placeholders:
- No fake/demo/placeholder production products were found in the current Shopping test/migration evidence.
- Image fallbacks are placeholders in the visual sense, but they are explicitly non-photo and not fake product images.

Ready for guided preview:
- Toilet paper category.
- Kirkland detail.
- Cashmere detail.
- Purex detail.
- One mainstream toilet paper product and one recycled/bamboo product can be used as comparison examples.

Not ready for first user:
- Broad product categories outside the POC.
- Products not already in Mishava.
- Any final-score experience.

## Account And Shopping Priorities

Can a user create an account from Shopping?
- Repo-side: yes, with Shopping-aware sign-up copy and `surface=shopping`.
- Live: sign-up links are present; real account creation was not completed in this audit.

Can a user sign in from Shopping?
- Repo-side: yes, shared popup and context preservation are tested.
- Live: sign-in prompts/buttons are present; manual browser click flow should be rechecked before broad use.

Can the app return the user to Shopping after login?
- Repo-side: yes, tests cover safe `next` and `surface=shopping`.
- Live: needs real browser/account proof.

Can users browse without logging in?
- Yes. The live Shopping/category/product pages render public product evidence.

What requires an account?
- Saving/editing Shopping Priorities.
- Future research requests should require account if tied to a user.
- Basic product browsing should remain public.

Shopping Priorities captured today:
- 12 starter questions: living wages, worker safety, gender fairness, clean water, climate, repairability, local business, community benefit, transparency, anti-corruption, responsible politics, price flexibility.
- Automatic-zero preferences: child labor, forced labor, severe worker harm, major environmental harm, and severe political-violence/dehumanization/basic-rights concerns.
- Personalization enablement and privacy acknowledgement.

Plainness:
- Improved but still somewhat conceptual. Good enough for guided preview, not yet perfect for public self-serve.

Priority rules:
- Priorities do not create final scores.
- Priorities do not change base Evidence Scores.
- Priorities do not create medical suitability claims.
- If priorities exist but evidence is incomplete, current state remains "Personal match is not ready yet" or "More evidence needed."

Still missing:
- A visible useful result after priorities are saved.
- Qualitative match explanations tied only to reviewed evidence.
- Live account creation/priorities save proof.

## Product Lookup And Search

Current search:
- Existing-record search is built in `getShoppingProducts`.
- Search can match product name, brand, category, subcategory, retailer/source, brand display name, private-label owner, parent company, manufacturer, and supplier.
- Live `/shopping?q=Kirkland` returns HTTP 200.

Can search by:
- Product name: yes, existing records.
- Brand: yes, existing records.
- Category/subcategory: yes, existing records.
- Retailer/source: yes, existing records.
- Manufacturer/supplier/private-label owner: yes where fields exist.

Cannot yet:
- Search the web.
- Search products not already in Mishava in a useful way.
- Submit a missing product research request.
- Connect a user search directly to `shopping_research_tasks`.

Current product-not-found behavior:
- Shows "No matching products found" and suggests Toilet paper, Diapers, or Wipes.
- This is honest but not useful enough for the next phase.

Slice 14 should include first:
- Product lookup polish for existing records.
- Better not-found state.
- "Request Mishava research" flow.
- Minimal user-submitted product/request fields.
- Internal research task creation with status.
- Clear no-score/no-medical/no-final-claim language.

Slice 14 should avoid:
- Web crawler.
- Broad scraping.
- AI provider calls.
- Final scores.
- Numeric match.
- Fake product creation.
- Any affiliate/commission/checkout logic.

## Web Research And Preliminary Evidence Concept

Currently built:
- Research task table and statuses.
- Source hierarchy config in `src/lib/shopping.ts`.
- Category-specific toilet paper research template.
- Product source URLs and external evidence reference URLs.
- Evidence source cards on product detail pages.
- Human-review language and guardrails.

Not built:
- Autonomous web/source research.
- User-facing research request flow.
- Claim drafting UI.
- Human review queue/admin console.
- Automated source freshness review.
- AI-assisted research.

Human review:
- Required by the docs and guardrails.
- Current table supports review statuses, but operational workflow is not built.

Outside scorecards:
- Can be stored as evidence references.
- Cannot become Mishava Scores.
- Tests cover this guardrail.

What needs to happen before preliminary evidence match is safe:
- Define qualitative non-numeric labels.
- Use only reviewed source-backed claims.
- Show missing evidence prominently.
- Keep outside scorecards as context only.
- Require saved priorities for personal match.
- Add tests that unreviewed research tasks cannot produce a match.

## Evidence And Source States

| State | Exists now? | Stored? | User shown? | Senior-friendly? | Tested? | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| not searched | Partial | Not explicit for products | No | N/A | No | Product-not-found requests need it |
| sources found | Yes | `source_*`, external refs, task status | Yes as source cards/outside source found | Mostly | Yes | Source can be mistaken for proof |
| evidence drafted | Partial | `draft_claims`, task status | Limited | Needs polish | Partial | Draft facts could confuse users |
| human review needed | Yes | task status/readiness helper | Partly as "Mishava is still reviewing" | Yes | Yes | Internal workflow not built |
| reviewed evidence | Partial | source approved/reviewed fields | Yes for source status | Mostly | Yes | Approved source is not same as reviewed scoring fact |
| evidence gap | Yes | gap notes and helper output | Yes | Mostly | Yes | Dense on product detail |
| stale source | Yes as task/image/source status concepts | Partial | Limited | Needs polish | Partial | No freshness operations yet |
| rejected source | Yes as status options | Partial | Not prominent | N/A | Partial | Rejection workflow not built |

## Preliminary Evidence/Match Rules

Can Mishava show a preliminary match today?
- Not meaningfully. Current UI can show evidence preview and "Personal match is not ready yet."

Should preliminary match be numeric?
- No. The next version should be qualitative only until methodology and reviewed evidence support numbers.

Recommended labels:
- "Early evidence match."
- "Some evidence found."
- "Not enough reviewed evidence yet."
- "Mishava is still reviewing this."
- "Matches some saved priorities, but final score is pending."
- "Evidence profile incomplete."

Recommended confidence:
- Incomplete.
- Low.
- Medium.
- High only after reviewed evidence coverage is strong.

Connection to priorities:
- Use saved priorities to explain relevance only where reviewed claims exist.
- If evidence is incomplete, say "not enough reviewed evidence yet."

Banned labels:
- "Final Mishava Score."
- "Certified score."
- "Medical-safe score."
- "Best for Crohn's."
- "Safe for Crohn's."
- "Guaranteed non-irritating."
- "AI verified."
- "Approved product."
- "Trusted product" without reviewed methodology.

Required rule:
- Preliminary evidence match is not a final Mishava Score.

## Final Scoring And Trust Status

Final Mishava Scores active?
- No.

Product scores active?
- No public final scores for Shopping products.

Company scores active?
- No final company scores in Shopping.

Values-match scores active?
- No final numeric values match.

Coverage/recency/confidence indicators active?
- Partial. Fields exist and UI shows pending/freshness/source status, but final rubric is not active.

Existing scoring logic:
- Requires score snapshot before public score values.
- Draft/rejected claims excluded from scoring elsewhere.
- Shopping products with `evidence_score` require score snapshot and publication fields.
- Toilet paper score-ready status requires review prerequisites.

Before final scores:
- Source-backed structured claims.
- Human review.
- Category scoring version.
- Coverage/recency/confidence rubric.
- Published score snapshots.
- Public methodology explanation.
- Corrections/appeal path.

Payment prevention:
- Payment/affiliate/commission fields are excluded from ranking and tests guard payment firewall behavior.

AI prevention:
- Central AI control is deny-by-default with provider import guardrails and no provider calls enabled.
- AI cannot create final trust outcomes.

## Toilet Paper Test Case

Category clarity:
- The category explains users are viewing real product records, not products sold by Mishava.
- It tells users to click a product to see what Mishava found and what is missing.

Kirkland:
- Present and live.
- Costco is shown as retailer/source, private-label owner, and parent company where supported.
- Costco is not treated as manufacturer.
- Manufacturer/supplier unknowns are shown as evidence gaps.
- Supplier may vary by region/time is disclosed.

Cashmere/Purex:
- Present and live.
- Consumer brands are separated from Kruger Products.
- Kruger Products is treated as manufacturer/brand owner where supported by source context.
- Product-level fiber, recycled, certification, bleaching/process, packaging, and supplier details remain evidence gaps where missing.
- No outside score copied as Mishava Score.

Where to buy:
- Visible as external retailer/source rows.
- Mishava is not the store.
- No checkout.

Evidence questions still needing structured templates/review:
- recycled content
- post-consumer recycled content
- bamboo/tree-free
- FSC or similar certification
- virgin fiber
- bleaching/process claims
- fragrance/free-from/comfort claims
- packaging claims
- brand
- parent company
- manufacturer
- supplier
- retailer
- source supporting each claim
- missing evidence

## Senior-Friendly Usability

Slice 13 improved:
- Homepage headline and 10-second explanation.
- Toilet paper discoverability.
- Product detail hierarchy.
- Plain labels such as "What Mishava found," "What Mishava still needs," and "Mishava is still reviewing this product."
- Account prompt explaining free Shopping account without forcing login.
- No-medical-advice and no-paid-ranking posture.

Current user-facing quality:
- Desktop: ready for guided preview.
- Mobile: usable with caveats; product detail may be dense.
- First older-user walkthrough should be guided, not self-serve.

Still needs improvement:
- Product detail length.
- Research-not-found next step.
- More visual product strategy.
- Live manual test of sign-in/sign-up/priorities.
- User comprehension test around "source found" vs "reviewed evidence" vs "score pending."

## Medical And Care-Sensitive Guardrails

Current status:
- Shopping avoids "best for Crohn's."
- Shopping avoids "safe for Crohn's."
- Shopping avoids "medical-safe score."
- Shopping avoids "medically recommended."
- Shopping avoids "guaranteed safe."
- Live Kirkland output says this is not medical advice and Mishava does not guarantee a product is safe or suitable for any medical condition.
- Comfort/fragrance/free-from/sensitivity claims are shown only as source-supported or not reviewed.

Tests:
- `scripts/release-4-shopping.test.mjs` guards against medical overclaims and verifies sensitive-use language.

Remaining risk:
- Future product/evidence additions must not introduce medical claims.

## Data Model And Migrations

Shopping products:
- Exists in `202605240005_shopping_poc.sql`.
- Extended by real-data, image, toilet paper, supplier transparency migrations.
- Risk: limited coverage.
- Tests: release-4 Shopping tests.

Categories/subcategories:
- Stored on product fields; category pages map known POC slugs.
- Risk: no full category taxonomy/admin.

Places to buy:
- Exists in `shopping_places_to_buy`.
- Real source requirements in `202605240009_release_4_slice_1_shopping_real_data.sql`.
- Risk: price/availability freshness not operationalized.

Evidence/source records:
- Source fields on products and places-to-buy; external evidence reference fields on products.
- Risk: no normalized public source/evidence table per claim yet.

Research tasks:
- Exists in `202605260009_release_4_slice_7_shopping_research_tasks.sql`.
- Service-role managed.
- Risk: not connected to user requests or admin UI.

Supplier/manufacturer fields:
- Added in `202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql`.
- Risk: many unknowns remain, intentionally.

Priority/questionnaire:
- Exists in `shopping_priority_profiles`.
- Extended by `202605240010_release_4_slice_2_shopping_priorities.sql`.
- Risk: no visible final value match yet.

Scoring/preview fields:
- `evidence_score`, `score_label`, `evidence_coverage`, `evidence_recency`, `verification_confidence`, `score_snapshot_id`, `score_published_at`, and `mishava_evidence_review_status`.
- Risk: preview fields can be overread if copy regresses.

Payment/affiliate:
- No commission/affiliate ranking fields are used in sorting.
- Tests guard against paid influence.

## Tests And Verification

Shopping-related tests/scripts:
- `scripts/release-4-shopping.test.mjs`: Shopping data, product detail, priorities, real data, toilet paper, supplier transparency, image fallback, score popup, account flow, evidence cards, medical guardrails, senior-friendly copy.
- `scripts/auth-surface-routing.test.mjs`: Shopping auth context and sign-in/sign-up route safety.
- `scripts/payment-firewall.test.mjs`: payment cannot affect rank/score.
- `scripts/ai-provider-import-guard.test.mjs`: no direct AI provider bypass.
- `scripts/ngo-shopping-deep-pilot-readiness.test.mjs`: shared NGO/Shopping pilot wording expectations.
- `scripts/subdomain-routing.test.mjs`: Shopping host routing among other subdomains.

Checks run on June 23, 2026:
- Shopping/auth/payment/AI guard subset: passed 40/40.
- `npm test`: passed 176/176.
- `supabase migration list --linked`: passed; local/remote aligned through `202605260009`.
- `npm run build`: passed.
- `npm run typecheck`: first failed before generated `.next/types/routes.js` existed, then passed after `npm run build`.
- `npm run lint`: failed locally because ESLint/Next plugin could not resolve `fast-glob`. This was not fixed in this documentation-only audit.

Live route checks:
- Shopping landing: HTTP 200.
- Toilet paper category: HTTP 200.
- Kirkland detail: HTTP 200.
- Cashmere detail: HTTP 200.
- Purex detail: HTTP 200.
- Existing-record search: HTTP 200.
- Made-up search: returns honest "No matching products found" state.

Still untested:
- Real sign-up/sign-in/priorities save on live Shopping.
- Manual browser click of sign-in modal.
- Mobile live walkthrough after latest deployment.
- Product-not-found research request because it is not built.
- Trust popup interactive state via browser automation in this audit.

## Guardrails Confirmation

Current audit found no evidence of:
- Fake scores.
- Fake evidence.
- Fake products.
- Fake suppliers.
- Fake manufacturers.
- Fake images.
- Medical claims.
- Paid ranking.
- Affiliate/commission-driven ranking.
- AI final trust outcomes.
- Outside score copied as Mishava Score.
- Final score before reviewed evidence and approved scoring logic.
- Hidden missing evidence.
- Mishava acting as the store.

Separation confirmed by scope:
- `dsuupr-am` was not touched.
- Old Supabase was not touched.
- No domains/DNS/Vercel settings were changed.

## What Is Missing

Must fix before first older-user guided preview:
- Real manual browser pass through sign-in/sign-up/priorities on live Shopping. Effort: medium. Type: browser test/account ops.
- Confirm the account prompt is not too intrusive for unauthenticated browsing. Effort: small. Type: browser/user test.

Should fix before first older-user guided preview:
- Add clearer "what to do when product is not found" copy or defer to Slice 14. Effort: small. Type: copy/code.
- Recheck mobile product detail density. Effort: small. Type: browser test.

Must fix before broader guided preview:
- Product-not-found research request. Effort: medium. Type: code/data.
- Basic research request admin/review queue. Effort: medium/large. Type: code/ops.
- Feedback/report issue flow beyond mailto or with better routing. Effort: medium. Type: code/ops.
- More source freshness and stale-source handling. Effort: medium. Type: data/ops.

Must fix before public beta:
- Broader category coverage. Effort: large. Type: data/product.
- Research/data operations staffing/process. Effort: large. Type: ops.
- More robust account/support flows. Effort: medium. Type: code/ops.
- Public methodology and correction path for Shopping. Effort: medium. Type: docs/code.
- Stronger image rights process. Effort: medium. Type: legal/data.

Must fix before final Mishava Scores:
- Reviewed structured claims. Effort: large. Type: data/review.
- Approved category scoring rubric. Effort: large. Type: methodology.
- Score versioning and published snapshots for Shopping. Effort: medium/large. Type: code/data.
- External/legal review of claims language. Effort: medium. Type: external review.

Nice to have:
- Saved products/watchlist.
- Better comparison table.
- Guided tour for first users.
- Product image rights workflow.

Later/not now:
- Checkout.
- Plus.
- Local inventory.
- Autonomous crawler.
- AI provider research.
- Broad marketplace.

## What Is Done

Product UI done:
- Shopping landing, category, product detail, account prompt, score explanation popup, non-photo fallback visuals.

Backend/data done:
- Products, places to buy, priorities, image metadata, supplier/manufacturer fields, research tasks, source status fields.

Account/priorities done:
- Free Shopping account path, sign-in popup context tests, Shopping Priorities route and save action.

Source/evidence done:
- Product source fields, external evidence references, evidence cards, source supports/does-not-prove/gaps language.

Research task pipeline done:
- Internal status model and seed tasks for Costco/Kirkland/Cashmere/Purex.

Senior-friendly usability done:
- Slice 13 plain-language Shopping pass.

Tests done:
- 40/40 Shopping/auth/payment/AI subset and 176/176 full suite passed.

Docs done:
- Release 4 Slice 1-14 docs and handoff docs.

Deployment done:
- Shopping live on `shopping.mishava.org`.

Guardrails done:
- No fake data/scores/images, no paid ranking/commission influence, no medical claims, no AI final outcomes.

## Recommended Next Tasks

Next 3:
1. Release 4 Slice 14: Product Lookup/Search and Research-Request Flow. Purpose: let users request research when Mishava does not have a product. Output: result doc. Checks: npm test, Shopping tests, typecheck/build, migration list if migration added, live route checks. Type: code/data/browser. Before first user preview: helpful but not strictly required if guided. Before public beta: required.
2. Shopping Live Account/Priorities Proof. Purpose: prove sign-up, sign-in, priorities save, sign-out, and return path on live Shopping. Output: live account proof result doc with screenshots. Type: browser/ops. Before first user preview: recommended.
3. Shopping Product Detail Density Review. Purpose: confirm older-user comprehension of Kirkland/Cashmere/Purex pages. Output: usability notes/result doc. Type: browser/user test. Before first user preview: recommended.

Next 7:
4. Product Problem/Correction Flow Upgrade. Purpose: replace or supplement mailto with a trackable issue flow.
5. Minimal Research Admin Queue. Purpose: make `shopping_research_tasks` usable internally.
6. First Reviewed Toilet Paper Claim Set. Purpose: create a tiny set of reviewed structured claims without scores.
7. Preliminary Evidence Match Rules. Purpose: define qualitative match labels and tests.
8. Image Rights Workflow. Purpose: decide when real product images can safely display.
9. Baby Diapers/Wipes Evidence Depth Pass. Purpose: bring baby category closer to toilet paper depth.
10. Shopping Public Beta Readiness Audit. Purpose: decide if broader sharing is safe.

Next 14:
11. Source Freshness/Stale Data Workflow.
12. Shopping Support/Feedback Operator Runbook.
13. Category Template Generalization.
14. Saved Products/Watchlist Planning.
15. Public Shopping Methodology Page Draft.
16. Values Match Preview Implementation, qualitative only.
17. First Evidence Score Preview Rubric, non-final.
18. External copy/legal review for product claims.
19. Mobile-specific product detail cleanup.
20. Product comparison table planning.
21. Admin source-review permissions audit.
22. AI-assisted research adapter plan, no provider calls.
23. Broader household category plan.
24. Public beta go/no-go audit.

## New-Chat Start Recommendation

Yes, Shopping is ready to start a new focused chat.

The new chat should focus on Slice 14 product lookup/search and research-request flow, plus live account/priorities proof. It should not start with final scores, AI research, checkout, Plus, broad category expansion, or domain cleanup.

The recommended first Codex task is:
- Plan Release 4 Slice 14B or implement Release 4 Slice 14, depending on whether Jos wants another planning pass. Since a Slice 14 plan already exists, the stronger next task is implementation.
