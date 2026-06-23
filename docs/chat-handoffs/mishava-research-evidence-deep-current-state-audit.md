# Mishava Research + Evidence Operations Deep Current-State Audit

Date: 2026-06-23

## 1. Executive Summary

Mishava Research + Evidence Operations is the platform layer that collects sources, preserves source metadata, separates evidence from claims, exposes evidence gaps, supports human review, and eventually feeds scoring without letting payment, AI, or outside scorecards decide trust outcomes.

Current readiness estimate: **54-59% foundation complete**.

What is genuinely done:

- Core evidence tables and structured-claim tables exist.
- Shopping product/source metadata exists.
- Shopping active products require approved source metadata.
- Toilet paper source/evidence cards are visible on product detail pages.
- Supplier/manufacturer transparency exists for toilet paper, including Costco/Kirkland and Kruger/Cashmere/Purex.
- Shopping research task statuses exist.
- NGO evidence upload/report foundations exist.
- NGO file safety is quarantine-first/manual-review until a real scanner exists.
- AI-control guardrails exist and provider calls are disabled.
- Tests cover source metadata, score withholding, AI guardrails, supplier transparency, and NGO evidence/report boundaries.

What is not done:

- No user-facing product-not-found research queue.
- No full internal source-review queue.
- No full claim-review admin console.
- No stale-source queue.
- No reusable source record table outside existing product/evidence structures.
- No final category claim templates.
- No autonomous web research or crawler.
- No final scoring support.

What is live:

- Shopping product pages on `https://shopping.mishava.org` show source-backed evidence cards and gaps for toilet paper.
- NGO evidence/report flows exist in the app and are protected by organization membership.

What is built but still needs stronger live/manual verification:

- NGO live email/Auth and real inbox flow.
- NGO file upload behavior with real manual review/scanner decisions.
- Shopping product/source review operations beyond seeded POC data.

What is only planned:

- Product-not-found requests.
- Web research trigger.
- Research/source admin UI.
- Stale-source review cadence.
- AI-assisted source discovery behind the control layer.

Blocked:

- Final scoring is blocked until reviewed structured claims, methodology, and score publication rules exist.
- Broad public self-serve evidence uploads are blocked by malware scanning/manual review policy.
- AI-assisted research is blocked until provider adapter, budget, cache, logging persistence, and human-review process are approved.

Honest next step:

**Define Product-Not-Found Research Queue and Source Review Workflow.**

Research/evidence is ready to support a careful Shopping Slice 14 only if Slice 14 stays focused on existing-record search plus a research-request queue. It is not ready for autonomous web research or final scoring.

Research/evidence is not ready to support final Mishava Scores.

Research/evidence can support private/supported NGO reports, but broad NGO public reports still need stronger review, file-safety, and operational controls.

Irresponsible claims right now:

- Mishava has final scores.
- Mishava fully verifies products, suppliers, or NGOs.
- Mishava evidence is externally audited.
- AI reviews or verifies claims.
- Uploaded files are malware-free.
- Outside scorecards are Mishava Scores.

## 2. Percent Estimates

