# NGO Full-Scale Slice 10C: Live Email Configuration and Inbox Verification Result

## Purpose

Verify whether Mishava NGO email is ready for live self-serve use after Slice 10A and Slice 10B.

Scope was live email configuration and inbox verification only. No product features were added. This slice did not build Stripe, exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, or any new product surface.

## Project

- Clean V2 Supabase project: `mishava-v2-dev`
- Clean V2 project ref: `snnscnodegbyqexnopvf`
- Old project not touched: `mishava / tghbfautnxblfxrtkdqb`

The local Supabase link still points to the clean V2 project:

```text
snnscnodegbyqexnopvf
```

Remote migration status was checked with:

```bash
supabase migration list --linked
```

Result: local and remote migrations are aligned through `202605240018`.

## Resend Configuration Status

Status: **not verified / not configured locally**

Local `.env.local` was checked for the Slice 10C email variables.

Present:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Missing locally:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `SUPPORT_EMAIL`

Because the Resend variables are not configured locally, Codex could not perform a real invite email send or verify an invite email in an inbox.

Required manual verification still needed:

1. Confirm Mishava sending domain exists in Resend.
2. Confirm Resend domain DNS verification is complete.
3. Confirm sender email.
4. Confirm reply-to email.
5. Add `RESEND_API_KEY` to local/deployment secrets.
6. Add `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`, and `SUPPORT_EMAIL` to local/deployment secrets.
7. Send a real NGO invite to a real inbox.
8. Confirm the invite email arrives and the invite link opens `/app/team-invites/[inviteId]`.

No Resend secrets were committed.

## Supabase Auth Custom SMTP Status

Status: **not dashboard-verified**

Codex can verify local code, env shape, linked project, and migrations, but cannot truthfully confirm Supabase dashboard Auth SMTP settings from the repository alone.

Supabase dashboard settings still requiring manual confirmation for the clean V2 project:

- Custom SMTP enabled.
- SMTP host, expected: `smtp.resend.com`.
- SMTP port, expected: `465` or `587`, depending on final Supabase/Resend compatibility.
- SMTP user, expected: `resend`.
- SMTP password uses the Resend API key.
- Sender email uses a verified Mishava sending domain.
- Sender name is `Mishava`.
- Site URL is set for local dev and later production/staging domains.
- Redirect URLs include:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/update-password`
- Confirm signup template is installed/polished.
- Reset password template is installed/polished.
- Password reset redirect opens `/auth/update-password`.

No Supabase Auth SMTP dashboard configuration was implemented in code.

## Real Inbox Test Results

Status: **blocked**

The requested real inbox tests could not be completed because Resend env vars are missing locally and Supabase Auth custom SMTP dashboard configuration has not been verified.

Blocked tests:

- Public sign-up email arrives.
- Confirmation link works from a real inbox.
- User can sign in after confirmation.
- Password reset email arrives.
- Reset link opens `/auth/update-password`.
- User can update password from reset link.
- User can sign in with updated password.
- Owner/admin invite email arrives through Resend.
- Invite link opens the correct route.
- Correct recipient can accept.
- Wrong recipient cannot accept.
- Revoked/expired invite remains blocked.

These flows were not marked as passed.

## Safety Checks

Checks completed:

- `.env.local` remains git-ignored.
- `screenshots/` remains git-ignored.
- `supabase/.temp/` remains git-ignored.
- `.env.example` remains the only env file tracked by git.
- No real email secrets were found in tracked source during the local scan.
- Old Supabase project was not modified.
- Clean V2 migration list is aligned through `202605240018`.

`supabase status` was attempted, but it checks local Docker services and failed because Docker is not running:

```text
Cannot connect to the Docker daemon
```

This did not affect the linked remote migration check.

## Tests and Checks Run

```bash
npm test
supabase migration list --linked
git ls-files .env.local screenshots supabase/.temp .env.example
```

Results:

- `npm test`: passed, 101/101 tests.
- `supabase migration list --linked`: passed; clean V2 local/remote migrations aligned through `202605240018`.
- Git tracked-file check: only `.env.example` is tracked from the checked env/artifact paths.

Attempted but not completed:

```bash
npm run lint
npm run build
```

The first parallel lint/build attempt was stopped after the verification processes stalled. A sequential `npm run lint` also stalled without producing lint errors. A sequential `npm run build` compiled successfully, then stalled during the TypeScript/worker phase and was stopped to avoid leaving long-running processes active.

Because those commands did not complete, Slice 10C cannot claim lint/build passed in this run. The prior Slice 10B run had passed `npm test`, `npm run lint`, and `npm run build`, and no product code was changed in Slice 10C.

## Failures / Blockers

Slice 10C is blocked by external configuration, not by newly added product code.

Current blockers:

1. Resend domain status is not verified from this environment.
2. Resend env vars are not configured locally.
3. Supabase Auth custom SMTP settings are not dashboard-verified.
4. Real confirmation email inbox delivery was not verified.
5. Real password reset inbox delivery was not verified.
6. Real invite email inbox delivery was not verified.
7. `npm run lint` and `npm run build` did not complete during this verification run.

## Remaining Email / Invite Work

Before NGO email/invites can be production-ready:

1. Configure and verify Resend sending domain.
2. Add Resend env vars to local and deployment secrets.
3. Configure Supabase Auth custom SMTP in the clean V2 project dashboard.
4. Install/polish Supabase confirm-signup and reset-password templates.
5. Run public sign-up through a real inbox.
6. Run password reset through a real inbox.
7. Create an owner/admin invite and confirm Resend delivery to a real inbox.
8. Accept invite as the correct recipient.
9. Confirm wrong-email, revoked, expired, accepted, and removed-member invite states.
10. Re-run `npm test`, `npm run lint`, and `npm run build`.

## Production-Readiness Status

NGO email/invite flow is **not production-ready yet**.

Current status:

```text
App-ready, live-email blocked pending Resend/Supabase dashboard configuration and real inbox verification.
```

Slice 10B made invite email sending app-ready. Slice 10C did not prove live delivery because the external email configuration is still incomplete or inaccessible from this environment.

## Scope Confirmation

No product features were added.

No Stripe, exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, or new product surfaces were added.

No Supabase Auth SMTP configuration was implemented in code.

No email secrets were committed.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
