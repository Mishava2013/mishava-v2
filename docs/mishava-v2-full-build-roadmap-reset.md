# Mishava V2 Full Build Roadmap Reset

## Context

Mishava is a long-term trust infrastructure platform. Dsuupr is the immediate business priority, so Mishava should continue as a careful, structured build rather than a rush-to-launch project.

The goal is a strong product: accurate evidence, honest gaps, durable trust rules, clear user experience, and a payment firewall that cannot contaminate trust outcomes.

Current foundation:

- NGO is limited launch-ready with operational constraints.
- Shopping has baby diapers/wipes and toilet paper POC categories.
- Shopping has a controlled preview path for toilet paper evidence/gap walkthroughs.
- Shopping has supplier/manufacturer transparency and research-task infrastructure.
- Scores remain pending unless evidence and scoring logic support them.
- AI is suggestion-only with human review.
- Payment cannot affect score, ranking, verification, credibility labels, methodology outputs, evidence truth, or report conclusions.

Hard rules:

- No fake scores.
- No fake evidence.
- No fake suppliers or manufacturers.
- No fake product images.
- No paid ranking.
- No affiliate/commission ranking.
- No AI final trust outcomes.
- No medical claims.
- No premature compliance claims.
- Payment cannot affect trust outcomes.
- Missing evidence must remain visible as an evidence gap.

## Source of Truth

- `docs/ngo-full-scale-slice-17-final-launch-audit.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/release-4-shopping-poc-readiness-audit.md`
- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-4-slice-1-result.md`
- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-3-result.md`
- `docs/release-4-slice-4-shopping-cleanup-real-data-depth-result.md`
- `docs/release-4-slice-5-shopping-images-visual-trust-result.md`
- `docs/release-4-slice-6-shopping-toilet-paper-evidence-score-result.md`

## Current Readiness Snapshot

| Area | Estimate | Status |
| --- | ---: | --- |
| NGO | 75% | Limited launch-ready for supported/private pilots; not broad public self-serve ready. |
| Shopping | 35% | Controlled preview path exists for toilet paper evidence/gap walkthroughs; not broad consumer-ready. |
| Scoring foundation | 45% | Score snapshots, methodology boundaries, and payment firewall exist; category scoring is not final. |
| Research pipeline | 40% | Supplier transparency fields and lightweight research tasks exist; review operations are still manual. |
| Supplier transparency | 45% | Toilet paper has first real supplier/manufacturer transparency model; needs broader category backfill. |
| AI guardrails | 35% | Suggestion-only architecture exists; no production AI provider or final AI trust outcomes. |
| Billing/payment firewall | 55% | NGO test-mode Stripe foundation and payment firewall exist; production billing not enabled. |
| Compliance readiness | 35% | Readiness docs and conservative posture exist; no formal audits/certifications. |
| Business/Local | 15% | Early surfaces/profiles exist; claim/catalog/local inventory workflows are not built. |
| Government | 5% | Reserved concept/surface only. |
| Corporate | 8% | Reserved concept/surface only. |
| Plus | 10% | Shopping Priorities and saved account concepts exist; consumer account value is early. |
| Admin/support | 45% | NGO support dashboard exists; Shopping research/source/scoring admin tools remain limited. |

Overall Mishava V2 product estimate: **45-50% foundation complete**, with a strong base but substantial platform work remaining.

NGO plus Shopping proof-of-concept estimate: **80-85% demo/controlled-preview foundation complete**, with operational constraints.

## Release 4 Remaining Shopping Work

Release 4 should finish the Shopping POC as a careful preview system, not a full Shopping launch.

Remaining Shopping work:

- Toilet paper controlled preview smoke test.
- First evidence-to-score readiness audit.
- Reviewed structured claims for a small number of toilet paper products.
- First honest `Evidence Score Preview`, not a final Mishava Score.
- Shopping Priorities connection to environmental, sensitive-use, affordability, and transparency concerns.
- Product/source admin workflow.
- Feedback/report issue flow for wrong product data, missing supplier evidence, or outdated source links.
- Mobile polish for Shopping landing, category, product detail, and trust popup.
- Shopping readiness audit after real user walkthrough.
- Additional categories only after toilet paper proves the model.

Recommended additional categories after toilet paper:

- Laundry detergent.
- Baby formula or baby food, only with extreme caution and no medical claims.
- Household cleaners.
- Paper towels/tissues after toilet paper methodology matures.
- Feminine care products, only after sensitive-use language guardrails are stronger.

## Release 5: Business / Local / Catalog / Claim Flow

Release 5 should connect the product/research layer to real organizations and sellers.

Planned capabilities:

