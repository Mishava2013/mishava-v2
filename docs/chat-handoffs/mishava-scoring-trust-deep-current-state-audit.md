# Mishava Scoring + Trust Deep Current-State Audit

Date: 2026-06-23

## 1. Executive Summary

Mishava has a real scoring and trust foundation, but it does **not** yet have final public Mishava Scores. The system is intentionally conservative: evidence can be collected, reviewed, attached to structured claims, and prepared for private draft score snapshots, but score publication is blocked until reviewed evidence, methodology versioning, and supported scoring logic exist.

Current scoring/trust readiness estimate: **50-55% foundation complete**.

This estimate reflects strong guardrails, data models, payment firewalls, AI controls, supplier transparency, and score-pending UI. It does not mean Mishava is ready to publish final scores across Shopping, NGO, Business, Government, Corporate, or Plus surfaces.

The safest next scoring/trust task is:

**Plan Mishava Scoring + Trust Slice 1: Toilet Paper Structured Claim Template and Preliminary Evidence Match Rules.**

That task should stay non-final: no final Mishava Score, no medical claims, no AI final scoring, and no payment influence.

## 2. Percent Estimates

| Area | Estimate | Notes |
| --- | ---: | --- |
| Overall Scoring + Trust foundation | **50-55%** | Strong guardrails and data structures; final scoring still absent. |
| Baseline Mishava Score readiness | **20-28%** | Code/types and inactive methodology seed exist; no final active score path. |
| Evidence Score / readiness | **45-55%** | Source/evidence display, claim references, and draft snapshots exist; category rubric missing. |
| Coverage / recency / confidence | **42-52%** | Levels exist and are displayed, but rubric is not fully formalized. |
| Personal Values Match | **30-40%** | Priorities exist; match withheld unless priorities and reviewed evidence support it. |
| Product-level trust readiness | **35-45%** | Shopping POC has real data and pending states; final score pipeline not complete. |
| Company / supplier transparency | **55-65%** | Strong for toilet paper POC; not platform-wide. |
| NGO trust readiness | **65-75%** | Evidence/report trust states exist; no NGO score should be claimed. |
| Payment firewall | **88-94%** | Strong code and tests; must remain continuously enforced. |
| AI trust guardrails | **82-88%** | Central deny-by-default wrapper and provider import guard exist; no provider adapter enabled. |
| Public scoring explanation | **55-65%** | Score-pending language is good; deeper methodology still needs plain-language docs. |
| Admin/review workflow | **35-45%** | Draft review paths exist, but operational scoring admin is still limited. |

## 3. Current Scoring States

Current safe user-facing states:

- `Score pending`
- `Evidence profile pending`
- `Draft trust context`
- `External evidence available`
- `Mishava is still reviewing this`
- `Evidence Score Preview`
- `Your Values Match Preview`
- `Not enough evidence`

Current unsafe states that should not appear as final claims:

- Final Mishava Score
- Certified score
- Verified by Mishava, unless a specific reviewed verification workflow supports that claim
- Medical-safe score
- Best for Crohn's or any medical condition
- Paid/ranked/boosted trust label

Shopping currently uses score-pending and preview language. NGO reports use evidence-backed/report-readiness language rather than final trust scoring. Admin scoring surfaces show draft/inactive methodology status.

## 4. Baseline Mishava Score

What exists:

- `src/lib/scoring.ts` defines the scoring types, pillar IDs, confidence/coverage/recency levels, weighted score helpers, and payment-firewall assertions.
- `defaultScoringVersion` exists with code `Mishava_Scoring_V2.01_2026.05.24`.
- That default scoring version is explicitly `active: false`.
- `score_snapshots` exist in the database model.
- Published score snapshots require public visibility and published status before public reads.

What is missing:

- No active baseline Mishava Score methodology.
- No approved category-independent score calculation path for public use.
- No public methodology explanation for a final Mishava Score.
- No appeal/correction workflow wired into score publication.

Conclusion:

The baseline Mishava Score is a foundation, not a launchable final score.

## 5. Evidence Score / Evidence Readiness

What exists:

- `evidence_items` store source metadata, verification status, confidence, visibility, and review timestamps.
- `structured_claims` require evidence references.
- `createDraftScoreSnapshot` only uses accepted structured claims with evidence IDs.
- Shopping product detail pages show source-backed evidence cards.
- Toilet paper products show evidence dimensions and evidence gaps.
- Outside scorecards can be stored as evidence references only.

What is missing:

