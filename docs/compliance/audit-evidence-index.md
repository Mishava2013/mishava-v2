# Audit Evidence Index

Status: planned future audit evidence structure. This folder is for organizing future review artifacts; it is not proof of certification.

## Purpose

Define where Mishava should keep evidence for future SOC 2 readiness, ISO 27001 readiness, accessibility review, security review, privacy review, and procurement questionnaires.

## Recommended Structure

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

## Evidence Types To Collect

- Policies and approval dates.
- Architecture diagrams.
- Access-control screenshots or exported records.
- Role and permission matrix.
- Audit log examples.
- Migration and deployment records.
- Build/test records.
- Vendor/subprocessor reviews.
- Accessibility smoke results.
- Security review records.
- Incident response tests.
- Backup/restore drill results.

## Handling Rules

- Do not store secrets in audit evidence.
- Redact personal data unless needed for review.
- Keep raw evidence files private.
- Separate actual audit evidence from marketing copy.
- Do not claim certification because a checklist exists.

