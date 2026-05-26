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
  assert.match(page, /Baby diapers and wipes POC/);
  assert.doesNotMatch(page, /products from "@\/lib\/sample-data"/);
  assert.doesNotMatch(sampleData, /diaper-review-placeholder/);
  assert.match(page, /No real baby product records found/);
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

test("shopping display shows pending trust context instead of invented scores", () => {
  const page = read("src/app/shopping/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");
  const explainer = read("src/components/ShoppingScoreExplainer.tsx");

  assert.match(page, /getProductTrustLabel/);
  assert.match(page, /formatFreshness/);
  assert.match(page, /Evidence profile pending/);
  assert.match(detail, /Evidence profile pending/);
  assert.match(detail, /No public score appears/);
  assert.match(shopping, /return "Score pending"/);
  assert.match(shopping, /return "Draft trust context"/);
  assert.match(shopping, /return "Evidence profile pending"/);
  assert.match(shopping, /More evidence needed/);
  assert.match(explainer, /No public score value is shown/);
  assert.match(page, /Complete Shopping Priorities to see Your Values Score/);
  assert.doesNotMatch(page, /<option value="values">/);
  assert.doesNotMatch(detail, /Evidence Score 90|Evidence Score 92|Score 88/);
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
  assert.match(shopping, /Product image pending rights review|Product image not available yet/);
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
  assert.match(explainer, /do not change the base\s+Evidence Score/);
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
  assert.doesNotMatch(shopping, /Evidence Score 90|Evidence Score 92|Score 88/);
});

test("shopping category pages render real product records for baby, diaper, and wipe shelves", () => {
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(categoryPage, /getShoppingProducts/);
  assert.match(categoryPage, /ShoppingScoreExplainer/);
  assert.match(categoryPage, /formatFreshness/);
  assert.match(categoryPage, /Reviewed products remain hidden/);
  assert.match(shopping, /isProductInCategory/);
  assert.match(shopping, /category === "baby-products"/);
  assert.match(shopping, /normalizedSubcategory === "diapers"/);
  assert.match(shopping, /normalizedSubcategory === "wipes"/);
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