- Business profiles.
- Local profiles.
- Supplier and seller profiles.
- Product catalog ownership.
- Business claim flow.
- Local business claim flow.
- Supplier-to-seller connections.
- Hosted Mishava profile versus external website record.
- Evidence submission for businesses and suppliers.
- Verification workflow for business identity, product ownership, and claims.
- Correction/dispute path for product/company data.
- No paid placement.
- No paid ranking.

Important model distinctions:

- Seller is not always brand owner.
- Retailer is not always manufacturer.
- Private-label owner is not always supplier.
- Supplier may vary by region or time.
- Marketplace listings must not become truth claims.

Release 5 acceptance posture:

- Business/Local can improve data quality.
- Business/Local cannot buy trust outcomes.
- Business/Local cannot silently override evidence.
- All claim/evidence submissions require review state and audit trail.

## Government Product Surface

The government-facing product should be planned as transparency infrastructure, not as a premature compliance product.

Potential product:

- Transparent public purchasing support.
- Vendor/product evidence review.
- Procurement accountability dashboards.
- Public reporting readiness.
- Vendor evidence packets.
- Product/supplier risk summaries.
- Correction and dispute workflows.
- Media/public oversight layer later.

Government non-goals for now:

- No FedRAMP claims.
- No official government authorization claims.
- No procurement certification claims.
- No automatic vendor approval/rejection.
- No final scoring without reviewed methodology and human-reviewed evidence.

Recommended sequencing:

1. Build Shopping research/source integrity.
2. Build Business/Local claim and evidence submission.
3. Build Corporate procurement review.
4. Reuse those primitives for government transparency.

## Corporate / Institutional Surface

Corporate should focus on evidence-backed procurement and vendor review.

Planned capabilities:

- Institutional dashboards.
- Vendor/product review workspaces.
- Procurement support.
- Evidence/reporting tools.
- Audit trails.
- CSV/PDF/DOCX export path.
- Supplier comparison.
- Risk/evidence gaps.
- Team roles.
- Compliance-readiness support.

Corporate must preserve:

- No paid ranking.
- No silent trust manipulation.
- No vendor self-certification without review.
- No evidence gaps hidden for enterprise customers.

## Plus / Consumer Account Value

Plus should be consumer value without turning trust into pay-to-rank.

Planned capabilities:

- Consumer preferences.
- Saved values/priorities.
- Saved products.
- Product watchlist.
- Alerts/following.
- Comparison tools.
- Values Match, only when evidence supports it.
- Household/family needs.
- Privacy controls.
- Export/delete request path later.

Consumer-specific guardrails:

- No medical claims.
- No hidden paid placement.
- No fake personalized scores.
- No values score without priorities and evidence.
- No sensitive health inference beyond user-controlled preferences.

## Scoring Methodology Roadmap

Scoring must remain evidence-first and versioned.

Planned layers:

1. Baseline Evidence Score.
2. Category-specific scoring models.
3. Personal Values Match.
4. Coverage, recency, and confidence.
5. Score snapshots.
6. Methodology versioning.
7. Public explanation.
8. Appeal/correction process.
9. Evidence gap display.
10. Auditability.

Rules:

- No AI final scoring without human-approved evidence/model.
- No payment, plan, affiliate, commission, sponsorship, or billing field can affect score/ranking/trust output.
- Outside scorecards can be evidence references only.
- Missing evidence remains visible.
- Scores require published snapshot and method version.
- Draft claims and rejected claims do not enter public scores.

Near-term scoring path for toilet paper:

1. Select 3-5 products for deeper review.
2. Create structured claims from reviewed sources.
3. Human-review claims.
4. Define a preview scoring rubric.
5. Generate a non-final `Evidence Score Preview`.
6. Test user comprehension.
7. Only later decide whether to publish final category scoring.

## Data and Research Operations

Mishava needs a repeatable research operation before it needs scale.

Planned operations:

- Research task queue.
- Source review workflow.
- Supplier/manufacturer verification.
- Confidence labels.
- Stale data handling.
- Product/category review cadence.
- Human review workflow.
- Evidence gap notes.
- Corrections/disputes.
- Future AI-assisted source suggestions.

Research task statuses should continue to use:

- `research_needed`
- `source_found`
- `claim_drafted`
- `human_review_needed`
- `reviewed`
- `evidence_gap`
- `stale`
- `rejected`

Future AI guardrails:

- AI can suggest sources, claims, and gaps.
- AI cannot mark claims verified.
- AI cannot create Mishava Scores.
- AI cannot change ranking/trust outcomes.
- Human review is required.
- Source URLs are mandatory.
- Website terms and privacy rules must be respected.

## Admin and Support Operations