- A category-specific rubric that says which reviewed claims are required for an Evidence Score Preview.
- A formal coverage/recency/confidence weighting method.
- A clear threshold for moving from `external_evidence_available` to `reviewed_claims` to `score_ready`.
- Admin tooling for reviewing sources and claims at scale.

Recommended direction:

The next slice should define a small toilet paper claim template and preliminary evidence match rules before adding any final score math.

## 6. Personal Values Match

What exists:

- Shopping Priorities are persisted with a 12-answer minimum.
- Values Match is withheld unless priorities and published evidence support it.
- Shopping copy explains that priorities do not create final scores or medical suitability claims.
- `getYourValuesScoreState` prevents fake values scores when evidence is incomplete.

What is missing:

- A transparent mapping from priorities to reviewed claim categories.
- A non-numeric preliminary match state for partial evidence.
- A public explanation that values match is a preference overlay, not the base Evidence Score.

Current readiness:

Personal Values Match is useful as a setup and eligibility path, but not as a final scoring engine.

## 7. Preliminary Evidence Match

What exists:

- Toilet paper preview copy shows what Mishava found and what Mishava still needs.
- Product pages can explain why no final score exists.
- Evidence dimensions exist for toilet paper concerns such as recycled content, bamboo/FSC, virgin fiber, fragrance/free-from, comfort claims, packaging, supplier transparency, and source freshness.

What is missing:

- A formal preliminary match vocabulary.
- A reviewed-only rule for which evidence can appear in preliminary match summaries.
- Tests that prevent unreviewed research tasks from becoming preliminary match facts.

Recommended safe labels:

- `Good evidence for this concern`
- `Some evidence, still incomplete`
- `Not enough reviewed evidence`
- `Evidence gap`
- `Outside reference only`

Avoid:

- numeric personal scores
- medical suitability labels
- best/worst rankings
- final score language

## 8. Source And Claim Hierarchy

Current source hierarchy:

- Primary sources: brand/manufacturer official pages, product pages, retailer pages, packaging/labels where reviewed, certifications/certifier databases, sustainability/sourcing reports, regulatory or government sources where relevant.
- Secondary sources: NGO reports, third-party scorecards, credible journalism, academic or industry reports.

Current rules:

- Source URL and review status are required for active Shopping product records.
- Outside scorecards are evidence references, not Mishava Scores.
- Research tasks are not verified facts.
- AI suggestions are not verified facts.

Missing:

- A centralized, code-level claim template registry for all categories.
- A source freshness cadence per category.
- A normalized source-review admin queue.

## 9. Claim Template System

What exists:

- Structured claims exist in the core schema.
- Claims require evidence item IDs.
- Draft and rejected claims are excluded from draft score snapshots.
- Accepted claims require human review and evidence references.
- Shopping has toilet paper evidence dimensions and research templates.

What is missing:

- Category-specific structured claim templates for toilet paper.
- Required/optional claim grouping by category.
- Plain-language claim definitions.
- Public explanation of what each claim proves and does not prove.

First recommended template:

Toilet paper should start with a small reviewed claim set:

- Product identity
- Brand / private-label owner
- Manufacturer / supplier transparency
- Recycled or post-consumer recycled content
- Bamboo / FSC / tree-free claim
- Virgin fiber reliance
- Bleaching/process claim
- Fragrance/free-from/comfort claim
- Packaging claim
- Price/count/source freshness
- Third-party reference context

## 10. Product / Company / Supplier Relationship Scoring

What exists:

- Shopping products distinguish retailer, brand, private-label owner, parent company, manufacturer, supplier, supplier role, supplier region, source URLs, confidence, and evidence gaps.
- Costco/Kirkland is modeled as retailer/private-label owner without guessing manufacturer/supplier.
- Kruger/Cashmere/Purex separates consumer brand from Kruger Products where source support exists.
- Unknown manufacturer/supplier values display as evidence gaps.

What is missing:

- A formal rule for how product-level evidence, brand-level evidence, parent-company evidence, manufacturer evidence, supplier evidence, and retailer evidence flow into a preview score.
- Evidence inheritance rules.
- Confidence penalties or caveats for unknown supplier/manufacturer identity.

Required future rule:

Mishava must not give credit or blame to a retailer, brand owner, manufacturer, or supplier unless the evidence supports that role.

## 11. Payment Firewall

What exists:

- `assertNoForbiddenTrustInfluenceInputs`
- `assertRankingInputsRespectPaymentFirewall`
- `assertBillableEntitlementsDoNotContainTrustControls`
- Ranking input allowlist.
- Payment-derived forbidden input list.
- Migration constraints for no paid ranking.
- Tests prove payment status, affiliate, commission, sponsorship, billing, Stripe, and hosted-profile concepts cannot affect ranking or score inputs.

