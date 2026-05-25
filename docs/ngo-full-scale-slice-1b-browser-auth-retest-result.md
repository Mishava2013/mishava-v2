# NGO Full-Scale Slice 1B: Browser Auth Retest Result

Date: 2026-05-24

## Project

- Project name: mishava-v2-dev
- Project ref: snnscnodegbyqexnopvf
- Old project: mishava / tghbfautnxblfxrtkdqb was not modified

## Status

Browser-based Supabase Auth is partially verified and improved.

The browser retest found two real auth handoff issues:

1. The sign-in browser flow submitted successfully but redirected to `/?auth=required` because the app discarded the direct Supabase `/auth/v1/user` response shape.
2. Middleware was doing too much live membership work before the server layouts could enforce membership with the authenticated server client.

Both were fixed in this slice without adding product features.

## Minimal Fixes Made

### Sign-in route handler

Added `POST /auth/sign-in/submit` and updated the sign-in form to use a normal POST route handler for browser sign-in.

Reason:

- It sets Supabase auth cookies directly on the redirect response.
- It avoids brittle browser/server-action cookie handoff behavior for the core sign-in path.

### Supabase auth user parsing

Updated `getAuthUser` so it accepts Supabase's direct `/auth/v1/user` response shape as well as `{ user: ... }`.

Reason:

- The access token was valid.
- Supabase returned the user.
- The app helper was incorrectly treating that response as `null`.

### Middleware hardening

Adjusted middleware so it remains an early route guard, but leaves full org membership enforcement to the existing server layouts.

Reason:

- `/app` only needs authenticated identity.
- `/org/*` still requires a selected organization cookie at middleware level.
- Actual org membership is still enforced by `requireCurrentOrganizationMembership`.
- `/admin/*` is still protected by admin checks and `requireAdminSession`.

## Browser Tests Run

### 1. Sign up through `/auth/sign-up`

Result: blocked by Supabase Auth rate limit.

Observed browser result:

- `/auth/sign-up?error=Supabase%20Auth%20request%20failed%3A%20429`

Status: not passed yet. This remains a Supabase dashboard/email rate-limit blocker.

### 2. Confirm email if enabled

Result: not completed.

Reason:

- Public sign-up was blocked by rate limiting before an email confirmation could be tested.

### 3. Sign in through `/auth/sign-in`

Result: passed after auth fixes.

Browser reached:

- `/app`

### 4. Verify `/app` is accessible

Result: passed.

The browser displayed the signed-in workspace page.

### 5. Verify `/org/evidence` is accessible after org selection/onboarding

Result: passed.

Before onboarding:

- `/org/evidence` redirected to `/?auth=organization_required`

After onboarding:

- `/org/evidence` loaded successfully.

### 6. Sign out through `/auth/sign-out`

Result: passed.

Browser reached:

- `/auth/sign-in?notice=signed_out`

### 7. Verify `/org/evidence` blocks after sign-out

Result: passed.

Browser reached:

- `/?auth=required`

### 8. Request password reset after rate limit clears

Result: blocked by Supabase Auth rate limit.

Observed browser result:

- `/auth/reset-password`
- Message: `Supabase Auth request failed: 429`

Status: not passed yet. This remains a Supabase dashboard/email rate-limit blocker.

### 9. Confirm `/auth/update-password` works from reset link

Result: not completed.

Reason:

- Password reset email/link could not be generated due rate limiting.
- Update-password with an active session was previously verified in the live backend check, but the real reset-link browser path remains unverified.

### 10. Create NGO org through `/ngo/onboarding`

Result: passed.

Created organization:

- Organization: `789a3d15-cecb-478c-9021-aff12037306e`
- Name: `Browser Retest NGO 1779678925742`

### 11. Create evidence through `/org/evidence`

Result: passed.

Created evidence:

- Evidence item: `bac48497-688f-4bdc-afe0-e45ebf46d8e6`
- Title: `Browser Retest Evidence 1779678965944`

### 12. Confirm rows and audit events in Supabase

Result: passed.

Rows confirmed:

- Organization: `789a3d15-cecb-478c-9021-aff12037306e`
- Membership: `55cc37d2-99ca-4f02-90f7-b674c6098ed1`
- NGO profile: `537d15a3-a4e6-4b4c-a87b-d067236ddb73`
- Evidence item: `bac48497-688f-4bdc-afe0-e45ebf46d8e6`
- Onboarding audit event: `2e97454d-2541-4308-9b37-02ef7c0fec93`
- Evidence audit event: `f9de2deb-0295-4ba5-9033-370dbea25905`

### 13. Confirm non-admin still cannot access `/admin/scoring`

Result: passed.

Browser reached:

- `/?auth=admin_required`

### 14. Confirm wrong-org access remains blocked

Result: passed.

Checked with a second confirmed Supabase Auth user and the first organization's selected org cookie.

Route result:

- `/org/evidence` redirected to `/?auth=organization_required`

## Screenshots

No screenshots were committed. The `screenshots/` directory remains ignored.

## Known Remaining Auth Blockers

- Public sign-up cannot be fully browser-verified while Supabase Auth returns `429`.
- Password reset cannot be fully browser-verified while Supabase Auth returns `429`.
- Email confirmation and reset-link behavior still need a successful email delivery path.
- Supabase dashboard settings should still be manually confirmed:
  - Site URL
  - allowed redirect URLs
  - email confirmation setting
  - reset redirect
  - email templates
  - MFA plan

## Auth Readiness Judgment

Auth is ready enough to move to the next account slice for:

- org switching planning/implementation
- team invite planning/implementation
- NGO account workflow continuation

Auth is not yet ready for broad external self-serve launch until:

- public sign-up email flow passes
- password reset email flow passes
- email confirmation behavior is confirmed
- Supabase dashboard settings are verified one more time against the real intended dev/staging/prod URLs

## Tests Run

- Browser sign-up path: blocked by `429`
- Browser sign-in path: passed after fixes
- Browser `/app` access: passed
- Browser onboarding: passed
- Browser evidence creation: passed
- Browser sign-out: passed
- Browser signed-out block: passed
- Browser reset request: blocked by `429`
- Non-admin admin block: passed
- Wrong-org block: passed

- `npm test` passed: 57 tests
- `npm run lint` passed
- `npm run build` passed

## Scope Confirmation

No team invites, org switching, evidence files, billing, exports, Shopping, Business, Local, Gov, Corporate, Plus, AI, Stripe, or new product features were added.
