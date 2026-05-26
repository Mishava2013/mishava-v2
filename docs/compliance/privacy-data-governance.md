# Privacy And Data Governance Readiness

Status: readiness documentation only. This document is not legal advice and remains subject to privacy/legal review.

## Goal

Create a data inventory and governance checklist for Mishava NGO before broad self-serve or institutional launch.

## Data Inventory

### User Account Data

Examples:

- User id.
- Email.
- Authentication/session metadata.
- Role claims where applicable.

Readiness needs:

- Retention rule.
- Account recovery workflow.
- Deletion/export request path.

### NGO Profile Data

Examples:

- Organization name.
- Public profile fields.
- Mission area.
- Registration identifiers.
- Website.

Readiness needs:

- Visibility rules.
- Correction workflow.
- Retention/deletion policy.

### Uploaded Evidence Files

Examples:

- Private raw files.
- File metadata.
- Scan/security status.
- Lifecycle/archive status.

Readiness needs:

- Private-by-default rules.
- Retention/archive policy.
- Malware scanning vendor/process.
- Raw file access logging if download UI is enabled later.

### Evidence Metadata And Claims

Examples:

- Evidence title/source/URL/notes.
- Lifecycle status.
- Structured claims.
- AI suggestion linkage.

Readiness needs:

- Review status rules.
- Human review requirements.
- Audit trail retention.

### AI Suggestion Data

Examples:

- Parse job metadata.
- Prompt/model/provider metadata.
- Suggested claim text.
- Review status.
- Reviewer identity and timestamp.

Readiness needs:

- Provider review before production AI.
- No raw file AI processing in current baseline.
- No-training-on-customer-data posture where available.
- User-facing disclosure.
- Sensitive evidence opt-out or do-not-process path if needed.

### Billing Metadata

Examples:

- Plan key.
- Billing status.
- Stripe customer/subscription ids.
- Webhook event metadata.

Readiness needs:

- Payment firewall preservation.
- Stripe production review.
- Retention and support policy.
- No raw card storage.

### Audit Logs

Examples:

- Actor user id.
- Organization id.
- Action.
- Subject table/id.
- Before/after metadata where used.

Readiness needs:

- Retention policy.
- Review process.
- Access restrictions.
- Tamper-resistance expectations.

### Shared Report Recipient Data

Examples:

- Recipient email.
- Recipient name.
- Purpose/note.
- Grant status/expiration.

Readiness needs:

- Retention/deletion policy.
- Revocation rules.
- Recipient access limits.

## Vendor / Subprocessor Placeholder

Track:

- Supabase.
- Stripe.
- Resend.
- Hosting/deployment provider.
- Future AI provider if enabled.
- Future monitoring/support vendors if added.

For each vendor:

- Purpose.
- Data categories.
- Location/region.
- Retention.
- Security documentation.
- DPA/contract status.
- Owner.

## Retention And Deletion Request Process

Current status:

- Self-serve export/deletion automation is not implemented.
- Requests are handled through support/manual review.
- Some records may be retained for auditability, legal compliance, dispute handling, fraud prevention, or trust integrity.

Needed:

- Data retention schedule.
- Export request workflow.
- Deletion request workflow.
- Exception handling for audit logs and evidence traceability.

