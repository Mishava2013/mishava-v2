# NGO live email/Auth closure result

Date: 2026-06-16

## 1. Executive summary

NGO live email/Auth is repo-side ready after this run, with one important boundary: external Vercel, Resend, and Supabase Auth SMTP settings still must be completed and verified with real inboxes before Mishava NGO should be called fully supported-pilot ready.

Repo-side items closed:
- Signup confirmation redirect URLs prefer `NEXT_PUBLIC_SITE_URL`.
- Password reset redirect URLs prefer `NEXT_PUBLIC_SITE_URL`.
- Password reset and confirmation callback pages can capture Supabase email-link hash tokens and save the app's secure auth cookies before the user continues.
- Missing Supabase Auth env now fails with a plain support message instead of throwing an unhandled auth configuration error.
- Team invite email delivery still fails safely when Resend env is missing and keeps the backup invite link path.
- Team invite acceptance still requires sign-in with the invited email address, sets current org after acceptance, and blocks revoked/expired/wrong-email states.
- User-facing auth pages no longer expose stale "Slice 1A" or "Supabase Auth will send" copy.

Still required externally:
- Add the missing Resend/support env vars to the clean `mishava-v2` Vercel project.
- Configure and verify Supabase Auth Custom SMTP for the Mishava V2 Supabase project.
- Run the real-inbox signup, password reset, invite, revoked/expired invite, removed-member, and wrong-org tests below.

Final status label: ready after external env/config.

After the external configuration and real-inbox tests pass, Mishava NGO can move to ready for supported pilot, excluding Stripe/payment.

## 2. Changes made

### Auth email-link session bridge

Files changed:
- `src/app/auth/session/route.ts`
- `src/components/AuthHashSessionBridge.tsx`
- `src/app/auth/callback/page.tsx`
- `src/app/auth/update-password/page.tsx`
- `scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs`

What changed:
- Added a server route that accepts Supabase email-link access/refresh tokens from the browser and stores them in Mishava's secure auth cookies.
- Added a client bridge that reads Supabase tokens from the URL hash on email confirmation/password reset pages, posts them to the server route, and removes the hash from the visible URL.
- Added the bridge to `/auth/callback` and `/auth/update-password`.
- Removed stale internal copy from the callback page.

Why it mattered:
- Supabase email confirmation and password reset links commonly return tokens in the browser URL hash. Server actions cannot read that hash directly. Without this bridge, a password reset link could land on the right page but still lack the server cookie needed to update the password.

How to test:
1. Trigger a password reset from `/auth/reset-password`.
2. Open the reset email link.
3. Confirm `/auth/update-password` shows that the reset link is ready.
4. Submit a new password.
5. Confirm signing in with the new password works.

### Auth redirect handling and safe missing-config behavior

Files changed:
- `src/lib/supabase/auth.ts`
- `src/app/auth/reset-password/page.tsx`
- `scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs`

What changed:
- Signup and password reset API calls now include explicit `redirect_to` query parameters built from the live site URL.
- Missing Supabase Auth env returns a plain support message instead of throwing a low-level configuration error.
- Password reset page now says Mishava will send reset instructions instead of exposing Supabase provider language.

Why it mattered:
- Live email links must return users to the correct deployed Mishava routes.
- If env vars are missing, users should get a recoverable explanation rather than a dead end.

How to test:
1. Remove Supabase public env vars only in a local throwaway env, not production.
2. Try signup/reset.
3. Confirm the app gives a plain configuration/support message.

### Invite and org-access review

Files reviewed:
- `src/lib/email.ts`
- `src/lib/ngo-team.ts`
- `src/app/org/team/page.tsx`
- `src/app/org/team/actions.ts`
- `src/app/app/team-invites/[inviteId]/page.tsx`
- `src/app/app/team-invites/[inviteId]/actions.ts`
- `middleware.ts`
- `src/lib/auth-server.ts`

