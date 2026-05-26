# ISO 27001 Readiness

Status: readiness mapping only. Mishava is not ISO 27001 certified.

## Goal

Prepare an information security management system foundation that could support a future ISO 27001 readiness assessment.

## Information Security Policy

Needed:

- Information security policy.
- Scope statement for Mishava NGO.
- Security owner.
- Policy review cadence.

Initial scope:

- Accounts and authentication.
- NGO organizations and memberships.
- Evidence metadata and raw files.
- Reports, exports, and sharing.
- Billing metadata.
- AI suggestion metadata.
- Audit logs.
- Admin/support operations.

## Risk Register

Initial risks to track:

- Wrong-organization access.
- Raw evidence exposure.
- Invite abuse or misdelivery.
- Weak email deliverability.
- Malware or unsafe file upload.
- AI vendor/privacy risk.
- Stripe webhook misconfiguration.
- Admin/support overreach.
- Backup/restore failure.
- Accessibility defects.
- Public compliance overclaims.

## Asset Inventory

Assets to track:

- Supabase V2 project.
- Database schemas and migrations.
- Private `evidence-files` storage bucket.
- Authentication configuration.
- Deployment environment.
- Source repository.
- Stripe account and webhook configuration.
- Resend/domain email configuration.
- Support mailbox/process.
- Future AI provider if enabled.
- Local and deployment secrets.

## Access Control Policy

Needed:

- Role definitions.
- Permission matrix ownership.
- Admin/support access process.
- Access review cadence.
- Service-role usage boundaries.
- Removed/suspended user behavior.
- Current organization selection rules.

## Supplier And Subprocessor List

Initial suppliers/subprocessors to document:

- Supabase.
- Stripe.
- Resend.
- Hosting/deployment provider.
- Support tooling if added.
- Monitoring/logging provider if added.
- AI provider only after one is selected.

For each vendor, track:

- Purpose.
- Data categories.
- Region/data residency notes.
- Security documentation.
- Retention notes.
- Contract/DPA status.
- Owner.

## Incident Management

Needed:

- Incident response runbook.
- Severity matrix.
- Customer notification decision path.
- Security issue intake.
- Postmortem template.
- Evidence preservation guidance.

## Business Continuity

Needed:

- Backup/restore plan.
- Recovery time and recovery point targets.
- Email/provider outage fallback.
- Stripe/webhook failure handling.
- Evidence storage recovery plan.
- Support escalation path.

## Secure Development Policy

Needed:

- Branch/review process.
- Typecheck/lint/test/build requirements.
- Migration review process.
- Secret handling rules.
- Dependency review.
- Release acceptance criteria.
- Rollback plan.

## Internal Audit Preparation

Needed:

- Quarterly readiness review checklist.
- Control owner list.
- Evidence owner list.
- Remediation tracker.
- Public claims review checklist.

