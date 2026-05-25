# NGO Full-Scale Readiness Gap Plan

Status: planning only. Do not implement from this document directly.

Source of truth:

- `docs/ngo-pilot-readiness-reaudit.md`

## Purpose

Define what is required to move Mishava NGO from **limited pilot-ready with constraints** to **full-scale self-serve readiness** for many NGOs without founder/manual support for every workflow.

Full-scale readiness means an NGO can:

- create an account
- create or join an organization
- complete onboarding
- manage evidence
- manage reports
- share reports safely
- manage team access
- understand plan limits
- recover from common errors
- trust privacy/security labels
- use the product without founder intervention for normal workflows

## Readiness Summary

| Area | Current status | Risk level | Full-scale readiness summary |
| --- | --- | --- | --- |
| Auth and account readiness | Missing / partial | Critical | Temporary cookie auth must be replaced with final hosted auth, member invites, org switching, and durable role permissions. |
| NGO onboarding readiness | Partial | High | Onboarding persists data but needs self-serve UX, completion checklist, plan selection, clearer guidance, and first-step flow. |
| Evidence readiness | Partial | High | Manual evidence works; file uploads, edit/archive, privacy controls, review workflows, and audit visibility are still needed. |
| Report readiness | Partial | High | Draft reports/detail/edit work; duplicate, preview polish, approvals, exports/shareable output, and stronger status model remain. |
| Sharing readiness | Partial | High | Scoped share grants work; production invitation/token model, recipient UX, view logs, and raw evidence controls remain. |
| Team readiness | Missing | High | Role display exists, but invite/remove/assign/audit workflows are not built. |
| Billing and plan readiness | Missing / partial | Medium | Pricing can be displayed conceptually, but entitlements, plan gates, billing state, and Stripe test mode are not wired. |
| Legal and trust readiness | Missing / partial | Critical | NGO-specific terms, evidence terms, sharing terms, privacy, corrections, and accessibility statement must exist before scale. |
| Accessibility and mobile readiness | Partial | High | Baseline UI exists, but full keyboard/screen-reader/mobile/report accessibility pass is needed. |
| Admin/support readiness | Partial | High | Admin/support tooling must let Mishava troubleshoot without silently altering trust outcomes. |
| Operational readiness | Missing / partial | Critical | Monitoring, logging, backups, support process, launch checklist, and rollback plan are required before full-scale launch. |

## Full-Scale Readiness Checklist

### 1. Auth And Account Readiness

Current status: **partial / missing**  
Risk level: **critical**

Must-have before full-scale launch:

- Final hosted auth provider.
- User sign-up.
- User sign-in.
- Password reset.
- Email verification.
- MFA support for admins and sensitive roles.
- Organization creation tied to authenticated user.
- Organization switching.
- Member invite flow.
- Invite accept/decline flow.
- Role assignment and permission checks.
- Session security rules.
- Account recovery support flow.
- Tests for unauthenticated, wrong-org, and wrong-role access.

Can wait until after launch:

- SSO for larger NGOs and networks.
- Custom role builder.
- SCIM provisioning.
- Advanced device/session management.

Recommended implementation slices:

1. Final auth provider integration.
2. Organization switcher and account menu.
3. Member invites and role assignment.
4. MFA/admin-sensitive access hardening.

Acceptance signal:

- A new NGO user can sign up, verify email, create an org, invite a teammate, switch orgs if needed, and recover access without founder support.

### 2. NGO Onboarding Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Self-serve onboarding path for NGO org creation.
- Profile setup fields with validation.
- Plan selection or plan placeholder.
- Guided first steps after onboarding.
- Onboarding completion checklist.
- Clear empty states.
- Clear labels for what is live versus coming later.
- Success/error states.
- Ability to resume incomplete onboarding.
- Audit event on onboarding/profile changes.

Can wait until after launch:

- Advanced guided setup wizard.
- Network/foundation-sponsored onboarding.
- Import from existing NGO website or documents.
- AI-assisted profile drafting.

