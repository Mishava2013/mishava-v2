# NGO Full-Scale Slice 16 Plan: SOC 2 / ISO / VPAT / Formal Compliance Readiness

Status: planning only. Do not implement certification claims from this document.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-15-ai-evidence-parsing-result.md`
- `docs/ngo-full-scale-slice-14-malware-file-security-result.md`
- `docs/ngo-full-scale-slice-12-stripe-checkout-webhooks-result.md`
- `docs/ngo-full-scale-slice-11b-role-change-smoke-result.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`

## Goal

Plan the formal compliance readiness documentation, internal controls, policy gaps, evidence list, and future audit preparation needed before Mishava NGO claims institutional readiness.

This slice is about readiness and truthful posture. It is not an audit, certification, authorization, legal approval, external accessibility review, or public compliance claim.

## Scope

In scope:

- Compliance posture language.
- SOC 2 readiness mapping.
- ISO 27001 readiness mapping.
- VPAT / WCAG / Section 508 readiness mapping.
- Privacy and data-governance readiness.
- Security control gap list.
- Future audit evidence folder structure.
- Checks that prevent premature claims.

Out of scope:

- Actual SOC 2 audit.
- Actual ISO 27001 audit/certification.
- Actual FedRAMP package or authorization.
- Actual VPAT/ACR external review.
- ADA certification claims.
- Formal legal approval.
- Penetration test execution.
- Full production monitoring implementation.
- Shopping.
- Business.
- Local.
- Gov.
- Corporate.
- Plus.
- Final scoring math.
- Production AI automation.
- Public report library.
- Broad analytics.

## 1. Compliance Posture Language

### Approved Language

Use only conservative readiness language until the correct external process is complete:

- `preparing for`
- `designed with`
- `readiness work`
- `readiness roadmap`
- `targeting WCAG 2.2 AA`
- `aligned with where feasible`
- `not yet certified`
- `not yet externally audited`
- `draft baseline`
- `subject to attorney/specialist review`
- `future audit evidence`

### Forbidden Language

Do not use these phrases unless the proper external process has actually been completed:

- `SOC 2 certified`
- `SOC 2 compliant`
- `ISO 27001 certified`
- `ISO compliant`
- `FedRAMP authorized`
- `ADA certified`
- `VPAT complete`
- `ACR complete`
- `bank-grade compliant`
- `government certified`
- `fully compliant`
- `audit-approved`

### Public Claims Rule

Public/legal/trust pages may describe current controls and limitations, but must not imply Mishava has completed an external audit, certification, authorization, final VPAT/ACR, or attorney-approved compliance program unless that is true.

## 2. SOC 2 Readiness Mapping

Target posture: SOC 2 readiness, not SOC 2 certification.

### Access Controls

Current foundations:

- Supabase Auth foundation.
- Organization membership checks.
- Current organization selection with server-side validation.
- Role model: owner, admin, member, viewer.
- Admin/support route protection.

Readiness work:

- Document access control policy.
- Require MFA for admin/support roles before broad institutional sales.
- Define formal access review cadence.
- Record owner for production access grants/removals.
- Add evidence artifacts for role-change tests and admin access checks.

### Authentication

Current foundations:

- Sign-in/sign-out flows.
- Password reset and email configuration work.
- Invite acceptance workflow.

Readiness work:

- Verify production email/provider path.
- Confirm password reset in production domain.
- Document session management.
- Define MFA rollout.
- Document account recovery support workflow.

### Role Permissions

Current foundations:

- Central NGO permission matrix.
- Role-change UI and last-owner protection.
- Removed/suspended membership handling.

Readiness work:

- Maintain permission matrix as an audit artifact.
- Add role-permission review evidence.
- Document emergency access/break-glass path if introduced later.

### Audit Logging

Current foundations:

- Audit events for onboarding, evidence, files, reports, exports, sharing, team, billing, AI suggestion review, and selected support workflows.

Readiness work:

- Define audit log retention policy.
- Document immutable/append-only expectations.
- Add sample audit log evidence for each sensitive workflow.
- Define audit log review process.

### Change Management

Current foundations:

- Git commits per slice.
- Migration discipline.
- Tests/build checks per slice.

Readiness work:

- Document change management policy.
- Require PR/review process before production.
- Capture deployment records.
- Capture migration application records.
- Keep release acceptance docs as evidence.

### Incident Response

Current foundations:

- Support/security issue reporting language exists.
- Corrections/support pages exist.

Readiness work:

- Draft incident response policy.
- Define severity levels.
- Define notification/escalation paths.
- Create incident postmortem template.
- Add security contact ownership.

### Vendor Management

Current foundations:

- Supabase, Stripe test-mode foundation, Resend email path, AI provider deferred.

Readiness work:

- Create vendor/subprocessor inventory.
- Record vendor purpose, data categories, region, retention, security docs, and owner.
- Review AI provider before enabling production AI.
- Review Stripe production setup before real billing.

### Data Retention / Deletion

Current foundations:

- Legal pages acknowledge manual support path.
- Auditability preserved for evidence/report workflows.

Readiness work:

- Create retention schedule by data category.
- Define deletion/export request workflow.
- Define audit-log retention exceptions.
- Define raw evidence retention/archive rules.

### Backup / Recovery

Current foundations:

- Supabase project is clean V2 and migrations are tracked.

Readiness work:

- Document backup strategy.
- Run backup/restore drill.
- Define recovery time/recovery point targets.
- Capture restore test evidence.

### Security Monitoring

Current foundations:

- Audit logs exist for app workflows.

Readiness work:

- Add production logging/alerting plan.
- Define alert owners.
- Document suspicious access review.
- Add monitoring evidence artifacts.

## 3. ISO 27001 Readiness Mapping

Target posture: ISO 27001 readiness mapping, not ISO 27001 certification.

### Information Security Policy

Needed:

- Draft information security policy.
- Define scope: Mishava NGO, evidence files, reports, sharing, billing metadata, AI suggestions, admin/support.
- Assign security owner.

### Risk Register

Needed:

- Maintain risks for:
  - wrong-org access;
  - raw evidence exposure;
  - invite abuse;
  - weak email deliverability;
  - malware/file upload risk;
  - AI vendor/privacy risk;
  - Stripe webhook misconfiguration;
  - admin/support overreach;
  - backup/restore failure;
  - accessibility defects.

### Asset Inventory

Needed:

- Supabase project.
- Vercel/deployment environment.
- Storage buckets.
- Stripe test/production accounts.
- Resend/domain email.
- Source repository.
- Support mailbox.
- Future AI provider.
- Local development secret handling.

### Access Control Policy

Needed:

- Document role definitions.
- Document admin/support access.
- Document access review cadence.
- Document removed/suspended user behavior.
- Document service-role boundaries.

### Supplier / Subprocessor List

Needed:

- Supabase.
- Stripe.
- Resend/Postmark fallback if relevant.
- Hosting/deployment provider.
- Future AI provider, only after selected.
- Support/monitoring vendors if added later.

### Incident Management

Needed:

- Incident response policy.
- Security issue intake path.
- Incident timeline template.
- Customer notification decision process.

### Business Continuity

Needed:

- Backup/restore plan.
- Degraded-mode support plan.
- Email/provider outage fallback.
- Billing/webhook failure response.
- Evidence storage recovery path.

### Secure Development Policy

Needed:

- Branch/review process.
- Dependency review.
- Secret scanning expectations.
- Migration review process.
- Test requirements.
- Release acceptance criteria.

### Internal Audit Preparation

Needed:

- Quarterly internal readiness review checklist.
- Evidence owner for each control.
- Remediation tracker.
- Public claims review checklist.

## 4. VPAT / WCAG / Section 508 Readiness

Target posture: accessibility readiness and WCAG 2.2 AA target where feasible, not VPAT/ACR completion.

### Current Foundations

- Semantic page structure is used across core routes.
- Skip link and main content target exist.
- Legal/support/footer links exist.
- Report/shared report views have readable structures.
- Status labels avoid color-only communication in key NGO flows.

### Readiness Checklist

- WCAG 2.2 AA target where feasible.
- WCAG 2.1 AA awareness for public-sector contexts.
- Section 508 procurement readiness.
- Keyboard navigation.
- Visible focus states.
- Screen reader labels.
- Form labels and error messages.
- Modal/popup accessibility where used.
- Contrast review.
- Report/export accessibility.
- Print/PDF output accessibility where feasible.
- Mobile usability review.
- Reduced-motion support.
- Accessible file upload flow.
- Accessible tables/lists.

### Future VPAT / ACR Preparation

Needed:

- Accessibility test inventory.
- Known defects list.
- Manual keyboard test results.
- Screen-reader smoke results.
- Mobile accessibility review.
- Export/report accessibility review.
- External accessibility review before claiming procurement-grade readiness.

## 5. Privacy And Data Governance

### Data Inventory

Data categories to map:

- User account data.
- Organization memberships and roles.
- NGO profile data.
- Evidence metadata.
- Raw evidence files.
- Evidence lifecycle/review data.
- Report data.
- Share recipient data.
- Audit logs.
- Billing metadata.
- Stripe customer/subscription ids.
- Invite email delivery metadata.
- AI parse job metadata.
- AI suggestions and review history.
- Support/correction requests.

### Governance Requirements

- Define data owner for each category.
- Define retention period.
- Define deletion/export path.
- Define legal/audit retention exceptions.
- Define raw evidence privacy rules.
- Define shared recipient access rules.
- Define AI/subprocessor disclosure.
- Define no-training-on-customer-data posture before production AI.

### Current Gaps

- Self-serve data export/delete automation is not implemented.
- Formal retention schedule is not complete.
- Vendor/subprocessor list is not complete.
- AI provider is not selected.
- Production billing processor configuration still needs final review.

## 6. Security Control Gaps

Known gaps before institutional readiness claims:

- Real email provider/domain verification must be fully production-verified.
- Malware scanner integration is not implemented; only quarantine-first/manual-review foundation exists.
- Production Stripe dashboard/webhook verification is not complete.
- AI provider review is pending if AI is later enabled.
- External penetration test has not been performed.
- Backup/restore drill has not been performed.
- Incident response procedure is not formalized.
- Formal access review process is not implemented.
- Production monitoring/logging/alerting is not complete.
- MFA is not enforced for admin/support roles.
- SSO is not implemented.
- Full accessibility review and VPAT/ACR are not complete.
- Attorney review of legal/privacy/security pages is not complete.

## 7. Future Audit Evidence Folder Structure

Plan a future `docs/evidence/` structure. This document does not create that folder yet unless Slice 16 implementation explicitly calls for it.

Recommended structure:

```text
docs/evidence/
  policies/
    access-control-policy.md
    incident-response-policy.md
    secure-development-policy.md
    vendor-risk-policy.md
    data-retention-policy.md
    backup-recovery-policy.md
  architecture/
    system-overview.md
    data-flow-diagram.md
    auth-org-isolation.md
    storage-security.md
  access-control/
    role-permission-matrix.md
    admin-access-review-template.md
    member-removal-test-evidence.md
  audit-logs/
    onboarding-audit-example.md
    evidence-file-audit-example.md
    report-share-export-audit-example.md
    billing-webhook-audit-example.md
    ai-suggestion-review-audit-example.md
  change-management/
    release-checklist-template.md
    migration-application-record.md
    deployment-record-template.md
  vendors/
    subprocessor-inventory.md
    vendor-review-template.md
    ai-provider-review-template.md
  security-reviews/
    penetration-test-placeholder.md
    vulnerability-review-template.md
    backup-restore-drill-template.md
  accessibility/
    wcag-smoke-check-template.md
    keyboard-test-template.md
    screen-reader-test-template.md
    vpat-acr-readiness-checklist.md
  incidents/
    incident-response-template.md
    postmortem-template.md