Admin/support needs to grow from NGO support into trust operations.

Planned capabilities:

- Support dashboard expansion.
- Product/source review tools.
- Research task queue UI.
- Correction/dispute queue.
- Evidence review queue.
- Scoring admin guardrails.
- Audit logs.
- Sensitive action logging.
- No raw file exposure by default.
- No silent trust manipulation.

Critical admin rules:

- Admins cannot directly edit final trust outcomes without audited workflow.
- Admins cannot hide evidence gaps for paying customers.
- Support cannot silently alter scores.
- Source review changes must be traceable.

## Launch Sequencing

Mishava should launch in layers.

### 1. Internal Demo

Can show now:

- NGO supported pilot loop.
- Shopping baby diapers/wipes POC.
- Shopping toilet paper evidence/gap preview.
- Supplier/manufacturer transparency.
- No-paid-ranking/no-commission policy.
- Payment firewall concepts.

### 2. Controlled Preview

Requires:

- Toilet paper controlled preview smoke test.
- Mobile review.
- User comprehension review.
- Feedback/report issue path.
- Clear DNS/domain setup.
- No fake score audit.

### 3. Limited Beta

Requires:

- Business/Local claim flow.
- Product/source review admin workflow.
- First structured claims workflow.
- More complete Shopping support path.
- Email/domain stability.
- Operational support readiness.

### 4. Public Beta

Requires:

- Strong source review operations.
- First published methodology docs.
- Scoring preview or final scoring rules tested.
- Legal/privacy/security review.
- Malware/file-security hardening where user uploads are involved.
- Production monitoring and support process.

### 5. Broader Public Launch

Requires:

- Mature support operations.
- Formal legal review.
- External accessibility/security review.
- Production billing if monetization is live.
- Data freshness operations.
- Clear public correction/dispute system.

## What Should Wait Until After Dsuupr Is Further Past Pilot Phase

- Broad Mishava public launch.
- Plus subscription monetization.
- Government product sales.
- Corporate enterprise push.
- Final public scoring claims across many categories.
- Large-scale data ingestion.
- Production AI provider integration for research.
- Formal SOC 2/ISO/VPAT processes beyond readiness preparation.

## Risk Register

| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Fake or weak data | Trust product collapses if data is padded. | Real-source-only guardrails, review status, evidence gaps. |
| Overclaiming scores | Users may treat preview as final truth. | Conservative labels, published snapshot requirement, methodology versioning. |
| Affiliate/commission contamination | Paid commerce incentives could destroy trust. | Payment firewall, no commission sorting, tests. |
| Legal/compliance overclaims | Institutional users may rely on unsupported claims. | Conservative readiness language, no certification claims. |
| Supplier uncertainty | Retailer/brand/manufacturer confusion can mislead users. | Separate fields, confidence labels, source URLs, unknown states. |
| AI overreach | AI can hallucinate or overstate evidence. | Suggestion-only, human review, no AI final outcomes. |
| Data freshness | Product/source data can become stale quickly. | Review cadence, stale status, source freshness labels. |
| User misunderstanding | Users may assume Mishava is a store, doctor, or certifier. | Clear labels: not store, not medical advice, not final score. |
| Support burden | Controlled previews can create operational demands. | Keep preview small, add feedback/report issue flow. |
| DNS/domain confusion | Live surfaces may appear broken if subdomains are not configured. | Domain checklist and Cloudflare/Vercel verification before preview. |

## Next 10 Recommended Slices

### Slice 1: Release 4 Slice 9 - Shopping Controlled Preview Smoke Test

Purpose: Verify toilet paper preview works for a real user flow.

Scope:

- Shopping landing.
- Toilet paper category.
- Product detail.
- Costco/Kirkland and Kruger/Cashmere/Purex pages.
- Trust popup.
- Mobile smoke.
- No-medical-claim review.
- Feedback notes.

Non-goals:

- New categories.
- Final scores.
- Checkout.
- AI scoring.

Acceptance criteria:

- A normal user can find toilet paper.
- Evidence gaps are understandable.
- No fake scores or medical claims appear.
- Mobile is usable.
- DNS/live route status is documented.

### Slice 2: Release 4 Slice 10 - Toilet Paper Structured Claims Readiness

Purpose: Move from source notes to reviewed structured claims for a tiny product set.

Scope:

- Select 3-5 products.
- Create claim template.
- Source-backed structured claim drafts.
- Human review state.
- Rejected/draft claims excluded from scoring.

Non-goals:

- Final scoring methodology.
- Broad category expansion.

Acceptance criteria:

- Claims are source-backed.
- Claims require review.
- Claims connect to products and evidence.
- No final score appears.

