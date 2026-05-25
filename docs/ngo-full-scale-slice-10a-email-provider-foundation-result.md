# NGO Full-Scale Slice 10A: Email Provider Foundation and Auth Email Readiness Result

## Purpose

Prepare Mishava NGO for production-ready sign-up confirmation and password reset emails using Supabase Auth custom SMTP with Resend.

This slice is foundation/readiness only. It does not implement organization invite email sending, newsletters, bulk email, CRM, notification center, marketing email, production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, or Plus.

## Provider Decision

Mishava should use:

```text
Supabase Auth custom SMTP + Resend
```

for sign-up confirmation and password reset emails.

Postmark remains the first fallback if Resend deliverability, account setup, DNS verification, or operational preference becomes a problem.

Reasoning:

- Slice 9 proved the app auth paths work but public sign-up still hit Supabase email rate limit `429`.
- Supabase documents custom SMTP as the production path for Auth email delivery.
- Resend has a Supabase-focused setup path and a simple transactional-email model.
- Keeping Supabase Auth responsible for sign-up and password reset links avoids custom auth-token handling in the app.

Sources reviewed:

- Supabase custom SMTP: `https://supabase.com/docs/guides/auth/auth-smtp`
- Supabase Auth rate limits: `https://supabase.com/docs/guides/auth/rate-limits`
- Supabase Resend integration: `https://supabase.com/partners/integrations/resend`
- Resend Supabase guide: `https://resend.com/supabase`
- Resend SMTP service details: `https://resend.com/changelog/smtp-service`

## What Was Implemented

Updated `.env.example` with blank, safe placeholders only:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=
SUPPORT_EMAIL=
```

No real secrets were added.

No application email-sending code was added.

No organization invite email sending was implemented yet.

## Required Resend Setup Steps

1. Create or select the Mishava Resend account.
2. Add the sending domain.
3. Add required DNS records for domain verification.
4. Wait for Resend domain verification.
5. Create a production API key.
6. Decide sender identity:
   - example from address: `Mishava <no-reply@your-domain>`;
   - support/reply-to address: `support@your-domain`.
7. Store the API key only in local/deployment secrets.
8. Use Resend SMTP credentials in Supabase Auth dashboard for confirmation/reset emails.
9. Keep Resend API key available for later Slice 10B organization invite email sending.

## Required Domain Verification Steps

Exact DNS records should come from the Resend dashboard for the chosen Mishava domain.

Expected record categories:

- SPF or sender-policy record where required by provider;
- DKIM records;
- DMARC record if not already present;
- any provider-specific verification record;
- bounce/return-path record if provided or recommended.

Before launch, verify delivery to at least:

- Gmail;
- Outlook/Hotmail;
- iCloud;
- one organization/workplace inbox if available.

## Required Supabase Auth Dashboard SMTP Settings

Configure only the clean V2 project:

```text
Project: mishava-v2-dev
Ref: snnscnodegbyqexnopvf
```

Do not modify:

```text
Old project: mishava / tghbfautnxblfxrtkdqb
```

Supabase Auth dashboard settings to configure:

```text
Enable Custom SMTP: on
SMTP host: smtp.resend.com
SMTP port: 465 or 587, based on final Resend/Supabase dashboard compatibility
SMTP username: resend
SMTP password: Resend API key
Sender email: verified Mishava sender address
Sender name: Mishava
```

Port note:

- Resend documents `smtp.resend.com` with username `resend` and API key as password.
- Resend documents SSL ports including `465`.
- If Supabase dashboard validation prefers STARTTLS, test `587`.
- Record final chosen port in the Slice 10B/10 implementation result.

## Required Redirect URL Settings

Supabase Auth settings should include:

```text
Site URL, local dev: http://localhost:3000
Redirect URL, local callback: http://localhost:3000/auth/callback
Redirect URL, local password update: http://localhost:3000/auth/update-password
```

When staging/production domains exist, add:

```text
https://staging-domain/auth/callback
https://staging-domain/auth/update-password
https://production-domain/auth/callback
https://production-domain/auth/update-password
```

Do not invent live staging or production domains before they exist.

## Required Environment Variables

Local and deployment environments should eventually include:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=
SUPPORT_EMAIL=
```

Existing app auth code currently uses `NEXT_PUBLIC_APP_URL` as a redirect base where configured and falls back to `http://localhost:3000`. Slice 10A adds `NEXT_PUBLIC_SITE_URL` as the canonical site URL placeholder for email/dashboard readiness. A later implementation slice may align the app redirect helper to prefer `NEXT_PUBLIC_SITE_URL`.

Security rules:

- do not commit real values;
- do not expose `RESEND_API_KEY` to browser/client code;
- keep `.env.local` ignored;
- set production secrets only in deployment/provider secret storage.

## Local / Development Settings

