# Mishava Compliance / Accessibility / Security / Procurement Readiness

Status: planning track only.

This document is not an implementation task. Do not build UI, routes, database
tables, automation, certification claims, or procurement workflows from this
document unless a later implementation plan explicitly scopes that work.

Purpose: create a full compliance, accessibility, security, privacy,
procurement, and third-party assurance roadmap for Mishava so the product can
be credible for governments, banks, institutional buyers, NGOs, foundations,
media/research users, and enterprise customers.

Core principle:

> Mishava should be designed for the most stringent reasonable buyers from the
> beginning.

Planning track name:

> Compliance / Accessibility / Security / Procurement Readiness

## 1. Readiness Model

Mishava should distinguish between five readiness levels:

1. **Product from day one**: controls and product behavior that should be built
   into normal engineering practice from the beginning.
2. **Document before launch**: policies, statements, and operating rules needed
   before selling or publishing claims.
3. **Counsel / specialist review**: areas that should be reviewed by legal,
   accessibility, security, privacy, procurement, or compliance specialists.
4. **External audit / certification later**: third-party reports or formal
   certifications that should only be claimed after completion.
5. **Customer-specific readiness**: requirements needed only for particular
   buyers, such as federal agencies, banks, healthcare-adjacent institutions, or
   large public-sector programs.

Do not claim formal compliance, certification, or audit status before outside
review is complete. Use language such as:

- designed for
- aligned with
- readiness roadmap
- targeting
- internally mapped to

until third-party audit, certification, or legal review is complete.

## 2. Readiness Area Matrix

| Compliance area | Why it matters | Standards / frameworks | Product implications | Policy / legal docs | Tests / checks | Outside validation | Timing | Owner role | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accessibility | Required for public-sector and institutional buyers; essential for trust and usability. | WCAG 2.2 AA target, WCAG 2.1 AA minimum for ADA Title II public-sector contexts, Section 508, VPAT/ACR. | Semantic HTML, keyboard navigation, focus states, accessible score popups, tables, charts, reports, file uploads, mobile flows. | Accessibility Statement, accessibility issue severity policy, internal design rules. | Automated accessibility tests, manual keyboard tests, screen reader tests, contrast audits, PDF/export review. | WCAG audit, VPAT/ACR, Section 508 review. | Immediate baseline, external review near launch. | Product + design + engineering; later accessibility specialist. | Planned |
| Security | Institutional buyers require evidence that sensitive evidence, accounts, and workflows are protected. | NIST CSF 2.0, SOC 2 readiness, ISO 27001 readiness, CIS Controls, OWASP ASVS / Top 10. | MFA, SSO readiness, RBAC/ABAC, audit logs, secure sessions, encryption, secure upload storage, monitoring, backups. | Security overview, incident response, access control, vulnerability management, backup/recovery, vendor risk, secure development policies. | Dependency scanning, code scanning, access-control tests, vulnerability scans, audit-log tests. | Pen test, SOC 2 Type I/II, ISO 27001 readiness/certification if justified. | Immediate controls, formal assurance later. | Security owner / CTO; later external assessor. | Partially implemented foundation |
| Privacy and data protection | Mishava handles buyer preferences, NGO data, business evidence, reports, and future government procurement data. | U.S. state privacy laws, California expectations, GDPR readiness later, institutional DPAs. | Consent records, data classification, visibility levels, redaction, retention, deletion/export, privacy-safe analytics, aggregation thresholds. | Privacy Policy, DPA template, subprocessor list, retention schedule, redaction policy, AI data disclosure. | Privacy review checklist, export logging, sensitive data access tests, retention tests when implemented. | Privacy/legal review, DPA review. | Immediate design, launch docs before public use. | Privacy owner + counsel. | Planned |
| Banking / financial institution readiness | Banks and funders often require vendor-risk, security, continuity, and insurance evidence. | SOC 2, vendor-risk questionnaires, PCI scope control through Stripe, business continuity practices. | Stripe-centered payments, no raw card storage, access review evidence, financial controls, refund rules, DR/BCP readiness. | Bank/vendor-risk packet, PCI scope note, BCP, DR plan, security overview, insurance checklist. | Payment scope checks, access reviews, backup restore tests, incident tabletop exercises. | SOC 2, vendor-risk reviews, cyber insurance review. | Later, before bank/funder enterprise sales. | Finance + security + operations. | Planned |
| Government procurement readiness | Public-sector buyers require accessibility, security, procurement documentation, public accountability, and records planning. | Section 508, VPAT/ACR, public-sector terms, FedRAMP future roadmap, state/local procurement rules. | Public-sector access controls, audit logs, procurement snapshots, visibility rules, incident/security contacts. | Government procurement checklist, public-sector security packet, Mishava Gov addendum, records/public information plan. | RLS/access tests, VPAT checks, procurement-data visibility review. | VPAT/ACR, Section 508 review, FedRAMP readiness only if federal demand justifies cost. | Later; Gov is not immediate release. | Gov product owner + counsel + security. | Planned |
| Product trust / evidence governance | Mishava's credibility depends on the scoring system being governed, auditable, and resistant to bribery or paid influence. | Internal methodology governance, auditability, conflict-of-interest controls, anti-bribery controls. | Versioned scoring, immutable snapshots, payment firewall tests, reviewer separation, correction/dispute records. | Methodology governance policy, payment firewall policy, dispute/correction policy, anti-bribery policy, COI policy. | No-paid-ranking tests, snapshot immutability tests, reviewer role tests, audit-log tests. | Methodology advisory review, legal review of adverse findings. | Immediate for scoring work. | Methodology owner + trust governance board later. | Partially implemented foundation |
| AI governance | Mishava can use AI to parse evidence and draft reports, but must not allow hallucinated opinions to become facts. | AI governance policy, vendor review, model/prompt logging, human review rules. | AI disclosure, confidence thresholds, input/output logs, human review triggers, no AI-only high-risk adverse findings, cost controls. | AI Use Policy, AI Governance Policy, vendor review checklist, AI incident process. | AI workflow tests, confidence threshold tests, logging tests, hallucination/error review. | AI governance review, privacy/security review of vendors. | Immediate for any AI feature; deeper review before scaling. | AI governance owner + security/privacy owner. | Planned |
| External certifications and reports | Outside validation increases credibility with stringent buyers. | WCAG audit, VPAT/ACR, SOC 2 Type I/II, ISO 27001, pen test, PCI scope documentation. | Evidence collection for controls, policy maturity, audit logs, stable release process. | Certification roadmap, audit evidence plan, public claims policy. | Internal readiness checks before each audit. | Formal audits/certifications only when ready. | Staged; not day-one certification. | Compliance owner. | Planned |

