# NGO Live Email And Auth Verification Checklist

Use this checklist before inviting external NGO users who need self-serve account access.

Current repo-side status as of 2026-06-16: live email/Auth code readiness is documented in `docs/ngo-live-email-auth-closure-result.md`. This checklist is for the remaining external Vercel/Supabase/Resend setup and real-inbox verification.

## Scope

This checklist verifies live email and auth for the clean Mishava V2 project. It does not change app code, billing, DNS, or Supabase migrations.

Clean V2 Supabase project:

- `mishava-v2-dev / snnscnodegbyqexnopvf`

Old Supabase project must remain untouched:

- `mishava / tghbfautnxblfxrtkdqb`

## Required Environment Variables

Confirm these are set in the intended deployment environment without printing secret values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `SUPPORT_EMAIL`

Report each as:

- `SET`
- `MISSING`
- `NEEDS DASHBOARD CHECK`

Never document secret values.

## Resend Setup

1. Confirm the Mishava sending domain is added in Resend.
2. Confirm Resend DNS records are verified.
3. Confirm `RESEND_FROM_EMAIL` uses the verified domain.
4. Confirm `RESEND_REPLY_TO_EMAIL` routes to a monitored support inbox.
5. Send a test email from Resend to a real inbox.
6. Confirm email arrives without suspicious sender warnings.

## Supabase Auth Custom SMTP

In the clean V2 Supabase project dashboard:

1. Enable custom SMTP.
2. Use Resend SMTP settings.
3. Confirm sender name is `Mishava`.
4. Confirm sender email uses the verified Mishava domain.
5. Confirm Site URL points to the intended live Mishava URL.
6. Confirm redirect URLs include the live auth callback and update-password routes.
7. Confirm password reset redirects to `/auth/update-password`.
8. Confirm invite links return to `/app/team-invites/[inviteId]` on the current live Mishava domain.

## Public Sign-Up Test

1. Open the live NGO entry path.
2. Create an account with a real test inbox.
3. Confirm the email arrives.
4. Click the confirmation link.
5. Confirm the callback route completes and does not show stale internal setup copy.
6. Sign in using the popup.
7. Confirm protected NGO routes are accessible only after sign-in.

Pass condition:

- A real user can create an account, confirm email if required, and sign in without founder intervention.

## Password Reset Test

1. Open reset-password route.
2. Request reset for the same test inbox.
3. Confirm reset email arrives.
4. Click reset link.
5. Confirm `/auth/update-password` opens and the email-link session bridge prepares the reset flow.
6. Update password.
7. Sign out.
8. Sign in with updated password.

Pass condition:

- A real user can recover access without manual support.

## Team Invite Test

1. Sign in as an NGO owner/admin.
2. Create a team invite for a second real inbox.
3. Confirm invite email arrives.
4. Click invite link.
5. Sign in as the invited email.
6. Accept invite.
7. Confirm current org selection works.
8. Confirm wrong signed-in email is blocked.
9. Revoke a separate invite and confirm it cannot be accepted.
10. Test expired invite state if practical.

Pass condition:

- Team invite email delivery and acceptance work end to end with correct recipient checks.

## Evidence To Capture

Record screenshots or notes for:

- Resend domain verified.
- Supabase custom SMTP settings present.
- Sign-up email received.
- Password reset email received.
- Invite email received.
- Correct-email invite accepted.
- Wrong-email invite blocked.
- Revoked/expired invite blocked.

Do not store secrets or full magic links in committed docs.
