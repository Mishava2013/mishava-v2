# Release 4 Slice 14: Shopping Web Research and Preliminary Evidence Match Flow Plan

Date: June 2, 2026

## Context

Mishava Shopping is live at:

`https://shopping.mishava.org`

Recent Shopping work established a controlled, desktop-first guided preview path for toilet paper. The experience now has plain-language Shopping copy, first-user account and Shopping Priorities improvements, source-backed evidence cards, supplier/manufacturer transparency, Costco/Kirkland and Kruger/Cashmere/Purex coverage, and clear score-pending language.

The next product goal is a safe web-research and preliminary evidence/match flow:

1. A user creates an account.
2. The user sets up Shopping Priorities.
3. The user searches for or opens a product.
4. Mishava shows product/company evidence it has found online.
5. Mishava shows what evidence exists, what is missing, and what still needs review.
6. Mishava may show a preliminary evidence/match state.
7. Mishava does not imply a final Mishava Score, final Your Values Score, audited score, certified score, or medical suitability score.

This is not a final scoring feature.

## Hard Guardrails

- Do not build checkout.
- Do not build Plus.
- Do not build Local inventory.
- Do not build Business, Gov, or Corporate.
- Do not build AI final scoring.
- Do not build broad autonomous scraping.
- Do not add affiliate, referral, or commission logic.
- Do not create fake products, sellers, evidence, sources, suppliers, manufacturers, claims, or scores.
- Do not copy outside scores as Mishava Scores.
- Do not make medical claims.
- Do not allow payment to affect ranking, visibility, verification, credibility labels, evidence truth, or trust outcomes.
- Do not touch `dsuupr-am`.
- Do not touch old Supabase.

## Planning Goal

Plan a safe Shopping web research and preliminary evidence match flow that lets a normal user search for a product, see what Mishava can find online, and understand how that evidence relates to their values without creating fake scores or unreviewed trust claims.

## Recommended Implementation Path

1. Audit the existing account, sign-in popup, sign-up, sign-out, and Shopping Priorities flow on the clean live Shopping domain.
2. Add or verify a product lookup/search surface that can search existing Mishava products by product name, category, brand, parent company, manufacturer, private-label owner, and retailer/source terms.
3. Add a product-not-found state that can create an internal research request instead of inventing a product.
4. Extend the existing research task model only if needed to track product request origin, user-submitted search text, and source/evidence status.
5. Add a simple internal research workflow for source collection, claim drafting, and human review.
6. Add user-facing evidence states and preliminary match language that are explicitly not final scores.
7. Use toilet paper as the first end-to-end test category.
8. Keep all preliminary match outputs qualitative until reviewed evidence and approved scoring logic support a numeric score.

## 1. Account Flow

Current expected behavior:

- A new user can reach sign-up from Shopping.
- A user can sign in from Shopping using the popup pattern.
- Safe `next` return paths should bring the user back to Shopping or Shopping Priorities after authentication.
- Product browsing should remain public.
- Shopping Priorities should require an account/session if the app is saving preferences.

Slice 14 should verify:

- `https://shopping.mishava.org/auth/sign-up?next=/app/shopping-priorities`
- `https://shopping.mishava.org/auth/sign-in?signIn=1&next=/app/shopping-priorities`
- `/auth/sign-out`
- session persistence across Shopping routes
- whether email confirmation is required
- whether Supabase Auth redirect URLs include `shopping.mishava.org`

What requires an account:

- Saving or editing Shopping Priorities.
- Requesting Mishava research on a missing product, if the request is associated with a user.
- Saving products, watchlists, or alerts later.

What should not require an account:

- Viewing Shopping landing.
- Viewing category pages.
- Viewing existing product pages.
- Reading public source/evidence/gap context.

Older-user simplicity requirement:

- Account creation should be optional until the user sees value.
- The app should invite sign-in only when the benefit is clear, such as saving priorities or requesting research.
- Copy should use plain wording like: `Create an account to save what matters to you.`

## 2. Shopping Priorities Questionnaire

Slice 14 should audit the current questionnaire and document the exact values it captures. Current intent from prior slices:

- environmental concerns;
- sensitive-use or care-sensitive concerns, without medical claims;
- affordability/value;
- transparency;
- possibly retailer/local preference later.