## 3. Accessibility / ADA / Section 508 / WCAG

Mishava should target accessibility from the beginning, not retrofit it later.

Planning standards:

- Target WCAG 2.2 AA internally where feasible.
- Treat WCAG 2.1 AA as the minimum for ADA Title II public-sector contexts.
- Align with Section 508 for federal procurement readiness.
- Prepare an Accessibility Conformance Report / VPAT once the product is
  stable enough to evaluate.

Notes:

- The DOJ ADA Title II web/mobile rule for state and local governments uses
  WCAG 2.1 Level AA.
- Section 508 procurement contexts rely heavily on accessibility conformance
  documentation.
- WCAG 2.2 is a stronger/current product target and is backward compatible with
  WCAG 2.0 and 2.1.

### Product Requirements To Plan

- Keyboard navigation.
- Visible focus states.
- Semantic HTML.
- Correct headings and landmarks.
- Accessible forms and validation.
- Accessible modals/popups.
- Screen-reader labels.
- Alt text handling.
- Color contrast.
- Non-color-only status labels.
- Reduced-motion support.
- Accessible tables.
- Accessible charts and reports.
- Accessible PDFs/exports.
- Accessible file upload flow.
- Accessible score popups.
- Accessible evidence timelines.
- Accessible admin dashboards.
- Mobile accessibility.
- Error summaries.
- Form instructions.
- Skip links.
- ARIA only where needed, not as a substitute for semantic HTML.

### Accessibility Testing Requirements

- Automated accessibility tests.
- Manual keyboard testing.
- Screen reader testing.
- Mobile accessibility testing.
- Color contrast audit.
- Accessibility regression testing.
- PDF/report accessibility review.
- VPAT/ACR preparation after product stabilization.
- Outside accessibility audit before selling to government/banks where possible.

### Accessibility Deliverables