Recommended implementation slices:

1. Onboarding checklist and resume state.
2. NGO profile setup polish and validation.
3. First-run dashboard with next actions.

Acceptance signal:

- A new NGO can complete onboarding and know the next three steps without help.

### 3. Evidence Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Manual evidence entry.
- Evidence edit/update with audit event.
- Evidence archive/deactivate with audit event.
- Evidence visibility controls.
- Evidence review status labels.
- Evidence privacy labels.
- Evidence linked to structured claims.
- Evidence linked to reports.
- Evidence audit trail view.
- File upload/storage with private org isolation.
- Safe file metadata.
- Malware scanning or scanning plan.
- Redaction support or redaction policy.
- Retention policy.
- Tests for private/wrong-org access.

Can wait until after launch:

- Bulk evidence import.
- AI parsing.
- OCR.
- Automatic public-record lookup expansion.
- Advanced evidence deduplication.

Recommended implementation slices:

1. Evidence edit/archive and audit trail.
2. Production-safe file upload/storage.
3. Evidence review queue and status workflow.
4. Evidence privacy/redaction controls.

Acceptance signal:

- An NGO can add, correct, archive, and safely attach evidence without exposing private data.

### 4. Report Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Create report.
- Edit report.
- View report detail.
- Preview report.
- Duplicate report.
- Attach organization-owned evidence.
- Attach accepted claims only.
- Report status model:
  - draft
  - in review
  - approved
  - shared
  - archived
- Private by default.
- Report audit logs.
- Report sharing.
- Shareable output or export path.
- Clear labels when no public score exists.
- No fake score values.
- Tests for wrong-org evidence/claims.

Can wait until after launch:

- Advanced report builder.
- Full PDF/Word/Excel export styling.
- AI report rebuilding.
- Report template marketplace/library.

Recommended implementation slices:

1. Report status and approval workflow.
2. Report preview and duplicate.
3. Report audit trail view.
4. Minimal shareable output/export.

Acceptance signal:

- An NGO can produce a usable private or shared report from real evidence without accidentally exposing raw evidence or unsupported claims.

### 5. Sharing Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Scoped share grants.
- Recipient access model.
- Grant revocation.
- Grant expiration.
- View logs.
- Raw evidence controls.
- Public/private visibility rules.
- Recipient-facing access/error states.
- Share management list.
- Tests for revoked/expired/wrong-recipient access.
- Clear "not public" and "raw evidence not exposed" labels.

Can wait until after launch:

- Tokenized link sharing if authenticated recipient accounts are enough for launch.
- Funder dashboard.
- Bulk sharing.
- Data room-style evidence access.

Recommended implementation slices:

1. Share grant management page.
2. Recipient invitation/access polish.
3. View logs and audit trail.
4. Raw evidence opt-in policy and controls.

Acceptance signal:

- An NGO can safely share a report summary with the intended recipient, revoke it, and see who viewed it.

### 6. Team Readiness

Current status: **missing**  
Risk level: **high**

Must-have before full-scale launch:

- Invite team member.
- Remove team member.
- Assign role.
- Change role.
- Role permission checks.
- Team action audit events.
- Clear role descriptions.
- Prevent last owner/admin removal.
- Tests for role-gated workflows.

Can wait until after launch:

- Custom roles.
- Department/project teams.
- Approval chains by program.
- SSO/SCIM.

Recommended implementation slices:

1. Team invites.
2. Role assignment and permission checks.
3. Team audit events and owner-safety rules.

Acceptance signal:

- NGO admins can manage their own team without support, and no member can access actions beyond their role.

### 7. Billing And Plan Readiness

Current status: **missing / partial**  
Risk level: **medium**

Must-have before full-scale launch:

- NGO Free / Grassroots / Growth / Trust Pro / Custom plan definitions.
- Pricing display.
- Entitlement limits.
- Plan-gated features.
- Billing status display.
- Stripe test mode or explicit billing placeholder.
- Plan change request path if Stripe is deferred.
- No billing impact on trust outcomes.
- Tests proving billing does not affect score, report trust status, evidence review, or visibility ranking.

