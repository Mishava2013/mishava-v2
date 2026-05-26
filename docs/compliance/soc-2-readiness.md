# SOC 2 Readiness

Status: readiness mapping only. Mishava is not SOC 2 certified and has not completed a SOC 2 Type I or Type II audit.

## Goal

Prepare internal controls and evidence that could support a future SOC 2 readiness assessment.

## Access Controls

Current foundations:

- Supabase Auth foundation.
- Organization membership checks.
- Current organization selection with server-side validation.
- Owner, admin, member, and viewer NGO roles.
- Admin/support route protection.
- Removed or inactive memberships are rejected by current-org checks.

Planned controls:

- Formal access control policy.
- MFA requirement for admin/support roles before broad institutional sales.
- Formal access review cadence.
- Production access grant/removal records.
- Break-glass policy if an emergency access path is introduced.

Evidence needed:

- Role permission matrix.
- Admin/support access test results.
- Role-change and last-owner protection test results.
- Sample access review record.

## Authentication

Current foundations:

- Sign-in and sign-out routes.
- Password reset/update routes.
- Invite acceptance workflow.
- Real email provider foundation and invite delivery work.

Planned controls:

- Verify production custom SMTP and inbox delivery.
- Confirm password reset on production domain.
- Document session management and cookie behavior.
- Define MFA rollout for sensitive roles.
- Document account recovery workflow.

Evidence needed:

- Auth configuration screenshots or records.
- Sign-up/password reset smoke results.
- Invite acceptance smoke results.

## Role Permissions

Current foundations:

- Central NGO permission matrix.
- Role-change UI.
- Last-owner protection.
- Removed/suspended membership handling.

Planned controls:

- Formal permission review process.
- Periodic review of high-privilege roles.
- Audit evidence for role changes and removals.

Evidence needed:

- Permission matrix snapshot.
- Team management test results.
- Audit-event samples for invite, accept, role change, remove.

## Audit Logging

Current foundations:

- Audit events for onboarding, evidence, file upload/security, reports, exports, sharing, team changes, billing/webhooks, and AI suggestion review.

Planned controls:

- Audit log retention policy.
- Audit review procedure.
- Security event review cadence.
- Append-only expectations documented.

Evidence needed:

- Audit log examples for each sensitive workflow.
- Audit review checklist.
- Retention schedule.

## Change Management

Current foundations:

- Slice-based implementation docs.
- Git commits.
- Migration files.
- Typecheck, lint, test, and build checks.

Planned controls:

- Production change-management policy.
- Pull request and review requirement.
- Deployment approval evidence.
- Migration application records.
- Rollback plan.

Evidence needed:

- Release checklist template.
- Deployment record.
- Migration application record.
- Build/test logs.

## Incident Response

Current foundations:

- Support and correction pages exist.
- Security issue language exists.

Planned controls:

- Incident response policy.
- Severity definitions.
- Escalation and notification procedure.
- Postmortem template.

Evidence needed:

- Incident response runbook.
- Incident timeline template.
- Security contact ownership.

## Vendor Management

Current foundations:

- Supabase is used for database/auth/storage.
- Stripe test-mode foundation exists.
- Resend email path is prepared.
- AI provider is not configured.

Planned controls:

- Vendor/subprocessor inventory.
- Vendor risk review template.
- AI vendor review before production AI.
- Stripe production review before real charging.

Evidence needed:

- Vendor inventory.
- Subprocessor list.
- Provider security docs.
- AI provider review if enabled.

## Data Retention And Deletion

Current foundations:

- Legal pages describe manual request paths.
- Auditability is preserved for trust-sensitive workflows.

Planned controls:

- Data retention schedule.
- Deletion/export request procedure.
- Audit-log retention exceptions.
- Raw evidence retention/archive policy.

Evidence needed:

- Data retention policy.
- Deletion/export request template.
- Evidence retention rules.

## Backup And Recovery

Current foundations:

- Clean V2 Supabase project.
- Migrations tracked in the repo.

Planned controls:

- Backup strategy.
- Restore drill.
- RTO/RPO targets.
- Recovery owner and runbook.

Evidence needed:

- Backup configuration record.
- Restore drill result.
- Recovery checklist.

## Security Monitoring

Current foundations:

- Product audit events exist.

Planned controls:

- Production logging and alerting.
- Suspicious access review.
- Alert ownership.
- Vulnerability management process.

Evidence needed:

- Monitoring plan.
- Alert review examples.
- Vulnerability review records.