Questions should be plain enough for a normal shopper. They should avoid methodology language and avoid implying medical suitability.

Required explanations:

- Shopping Priorities do not create final scores.
- Shopping Priorities do not change the base Evidence Score.
- Shopping Priorities do not make a product safe or suitable for a medical condition.
- If evidence is incomplete, Mishava should say `not enough reviewed evidence yet` rather than show a fake match score.

When priorities exist but product evidence is incomplete, show:

- `Not enough reviewed evidence yet`
- `Mishava found some sources, but more review is needed`
- `Your priorities are saved, but this product is not ready for a final match`

## 3. Product Lookup/Search

Slice 14 should add or plan a search path that can answer:

- Can a user search by product name?
- Can a user search by category, such as `toilet paper`?
- Can a user search by brand, such as `Kirkland`, `Cashmere`, `Purex`, or `Kruger`?
- Can a user search by parent company, manufacturer, private-label owner, or retailer where those fields exist?

If the product is already in Mishava:

- Show matching products.
- Show product card score state.
- Show evidence/gap status.
- Let the user open the product detail page.

If the product is not in Mishava:

- Do not create a fake product.
- Show a clear not-found state:
  - `Mishava has not reviewed this product yet.`
  - `You can request Mishava research.`
  - `A score will not appear until sources and claims are reviewed.`
- If implemented later, create an internal product research request.

Recommended product-not-found request fields:

- submitted search text;
- optional product name;
- optional brand;
- optional retailer URL;
- optional product URL;
- optional notes from user;
- requested_by;
- status;
- created_at;
- updated_at.

## 4. Web Research Trigger

Safe research flow:

1. User searches a product.
2. App checks existing Shopping products.
3. If product exists, show current evidence, reviewed sources, unreviewed research status, and evidence gaps.
4. If product does not exist, offer `Request Mishava research`.
5. Internal research task is created.
6. Researcher or approved source tool finds candidate sources.
7. Source URLs are stored with source type and review status.
8. Claims are drafted.
9. Human review is required.
10. Reviewed claims may support an evidence preview.
11. Only approved scoring logic can create scores.

Rules:

- Do not build uncontrolled scraping.
- Do not let AI/browser search directly create final claims or scores.
- Do not let a source URL alone become reviewed evidence.
- Do not let an outside score become a Mishava Score.
- Do not let research task status alone create a preliminary match.

## 5. Source Hierarchy

Primary sources, highest priority:

- official brand/manufacturer product page;
- retailer product page;
- company sustainability/source page;
- certification database where available;
- packaging or label source where available;
- official annual/sustainability report where available;
- official parent-company or manufacturer statements.

Secondary sources:

- credible NGO report;
- credible third-party scorecard;
- credible journalism;
- academic or industry source.

Required source fields:

- source title;
- source URL;
- source type;
- reviewed status;
- date reviewed;
- last seen or freshness status if available;
- source owner/publisher;
- claim summary;
- what this source supports;
- what this source does not prove;
- confidence;
- related product, brand, parent company, manufacturer, supplier, private-label owner, or retailer.

Rules:

- Outside scorecards can be evidence references only.
- Outside scores cannot become Mishava Scores.
- Claims must say what the source supports and what it does not prove.
- A source may support one claim but leave other claims as gaps.

## 6. Evidence States

Internal evidence/research states:

- `not_searched`
- `sources_found`
- `evidence_drafted`
- `human_review_needed`
- `reviewed_evidence`
- `evidence_gap`
- `stale_source`
- `rejected_source`

User-facing versions:

- `Mishava has not searched this yet`
- `Mishava found sources`
- `Mishava is still reviewing this`
- `More evidence needed`
- `Score not ready yet`
- `Reviewed evidence available`
- `This source helps, but does not prove everything`
- `This source is stale`
- `This source was rejected`

Display rule:

- User-facing pages should lead with the simple label.
- Deeper source/review status should remain available in the evidence details.

## 7. Preliminary Match Logic

Possible labels:

- `Preliminary Evidence Match`
- `Early Values Match`
- `Evidence Found for Your Priorities`
- `Not Enough Reviewed Evidence Yet`
- `Needs Mishava Review`

Recommended first implementation label:

`Evidence Found for Your Priorities`

Reason:

- It sounds useful without implying a final score.
- It avoids a numeric or ranked outcome.
- It connects to the user’s priorities while still pointing back to evidence.

