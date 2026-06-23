# Mishava V2 Current-State Category Review

Date: 2026-06-23

## Executive Summary

Mishava V2 is now a working trust-infrastructure foundation with two strongest product centers: NGO and Shopping. NGO has a coherent supported-pilot workflow, while Shopping has a live controlled-preview path for toilet paper on the clean Mishava V2 deployment.

Overall Mishava V2 estimate: **58-62% foundation complete**.

This is not a public-launch estimate. It reflects the platform foundation, clean deployment alignment, early real data, guardrails, and pilot readiness work already completed.

Strongest areas:

- NGO private/supported pilot workflow.
- Shopping toilet paper guided preview.
- Clean Mishava V2 GitHub and Vercel separation.
- Payment firewall and no-paid-trust guardrails.
- Supplier/manufacturer transparency model.
- AI-minimize control foundation and provider import guard.
- Compliance readiness documentation.
- Auth/sign-in popup routing improvements.

Weakest areas:

- Broad public self-serve readiness.
- Real NGO live email/Auth inbox verification.
- Production monitoring, backup, incident drills.
- Real malware scanning for public uploads.
- Business/Local claim flow.
- Government, Corporate, and Plus product surfaces.
- Final scoring methodology.
- Research/source admin operations.

Top 10 blockers:

1. Real NGO inbox verification for sign-up, password reset, and invites.
2. NGO file-upload policy needs either real scanner integration or explicit supported/manual review constraints.
3. Final NGO browser/mobile pilot smoke still needs real account proof.
4. Production monitoring, backup/restore, and incident drills are not complete.
5. No external legal/accessibility/security review has been completed.
6. Shopping still has no final Mishava Scores.
7. Shopping research/source review remains mostly manual and early.
8. Business/Local/Supplier claim flow is not built.
9. Government, Corporate, and Plus are mostly planned/reserved.
10. Local/domain deployment history remains confusing enough that future work must stay on clean `mishava-v2`.

Top 10 next opportunities:

1. Run NGO real inbox/Auth test on `ngo.mishava.org`.
2. Run final NGO browser/mobile pilot checklist.
3. Implement Shopping Slice 14 product lookup/research-request flow.
4. Add Shopping feedback/report issue flow.
5. Build minimal product/source admin workflow.
6. Create first reviewed structured toilet paper claim set.
7. Draft non-final Evidence Score Preview rubric.
8. Plan Business/Local claim flow from the existing supplier transparency model.
9. Expand Admin/Ops review queues for evidence, corrections, and sources.
10. Keep AI provider integration disabled while strengthening budget/cache/logging persistence.

## Infrastructure And Deployment Status

Clean production path:

- Clean GitHub repo: `Mishava2013/mishava-v2`
- Clean Vercel project: `mishava-v2`
- Local repo path: `/Users/caitlinferguson/Documents/Mishava V2.0`
- Current local branch: `main`
- Clean remote: `mishava-v2-clean`
- Old remote still present: `origin = https://github.com/Mishava2013/dsuupr-am.git`
- Local Vercel linkage: documented as cleaned up to `mishava-v2`
- Clean V2 Supabase: `mishava-v2-dev / snnscnodegbyqexnopvf`
- Old Supabase not to touch: `mishava / tghbfautnxblfxrtkdqb`

Live routes:

- Shopping live: `https://shopping.mishava.org`
- Shopping route live: `https://shopping.mishava.org/shopping`
- Toilet paper live: `https://shopping.mishava.org/shopping/categories/toilet-paper`
- NGO live domain has recently reflected deployed NGO copy updates at `https://ngo.mishava.org`.

Deployment caveats:

- Historical docs show `dsuupr-am` was once the confusing Mishava deployment path. That is now historical context, not the current clean path.
- The old `origin` remote still points to `dsuupr-am`; do not push there unless explicitly approved.
- Use `mishava-v2-clean/main` and Vercel project `mishava-v2`.
- Some older docs mention local typecheck/lint/build stalls. A later dependency refresh and current verification have shown these commands can pass locally, but future tooling issues should be treated as tooling-only, not product fixes.

What must not be touched:

- `dsuupr-am` Vercel project unless explicitly approved.
- Old Supabase `tghbfautnxblfxrtkdqb`.
- DNS/domains unless explicitly asked.
- Dsuupr product or deployment.

## NGO Status

Supported/private pilot readiness estimate: **95-97% excluding Stripe**, after real inbox/Auth proof.

