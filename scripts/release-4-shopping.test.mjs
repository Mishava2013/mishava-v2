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
  assert.doesNotMatch(page, /products from "@\/lib\/sample-data"/);
  assert.doesNotMatch(sampleData, /diaper-review-placeholder/);
  assert.match(page, /No real products found/);
});

test("product detail reads places to buy from database", () => {
  const page = read("src/app/shopping/products/[slug]/page.tsx");
  const shopping = read("src/lib/shopping.ts");

  assert.match(page, /getShoppingProductBySlug/);
  assert.match(shopping, /shopping_places_to_buy/);
  assert.match(page, /No places to buy loaded/);
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

  assert.doesNotMatch(migration, /insert into shopping_products/i);
  assert.doesNotMatch(migration, /insert into shopping_places_to_buy/i);
});

