# Mishava NGO New-Chat Brief

Date: June 23, 2026

Use this brief to start a focused new chat for Mishava NGO without carrying the full historical thread.

## Current Setup

Clean repo:
- GitHub: `Mishava2013/mishava-v2`
- Local path: `/Users/caitlinferguson/Documents/Mishava V2.0`

Clean deployment target:
- Vercel project: `mishava-v2`

Clean Supabase target:
- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Do not touch:
- `dsuupr-am`
- Old Supabase project `mishava / tghbfautnxblfxrtkdqb`

## NGO Status

Mishava NGO is close to a supported/private pilot, excluding Stripe/payment.

Current estimates:
- Core NGO product workflow completeness: 92-94%.
- Supported/private NGO pilot readiness, excluding Stripe: 90-93% before live inbox/Auth proof; 95-97% after proof.
- Broad public self-serve readiness, excluding Stripe: 86-90%.
- Operational readiness: 70-78%.
- Security/file-safety readiness: 72-80% for supported pilot; 55-65% for broad public uploads.
- Legal/compliance/accessibility readiness: 65-72%.

Latest verification:
- `npm test`: passed 176/176 on June 23, 2026.
- `supabase migration list --linked`: passed; local and remote migrations aligned through `202605260009`.

## What Is Built

Built NGO foundations:
- Public NGO landing page.
- Shared sign-in popup and product-aware sign-up copy.
- Supabase Auth-aware sign-up, sign-in, sign-out, reset, update, and callback routes.
- NGO onboarding and organization creation.
- Current organization selection and stale/wrong-org protection.
- Role-based permissions for owner/admin/member/viewer.
- Team invites, resend, revoke/expired/accepted states, role changes, last-owner protection.
- Evidence library, evidence creation/edit/archive lifecycle.
- Private evidence file metadata and storage bucket.
- File type/size validation and scan/quarantine status.
- Report creation, private report detail, accepted-claim gating, print-ready export, CSV export.
- Scoped report sharing and revoked/expired grant blocking.
- Protected support/admin summary surfaces.
- Legal/trust/security/accessibility/corrections/support pages.
- Compliance readiness docs.
- AI evidence parsing readiness with suggestion-only posture.
- Central AI control foundation and provider import guardrails.
- Payment firewall protections.

## What Is Still Missing

Highest-priority missing proof:
- Real live account sign-up with inbox confirmation.
- Real password reset with inbox confirmation.
- Resend/custom SMTP and Supabase Auth email setup verified in production.
- Real team invite email delivery and accept flow.
- Full desktop/mobile browser walkthrough with screenshots.

Operational gaps:
- Malware scanner integration is not active for broad public uploads.
- Backup/restore drill not proven.
- Incident response drill not proven.
- Monitoring/logging evidence not captured.
- Formal access review not completed.
- External legal/accessibility/security/compliance review not completed.

Launch limitation:
- NGO is not ready for unsupported public self-serve.
- NGO can become ready for a supported private pilot once live inbox/Auth proof and one full browser/mobile walkthrough pass.

## Product Boundaries

Do not add or claim:
- Stripe/payment production readiness.
- SOC 2 compliance/certification.
- ISO 27001 certification.
- FedRAMP authorization.
- ADA certification.
- VPAT/ACR completion.
- Guaranteed funder approval.
- AI-verified trust outcomes.
- Public final trust scores from AI.
- Paid trust outcomes.

Payment rule:
- Payment can unlock tools/capacity later, but cannot affect trust, ranking, verification, credibility labels, evidence truth, report conclusions, or methodology outputs.

AI rule:
- AI must stay suggestion-only with human review. No provider calls should be enabled unless a later task explicitly authorizes a guarded adapter.

## Recommended First New-Chat Task

Start with `NGO Gate 1: Real Inbox/Auth Verification and Supported Pilot Proof`.

Purpose:
- Confirm the live NGO account and email path works before outreach.
- Avoid adding features until the existing flow is proven.

Suggested task prompt:

```text
Run NGO Gate 1: Real Inbox/Auth Verification and Supported Pilot Proof.

Source of truth:
- docs/chat-handoffs/mishava-ngo-deep-current-state-audit.md
- docs/chat-handoffs/mishava-ngo-new-chat-brief.md
- docs/operations/ngo-live-email-auth-verification-checklist.md
- docs/operations/ngo-final-pilot-browser-mobile-checklist.md

Scope:
Live NGO email/Auth and supported-pilot proof only.

Do not add features.
Do not add migrations.
Do not change DNS/domains.
Do not change Vercel settings unless explicitly asked.
Do not change Supabase settings unless explicitly asked.
Do not touch dsuupr-am.
Do not touch old Supabase.
Do not enable Stripe/payment.
Do not enable AI provider calls.

Verify:
1. Required Vercel env names are SET/MISSING only; do not print values.
2. Supabase Auth redirect/custom SMTP checklist status.
3. Resend domain/from-email checklist status.
4. Public NGO sign-up with a real inbox.
5. Email confirmation, if enabled.
6. Sign-in popup return path.
7. Password reset with a real inbox.
8. NGO onboarding creates org/profile and lands on the next obvious task.
9. Team invite sends or safely falls back, then accepts with a second test inbox.
10. Sign-out and sign-in again.

Run:
- npm test
- node --test scripts/ngo-*.test.mjs scripts/auth-surface-routing.test.mjs
- supabase migration list --linked

Create:
docs/ngo-gate-1-live-inbox-auth-supported-pilot-proof-result.md

Include:
- pass/fail for each live Auth/email step
- screenshots captured
- exact remaining blockers
- whether first supported NGO outreach can begin
- confirmation no features/migrations/DNS/domains/Stripe/AI provider calls were added
- confirmation dsuupr-am and old Supabase were untouched

Commit only the result doc and any tiny documentation correction if required.
```

## Suggested Next NGO Sequence

1. NGO Gate 1: Real Inbox/Auth Verification and Supported Pilot Proof.
2. NGO Gate 2: Full Desktop/Mobile Pilot Browser Walkthrough.
3. NGO Gate 3: File Upload Safety Pilot Operating Mode.
4. NGO Gate 4: Support/Corrections/Invite Delivery Operator Runbook.
5. NGO Gate 5: Backup/Monitoring/Incident Drill Evidence Capture.

## Working Notes For The Next Chat

The next chat should stay focused. Mishava NGO is not blocked by lack of product surface as much as it is blocked by live proof and operations.

Best posture:
- Treat NGO as a supported pilot candidate.
- Prove real account/email/invite flows first.
- Keep copy plain and low-reading-load.
- Keep upload safety conservative.
- Do not mix in Shopping, Stripe, AI provider adapters, or broad public launch work until the gate result says NGO outreach is safe.
