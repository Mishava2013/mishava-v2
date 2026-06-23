# Mishava NGO Chat Handoff

Date: 2026-06-23

## Current Status

Mishava NGO is close to supported/private pilot readiness. The product loop is built and the public NGO page/onboarding copy has been simplified for outreach. The remaining work is mostly operational proof: real inbox Auth, invite email, browser/mobile walkthrough, file upload policy, and ops readiness.

## Percent Estimate

- Supported/private pilot readiness: **95-97% excluding Stripe**, after real inbox/Auth proof.
- Broad public self-serve readiness: **86-90%**.

## What Is Built

- NGO landing page, sign-up page, sign-in popup, onboarding.
- Organization creation, current org selection, org switching.
- Team invites, role changes, revoked/expired invite handling, last-owner protection.
- Evidence creation, edit, archive, file metadata, scan/quarantine status foundation.
- Reports, previews, CSV export, print-ready report route, scoped sharing, revoke/expire handling.
- Protected admin/support summaries.
- Legal/security/accessibility/compliance readiness pages.

## What Is Live

- `https://ngo.mishava.org`
- Recent copy updates are live:
  - `Create your account and NGO profile`
  - `Create your free account first`
  - simplified partner-facing reports language.

## What Is Planned Only

- Production Stripe charging.
- Real malware scanner integration.
- Full automated operational monitoring.
- External legal/accessibility/security review.

## What Is Blocked

- Real inbox sign-up/password reset/invite proof.
- Supabase/Resend/Vercel external email setup verification.
- Final browser/mobile pilot smoke with real account.

## What Must Not Be Touched

- Shopping feature work.
- `dsuupr-am`.
- Old Supabase `tghbfautnxblfxrtkdqb`.
- Stripe production charging unless explicitly scoped.

## Key Guardrails

- No paid trust outcomes.
- No fake evidence.
- No public certification claims.
- AI remains suggestion-only.
- Raw files stay private by default.
- File upload broad launch needs scanner or manual-review policy.

## Recommended First 3 Tasks

1. Run `docs/operations/ngo-live-email-auth-verification-checklist.md`.
2. Run `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`.
3. Decide supported-pilot file upload policy before inviting broader users.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/ngo-near-100-non-stripe-readiness-result.md`
- `docs/ngo-full-scale-slice-17-final-launch-audit.md`
- `docs/ngo-live-email-auth-closure-result.md`
- `docs/operations/ngo-live-email-auth-verification-checklist.md`
- `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`

## Suggested Opening Message

```text
We are starting the Mishava NGO focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-ngo-chat-handoff.md as source of truth. Focus only on closing NGO supported-pilot readiness: real inbox Auth/email verification, onboarding browser/mobile proof, file upload policy, and operational readiness. Do not add Shopping, Business, scoring, Stripe production charging, AI provider behavior, DNS changes, or old Supabase work.
```

