import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("shopping results read from database and do not use placeholder product data", () => {
  const page = read("src/app/shopping/page.tsx");
  const sampleData = read("src/lib/sample-data.ts");

  assert.match(page, /getShoppingProducts/);
  assert.match(page, /Start with toilet paper or baby products/);
  assert.doesNotMatch(page, /products from "@\/lib\/sample-data"/);
  assert.doesNotMatch(sampleData, /diaper-review-placeholder/);
  assert.match(page, /No matching products found/);
  assert.doesNotMatch(page, /Shopping not publicly available|Open Mishava NGO|Request access/);
  assert.doesNotMatch(page, /Pickup nearby|Ships today|Evidence checked|Small business|Family owned/);
});

test("product detail reads places to buy from database", () => {
  const page = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(page, /getShoppingProductBySlug/);
  assert.match(shopping, /shopping_places_to_buy/);
  assert.match(page, /No places to buy loaded/);
  assert.match(page, /formatPrice/);
  assert.match(page, /formatFreshness/);
  assert.match(page, /No commission ranking/);
});

test("shopping schema requires score snapshot before public score values", () => {
  const migration = read("supabase/migrations/202605240005_shopping_poc.sql");

  assert.match(migration, /shopping_products_score_requires_snapshot/);
  assert.match(migration, /score_snapshot_id is not null/);
  assert.match(migration, /score_published_at is not null/);
});

test("shopping priorities persist to database with 12-answer minimum", () => {
  const action = read("src/app/app/shopping-priorities/actions.ts");
  const migration = read("supabase/migrations/202605240005_shopping_poc.sql");
  const slice2Migration = read("supabase/migrations/202605240010_release_4_slice_2_shopping_priorities.sql");

  assert.match(action, /shopping_priority_profiles/);
  assert.match(action, /answeredCount >= 12/);
  assert.match(action, /shoppingPriorityConsentVersion/);
  assert.match(action, /privacy_acknowledged_at/);
  assert.match(migration, /priorities_require_minimum_answers/);
  assert.match(slice2Migration, /consent_version/);
  assert.match(slice2Migration, /privacy_acknowledged_at/);
});

test("shopping migration does not seed fake products", () => {
  const migration = read("supabase/migrations/202605240005_shopping_poc.sql");
  const realDataMigration = read("supabase/migrations/202605240009_release_4_slice_1_shopping_real_data.sql");
  const prioritiesMigration = read("supabase/migrations/202605240010_release_4_slice_2_shopping_priorities.sql");

  assert.doesNotMatch(migration, /insert into shopping_products/i);
  assert.doesNotMatch(migration, /insert into shopping_places_to_buy/i);
  assert.doesNotMatch(realDataMigration, /insert into shopping_products/i);
  assert.doesNotMatch(realDataMigration, /insert into shopping_places_to_buy/i);
  assert.doesNotMatch(prioritiesMigration, /insert into/i);
});

test("shopping real-data readiness requires source metadata before active records", () => {
  const migration = read("supabase/migrations/202605240009_release_4_slice_1_shopping_real_data.sql");

  assert.match(migration, /shopping_products_active_requires_real_source/);
  assert.match(migration, /source_review_status = 'approved'/);
  assert.match(migration, /source_name is not null/);
  assert.match(migration, /source_url is not null/);
  assert.match(migration, /source_captured_at is not null/);
  assert.match(migration, /shopping_places_to_buy_active_requires_real_source/);
});