Rules:

- No number score unless approved.
- No final grade.
- No ranking claim based on unreviewed evidence.
- No medical suitability claim.
- Missing evidence remains visible.
- Confidence is shown as `incomplete`, `low`, `medium`, or `high`, not as a final score.
- Preliminary match can only use reviewed evidence or clearly labeled unreviewed source context.

Suggested display states:

- `No match shown yet`: user has not saved priorities.
- `Not enough reviewed evidence`: priorities exist, but evidence is incomplete.
- `Evidence found for your priorities`: reviewed evidence touches one or more saved priorities.
- `Needs Mishava review`: sources exist, but reviewed claims are not ready.

## 8. Toilet Paper Test Case

Toilet paper remains the first test category.

Questions Mishava should ask:

- Does the product have recycled content?
- Does it state post-consumer recycled content?
- Is it bamboo/tree-free?
- Does it claim FSC or similar certification?
- Does it rely on virgin fiber?
- Does it disclose bleaching/process claims?
- Does it disclose fragrance/free-from/comfort claims?
- Does it disclose packaging claims?
- Who is the consumer-facing brand?
- Who is the parent company?
- Who is the private-label owner, if any?
- Who is the manufacturer?
- Who is the supplier?
- Is manufacturer/supplier unknown?
- What retailer sells it?
- What source supports each claim?
- What does each source not prove?
- What is still missing?

Expected first-user examples:

- Kirkland/Costco: show Costco as retailer/private-label owner where supported; do not treat Costco as manufacturer unless verified; keep unknown manufacturer/supplier as evidence gaps.
- Cashmere/Purex/Kruger: show Kruger Products context where source-supported; require separate product-level evidence for sourcing, recycled content, FSC, bleaching/process, packaging, and supplier claims.

## 9. Company/Product Relationship

Evidence must be able to attach to:

- product;
- brand;
- parent company;
- private-label owner;
- manufacturer;
- supplier;
- retailer/place-to-buy.

Rules:

- Retailer, brand, owner, manufacturer, and supplier must not be collapsed into one field unless evidence supports it.
- Company-level sustainability claims should not automatically become product-level claims.
- Retailer claims should not automatically become manufacturer claims.
- Private-label ownership should not imply manufacturer identity.
- Supplier/manufacturer unknowns should remain evidence gaps.

## 10. User-Facing Experience

For the first user, the app should show:

- product name;
- where to buy;
- what Mishava found;
- what Mishava still needs;
- how this relates to saved Shopping Priorities;
- why the score is pending;
- whether evidence is reviewed or still being reviewed;
- that Mishava is not the store;
- that Mishava does not rank because someone paid;
- that this is not medical advice.

Recommended page hierarchy:

1. Product name and plain score state.
2. Where to buy/source links.
3. What Mishava found.
4. What Mishava still needs.
5. Evidence found for your priorities, if supported.
6. Source details.
7. Company/source information.
8. Research status for deeper users.

## 11. Medical/Care-Sensitive Guardrails

Required safe wording:

- `This is not medical advice.`
- `Mishava does not determine whether a product is safe for a medical condition.`
- `Comfort, fragrance-free, or sensitivity-related claims are shown only when source-supported.`
- `Ask a medical professional for medical suitability.`

Avoid:

- `best for Crohn's`
- `safe for Crohn's`
- `non-irritating`
- `medically recommended`
- `guaranteed safe`
- `medical-safe score`

Sensitive-use matching rule:

- A saved sensitive-use priority can highlight source-backed comfort/free-from/fragrance claims.
- It cannot conclude suitability for Crohn’s or any medical condition.
- If sources are missing, show `Mishava has not found enough reviewed evidence for this concern yet`.

## 12. Admin/Research Workflow

Internal workflow:

1. Product research request created.
2. Product is matched to an existing record or marked as not yet in Mishava.
3. Source search is performed manually or with approved tools later.
4. Source is saved with required metadata.
5. Claim is drafted with clear support/does-not-prove boundaries.
6. Human reviewer accepts or rejects the claim.
7. Reviewed claim can support evidence preview.
8. Only an approved scoring version can create a score.

Recommended minimal research statuses:

- `research_needed`
- `sources_found`
- `claim_drafted`
- `human_review_needed`
- `reviewed`
- `evidence_gap`
- `stale`
- `rejected`

