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
  assert.match(page, /Baby products POC/);
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

  assert.match(action, /shopping_priority_profiles/);
  assert.match(action, /answeredCount >= 12/);
  assert.match(migration, /priorities_require_minimum_answers/);
});

test("shopping migration does not seed fake products", () => {
  const migration = read("supabase/migrations/202605240005_shopping_poc.sql");
  const realDataMigration = read("supabase/migrations/202605240009_release_4_slice_1_shopping_real_data.sql");

  assert.doesNotMatch(migration, /insert into shopping_products/i);
  assert.doesNotMatch(migration, /insert into shopping_places_to_buy/i);
  assert.doesNotMatch(realDataMigration, /insert into shopping_products/i);
  assert.doesNotMatch(realDataMigration, /insert into shopping_places_to_buy/i);
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

test("shopping display shows pending trust context instead of invented scores", () => {
  const page = read("src/app/shopping/page.tsx");
  const detail = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(page, /getProductTrustLabel/);
  assert.match(detail, /Evidence profile pending/);
  assert.match(detail, /No public score appears/);
  assert.match(shopping, /return "Score pending"/);
  assert.match(shopping, /return "Draft trust context"/);
  assert.doesNotMatch(page, /Your Values Score/);
  assert.doesNotMatch(detail, /Evidence Score 90|Evidence Score 92|Score 88/);
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