test("Slice 4 seeds a narrow reviewed baby diapers and wipes data set only", () => {
  const migration = read("supabase/migrations/202605260004_release_4_slice_4_shopping_real_product_depth.sql");

  assert.match(migration, /baby diapers\/wipes/);
  assert.match(migration, /product_subcategory/);
  assert.match(migration, /'diapers'/);
  assert.match(migration, /'wipes'/);
  assert.match(migration, /source_review_status/);
  assert.match(migration, /'approved'/);
  assert.match(migration, /https:\/\/www\.target\.com\/p\/-\/A-81041950/);
  assert.match(migration, /https:\/\/www\.target\.com\/p\/-\/A-92559390/);

  const productRows = migration.match(/4f37f4fa-ec28-4390-a48a-7bd9ee4b6e0[1-8]/g) ?? [];
  const uniqueProducts = new Set(productRows);
  assert.equal(uniqueProducts.size, 8);

  assert.doesNotMatch(migration, /placeholder|demo|sample|fake/i);
  assert.doesNotMatch(migration, /affiliate|commission|paid placement|sponsored ranking/i);
  assert.doesNotMatch(migration, /Evidence Score 90|Evidence Score 92|Score 88/);
});

test("Slice 6 seeds a narrow reviewed toilet paper data set with score guardrails", () => {
  const migration = read("supabase/migrations/202605260007_release_4_slice_6_toilet_paper_evidence_readiness.sql");

  assert.match(migration, /toilet paper POC/);
  assert.match(migration, /'toilet-paper'/);
  assert.match(migration, /recycled_content_claim/);
  assert.match(migration, /bamboo_fsc_claim/);
  assert.match(migration, /virgin_fiber_claim/);
  assert.match(migration, /external_evidence_reference_url/);
  assert.match(migration, /mishava_evidence_review_status/);
  assert.match(migration, /shopping_products_toilet_paper_score_requires_mishava_review/);
  assert.match(migration, /mishava_evidence_review_status = 'score_ready'/);
  assert.match(migration, /evidence_score is null/);
  assert.match(migration, /score_snapshot_id is null/);
  assert.match(migration, /https:\/\/www\.target\.com\/p\/-\/A-78603885/);
  assert.match(migration, /https:\/\/www\.target\.com\/p\/-\/A-94731844/);
  assert.match(migration, /https:\/\/www\.nrdc\.org\/resources\/issue-tissue/);
  assert.match(migration, /External tissue sustainability scorecards may be used as evidence references only/);
  assert.match(migration, /no external score is copied as a Mishava Score/);

  const productRows = migration.match(/6c2f3b20-9e3a-4a81-8c6e-4ef8f3b9f00[1-9]/g) ?? [];
  const uniqueProducts = new Set(productRows);
  assert.equal(uniqueProducts.size, 9);

  assert.doesNotMatch(migration, /placeholder|demo|sample|fake/i);
  assert.doesNotMatch(migration, /affiliate|paid placement|sponsored ranking/i);
  assert.doesNotMatch(migration, /Evidence Score 90|Evidence Score 92|Score 88/);
});

test("Slice 7 adds reusable supplier transparency fields and confidence guardrails", () => {
  const migration = read("supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql");

  assert.match(migration, /retailer_name/);
  assert.match(migration, /brand_display_name/);
  assert.match(migration, /private_label_owner/);
  assert.match(migration, /parent_company/);
  assert.match(migration, /manufacturer_name/);
  assert.match(migration, /supplier_name/);
  assert.match(migration, /manufacturer_source_url/);
  assert.match(migration, /supplier_source_url/);
  assert.match(migration, /manufacturer_confidence/);
  assert.match(migration, /supplier_confidence/);
  assert.match(migration, /shopping_products_verified_manufacturer_requires_source/);
  assert.match(migration, /shopping_products_verified_supplier_requires_source/);
  assert.match(migration, /shopping_products_active_requires_supplier_context/);
  assert.match(migration, /shopping_products_toilet_paper_score_ready_requires_supplier_context/);
});

test("Slice 7 handles Costco/Kirkland without guessing manufacturer or supplier", () => {
  const migration = read("supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql");

  assert.match(migration, /Kirkland Signature Bath Tissue/);
  assert.match(migration, /Costco private-label toilet paper record/);
  assert.match(migration, /'Costco',\n    'Kirkland Signature',\n    'Costco'/);
  assert.match(migration, /Manufacturer and supplier are not publicly verified/);
  assert.match(migration, /Supplier may vary by region or time/);
  assert.match(migration, /'unknown',\n    'unknown'/);
  assert.doesNotMatch(migration, /Costco manufactures/i);
  assert.doesNotMatch(migration, /Costco is the manufacturer/i);
});