| Area | Estimate | Why reasonable | What moves it higher | What moves it lower | Biggest uncertainty |
| --- | ---: | --- | --- | --- | --- |
| Overall research/evidence operations | **54-59%** | Strong schema, source display, research task foundations, tests. | Product-not-found queue, source-review UI, stale-source cadence. | Manual-only source work continues without queue. | How quickly review operations can become repeatable. |
| Shopping research task readiness | **55-65%** | `shopping_research_tasks` exists with statuses/gaps. | UI/ops flow for creating/updating tasks. | Tasks remain seeded/internal only. | Whether service-role-only management is enough short term. |
| Product-not-found queue | **10-20%** | Search exists over current products; no queue. | Add request form and task model link. | Users see empty states without request path. | How much data to collect without overburdening users. |
| Source metadata readiness | **65-75%** | Product/place records require source URL/status/freshness. | Reusable source records and reviewer metadata. | Source metadata stays product-specific only. | Whether source fields are enough across Business/Gov/NGO. |
| Claim template readiness | **20-30%** | Structured claims exist; toilet paper dimensions exist. | Category claim template registry. | More categories add ad hoc fields. | Exact template shape for reusable scoring. |
| Human review workflow | **35-45%** | Claims can be reviewed; AI suggestions require human review. | Review queues and permissions UI. | Review remains manual/code/admin only. | Reviewer role model for Shopping/Business. |
| Evidence gap visibility | **70-78%** | Product pages show gaps; supplier unknowns visible. | Tie gaps to templates/tasks. | Gaps become buried in dense pages. | User comprehension on mobile. |
| Supplier/manufacturer evidence | **65-75%** for toilet paper, **45-55%** platform-wide | Toilet paper fields and confidence labels exist. | Backfill all categories and add source-review workflow. | Supplier data guessed or left unreviewed. | Availability of public supplier evidence. |
| NGO evidence operations | **70-80%** for supported pilot | Upload/report/evidence lifecycle exists. | Real scanner/inbox/manual review proof. | Broad self-serve before file safety. | Operational review capacity. |
| Report evidence support | **68-78%** | Reports link evidence/claims and exclude draft/rejected claims. | Stronger review labels and public-report controls. | Reports shown publicly before review. | Manual review burden. |
| AI-assisted research | **25-35%** | Control layer exists, provider disabled. | Provider adapter behind budget/cache/human review. | Any direct AI/provider bypass. | Cost and quality controls. |
| Admin/review queue | **20-30%** | Admin/support dashboards exist; no dedicated research queue. | Build source/claim/product request queue. | Review work remains invisible. | Minimum useful admin scope. |
| Public transparency/readability | **60-68%** | Product evidence cards are plain enough for guided preview. | Simplified source/gap hierarchy and methodology page. | More technical labels exposed too early. | Older/low-reading-skill comprehension. |

## 3. Research Operations Workflow Map

| Step | Status | Live | Tested | User-facing quality | Internal quality | Main risk |
| --- | --- | --- | --- | --- | --- | --- |
| User searches product | Partially built | Live for existing products | Tested | Basic search works | No not-found workflow | Empty results may dead-end. |
| Product exists | Built | Live | Tested | Product cards/detail pages render | Product source rows exist | Data remains POC-width. |
| Product does not exist | Not built | Not live | Not tested | Empty state only | No request task | User cannot request research. |
| Research task created | Partially built | Internal/seeded | Tested by migration text | Not user-facing | `shopping_research_tasks` exists | No UI/ops path. |
| Researcher collects sources | Manual only | Not live as workflow | Not tested | Not shown | Source hierarchy documented/configured | Inconsistent manual practice. |
| Source metadata saved | Built for products/places/evidence | Live in Shopping/NGO | Tested | Visible on product pages | Product-specific, not centralized | Hard to reuse across entities. |
| Source categorized | Partially built | Live in product fields | Tested | Source type displayed simply | Limited type taxonomy | Source confidence may be too coarse. |
| Claim drafted | Partially built | NGO/scoring backend only | Tested | Not broadly user-facing | Structured claims exist | No category templates. |
| Claim linked to source | Built in core claims | Not fully live for Shopping | Tested | Product cards show source cards, not structured claims | Evidence IDs required for structured claims | Shopping source cards not yet structured claims. |
| Source supports/does not prove | Built for Shopping cards | Live | Tested | Good for guided preview | Hard-coded display generation | Needs reusable source model. |
| Human review | Partially built | NGO/AI suggestion/claims backend | Tested | Not much UI | Review fields exist | No source-review queue. |
| Reviewed claim becomes evidence | Partially built | Backend | Tested | Not a broad UX yet | Accepted claims can feed draft snapshots | Review queue missing. |
| Evidence supports preview states | Built partially | Live in Shopping | Tested | Clear score-pending/gap labels | Mostly helper-driven | Not tied to reviewed claim templates. |
| Final scoring blocked | Built | Live | Tested | Score pending shown | Score snapshot guards exist | Future shortcuts could bypass if not tested. |
| Stale/rejected/source-gap states visible | Partially built | Some labels live | Tested partly | Gaps visible; stale less mature | Task statuses include stale/rejected | No stale queue/cadence. |
| Public display uses clear language | Partially built | Live | Tested | Good guided preview; still dense | Copy in components | Needs browser/user testing. |

