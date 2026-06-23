# Mishava NGO Deep Current-State Audit

Date: June 23, 2026

Purpose: document the real current state of Mishava NGO before a focused new chat continues the NGO work. This is a review and handoff document only. It does not add product features, migrations, DNS/domain changes, Vercel changes, Supabase changes, Stripe/payment changes, or old-project changes.

## Executive Summary

Mishava NGO is close to a supported private pilot, excluding Stripe/payment. The repo-side product foundation is broad: public NGO landing, account/auth surfaces, NGO onboarding, organization creation, organization switching, team roles/invites, evidence library, private file metadata/storage, report building, scoped sharing, CSV/print exports, support/admin summaries, legal/security/accessibility pages, compliance-readiness docs, and AI suggestion-only guardrails are all represented in code, migrations, tests, and operational docs.

The main remaining risk is not "missing product surface." It is live operational proof: real inbox/Auth confirmation, custom SMTP/Resend delivery, password reset, team invite delivery, real browser/mobile walkthroughs, backup/restore drill, incident response drill, monitoring/logging proof, and a deliberate upload-safety operating policy while malware scanning remains manual/not fully integrated.

Recommended status:
- Core NGO product workflow completeness: 92-94%.
- Supported/private NGO pilot readiness, excluding Stripe: 90-93% before live inbox/Auth proof; 95-97% after real inbox/Auth proof and one full browser/mobile pilot walkthrough.
- Broad public self-serve NGO readiness, excluding Stripe: 86-90%.
- Operational readiness: 70-78%.
- Security/file-safety readiness: 72-80% for supported pilot; 55-65% for broad public uploads.
- Legal/compliance/accessibility readiness: 65-72%.

## Scope And Hard Boundaries

Reviewed as in-scope:
- NGO public landing and first-time flow.
- Auth/account pages and sign-in popup behavior.
- NGO onboarding and organization creation.
- Organization membership, switching, and role protection.
- Team invites and role changes.
- Evidence, files, lifecycle, and scan/quarantine status.
- Reports, exports, and scoped sharing.
- Admin/support dashboard and read-only support summaries.
- Legal/trust/security/accessibility/compliance readiness.
- AI evidence parsing posture and AI-control guardrails.
- Tests, migrations, runbooks, and launch-readiness docs.

Explicitly out of scope:
- Stripe/payment production enablement.
- Public claims of compliance/certification.
- Old Supabase project `mishava / tghbfautnxblfxrtkdqb`.
- `dsuupr-am`.
- New features, migrations, DNS/domain changes, Vercel changes, Supabase dashboard changes, or live deployment changes.

## Source Material Reviewed