test("Slice 7 adds Kruger Products coverage without confusing Kruger with Kroger", () => {
  const migration = read("supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql");

  assert.match(migration, /Cashmere Bathroom Tissue/);
  assert.match(migration, /Purex Bathroom Tissue/);
  assert.match(migration, /Kruger Products/);
  assert.match(migration, /manufacturer and brand owner/);
  assert.match(migration, /Product-level fiber sourcing, recycled content, bleaching\/process, packaging, and supplier details remain evidence gaps/);
  assert.match(migration, /has not copied any outside score as a Mishava Score/i);
  assert.doesNotMatch(migration, /Kroger/);
});

test("shopping supplier transparency helpers expose unknowns as evidence gaps", () => {
  const shopping = read("src/lib/shopping.ts");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const page = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");

  assert.match(shopping, /shoppingCategoryResearchTemplates/);
  assert.match(shopping, /requiredSupplierFields/);
  assert.match(shopping, /manufacturer confidence/);
  assert.match(shopping, /supplier confidence/);
  assert.match(shopping, /getSupplierTransparencyLabels/);
  assert.match(shopping, /Manufacturer not verified/);
  assert.match(shopping, /Supplier not verified/);
  assert.match(shopping, /hasSupplierEvidenceGap/);
  assert.match(shopping, /verified manufacturer source/);
  assert.match(shopping, /verified supplier source/);
  assert.match(detail, /Company\/source information/);
  assert.match(detail, /retailer or\s+private-label owner is not treated as the manufacturer/);
  assert.match(page, /Why Mishava is still reviewing/);
  assert.match(categoryPage, /Why Mishava is still reviewing/);
});

test("Slice 7 research task model tracks reusable Shopping research workflow status", () => {
  const migration = read("supabase/migrations/202605260009_release_4_slice_7_shopping_research_tasks.sql");
  const shopping = read("src/lib/shopping.ts");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(migration, /create table if not exists public\.shopping_research_tasks/);
  assert.match(migration, /research_needed/);
  assert.match(migration, /source_found/);
  assert.match(migration, /claim_drafted/);
  assert.match(migration, /human_review_needed/);
  assert.match(migration, /reviewed/);
  assert.match(migration, /evidence_gap/);
  assert.match(migration, /stale/);
  assert.match(migration, /rejected/);
  assert.match(migration, /source_count integer not null default 0/);
  assert.match(migration, /unresolved_gap_count integer not null default 0/);
  assert.match(migration, /confidence_summary/);
  assert.match(migration, /Service role can manage shopping research tasks/);
  assert.match(migration, /Costco and Kirkland Signature identity reviewed; manufacturer and supplier remain unknown/);
  assert.match(migration, /Cashmere consumer brand and Kruger Products manufacturer\/brand-owner relationship reviewed/);
  assert.match(migration, /Purex consumer brand and Kruger Products manufacturer\/brand-owner relationship reviewed/);
  assert.match(shopping, /shoppingResearchTaskStatuses/);
  assert.match(shopping, /shoppingSourceHierarchy/);
  assert.match(shopping, /getShoppingResearchReadiness/);
  assert.match(detail, /Still needed before a final score/);
  assert.doesNotMatch(migration, /create table .*crawler|create table .*scrap|create table .*score/i);
});

test("Slice 7 result doc confirms product coverage and preview readiness honestly", () => {
  const result = read("docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md");

  assert.match(result, /Costco\/Kirkland exists as an active Shopping product record and an internal research task/);
  assert.match(result, /Cashmere and Purex exist as active Shopping product records and internal research tasks/);
  assert.match(result, /fields live directly on `shopping_products`, not only on research tasks/);
  assert.match(result, /Product detail and score-explanation UI separate retailer\/source, consumer brand, private-label owner, parent company, manufacturer, supplier/);
  assert.match(result, /Unknown manufacturer\/supplier values remain visible evidence gaps instead of guessed identities/);
  assert.match(result, /not yet ready for a scored controlled consumer preview/);
  assert.match(result, /Score pending/);
  assert.match(result, /Evidence profile pending/);
  assert.doesNotMatch(result, /controlled-preview-ready/i);
});

