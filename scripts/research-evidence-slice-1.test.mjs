import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("product-not-found research requests do not create fake products or scores", () => {
  const migration = read(
    "supabase/migrations/202606240001_research_evidence_product_not_found_queue.sql",
  );
  const shoppingPage = read("src/app/shopping/page.tsx");
  const actions = read("src/app/shopping/actions.ts");
  const library = read("src/lib/research-evidence.ts");

  assert.match(migration, /alter column product_id drop not null/);
  assert.match(migration, /requested_product_name/);
  assert.match(migration, /shopping_product_not_found/);
  assert.match(migration, /shopping_research_tasks_product_or_request_required/);
  assert.doesNotMatch(migration, /insert into public\.shopping_products/i);
  assert.doesNotMatch(migration, /evidence_score|score_snapshot_id|score_published_at/i);

  assert.match(shoppingPage, /Ask Mishava to research this product/);
  assert.match(shoppingPage, /no score or completion date is promised/i);
  assert.match(shoppingPage, /private internal research task/i);
  assert.match(actions, /createProductResearchRequest/);
  assert.match(library, /User requested research from a product-not-found moment/);
  assert.match(library, /No score, claim, or evidence fact has been created/);
});

test("source review workflow keeps pending sources internal and human-reviewed", () => {
  const migration = read(
    "supabase/migrations/202606240001_research_evidence_product_not_found_queue.sql",
  );
  const library = read("src/lib/research-evidence.ts");
  const adminDetail = read("src/app/admin/research/[taskId]/page.tsx");
  const adminActions = read("src/app/admin/research/actions.ts");

  assert.match(migration, /create table if not exists public\.shopping_research_sources/);
  assert.match(migration, /review_status text not null default 'pending_review'/);
  assert.match(migration, /approved/);
  assert.match(migration, /rejected/);
  assert.match(migration, /needs_follow_up/);
  assert.match(migration, /stale/);
  assert.match(migration, /conflicting/);
  assert.match(migration, /reviewed_by is not null and reviewed_at is not null/);
  assert.match(migration, /Service role can manage shopping research sources/);
  assert.match(migration, /must not feed public evidence cards, claims, scores, rankings, verification, trust badges, or publishing/);

  assert.match(library, /sourceReviewGuardrail/);
  assert.match(library, /Pending or rejected sources do not affect public evidence cards/);
  assert.match(library, /reviewResearchSource/);
  assert.match(adminDetail, /Add pending source/);
  assert.match(adminDetail, /Save source review/);
  assert.match(adminActions, /requireAdminSession/);
});

test("internal research queue supports requested statuses, filters, and history", () => {
  const migration = read(
    "supabase/migrations/202606240001_research_evidence_product_not_found_queue.sql",
  );
  const adminPage = read("src/app/admin/research/page.tsx");
  const adminDetail = read("src/app/admin/research/[taskId]/page.tsx");
  const adminHome = read("src/app/admin/page.tsx");
  const library = read("src/lib/research-evidence.ts");

  for (const status of [
    "new",
    "researching",
    "needs_source_review",
    "blocked",
    "completed",
    "closed_no_reliable_sources",
  ]) {
    assert.match(migration, new RegExp(status));
    assert.match(library, new RegExp(status));
  }

  assert.match(migration, /create table if not exists public\.shopping_research_task_events/);
  assert.match(migration, /request_created/);
  assert.match(migration, /status_changed/);
  assert.match(migration, /source_added/);
  assert.match(migration, /source_reviewed/);
  assert.match(adminPage, /Research task filters/);
  assert.match(adminPage, /assigned/);
  assert.match(adminDetail, /Review history/);
  assert.match(adminHome, /Research and source review/);
});

test("approved sources are prepared for evidence connection but do not become public facts automatically", () => {
  const migration = read(
    "supabase/migrations/202606240001_research_evidence_product_not_found_queue.sql",
  );
  const library = read("src/lib/research-evidence.ts");

  assert.match(migration, /connected_evidence_item_id uuid references public\.evidence_items/);
  assert.match(migration, /Pending, rejected, stale, conflicting, or follow-up sources/);
  assert.doesNotMatch(library, /structured_claims/);
  assert.doesNotMatch(library, /shopping_products.*evidence_score/s);
  assert.doesNotMatch(library, /score_snapshot/i);
  assert.doesNotMatch(library, /ai provider|openai|anthropic|gemini/i);
  assert.doesNotMatch(library, /paid ranking|commission sorting/i);
});
