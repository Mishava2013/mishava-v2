# NGO Full-Scale Completion Roadmap

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-8-admin-support-result.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`
- `docs/ngo-full-scale-slice-6-billing-entitlements-result.md`
- `docs/ngo-full-scale-slice-5-report-output-result.md`
- `docs/ngo-full-scale-slice-4-evidence-files-result.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`
- `docs/ngo-full-scale-slice-2-org-switching-result.md`
- `docs/ngo-full-scale-slice-1b-browser-auth-retest-result.md`

## Goal

Define the remaining NGO full-scale completion slices before returning to the broader Mishava roadmap.

The target is **NGO full-scale self-serve readiness**, not merely limited pilot readiness.

Full-scale self-serve readiness means an NGO can sign up, create or join an organization, manage team access, manage evidence, produce/share/export reports, understand plan limits, resolve common account/support problems, and trust the legal/privacy/security/accessibility posture without founder/manual intervention for ordinary workflows.

## Hard Rules

- Do not claim SOC 2, ISO, FedRAMP, ADA, VPAT, accessibility certification, or any other formal compliance/certification status unless the correct external process has actually been completed.
- Payment must never affect score, ranking, verification, credibility labels, methodology outputs, evidence truth, or report trust conclusions.
- AI must not create final accepted claims or trust outcomes without human review.
- Raw evidence files stay private by default.
- Admin/support tools must not silently alter trust outcomes.
- The old `mishava / tghbfautnxblfxrtkdqb` Supabase project must not be modified for V2 work.

## Ordered Slice Roadmap

| Slice | Name | Launch requirement | Risk |
| --- | --- | --- | --- |
| 9 | Final Auth / Email / Invite Smoke Pass | Required before full-scale launch | Critical |
| 10 | Real Email Provider and Invite Polish | Required before full-scale launch | Critical |
| 11 | Advanced Role-Change UI and Custom Permissions Foundation | Required in basic form before launch; advanced custom roles can wait | High |
| 12 | Production Stripe Checkout and Webhooks | Required before paid self-serve launch; can wait only if launch is free/manual billing | Critical |
| 13 | Server-Generated Report Exports | Required before full-scale NGO value promise if export is marketed | High |
| 14 | Malware Scanning and File Security Hardening | Required before broad file-upload launch | Critical |
| 15 | AI Evidence Parsing Readiness | Can wait until after launch unless AI is marketed | High |
| 16 | SOC 2 / ISO / VPAT / Formal Compliance Readiness | Readiness checklist required before institutional sales; certification can wait | High |
| 17 | Final NGO Full-Scale Launch Audit | Required before launch | Critical |

## Slice 9: Final Auth / Email / Invite Smoke Pass

### Purpose

Verify the real browser/auth paths that still have open caveats from Slice 1B, especially public sign-up, password reset, invite acceptance, session clearing, wrong-org blocking, and admin/support access.

### Required Features / Checks

- Public sign-up verification.
- Email confirmation behavior verification if enabled.
- Password reset request verification.
- Update-password flow verification from a real reset link.
- Auth dashboard settings confirmation:
  - Site URL;
  - allowed redirect URLs;
  - `/auth/callback`;
  - `/auth/update-password`;
  - local/staging/production placeholders.
- Invite acceptance with real browser users.
- Real email provider decision recorded or explicitly deferred to Slice 10.
- Sign-out/session clearing.
- Wrong-org blocking.
- Removed/suspended membership blocking.
- Non-admin blocking from `/admin/*`.
- Admin/support access verification for `/admin/support`.

### Security / Privacy Requirements

- Auth cookies must not grant org access without server-side membership checks.
- Current org cookie must remain convenience state only.
- Invites must require authenticated email match.
- Non-admin and non-support users must not access admin/support routes.
- Session clearing must clear current org state.

### Audit Logging Requirements

- No new audit logging required for normal sign-in/sign-out.
- Invite acceptance must continue to write audit events.
- Any new support/admin auth override must be explicitly out of scope unless separately planned.

### Tests Required

- Public sign-up succeeds or documented dashboard/rate-limit blocker remains.
- Password reset succeeds or documented dashboard/rate-limit blocker remains.
- Real invite acceptance succeeds for matching email.
- Wrong email cannot accept invite.
- Sign-out blocks `/org/evidence`.
- Wrong-org access remains blocked.
- Non-admin blocked from `/admin/support`.
- Admin/support can access `/admin/support`.
- Existing auth/org/evidence/report/share/team tests still pass.
- `npm test`, `npm run lint`, `npm run build`.

### Non-Goals

- Real email provider implementation.
- MFA enforcement.
- SSO.
- Advanced team roles.
- Billing.
- File/security hardening.

### Acceptance Criteria

- Browser auth is verified enough for self-serve testing.
- Remaining rate-limit/dashboard blockers are explicitly documented with owner/action.
- Invite acceptance works with real signed-in browser users.
- Wrong-org and non-admin protections still pass.

### Launch Requirement

Required before NGO full-scale launch.

## Slice 10: Real Email Provider And Invite Polish

### Purpose

Make the email-dependent account and invite workflows production-credible without marketing-heavy language.

### Required Features

- Choose launch email path:
  - Supabase email if sufficient; or
  - dedicated provider such as Resend/Postmark/SendGrid if needed.
- Invite email template.
- Password reset email template.
- Email confirmation template if enabled.
- Support/correction email routing.
- Resend invite.
- Expired invite messaging.
- Revoked invite messaging.
- Bounced/failed email handling if feasible.
- Clear sender identity and reply/support routing.
- No marketing-heavy language.

### Security / Privacy Requirements

- Invite links alone must not grant access.
- Authenticated recipient email must match invite email.
- Email templates must not expose private org data beyond necessary context.
- Support/correction routing must avoid sending sensitive evidence by email.

### Audit Logging Requirements

- Invite created already logs.
- Invite accepted already logs.
- Invite revoked already logs.
- Resend invite should log `team.invite_resent`.
- Expired/revoked handling should preserve current invite state.

### Tests Required

- Invite email payload/template contains correct link and limited org context.
- Resend invite works only for owner/admin.
- Non-admin cannot resend invites.
- Expired invite messaging renders.
- Revoked invite messaging renders.
- Wrong email still cannot accept invite.
- Password reset route does not expose secrets.
- Build/lint/test pass.

### Non-Goals

- Full CRM.
- Marketing campaigns.
- Newsletter tooling.
- SSO/MFA.

### Acceptance Criteria

- NGO owners/admins can invite real users without founder/manual copy-paste.
- Email language is clear, trustworthy, and restrained.
- Failed/expired/revoked invite states are understandable.

### Launch Requirement

Required before NGO full-scale launch.

## Slice 11: Advanced Role-Change UI And Custom Permissions Foundation

### Purpose

Complete practical team management for self-serve NGOs while avoiding premature enterprise custom-role complexity.

### Required Features

- Role-change UI for:
  - owner;
  - admin;
  - member;
  - viewer.
- Last-owner protection.
- Suspended/removed status handling.
- Removed users lose access immediately.
- Stale current-org selection is rejected.
- Basic permission explanation in team UI.
- Future custom permissions model documented in code/docs but not overbuilt.

### Security / Privacy Requirements

- Role changes must be server-side.
- Viewer/member cannot manage team.
- Owner/admin can manage team according to current permission model.
- Last owner cannot be demoted/removed.
- Current org cookie cannot grant access after removal.

### Audit Logging Requirements

- `team.member_role_changed`.
- `team.member_suspended` if suspension is implemented.
- `team.member_reactivated` if reactivation is implemented.
- Existing member removal and invite events continue.

### Tests Required

- Owner/admin can change role.
- Member/viewer cannot change role.
- Last owner cannot be demoted or removed.
- Removed/suspended user loses access.
- Role change changes permissions.
- Audit events written for role changes.
- Existing team/evidence/report/share tests pass.
- Build/lint/test pass.

### Non-Goals

- Full enterprise custom roles.
- SSO.
- SCIM.
- Seat billing.

### Acceptance Criteria

- A normal NGO can manage team roles safely without founder help.
- Custom permissions are planned but not overbuilt.
- Role changes cannot bypass server-side authorization.

### Launch Requirement

Basic role-change UI is required before full-scale launch. Advanced custom permissions can wait.

## Slice 12: Production Stripe Checkout And Webhooks

### Purpose

Move NGO billing from plan/entitlement readiness to production-capable paid self-serve billing while preserving the payment firewall.

### Required Features

- Stripe test-mode to production-ready path.
- NGO plan products/prices:
  - Free;
  - Grassroots;
  - Growth;
  - Trust Pro;
  - Network/custom contact path.
- Monthly/annual plan support.
- Setup service payments:
  - Basic Assisted Setup;
  - Guided Evidence Setup;
  - Full Trust Profile Buildout;
  - Network Setup custom.
- Checkout session creation.
- Customer/org mapping.
- Subscription mapping.
- Webhook handling.
- Plan status sync.
- Entitlement updates.
- Failed payment behavior.
- Downgrade behavior that does not delete data or block reads.
- No raw card storage.
- Production env/secrets checklist.

### Security / Privacy Requirements

- Stripe secrets server-side only.
- Stripe webhook signature verification.
- No raw card storage in Mishava.
- Billing state cannot affect scores/ranking/trust outcomes.
- Free path must not require Stripe.
- Downgrade must not delete existing evidence/reports.

### Audit Logging Requirements

- `billing.checkout_started`.
- `billing.plan_selected`.
- `billing.plan_changed`.
- `billing.webhook_processed`.
- `billing.payment_failed`.
- `billing.downgrade_scheduled` if implemented.
- `setup_service.requested` or `setup_service.purchased`.

### Tests Required

- Free plan works without Stripe.
- Checkout session creation requires authorized org owner/admin.
- Webhook signature verification required.
- Subscription status maps to plan/entitlements.
- Failed payment does not delete data.
- Downgrade preserves read access.
- Payment firewall tests still pass.
- No Stripe secrets exposed in client code.
- Build/lint/test pass.

### Non-Goals

- Consumer Plus billing.
- Tax automation beyond Stripe-supported basics unless required.
- Refund automation.
- Full accounting/invoicing automation.
- Shopping monetization.

### Acceptance Criteria

- NGO paid self-serve billing can run in Stripe test mode and has a clear production switch checklist.
- Payment cannot influence trust outcomes.
- No raw card data touches Mishava.

### Launch Requirement

Required before paid NGO full-scale launch. Can wait only if NGO launch is free/manual-billing only.

## Slice 13: Server-Generated Report Exports

### Purpose

Give NGOs durable, shareable, and audit-friendly report outputs beyond browser print.

### Required Features

- PDF export.
- CSV evidence summary export.
- DOCX export if feasible.
- Export action/route.
- Export audit events.
- Generated/exported date.
- Organization name and report title.
- Disclaimers included.
- Raw files excluded by default.
- Archived evidence labeled if included.
- Shared recipient-safe output.
- Accessible export structure where feasible.

### Security / Privacy Requirements

- Private reports remain private.
- Export route requires org membership or valid grant path.
- Export must not expose raw private files by default.
- Export must not include unrelated org data.
- Share-recipient exports must be limited to the granted report if implemented.

### Audit Logging Requirements

- `ngo_report.export_generated`.
- Include report id, format, actor, organization id, and grant id if applicable.

### Tests Required

- NGO member can generate allowed export.
- Non-member cannot export private report.
- Export excludes raw private files by default.
- Export includes disclaimers and generated date.
- Archived evidence is labeled.
- Rejected/draft claims excluded from trust summary.
- Shared recipient export is limited if implemented.
- Build/lint/test pass.

### Non-Goals

- AI report writing.
- Public report library.
- Full design-perfect print/PDF certification.
- Raw evidence bundle export.

### Acceptance Criteria

- NGOs can produce at least one durable server-generated report output.
- Export is private, traceable, and audit-logged.

### Launch Requirement

Required before full-scale launch if Mishava markets NGO reporting/export as a core paid/self-serve value. Could wait briefly after launch only if browser print is explicitly accepted as the first output.

## Slice 14: Malware Scanning And File Security Hardening

### Purpose

Harden evidence file uploads before broad external file-upload use.

### Required Features

- Upload security review.
- File type validation review.
- File size enforcement review.
- Private bucket confirmation.
- Signed URL access review.
- Malware scanning provider/options.
- Quarantine/reject workflow.
- Scan status field if needed.
- Admin/support visibility for scan status.
- Clear user-facing errors for rejected/quarantined files.
- Review whether current file metadata needs migration.

### Security / Privacy Requirements

- Raw evidence files stay private.
- Suspicious files are not served or shared.
- Signed URLs must be short-lived and authorized.
- Service-role storage access remains server-side only.
- No raw file preview in support by default.

### Audit Logging Requirements

- `evidence_file.scan_started` if asynchronous.
- `evidence_file.scan_passed`.
- `evidence_file.scan_failed`.
- `evidence_file.quarantined`.
- `evidence_file.accessed` if signed URL access is added/logged.

### Tests Required

- Unsupported file types rejected.
- Oversized files rejected.
- Private bucket remains private.
- Signed URL requires membership if implemented.
- Failed scan blocks access.
- Quarantine status visible to authorized users.
- Raw files not publicly readable.
- Build/lint/test pass.

### Non-Goals

- OCR.
- AI parsing.
- Public evidence library.
- Raw evidence sharing.

### Acceptance Criteria

- File upload path is safe enough for broad NGO self-serve use.
- Malware/quarantine behavior is defined and test-covered.

### Launch Requirement

Required before broad self-serve file upload launch.

## Slice 15: AI Evidence Parsing Readiness

### Purpose

Prepare AI-assisted evidence parsing without allowing AI to fabricate facts, accepted claims, or trust outcomes.

### Required Features

- AI evidence parsing plan.
- Human review required before accepted claims.
- AI cannot create final trust outcomes by itself.
- Prompt/model/version tracking.
- Input/output logging.
- Confidence status.
- Privacy/vendor disclosure.
- Sensitive-evidence handling.
- Opt-out or no-AI path if needed.
- AI cost controls.
- AI usage ledger wiring if used.
- No AI scoring automation unless explicitly approved.

### Security / Privacy Requirements

- AI vendor data-sharing reviewed before use.
- Sensitive raw files should not be sent to AI without policy/consent.
- Logs must avoid unnecessary secret/private data exposure.
- Human reviewer must approve accepted claims.

### Audit Logging Requirements

- `ai.evidence_parse_requested`.
- `ai.evidence_parse_completed`.
- `structured_claim.ai_draft_created`.
- Human review events for accepted/rejected claims.

### Tests Required

- AI drafts cannot become accepted claims without human review.
- AI output cannot create final score/trust outcome.
- Model/prompt/version metadata recorded.
- AI cost/usage event recorded.
- Sensitive evidence handling path tested if implemented.
- Payment firewall tests still pass.
- Build/lint/test pass.

### Non-Goals

- AI scoring automation.
- Autonomous adverse findings.
- Public AI-generated trust claims.
- AI support bot.

### Acceptance Criteria

- AI can assist evidence parsing only as draft support.
- Human review remains mandatory for accepted claims and trust-relevant outputs.

### Launch Requirement

Can wait until after launch unless AI evidence parsing is marketed or required for operational scale at launch.

## Slice 16: SOC 2 / ISO / VPAT / Formal Compliance Readiness

### Purpose

Create readiness materials for future institutional trust without claiming certification prematurely.

### Required Features

- Readiness checklist only, not certification claim.
- SOC 2 readiness controls.
- ISO 27001 readiness mapping.
- VPAT/ACR preparation checklist.
- WCAG 2.2 AA target checklist.
- Section 508 readiness notes.
- Security policy gaps.
- Incident response plan draft.
- Access review plan.
- Vendor/subprocessor list.
- Data retention/deletion policy gaps.
- Evidence needed for future audit.
- Public claims language guardrail.

### Security / Privacy Requirements

- Do not publish certification claims unless completed externally.
- Formalize access review and incident response.
- Track subprocessors and AI vendors.
- Keep evidence for future audit separate from marketing claims.

### Audit Logging Requirements

- No product audit logging required unless new admin/security controls are implemented.
- Readiness work should define evidence artifacts needed for future external audit.

### Tests Required

- Documentation exists.
- Public pages do not claim SOC 2/ISO/FedRAMP/VPAT completion.
- Accessibility statement still uses target/readiness language.
- Security page still uses accurate limitation language.
- Build/lint/test pass if code/docs tests are updated.

### Non-Goals

- Actual SOC 2 audit.
- Actual ISO certification.
- Actual FedRAMP authorization.
- Final VPAT/ACR.
- External accessibility audit.

### Acceptance Criteria

- Mishava has a clear compliance readiness map and no premature claims.
- Institutional buyers can see a credible roadmap without being misled.

### Launch Requirement

Readiness checklist and accurate public language are required before institutional sales. Formal certifications can wait.

## Slice 17: Final NGO Full-Scale Launch Audit

### Purpose

Perform the go/no-go audit for NGO full-scale self-serve readiness.

### Required Features / Checks

Full workflow test:

1. Sign up.
2. Confirm email if enabled.
3. Sign in.
4. Create NGO organization.
5. Switch organization.
6. Invite team.
7. Accept invite as real user.
8. Change role if implemented.
9. Upload evidence.
10. Edit evidence.
11. Archive evidence.
12. Create structured claim draft.
13. Create report.
14. Export report.
15. Share report.
16. Revoke share.
17. Billing plan path.
18. Support/legal/correction pages.
19. Admin/support read-only dashboard.
20. Sign out/session clearing.

Additional review:

- Mobile review.
- Accessibility smoke review.
- Security/privacy review.
- Raw file privacy review.
- Payment firewall review.
- AI guardrail review if AI is present.
- Final blocker list.
- Go/no-go recommendation.

### Security / Privacy Requirements

- No wrong-org data access.
- No raw file public access.
- No non-admin admin access.
- No payment influence on trust outcomes.
- No AI final trust outcomes without human review if AI exists.
- No direct support score/evidence override.

### Audit Logging Requirements

- Confirm expected audit events exist for onboarding, evidence, file upload, evidence edit/archive, report create/update/export/share/revoke, team invite/accept/revoke/role changes, billing events, and support actions where implemented.

### Tests Required

- Full automated suite.
- Manual browser smoke path.
- RLS checks where relevant.
- Mobile viewport check.
- Accessibility smoke check.
- Build/lint/test pass.
- Live V2 Supabase verification if launch target uses live Supabase.

### Non-Goals

- New feature implementation.
- Broad refactors.
- New product surfaces.

### Acceptance Criteria

- Clear launch rating:
  - go;
  - go with constraints;
  - no-go.
- Final blocker list is classified:
  - must fix before launch;
  - can fix during launch window;
  - post-launch.
- No unresolved critical security/privacy/trust blockers.

### Launch Requirement

Required before NGO full-scale launch.

## Must-Have Before NGO Full-Scale Launch

- Slice 9: Final auth/email/invite smoke pass.
- Slice 10: Real email provider and invite polish.
- Slice 11: Basic role-change UI and status handling.
- Slice 12: Production Stripe Checkout and Webhooks if paid self-serve launch is included.
- Slice 13: Server-generated report exports if exports are part of launch promise.
- Slice 14: Malware scanning and file security hardening before broad file upload.
- Slice 16 readiness checklist and accurate public compliance language.
- Slice 17 final launch audit.

## Can Wait Until Shortly After Launch

- Advanced custom permissions beyond owner/admin/member/viewer.
- DOCX export if PDF/CSV are enough for launch.
- AI evidence parsing, unless marketed at launch.
- Full SOC 2 / ISO / FedRAMP certification.
- Final VPAT/ACR and external accessibility audit, unless required by a specific launch customer.
- Full CRM/ticketing integration.
- AI support bot.
- Advanced analytics.
- SSO/SCIM, unless launch customers require it.

## Highest-Risk Items

1. Auth/email reliability: public sign-up and password reset were previously blocked by Supabase rate limiting.
2. Email invites: current invite flow still depends on dev-safe invite links, not production email delivery.
3. Production billing: Stripe Checkout/webhooks are not implemented yet, and payment firewall must remain intact.
4. File security: malware scanning and quarantine are not implemented yet.
5. Report exports: server-generated export/audit path is not implemented yet.
6. Support/admin actions: dashboard is read-only; future mutations must be audited and carefully permissioned.
7. Legal/compliance: current pages are baseline drafts and need attorney/specialist review.
8. Accessibility: baseline exists, but full manual/mobile/screen-reader/export QA remains.
9. AI: must remain out of accepted claims/trust outcomes until human-reviewed governance is implemented.
10. Launch audit: full self-serve workflow has not yet been tested end-to-end after all remaining slices.

## Recommended Next Implementation Slice

Implement **Slice 9: Final Auth / Email / Invite Smoke Pass** next.

Reason:

- It is the current highest-risk full-scale blocker.
- It verifies whether the existing Supabase Auth foundation is actually ready for self-serve users.
- It determines how much work Slice 10 needs for real email delivery and invite polish.
- It protects the rest of the launch plan from building on an unresolved account-access gap.

Recommended Slice 9 output:

- result document with browser-auth pass/fail details;
- dashboard setting confirmation;
- exact remaining email/auth blockers;
- no product-surface expansion;
- no unrelated feature work.
