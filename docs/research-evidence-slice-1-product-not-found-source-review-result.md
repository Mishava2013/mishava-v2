# Research + Evidence Slice 1: Product-Not-Found Queue and Source Review Result

Date: 2026-06-24

## What Was Built

Built the first usable Research + Evidence operations workflow for Shopping product-not-found moments:

- Shopping users can ask Mishava to research a product when search returns no matching product.
- Product-not-found requests create private internal research tasks.
- Internal admins can review research tasks at `/admin/research`.
- Internal admins can open a research task detail page at `/admin/research/[taskId]`.
- Staff can update task status, assignment, notes, and closed reason.
- Staff can add source URLs/metadata to a task.
- Sources start as `pending_review`.
- Staff can mark sources `approved`, `rejected`, `needs_follow_up`, `stale`, or `conflicting`.
- Source review history is recorded in a lightweight task event table.

## Routes And Files Changed

Routes added or changed:

- `/shopping`
  - Adds a no-results research-request form.
  - Does not promise a score or completion date.
- `/admin/research`
  - Internal research task queue with basic status/category/assignment filters.
- `/admin/research/[taskId]`
  - Internal task detail, source collection, source review, and history page.
- `/admin`
  - Adds a link to Research and source review.

Primary files:

- `src/app/shopping/actions.ts`
- `src/app/shopping/page.tsx`
- `src/app/admin/research/actions.ts`
- `src/app/admin/research/page.tsx`
- `src/app/admin/research/[taskId]/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/research-evidence.ts`
- `src/lib/shopping.ts`
- `scripts/research-evidence-slice-1.test.mjs`
- `supabase/migrations/202606240001_research_evidence_product_not_found_queue.sql`

## Migration Added

Added:

- `202606240001_research_evidence_product_not_found_queue.sql`

The migration:

- Allows `shopping_research_tasks.product_id` to be nullable so a task can exist before a product record exists.
- Adds request fields such as product name, brand, category, UPC, retailer URL, requester notes, request origin, and requested-by metadata.
- Extends task statuses to include operational queue states:
  - `new`
  - `researching`
  - `needs_source_review`
  - `blocked`
  - `completed`
  - `closed_no_reliable_sources`
- Adds `shopping_research_sources` for source review.
- Adds `shopping_research_task_events` for lightweight history.
- Keeps research task/source/event tables service-role-managed with RLS enabled.

## Safety Guardrails Preserved

- No fake products were added.
- No fake sources were added.
- No fake claims or evidence were added.
- No fake scores were added.
- No AI provider calls were added.
- No automated web crawler or scraping was added.
- No public employer or company accusation behavior was added.
- No legal conclusions were added.
- No paid ranking, affiliate, commission, or payment influence was added.
- Pending or rejected sources do not affect public evidence cards, claims, scoring, rankings, verification, trust badges, publishing, supplier approval, seller approval, or legal conclusions.

## What Is Still Missing

- Full claim template registry.
- Stale/conflicting source workflow beyond status labels.
- Reviewer assignment history beyond a simple `assigned_to` field and task events.
- Public-facing source evidence cards from approved research sources.
- Automated source freshness cadence.
- AI-assisted source suggestions.
- Final scoring support.

## Verification Results

- `npm test`: passed, `184/184`.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. Build output included `/admin/research` and `/admin/research/[taskId]`.
- `supabase migration list --linked`: passed. New migration `202606240001` is present locally and not applied remotely yet.

The earlier local typecheck/lint/build stall issues did not recur during this slice. The only issue found was a real TypeScript narrowing error in the new action redirect paths, and it was fixed by making redirect error messages explicit strings.

## Next Recommended Research / Evidence Slice

**Claim Template Registry + Stale/Conflicting Source Workflow**

Recommended scope:

- Define category-level claim templates.
- Connect approved sources to draft structured claims through explicit human review.
- Add stale/conflicting source handling with clearer reviewer guidance.
- Keep final scoring blocked until reviewed claims and methodology support it.
