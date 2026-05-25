# NGO Full-Scale Slice 7 Result: Legal, Trust, Accessibility, And Security Baseline

## Status

Implemented and locally verified.

## Pages Added

- `/legal/terms`
- `/legal/privacy`
- `/legal/evidence-submission`
- `/legal/report-sharing`
- `/legal/no-paid-trust-outcomes`
- `/legal/accessibility`
- `/legal/security`
- `/legal/corrections`
- `/support`

These pages use conservative baseline language. They are marked as draft/baseline where appropriate, remain subject to attorney or specialist review, and do not claim external certification or completed compliance review.

## Disclaimers Added

- Evidence upload/edit now states that submitted evidence must be lawful and permitted to submit.
- Evidence upload/edit now states that evidence may be incomplete or require review.
- Evidence upload/edit now states that Mishava does not guarantee funding, donations, ratings, certifications, procurement decisions, or other outcomes.
- Evidence upload/edit now clarifies that raw files are private by default and shared reports expose selected summaries unless a future explicit raw-file sharing control is added.
- Report preview now states that reports may be incomplete and do not guarantee funding, donations, ratings, certifications, procurement decisions, or other outcomes.
- Report sharing copy now clarifies that shared reports expose selected summaries unless explicitly expanded by a future approved sharing control.
- Shared report view now states that shared access does not guarantee funding, donations, ratings, certifications, procurement decisions, or other outcomes.
- Billing now states that payment and plan tier do not change trust outcomes, evidence truth, verification, credibility labels, score, or ranking.

## Accessibility Improvements

- Added a skip link to jump to the main content.
- Added `id="main-content"` to the main content region.
- Added footer legal/support navigation with an accessible label.
- Added CSS for skip-link focus behavior.
- Kept visible focus states.
- Legal pages use semantic headings and a reusable page structure.
- Existing report and shared report views continue to use labelled preview sections and print-friendly structure.

## Security Posture Language

The new Security Overview describes:

- Supabase Auth foundation.
- Clean Mishava V2 Supabase project posture.
- RLS and organization isolation where implemented.
- Private storage by default.
- Audit events.
- Role permissions.
- Server-side service-role boundaries.
- No secrets in repo expectations.

It also explicitly states known limitations:

- broad-launch email/password reset verification still needs retesting where rate limits affected earlier checks;
- malware scanning is not implemented;
- MFA enforcement and SSO are not implemented;
- external security audit is not complete;
- Mishava is not SOC 2 certified, ISO 27001 certified, or FedRAMP authorized in this baseline.

## Tests Run

- `npm test` - passed.
- `npm run lint` - passed.
- `npm run build` - passed.

## Known Limitations

- Legal pages are baseline drafts and still need attorney review.
- Privacy language needs counsel/privacy review before broad launch.
- Accessibility has not completed an external audit, VPAT, or Accessibility Conformance Report.
- Security posture has not completed penetration testing, SOC 2, ISO 27001, or FedRAMP review.
- Data deletion/export automation is not implemented; requests remain a manual support path.
- AI automation is not enabled for NGO workflows in this baseline.
- Malware scanning is not implemented.
- Production Stripe billing remains disabled.

## Remaining Legal / Accessibility / Security Work

- Attorney review of Terms, Privacy Policy, Evidence Submission Terms, Report Sharing Terms, and Corrections policy.
- Privacy review of retention, deletion/export, subprocessor, and data-processing language.
- External accessibility review and later VPAT/ACR readiness.
- Full keyboard, screen-reader, mobile, color contrast, and report accessibility QA.
- Production incident response, backup/restore, monitoring, vulnerability management, and support playbooks.
- Malware scanning and file security hardening.
- Final production billing legal/tax/refund review before any real charging.

## Scope Confirmation

No certification or compliance claims were made prematurely.

This slice did not add:

- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI scoring;
- production Stripe billing;
- production checkout;
- public report library;
- final scoring math;
- SOC 2;
- ISO certification;
- FedRAMP;
- final VPAT/ACR;
- full external accessibility audit;
- data deletion automation.