```

## 8. Tests And Checks To Plan

Slice 16 implementation should add or run checks for:

- No forbidden compliance claims in app/docs.
- Legal/security/accessibility pages state limitations accurately.
- Security page lists current controls and caveats.
- Accessibility page uses target/readiness language, not certification language.
- Support/corrections paths exist.
- AI disclosure remains suggestion-only and human-reviewed.
- Payment/firewall language remains intact.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

Recommended forbidden-claim regex terms:

- `SOC 2 certified`
- `SOC 2 compliant`
- `ISO 27001 certified`
- `FedRAMP authorized`
- `ADA certified`
- `VPAT complete`
- `ACR complete`
- `bank-grade compliant`
- `fully compliant`

## 9. Non-Goals

Slice 16 implementation must not include:

- Actual SOC 2 audit.
- Actual ISO audit.
- Actual VPAT/ACR external review.
- FedRAMP package.
- Formal legal approval.
- Penetration test execution.
- Full production monitoring implementation.
- New product surfaces.
- Shopping, Business, Local, Gov, Corporate, or Plus work.
- Final scoring math.
- Production AI automation.
- Public report library.
- Broad analytics.

## 10. Acceptance Criteria

Slice 16 implementation can begin only if:

- Compliance posture is honest.
- Readiness checklists exist.
- Control gaps are explicit.
- No premature certification claims are made.
- Future audit evidence structure is planned.
- Institutional-readiness language is conservative.
- Public pages still say what is built, what is targeted, and what is not yet externally reviewed.

## Recommended Implementation Order

1. Add compliance-readiness overview document or internal checklist.
2. Add public-claims guardrail test for forbidden certification language.
3. Add SOC 2 readiness matrix.
4. Add ISO 27001 readiness matrix.
5. Add VPAT/WCAG/Section 508 readiness checklist.
6. Add privacy/data-governance inventory.
7. Add future `docs/evidence/` folder structure only if implementation scope approves docs-only artifacts.
8. Update result document with checks run and limitations.

## Launch Requirement

Readiness checklist and accurate public language are required before institutional sales.

Formal SOC 2, ISO 27001, FedRAMP, VPAT/ACR, external accessibility audit, penetration test, and attorney approval can wait until the appropriate buyer, legal, or procurement threshold justifies the external process.

