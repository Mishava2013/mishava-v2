# Security Control Gaps

Status: internal gap tracker. This document does not claim external security audit completion.

## Critical / High Gaps

### Email And Authentication

- Resend/domain plus Supabase custom SMTP inbox verification must be fully production-verified.
- Password reset flow must be verified on production/staging domains.
- MFA is not enforced for admin/support roles.
- SSO is not implemented.

### File Security

- Real malware scanner integration is not implemented.
- Current status is quarantine-first/manual-review foundation only.
- Scan queue/background worker is not implemented.
- Raw file download UI remains hidden.

### Billing

- Stripe is test-mode foundation only.
- Production Stripe dashboard configuration is not verified.
- Production webhook endpoint/signing secret verification is not complete.
- Tax/refund/accounting automation is not implemented.

### AI

- AI provider is not selected.
- AI vendor/privacy review is pending.
- Production AI automation is not enabled.
- No raw files are sent to AI in the current baseline.

### External Security Assurance

- External penetration test has not been performed.
- Vulnerability management process is not formalized.
- Production monitoring/logging/alerting is not complete.

### Resilience

- Backup/restore drill has not been performed.
- Incident response runbook is not formalized.
- Business continuity plan is not complete.

### Access Governance

- Formal access review process is not implemented.
- Admin/support MFA enforcement is not implemented.
- Break-glass policy is not defined.

### Compliance And Legal

- Attorney review of legal/privacy/security pages is not complete.
- Formal vendor/subprocessor review is not complete.
- Full accessibility review and VPAT/ACR are not complete.

## Control Gap Review Cadence

Recommended:

- Review before full-scale NGO launch.
- Review before institutional sales.
- Review after major auth, billing, file, AI, or support changes.
- Review quarterly once production users are active.