Can wait until after launch:

- Full Stripe subscriptions.
- Coupons/sponsored access automation.
- Invoices/receipts portal.
- Custom network billing.

Recommended implementation slices:

1. NGO plan and entitlement model.
2. Billing placeholder with plan request path.
3. Stripe test-mode subscription flow.
4. Sponsored/network access later.

Acceptance signal:

- NGOs understand their plan limits, and feature gates never imply better trust treatment.

### 8. Legal And Trust Readiness

Current status: **missing / partial**  
Risk level: **critical**

Must-have before full-scale launch:

- Terms of Service.
- Privacy Policy.
- Evidence Submission Terms.
- Report Sharing Terms.
- Correction/Dispute Policy.
- No Paid Ranking disclosure.
- No paid trust-treatment disclosure.
- Accessibility Statement.
- Data retention policy.
- Redaction/sensitive evidence policy.
- AI Use Disclosure if any AI is enabled.
- Consent language for shared recipients.
- Legal review before broad external use.

Can wait until after launch:

- Enterprise DPA.
- Foundation/network sponsorship terms.
- Research/media data license terms.
- Formal VPAT/ACR if not selling to government yet.

Recommended implementation slices:

1. NGO pilot legal/trust page set.
2. Evidence/report/sharing terms acceptance.
3. Correction/dispute workflow.
4. Counsel review pass.

Acceptance signal:

- NGO users and recipients understand what Mishava does, what it does not do, what data is private, and how corrections/disputes work.

### 9. Accessibility And Mobile Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Keyboard navigation.
- Visible focus states.
- Screen-reader labels.
- Form error summaries.
- Field-level validation.
- Color contrast review.
- Mobile evidence view.
- Mobile report detail/edit view.
- Mobile sharing flow.
- Accessible shared report summary.
- Accessible report output.
- Automated accessibility checks where feasible.
- Manual keyboard QA.

Can wait until after launch:

- Formal third-party accessibility audit.
- VPAT/ACR.
- Advanced PDF accessibility if export is not launched.

Recommended implementation slices:

1. Form validation and error summaries.
2. Mobile pass for NGO workflows.
3. Keyboard/screen-reader pass.
4. Accessible report output later.

Acceptance signal:

- A keyboard-only user can complete core NGO workflows, and mobile users can manage evidence, reports, and share grants without layout breakage.

### 10. Admin / Support Readiness

Current status: **partial**  
Risk level: **high**

Must-have before full-scale launch:

- Admin can view orgs safely.
- Admin can inspect evidence/report/share state.
- Admin can troubleshoot access and sharing issues.
- Admin cannot silently alter trust outcomes.
- Admin actions write audit events.
- Role-gated support access.
- Read-only audit trail view.
- Locked-out user support process.
- Report-sharing issue support process.
- Correction/dispute support process.

Can wait until after launch:

- Advanced admin dashboards.
- Support macros.
- SLA tracking.
- Internal reviewer performance dashboard.

Recommended implementation slices:

1. Admin/support org lookup.
2. Read-only audit trail inspection.
3. Support action audit logging.
4. Correction/dispute queue.

Acceptance signal:

- Mishava staff can troubleshoot without bypassing transparency, org isolation, or score/trust guardrails.

### 11. Operational Readiness

Current status: **missing / partial**  
Risk level: **critical**

Must-have before full-scale launch:

- Error logging.
- Backup strategy.
- Migration discipline.
- Monitoring.
- Support inbox/process.
- Launch checklist.
- Rollback plan.
- Incident response procedure.
- Data deletion/export support process.
- Dependency/security scanning.
- Environment variable and secret handling policy.
- Production deployment checklist.

Can wait until after launch:

- SOC 2 readiness packet.
- Formal disaster recovery exercise.
- Advanced monitoring dashboards.
- Status page.

Recommended implementation slices:

1. Error logging and support inbox.
2. Launch checklist and rollback plan.
3. Backup/recovery verification.
4. Security/dependency monitoring.

