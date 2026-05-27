# Release 4 Slice 7: Shopping Research Pipeline and Supplier Transparency Plan

## Goal

Plan a reusable Shopping research pipeline so Mishava can evaluate a product or brand in a disciplined, evidence-first way. This extends the toilet paper supplier/manufacturer transparency work into a repeatable process for future product categories.

The immediate test cases are Costco/Kirkland Signature toilet paper and Kruger Products brands such as Cashmere and Purex. The broader goal is a reusable research workflow for brand, retailer, manufacturer, supplier, claims, sources, confidence, and evidence gaps.

## Scope

In scope:

- Shopping research workflow.
- Supplier/manufacturer transparency.
- Evidence-to-score readiness.
- Category-specific research templates, starting with toilet paper.
- Costco/Kirkland private-label handling.
- Kruger Products manufacturer/brand-owner handling.
- Lightweight internal research task/status model.

Out of scope:

- Checkout.
- Plus.
- Local inventory.
- Business, Gov, or Corporate.
- AI scoring.
- Affiliate, referral, commission, sponsored ranking, or paid placement logic.
- Fake products, sellers, evidence, images, suppliers, manufacturers, or scores.
- Copying outside scores as Mishava Scores.
- Live autonomous web crawler.
- Broad scraping.
- Final scoring math.
- Final tissue scoring methodology.
- Full supplier database.
- Product image sourcing.
- Business self-serve catalog.
- Old Supabase project changes.

## Current Context

The Release 4 Shopping POC readiness audit concluded:

- Shopping is internal-demo-ready.
- Shopping is not yet controlled-preview-ready for the interested toilet paper user.
- Costco/Kirkland toilet paper is missing.
- Kruger Products brands such as Cashmere and Purex are missing.
- Supplier/manufacturer transparency is not adequate.
- The model needs separate retailer, brand, private-label owner, parent company, manufacturer, supplier, evidence source, and confidence fields.

## Product Research Workflow

Reusable workflow input:

- Product name.
- Brand.
- Category.
- Retailer URL.
- Product URL.
- Optional barcode/UPC later.
- Optional user-submitted product request later.

Core research questions:

1. What is the exact product?
2. What is the consumer-facing brand?
3. Who owns the brand?
4. Who sells the product?
5. Is the product private-label?
6. Who is the manufacturer?
7. Who is the supplier?
8. What role does each entity play?
9. What product claims are made?
10. What independent evidence exists?
11. What is verified, likely, unverified, or unknown?
12. What evidence is missing?
13. What must remain score-pending?

Workflow stages:

1. Create or locate product record.
2. Record primary product/source URL.
3. Identify retailer and seller context.
4. Identify consumer-facing brand.
5. Identify private-label owner, if applicable.
6. Research parent company / brand owner.
7. Research manufacturer and supplier.
8. Assign confidence labels.
9. Record source URLs and source freshness.
10. Draft structured claims.
11. Mark unresolved evidence gaps.
12. Send claims to human review.
13. Keep score pending until reviewed evidence and scoring logic support it.

## Source Hierarchy

Primary sources, highest priority:

- Brand/manufacturer official website.
- Product packaging or label if available and legally usable.
- Retailer product page.
- Sustainability, sourcing, or impact reports.
- Certification and certifier databases.
- SEC filings, annual reports, or investor reports where relevant.
- Government/regulatory sources where relevant.

Secondary sources:

- Third-party scorecards.
- NGO reports.
- Credible journalism.
- Academic or industry reports.

Rules:

- Outside scores can be evidence references only.
- Outside scores cannot become Mishava Scores.
- Claims require source URL and review status.
- Source freshness must be tracked.
- Source type must be stored where possible.
- Unsupported claims must stay as evidence gaps.

## Supplier / Manufacturer Transparency Model

Plan data fields that distinguish:

