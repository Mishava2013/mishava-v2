# NGO Full-Scale Slice 1B: Supabase Auth Live Configuration Plan

Status: planning only. Do not implement from this document directly.

Source of truth:

- `docs/ngo-full-scale-slice-1a-auth-foundation-result.md`
- `docs/ngo-full-scale-slice-1-auth-account-plan.md`
- `docs/ngo-full-scale-readiness-gap-plan.md`

## Goal

Plan the remaining Supabase dashboard and auth configuration required before broader live auth testing for Mishava NGO.

Slice 1A added the code foundation for Supabase Auth. Slice 1B should make sure the Supabase project is configured safely enough to test real sign-up, sign-in, sign-out, password reset, email confirmation, NGO onboarding, route protection, and scoped shared report access.

This is a configuration and verification planning slice only.

## Scope

This plan covers:

- Supabase dashboard settings
- redirect URL configuration
- email confirmation decision
- auth email template planning
- MFA rollout planning
- live auth test path
- configuration risks
- what must be done manually in Supabase
- what Codex can verify after configuration

This plan does not implement:

- Shopping
- Business
- Local
- Gov
- Corporate
- Plus
- AI workflows
- Stripe
- report exports
- file uploads
- advanced custom roles
- member invites
- org switching UI

## 1. Supabase Dashboard Settings To Confirm

Project:

- Name: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Do not modify:

- Old project: `mishava / tghbfautnxblfxrtkdqb`

### Site URL

Confirm the Supabase Auth Site URL.

Recommended development value:

- `http://localhost:3000`

Future staging placeholder:

- `https://staging.mishava.com`

Future production placeholder:

- `https://mishava.com`

Decision:

- For current development, use the local dev URL.
- Before production launch, update Site URL to the production application URL and keep local/staging in the redirect allow-list only where appropriate.

### Allowed Redirect URLs

Add or confirm these URLs in Supabase Auth settings.

Local development:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/update-password`
- `http://127.0.0.1:3000/auth/callback`
- `http://127.0.0.1:3000/auth/update-password`

Future staging placeholders:

- `https://staging.mishava.com/auth/callback`
- `https://staging.mishava.com/auth/update-password`

Future production placeholders:

- `https://mishava.com/auth/callback`
- `https://mishava.com/auth/update-password`

If Vercel preview deployments are used later, decide whether to add a limited preview redirect pattern or keep auth testing restricted to staging and production.

### Auth Providers

For Slice 1B, enable only the needed email provider behavior.

Recommended now:

- email/password enabled
- email confirmation configured according to the dev decision below
- password reset enabled

Defer:

- social login
- enterprise SSO
- passkeys
- magic links unless needed for pilot testing

Reason:

Mishava NGO needs clear, trustworthy account access first. Additional sign-in methods can be added after the baseline account model is live-verified.

## 2. Email Confirmation Decision

### Option A: Require Email Confirmation Now

Pros:

- safest real-world behavior
- prevents unverified emails from creating sensitive NGO workflows
- better match for institutional trust expectations

Cons:

- can slow development testing
- failed email template or redirect setup can block test users
- local testing may be more cumbersome

### Option B: Disable During Dev Only

Pros:

- fastest local and live development testing
- reduces friction while auth flows are still being adjusted
- avoids blocking tests on email delivery during early configuration

Cons:

- less representative of production behavior
- easy to forget to re-enable before production
- weaker account integrity during shared demos if not carefully limited

### Option C: Enable Before Production

Pros:

- keeps development smooth now
- gives time to polish email templates and redirect behavior

Cons:

- delays verification of production-like auth behavior
- can hide email confirmation issues until late

### Recommendation

Recommended development setting:

- Disable mandatory email confirmation during early local development if it blocks testing.
- Use clearly marked test users only.
- Do not treat dev-auth behavior as production-ready.

Recommended controlled pilot setting:

- Require email confirmation before report sharing, member management, or sensitive NGO actions.
- If dashboard-level confirmation is not yet required globally, enforce sensitive-action verification in later app logic.

Recommended production setting:

- Require email confirmation.
- Require verified email before:
  - creating share grants
  - accepting member invites
  - managing organization members
  - changing sensitive organization settings
  - accessing admin/support roles

Key rule:

If email confirmation is disabled during development, record that as a temporary configuration choice and add it to the launch checklist before external access expands.

## 3. Auth Email Templates

Tone guidance for all templates:

- clear
- trustworthy
- no marketing fluff
- calm
- specific about account access
- aligned with Mishava's trust/access language
- no paid-ranking or promotional language