- Accessibility requirements checklist.
- Accessibility testing checklist.
- Accessibility issue severity policy.
- VPAT/ACR readiness checklist.
- Public Accessibility Statement.
- Internal accessibility design rules.
- Accessibility acceptance criteria for every release.

## 4. Security Framework

Mishava should be designed around security controls appropriate for
institutional and public-sector buyers.

Planning frameworks:

- NIST Cybersecurity Framework 2.0.
- SOC 2 readiness.
- ISO/IEC 27001 readiness.
- FedRAMP readiness later if selling cloud services directly to U.S. federal
  agencies.
- CIS Controls as practical internal control baseline.
- OWASP ASVS / OWASP Top 10 for application security.

### Security Requirements To Plan

- MFA for all sensitive accounts.
- SSO readiness.
- Role-based access control.
- Attribute-based access control for sensitive evidence.
- Least privilege.
- Audit logs.
- Immutable security/audit events.
- Secure session management.
- Encryption in transit.
- Encryption at rest.
- Secrets management.
- Secure file storage.
- Malware scanning for uploads.
- Vulnerability management.
- Dependency scanning.
- Code scanning.
- Penetration testing.
- Incident response plan.
- Backup and recovery plan.
- Disaster recovery plan.
- Vendor risk management.
- Logging and monitoring.
- Security alerting.
- Access review process.
- Employee access controls.
- Admin action review.
- Break-glass access policy.
- Change management.

### Security Deliverables

- Security control matrix.
- SOC 2 readiness checklist.
- ISO 27001 readiness checklist.
- NIST CSF 2.0 mapping.
- FedRAMP future-readiness notes.
- Incident response policy.
- Vulnerability management policy.
- Access control policy.
- Backup/recovery policy.
- Vendor risk policy.
- Secure development policy.

## 5. Privacy And Data Protection

Mishava will handle consumer preferences, business evidence, NGO reports,
potentially sensitive documents, media/research access, and future government
procurement data.

Planning frameworks/laws to review:

- U.S. state privacy laws where applicable.
- California privacy expectations if applicable.
- GDPR readiness if serving EU users later.
- Data processing agreements for institutional customers.
- Children/minor-related product sensitivity, especially for baby/children
  categories.
- Privacy requirements for research/media exports.
- Privacy requirements for sponsor/foundation dashboards.

### Privacy Requirements To Plan

- Data classification.
- Consent records.
- Purpose limitation.
- Privacy-safe analytics.
- Opt-out controls.
- User preference deletion/export.
- Data retention policy.
- Raw evidence retention policy.
- Document redaction.
- Sensitive evidence visibility levels.
- Privacy-by-design review.
- DPA template readiness.
- Subprocessors list.
- AI vendor/data-sharing disclosure.
- No personal buyer data resale.
- No sensitive microtargeting.
- Aggregation thresholds for Insights.
- Export logging.

### Privacy Deliverables

- Privacy Policy.
- Data Processing Addendum template.
- Subprocessor list.
- Data retention schedule.
- Redaction policy.
- Sensitive evidence policy.
- AI data-processing disclosure.
- User data deletion/export policy.
- Privacy review checklist for new features.

## 6. Banking / Financial Institution Readiness

Mishava may eventually need to sell to or be reviewed by banks, funders, and
other financial institutions.

Planning areas:

- SOC 2 Type I, then SOC 2 Type II roadmap.
- Vendor-risk questionnaire readiness.
- Business continuity plan.
- Disaster recovery plan.
- Incident response process.
- Data retention and deletion controls.
- Encryption controls.
- Access review evidence.
- Background check policy if needed for sensitive roles.
- Financial controls.
- Revenue recognition and refund policies.
- Payment processor security.
- PCI DSS scope minimization through Stripe.

Payment note:

Use Stripe to minimize direct card-data handling. Mishava should not store raw
card numbers. PCI obligations should be scoped carefully around Stripe-hosted or
Stripe-controlled payment flows.

Deliverables:

- Bank/vendor-risk response packet.
- SOC 2 readiness packet.
- PCI scope note.
- Business continuity plan.
- Disaster recovery plan.
- Security overview document.
- Insurance checklist: cyber liability, E&O, general liability, D&O later.

## 7. Government Procurement Readiness

Mishava should be prepared for public-sector procurement requirements over time.

Planning areas:

