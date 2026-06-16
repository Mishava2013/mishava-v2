# NGO Live Email/Auth Closure Result

Date: 2026-06-16

## Summary

The repo-side NGO live email/auth blocker was tightened, but the full live email path is not completely closed yet because the clean `mishava-v2` Vercel project is missing the Resend production environment variables required for NGO team invite delivery.

What is closed in code:
- Supabase Auth confirmation and password reset redirect URLs now prefer `NEXT_PUBLIC_SITE_URL` before `NEXT_PUBLIC_APP_URL` or `VERCEL_URL`.
- `.env.example` now includes the explicit browser-safe `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable used by the app.
- The NGO team invite empty state no longer says real email delivery is disabled in this slice.
- Tests now guard that auth actions continue to support the canonical live site URL.

What remains manual:
- Add Resend production email variables to the clean Vercel project.
- Confirm Supabase Auth Custom SMTP in the Supabase dashboard.
- Run real inbox tests for signup confirmation, password reset, and NGO team invite delivery.

## Environment Status

Checked with `vercel env ls` on the locally linked clean Vercel project:

| Variable | Production status |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | SET |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SET |
| `SUPABASE_SERVICE_ROLE_KEY` | SET |
| `NEXT_PUBLIC_SITE_URL` | SET |
| `RESEND_API_KEY` | MISSING |
| `RESEND_FROM_EMAIL` | MISSING |
| `RESEND_REPLY_TO_EMAIL` | MISSING |
| `SUPPORT_EMAIL` | MISSING |

No secret values were printed or committed.

## Required Manual Dashboard Steps

In Vercel project `mishava-v2`, add these Production environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `SUPPORT_EMAIL`

Recommended sender setup:
- `RESEND_FROM_EMAIL` should use a verified Mishava sender domain.
- `RESEND_REPLY_TO_EMAIL` and `SUPPORT_EMAIL` should route to a monitored support inbox.

In Supabase project `mishava-v2-dev / snnscnodegbyqexnopvf`, verify:
- Auth email templates use the intended live Mishava URLs.
- Custom SMTP is enabled and points to the verified sender/provider.
- Redirect URLs include the live Mishava routes used for confirmation and password reset.

Do not touch old Supabase project `mishava / tghbfautnxblfxrtkdqb`.

## Verification Run

Commands run:

- `node --test scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs scripts/ngo-full-scale-slice-10b-invite-email.test.mjs scripts/ngo-near-100-non-stripe-readiness.test.mjs`
- `npm test`
- `supabase migration list --linked`
- `vercel env ls`
- `vercel env ls production`

Results:

- Targeted NGO auth/email readiness tests: passed, 13/13.
- Full test suite: passed, 157/157.
- Supabase linked migration list: passed and aligned through `202605260009`.
- Vercel env check: Supabase/site env vars set; Resend/support email vars missing.

## Live Test Still Needed

After the missing env vars are added and the production deployment has the env available, run:

1. Public NGO signup with a real inbox.
2. Email confirmation from the real inbox.
3. Password reset from the real inbox.
4. NGO team invite send from an owner/admin workspace.
5. Invite acceptance using the invited email address.
6. Wrong-email, revoked, and expired invite checks.

## Readiness Impact

NGO is closer to the non-Stripe target, but live email/auth should still be treated as partially open until the Resend env and Supabase Custom SMTP checks pass with real inboxes.

Current status:
- Repo-side auth URL and UI blockers: closed.
- Vercel Resend env readiness: not closed.
- Supabase Auth SMTP dashboard verification: not verified from repo.
- Real inbox end-to-end email/auth test: not yet run.

## Scope Confirmation

- No product features were added.
- No migrations were added or changed.
- No DNS/domain changes were made.
- No secrets were committed.
- The clean Vercel project link points to `mishava-v2`.
- Old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