Avoid:

- "exclusive"
- "premium access"
- urgency tricks
- sales language
- vague trust claims

### Confirm Signup

Purpose:

- confirm the user's email address
- establish that this account may be used to manage NGO evidence, reports, and scoped sharing

Suggested subject:

- `Confirm your Mishava account`

Suggested body direction:

- "Confirm this email to finish setting up your Mishava account."
- "Mishava uses verified accounts to protect organization evidence, reports, and scoped sharing."
- Include a single confirmation button.
- Include a plain fallback URL.
- If the user did not request the account, tell them to ignore the email.

### Magic Link

Use only if magic links are enabled.

Suggested subject:

- `Sign in to Mishava`

Suggested body direction:

- "Use this link to sign in to Mishava."
- "This link should only be used by the person who requested it."
- Avoid implying any trust status or approval.

### Password Reset

Suggested subject:

- `Reset your Mishava password`

Suggested body direction:

- "Use this link to choose a new password."
- "This helps protect NGO evidence, reports, and private organization workspaces."
- If the user did not request a reset, tell them they can ignore the email.
- Include expiration language if Supabase provides it.

### Email Change

Use if email-change flow is enabled.

Suggested subject:

- `Confirm your Mishava email change`

Suggested body direction:

- clearly state that the account email is being changed
- tell the user to contact support if they did not request the change
- avoid exposing private org details in the email

## 4. MFA Rollout

### Required For Admin / Support Roles

MFA should be required before production for:

- `mishava_admin`
- `methodology_owner`
- `support`
- any future internal reviewer role with sensitive access

Reason:

These roles can access or influence sensitive trust operations, support workflows, or administrative views.

### Required For NGO Admins Before Full-Scale Launch

MFA should be required or strongly enforced for:

- NGO owner/admin roles
- users who manage team access
- users who create scoped share grants
- users who approve or publish sensitive report states once those features exist

Recommended path:

1. Offer MFA to NGO owners/admins during early pilot.
2. Require MFA for NGO owners/admins before full-scale self-serve launch.
3. Add recovery workflow before enforcing broadly.

### Optional For Regular NGO Members At First

Regular NGO members can initially use optional MFA if they only add or view non-sensitive data.

Later, require MFA for users who:

- manage private evidence
- access raw evidence files
- export reports
- approve share grants
- handle sensitive or restricted evidence

### Future Institutional / Gov / Corporate Readiness

MFA should be part of the longer readiness path for:

- institutional customers
- Gov
- Corporate
- media/research access
- enterprise procurement access
- audit/review staff

Future needs:

- SSO
- organization-level MFA enforcement
- session timeout settings
- admin session review
- access review reports

## 5. Live Auth Test Path

Run this only after dashboard settings are configured.

### Test User Setup

1. Create test user A through `/auth/sign-up`.
2. Confirm email if confirmation is enabled.
3. Sign in through `/auth/sign-in`.
4. Confirm auth cookies are set locally.
5. Sign out through `/auth/sign-out`.
6. Confirm `/app` blocks or redirects after sign-out.

### Password Reset

1. Request reset from `/auth/reset-password`.
2. Confirm email is received.
3. Follow reset link.
4. Update password at `/auth/update-password`.
5. Sign in with the new password.

### NGO Onboarding

1. Sign in as test user A.
2. Open `/ngo/onboarding`.
3. Create a test NGO org.
4. Confirm rows:
   - `organizations`
   - `organization_memberships`
   - `ngo_profiles`
   - `audit_events`
5. Confirm membership `user_id` matches Supabase Auth user id.
6. Confirm current organization selection is set.
7. Open `/org/evidence`.

### Route Protection

1. Open `/org/evidence` while signed out.
   - Expected: blocked/redirected.
2. Open `/app` while signed out.
   - Expected: blocked/redirected.
3. Open `/admin/scoring` as a non-admin user.
   - Expected: blocked/redirected.
4. Create test user B.
5. Try accessing user A's org with user B.
   - Expected: wrong-org access blocked.
6. Confirm blocking happens through app guard and database/RLS behavior where applicable.

### Shared Report Recipient Access

1. Create a private NGO report as test user A.
2. Create a share grant to recipient email B.
3. Sign in as test user B.
4. Open the shared report URL.
5. Confirm test user B can see only:
   - report summary
   - allowed evidence summaries
   - selected accepted claims where available
6. Confirm test user B cannot see:
   - full org workspace
   - raw evidence by default
   - unrelated reports