Acceptance signal:

- A production issue can be detected, triaged, communicated, and rolled back without ad hoc founder-only intervention.

## Must-Have Before Full-Scale Launch

1. Final hosted auth with account recovery, org switching, invites, and roles.
2. Self-serve onboarding checklist and first-run guidance.
3. Evidence edit/archive and production-safe file upload/storage.
4. Claim review UI and review operating model.
5. Report approval/status workflow.
6. Share grant management and recipient access polish.
7. Team invite/remove/role management.
8. NGO plan/entitlement model with no trust-outcome impact.
9. Legal/trust page set and policy acceptance.
10. Accessibility/mobile QA pass for NGO workflows.
11. Admin/support tooling with audit events.
12. Operational launch checklist, monitoring, backups, and rollback.

## Can Wait Until After Full-Scale Launch

1. AI report rebuilding.
2. Bulk evidence import.
3. Full styled PDF/Word/Excel exports if shareable web output is sufficient at launch.
4. Funder dashboards.
5. SSO/SCIM.
6. Custom roles.
7. Advanced report templates.
8. Network/foundation sponsorship automation.
9. Third-party accessibility audit, if not selling to government yet.
10. SOC 2 / ISO 27001 formal certification.

## Recommended Implementation Slices In Order

1. Final Auth Foundation
   - Hosted auth, sign-up/sign-in, password reset, email verification, org creation, org switching.

2. Team And Roles
   - Member invites, remove member, assign role, role permission tests, audit events.

3. Self-Serve NGO Onboarding
   - Completion checklist, profile setup polish, first-run dashboard, clear empty states.

4. Evidence Edit / Archive / Audit Trail
   - Evidence update, archive, privacy labels, audit trail view.

5. Production File Upload Storage
   - Private storage, file metadata, malware scanning plan, redaction/retention policy.

6. Claim Review Console
   - Reviewer UI for accepting/rejecting structured claims with audit events.

7. Report Status And Approval
   - Draft/in-review/approved/shared/archived states, approval audit trail.

8. Sharing Management Polish
   - Grant list, recipient invitation/access states, view logs, revocation UX.

9. Legal / Trust / Consent Pages
   - ToS, Privacy, Evidence Submission Terms, Report Sharing Terms, Correction/Dispute Policy, No Paid Ranking disclosure, Accessibility Statement.

10. NGO Plans And Entitlements
   - Free/Grassroots/Growth/Trust Pro/Custom, feature gates, billing placeholder or Stripe test mode, no trust-outcome impact tests.

11. Accessibility And Mobile Pass
   - Keyboard, screen reader, contrast, form errors, mobile evidence/report/share flows.

12. Admin / Support Readiness
   - Org lookup, support-safe views, audit trail inspection, locked-out user/report-sharing support.

13. Operational Launch Readiness
   - Error logging, backups, monitoring, launch checklist, rollback plan, support process.

## Full-Scale Launch Decision Gate

Mishava NGO should be considered full-scale self-serve ready only when:

- a new NGO can sign up, create an org, invite a teammate, complete onboarding, add evidence, create/review report material, share a report summary, and understand plan limits without founder support
- private data remains protected by auth, RLS, helper checks, and UI labels
- every sensitive action writes an audit event
- reports and evidence remain private by default
- raw evidence is never exposed accidentally
- billing/plan status cannot change trust outcomes
- legal/trust policies are published and accepted
- accessibility/mobile checks pass for core NGO workflows
- Mishava staff have support tools that preserve transparency
- monitoring, backups, and rollback are ready

## Final Recommendation

The next build should not jump to exports, AI, or broader product surfaces. The highest-leverage path to full-scale NGO readiness is:

1. final auth
2. team/roles
3. self-serve onboarding
4. evidence edit/archive plus audit visibility
5. claim review console
6. report approval/status
7. sharing polish

This keeps Mishava's trust promise intact while removing founder/manual support from normal NGO workflows.