## 4. Current Data Structures

| Structure/field | Exists | Migration/source | Purpose | Risk | Tests |
| --- | --- | --- | --- | --- | --- |
| `evidence_items` | Yes | `202605240001_foundation.sql` | Core source/evidence record. | General, not category-template-specific. | Release 3/NGO tests. |
| `structured_claims` | Yes | `202605240001`, `202605240007`, `202605260003` | Evidence-backed claim records. | Templates missing. | `release-3-slice-2.test.mjs`. |
| `shopping_products.source_*` | Yes | `202605240009_release_4_slice_1_shopping_real_data.sql` | Product source URL/status/freshness. | Product-specific source storage. | `release-4-shopping.test.mjs`. |
| `shopping_places_to_buy.source_*` | Yes | `202605240009` | Retailer/place source metadata. | Price freshness not robust. | Shopping tests. |
| `shopping_products` tissue fields | Yes | `202605260007` | Toilet paper evidence context. | Not structured claims yet. | Shopping tests. |
| Supplier/manufacturer fields | Yes | `202605260008` | Entity transparency and confidence. | POC-width only. | Shopping tests. |
| `shopping_research_tasks` | Yes | `202605260009` | Internal research status/gap tracking. | No UI/user queue. | Shopping tests. |
| `ngo_evidence_submissions` | Yes | `202605240002_ngo_foundation.sql` | NGO evidence intake linkage. | Real review operations still manual. | NGO tests. |
| `evidence_files` | Yes | `202605240017`, `202605260002` | Private file metadata/lifecycle/scan status. | No real scanner. | File security tests. |
| `ai_evidence_parse_jobs` | Yes | `202605260003` | Suggestion-only job metadata. | No provider; no production workflow. | Slice 15 AI tests. |
| `ai_evidence_suggestions` | Yes | `202605260003` | Private AI suggestions requiring review. | Must not become facts automatically. | Slice 15 AI tests. |
| `ai_usage_ledger` hooks | Partial | `src/lib/ai-control.ts` plus existing ledger path | Usage logging structure. | Budget/cache persistence incomplete. | AI-control tests. |
| Audit logs | Yes | `audit_events` | Append-only operational trace. | Need more reviewer UI. | Many NGO/scoring tests. |

## 5. Source Hierarchy

Recommended Mishava hierarchy:

Primary sources:

- Official brand/manufacturer product page.
- Retailer product page.
- Company sustainability/sourcing page.
- Certification database where available.
- Packaging or label source where available.
- Official annual/sustainability report where available.
- NGO uploaded evidence, clearly marked as self-submitted.

Secondary sources:

- Credible NGO report.
- Credible third-party scorecard.
- Credible journalism.
- Academic/industry source.
- Regulatory/government record.
- Court/public enforcement record.

Lower-confidence sources:

- Marketing claims without supporting evidence.
- Marketplace listings.
- Blog posts.
- Social media.
- Scraped snippets without durable URL.
- AI summaries without source.

Current source types:

- Shopping has product/retailer/brand/sourcing/external reference source fields.
- `shoppingSourceHierarchy` defines primary and secondary groups in code.
- NGO evidence records have `source_type`, `source_name`, URL/document path, and verification status.

Missing source types:

- Certification database as first-class typed source.
- Packaging/label evidence as a reusable source type.
- Regulatory/court/enforcement source categories.
- Durable source snapshots or archive metadata.

Preliminary evidence should allow primary and credible secondary sources with clear caveats. Marketing-only and marketplace-only sources should require extra review. AI summaries and scraped snippets should never stand alone as evidence.