7. Revoke the grant.
8. Confirm test user B is blocked.

## 6. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Redirect misconfiguration | Users cannot confirm email or reset passwords. | Add local, staging, and production URLs intentionally; test each configured path. |
| Email template confusion | Users misunderstand whether they are verified, approved, or trusted. | Use plain account-access language and avoid trust-score or marketing claims. |
| Email confirmation blocks test users | Dev testing slows or appears broken. | Disable confirmation only for dev if needed; document and re-enable before production. |
| Temporary cookie fallback masks auth problems | Tests pass using old cookie behavior while real auth is broken. | Run explicit live-auth tests with no `mishava_session` cookie. |
| Service-role overuse | User workflows bypass RLS, hiding authorization problems. | Continue moving user-scoped workflows to authenticated clients and test RLS directly. |
| Shared report recipient mismatch | Recipient cannot access valid share or wrong recipient gains access. | Match authenticated recipient email/user id to grant; test revoked/expired grants. |
| MFA rollout causes lockouts | Admin/support or NGO owners lose access. | Add recovery playbook before enforcing MFA broadly. |
| Production URLs added too early or too broadly | Preview URLs or untrusted domains can receive auth redirects. | Keep redirect allow-list tight and reviewed before launch. |

## Dashboard Checklist

Manual Supabase dashboard actions:

- Confirm project is `mishava-v2-dev / snnscnodegbyqexnopvf`.
- Confirm Site URL.
- Add local redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/update-password`
  - `http://127.0.0.1:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/update-password`
- Add staging placeholders only when staging exists.
- Add production placeholders only when production domain is ready.
- Confirm email/password provider is enabled.
- Decide current email confirmation setting.
- Configure confirm signup email template.
- Configure password reset email template.
- Configure magic-link email template only if magic links are enabled.
- Configure email-change template if email changes are enabled.
- Confirm email rate limits are acceptable for testing.
- Confirm MFA settings and supported factors.

## Recommended Dev Settings

Recommended for `mishava-v2-dev`:

- Site URL: `http://localhost:3000`
- Email/password enabled.
- Password reset enabled.
- Email confirmation may be disabled during early dev if it blocks testing.
- If email confirmation is enabled, test it immediately with `/auth/callback`.
- MFA optional during dev except for internal admin testing.
- Redirect allow-list limited to local dev URLs until staging exists.

Important:

If email confirmation is disabled during dev, note this clearly in launch readiness docs and do not treat dev behavior as production-ready.

## Recommended Production Settings

Recommended before production:

- Site URL: production Mishava URL.
- Email confirmation required.
- Password reset enabled.
- MFA required for Mishava admin/support roles.
- MFA required or strongly enforced for NGO owners/admins.
- Redirect allow-list limited to approved production and staging URLs.
- Auth templates reviewed for clarity, privacy, and trust language.
- Account recovery/support process documented.
- Security and privacy pages published.
- Auth logs included in support/security review process.

## What Must Be Done Manually In Supabase Dashboard

Codex cannot safely complete these without direct dashboard access or explicit user-driven configuration:

- set Site URL
- set allowed redirect URLs
- enable/disable email confirmation
- edit auth email templates
- configure email provider/sender details
- configure MFA settings
- review email rate limits
- confirm production/staging redirect domains when available

## What Codex Can Verify After Settings Are Configured

After the dashboard is configured, Codex can verify:

- sign-up route creates a Supabase Auth user
- sign-in sets auth cookies
- sign-out clears auth cookies and blocks private routes
- password reset request sends successfully
- password update route works with valid session
- NGO onboarding creates expected rows tied to the Supabase Auth user
- `/org/*` blocks unauthenticated users
- wrong-org access is blocked
- `/admin/*` blocks non-admin users
- shared report recipient access still works
- revoked grants block access
- RLS policies behave with real Supabase Auth JWTs
- no service-role key is exposed to browser code
- old Supabase project remains untouched

## Acceptance Criteria For Slice 1B Implementation

Slice 1B implementation can be accepted only when:

- Supabase dashboard settings are confirmed.
- Live sign-up/sign-in/sign-out pass with real Supabase Auth user.
- Password reset flow is tested or dashboard blockers are documented.
- NGO onboarding works for a real Supabase Auth user.
- Route protection works without relying on the temporary `mishava_session` cookie.
- Wrong-org and non-admin access are blocked.
- Shared report recipient access remains scoped and private-by-default.
- Auth configuration choices are documented for dev and production.
- Old Supabase project remains untouched.
