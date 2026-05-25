# NGO Full-Scale Slice 1B: Supabase Auth Live Configuration Result

Date: 2026-05-24

## Project

- Project name: mishava-v2-dev
- Project ref: snnscnodegbyqexnopvf
- Old project: mishava / tghbfautnxblfxrtkdqb was not modified

## Status

NGO Full-Scale Slice 1B is live-verified against the clean Mishava V2 Supabase project with caveats.

The live test confirmed real Supabase Auth users can sign in, create NGO organization records, create NGO profile records, create membership records, create manual evidence, and write audit events after the narrow RLS fixes in this slice.

Supabase dashboard settings were not changed by Codex because this repo/session does not expose a safe Supabase dashboard management interface for auth URL/template configuration. Those dashboard settings remain a manual follow-up before broader live auth testing.

## Dashboard Settings

### Observed

- Public signup/password email flows are active enough to hit Supabase email rate limits.
- Public signup/reset probes returned rate limiting during verification:
  - signup probe status: 429
  - password reset status: 429
- Earlier public password sign-in testing showed email confirmation is required for normal public sign-up users.

### Not Directly Changed In This Slice

These must still be confirmed manually in the Supabase dashboard for `mishava-v2-dev`:

- Site URL for local dev: `http://localhost:3000`
- Allowed redirect URL: `http://localhost:3000/auth/callback`
- Allowed redirect URL: `http://localhost:3000/auth/update-password`
- Password reset redirect behavior
- Auth email templates for confirmation and reset
- Future staging/production redirect URLs once real domains exist
- MFA configuration decision

### Dev Decision

For development, email confirmation may remain enabled, but rate limits make repeated automated testing difficult. Admin-created confirmed test users were used for this verification so the database and app auth paths could be tested without sending additional emails.

### Production Recommendation

Before full-scale NGO launch:

- Require email confirmation.
- Require MFA for Mishava admin/support roles.
- Require MFA for NGO owner/admin roles before broad self-serve use.
- Keep MFA optional for regular NGO members at first.
- Use clear, plain-language Mishava email templates with no marketing-heavy copy.

## Changes Made

### Migration 202605240013

Added authenticated table grants required for real Supabase Auth users to use the existing NGO workflows under RLS.

### Migration 202605240014

Added `organizations.created_by` and tightened organization creation/read policies so a real authenticated user can create and read the organization row before/while first membership is established.

### Migration 202605240015

Added member-only audit-event read policy so authenticated workflows can read back their own append-only organization audit rows after insert. Audit events remain append-only.

### Workflow Update

`createNgoOnboardingRecord` now writes `organizations.created_by = session.user.id` when creating the organization row.

## Live Tests Run

Live backend checks against `mishava-v2-dev`:

- Admin-created confirmed test auth user: passed
- Password sign-in: passed
- Sign-out request: passed
- Password reset request: blocked by Supabase email rate limit
- Password update with active session: passed
- Sign-in after password update: passed
- NGO organization creation: passed
- Organization membership creation: passed
- NGO profile creation: passed
- Onboarding audit event creation: passed
- Manual evidence creation: passed
- Evidence audit event creation: passed
- Member can read own private evidence: passed
- Anonymous user cannot read private evidence: passed
- Wrong-org authenticated user cannot read private evidence: passed

Route checks:

- Unauthenticated `/org/evidence`: redirected to `/?auth=required`
- Unauthenticated `/admin/scoring`: redirected to `/?auth=required`
- Non-admin admin access with local session bridge: redirected to `/?auth=admin_required`
- Member org access with local session bridge: returned 200
- Direct Supabase access-token cookie route simulation in local dev still redirected to `/?auth=required`; backend Supabase token verification and RLS checks passed. This should be retested through the real browser sign-in flow after dashboard URL settings are finalized.

Shared report recipient access was not re-tested end-to-end in this slice because no active recipient grant was created as part of the auth dashboard configuration task. The existing scoped-sharing tests still pass.

## Rows Created During Verification

- Auth user: `e2e88c42-ad6b-4ee4-9892-447f38150e90`
- Organization: `ef322781-3d21-4b07-bac6-2e3bca50fe0e`
- Membership: `1a872f69-9c02-41c1-8f63-ecc306bd316e`
- NGO profile: `55dfb8f5-d46e-461c-904f-f3d17be62a71`
- Onboarding audit event: `a950a45a-135f-451c-99c8-d54d085410a1`
- Evidence item: `9cfb9a5f-1286-438e-a8d0-4b259cec1677`
- Evidence audit event: `9697c897-a900-4a2c-b9c5-2ac7a07b0439`
- Wrong-org auth user: `077ad9aa-fd6f-43a2-957d-c3e5122411a0`

## Migration Status

Remote migrations are aligned through:

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

## Tests Run

- `npm test` passed: 57 tests
- `npm run lint` passed
- `npm run build` passed
- `supabase migration list` confirmed local and remote migration alignment

## Safety Checks

- `.env.local` remains git-ignored
- `screenshots/` remains git-ignored
- `supabase/.temp/` remains git-ignored
- No secrets were committed
- The old Supabase project was not modified

## Known Limitations

- Supabase dashboard URL/template/MFA settings still require manual confirmation.
- Password reset live testing is blocked by Supabase email rate limiting until dashboard/email settings are settled.
- Direct local route simulation with only the Supabase access-token cookie did not authenticate through middleware, even though the same token passed Supabase Auth and database RLS checks. Browser sign-in should be retested after dashboard settings are finalized.
- Temporary session-cookie compatibility remains in place as a bridge.
- Member invites, org switching, MFA enforcement, file uploads, billing, exports, AI, and advanced role management were not added.

## Remaining Auth / Account Work

Recommended next auth/account slices:

1. Complete manual Supabase dashboard auth settings and rerun browser-based sign-up/sign-in/reset tests.
2. Add invite acceptance and member removal flow for NGO teams.
3. Add org switching/current-org UX once multiple memberships are supported.
4. Add MFA enforcement for Mishava staff/admin roles, then NGO owner roles.
5. Remove or further narrow the temporary session-cookie bridge after Supabase browser auth is fully verified.

## Scope Confirmation

No Shopping, Business, Local, Gov, Corporate, Plus, AI, Stripe, report exports, file uploads, org switching, invites, MFA enforcement, billing, or advanced custom-role features were added in this slice.