Current status:

Payment firewall readiness is strong. It should be treated as a platform invariant.

Future requirement:

Every new Business, Local, Corporate, Government, Plus, and Shopping monetization feature must include a payment-firewall test before release.

## 12. AI-Control And Scoring

What exists:

- `src/lib/ai-control.ts` central AI wrapper.
- Deny-by-default feature controls.
- Suggestion-only envelopes.
- Budget/cache/logging hooks.
- Forbidden outcome blocking for scores, rankings, verification, trust badges, publishing, supplier approval, seller approval, NGO escalation, payment/access decisions, and legal/compliance conclusions.
- Provider import guard test.
- No real AI provider calls.

What is missing:

- Persistent budget snapshot retrieval.
- Persistent cache storage.
- Provider adapter implementation behind the approved wrapper.
- UI for review of AI suggestions at scale.

Scoring rule:

AI may suggest sources, claim drafts, or gaps later, but AI must not verify facts, create final scores, publish trust outcomes, approve suppliers/sellers, escalate NGOs, or make legal/compliance conclusions.

## 13. Medical / Care-Sensitive Guardrails

What exists:

- Toilet paper user flow avoids Crohn's claims.
- Product pages use no-medical-advice language.
- Sensitive-use evidence is limited to source-supported comfort/fragrance/free-from claims.

What is missing:

- Automated text guard for medical-suitability phrases across future Shopping copy.
- A formal sensitive-use vocabulary for consumer categories.

Required guardrail:

Never claim that a product is safe, best, medically recommended, non-irritating, or suitable for Crohn's or any medical condition.

## 14. NGO Trust Scoring / Readiness

What exists:

- NGO evidence items, structured claims, reports, scoped sharing, audit logs, and private report defaults.
- Draft/rejected claims are excluded from trust summaries.
- AI evidence parsing remains suggestion-only.
- Reports can show evidence-backed context and gaps.

What should not exist yet:

- NGO trust score.
- NGO certification claim.
- Funder approval prediction.
- Paid trust outcome.

Safe NGO labels:

- `Evidence attached`
- `Needs review`
- `Ready to include in a draft report`
- `Missing evidence`
- `Reviewed claim`
- `Private report`

Unsafe NGO labels:

- `Certified`
- `Verified NGO`
- `Funder approved`
- `Guaranteed credible`
- `Mishava Score`, unless a future reviewed NGO methodology supports it.

## 15. Government / Corporate / Business / Plus Implications

Government:

- Needs public procurement evidence and accountability language.
- Must not imply FedRAMP, government approval, or certified vendor status.

Corporate:

- Needs vendor review, audit trails, exports, and compliance-readiness language.
- Must not overclaim legal/compliance conclusions.

Business/Local:

- Needs claim flow, profile ownership, product catalog ownership, evidence submission, and correction workflow.
- Paid profiles must not affect trust labels, ranking, verification, or credibility.

Plus:

- Needs preferences, saved products, alerts, comparison tools, and privacy controls.
- Personalization must remain separate from base Evidence Score.

## 16. Public Readability

What works:

- Shopping now uses plainer language such as `Mishava is still reviewing this`.
- Product pages explain what Mishava found and what is still missing.
- NGO pages have been simplified for pilot users.

What still needs work:

- Methodology language is still mostly internal.
- Evidence confidence/source details can feel dense.
- `Evidence Score Preview` and `Your Values Match Preview` need plain-language explanations before broader use.

Recommendation:

Create a public `How Mishava scores work` page only after the first category template and preview rules are defined.

## 17. Data Model And Migrations

Relevant model foundations:

- `evidence_items`
- `structured_claims`
- `scoring_versions`
- `score_snapshots`
- `scoring_methodology_changes`
- `ranking_formula_versions`
- `ranking_audit_samples`
- `shopping_products`
- `shopping_places_to_buy`
- `shopping_priority_profiles`
- `shopping_research_tasks`

Important constraints:

- Structured claims require evidence references.
- Public score snapshots require publication and public visibility.
- Shopping score values require score snapshot and published date.
- Toilet paper score-ready state requires supported evidence status and supplier/manufacturer context.
- Verified manufacturer/supplier claims require source URLs.

No new migration was added in this audit.

## 18. Tests And Verification

Commands run during this audit:

- `npm test` - passed, **176/176**
- `node --test scripts/payment-firewall.test.mjs scripts/ai-control-foundation.test.mjs scripts/ai-provider-import-guard.test.mjs scripts/release-4-shopping.test.mjs` - passed, **45/45**
- `supabase migration list --linked` - passed/aligned through `202605260009`
- `npm run build` - passed

Known local tooling caveats observed:

- `npm run typecheck` failed before build-generated Next route types existed: `.next/types/validator.ts` could not find `./routes.js`.
- `npm run lint` failed because the local Next ESLint plugin path could not resolve `fast-glob`.
- `npm run build` completed successfully, including its TypeScript phase.

Interpretation:

The scoring/trust audit found no product-scoring blocker from tests. The standalone typecheck/lint issues are local tooling/dependency-generation caveats and should be handled separately if they recur.

## 19. Guardrails Confirmation

Confirmed:

- No final Mishava Scores are active.
- No fake scores are used.
- No AI provider calls are enabled.
- AI cannot affect trust outcomes through the central control layer.
- Payment cannot affect score/ranking/trust inputs in the tested scoring helpers.
- Outside scorecards are evidence references only.
- Supplier/manufacturer unknowns remain evidence gaps.
- Shopping Priorities do not create fake values scores.
- Medical suitability claims remain forbidden.

## 20. What Is Missing

Top missing items:

1. Category-specific structured claim template for toilet paper.
2. Preliminary Evidence Match rules that use only reviewed claims.
3. Coverage/recency/confidence rubric.
4. Public methodology explanation for preview and final score states.
5. Score publication workflow with correction/appeal gates.
6. Evidence inheritance rules across product, brand, parent company, manufacturer, supplier, and retailer.
7. Admin source/claim review queue.
8. Persistent AI budget/cache implementation.
9. Medical/care-sensitive copy guard test.
10. Broader category templates beyond toilet paper.

## 21. What Is Done

Top completed items:

1. Core evidence, claim, scoring version, and score snapshot schema.
2. Draft score snapshots that exclude draft/rejected claims and avoid fake score values.
3. Payment firewall helper/tests and ranking input allowlist.
4. Shopping score-pending and evidence-gap UI.
5. Shopping supplier/manufacturer transparency for toilet paper.
6. Costco/Kirkland and Kruger/Cashmere/Purex handling without guessed suppliers.
7. Shopping Priorities setup with values-score withholding.
8. Source-backed toilet paper evidence cards.
9. AI minimize wrapper and provider import guard.
10. NGO evidence/report trust readiness without final trust scoring.

## 22. Recommended Next Tasks

1. **Plan Scoring + Trust Slice 1: Toilet Paper Structured Claim Template and Preliminary Evidence Match Rules.**
2. Implement the approved toilet paper claim template as code/config plus tests.
3. Add reviewed-claim-only preliminary match summaries to toilet paper product detail pages.
4. Add public plain-language methodology copy for score pending vs preview vs final score.
5. Add a correction/appeal plan for product evidence and preliminary match summaries.
6. Add source/claim review admin queue.
7. Add medical/care-sensitive copy guard tests.
8. Define evidence inheritance rules across product/company/supplier entities.
9. Add persistent AI budget/cache storage without enabling provider calls.
10. Repeat the scoring audit after the first reviewed claim template is implemented.

## 23. New-Chat Setup

Use this audit and `docs/chat-handoffs/mishava-scoring-trust-new-chat-brief.md` as the start point for the next focused scoring/trust chat.

The next chat should not start from broad Mishava product questions. It should focus narrowly on turning the toilet paper preview from evidence cards and score-pending labels into a reviewed, non-final preliminary evidence match system.

## 24. Suggested First Codex Prompt

```text
Plan Mishava Scoring + Trust Slice 1: Toilet Paper Structured Claim Template and Preliminary Evidence Match Rules.

Use docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md and docs/chat-handoffs/mishava-scoring-trust-new-chat-brief.md as source of truth.

Do not implement final scores.
Do not add AI provider calls.
Do not allow AI, payment, affiliate, commission, sponsorship, plan status, or business relationship to affect scores, rankings, verification, publishing, supplier approval, seller approval, NGO escalation, payment/access, or legal/compliance conclusions.
Do not make medical claims.
Do not copy outside scorecards as Mishava Scores.

Create a plan for:
- toilet paper structured claim template
- reviewed-only preliminary evidence match rules
- coverage/recency/confidence labels
- source hierarchy
- product/brand/parent/manufacturer/supplier/retailer evidence separation
- Shopping Priorities mapping without fake values scores
- plain-language user-facing score-pending/preview language
- tests and acceptance criteria

Commit only the planning document.
```