- Section 508 / VPAT / ACR.
- WCAG accessibility testing.
- Security questionnaire packet.
- Data privacy packet.
- Public-sector terms.
- Procurement exception transparency.
- Audit logging.
- Data residency review if needed.
- Records retention.
- Public records / FOIA-related review for Mishava Gov.
- FedRAMP readiness if serving federal agencies directly as a cloud service.
- State/local government procurement documentation.
- Insurance requirements.
- W-9 / vendor onboarding packet.
- SAM.gov registration review if needed later.
- Accessibility support contact.
- Security contact.
- Incident response contact.

Deliverables:

- Government procurement readiness checklist.
- VPAT/ACR plan.
- Section 508 testing plan.
- Public-sector security packet.
- Mishava Gov compliance addendum.
- Procurement data visibility rules.
- Public records handling plan.
- FedRAMP future roadmap, not immediate certification.

## 8. Product Trust / Evidence Governance Compliance

Because Mishava scores trust, compliance is not only technical. The scoring
system itself needs governance.

Planning areas:

- Scoring methodology governance.
- Score version history.
- Auditability of scoring changes.
- Public methodology.
- Correction/dispute policy.
- Evidence publication rules.
- Adverse finding review.
- Legal review triggers.
- No-paid-ranking controls.
- No-commission shopping controls.
- Payment firewall tests.
- Anti-bribery controls.
- Conflict-of-interest controls.
- Reviewer separation of duties.

Deliverables:

- Methodology governance policy.
- Payment firewall policy.
- Correction/dispute policy.
- Anti-bribery policy.
- Conflict-of-interest policy.
- Adverse finding review policy.
- Reviewer training/certification plan.
- Public Trust Commitments page.

## 9. AI Governance And AI Compliance

Mishava will likely use AI for evidence parsing, report drafting,
product/catalog support, and internal review assistance. AI must help find,
parse, summarize, and organize factual evidence; it must not convert opinion or
unverified claims into scored facts.

Planning areas:

- AI use disclosure.
- AI vendor review.
- Model/version tracking.
- Prompt/version tracking.
- Input/output logging.
- Human review requirements.
- Hallucination safeguards.
- No AI-only high-risk adverse findings.
- No AI-only final scoring for material/high-risk cases.
- AI data retention.
- AI vendor training/data-use settings.
- AI cost and abuse controls.
- AI bias/error review.
- AI-generated report review workflow.

Deliverables:

- AI Use Policy.
- AI Governance Policy.
- AI vendor review checklist.
- AI logging requirements.
- Human review trigger matrix.
- AI disclosure language.
- AI incident/error response process.

## 10. External Certifications / Audits / Reports Roadmap

### Stage 1: Build-Ready Internal Controls

- Accessibility checklist.
- Security controls.
- Privacy/data map.
- Audit logs.
- Payment firewall tests.
- Internal policies.
- Legal docs.

### Stage 2: External Accessibility Review

- WCAG 2.2 AA audit where feasible.
- VPAT/ACR preparation.
- Section 508 review for public-sector sales.
- PDF/report accessibility review.

### Stage 3: Security Assurance

- Penetration test.
- Vulnerability scan.
- SOC 2 readiness assessment.
- SOC 2 Type I.
- SOC 2 Type II after controls have operated over time.
- ISO 27001 readiness assessment if needed.

### Stage 4: Institutional / Government Readiness

- Government procurement packet.
- Bank/vendor-risk packet.
- Privacy/security questionnaires.
- Cyber insurance.
- FedRAMP readiness review if federal agency sales become realistic.

### Stage 5: Mature Institutional Compliance

- ISO 27001 certification if justified.
- FedRAMP Moderate/High path only if federal market demand justifies cost.
- Independent methodology/accessibility/security reviews on a regular cadence.

Potential outside validation/certification targets:

- WCAG accessibility audit.
- VPAT / Accessibility Conformance Report.
- SOC 2 Type I.
- SOC 2 Type II.
- ISO/IEC 27001.
- Penetration test report.
- Vulnerability assessment.
- PCI DSS scope documentation through Stripe-centered architecture.
- FedRAMP readiness / FedRAMP path if federal government becomes a target.
- Privacy/legal review.
- AI governance review.
- Methodology/scoring governance advisory review.

## 11. Release Integration

Compliance acceptance criteria should be added to every release without turning
early releases into premature certification projects.

### Release 1 / Foundation