test("shopping display shows pending trust context instead of invented scores", () => {
  const page = read("src/app/shopping/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");
  const explainer = read("src/components/ShoppingScoreExplainer.tsx");

  assert.match(page, /getProductTrustLabel/);
  assert.match(page, /formatFreshness/);
  assert.match(page, /Mishava is still reviewing this product/);
  assert.match(detail, /No final score is shown/);
  assert.match(detail, /Outside scorecards may be evidence references,\s+but they are not Mishava Scores/);
  assert.match(shopping, /return "Score pending"/);
  assert.match(shopping, /return "Draft trust context"/);
  assert.match(shopping, /return "Evidence profile pending"/);
  assert.match(shopping, /More evidence needed/);
  assert.match(explainer, /Mishava is still reviewing this product/);
  assert.match(page, /Create a free Shopping account/);
  assert.match(page, /Mishava to remember your priorities/);
  assert.doesNotMatch(page, /<option value="values">/);
  assert.doesNotMatch(detail, /Evidence Score 90|Evidence Score 92|Score 88/);
});

test("Slice 8 toilet paper preview uses conservative score and match language", () => {
  const page = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(page, /Mishava is reviewing/);
  assert.doesNotMatch(page, /Evidence status/);
  assert.match(page, /Some products have source records but no final score yet/);
  assert.match(categoryPage, /Compare real toilet paper products/);
  assert.match(categoryPage, /why a final score is not shown yet/);
  assert.match(categoryPage, /Create a free Shopping account for personal match previews/);
  assert.match(detail, /What Mishava found/);
  assert.match(detail, /Personal match is not ready yet/);
  assert.match(detail, /Not a completed public score/);
  assert.match(shopping, /Evidence review preview/);
  assert.match(shopping, /Personal match is not ready yet/);
  assert.match(shopping, /getToiletPaperPreview/);
  assert.doesNotMatch(page + categoryPage + detail + shopping, /Final Mishava Score|certified score|medical-safe score|best for Crohn|guaranteed non-irritating/i);
});

test("Slice 8 toilet paper preview surfaces evidence dimensions without creating scores", () => {
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(shopping, /getToiletPaperEvidenceDimensions/);
  assert.match(shopping, /Softness\/comfort claim/);
  assert.match(shopping, /Fragrance\/free-from claim/);
  assert.match(shopping, /Recycled content/);
  assert.match(shopping, /Post-consumer recycled content/);
  assert.match(shopping, /Bamboo\/tree-free\/FSC claim/);
  assert.match(shopping, /Virgin fiber reliance/);
  assert.match(shopping, /Bleaching\/process claims/);
  assert.match(shopping, /Packaging claims/);
  assert.match(shopping, /Brand\/manufacturer\/supplier transparency/);
  assert.match(shopping, /Third-party scorecard\/reference/);
  assert.match(shopping, /Recorded as evidence context only\. It is not copied as a Mishava Score/);
  assert.match(detail, /What Mishava is checking/);
  assert.match(detail, /unreviewed research notes do not become\s+score facts/);
  assert.match(detail, /This is not medical advice/);
  assert.match(detail, /does not guarantee\s+that a product is safe or suitable for any medical\s+condition/);
  assert.doesNotMatch(shopping, /research task.*score facts/i);
});

test("Slice 8 result documents preview readiness without score or medical overclaims", () => {
  const result = read("docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md");

  assert.match(result, /controlled preview ready for an evidence\/gap walkthrough/);
  assert.match(result, /No final Mishava Scores were invented/);
  assert.match(result, /No medical claims were added/);
  assert.match(result, /No migration or seed process was needed/);
  assert.match(result, /Old Supabase project was not touched/);
  assert.doesNotMatch(result, /certified score|medical-safe score|guaranteed non-irritating|best for Crohn/i);
});