Recommended local settings after Resend/Supabase dashboards are configured:

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/auth/callback
Password reset redirect: http://localhost:3000/auth/update-password
Email confirmation: enabled for launch-like testing, optional off only during tightly controlled dev troubleshooting
Custom SMTP: enabled once Resend domain/sender is verified
```

For local testing, use real inboxes intentionally and avoid repeated sign-up attempts that trigger provider or Supabase rate limits.

## Production Settings Still Pending

Production cannot be marked complete until:

- production Mishava domain exists;
- sending domain is verified in Resend;
- Supabase production Site URL is set;
- production callback/update-password redirect URLs are configured;
- production SMTP credentials are configured;
- production sender/reply-to addresses are confirmed;
- public sign-up confirmation passes with a real inbox;
- password reset/update passes from a real inbox link.

## Auth Email Template Source Of Truth

These are plain-language template drafts for Supabase Auth email templates. They should be pasted/adapted in the Supabase dashboard once custom SMTP is configured.

### Confirm Signup

Subject:

```text
Confirm your Mishava account
```

Body draft:

```text
Hello,

You created a Mishava account. Please confirm this email address to finish setting up access.

Confirm your account:
{{ .ConfirmationURL }}

If you did not create this account, you can ignore this email.

Need help? Contact {{ SUPPORT_EMAIL }}.

Mishava
```

Notes:

- Use the Supabase confirmation variable supported by the dashboard template.
- Do not include marketing claims.
- Do not include trust-score, funding, certification, or outcome promises.

### Reset Password

Subject:

```text
Reset your Mishava password
```

Body draft:

```text
Hello,

We received a request to reset your Mishava password.

Reset your password:
{{ .ConfirmationURL }}

If you did not request this reset, you can ignore this email. Your password will not change unless you use the reset link.

Need help? Contact {{ SUPPORT_EMAIL }}.

Mishava
```

Notes:

- Use the Supabase recovery/reset variable supported by the dashboard template.
- The link should route to `/auth/update-password`.
- Keep the message security-focused and restrained.

## Dashboard Configuration Checklist

Before auth email can be marked configured, confirm:

- Resend account exists.
- Resend sender domain is verified.
- Resend SMTP/API credential exists.
- Supabase custom SMTP is enabled for `mishava-v2-dev`.
- SMTP host is set to `smtp.resend.com`.
- SMTP username is set to `resend`.
- SMTP password is the Resend API key.
- Sender email uses a verified Mishava sender.
- Sender name is `Mishava`.
- Site URL is set to the current app URL.
- Redirect URLs include `/auth/callback`.
- Redirect URLs include `/auth/update-password`.
- Email confirmation setting is deliberately chosen.
- Password reset redirect is confirmed.
- Template copy is reviewed and pasted into Supabase.
- Rate-limit behavior is retested after custom SMTP is active.

## Auth Retest Checklist

After Resend and Supabase dashboard configuration:

1. Start app locally or deploy to staging.
2. Create a new public user through `/auth/sign-up`.
3. Confirm email arrives in a real inbox.
4. Click confirmation link.
5. Confirm the app reaches `/auth/callback` and then a safe signed-in/signed-out state.
6. Sign in through `/auth/sign-in`.
7. Confirm `/app` is accessible.
8. Request password reset through `/auth/reset-password`.
9. Confirm reset email arrives in a real inbox.
10. Click reset link.
11. Confirm app reaches `/auth/update-password`.
12. Update password.
13. Sign in with the new password.
14. Confirm no secrets are visible in browser HTML, logs, or committed files.

## Tests / Checks Run

Run for this slice:

```bash
npm test
npm run lint
npm run build
```

Additional safety checks:

- `.env.example` contains blank placeholders only.
- `.env.local` remains ignored.
- no real `RESEND_API_KEY` is committed.
- no old Supabase project changes were made.

## Known Limitations

- Auth email is prepared, not fully configured.
- Resend dashboard setup has not been performed by this commit.
- Supabase custom SMTP dashboard setup has not been performed by this commit.
- Public sign-up confirmation still needs a real inbox retest after dashboard setup.
- Password reset link still needs a real inbox retest after dashboard setup.
- Invite email delivery is intentionally not implemented in Slice 10A.
- `NEXT_PUBLIC_SITE_URL` is documented as the canonical email/site URL placeholder, but app auth redirect code still currently reads `NEXT_PUBLIC_APP_URL` where configured.

## Final Status

Slice 10A is **prepared but not live-configured**.

Mishava now has:

- documented Resend provider decision;
- safe environment placeholders;
- Supabase custom SMTP dashboard checklist;
- redirect URL checklist;
- confirm-signup template draft;
- reset-password template draft;
- auth retest checklist.

Mishava does not yet have:

- live Resend domain verification;
- live Supabase custom SMTP setup;
- confirmed public sign-up email delivery;
- confirmed inbox-based password reset;
- production invite email delivery.

## Scope Confirmation

No organization invite email sending was implemented.

No production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, newsletters, bulk email, CRM, notification center, or marketing email was added.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not modified.