Conflicting sources should be shown as `conflicting evidence` and blocked from final scoring until reviewed. Stale or inaccessible sources should become gaps, not hidden assumptions.

## 6. Source Metadata Requirements

Minimum source metadata:

- Source title.
- URL or private document path.
- Source type.
- Publisher/entity.
- Date accessed/reviewed.
- Publication date when available.
- Review status.
- Reviewed by.
- Confidence level.
- Claim supported.
- Claim not proven.
- Related product/company/supplier/NGO/report.
- Evidence gaps.
- Notes.

Exists today:

- Shopping product/place source URL, status, captured date, reviewed by/at.
- Shopping product source name/data origin.
- NGO evidence source name/type, URL/document path, captured/reviewed date, confidence, verification status.
- Product detail cards show source title/type/review/freshness/confidence/supports/does-not-prove/gaps.

Required today:

- Active Shopping products require approved source name, URL, and captured date.
- Active places to buy require approved source URL and captured date.
- Structured claims require evidence references.

Should become required before public beta:

- Publisher/entity.
- Reviewed by.
- Publication date when available.
- What source supports/does not prove.
- Entity relationship type.
- Staleness/next review date.

User-facing:

- Source title/type, status, freshness, confidence, support/gap notes, URL when safe.

Internal only:

- Reviewer identity, raw notes, private file paths, cost/logging data, internal confidence rationale.

## 7. Claim Templates

Structured claim tables exist, but reusable category-specific claim templates are not complete.

Shopping/toilet paper has evidence dimensions for:

- Recycled content.
- Post-consumer recycled content.
- Bamboo/tree-free/FSC.
- Virgin fiber.
- Bleaching/process.
- Fragrance/free-from/comfort.
- Packaging.
- Brand/parent/manufacturer/supplier/retailer.
- Source support and missing evidence.

These are helper/template foundations, not a complete reviewed claim template system.

NGO claim templates are planned more than built. NGO evidence and reports can link evidence and accepted claims, but a full template library for identity, program, location, service area, public/private status, self-submitted labels, and missing evidence is not complete.

Business/Local/Supplier templates are not built yet.

First templates to build:

1. Product-not-found/research request intake template.
2. Toilet paper structured claim template.
3. Source review template.
4. NGO evidence self-submitted claim template.

Defer:

- Broad SDG scoring templates.
- Government procurement scoring.
- Corporate vendor scoring.
- Business self-serve catalog claim templates beyond identity/source basics.

## 8. Human Review Workflow

Current capabilities:

- Structured claims can be accepted/rejected.
- Accepted claims require evidence.
- AI suggestions require human review before accepted/rejected.
- Shopping products/source records have review status.
- Evidence files have scan/review status fields.
- Audit events exist.

Missing:

- Source review queue.
- Product-not-found queue.
- Claim review queue UI.
- Correction/dispute queue tied to evidence changes.
- Stale-source queue.
- Reviewer assignment/history UI.
- Clear reviewer roles for Shopping research.

Danger if skipped:

- Source notes become de facto facts.
- Outside scorecards get mistaken as Mishava conclusions.
- Supplier/manufacturer assumptions slip into product trust.
- Stale product pages look reviewed when they are not.

## 9. Product-Not-Found Research Queue

Current state:

- Product search exists over current Shopping records.
- Empty states exist.
- No product-not-found request flow exists.
- No user-submitted research request table exists.
- No user research request is connected to Shopping Priorities.

What Slice 14 should build first:

- A simple product-not-found form.
- Fields: product name, brand, category, optional retailer URL, optional reason/user priority, requester email/account ID where available.
- A research request record or task.
- Status labels: received, research needed, source found, evidence gap, not enough information, reviewed.
- Clear language that request does not mean product is reviewed.

Avoid:

- Creating a fake product.
- Showing the request as a product page.
- AI-generated product summaries.
- Claiming Mishava is reviewing everything instantly.