Findings:
- Invite email delivery uses server-only `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
- Invite links are built from `NEXT_PUBLIC_SITE_URL`.
- If Resend is missing, invite delivery is marked `not_configured` and the backup invite link remains available.
- Invite acceptance requires an authenticated session.
- Middleware preserves the original invite path in `next` when redirecting a signed-out user to sign in.
- Invite acceptance requires the signed-in email to match the invited email.
- Revoked and expired invites are blocked with plain-language messages.
- Accepting an invite sets the current organization to the invited org.
- Removed/inactive members are filtered out of active membership reads.
- Current-org cookie is not treated as authority; server membership checks still apply.

## 3. Remaining manual setup

### Vercel env vars

Project: `mishava-v2`

Set these in Vercel Dashboard > Project `mishava-v2` > Settings > Environment Variables.

Add to Production first. Add to Preview and Development too if those environments will send real test emails.

| Variable | Environment | Secret/public | Value should represent | Redeploy required |
|---|---|---:|---|---:|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | Public | Supabase project URL for `mishava-v2-dev / snnscnodegbyqexnopvf` | Yes after change |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Public | Browser-safe anon key for `mishava-v2-dev / snnscnodegbyqexnopvf` | Yes after change |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development if server workflows are tested there | Secret | Server-only service role key for `mishava-v2-dev / snnscnodegbyqexnopvf` | Yes after change |
| `NEXT_PUBLIC_SITE_URL` | Production | Public | `https://ngo.mishava.org` if NGO is the primary pilot domain, or the canonical Mishava app domain if using one shared domain | Yes after change |
| `RESEND_API_KEY` | Production | Secret | Resend API key for Mishava's verified sending domain | Yes |
| `RESEND_FROM_EMAIL` | Production | Secret-ish operational value | Verified sender address, for example `Mishava <no-reply@verified-mishava-domain>` | Yes |
| `RESEND_REPLY_TO_EMAIL` | Production | Secret-ish operational value | Monitored reply inbox, for example `support@verified-mishava-domain` | Yes |
| `SUPPORT_EMAIL` | Production | Public-ish operational value | Monitored support inbox shown to users | Yes |

Local `.env`:
- Keep real values in `.env.local`, not `.env.example`.
- `.env.example` already lists the needed variable names with blank placeholders.
- Do not commit `.env.local`.

Important:
- Do not use the old Supabase project `mishava / tghbfautnxblfxrtkdqb`.
- Do not print or paste secret values into docs, commits, or chat.

### Resend sender/domain requirements

In Resend:
1. Verify the Mishava sending domain.
2. Create or confirm the API key used by `RESEND_API_KEY`.
3. Confirm the sender in `RESEND_FROM_EMAIL` is allowed by that verified domain.
4. Confirm replies route to the inbox used by `RESEND_REPLY_TO_EMAIL` and `SUPPORT_EMAIL`.
5. Send a test email from Resend before testing through Mishava.

### Supabase Auth SMTP setup

Project: `mishava-v2-dev / snnscnodegbyqexnopvf`

Supabase Dashboard steps:
1. Open Supabase Dashboard.
2. Select project `mishava-v2-dev`.
3. Go to Authentication > Providers and confirm Email provider is enabled.
4. Go to Authentication > URL Configuration.
5. Set Site URL to the canonical live Mishava URL used for auth, preferably `https://ngo.mishava.org` for the NGO pilot if that is the product being tested.
6. Add redirect URLs:
   - `https://ngo.mishava.org/auth/callback`
   - `https://ngo.mishava.org/auth/update-password`
   - `https://ngo.mishava.org/app/team-invites/*`
   - `https://shopping.mishava.org/auth/callback` if shared auth is used from Shopping.
   - `https://shopping.mishava.org/auth/update-password` if shared auth is used from Shopping.
   - Any clean Vercel preview URL only if testing Preview auth.
7. Go to Authentication > SMTP Settings or Auth Emails / SMTP, depending on dashboard labeling.
8. Enable Custom SMTP.
9. Use Resend SMTP settings:
   - Host: `smtp.resend.com`
   - Port: `465` for SSL, or `587` for STARTTLS if preferred by the dashboard.
   - Username: `resend`
   - Password: the Resend API key.
   - Sender email/name: match the verified sender used in `RESEND_FROM_EMAIL`.
10. Review email templates for confirmation and password reset.
11. Ensure confirmation links point to `{{ .ConfirmationURL }}` or the Supabase-supported equivalent, without hardcoding an old domain.
12. Ensure password reset links point to `{{ .ConfirmationURL }}` or the Supabase-supported equivalent, without hardcoding an old domain.
13. Save settings.

Do not mark this complete until real inbox tests pass.

## 4. Manual real-inbox test script

Use two real inboxes:
- Owner/admin test inbox.
- Teammate test inbox.

### Signup confirmation