- Semantic HTML baseline.
- Design tokens with contrast requirements.
- Auth/security architecture.
- Audit log model.
- Data classification fields.
- Accessibility testing setup.

### Release 2 / NGO

- Accessible forms.
- Evidence visibility controls.
- Consent language.
- NGO data privacy boundaries.
- Report accessibility requirements.

### Release 2.5 / Functional Foundation

- Route protection.
- Org isolation.
- Audit events.
- RLS verification.
- Access-control tests.

### Release 3 / Scoring

- Immutable snapshots.
- Methodology versioning.
- No-paid-ranking tests.
- Correction/dispute groundwork.
- Public methodology rules.

### Release 4 / Shopping

- Accessible product cards.
- Accessible score popups.
- No-commission disclosure.
- Payment firewall tests.
- User preference privacy.

### Release 5 / Business / Local

- Claim verification policy.
- Address privacy rules.
- Small-business fairness rules.
- Evidence burden rules.

### Release 6 / Plus / Legal / QA

- Legal page set.
- Accessibility audit pass.
- Security checklist.
- Privacy checklist.
- VPAT/ACR draft readiness.
- Public Trust Commitments page.

## 12. Immediate / Near-Term / Later / Customer-Specific Split

### Must Be Built Into The Product From Day One

- Semantic HTML and accessible forms.
- Visible focus states and contrast-aware design tokens.
- Auth and route protection.
- Organization isolation.
- Role-based permissions.
- Append-only audit logs.
- Evidence visibility/sensitivity fields.
- No-paid-ranking/payment firewall tests.
- Secure handling of secrets.
- No raw card storage; Stripe-centered payment design.
- AI cost controls and human review triggers before any AI workflow scales.

### Must Be Documented Before Launch

- Privacy Policy.
- Terms / acceptable use.
- Accessibility Statement.
- Public Trust Commitments.
- Payment firewall policy.
- Correction/dispute policy.
- Evidence publication rules.
- AI use disclosure.
- Security overview.
- Data retention and deletion policy.

### Must Be Reviewed By Counsel Or Specialists

- Privacy policy and data-processing terms.
- Adverse findings and dispute/correction process.
- Public reports and media/research licensing.
- Public-sector records/FOIA implications for Mishava Gov.
- AI vendor/data-sharing terms.
- Accessibility Statement and VPAT/ACR before public-sector sales.
- Security controls before bank/government enterprise sales.

### Can Be Audited Or Certified Later

- WCAG accessibility audit.
- VPAT/ACR.
- Penetration test.
- SOC 2 Type I.
- SOC 2 Type II.
- ISO 27001.
- FedRAMP readiness review.
- Methodology advisory review.
- AI governance review.

### Required Only For Specific Customers

- FedRAMP path: U.S. federal cloud-service sales.
- SAM.gov registration: federal vendor path.
- Data residency: specific public-sector/institutional buyers.
- Bank vendor-risk packet: banking/financial institution buyers.
- Healthcare-adjacent controls: if Mishava expands into protected health or
  healthcare procurement contexts.
- Custom insurance requirements: enterprise/public-sector contracts.

## 13. Owner Roles

Initial owner roles can be combined in a small team, but the roadmap should
anticipate separation as Mishava grows.

- Product owner: release acceptance criteria and user-facing requirements.
- Engineering owner: access control, audit logs, secure implementation,
  testing, and technical evidence.
- Security owner: controls, incident response, vulnerability management, vendor
  risk, SOC 2 readiness.
- Privacy owner: data map, consent, retention, deletion/export, DPA readiness.
- Accessibility owner: design rules, testing, issue triage, VPAT/ACR readiness.
- Methodology owner: scoring versions, evidence rules, corrections/disputes,
  public methodology.
- AI governance owner: model/prompt logs, human review triggers, AI vendor
  review, AI incident process.
- Counsel / outside specialist: legal/privacy/public-sector/adverse claim
  review.
- Compliance owner later: audit evidence, customer questionnaires, external
  assurance coordination.

## 14. Final Planning Note

This track should make Mishava compliance-aware from the foundation without
overbuilding the product too early. The goal is to preserve credibility with
stringent buyers while still building in the right order:

1. Build trustworthy product foundations.
2. Document the standards Mishava is designed to meet.
3. Test the controls internally.
4. Review high-risk areas with counsel and specialists.
5. Seek outside audits/certifications only when the product and market demand
   justify the cost.
