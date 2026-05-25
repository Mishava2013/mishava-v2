# NGO Full-Scale Slice 9: Auth, Email, and Invite Smoke Result

## Purpose

This document records the Slice 9 final auth, email, invite, password reset, and access-control smoke pass for Mishava NGO full-scale readiness.

Scope was verification and documentation only. No Shopping, Business, Local, Gov, Corporate, Plus, production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, or new product surfaces were added.

## Project Verified

- Supabase project: `mishava-v2-dev`
- Project ref: `snnscnodegbyqexnopvf`
- Old project not touched: `mishava / tghbfautnxblfxrtkdqb`
- Local app used for smoke pass: `http://localhost:3000`
- `.env.local` was present locally and remained git-ignored.

## Supabase Dashboard Settings

Codex verified the local app configuration and live project connectivity, but did not directly change Supabase dashboard settings in this slice.

Settings that still need to be manually confirmed in the Supabase dashboard before broad launch:

- Site URL for local dev: `http://localhost:3000`
- Allowed redirect URL: `http://localhost:3000/auth/callback`
- Allowed redirect URL: `http://localhost:3000/auth/update-password`
- Future staging URL placeholder once a staging domain exists.
- Future production URL placeholder once a production domain exists.
- Password reset redirect should point to `/auth/update-password`.
- Email confirmation setting should be deliberately chosen for launch.
- Auth email templates should be polished before public self-serve launch.
- MFA should remain optional for normal NGO users for now, but should be required later for admin/support and sensitive roles.

## Migration Status

`supabase migration list --linked` confirmed local and remote migrations are aligned on the clean V2 project through:

- `202605240001`
- `202605240002`
- `202605240003`
- `202605240004`
- `202605240005`
- `202605240006`
- `202605240007`
- `202605240008`
- `202605240009`
- `202605240010`
- `202605240011`
- `202605240012`
- `202605240013`
- `202605240014`
- `202605240015`
- `202605240016`
- `202605240017`

No new migrations were added for Slice 9.

## Live Smoke Results

### Public Sign-Up

Status: **Not launch-ready yet**

The public sign-up form was retested through the local `/auth/sign-up` page and reached Supabase Auth, but Supabase returned a `429` email rate-limit response:

```text
/auth/sign-up?error=Supabase Auth request failed: 429
```

This is not an app route failure, but it means public sign-up cannot yet be marked full-scale launch-ready. Before broad self-serve launch, Mishava needs either a cleared Supabase email rate limit, adjusted dev email settings, or a production-ready email provider/sending configuration.

### Password Reset

Status: **Partially passed**

The `/auth/reset-password` request flow passed and redirected to:

```text
/auth/sign-in?notice=reset_requested
```

The authenticated `/auth/update-password` page was also tested with a signed-in user:

- Password update submitted successfully.
- User could sign in with the updated password afterward.

Remaining limitation: a real email-inbox reset-link click was not verified in this slice. That needs a launch email-provider pass once public email sending is stable.

### Signed-In Access and NGO Onboarding

Status: **Passed**

Using live Supabase Auth users, the smoke pass verified:

- Signed-in user can access `/app`.
- Signed-in user can submit `/ngo/onboarding`.
- NGO onboarding creates live rows for organization, membership, NGO profile, and audit event.

Rows created during the final passing smoke run:

- Organization: `ae7cbd82-6b6d-41d0-8e46-096f297e637a`
- Owner membership: `a610679f-a370-45b5-97f4-0033254e0138`
- NGO profile: `d8794d51-04c1-4166-a4c0-b124cd7bc859`
- Onboarding audit event: `3b745430-998e-4aa5-a026-094f00f66834`

The test NGO profile was raised to the Growth tier only to allow invite-capacity smoke testing. This affected feature capacity only and did not affect trust outcomes.

### Invite Acceptance

Status: **Passed**

The invite flow was tested through live app routes and Supabase Auth users:

- Owner/admin created a team invite.
- Invited user was blocked from `/org/evidence` before accepting.
- Wrong-email user could not accept the invite.
- Invited user accepted the invite.
- Accepted invite created an active organization membership.
- Invite creation and acceptance audit events were present.
- Invited user could access the org after accepting.
- Revoked invite was blocked.
- Expired invite was blocked.
- Removed user lost access immediately.

Rows created during the final passing smoke run:

- Invite: `adee7290-5197-42a8-be84-d3cfd1dea4ef`
- Invited membership: `a3c56695-df7a-4594-acb7-d6f9e0e01416`

### Access-Control Smoke Pass

Status: **Passed**

Verified:

- Unauthenticated `/org/evidence` redirects/blocks.
- Signed-out stale session blocks `/org/evidence`.
- Non-admin `/admin/support` redirects/blocks.
- Admin/support user can access `/admin/support`.
- Wrong-org current-org cookie is rejected.
- Removed membership is rejected.
- Current org workspace remains accessible for signed-in users.
- Sign-out clears auth/current org access.

## Email Provider and Template Notes

Supabase Auth email is enough for continued development smoke testing only if rate limits are cleared or dev email confirmation behavior is adjusted.

Before NGO full-scale self-serve launch, Mishava still needs:

- A final decision on Supabase email versus a dedicated provider.
- Confirm signup email template.
- Password reset email template.
- Invite email template.
- Support/correction routing email.
- Clear non-marketing language focused on access, trust, and account safety.
- A strategy for rate limits, bounced email, and failed invite delivery.

Current invite flow still uses dev-safe invite links displayed in the team UI. Real invite email sending is not production-ready yet.

## Tests and Checks Run

Commands/checks run:

```bash
supabase migration list --linked
npm test
npm run lint
npm run build
node /private/tmp/mishava-slice9-smoke.mjs
```

Results:

- `supabase migration list --linked`: passed; clean V2 remote aligned through `202605240017`.
- `npm test`: passed, 96/96 tests.
- `npm run lint`: passed.
- `npm run build`: passed.
- Live smoke script: passed for signed-in auth, onboarding, invite acceptance, access controls, removed-member blocking, admin support access, password reset request, and authenticated password update; public sign-up remains blocked by Supabase `429`.

## Known Limitations

- Public sign-up is not launch-ready because Supabase Auth returned `429` during email-based sign-up.
- Real email-inbox password reset link verification was not completed.
- Real invite email delivery is not implemented; invite links remain dev-safe/manual.
- Supabase dashboard settings still need manual confirmation before full-scale public launch.
- MFA is not enforced yet.
- Auth email templates are not polished for production.
- This slice did not add a production email provider.

## Final Slice 9 Status

NGO auth, invite acceptance, current-org access, admin blocking, wrong-org blocking, removed-member blocking, and signed-in password update are strong enough to continue launch hardening.

NGO auth/email/invites are **not yet full-scale launch-ready** because public sign-up and email-delivered reset/invite flows still need the real email-provider/rate-limit/template pass.

Recommended next implementation slice:

```text
Slice 10: Real Email Provider and Invite Polish
```

## Scope Confirmation

No production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, or new product surfaces were added.

No unrelated product features were added.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not modified.
