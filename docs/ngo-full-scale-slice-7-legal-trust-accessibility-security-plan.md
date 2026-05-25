# NGO Full-Scale Slice 7 Plan: Legal, Trust, Accessibility, And Security Baseline

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-6-billing-entitlements-result.md`
- `docs/mishava-compliance-accessibility-security-readiness.md`
- `docs/ngo-pilot-readiness-reaudit.md`

## Goal

Plan the minimum legal, trust, accessibility, privacy, and security baseline needed before Mishava NGO can move from constrained self-serve readiness toward broader full-scale NGO launch.

This slice should make Mishava more honest, readable, accessible, and institutionally credible without claiming legal approval, certification, SOC 2, ISO 27001, FedRAMP, VPAT/ACR completion, final scoring maturity, or production billing readiness.

## Scope

In scope:

- Public/legal/trust page planning.
- NGO evidence/report/sharing disclaimers.
- Accessibility baseline planning.
- Privacy and security posture planning.
- Launch-readiness checks for legal/trust/security/accessibility language.
- Footer/legal navigation planning.
- Tests/checks required before implementation acceptance.

Out of scope:

- Shopping.
- Business.
- Local.
- Gov.
- Corporate.
- Plus.
- AI scoring.
- Production Stripe billing.
- Public report library.
- Final scoring math.
- SOC 2.
- ISO 27001.
- FedRAMP.
- Full VPAT/ACR.
- Lawyer-approved final legal documents.

## 1. Required Public / Legal Pages

Slice 7 should plan the first usable public/legal page set. These pages may begin as clear launch-baseline drafts, but they must avoid pretending to be final legal advice or outside-reviewed compliance artifacts.

Minimum pages:

| Page | Purpose | Immediate status target | Notes |
| --- | --- | --- | --- |
| Terms of Service | Define account, organization, platform, acceptable use, report sharing, and liability basics. | Draft baseline page. | Needs counsel review before broad launch. |
| Privacy Policy | Explain account data, NGO data, evidence files, report data, audit logs, sharing, and support data. | Draft baseline page. | Needs privacy/counsel review before broad launch. |
| Evidence Submission Terms | Explain what users may submit, lawful submission duty, rights/permissions, confidentiality limits, and evidence integrity. | Draft baseline page. | Should appear near evidence upload/edit flows. |
| Report Sharing Terms | Explain scoped grants, recipient limits, revocation, no raw-file sharing by default, and no guarantee of outcomes. | Draft baseline page. | Should appear near report sharing and shared report views. |
| AI Use Disclosure | Explain whether AI is used. | Conditional draft page or "not currently used for NGO scoring/report automation" disclosure. | Only include concrete AI workflow claims if implemented. |
| No Paid Ranking / No Paid Trust Outcome Policy | Explain that payment, plan tier, sponsorship, and setup purchases do not alter trust outcomes. | Required baseline page. | Should mirror Slice 6 payment firewall language. |
| Accessibility Statement | State accessibility target and support channel. | Draft baseline page. | Say "targeting WCAG 2.2 AA where feasible"; do not claim audited conformance. |
| Security Overview | Explain RLS/org isolation, private storage, audit logs, roles, service-role boundaries, and limitations. | Draft baseline page. | Use "designed for" / "readiness" language, not certification claims. |
| Correction / Dispute / Error Reporting Policy | Explain how users can report errors, corrections, disputed evidence, or mistaken sharing. | Draft baseline page. | Must preserve transparency and audit trail expectations. |
| Contact / Support | Provide support path for account, sharing, privacy, security, accessibility, and correction issues. | Required baseline page. | Should include categories of support requests. |

Recommended URL pattern:

- `/terms`
- `/privacy`
- `/legal/evidence-submission`
- `/legal/report-sharing`
- `/legal/ai-use`
- `/trust/no-paid-ranking`
- `/accessibility`
- `/security`
- `/trust/corrections`
- `/support`

Implementation note for later: these pages can be simple server-rendered content pages first. They should be linked from the footer and from relevant in-app flows, but this plan does not implement them.

## 2. NGO-Specific Trust Language

Slice 7 should standardize plain-language trust labels across NGO evidence, reports, billing, and shared report surfaces.

Required language concepts:

- Evidence may be incomplete.
- Reports may be provisional.
- Raw evidence is private by default.
- Shared reports expose only selected summaries unless expanded by a future explicit control.
- Mishava does not guarantee funding, donations, ratings, certification, approval, public acceptance, or other outcomes.
- Payment or plan tier does not change trust outcomes.
- User-uploaded evidence must be lawful, permitted to submit, and accurate to the best of the submitter's knowledge.
- Mishava preserves audit trails and should not silently erase the history of corrected or disputed information.
- Mishava may correct errors, but corrections should be transparent where they affect trust/reporting outputs.

Suggested reusable language blocks:

| Context | Draft language direction |
| --- | --- |
| Evidence upload/edit | "Only upload evidence you have the right to submit. Raw files are private to your organization by default and are not shared with report recipients unless a future explicit sharing control allows it." |
| Report preview | "This report is based on selected evidence and may be incomplete. Trust context is provisional unless a reviewed/public score is explicitly published." |
| Shared report | "This shared view is limited to the selected report summary. It does not provide access to the sender's full Mishava workspace or raw private files by default." |
| Billing | "Your plan unlocks tools and capacity. It does not change Mishava trust outcomes, scores, rankings, verification, evidence truth, or credibility labels." |
| No paid trust policy | "Mishava monetizes trust infrastructure, not paid influence." |

## 3. Privacy / Data Handling

Slice 7 should define what the first launch-baseline privacy language must cover and where it should appear.

Data categories:

| Data category | Handling expectation | Immediate requirement |
| --- | --- | --- |
| User account data | Used for authentication, security, support, organization membership, and access control. | Privacy Policy and account pages should explain basic use. |
| NGO profile data | Used to operate NGO profiles, reports, memberships, and organization context. | Privacy Policy and onboarding/support language. |
| Uploaded evidence files | Private by default, organization-scoped, not exposed publicly or to share recipients by default. | Evidence Submission Terms and evidence UI labels. |
| Evidence metadata | Used for evidence library, reports, claims, review, and auditability. | Privacy Policy and Evidence Submission Terms. |
| Report data | Private by default unless shared through scoped grants. | Report Sharing Terms and report preview/shared view labels. |
| Shared recipient access data | Used to enforce scoped report access and audit shared report views where applicable. | Privacy Policy and Report Sharing Terms. |
| Audit logs | Used for transparency, security, evidence history, and support. | Privacy Policy and Security Overview. |
| Billing/plan data | Used to manage plan access and entitlements. | Privacy Policy and billing language; no card data storage claim unless Stripe flow is implemented. |
| AI-related data | Not production-ready for NGO automation. | AI Use Disclosure should avoid claims unless a workflow exists. |

Baseline privacy requirements:

- Explain private-by-default evidence and report behavior.
- Explain organization-scoped access.
- Explain that personal priority/buyer data is not part of NGO Slice 7.
- Explain that raw card data is not stored by Mishava if Stripe is later used.
- Explain audit logs and why some records may be retained for integrity.
- Add a future path for data export/deletion requests, even if automation is not built yet.
- Add subprocessor/AI vendor note as "to be maintained" rather than a final list if not ready.
- Avoid promising deletion of audit records if preservation is required for transparency, safety, fraud prevention, legal compliance, or dispute handling.

Data deletion/export planning:

- Immediate: support-contact request path only.
- Near-term: internal support workflow for export/delete requests.
- Later: self-serve export/delete automation, subject to audit/legal retention rules.

## 4. Accessibility Baseline

Mishava should target WCAG 2.2 AA where feasible and treat WCAG 2.1 AA as the minimum public-sector reference point, while avoiding a formal compliance claim until tested.

Slice 7 should plan a baseline accessibility pass over NGO-critical pages:

- `/ngo`
- `/ngo/onboarding`
- `/app`
- `/org/profile`
- `/org/evidence`
- `/org/reports`
- `/org/reports/[reportId]`
- `/org/team`
- `/org/billing`
- `/shared/ngo-reports/[grantId]`
- new legal/trust/support pages once implemented

Baseline accessibility requirements:

- Keyboard navigation for all interactive controls.
- Visible focus states.
- Semantic HTML landmarks and headings.
- Screen-reader friendly button/link labels.
- Accessible form labels, hints, and errors.
- No color-only status indicators.
- Color contrast review for current Mishava palette.
- Mobile responsive layouts for evidence/report/share/billing pages.
- Accessible print/report structure.
- Accessible file upload labels and errors.
- Accessible share grant forms and recipient-facing shared report pages.
- Skip link or equivalent navigation support where useful.
- ARIA only where semantic HTML is insufficient.

Checks to plan:

- Automated accessibility smoke checks where practical.
- Manual keyboard pass for core NGO flows.
- Mobile viewport pass.
- Color contrast review.
- Screen-reader spot check for forms and report/shared report views.
- Print view readability check.

Not included in Slice 7:

- Full VPAT/ACR.
- Outside accessibility audit.
- PDF accessibility certification.
- Formal Section 508 claim.

## 5. Security Baseline

Slice 7 should accurately describe the security posture already being built and the gaps still requiring future hardening.

Baseline security posture to document:

- Supabase Auth foundation is in place, with known remaining sign-up/password-reset retest caveats from Slice 1B.
- Organization isolation is enforced server-side and through RLS where implemented.
- Current org state does not grant access by itself.
- Private evidence file metadata and storage are org-scoped.
- Raw evidence files are private by default.
- Share grants expose only selected report summaries.
- Role permissions exist for core NGO team management flows.
- Audit events exist for onboarding, evidence, reports, sharing, team, entitlement limit events, and related sensitive workflows.
- Service-role usage is server-side only and must not be exposed to browser/client code.
- `.env.local`, `screenshots/`, and `supabase/.temp/` remain ignored.
- Old Supabase project must remain untouched for V2 work.

Security caveats to document honestly:

- MFA enforcement is not implemented yet.
- SSO is not implemented.
- Malware scanning is not implemented yet.
- Full monitoring/alerting is not implemented yet.
- Formal penetration test has not been completed.
- SOC 2 / ISO / FedRAMP are roadmap items only.
- Backup/restore process must be documented and tested before broad launch.
- Production incident response process must be documented before launch.
- Stripe is test-mode placeholder only; production billing is not live.

Security baseline checks:

- Protected route checks for `/app`, `/org/*`, and `/admin/*`.
- Wrong-org access checks.
- Role permission checks for evidence/report/team/share actions.
- Private file metadata checks.
- Shared report access checks.
- No secret exposure checks.
- Footer/legal pages should not expose environment values or internal keys.

## 6. Report And Evidence Disclaimers

Slice 7 should plan visible disclaimers in the places where users make trust, sharing, or privacy decisions.

Required locations:

| Location | Required disclaimer / label |
| --- | --- |
| Evidence upload/edit | Lawful submission, private raw files, not shared by default, evidence may require review. |
| Evidence library | Lifecycle/status labels, archive labels, review labels, report/claim attachment labels. |
| Report preview | Draft/private/provisional, no public score, evidence may be incomplete, raw files private by default. |
| Print-friendly report | Generated date, provisional trust context, no public score unless explicitly published, evidence limits. |
| Shared report view | Limited shared view, no full workspace, no raw files by default, grant expiration/revocation status. |
| Billing page | Plan gates tools only; no paid ranking, score, verification, evidence truth, or credibility advantage. |
| Trust explanation / scoring pages | Scores are evidence/version based; no fake scores; corrections preserve history; no paid influence. |
| Footer/legal pages | Legal/trust/security/accessibility/support links. |

Disclaimers should be short in the UI and expanded on legal/trust pages.

## 7. Tests / Checks To Plan

Implementation of Slice 7 should include or update tests/checks for:

- Required legal/trust/support pages render.
- Footer links exist for legal/trust/accessibility/security/support pages.
- Protected NGO pages remain protected.
- Admin pages remain protected.
- No secrets appear in rendered legal/security/billing pages.
- No paid trust outcome language appears on billing and trust policy pages.
- Evidence upload/edit disclaimers render.
- Report preview disclaimers render.
- Shared report disclaimers render.
- Accessibility smoke checks cover page headings, labels, and interactive controls where feasible.
- Color-only status indicators are not introduced.
- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.

Manual checks to record in the result document:

- Keyboard navigation pass for legal/footer links and core NGO flows.
- Mobile viewport check for legal pages, evidence, reports, billing, and shared report view.
- Print/report view still hides navigation and preserves disclaimers.
- No certification/compliance claims are stated as complete.

## 8. Non-Goals

Slice 7 must explicitly exclude:

- Lawyer-approved final legal documents.
- SOC 2.
- ISO 27001.
- FedRAMP.
- Final VPAT/ACR.
- Full external accessibility audit.
- Production Stripe checkout.
- Production Stripe webhooks.
- Refund/tax/accounting automation.
- Full data deletion automation.
- AI automation.
- AI scoring.
- Public report library.
- Final scoring math.
- Shopping, Business, Local, Gov, Corporate, or Plus expansion.

## 9. Implementation Slices Recommended Inside Slice 7

To keep the work manageable, implement Slice 7 in this order:

1. Public/legal/trust page shell and footer links.
2. NGO evidence/report/share/billing disclaimer pass.
3. Accessibility baseline pass on NGO-critical pages.
4. Security/privacy posture page and support/contact page.
5. Tests/checks and result documentation.

If the implementation gets too large, split Slice 7 into:

- Slice 7A: Legal/trust pages and footer links.
- Slice 7B: NGO disclaimers and accessibility baseline.
- Slice 7C: Security/privacy page and launch-readiness checks.

## 10. Acceptance Criteria

Slice 7 can be accepted only if:

- Minimum legal/trust pages exist.
- NGO evidence/report/sharing disclaimers are visible.
- Payment/no-paid-trust-outcome language is visible where relevant.
- Accessibility baseline is improved and documented.
- Security posture is accurately described without overclaiming.
- Privacy/data handling language covers account, NGO profile, evidence, reports, sharing, audit logs, and support paths.
- Footer/support navigation makes these resources findable.
- Protected routes remain protected.
- No secrets are exposed.
- No certification/compliance claims are made prematurely.
- No production billing is added.
- No new product surfaces are added.
- Tests/lint/build pass.

## 11. Result Document Required Later

The implementation result should create:

`docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`

It should include:

- what was implemented;
- legal/trust pages added;
- disclaimers added;
- accessibility checks performed;
- security/privacy posture added;
- tests run;
- known limitations;
- counsel/specialist review still needed;
- confirmation that no production billing, new product surfaces, AI scoring, public report library, final scoring math, SOC 2, ISO, FedRAMP, or full VPAT/ACR were added;
- confirmation that no certification/compliance claims were made prematurely.