- `retailer_name`
- `brand_display_name`
- `private_label_owner`
- `parent_company`
- `manufacturer_name`
- `supplier_name`
- `supplier_role`
- `supplier_region`
- `manufacturer_source_url`
- `supplier_source_url`
- `manufacturer_confidence`
- `supplier_confidence`
- `evidence_gap_notes`
- `reviewed_at`
- `reviewed_by`

Recommended confidence values:

- `verified`
- `likely`
- `unverified`
- `unknown`

Important rule:

Retailer, brand owner, manufacturer, and supplier must not be collapsed into one field unless evidence supports it.

Validation rules:

- `verified` manufacturer requires manufacturer name and source URL.
- `verified` supplier requires supplier name and source URL.
- `likely` requires explanatory notes.
- `unknown` and `unverified` must be displayable as evidence gaps.
- Active products can have unknown supplier/manufacturer values, but the unknown must be explicit.
- Score-ready status must be blocked when required manufacturer/supplier evidence is missing for that scoring path.

## Category Template Structure

Each Shopping category should define its own evidence questions.

Template fields:

- Category key.
- Required identity fields.
- Required supplier/manufacturer fields.
- Claim areas.
- Required source types.
- Evidence gaps to display.
- Review statuses.
- Score-readiness prerequisites.

Toilet paper template:

- Recycled content percentage.
- Post-consumer recycled content.
- Bamboo/FSC certification.
- Virgin forest fiber reliance.
- Bleaching/process claims.
- Packaging claims.
- Sourcing policy.
- Third-party tissue scorecards/references.
- Retailer availability.
- Manufacturer/supplier identity.
- Manufacturer/supplier confidence.
- Supplier region if known.

Future categories should be able to define their own evidence questions without rewriting the Shopping pipeline.

## Costco / Kirkland Handling

Costco/Kirkland is the private-label/supplier transparency test.

Rules:

- Costco may be retailer where Costco sells the product.
- Costco may be private-label owner where source supports Kirkland Signature as a Costco private label.
- Do not assume Costco manufactures Kirkland toilet paper.
- If actual manufacturer/supplier is not publicly verified, set manufacturer/supplier as unknown or unverified.
- If supplier may vary by region/time, note limited confidence.
- Score/trust state must show supplier/manufacturer evidence gap.
- No Costco/Kirkland Mishava Score unless reviewed evidence and scoring logic support it.

Planned data behavior:

- `brand_display_name`: `Kirkland Signature`
- `retailer_name`: `Costco`
- `private_label_owner`: `Costco` only where supported
- `manufacturer_name`: unknown/unverified unless sourced
- `supplier_name`: unknown/unverified unless sourced
- `supplier_notes`: explain supplier uncertainty and possible variation

UI behavior:

- Show “Manufacturer/supplier not verified.”
- Show “Supplier may vary” when applicable.
- Show “Score pending due to supplier/manufacturer evidence gaps.”

## Kruger Products Handling

Important correction: **Kruger, not Kroger.**

Kruger Products should be treated as a tissue manufacturer / brand owner / product company, not as a grocery retailer.

Rules:

- Treat Kruger Products as manufacturer/brand owner only where source supports it.
- Track consumer-facing product brand separately, such as Cashmere or Purex.
- Do not invent sourcing or environmental claims.
- If fiber sourcing, recycled content, certifications, bleaching/process, packaging, or supplier detail is missing, mark it as an evidence gap.
- No Kruger Mishava Score unless reviewed evidence and scoring logic support it.

Planned data behavior:

- `brand_display_name`: `Cashmere` or `Purex` where applicable.
- `parent_company` or `manufacturer_name`: `Kruger Products` only where source-backed.
- `supplier_confidence`: unknown/unverified unless exact production/supply details are sourced.
- `evidence_gap_notes`: missing sourcing, fiber, certification, process, packaging, and supplier details.

## Research Task System

Plan a lightweight internal task/status model.

Statuses:

- `research_needed`
- `source_found`
- `claim_drafted`
- `human_review_needed`
- `reviewed`
- `evidence_gap`
- `stale`
- `rejected`

Fields:

- `product_id`
- `category`
- `status`
- `assigned_to`
- `last_reviewed_at`
- `next_review_due_at`
- `source_count`
- `unresolved_gap_count`
- `confidence_summary`
- `notes`

Initial implementation can be simple: product-level fields and status helpers may be enough before a full task table exists. A table should be added only if it helps track real research work.

## AI-Assisted Research Later

Plan only. Do not implement autonomous AI research in this slice.

Rules:

- AI can suggest sources, claims, and gaps.
- AI cannot mark claims verified.
- AI cannot create Mishava Scores.
- AI cannot change ranking or trust outcomes.
- Human review is required.
- Source URLs are mandatory.
- Website terms and robots/usage limits must be respected.
- Raw scraping should not be introduced casually.
- AI output remains private/draft until reviewed.

## UI / Admin Implications

User-facing UI:

- Product detail shows known vs missing evidence.
- Supplier/manufacturer confidence appears clearly.
- Private-label products show retailer vs private-label owner vs manufacturer.
- Unknown supplier appears as an evidence gap.
- Score pending language explains missing supplier/manufacturer evidence when relevant.
- Page remains simple enough for a normal shopper.

Internal/admin UI later:

- Research tasks/gaps list.
- Source review status.
- Claim draft/review state.
- Staleness warnings.
- Assigned reviewer.
- Evidence gap count.

Do not build a full admin research console unless implementation proves it is needed.

## Tests Required

Plan tests for:

- Costco/Kirkland does not treat Costco as manufacturer without evidence.
- Kirkland private-label owner and manufacturer/supplier can be separate.
- Kruger Products is not misspelled or confused with Kroger.
- Kruger products separate product brand from Kruger Products where source supports it.
- Unknown supplier is displayed as an evidence gap.
- Private-label owner and manufacturer can be separate.
- Verified manufacturer/supplier claims require source URLs.
- Outside scorecards are not Mishava Scores.
- No fake supplier/manufacturer data is accepted as verified.
- Payment, affiliate, commission, sponsorship, and paid placement fields remain excluded from ranking.
- Score remains pending when required evidence is missing.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## Implementation Plan

1. Add supplier/manufacturer transparency model fields.
2. Add confidence constraints and verified-source guardrails.
3. Add a category-template helper for toilet paper evidence questions.
4. Backfill existing toilet paper products conservatively.
5. Add Costco/Kirkland product coverage if current reviewed source data is available.
6. Add Kruger/Cashmere/Purex product coverage if current reviewed source data is available.
7. Add product detail supplier/manufacturer evidence section.
8. Add trust popup supplier/manufacturer missing-context copy.
9. Add compact category/card confidence tags.
10. Add tests.
11. Apply migration only to `mishava-v2-dev / snnscnodegbyqexnopvf`.
12. Create result doc.

## Non-Goals

- Live autonomous web crawler.
- Broad scraping.
- Final scoring math.
- Final tissue scoring methodology.
- Full supplier database.
- Checkout.
- Affiliate logic.
- Product image sourcing.
- Local inventory.
- AI scoring.
- Business self-serve catalog.
- Public product submission flow.

## Acceptance Criteria

Slice 7 can be implemented only if:

- Mishava has a reusable research workflow.
- Supplier/manufacturer uncertainty is explicit.
- No suppliers or manufacturers are guessed.
- Source hierarchy is clear.
- Category-specific evidence questions are supported.
- Costco/Kirkland can be represented without pretending Costco is manufacturer.
- Kruger Products can be represented without confusing it with Kroger.
- Score states remain honest.
- Outside scorecards remain evidence references only.
- No paid ranking, commission, affiliate, checkout, Plus, Local inventory, Business, Gov, Corporate, or AI scoring logic is added.
- The old Supabase project remains untouched.