## 10. Web Research / Preliminary Evidence Flow

Current state:

- No autonomous web/source research automation is built.
- No provider web research calls are enabled.
- No crawler/scraping system exists.
- Product source URLs are stored from reviewed/manual seed data.
- AI summaries are not used as facts.

Safe preliminary display before review:

- `Research requested`
- `Source found but not reviewed`
- `Mishava needs more evidence`
- Link to user-submitted URL as unreviewed context if safe.

Never show before review:

- Final score.
- Verified claim.
- Supplier approval.
- Medical/product safety statement.
- Outside score copied as Mishava Score.

Controlled web research would require:

- Source discovery only.
- URL storage.
- Terms/robots/data-use respect.
- Human review.
- Budget/cache/logging.
- Clear status labels.

Autonomous crawling would require a separate legal/technical review and is not near-term.

## 11. Evidence States

| State | Exists now | Stored | User-facing | Tested | Risk |
| --- | --- | --- | --- | --- | --- |
| Not searched | Partial | No dedicated field | Empty state | Partial | Users dead-end. |
| Research requested | Not built | No | No | No | Needed for Slice 14. |
| Sources found | Partial | Research/source fields | Yes in product pages | Yes | Not queue-driven. |
| Source saved | Built | Product/place/evidence fields | Yes | Yes | Not centralized. |
| Evidence drafted | Partial | Structured claims/AI suggestions | Limited | Yes | Templates missing. |
| Human review needed | Built as task/suggestion status | Yes | Some labels | Yes | No review queue UI. |
| Reviewed evidence | Partial | Review fields/status | Some labels | Yes | Criteria not universal. |
| Rejected source | Partial | Source/task statuses | Limited | Partial | Needs UI/cadence. |
| Stale source | Partial | Task/image statuses | Limited | Partial | Needs stale queue. |
| Evidence gap | Built | Notes/status/helpers | Yes | Yes | Needs template ties. |
| Conflicting evidence | Not built | No | No | No | Important before scoring. |
| Insufficient evidence | Partial | Helper output | Yes | Yes | Needs standard label. |
| Score pending | Built | Derived | Yes | Yes | Good current guardrail. |
| Ready for preliminary match | Not formal | No | No | No | Next scoring/trust work. |
| Ready for final scoring | Partial | `score_ready` status | Not reached | Guarded | Must remain strict. |

## 12. Evidence Gap Handling

How gaps are represented:

- `evidence_gap_notes` on Shopping products.
- `unresolved_gap_count` on research tasks.
- Missing supplier/manufacturer labels.
- Missing source/score snapshot requirements in score explanations.
- File scan status for NGO uploads.

Visible to users:

- Shopping product detail pages show supplier/manufacturer gaps and source-card gaps.
- NGO pages show review/file status in relevant flows.

Internal visibility:

- Research task fields and support/admin summaries exist, but no dedicated review queue.

Needs improvement:

- Tie every gap to a claim template question.
- Allow gaps to be resolved with source review.
- Mark unresolved required gaps as scoring blockers.
- Track stale source gaps.
- Add conflict handling.

## 13. Product / Company / Supplier Relationship Evidence

Implemented:

- Shopping products distinguish product, retailer, brand, private-label owner, parent company, manufacturer, supplier, supplier role, supplier region, manufacturer source, supplier source, and confidence.
- Costco/Kirkland does not treat Costco as manufacturer without evidence.
- Kruger/Cashmere/Purex separates consumer-facing brand from Kruger Products where source support exists.
- Unknown manufacturer/supplier identity remains a gap.

Still risky:

- Entity relationship rules are product-field based, not a reusable relationship graph.
- Evidence inheritance rules are not formal.
- Company-level sustainability context can be mistaken for product-level proof without careful copy.

Should be tested next:

- Private-label owner and manufacturer separation across more products.
- Product-level versus company-level evidence display.
- Conflicting manufacturer/supplier sources.
- Supplier confidence changes cannot create score readiness without reviewed claims.