test("shopping product images use approved metadata or a non-photo fallback", () => {
  const page = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const component = read("src/components/ShoppingProductImage.tsx");
  const shopping = read("src/lib/shopping.ts");
  const migration = read("supabase/migrations/202605260006_release_4_slice_5_shopping_image_metadata.sql");

  assert.match(page, /ShoppingProductImage/);
  assert.match(categoryPage, /ShoppingProductImage/);
  assert.match(detail, /ShoppingProductImage/);
  assert.match(component, /hasApprovedProductImage/);
  assert.match(shopping, /Image rights being reviewed|Not a product photo/);
  assert.match(component, /role="img"/);
  assert.match(component, /aria-label/);
  assert.match(shopping, /image_review_status === "approved"/);
  assert.match(shopping, /image_alt_text/);
  assert.match(shopping, /image_source_url/);
  assert.match(migration, /image_review_status text not null default 'missing'/);
  assert.match(migration, /shopping_products_approved_image_requires_reviewed_rights/);
  assert.match(migration, /image_last_reviewed_at is not null/);
  assert.match(migration, /image_rights_notes is not null/);
  assert.match(migration, /No product image is displayed until image rights are reviewed and approved/);
  assert.doesNotMatch(component, /generated|fake|ai product image/i);
});

test("shopping visual polish keeps score, source, and commerce boundaries explicit", () => {
  const css = read("src/app/globals.css");
  const page = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(css, /product-image-fallback/);
  assert.match(css, /tag-score/);
  assert.match(css, /tag-source/);
  assert.match(css, /tag-commerce/);
  assert.match(page, /No commission/);
  assert.match(categoryPage, /No paid ranking/);
  assert.match(detail, /No paid placement/);
  assert.match(detail, /Mishava is not the store/);
  assert.match(detail, /placeholder stores/);
  assert.doesNotMatch(page, /<img alt="" src=\{product\.image_url\}/);
  assert.doesNotMatch(categoryPage, /<img alt="" src=\{product\.image_url\}/);
});