Primary docs:
- `docs/mishava-v2-current-state-category-review.md`
- `docs/chat-handoffs/mishava-ngo-chat-handoff.md`
- `docs/ngo-near-100-non-stripe-readiness-result.md`
- `docs/ngo-full-scale-slice-17-final-launch-audit.md`
- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/operations/ngo-live-email-auth-verification-checklist.md`
- `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`
- `docs/operations/ngo-file-review-and-upload-safety-runbook.md`
- `docs/operations/ngo-backup-monitoring-incident-readiness-checklist.md`
- `docs/compliance/`

Primary app/code areas:
- `src/app/ngo/page.tsx`
- `src/app/ngo/onboarding/page.tsx`
- `src/app/ngo/onboarding/actions.ts`
- `src/app/ngo/reports/page.tsx`
- `src/app/ngo/sharing/page.tsx`
- `src/app/ngo/sign-in/page.tsx`
- `src/app/org/profile/page.tsx`
- `src/app/org/evidence/page.tsx`
- `src/app/org/evidence/actions.ts`
- `src/app/org/reports/`
- `src/app/org/team/page.tsx`
- `src/app/org/team/actions.ts`
- `src/app/org/billing/page.tsx`
- `src/app/auth/`
- `src/app/admin/support/`
- `src/components/SignInModal.tsx`
- `src/lib/auth-server.ts`
- `src/lib/auth.ts`
- `src/lib/email.ts`
- `src/lib/evidence-files.ts`
- `src/lib/ngo.ts`
- `src/lib/ngo-permissions.ts`
- `src/lib/ngo-team.ts`
- `src/lib/ngo-evidence-reports.ts`
- `src/lib/ngo-report-exports.ts`
- `src/lib/ngo-billing.ts`
- `src/lib/ngo-stripe.ts`
- `src/lib/ngo-support.ts`
- `src/lib/supabase/`
- `src/lib/ai-evidence-parsing.ts`
- `src/lib/ai-control.ts`

Primary migrations reviewed:
- `supabase/migrations/202605240002_ngo_foundation.sql`
- `supabase/migrations/202605240008_release_3_slice_3_ngo_reports.sql`
- `supabase/migrations/202605240011_ngo_share_grants_slice_2.sql`
- `supabase/migrations/202605240012_ngo_auth_foundation.sql`
- `supabase/migrations/202605240016_ngo_team_management.sql`
- `supabase/migrations/202605240017_ngo_evidence_files_lifecycle.sql`
- `supabase/migrations/202605240018_ngo_invite_email_delivery.sql`
- `supabase/migrations/202605260001_ngo_stripe_billing.sql`
- `supabase/migrations/202605260002_ngo_file_security_scan_status.sql`
- `supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql`

## Verification Performed

Commands run on June 23, 2026:
- `npm test`: passed, 176/176.
- `supabase migration list --linked`: passed; local and remote migrations aligned through `202605260009`.

Relevant current test coverage includes:
- Auth surface routing and sign-in popup context.
- NGO Auth foundation and protected routes.
- Organization switching and stale org handling.
- Team management, invites, role changes, last-owner protection, and removed-member blocking.
- Evidence lifecycle, private file metadata, upload constraints, archive/edit states, and scan/quarantine status.
- Report creation, private report detail, accepted-claim gating, shared report grants, revoked/expired grant blocking, CSV export, and print-ready export.
- Billing entitlement/payment firewall checks, while production Stripe remains excluded.
- Legal/security/accessibility/compliance claim guardrails.
- AI evidence parsing suggestion-only posture and central AI control/provider guardrails.
- Shopping tests also passed, but Shopping is not the subject of this handoff.

No product code, migrations, DNS/domains, Vercel settings, Supabase settings, or Stripe settings were changed during this audit.

## Current NGO Readiness Estimates

Core NGO product workflow completeness: 92-94%.
- Built: account/auth surfaces, onboarding, organization membership, evidence, files, reports, sharing, exports, team, admin/support, legal pages, compliance docs, and tests.
- Not at 100% because real inbox/Auth, browser/mobile walkthroughs, and operational drills are not fully proven.

Supported/private NGO pilot readiness excluding Stripe: 90-93% before real inbox/Auth proof; 95-97% after proof.
- Supported pilot means a small number of known NGOs with founder/operator support, manual monitoring, and clear caveats.
- It can move into the upper range after one complete real account/inbox test, password reset, team invite, NGO onboarding, evidence upload, report, export, share, and mobile/desktop walkthrough.

Broad public self-serve readiness excluding Stripe: 86-90%.
- The product is not far away, but public self-serve should wait for live Auth/email proof, malware scanning or a strict manual upload policy, monitoring/backup/incident drills, and clearer support/correction operations.

Operational readiness: 70-78%.
- Runbooks/checklists exist, but drills and live monitoring evidence are still pending.

Security/file-safety readiness: 72-80% for supported pilot; 55-65% for broad public uploads.
- Private storage, scan status, quarantine language, and clean-only signed URL behavior are built.
- Broad public upload readiness remains lower because a real malware scanner integration is not yet active.

Legal/compliance/accessibility readiness: 65-72%.
- Readiness docs and public posture language exist.
- No external legal/compliance/accessibility review has been completed, and Mishava must not claim SOC 2, ISO 27001, FedRAMP, ADA certification, VPAT/ACR completion, or guaranteed accessibility compliance.

Email/Auth readiness: 80-88% repo-side; 55-65% live-proof until real inbox tests pass.
- App code supports Supabase Auth surfaces and server-side membership protections.
- Live production reliability still depends on Vercel envs, Supabase Auth settings, redirect URLs, Resend/custom SMTP, domain verification, and real inbox tests.

Team/invite readiness: 85-90% app-ready; 65-75% live-proof.
- Invite model, statuses, fallback invite links, resend action, and role changes are built.
- Real delivery and accept-flow proof with separate inboxes are still required.

Report/export/share readiness: 88-93%.
- Core mechanics are built and tested.
- The next confidence gain comes from real browser proof with a real pilot org and a shared-recipient walkthrough.

## Product Workflow Map

Public NGO page:
- Status: built and recently simplified.
- Strength: plain CTA, benefit-first language, visible no-paid-trust posture.
- Risk: still needs real-user readability proof with a lower-reading-comfort NGO partner.

Create account:
- Status: built via shared auth/sign-up surfaces.
- Strength: product-line copy has been improved and tests guard against stale Shopping/NGO auth context.
- Risk: real account creation depends on Supabase Auth email settings and inbox delivery.

Sign in:
- Status: built with shared popup entry points and page-context preservation.
- Strength: users should remain in context instead of being redirected into unrelated product pages.
- Risk: requires live browser regression checks after each deploy because this has been a repeated user-facing issue.

Password reset:
- Status: built.
- Risk: must be verified with a real inbox and correct Supabase redirect URL.

Create NGO/org:
- Status: built in `src/app/ngo/onboarding/actions.ts`; creates organization, membership, NGO profile, current-org cookie, and redirects to `/org/profile`.
- Risk: blocked if Auth confirmation is not configured correctly.

Onboarding:
- Status: built and simplified.
- Strength: now aims the user toward account creation, NGO name/basic details, evidence, and reports.
- Risk: deeper internal copy should stay plain and avoid technical AI/payment language.

Workspace/profile:
- Status: built behind organization membership checks.
- Risk: needs a full live browser walkthrough with a real signed-in user.

Evidence:
- Status: built with evidence creation, lifecycle, file metadata, upload support, archive/edit states, and audit events.
- Risk: broad public upload should wait for scanner integration or a strict manual-review cohort policy.

Reports:
- Status: built with draft reports, accepted-claim gating, private defaults, print-ready view, and CSV export.
- Risk: pilot users need clear guidance that reports are reviewable and may be incomplete.

Sharing:
- Status: built with scoped share grants, recipient metadata, revoked/expired blocking, and limited shared report views.
- Risk: should be tested with a real recipient link before outreach.

Team:
- Status: built with roles, active/inactive memberships, invites, resend support, last-owner protection, and role changes.
- Risk: email delivery and accept-flow still need live proof.

Billing:
- Status: test-mode/foundation exists.
- Scope decision: Stripe/payment is excluded from current NGO pilot readiness. Free/manual support is acceptable.

Support/admin:
- Status: protected read-only support summaries exist.
- Risk: not a full support queue, evidence review queue, or case management system.

Legal/compliance:
- Status: public legal/support/security/accessibility pages and compliance readiness docs exist.
- Risk: no external legal/compliance/accessibility approval; do not overclaim.

## Auth And Email State

Built:
- Supabase-aware server and browser auth utilities.
- Sign-up, sign-in, sign-out, reset, update password, callback routes.
- Shared sign-in modal behavior with page context preservation.
- Middleware protection for `/app`, `/org`, and `/admin`.
- Server-side organization membership validation that does not trust the current-org cookie alone.
- Resend helper that fails soft when email provider env is missing.
- Team invite email template with fallback link behavior.

Still required:
- Vercel env verification without printing secrets.
- Supabase Auth redirect URL review for live domains.
- Supabase Auth custom SMTP/Resend verification.
- Resend domain/DNS verification.
- Real public sign-up test with a real inbox.
- Email confirmation test if confirmation is enabled.
- Password reset test with a real inbox.
- Team invite send/accept test between two real inboxes.

Expected envs for live email/Auth:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `SUPPORT_EMAIL`

Failure behavior:
- If Resend envs are missing, team invite delivery reports `not_configured` and should fall back to a manual invite link.
- If Supabase Auth email/redirect configuration is wrong, public self-serve account confirmation and password reset will be blocked even though repo code is present.

## Organization And Account Model

Built:
- Organizations and organization memberships.
- NGO profile creation tied to the organization.
- Current organization selection.
- Server-side fallback when a user has exactly one active membership.
- Rejection of stale/wrong-org current organization state.
- Role-based permissions through `src/lib/ngo-permissions.ts`.

Roles:
- `ngo_owner`
- `ngo_admin`
- `ngo_member`
- `ngo_viewer`

Role posture:
- Owner/admin can manage org/team/billing-like settings and most write operations.
- Member can contribute evidence/reports within limits.
- Viewer is read-oriented.
- Last-owner protection is implemented.
- Removed/inactive users are blocked from active org access.

Remaining proof:
- Multi-user live walkthrough with owner, invited member, viewer, removed member, and wrong-org attempts.

## Team And Invite Readiness

Built:
- Invite creation.
- Invite resend.
- Invite statuses: `pending`, `accepted`, `revoked`, `expired`.
- Email delivery statuses: `not_configured`, `sent`, `failed`.
- Wrong-email, revoked, expired, and accepted page states.
- Role changes with audit events.
- Last-owner protection.
- Removed-member blocking.

Still needed:
- Real delivery proof through Resend/custom SMTP.
- Real accept-flow proof with separate inboxes.
- Support operator instructions for failed delivery and fallback links.

Pilot risk:
- Manageable for a supported pilot if fallback invite links are used carefully.
- Not ready for broad public self-serve until delivery and support flows are proven.

## Evidence And File Readiness

Built:
- Evidence creation.
- Evidence edit/archive lifecycle.
- Evidence metadata and evidence submissions.
- Private `evidence-files` storage bucket.
- File metadata table.
- Versioned storage paths.
- Allowed file types: PDF, JPEG, PNG, WebP, TXT, CSV, DOCX.
- 10 MB upload cap.
- Scan status fields and manual status update path.
- Clean-only signed URL behavior for active file retrieval.
- Audit events for evidence/file actions.

File safety posture:
- Supported pilot: acceptable if file uploads are limited to known pilot NGOs and manually reviewed.
- Broad public upload: not ready until a real malware scanner or stricter manual gate is active.

Known gaps:
- Real malware scanner integration is not active.
- Backup/restore drill has not been proven.
- Incident process has not been tabletop-tested.
- Public-facing upload guidance should stay conservative.

## Reports, Exports, And Sharing

Built:
- Private report creation.
- Report detail page.
- Evidence attachment to reports.
- Accepted-claim gating.
- Draft/rejected claims excluded from trust summaries.
- Print-ready report view.
- CSV evidence export.
- Raw private file paths excluded from exports and shared views.
- Scoped share grants.
- Revoked/expired grant blocking.
- Shared recipient report view limited to the granted report.
- Audit events for report/share/export activity.

Still needed:
- Full real browser walkthrough: create report, update report, export CSV, print view, create share grant, open recipient link, revoke grant, verify blocked.
- Real partner feedback on whether the report structure is understandable.

Pilot risk:
- Low to moderate for supported pilot.
- Main risk is user misunderstanding of draft/review/incomplete states, not missing mechanics.

## Admin, Support, And Operations

Built:
- Protected admin/support route.
- Support summaries.
- Corrections/support links.
- Read-only support posture that avoids silent trust manipulation.
- Audit event usage across key flows.

Operational docs exist for:
- Live email/Auth verification.
- Final pilot browser/mobile checklist.
- File review and upload safety.
- Backup, monitoring, and incident readiness.

Still needed:
- Real support triage process.
- Correction/dispute queue.
- Evidence review queue.
- Backup/restore drill.
- Incident tabletop.
- Formal access review.
- Production monitoring/logging proof.

Pilot risk:
- Manageable if pilot is supported manually and small.
- Not enough for public self-serve support volume.

## Security, RLS, And Privacy

Built:
- RLS policies across NGO core tables.
- Membership-scoped access patterns.
- Middleware-protected org/admin/app routes.
- Server-side current organization validation.
- Private storage bucket and private signed URL access.
- Service role kept server-side.
- Payment firewall tests.
- AI guardrails that prevent AI authority over trust outcomes.

Known risks:
- Old Supabase security warnings may refer to old project `mishava / tghbfautnxblfxrtkdqb`, which must not be touched in this work.
- Clean V2 project is `mishava-v2-dev / snnscnodegbyqexnopvf`.
- Public broad uploads need malware scanning or strict manual-review policy.
- Security posture should receive an external penetration test before public self-serve.

## Legal, Compliance, And Accessibility

Built:
- Legal/trust/accessibility/security/corrections/support pages.
- Compliance readiness docs for SOC 2, ISO 27001, VPAT/accessibility, privacy/data governance, security gaps, and audit evidence index.
- Tests blocking forbidden compliance claims unless clearly negated or readiness-framed.

Must not claim:
- SOC 2 certified/compliant.
- ISO 27001 certified.
- FedRAMP authorized.
- ADA certified.
- VPAT/ACR complete.
- Guaranteed funder approval.
- Certified NGO trust status.
- AI-verified trust outcomes.

Still needed:
- External legal review.
- Accessibility review.
- Formal VPAT/ACR if needed.
- SOC 2/ISO readiness work and external audits if pursued later.

## Stripe And Payment Exclusion

Built:
- Stripe/test-mode billing foundation.
- Billing account/webhook migration.
- Entitlement model.
- Payment firewall protections.
- Clear no-paid-trust language.

Current decision:
- Stripe/payment is excluded from near-term NGO pilot readiness.
- NGO can proceed as free/manual-supported for pilot.
- Payment must never affect trust, ranking, verification, credibility labels, evidence truth, report conclusions, or methodology outputs.

Remaining payment work:
- Production Stripe dashboard/webhook verification.
- Production billing copy and operational process.
- Paid plan support after the non-Stripe pilot is healthy.

## AI Posture For NGO

Built:
- AI evidence parsing readiness tables and UI posture.
- AI suggestions are private, draft, and suggestion-only.
- Human review is required before suggestions can become structured claims.
- Central AI control foundation with default deny, suggestion-only envelopes, budget/cache/logging hooks, and provider import guardrails.
- No real provider calls are enabled.

Must remain true:
- AI cannot create final trust outcomes.
- AI cannot publish, verify, score, rank, escalate, approve suppliers/sellers, make payment/access decisions, or create legal/compliance conclusions.
- AI failure must not break manual workflows.

Watch item:
- `src/lib/ngo.ts` still contains an onboarding step label around AI parse requests in deeper configuration. Public first-screen copy has been simplified, but future NGO copy passes should keep AI wording restrained and partner-facing.

## Data Model And Migration Inventory

| Area | Tables / objects | Key migration(s) | Status | Risk |
| --- | --- | --- | --- | --- |
| Organizations | `organizations`, `organization_memberships` | base foundation plus `202605240016` | Built | Needs multi-user live proof |
| NGO profile | `ngo_profiles` | `202605240002` | Built | Live onboarding proof needed |
| Team invites | `organization_invites` | `202605240016`, `202605240018` | Built | Real email delivery proof needed |
| Evidence | `evidence_items`, `ngo_evidence_submissions` | `202605240002`, `202605240017` | Built | User clarity/source quality |
| Evidence files | `evidence_files`, `evidence-files` bucket | `202605240017`, `202605260002` | Built | No real malware scanner yet |
| Claims | `structured_claims` | `202605240012`, `202605260003` | Built | Human review discipline required |
| Reports | `ngo_reports`, report evidence/claims metadata | `202605240002`, `202605240008` | Built | Browser/share proof needed |
| Share grants | `ngo_share_grants` | `202605240011` | Built | Recipient/revoke proof needed |
| Billing | `ngo_billing_accounts`, `stripe_webhook_events` | `202605260001` | Foundation | Stripe excluded from pilot |
| AI parsing | `ai_evidence_parse_jobs`, `ai_evidence_suggestions` | `202605260003` | Readiness only | No provider calls enabled |
| Audit | `audit_events` | foundation migrations | Built | Operational review needed |

## Test Coverage Summary

Passed on June 23, 2026:
- `npm test`: 176/176.
- `supabase migration list --linked`: aligned.

Important NGO-related test areas:
- Auth foundations and route protection.
- Organization creation and switching.
- Team management and role permissions.
- Invite email delivery scaffolding.
- Evidence/file lifecycle and scan status.
- Reports, exports, and scoped sharing.
- Billing entitlement guardrails and payment firewall.
- Legal/trust/security/accessibility/compliance language.
- AI suggestion-only and provider guardrails.
- NGO + Shopping pilot readiness language expectations.

Test limitations:
- These are mostly repo/static/unit-style checks.
- They do not replace real inbox delivery, real browser walkthroughs, mobile screenshots, or a live support drill.

## Known Issues And Blockers

Top blockers before unsupported public self-serve:
1. Real live email/Auth proof is not complete.
2. Resend/Supabase custom SMTP/domain setup and real inbox tests are still required.
3. Malware scanner integration is not active for broad public uploads.
4. Backup/restore, monitoring/logging, incident response, and formal access review are documented but not drilled.
5. External legal/accessibility/security/compliance review is not complete.

Top blockers before first supported NGO pilot:
1. Real account sign-up/confirmation and password reset must work on the live domain.
2. Real team invite delivery and accept flow should be tested.
3. Full browser/mobile pilot walkthrough should be completed with screenshots.
4. File upload should be limited to known pilot users with manual-review instructions.
5. Support contact/correction path should be verified end to end.

Non-blocking but important polish:
- Continue plain-language review for low-reading-comfort users.
- Reduce technical copy around AI, credits, internals, and report mechanics.
- Confirm mobile nav does not overpower first actions.
- Keep "reports may be incomplete/reviewable" language clear without making the product feel broken.

## Pilot Readiness Decision

Supported/private pilot excluding Stripe: almost ready, with conditions.

Ready after:
- A real inbox/Auth proof passes.
- A real browser/mobile pilot checklist passes.
- A file upload policy is chosen for the pilot cohort.
- Support/corrections contact path is verified.

Not ready for:
- Broad public self-serve.
- Unrestricted public file upload.
- Production paid NGO subscriptions.
- Compliance/certification claims.
- AI-powered trust claims.

## Recommended Immediate Next Task

Run `NGO Gate 1: Real Inbox/Auth Verification and Supported Pilot Proof`.

Purpose:
- Prove the live account/inbox path works before outreach.
- Confirm the first partner can create an account, confirm email, reset password, create an NGO profile, invite a teammate, upload/list evidence, build a report, export/share, and sign out/in again.

Expected output:
- `docs/ngo-gate-1-live-inbox-auth-supported-pilot-proof-result.md`
- Screenshots of live sign-up, confirmation/password reset, onboarding, org profile, evidence, report, share, team invite, and mobile checks.
- Clear pass/fail recommendation for first supported NGO outreach.

## Suggested Next 5 NGO Tasks

1. NGO Gate 1: Real Inbox/Auth Verification and Supported Pilot Proof.
2. NGO Gate 2: Full Browser/Mobile Pilot Walkthrough With Screenshots.
3. NGO Gate 3: File Upload Safety Pilot Operating Mode.
4. NGO Gate 4: Support/Corrections/Invite Delivery Operator Runbook.
5. NGO Gate 5: Backup/Monitoring/Incident Drill Evidence Capture.

## New-Chat Start Recommendation

Yes, NGO is ready to move into a new focused chat. The new chat should not restart the product build. It should focus on live proof and operational closure for a supported private pilot.

The first new-chat task should be narrow: live inbox/Auth and supported pilot proof. Avoid mixing Shopping, AI, Stripe, public launch, or Vercel/domain cleanup into that thread unless a live verification step directly requires it.