## 14. NGO Evidence Operations

How NGO differs from Shopping:

- NGO evidence is often self-submitted, private, and report-scoped.
- Shopping evidence is product/source context intended for public preview.

NGO built:

- Evidence items and submissions.
- File metadata and lifecycle.
- Private raw file posture.
- Report evidence links.
- Scoped sharing.
- Draft/rejected claims excluded from report trust summaries.
- AI parsing suggestion-only foundation.

NGO caveats:

- Self-submitted evidence must remain clearly labeled.
- Human review is required before public credibility claims.
- No real malware scanner is integrated.
- Manual review policy may be enough for supported pilots, not broad public self-serve.

Before broad public self-serve:

- Real scanner or strict supported/manual-review policy.
- Real inbox/Auth verification.
- Public report review rules.
- Correction/dispute workflow.
- External legal/security/accessibility review.

## 15. Research/Evidence Admin Needs

Existing:

- Admin/support dashboards.
- Read-only support posture.
- Scoring admin foundation.
- Research task table, service-role managed.
- Audit events.

Missing:

- Source review queue.
- Claim review queue.
- Correction/dispute queue.
- Stale-source queue.
- Product-not-found queue.
- NGO evidence review queue.
- Review assignment and reviewer history.

Build first:

1. Product-not-found queue.
2. Source review queue.
3. Claim/gap review queue.

## 16. AI-Assisted Research Guardrails

Present:

- AI-control foundation.
- Provider calls disabled.
- Usage logging hooks.
- Budget/cache structure.
- Provider import guard.
- AI evidence parse job/suggestion schema.

AI cannot affect:

- final evidence
- scores
- rankings
- verification
- publishing
- trust badges
- supplier approval
- NGO escalation
- legal/compliance conclusions
- payment access

Before AI-assisted source discovery:

- Approved provider adapter behind `src/lib/ai-control.ts`.
- Budget snapshots.
- Persistent cache.
- Usage ledger persistence verified.
- Source URL required.
- Human review UI.

Before AI-assisted claim drafting:

- Claim templates.
- Review queue.
- Traceability from suggestion to source to structured claim.
- Tests proving suggestions do not become accepted facts automatically.

Rule:

AI can suggest; humans decide.

## 17. Public Display / Readability

What works:

- Shopping product pages explain what Mishava found and what is missing.
- Source cards explain support versus what is not proven.
- `Mishava is still reviewing this product` is understandable.
- No medical advice and no store/commission language are visible.

Still heavy:

- Source cards can be dense.
- Confidence/status language may still require guided explanation.
- The difference between source context and reviewed claim is not fully obvious.

Simplify next:

- Put the plain summary first.
- Use progressive disclosure for detailed source metadata.
- Keep evidence details available for transparency.

## 18. Legal / Compliance / Security Risk

Risks:

- Unreviewed claims can look like Mishava conclusions.
- User-uploaded files can contain malware or sensitive data.
- Copying outside scores could create attribution, methodology, and legal risk.
- Weak source interpretation could mislead users.
- Outdated sources could be presented as current.
- Medical/care-sensitive claims could imply suitability.
- Public NGO reports could expose private evidence or overclaim credibility.

Existing guardrails:

- Source/gap labels.
- No final scores.
- No medical claims.
- Private raw files.
- Quarantine-first file posture.
- AI suggestion-only controls.
- No paid trust outcomes.

External review needed:

- Legal review for public claims and corrections.
- Security review for file upload/scanner workflow.
- Accessibility review for public evidence pages.
- Compliance-readiness review before institutional claims.

## 19. Tests And Verification

Research/evidence-related tests:

- `scripts/release-4-shopping.test.mjs`: Shopping source metadata, real products, supplier transparency, research tasks, evidence cards, no scores.
- `scripts/release-3-slice-2.test.mjs`: structured claims, draft snapshots, accepted evidence-backed claims, no fake scores.
- `scripts/release-3-slice-3.test.mjs`: NGO evidence library, reports, accepted claims, private defaults.
- `scripts/ngo-full-scale-slice-15-ai-evidence-parsing.test.mjs`: AI suggestions private, suggestion-only, human review required.
- `scripts/ai-control-foundation.test.mjs`: deny-by-default AI, budget/cache/logging hooks, forbidden outcomes.
- `scripts/ai-provider-import-guard.test.mjs`: no direct provider imports outside approved path.
- File security tests: quarantine-first scan status, raw file protections, manual review.

Verification run:

- `npm test`: passed, **176/176**.
- Research/evidence/AI/scoring/Shopping subset: passed, **61/61**.
- `supabase migration list --linked`: passed/aligned through `202605260009`.
- `npm run build`: passed.

Tooling caveats:

- `npm run typecheck` failed before build-generated Next route types existed: `.next/types/validator.ts` could not find `./routes.js`.
- `npm run lint` failed because the local Next ESLint plugin path could not resolve `fast-glob`.
- These were not addressed because this was a documentation-only audit.

Still untested:

- Browser/manual source-review workflow.
- Product-not-found queue, because it does not exist.
- Live research request flow.
- Real NGO file review/scanner behavior.
- Real email/Auth evidence workflows.
- External legal/security/accessibility review.

## 20. Guardrails

Confirmed:

- No fake evidence.
- No fake sources.
- No fake claims.
- No fake products.
- No fake suppliers.
- No fake manufacturers.
- No fake NGO reports.
- No copied outside score as Mishava Score.
- No final score before reviewed evidence and approved scoring logic.
- No paid ranking.
- No affiliate/commission-driven ranking.
- No medical claims.
- No AI final trust outcomes.
- Human review remains required for reviewed evidence.
- Missing evidence remains visible.
- Mishava is not the store.
- Payment cannot influence trust outcomes.
- Dsuupr remains separate.
- `dsuupr-am` was not touched.
- Old Supabase was not touched.

## 21. What Is Missing

### Must Fix Before Shopping Slice 14

1. Product-not-found request path: lets users request research without fake products. Effort: medium; code/data model/browser test.
2. Source-review workflow definition: prevents request data from becoming fact. Effort: medium; methodology/code.
3. User-facing request status labels: keeps expectations honest. Effort: small; copy/code.

### Must Fix Before Preliminary Evidence Match

1. Claim templates for toilet paper. Effort: medium; methodology/code/tests.
2. Reviewed-only preliminary match rules. Effort: medium; methodology/tests.
3. Conflict/stale-source labels. Effort: medium; code/methodology.

### Must Fix Before First Final Mishava Scores

1. Approved scoring methodology. Effort: large; methodology/external review.
2. Accepted structured claims for category sample. Effort: medium; operations/data.
3. Correction/appeal workflow. Effort: medium; code/ops/legal.

### Must Fix Before NGO Public Self-Serve

1. Real malware scanner or strict manual-review cohort policy. Effort: medium/large; ops/security.
2. Real inbox/Auth verification. Effort: small/medium; ops/browser.
3. Public report review guardrails. Effort: medium; code/legal.

### Must Fix Before Business/Local Claim Flow

1. Business identity/source template. Effort: medium.
2. Ownership/claim workflow. Effort: large.
3. Evidence submission/review queue. Effort: large.

### Must Fix Before Government/Corporate Trust Use

1. Audit-ready source lineage. Effort: large.
2. Exportable evidence trail. Effort: medium/large.
3. External legal/compliance review. Effort: large.

### Should Fix Soon

- Source freshness cadence.
- Reviewer assignment/history.
- Simpler public source-card hierarchy.

### Nice To Have

- Source snapshot/archive metadata.
- Public changelog for evidence corrections.

### Later / Not Now

- Autonomous crawling.
- AI-powered claim drafting at scale.
- Full supplier database.

## 22. What Is Done

Source metadata done:

- Shopping product/place source URLs, review statuses, captured dates.
- NGO evidence source name/type/URL/document path/confidence.