The existing Slice 7 research task model may already cover much of this. Slice 14 implementation should reuse it before adding tables.

## 13. Data Model Needs

Prefer reusing existing models:

- `shopping_products`
- supplier/manufacturer transparency fields;
- places-to-buy/source fields;
- evidence/source card helpers;
- shopping research tasks;
- Shopping Priorities fields.

Potential additions only if required:

- product search/request table;
- request source fields;
- user-submitted product URL;
- request status;
- request audit events;
- evidence-source review status if missing;
- preliminary match status helper, preferably derived rather than persisted.

Recommended product research request fields:

- `id`
- `requested_by`
- `search_query`
- `product_name`
- `brand`
- `retailer_url`
- `product_url`
- `category_hint`
- `status`
- `matched_product_id`
- `notes`
- `created_at`
- `updated_at`

Status values:

- `requested`
- `matched_existing`
- `research_needed`
- `sources_found`
- `human_review_needed`
- `completed`
- `rejected`

## 14. Tests Required

Plan tests for:

- account routes render;
- Shopping sign-in popup can be reached;
- sign-up preserves return path;
- Shopping Priorities can be completed or reached behind auth;
- product lookup works for existing products;
- category search works for toilet paper;
- brand search works for Kirkland, Cashmere, Purex, and Kruger;
- product-not-found state can create/request research if implemented;
- source evidence requires URL and review status;
- unreviewed sources do not create scores;
- outside scores are not Mishava Scores;
- preliminary match does not create final score;
- no medical claims are added;
- supplier/manufacturer unknown remains an evidence gap;
- Costco/Kirkland does not treat Costco as manufacturer without evidence;
- Kruger/Cashmere/Purex keep brand/manufacturer relationships separate;
- payment, affiliate, and commission fields do not affect ranking;
- `npm test`;
- `npm run typecheck`;
- `npm run lint`;
- `npm run build`;
- live route checks.

If local typecheck/lint/build stall again, document the tooling caveat separately and do not disable checks.

## 15. Screenshots Required For Implementation

Implementation should capture:

- signed-out Shopping homepage;
- sign-up;
- sign-in popup;
- Shopping Priorities questionnaire;
- product lookup/search;
- product-not-found/research-request state if included;
- toilet paper category;
- Kirkland detail;
- Cashmere detail;
- Purex detail;
- evidence cards;
- preliminary match state;
- mobile Shopping homepage;
- mobile toilet paper category;
- mobile product detail if changed.

Screenshots should remain ignored/uncommitted unless repository policy changes.

## 16. Non-Goals

Exclude:

- final Mishava scoring engine;
- final tissue scoring methodology;
- fully autonomous web crawler;
- AI final scoring;
- checkout;
- Plus;
- affiliate revenue;
- broad category expansion;
- medical recommendation engine;
- public claims that a product is safe or suitable for a health condition.

## 17. Acceptance Criteria

Slice 14 implementation may begin only if:

- user can understand the account, priorities, and product flow;
- product lookup leads to useful evidence/gap information;
- product-not-found does not create fake product data;
- preliminary match is clearly not a final score;
- source-backed evidence is separated from unreviewed research;
- outside scores remain references only;
- no fake evidence or fake scores are created;
- no medical claims are made;
- missing evidence remains visible;
- payment cannot influence trust outcomes;
- toilet paper remains the first test case;
- the experience stays plain enough for the first older guided-preview user.

## Recommended First Slice 14 Build Order

1. Verify account/priorities routes on live Shopping.
2. Add product lookup/search over existing Shopping records.
3. Add product-not-found/research-request state without creating public fake products.
4. Reuse existing research tasks for requested research.
5. Add preliminary match language based on reviewed evidence and saved priorities.
6. Add tests proving no preliminary match becomes a final score.
7. Capture screenshots and run live route checks.

## Final Recommendation

Build Slice 14 as a small, evidence-first product lookup and research-request flow, not as a scoring engine. The first useful version should let the user search toilet paper products, see existing Mishava evidence and gaps, and request research when Mishava has not reviewed a product yet.

The strongest user-facing promise should be:

`Mishava can show what it found, what it still needs, and why a score is not ready yet.`

That promise is honest, useful, and aligned with the current Shopping foundation.