### Slice 3: Release 4 Slice 11 - Evidence Score Preview Rubric Draft

Purpose: Define the first non-final preview rubric for toilet paper.

Scope:

- Coverage/recency/confidence rubric.
- Environmental/sourcing dimensions.
- Supplier transparency dimension.
- Preview label rules.

Non-goals:

- Public final score.
- Medical suitability.

Acceptance criteria:

- Rubric is documented.
- Preview cannot publish final score.
- Missing evidence lowers confidence or remains incomplete.

### Slice 4: Release 4 Slice 12 - Shopping Feedback and Correction Flow

Purpose: Let early users report wrong/missing product evidence.

Scope:

- Product issue form.
- Correction request record.
- Support/admin view or placeholder queue.
- Audit event.

Non-goals:

- Full CRM.
- Public comments.

Acceptance criteria:

- Users can report issue.
- No automatic data change.
- Support can review.

### Slice 5: Release 4 Slice 13 - Product Source Admin Workflow

Purpose: Build minimal internal tool for source review and freshness.

Scope:

- Source review status.
- Freshness date.
- Evidence gap note editing.
- Research task status updates.

Non-goals:

- Full catalog admin.
- Vendor self-service.

Acceptance criteria:

- Admin/support can update review metadata.
- Changes are audited.
- Trust outcomes cannot be silently edited.

### Slice 6: Release 5 Slice 1 - Business Profile and Claim Flow Plan

Purpose: Plan Business/Local claim flow before implementation.

Scope:

- Business identity.
- Profile ownership.
- Claim flow.
- Evidence submission.
- Verification states.

Non-goals:

- Paid placement.
- Product catalog monetization.

Acceptance criteria:

- Claim flow is evidence-first.
- Payment cannot change trust.
- Business and seller roles are clear.

### Slice 7: Release 5 Slice 2 - Business/Local Profile Foundation

Purpose: Implement minimal Business/Local profile and claim foundation.

Scope:

- Profile schema.
- Claim request.
- Owner verification status.
- Basic public/hosted profile.

Non-goals:

- Local inventory.
- Checkout.
- Ads.

Acceptance criteria:

- Businesses can request claim.
- Claims do not grant trust outcomes.
- Admin review is required.

### Slice 8: Release 5 Slice 3 - Product Catalog Ownership

Purpose: Connect businesses/suppliers to products without letting them dictate truth.

Scope:

- Catalog ownership link.
- Supplier/seller/product relationships.
- Evidence submission for product claims.
- Review status.

Non-goals:

- Marketplace checkout.
- Paid sorting.

Acceptance criteria:

- Ownership is separate from evidence truth.
- Supplier/manufacturer roles remain explicit.
- Claims require review.

### Slice 9: Release 5 Slice 4 - Corporate Procurement Review Plan

Purpose: Plan institutional procurement surface.

Scope:

- Vendor review dashboard.
- Product comparison.
- Evidence gaps.
- Export/report needs.
- Audit trail.

Non-goals:

- Government procurement claims.
- Compliance certification claims.

Acceptance criteria:

- Corporate surface reuses evidence/scoring primitives.
- No paid trust outcomes.
- Export and audit needs are scoped.

### Slice 10: Release 5 Slice 5 - Plus Consumer Value Plan

Purpose: Plan consumer account value before implementation.

Scope:

- Saved products.
- Priorities.
- Alerts.
- Comparisons.
- Household preferences.
- Privacy controls.

Non-goals:

- Medical recommendations.
- Pay-to-rank benefits.

Acceptance criteria:

- Plus adds user utility, not trust manipulation.
- Personal match remains evidence-backed.
- Privacy controls are explicit.

## Suggested Release Order

1. Finish Release 4 Shopping controlled preview and evidence-to-score readiness.
2. Begin Release 5 Business/Local claim and catalog ownership.
3. Build Corporate procurement review on top of the evidence/product/company model.
4. Plan Government after Corporate primitives prove useful.
5. Build Plus consumer account value after Shopping preview proves what users actually save, compare, and follow.

## Recommended Next Codex Task

Next recommended slice:

**Run Release 4 Slice 9: Shopping Controlled Preview Smoke Test.**

Why:

- It is the smallest next step.
- It tests the toilet paper user path before adding more machinery.
- It can reveal UX, mobile, wording, DNS, and evidence-gap comprehension issues.
- It protects Mishava from building deeper scoring/admin features before the preview experience is understandable.

Expected output:

- Browser/mobile smoke result.
- Screenshots if useful, ignored/uncommitted.
- Pass/fail checklist.
- User-facing blockers.
- Whether toilet paper preview is ready to show to the interested early user.
- No new product features unless tiny copy fixes are required.