Shopping evidence cards done:

- Product source card.
- Brand sourcing context card.
- External evidence reference card.
- Place-to-buy source card.

Research task foundation done:

- `shopping_research_tasks` status model.
- Source count, unresolved gap count, review dates, confidence summary.

Evidence gap display done:

- Supplier/manufacturer gaps.
- Score-pending missing requirements.
- Source-card gap text.

Supplier/manufacturer transparency done:

- Retailer, brand, private-label owner, parent company, manufacturer, supplier, source URLs, confidence labels.

NGO evidence docs/runbooks done:

- File review/upload safety runbook.
- NGO operational readiness docs.
- AI evidence parsing readiness docs.

AI-control guardrails done:

- Central wrapper.
- Deny-by-default.
- Provider import guard.
- Budget/cache/logging hooks.

Tests done:

- 176/176 full tests passed.
- 61/61 targeted research/evidence subset passed.

Deployment/live protections done:

- Clean Mishava V2 project separation.
- Shopping live domain.
- No `dsuupr-am` work in this audit.

## 23. Recommended Next Tasks

### Next 3

1. **Plan Product-Not-Found Research Queue and Source Review Workflow**
   - Purpose: unblock Shopping Slice 14 safely.
   - Output: planning doc.
   - Checks: docs/tests plan.
   - Type: methodology + code plan.
   - Before Slice 14: yes.
   - Before final scores: yes.

2. **Implement Product Lookup and Product-Not-Found Request**
   - Purpose: let users search/request without fake products.
   - Output: result doc, tests.
   - Checks: `npm test`, build, live route smoke.
   - Type: code/data model/browser test.
   - Before Slice 14: yes.
   - Before final scores: yes.

3. **Plan Source Review Queue**
   - Purpose: make research work operational.
   - Output: source-review workflow plan.
   - Checks: admin/permission tests plan.
   - Type: methodology/admin plan.
   - Before Slice 14: preferably.
   - Before final scores: yes.

### Next 7

4. Implement minimal source-review queue.
5. Plan toilet paper structured claim template.
6. Implement reviewed-only toilet paper claim template.
7. Add stale/conflicting source states.

### Next 14

8. Add correction/report-issue queue for Shopping evidence.
9. Add reviewer assignment/history.
10. Add public source-card simplification pass.
11. Add NGO self-submitted evidence labels and report caveats audit.
12. Decide NGO scanner/manual-review production policy.
13. Add persistent AI cache/budget storage without provider calls.
14. Write public methodology draft for evidence preview versus final scores.

## 24. New Chat Setup

Use `docs/chat-handoffs/mishava-research-evidence-new-chat-brief.md` as the short handoff for a new focused chat.

The new chat should focus on source review, product-not-found research requests, evidence gaps, human-reviewed claims, and operational workflow. It should not drift into final scoring, AI providers, scraping, checkout, paid ranking, or broad product expansion.

## 25. Suggested First Codex Prompt

```text
Plan Mishava Research + Evidence Slice 1: Product-Not-Found Research Queue and Source Review Workflow.

Use docs/chat-handoffs/mishava-research-evidence-deep-current-state-audit.md and docs/chat-handoffs/mishava-research-evidence-new-chat-brief.md as source of truth.

Scope:
Research/evidence operations planning only.

Do not implement product features yet.
Do not add products.
Do not add migrations unless the plan explicitly recommends a future migration.
Do not add AI provider calls.
Do not build crawler/scraping.
Do not add scoring logic.
Do not create fake products, fake sources, fake claims, fake suppliers, fake manufacturers, fake evidence, or fake scores.
Do not touch DNS, Vercel, Supabase settings, dsuupr-am, or old Supabase.

Plan:
1. Product-not-found user flow.
2. Minimum request fields.
3. Research task statuses.
4. Source review workflow.
5. Human review roles and audit trail.
6. User-facing labels for requested / found / gap / stale / rejected states.
7. Tests and acceptance criteria.

Commit only the planning document.
```
