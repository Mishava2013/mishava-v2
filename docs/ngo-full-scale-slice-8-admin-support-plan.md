# NGO Full-Scale Slice 8 Plan: Admin And Support Operations

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`
- `docs/ngo-full-scale-slice-6-billing-entitlements-result.md`
- `docs/ngo-full-scale-slice-4-evidence-files-result.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`

## Goal

Plan the minimum safe admin/support tooling Mishava needs before NGO full-scale self-serve launch.

This slice should help Mishava support NGOs when account, organization, evidence, report, sharing, team, billing, correction, or access issues occur, without creating a backdoor that can silently alter trust outcomes.

## Scope

In scope:

- NGO-focused internal admin/support dashboard planning.
- Support-safe access model.
- Support workflows and runbook categories.
- Minimal admin actions.
- Audit requirements.
- Security and privacy guardrails.
- Integration points with `/support` and `/legal/corrections`.
- Tests required before implementation acceptance.

Out of scope:

- Shopping.
- Business.
- Local.
- Gov.
- Corporate.
- Plus.
- AI scoring.
- Production Stripe billing.
- Final scoring math.
- Public report library.
- Broad analytics.
- Full CRM or ticketing integration.

## 1. Admin / Support Dashboard

Plan a protected internal admin/support view for NGO support operations.

Recommended route:

- `/admin/support`

This route should require an admin/support-equivalent permission. It should not be accessible to ordinary NGO users, NGO owners, report recipients, or unauthenticated users.

Minimum dashboard modules:

| Module | What it shows | Why it matters |
| --- | --- | --- |
| Organization search | Organization name, id, country, profile status, created date. | Helps support find the correct workspace without guessing. |
| NGO profile summary | Public name, mission area, website, tier/plan, profile status. | Helps troubleshoot onboarding/profile questions. |
| Members summary | Member count, roles, membership status, pending invites. | Helps resolve locked-out users, role confusion, and invite issues. |
| Evidence summary | Evidence count, file count, lifecycle status counts, latest evidence update. | Helps support evidence upload/status issues without reading raw files by default. |
| Report summary | Report count, draft/shared/archived status counts, latest report update. | Helps support report workflow and sharing issues. |
| Share grants summary | Active, revoked, expired counts and recent grants. | Helps support accidental sharing, revocation, and recipient access issues. |
| Billing summary | Current NGO plan/tier, usage vs key limits, billing status. | Helps support plan confusion and entitlement-limit issues. |
| Recent audit events | Last sensitive events for the selected organization. | Helps support understand what happened without mutating records. |
| Support status | Internal support note/status for the org. | Helps Mishava coordinate active support work. |

Recommended support status values:

- `none`
- `watching`
- `needs_follow_up`
- `blocked`
- `security_review`
- `correction_review`
- `billing_review`
- `resolved`

## 2. Support-Safe Access Model

Admin/support access should help troubleshoot, not silently change trust outcomes.

Rules:

- Admin/support users cannot directly edit scores.
- Admin/support users cannot silently alter evidence truth.
- Admin/support users cannot delete evidence, reports, share grants, audit events, or snapshots silently.
- Sensitive admin/support actions require audit events.
- Support access is role-limited.
- Raw evidence file access is restricted, not shown by default, and must be separately authorized/logged if later implemented.
- Service-role-backed operations must stay server-side and narrow.
- Any support action that changes organization access, invite state, share state, billing support state, or correction status must be recorded.

Recommended admin/support roles:

| Role | Intended power |
| --- | --- |
| `admin` | System administrator with broad internal access and audit responsibility. |
| `support_admin` | Can view support dashboard and perform limited support actions. |
| `methodology_admin` | Can access methodology/scoring administration, not normal support interventions by default. |
| `security_admin` | Can view security/access incidents and sensitive audit context. |

Implementation can begin with existing admin permissions, but the plan should leave room for support-specific roles later.

## 3. Support Workflows

Plan support workflows for the most likely full-scale NGO issues.

### Locked-Out User Support

Need to support:

- user cannot sign in;
- password reset issue;
- Supabase rate-limit issue;
- user belongs to org but cannot access it;
- removed or suspended membership confusion.

Support should be able to:

- view user/member record;
- view organization memberships;
- confirm current membership status;
- point user to reset/sign-in flow;
- mark internal support status.

Support should not:

- reveal another user's private data;
- bypass auth without audit trail;
- silently reactivate removed users.

### Wrong Org / Current Org Issue

Need to support:

- user sees wrong org;
- stale current org cookie/state;
- org switching confusion;
- removed membership still appears.

Support should be able to:

- view active memberships;
- view recent org switching/member removal audit events;
- confirm whether the current org is valid.

Future action:

- clear stale current org state if a server-side account-support action is added.

### Invite Not Accepted

Need to support:

- invited user did not receive email;
- invite expired;
- invite email typo;
- invite revoked by mistake;
- wrong email trying to accept invite.

Support should be able to:

- view invite status;
- view invited email/domain;
- view expiration/revocation state;
- resend invite later if email sending exists;
- revoke a bad invite if safe.

### Revoke Bad Invite

Need to support:

- accidentally invited wrong recipient;
- suspected compromised invite;
- role mistake.

Support should be able to:

- revoke pending invite;
- record who revoked it and why;
- avoid creating membership access unless accepted by matching email.

### Report Share Problem

Need to support:

- wrong recipient cannot access report;
- recipient should no longer have access;
- expired/revoked grant confusion;
- report sender needs confirmation that raw evidence was not shared.

Support should be able to:

- view share grants summary;
- confirm grant status;
- confirm whether raw files were exposed by default: they should not be;
- revoke grant if authorized and audit-logged.

### Evidence Upload Issue

Need to support:

- file rejected due to type/size;
- storage limit reached;
- file metadata exists but user cannot see it;
- evidence archived by mistake;
- evidence tied to report/claim/snapshot.

Support should be able to:

- view metadata summary;
- view lifecycle status;
- view file count and size;
- view whether evidence is attached to reports/claims/snapshots.

Support should not:

- read raw files by default;
- delete evidence silently;
- remove traceability when evidence supports a report/claim/snapshot.

### Billing / Plan Confusion

Need to support:

- user does not understand Free/Grassroots/Growth/Trust Pro/Network plan;
- entitlement limit reached;
- downgrade/upgrade placeholder confusion;
- setup service question.

Support should be able to:

- view current plan/tier;
- view usage vs limits;
- see recent entitlement limit events;
- mark billing support status.

Support should not:

- change trust outcomes based on payment;
- promise score/ranking/verification advantage.

### Correction / Dispute Request Intake

Need to support:

- inaccurate evidence report;
- missing context;
- mistaken public/shared summary;
- dispute with trust interpretation.

Support should be able to:

- mark correction/dispute status;
- add internal support note;
- link request to organization, evidence item, report, share grant, or future score snapshot;
- preserve audit history.

Correction requests must not:

- guarantee removal;
- guarantee favorable score changes;
- erase prior history silently.

### Access / Security Issue Intake

Need to support:

- suspected unauthorized report access;
- mistaken share grant;
- exposed evidence concern;
- account compromise concern.

Support should be able to:

- mark `security_review`;
- view relevant audit events;
- revoke share grants/invites where safe;
- escalate to security/admin owner.

## 4. Minimal Admin Actions

Plan only the smallest safe actions needed for NGO support operations.

Allowed early actions:

- view organization summary;
- view NGO profile summary;
- view members and pending invites;
- view evidence/report/share summaries;
- view billing plan and usage summary;
- view recent audit events;
- mark support note/status;
- revoke pending invite where safe;
- revoke share grant where safe;
- record correction/dispute intake status.

Actions to defer:

- direct evidence edit by support;
- raw evidence file preview/download;
- report content editing by support;
- member role change by support;
- billing plan override;
- score/snapshot/methodology changes;
- evidence deletion;
- report deletion;
- audit event deletion or editing.

If a deferred action becomes necessary later, it should receive its own slice with explicit permission checks, audit logging, and legal/trust review.

## 5. Audit Requirements

Audit events should be written for support/admin actions that change access, state, or trust-relevant context.

Audit immediately:

- support status/note created or updated;
- invite revoked by support/admin;
- share grant revoked by support/admin;
- correction/dispute request status changed;
- billing support status changed;
- member access change if implemented;
- evidence/report intervention if implemented later.

Audit if feasible:

- support/admin viewing sensitive organization detail;
- support/admin viewing evidence metadata;
- support/admin viewing share grant details;
- support/admin viewing billing/support context.

Do not audit every generic list view in the first slice if it creates excessive noise, but sensitive views should be evaluated carefully.

Audit event metadata should include:

- acting user id;
- organization id;
- affected object id and type;
- action name;
- before/after status where applicable;
- support reason/note where appropriate;
- timestamp.

## 6. Security And Privacy

Security requirements:

- `/admin/support` must require admin/support permission.
- Ordinary NGO members, viewers, report recipients, and unauthenticated users must be blocked.
- MFA should be recommended for admin/support now and required before broader full-scale launch where feasible.
- No broad service-role UI operations without action-specific safeguards.
- Raw evidence files should not be previewed by default.
- Support users should see summaries first, not raw sensitive content.
- Least-privilege design should be preserved.
- Access logs/audit events should support investigations.
- Current org cookie/state must not grant admin/support access.
- Old Supabase project must remain untouched.

Privacy requirements:

- Support pages should avoid exposing raw files, private notes, or unrelated organization data by default.
- Support notes should not contain unnecessary sensitive personal data.
- Support actions should respect organization boundaries unless specifically authorized.
- Shared recipient data should be visible only as needed for grant troubleshooting.

## 7. Support / Legal Pages Integration

The new public `/support` and `/legal/corrections` pages should eventually connect to support workflows.

Near-term integration:

- Add guidance that requests are manually reviewed.
- Provide request categories:
  - account access;
  - organization access;
  - evidence issue;
  - report sharing issue;
  - billing/plan question;
  - correction/dispute request;
  - accessibility issue;
  - security issue.

Later integration:

- support request form;
- correction request form;
- security issue intake form;
- billing support form;
- admin/support dashboard queue;
- email notifications;
- status updates to submitter where safe.

No full ticketing integration is required in Slice 8.

## 8. Tests Required

Implementation should add or extend tests proving:

- non-admin cannot access admin/support dashboard;
- unauthenticated user cannot access admin/support dashboard;
- admin/support user can view org summary;
- admin/support user can view members summary;
- admin/support user can view evidence/report/share summary without raw file exposure;
- admin/support user can view billing plan/usage summary;
- admin cannot directly change scoring output from support tooling;
- support/admin action writes audit event where implemented;
- invite revoke/support status/correction status actions write audit events if implemented;
- support actions do not expose raw files by default;
- protected routes remain protected;
- existing NGO evidence/report/share/team/billing tests still pass;
- `npm test` passes;
- `npm run lint` passes;
- `npm run build` passes.

Manual checks to record in result document:

- support dashboard does not expose raw file URLs;
- support dashboard labels any view-only/support-only functions clearly;
- support pages do not imply support can create favorable trust outcomes;
- support actions do not alter trust outcomes silently.

## 9. Non-Goals

Slice 8 must exclude:

- full CRM;
- ticketing integration;
- broad analytics;
- AI support bot;
- production payment support automation;
- advanced admin scoring console;
- public transparency dashboard;
- raw evidence file preview/download;
- direct score editing;
- evidence/report deletion;
- audit log editing;
- final scoring math;
- Shopping, Business, Local, Gov, Corporate, or Plus work.

## 10. Recommended Build Order

1. Create `/admin/support` protected route shell.
2. Add organization search/list with summary counts.
3. Add organization detail support view with members, evidence/report/share/billing summaries.
4. Add recent audit events view.
5. Add support status/note model and audit event.
6. Add narrowly scoped revoke actions for bad invites/share grants if safe.
7. Add correction/dispute intake status if schema can support it without broad workflow complexity.
8. Add tests and result documentation.

If the implementation gets too large, split into:

- Slice 8A: read-only support dashboard and audit visibility.
- Slice 8B: support notes/status and correction/dispute intake.
- Slice 8C: limited audited interventions such as invite/share revocation.

## 11. Acceptance Criteria

Slice 8 can be implemented only if:

- admin/support access is restricted;
- support views are NGO-focused and organization-scoped;
- support workflows are safe and audit-aware;
- trust outcomes cannot be silently manipulated;
- scores cannot be directly edited;
- evidence truth cannot be silently altered;
- raw evidence remains protected by default;
- support tooling helps full-scale NGO operations without creating a backdoor;
- support/legal pages have a clear path into support workflows, even if request forms remain later work;
- no new product surfaces or broad analytics are added;
- tests/lint/build pass.

## 12. Result Document Required Later

The implementation result should create:

`docs/ngo-full-scale-slice-8-admin-support-result.md`

It should include:

- what was implemented;
- admin/support routes added;
- support-safe access controls;
- support actions implemented;
- audit events added;
- tests run;
- known limitations;
- remaining admin/support/operations work;
- confirmation that no raw file preview, direct score editing, silent evidence alteration, production billing, broad analytics, or non-NGO product surfaces were added.
