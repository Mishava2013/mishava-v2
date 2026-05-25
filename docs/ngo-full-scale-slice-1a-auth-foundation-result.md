# NGO Full-Scale Slice 1A: Supabase Auth Foundation Result

Status: implemented.

Source of truth:

- `docs/ngo-full-scale-slice-1-auth-account-plan.md`
- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-pilot-readiness-reaudit.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

Slice 1A adds the first real Supabase Auth foundation while preserving the existing NGO workflows.

Implemented:

- Supabase Auth-aware server utilities:
  - password sign-up
  - password sign-in
  - password reset request
  - password update with active access token
  - sign-out
  - access-token-backed session lookup
  - membership lookup through Supabase REST using the user's access token
- Supabase browser configuration helper that exposes only public browser-safe values.
- Auth cookie bridge:
  - `mishava_sb_access_token`
  - `mishava_sb_refresh_token`
  - existing temporary `mishava_session` remains as a dev/test fallback.
- Auth pages:
  - `/auth/sign-up`
  - `/auth/sign-in`
  - `/auth/sign-out`
  - `/auth/reset-password`
  - `/auth/update-password`
  - `/auth/callback`
- Middleware bridge:
  - reads Supabase Auth access token first
  - reads memberships through RLS-compatible REST access
  - falls back to the temporary session cookie only when no Supabase Auth token is present.
- Server auth helpers now support Supabase Auth sessions while preserving existing helper names.
- Current organization helper can fall back to the user's only membership when no current-org cookie is present.
- NGO onboarding now:
  - works from the authenticated session
  - creates membership using the Supabase Auth user id
  - sets the current organization cookie after successful onboarding.
- NGO evidence/report/share flows now use authenticated Supabase clients where user-scoped RLS can apply.
- Header sign-in link now points to `/auth/sign-in`.
- Added scoped RLS migration for structured claims so authenticated NGO member workflows can read/create/update draft claims without relying on service-role reads/writes.

## Migrations Applied

Applied to the clean V2 Supabase project only:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`
- Migration: `202605240012_ngo_auth_foundation.sql`

Migration status:

- Local `202605240001` through `202605240012` match remote `202605240001` through `202605240012`.

The old Supabase project was not modified:

- `mishava / tghbfautnxblfxrtkdqb`

## Tests Run

- `npm test`
  - Pass: 57 tests.
- `npm run lint`
  - Pass.
- `npm run build`
  - Pass.
- `supabase migration list`
  - Pass: clean V2 project aligned through `202605240012`.

## Live Checks Performed

Performed against:

- `mishava-v2-dev / snnscnodegbyqexnopvf`

Verified:

- migration `202605240012` applied cleanly
- remote migration list matches local migration list through `202605240012`
- old Supabase project was not targeted or modified

Not performed in this slice:

- live public sign-up/sign-in smoke test with a new test account
- live password reset email delivery test
- live email verification test

Reason:

This slice adds the auth foundation and RLS support. Dashboard email/redirect configuration should be reviewed before creating external test accounts or sending auth emails.

## Known Limitations

- The temporary `mishava_session` cookie remains as a dev/test fallback. It should be removed only after the rest of the auth/account slices are complete and live-verified.
- Supabase refresh-token rotation is not fully implemented yet. Current Slice 1A sets refresh-token cookie when Supabase returns it, but does not yet refresh expired access tokens.
- `/auth/callback` is a basic handling page. Full magic-link, invite-acceptance, and token-exchange behavior belongs in later auth/account slices.
- MFA is not implemented yet.
- Member invites are not implemented yet.
- Organization switching UI is not implemented yet.
- Admin MFA/dashboard hardening is not implemented yet.
- Email templates, Site URL, and redirect allow-list must be configured in the Supabase dashboard before full external testing.
- Some server workflows still retain service-role fallback behavior when no access token is present; the goal is to continue reducing that in later slices.

## Remaining Auth / Account Work

Recommended next auth/account slices:

1. Slice 1B: Full sign-up/sign-in/password-reset live verification and refresh-token handling.
2. Slice 1C: Organization switcher and account menu.
3. Slice 1D: Member invite/accept/revoke flow.
4. Slice 1E: MFA for Mishava admin roles and optional NGO owner/admin MFA.
5. Slice 1F: Remove temporary cookie fallback after final auth workflows are live-verified.

## Supabase Dashboard Configuration Still Needed

Before broader live testing:

- Confirm Site URL.
- Add allowed redirect URLs:
  - `/auth/callback`
  - `/auth/update-password`
- Decide whether email confirmation is required before NGO onboarding or before sensitive NGO actions.
- Configure email templates for confirmation and password reset.
- Decide auth email rate limits for pilot use.
- Confirm MFA settings and admin rollout plan.

## Explicit Non-Scope Confirmation

This slice did not add:

- Shopping work
- Business work
- Local work
- Gov work
- Corporate work
- Plus work
- AI workflows
- Stripe or billing
- report exports
- file uploads
- advanced custom roles
- fake scores
- fake products
- fake evidence
- public scoring UI
- final scoring math

## Final Status

NGO Full-Scale Slice 1A is implemented as a Supabase Auth foundation. It is not the final auth/account system yet, but it establishes the account path, route-helper bridge, authenticated client usage, and RLS support needed for the next self-serve NGO readiness slices.