Broad public self-serve readiness estimate: **86-90%**, depending on email, file safety, operational drills, and external review.

Built:

- Public NGO landing page.
- Product-specific NGO account creation and sign-in popup flow.
- NGO onboarding route and organization creation.
- Organization selection/switching with server-side membership checks.
- Team invites, role changes, revoke flow, last-owner protection, removed-member blocking.
- Evidence creation, edit, archive, lifecycle status, file metadata, private raw-file posture.
- Report creation, edit, preview, print-ready route, CSV evidence export, scoped sharing, revoke/expire behavior.
- Protected admin/support dashboard with read-only trust posture.
- Legal, privacy, accessibility, security, corrections, no-paid-trust, evidence submission, report sharing, and compliance readiness pages.
- AI evidence parsing is suggestion-only and human-review gated.

Live/configured:

- NGO public pages are live on `ngo.mishava.org`.
- Recent copy cleanup is deployed: account-first NGO onboarding and simplified reports language.
- Repo-side email/Auth closure is complete.

Still needs operational verification:

- Real inbox sign-up confirmation.
- Password reset email.
- Team invite email delivery and acceptance.
- Wrong-email, revoked, and expired invite proof with real inboxes.
- Final desktop/mobile pilot browser walkthrough.
- Upload policy/scanner/manual-review decision.
- Backup/restore and incident/monitoring rehearsal.

Stripe/payment status:

- Stripe foundation exists in test-mode style.
- Production charging is not enabled.
- Payment cannot affect trust outcomes.

Recommended next 5 NGO tasks:

1. Run `docs/operations/ngo-live-email-auth-verification-checklist.md`.
2. Run `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`.
3. Decide supported-pilot file upload policy before broad upload access.
4. Complete backup/monitoring/incident readiness checklist.
5. Write a final NGO non-Stripe pilot go/no-go result after real inbox proof.

## Shopping Status

Live URL: `https://shopping.mishava.org`

Current Shopping estimate:

- Guided preview readiness: **82-86%**
- Broad public beta readiness: **42-48%**

Current category/product coverage:

- Baby diapers/wipes POC: real-data foundation with reviewed product/source metadata.
- Toilet paper POC: real products including Costco/Kirkland, Cashmere, Purex, mainstream, recycled/bamboo/tree-free examples.
- Product images: conservative metadata foundation and polished non-photo fallback strategy.
- Places to buy: real source/place-to-buy rows where available; no checkout.

Toilet paper readiness:

- Controlled guided preview ready, desktop-first.
- Evidence cards exist for product detail pages.
- Supplier/manufacturer uncertainty is visible.
- Costco is not treated as manufacturer without evidence.
- Kruger/Cashmere/Purex relationship is separated where supported.
- No final Mishava Scores.
- No medical claims.

Account/priorities status:

- Browsing is public.
- Shopping Priorities require account/session.
- Sign-in is popup based.
- Priorities do not create final scores or medical suitability claims.

Evidence/source status:

- Product detail pages show source-backed evidence cards.
- Source title/type/review/freshness/confidence/gaps are available where data exists.
- Outside scorecards are evidence context only.
- Preliminary web research is planned in Slice 14, not implemented.

Recommended next 5 Shopping tasks:

1. Implement Slice 14: product lookup/search and research-request flow.
2. Add Shopping feedback/report issue flow.
3. Add minimal source/admin review workflow.
4. Create reviewed structured claims for a tiny toilet paper set.
5. Draft first Evidence Score Preview rubric without final scores.

## Scoring And Trust Methodology Status

Estimate: **48-53% foundation complete**.

Built:

- Score snapshot foundations.
- Structured claims and evidence references.
- Draft/rejected claims excluded from public scoring.
- Payment firewall tests.
- Score-pending behavior.
- No-paid-ranking/no-commission policy.
- Values Match eligibility requires priorities plus evidence.

Not ready:

- Final category scoring models.
- Public final Mishava Scores.
- Numeric values match for Shopping.
- Full coverage/recency/confidence rubric.
- Public methodology explanation for each category.
- Appeal/correction process tied into scoring.

Before final Mishava Scores appear:

1. Reviewed structured claims must exist.
2. Category scoring rubric must be approved and versioned.
3. Coverage/recency/confidence rules must be defined.
4. Score snapshots must be generated through reviewed workflow.
5. Public explanation and correction/appeal path must exist.