1. Open `https://ngo.mishava.org`.
2. Create a new Mishava account using the owner/admin test inbox.
3. Confirm a signup/confirmation email arrives.
4. Click the confirmation link.
5. Confirm the user lands on a Mishava auth route, not an old Supabase or old deployment route.
6. Confirm the page does not show stale internal copy.
7. Sign in if prompted.
8. Confirm the user can proceed to NGO onboarding or the app.

Pass criteria:
- Email arrives.
- Link opens the current live Mishava domain.
- User can continue without asking Codex to repair access.

### Password reset

1. Sign out.
2. Open `/auth/reset-password`.
3. Enter the owner/admin test inbox.
4. Confirm reset email arrives.
5. Click the reset link.
6. Confirm `/auth/update-password` says the reset link is ready or otherwise gives a clear next step.
7. Enter a new password with at least 6 characters.
8. Confirm update succeeds.
9. Sign in with the new password.
10. Confirm the old password no longer works, if practical and safe to test.

Pass criteria:
- Reset email arrives.
- Reset link returns to Mishava.
- New password can be set without a dead end.

### Team invite

1. Sign in as owner/admin.
2. Create or open an NGO organization.
3. Go to `/org/team`.
4. Invite the teammate test inbox.
5. Confirm invite email status says sent.
6. Confirm the teammate inbox receives the invite.
7. Open the invite link in a separate browser/private window.
8. If prompted, sign in or create an account using the teammate test inbox.
9. Accept the invite.
10. Confirm teammate lands in the correct organization.
11. Confirm teammate has the expected role and permissions.

Pass criteria:
- Invite email arrives.
- Invite requires the invited email.
- Acceptance lands in the correct org.

### Invite revoke/expired behavior

Revoked invite:
1. Create a new invite.
2. Copy the invite link.
3. Revoke/cancel the invite from `/org/team`.
4. Open the copied invite link.
5. Confirm the user sees a plain-language blocked message.

Expired invite:
1. If the UI cannot create an expired invite directly, simulate in a safe dev/test database by setting `expires_at` in the past for a test invite only.
2. Open the expired invite link.
3. Confirm the user sees a plain-language expired message.

Pass criteria:
- Revoked/expired invites cannot be accepted.
- The message tells the user to ask the organization admin for a new invite.

### Removed member blocking

1. Add the teammate to the org.
2. Confirm teammate can access allowed org pages.
3. Remove the teammate.
4. In the teammate browser/session, try `/org`, `/org/evidence`, `/org/reports`, and `/org/team`.
5. Confirm private NGO content is blocked.

Pass criteria:
- Removed member cannot access private org content.

### Wrong-org protection

1. Create or use two test organizations.
2. Sign in as a user who belongs to only one of them.
3. Try to manipulate routes or stale links for the other org.
4. Try stale current-org cookie behavior by switching orgs where possible.
5. Confirm the user cannot see the other org's evidence, reports, team, or billing details.

Pass criteria:
- Wrong-org access is blocked server-side.
- The user is routed to select or create a valid org instead of seeing private data.

## 5. Test results

Commands run in this closure run:
- `node --test scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs scripts/ngo-full-scale-slice-10b-invite-email.test.mjs`
- `npm test`
- `supabase migration list --linked`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Results:
- Targeted auth/invite tests: passed, 11/11.
- Full test suite: passed, 161/161.
- Supabase migration list: aligned through `202605260009`.
- `npm run typecheck`: attempted, but the local process produced no output after a minute and was stopped.
- `npm run lint`: attempted, but the local process produced no output after a minute and was stopped.
- `npm run build`: attempted, but the local process produced no output after a minute and was stopped.

Limitations:
- Real email delivery cannot be proven from repo tests alone.
- Vercel env values were not changed in this run.
- Supabase Dashboard SMTP settings were not changed in this run.
- Real inbox tests still need to be run after Vercel/Resend/Supabase setup.
- The local typecheck/lint/build stall is a tooling issue seen in prior runs; it is not evidence that email/Auth failed, but it should be diagnosed before relying on this machine for final release verification.

## 6. Final status label

Ready after external env/config.

Meaning:
- Repo-side implementation is ready for live email/Auth testing.
- External Vercel env, Resend sender/domain, Supabase Auth SMTP, and real-inbox verification remain the final blocker.
- After those manual checks pass, Mishava NGO is ready for a supported pilot, excluding Stripe/payment.

## Scope confirmation

- No Shopping product work was done.
- No Stripe/payment work was done.
- No new product surfaces were added.
- No migrations were added or changed.
- No DNS/domain changes were made.
- No secrets were committed.
- The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