test("shopping score explanation popup is accessible and policy-forward", () => {
  const page = read("src/app/shopping/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const explainer = read("src/components/ShoppingScoreExplainer.tsx");

  assert.match(page, /ShoppingScoreExplainer/);
  assert.match(detail, /ShoppingScoreExplainer/);
  assert.match(explainer, /role="dialog"/);
  assert.match(explainer, /aria-modal="true"/);
  assert.match(explainer, /aria-labelledby/);
  assert.match(explainer, /aria-describedby/);
  assert.match(explainer, /Escape/);
  assert.match(explainer, /Close score explanation/);
  assert.match(explainer, /Payment does not affect this score, ranking, or verification/);
  assert.match(explainer, /does not earn shopping commissions from outbound links/);
  assert.match(explainer, /do not\s+change the base Evidence Score/);
  assert.match(explainer, /Off means no red-line filtering/);
  assert.match(explainer, /visible hidden count/);
});

test("shopping score explanation helper uses real product state only", () => {
  const shopping = read("src/lib/shopping.ts");

  assert.match(shopping, /buildShoppingScoreExplanation/);
  assert.match(shopping, /hasPublishedEvidenceScore\(product\)/);
  assert.match(shopping, /score: hasEvidenceScore \? Number\(product\.evidence_score\) : null/);
  assert.match(shopping, /sourceReviewStatus|source_review_status|sourceStatus/);
  assert.match(shopping, /Product summary recorded from source/);
  assert.match(shopping, /Source freshness/);
  assert.match(shopping, /published score snapshot/);
  assert.match(shopping, /getEvidenceReadinessLabels/);
  assert.match(shopping, /Outside scorecard\/reference recorded as evidence only, not a Mishava Score/);
  assert.match(shopping, /toilet paper scoring version/);
  assert.match(shopping, /Mishava-reviewed tissue sourcing claims/);
  assert.doesNotMatch(shopping, /Evidence Score 90|Evidence Score 92|Score 88/);
});

test("shopping category pages render real product records for baby, diaper, wipe, and toilet paper shelves", () => {
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(categoryPage, /getShoppingProducts/);
  assert.match(categoryPage, /ShoppingScoreExplainer/);
  assert.match(categoryPage, /formatFreshness/);
  assert.match(categoryPage, /Mishava only shows products with real source records/);
  assert.match(shopping, /isProductInCategory/);
  assert.match(shopping, /category === "baby-products"/);
  assert.match(shopping, /normalizedSubcategory === "diapers"/);
  assert.match(shopping, /normalizedSubcategory === "wipes"/);
  assert.match(categoryPage, /toilet-paper/);
  assert.match(categoryPage, /Outside scorecards can help Mishava identify evidence/);
  assert.match(shopping, /normalizedSubcategory === category/);
});

test("shopping priorities page can save, update, and retake red-line settings", () => {
  const page = read("src/app/app/shopping-priorities/page.tsx");
  const action = read("src/app/app/shopping-priorities/actions.ts");

  assert.match(page, /Update priorities/);
  assert.match(page, /defaultValue=\{answers\[question\.id\]/);
  assert.match(page, /defaultValue=\{zeroRules\[`zero_rule_/);
  assert.match(page, /privacyAcknowledged/);
  assert.match(page, /do not change any company or product Evidence Score/);
  assert.match(action, /sanitizeRedLineMode/);
});

test("your values score eligibility requires priorities and published evidence", () => {
  const shopping = read("src/lib/shopping.ts");

  assert.match(shopping, /getYourValuesScoreState/);
  assert.match(shopping, /priorityProfile\.answered_count < 12/);
  assert.match(shopping, /!hasPublishedEvidenceScore\(product\)/);
  assert.match(shopping, /more_evidence_needed/);
  assert.match(shopping, /complete_priorities/);
  assert.doesNotMatch(shopping, /payment_status|subscription_tier|affiliate_fee|referral_fee|sales_commission|paid_placement/i);
});

test("places to buy sorting excludes commission, affiliate, sponsorship, and paid placement", () => {
  const shopping = read("src/lib/shopping.ts");

  assert.match(shopping, /sortPlacesToBuy/);
  assert.match(shopping, /availabilityRank/);
  assert.match(shopping, /price_cents/);
  assert.doesNotMatch(shopping, /commission/i);
  assert.doesNotMatch(shopping, /affiliate/i);
  assert.doesNotMatch(shopping, /sponsor/i);
  assert.doesNotMatch(shopping, /paid_placement|paidBoost|paid_boost/i);
});

test("Slice 12 account flow preserves Shopping return paths for first-user setup", () => {
  const modal = read("src/components/SignInModal.tsx");
  const signUp = read("src/app/auth/sign-up/page.tsx");
  const signIn = read("src/app/auth/sign-in/page.tsx");
  const actions = read("src/app/auth/actions.ts");
  const submitRoute = read("src/app/auth/sign-in/submit/route.ts");

  assert.match(modal, /auth\/sign-up\?\$\{target\.toString\(\)\}/);
  assert.match(modal, /pathname === "\/auth\/sign-up"/);
  assert.match(modal, /window\.location\.search/);
  assert.match(modal, /getCurrentSurfaceRoot/);
  assert.match(modal, /safeAuthSurface/);
  assert.match(modal, /inferAuthSurface/);
  assert.match(modal, /surface\?: AuthSurface/);
  assert.match(modal, /hostRootSurfacePaths/);
  assert.match(modal, /shopping: "\/shopping"/);
  assert.match(modal, /local: "\/local"/);
  assert.match(modal, /stripAuthParams/);
  assert.match(modal, /target\.set\("surface", authSurface\)/);
  assert.doesNotMatch(modal, /queryWantsSignIn \? "\/app"/);
  assert.match(modal, /router\.push\(`\/\?\$\{target\.toString\(\)\}`\)/);
  assert.match(modal, /Sign in here and keep your place/);
  assert.match(signUp, /getSignUpContext/);
  assert.match(signUp, /surface === "shopping"/);
  assert.match(signUp, /safeSignUpSurface/);
  assert.match(signUp, /Create your free Mishava Shopping account/);
  assert.match(signUp, /nextPath === "\/"/);
  assert.match(signUp, /Shopping Priorities/);
  assert.match(signUp, /Create free Shopping account/);
  assert.match(signUp, /free preview account/);
  assert.match(signUp, /Already have a Shopping account/);
  assert.match(signUp, /You can browse Shopping without an account/);
  assert.match(signUp, /Create your Mishava Business account/);
  assert.match(signUp, /Create your Mishava Local account/);
  assert.match(signUp, /Create your Mishava Corporate account/);
  assert.match(signUp, /Create your Mishava Government account/);
  assert.match(signUp, /Create your Mishava Support account/);
  assert.match(signUp, /Create your Mishava Trust account/);
  assert.match(signUp, /name="next"/);
  assert.match(signUp, /name="surface"/);
  assert.match(signUp, /return to Shopping Priorities/);
  assert.match(signIn, /redirect\(`\/\?\$\{target\.toString\(\)\}`\)/);
  assert.match(signIn, /target\.set\("surface", surface\)/);
  assert.doesNotMatch(signIn, /PageHeader|auth-grid|auth-card|Use your account to save Shopping Priorities/);
  assert.match(actions, /safeAuthNextPath/);
  assert.match(actions, /safeAuthSurface/);
  assert.match(actions, /appendAuthNotice/);
  assert.match(actions, /redirect\(nextPath \?\? "\/app"\)/);
  assert.doesNotMatch(actions, /nextPath \?\? "\/ngo\/onboarding/);
  assert.match(submitRoute, /safeNextPath/);
  assert.match(submitRoute, /new URL\(nextPath, request\.url\)/);
  assert.doesNotMatch(
    modal + signUp + signIn + actions + submitRoute,
    /best for Crohn|safe for Crohn|medical-safe|guaranteed non-irritating|medically recommended/i,
  );
});

test("Slice 12 Shopping Priorities explains preview limits and returns to toilet paper", () => {
  const priorities = read("src/app/app/shopping-priorities/page.tsx");
  const shoppingPage = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const productPage = read("src/app/shopping/products/[slug]/page.tsx");
  const shoppingPrompt = read("src/components/ShoppingAccountPrompt.tsx");

  assert.match(priorities, /Shopping Priorities are the free profile Mishava uses/);
  assert.match(priorities, /free profile Mishava uses to remember what/);
  assert.match(priorities, /do not\s+create a final score/);
  assert.match(priorities, /do not change the base\s+Evidence Score/);
  assert.match(priorities, /do not\s+make medical suitability claims/);
  assert.match(priorities, /Return to the toilet paper preview/);
  assert.match(priorities, /Back to Shopping/);
  assert.match(priorities, /A personal fit preview can appear only/);
  assert.doesNotMatch(
    priorities + shoppingPage + categoryPage,
    /best for Crohn|safe for Crohn|medical-safe|guaranteed non-irritating|medically recommended/i,
  );
  assert.match(shoppingPage, /Create a free Shopping account/);
  assert.match(shoppingPage, /signIn=1&next=%2Fapp%2Fshopping-priorities&surface=shopping/);
  assert.doesNotMatch(shoppingPage, /href="\/app\/shopping-priorities"/);
  assert.doesNotMatch(categoryPage, /href="\/app\/shopping-priorities"/);
  assert.doesNotMatch(productPage, /href="\/app\/shopping-priorities"/);
  assert.match(shoppingPage, /personal match previews/);
  assert.match(categoryPage, /Create a free Shopping account for personal match previews/);
  assert.match(shoppingPrompt, /Free Shopping account/);
  assert.match(shoppingPrompt, /Save your Shopping priorities/);
  assert.match(shoppingPrompt, /Sign in if you already have a Mishava account/);
  assert.match(shoppingPrompt, /Create free Shopping account/);
  assert.match(shoppingPrompt, /surface: "shopping"/);
  assert.match(shoppingPrompt, /do not create final scores/);
});

test("Slice 12 product detail shows source-backed evidence cards without final scores", () => {
  const detail = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(detail, /type EvidenceSourceCard/);
  assert.match(detail, /Source details/);
  assert.match(detail, /Mishava keeps product, company, maker,\s+supplier, and seller information separate/);
  assert.match(detail, /Claim summary/);
  assert.match(detail, /What this source supports/);
  assert.match(detail, /What this source does not prove/);
  assert.match(detail, /Missing evidence gaps/);
  assert.match(detail, /Open evidence source/);
  assert.match(detail, /does not create a final score/);
  assert.match(detail, /does not create checkout, commission ranking, medical suitability, or a Mishava Score/);
  assert.match(detail, /Outside scorecards or rankings are not Mishava Scores/);
  assert.match(detail, /Comfort, fragrance-free, or\s+sensitivity-related claims are shown only when\s+source-supported/);
  assert.match(detail, /Ask a medical professional for\s+medical suitability/);
  assert.match(detail, /unreviewed research notes do not become\s+score facts/);
  assert.doesNotMatch(
    detail,
    /best for Crohn|safe for Crohn|medical-safe|guaranteed non-irritating|medically recommended/i,
  );
});

test("Slice 12 evidence source display requires URLs, review status, and gap language", () => {
  const detail = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(detail, /url: product\.source_url \?\? product\.product_url/);
  assert.match(detail, /reviewedStatus: product\.source_review_status/);
  assert.match(detail, /reviewedDate: product\.source_captured_at/);
  assert.match(detail, /url: product\.brand_sourcing_policy_url/);
  assert.match(detail, /url: product\.external_evidence_reference_url/);
  assert.match(detail, /url: place\.source_url \?\? place\.url/);
  assert.match(detail, /Source URL not available for public review/);
  assert.match(detail, /Product-level claims still need Mishava review/);
  assert.match(detail, /Mishava-reviewed structured claims and a supported scoring method are still required/);
});

test("Slice 13 senior-friendly Shopping copy keeps the toilet paper path plain", () => {
  const page = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const priorities = read("src/app/app/shopping-priorities/page.tsx");
  const signIn = read("src/app/auth/sign-in/page.tsx");
  const explainer = read("src/components/ShoppingScoreExplainer.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(page, /Compare products by evidence, not ads/);
  assert.match(page, /Mishava is not the store and\s+does not sell these products/);
  assert.match(page, /Some products have source records but no final score yet/);
  assert.match(page, /Create a free Shopping account/);
  assert.match(page, /set Shopping Priorities/);
  assert.match(categoryPage, /Choose a toilet paper product to review/);
  assert.match(categoryPage, /Click a product to see what Mishava found/);
  assert.match(detail, /Where to buy/);
  assert.match(detail, /Retailer links are source records/);
  assert.match(detail, /What Mishava found/);
  assert.match(detail, /What Mishava still needs/);
  assert.match(detail, /Company\/source information/);
  assert.match(detail, /Mishava is still reviewing this product/);
  assert.match(priorities, /Tell Mishava what matters to you/);
  assert.match(priorities, /You can browse products\s+without an account/);
  assert.match(priorities, /create a free Shopping account/);
  assert.match(signIn, /signIn: "1"/);
  assert.doesNotMatch(signIn, /Use your account to save Shopping Priorities/);
  assert.doesNotMatch(signIn, /NGO evidence/);
  assert.match(explainer, /What Mishava found/);
  assert.match(explainer, /What Mishava still needs/);
  assert.match(shopping, /Outside source found/);
  assert.doesNotMatch(
    page + categoryPage + detail + priorities + signIn + explainer + shopping,
    /best for Crohn|safe for Crohn|medical-safe|guaranteed non-irritating|medically recommended/i,
  );
});