Recommended next 5 scoring/trust tasks:

1. Define toilet paper structured claim template.
2. Draft Evidence Score Preview rubric.
3. Add methodology versioning docs for preview scores.
4. Add correction/appeal workflow plan.
5. Add tests that preview scores cannot become final scores.

## Research And Data Operations Status

Estimate: **50-55% foundation complete**.

Built:

- Shopping research task statuses.
- Supplier/manufacturer transparency fields.
- Confidence labels: verified/likely/unverified/unknown.
- Source hierarchy planning.
- Product/brand/parent/private-label/manufacturer/supplier/retailer separation.
- Evidence card display from existing source data.

Planned/early:

- Product-not-found research requests.
- Web research trigger.
- Source review admin tools.
- Human review queue.
- Stale source cadence.
- AI-assisted research suggestions behind the AI control layer.

Recommended next 5 research/data ops tasks:

1. Build product lookup over existing records.
2. Add product-not-found internal research request.
3. Reuse or extend research task model for user-submitted search text.
4. Build minimal source review queue.
5. Define freshness review cadence for Shopping POC categories.

## Business / Local / Supplier / Seller Status

Estimate: **15-20% foundation complete**.

Current state:

- Public/reserved surfaces exist.
- Product/company/supplier relationship concepts are documented.
- Business/Local claim flow is planned, not built.
- Supplier/seller profile direction is planned.
- Hosted profile vs external website direction is planned.
- Supplier-to-seller connection concept exists.
- Evidence submission concept exists.
- No paid placement/no paid ranking guardrails are established.

Recommended next 5 Business/Local tasks:

1. Plan Business/Local claim flow in detail.
2. Define business, seller, supplier, brand owner, and manufacturer roles.
3. Create minimal profile schema and claim-request states.
4. Add evidence submission workflow with review status.
5. Add no-paid-placement tests for Business/Local visibility.

## Government Product Status

Estimate: **5-8% foundation complete**.

Current state:

- Government surface is reserved/conceptual.
- Procurement/accountability concept is documented.
- Public purchasing transparency direction is planned.
- Media/public oversight layer is future.
- No FedRAMP, authorization, procurement certification, or government compliance claims.

Recommended next 5 Government tasks:

1. Keep Gov as reserved until Corporate/Business primitives mature.
2. Write Gov product concept brief from procurement accountability lens.
3. Define vendor/product evidence packet needs.
4. Define public reporting/correction model.
5. Draft compliance-caution language before any public Gov outreach.

## Corporate / Institutional Status

Estimate: **8-12% foundation complete**.

Current state:

- Corporate surface is reserved/conceptual.
- Institutional dashboards are planned.
- Vendor review and procurement support are planned.
- Audit trails and reporting/export needs are known.
- No enterprise trust manipulation or compliance certification claims.

Recommended next 5 Corporate tasks:

1. Plan corporate procurement review workspace.
2. Define vendor/product comparison primitives.
3. Reuse evidence gaps, source freshness, and supplier transparency.
4. Plan institutional export/report needs.
5. Add audit trail requirements before UI build.

## Plus / Consumer Account Status

Estimate: **18-22% foundation complete**.

Built:

- Shopping Priorities route and account requirement.
- Saved preference concept.
- Values Match guardrails.

Planned:

- Saved products.
- Watchlists/following.
- Alerts.
- Comparison tools.
- Family/household needs.
- Privacy controls.
- Account data export/delete flows.

Recommended next 5 Plus tasks:

1. Audit Shopping Priorities from real user perspective.
2. Plan saved products/watchlist model.
3. Plan privacy controls for personal preferences.
4. Define alerts/following without medical or paid-ranking claims.
5. Connect Values Match only after reviewed evidence supports it.

## Admin / Support / Operations Status

Estimate: **48-53% foundation complete**.

Built:

- Protected admin/support dashboard.
- NGO operational summaries.
- No raw file exposure by default.
- No silent trust outcome manipulation path.
- Corrections/support/legal pages.
- Operational checklists for email/Auth, file safety, browser/mobile, backup/monitoring/incident readiness.

Needs:

- Correction/dispute queue.
- Evidence review queue.
- Product/source review tools.
- Monitoring/backup/incident proof.
- Support load rehearsal.
- Sensitive admin read/action logging expansion.

Recommended next 5 Admin/Ops tasks:

1. Run NGO operational checklists.
2. Build correction/dispute queue.
3. Build evidence/source review queue.
4. Document backup/restore drill result.
5. Add admin audit expansion plan.

## AI / Payment / Compliance Status

AI:

- Central AI control foundation exists.
- Deny-by-default feature configuration.
- Suggestion-only envelopes.
- Budget/cache/logging hooks.
- Provider-import guard test.
- No real provider calls enabled.
- No product UI calls AI directly.
- AI cannot affect scores, rankings, verification, publishing, supplier approval, seller approval, NGO escalation, payment/access, or legal/compliance conclusions.

Payment:

- Payment firewall exists.
- Stripe NGO foundation is not production charging.
- Payment cannot affect trust outcomes.
- Shopping has no checkout, affiliate, commission sorting, or paid placement.

Compliance:

- SOC 2/ISO/accessibility/privacy/security readiness docs exist.
- No SOC 2, ISO, FedRAMP, ADA, VPAT/ACR certification claims.
- External legal/accessibility/security reviews remain future.

Recommended next 5 AI/payment/compliance tasks:

1. Keep provider calls disabled.
2. Add live budget snapshot retrieval before any provider adapter.
3. Add persistent cache storage plan.
4. Complete vendor/subprocessor review before AI provider use.
5. Run compliance claim scan after any public copy changes.

## Recommended Chat Structure

| Chat | Purpose | Do not cover | First likely task | Key docs | Blockers | Estimate |
| --- | --- | --- | --- | --- | --- | ---: |
| Mishava NGO | Close supported pilot readiness. | Shopping, Business, scoring engine. | Real inbox/Auth verification. | `ngo-near-100-non-stripe-readiness-result.md`, operations checklists. | Email/Auth proof, file policy, ops drills. | 95-97% pilot |
| Mishava Shopping | Improve live Shopping preview. | NGO, Business, final scoring. | Slice 14 search/research request. | Slice 13, Slice 14 plan, Slice 12C. | No final scores, source ops. | 82-86% guided preview |
| Mishava Scoring + Trust | Build scoring methodology safely. | Product catalog expansion. | Toilet paper claim template. | Roadmap reset, scoring slice docs. | Rubric/versioning not final. | 48-53% |
| Mishava Research + Evidence Ops | Build source/review operations. | Public marketing. | Product-not-found research queue. | Slice 7, Slice 14 plan. | Manual workflow only. | 50-55% |
| Mishava Business/Local/Supplier | Build claim/profile foundation. | Gov/Corporate sales. | Claim flow plan. | Roadmap reset. | Mostly planned only. | 15-20% |
| Mishava Government | Plan procurement transparency. | Compliance claims. | Gov concept brief. | Roadmap reset, gov concept. | Too early for sales. | 5-8% |
| Mishava Corporate/Institutional | Plan procurement/vendor review. | Gov authorization claims. | Corporate workspace plan. | Roadmap reset. | Product primitives still early. | 8-12% |
| Mishava Plus/Consumer | Build consumer account value. | Checkout, medical claims. | Saved products/watchlist plan. | Roadmap reset, Shopping Priorities docs. | Needs evidence-backed match. | 18-22% |
| Mishava Admin/Ops/Compliance | Build review/support readiness. | Product expansion. | Evidence/source/correction queues. | operations docs, compliance docs. | Ops proof missing. | 48-53% |
| Mishava Infrastructure/Deployment | Keep clean deployment safe. | Product features. | Domain ownership table. | clean deployment/cutover/alignment docs. | Old remote confusion. | 75-80% |

Recommended first chat to open: **Mishava NGO**, because the next highest-value step is operational proof, not new product design. After NGO real inbox/Auth is proven, open **Mishava Shopping** for Slice 14.

## Checks Run During This Review

This was a documentation-only review. No product features, products, migrations, DNS/domain settings, Vercel settings, Supabase configuration, Stripe/payment behavior, or AI/provider behavior were changed.

Checks run:

- `npm test` - passed, `176/176`.
- `supabase migration list --linked` - passed; local and remote migrations are aligned through `202605260009` on clean V2 Supabase.

Current repo state confirmed before writing:

- Local branch: `main`.
- Clean remote: `mishava-v2-clean = https://github.com/Mishava2013/mishava-v2.git`.
- Old remote preserved: `origin = https://github.com/Mishava2013/dsuupr-am.git`.
- Recent history includes `f235328 Polish NGO pre-outreach clarity flow`.
