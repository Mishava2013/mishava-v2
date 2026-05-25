# NGO Full-Scale Slice 1: Auth And Account Readiness Plan

Status: planning only. Do not implement from this document directly.

Source of truth:

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-pilot-readiness-reaudit.md`
- `docs/release-2-5-live-verification-result.md`

## Goal

Plan the first full-scale NGO readiness slice: replacing or hardening the temporary auth abstraction with a real account/auth model suitable for self-serve NGO use.

This slice should make NGO accounts safer, more durable, and more understandable without breaking the live-verified NGO foundation:

- organization onboarding
- evidence creation
- private draft reports
- scoped report sharing
- org isolation
- RLS-backed privacy
- audit events

## Scope

This plan is limited to NGO auth and account readiness.

Do not build in this slice:

- Shopping
- Business
- Local
- Gov
- Corporate
- Plus
- AI workflows
- Stripe or billing
- report exports
- file uploads
- final scoring math

## 1. Auth Provider Decision

### Recommended Path: Supabase Auth

Use **Supabase Auth** for Slice 1.

Reasoning:

- Mishava V2 already uses Supabase as the application database and live RLS foundation.
- Existing tables already map naturally to Supabase Auth users:
  - `organization_memberships.user_id`
  - `audit_events.actor_user_id`
  - `ngo_reports.created_by`
  - `ngo_share_grants.granted_by`
  - `ngo_share_grants.revoked_by`
- Current RLS policies and helper patterns are already designed around Supabase-style user identity checks.
- Supabase Auth keeps the app closest to the live-verified Release 2.5 foundation.
- It reduces migration risk compared with introducing a second identity provider immediately.
- It supports the account flows Mishava needs for the first self-serve NGO path:
  - email/password sign-up
  - sign-in/sign-out
  - password reset
  - email verification
  - magic link or OTP support if enabled
  - MFA support for sensitive users
  - session handling that can be used by middleware and server actions

Implementation note:

Before implementation, confirm the exact enabled Supabase Auth features and pricing for the active `mishava-v2-dev` project. The architecture should not depend on a feature until it has been verified in the project settings.

### Clerk Evaluation

Clerk remains a reasonable later option if Mishava outgrows Supabase Auth for organization UX or enterprise identity.

Strengths:

- polished sign-in/sign-up components
- built-in organization/workspace concepts
- MFA and SSO readiness
- strong account management UI

Risks for Mishava Slice 1:

- higher migration cost from the current Supabase/RLS model
- requires careful mapping from Clerk identity to Supabase RLS
- may require custom JWT claims or a separate user mapping layer
- adds a second critical identity system before NGO is fully stable

Recommendation:

Do not use Clerk for Slice 1 unless Supabase Auth cannot support the required NGO pilot-to-scale flows. Revisit Clerk when Mishava needs advanced SSO, SCIM, or richer organization administration than Supabase Auth plus Mishava's own membership tables can support.

### Other Providers

Do not introduce another provider for Slice 1 unless a specific institutional requirement makes it necessary.

Adding a third path would increase security, RLS, migration, and support complexity before Mishava has finished its core NGO workflows.

## 2. Required NGO Auth Flows

Slice 1 should plan for these user-facing flows:

### Sign Up

Required behavior:

- user creates account with email/password
- email verification is sent if enabled
- user cannot access private org data before authentication is valid
- user can create a new NGO organization after sign-up
- organization creator becomes initial owner/admin
- org creation writes audit events

Suggested routes:

- `/auth/sign-up`
- `/auth/callback`
- `/ngo/onboarding`

### Sign In

Required behavior:

- user signs in with email/password
- optional magic link support can be enabled if useful
- successful sign-in redirects to `/app` or current organization workspace
- failed sign-in uses safe, non-leaky error messages

Suggested route:

- `/auth/sign-in`

### Sign Out

Required behavior:

- user can sign out from account menu
- current org selection is cleared or made unusable after session ends
- private org routes redirect/block after sign-out

### Password Reset

Required behavior:

- user can request password reset
- reset link returns through an auth callback
- new password flow has clear success/error states
- reset does not expose whether an email belongs to an account beyond normal safe messaging

Suggested route:

- `/auth/reset-password`

### Email Verification

Required behavior:

- support verified email before sensitive NGO actions if enabled
- show clear state if the user needs to verify email
- allow resend verification email

Decision before implementation:

- whether email verification is required before creating an NGO org
- whether it is required only before inviting members or sharing reports

Recommended first setting:

- require verified email before inviting members, sharing reports, or admin-like NGO actions
- allow onboarding draft start after account creation if the user is authenticated

### MFA

Required behavior:

- MFA support for Mishava admins and sensitive roles
- optional MFA setup for NGO admins/owners
- account recovery path for locked-out users

Recommended first setting:

- require MFA for Mishava internal/admin roles
- offer MFA to NGO owners/admins
- consider requiring MFA for NGO owners before broad self-serve launch

### Invited User Acceptance

Required behavior:

- invited user receives invitation by email
- invited user signs in or creates an account
- invitation can be accepted only by the intended email/account
- accepted invite creates membership
- acceptance writes audit event
- expired or revoked invites cannot be accepted

### Account/Profile Basics

Required behavior:

- account menu displays signed-in email
- user can see current organization
- user can access account basics
- org role is visible where relevant
- support/help path exists for locked-out or incorrect-account situations

## 3. Organization / Account Model

### Canonical Identity

Use Supabase `auth.users.id` as the canonical user id for application permissions.

Application records should continue to use the existing membership model:

- `organizations` stores the organization workspace.
- `organization_memberships` links auth users to organizations.
- `ngo_profiles` stores NGO-specific profile details by `organization_id`.
- audit records reference the acting auth user where available.

### Memberships

Memberships should remain the source of truth for organization access.

Minimum membership fields required or verified:

- `organization_id`
- `user_id`
- `role_code`
- `status`
- `created_at`
- `created_by` where available

Recommended statuses:

- `active`
- `invited`
- `removed`
- `suspended`

If existing status values differ, keep the current schema where safe and add only the minimum migration needed.

### Roles And Permissions

Use existing role codes first. Avoid inventing a large custom role system in Slice 1.

Minimum permission groups:

- organization owner/admin
- evidence contributor
- report manager
- viewer/read-only
- Mishava admin/internal reviewer

Role behavior:

- organization owner/admin can manage members and organization profile
- evidence contributor can add/edit evidence where permitted
- report manager can create/update reports and sharing grants
- viewer can read allowed org workspace data
- Mishava admin/internal reviewer can access admin-only surfaces through separate admin guardrails

Custom roles should be deferred unless an early NGO pilot proves they are necessary.

### Current Organization Selection

Current org selection may still use a cookie for convenience, but it must be treated only as a pointer.

Rules:

- selected org id must be verified against the signed-in user's active memberships on every protected server request
- a forged org cookie must not grant access
- org switching must list only organizations where the user is an active member
- if the selected org is invalid, redirect to org selection or onboarding

### Organization Switching

Plan support for users who belong to multiple NGOs or future networks.

Minimum behavior:

- list user's organizations
- set current organization
- block switching to orgs where membership is inactive or absent
- write audit event only if switching becomes a security-relevant action; otherwise normal selection can remain session-only

## 4. Route Protection Changes

### Preserve Helper Interface Where Possible

To avoid breaking live-verified workflows, keep a similar server-side helper shape while changing the internals from temporary cookies to Supabase Auth.

Recommended helper concepts:

- `getCurrentSession()`
- `requireAuthenticatedSession()`
- `requireCurrentOrganizationMembership()`
- `requireAdminSession()`
- `requireOrgPermission()`

The implementation can change, but routes/actions should keep clear protection calls.

### Protected Routes

`/app`

- requires authenticated user
- if no organization exists, direct user to onboarding or org creation

`/org/*`

- requires authenticated user
- requires active organization membership
- requires role permission for sensitive actions
- server actions must re-check membership and role

`/admin/*`

- requires authenticated user
- requires Mishava admin/methodology/admin-equivalent permission
- should be MFA-required for production admin use

`/shared/ngo-reports/*`

- must not expose the private org workspace
- should require either:
  - authenticated recipient whose email/user id matches the grant, or
  - a future secure tokenized access model
- revoked/expired grants must block access
- shared view must continue to expose only the selected report summary and allowed evidence summaries

### Middleware

Middleware should:

- redirect unauthenticated users away from private app/org/admin routes
- never be the only security layer
- pair with server-side route/action checks
- avoid authorizing sensitive actions from client state alone

## 5. Invite / Member Flow

### Minimal Invite Flow

Plan a new or verified invite model.

Recommended fields:

- `id`
- `organization_id`
- `email`
- `role_code`
- `status`
- `token_hash`
- `expires_at`
- `invited_by`
- `accepted_by`
- `accepted_at`
- `revoked_by`
- `revoked_at`
- `created_at`

Recommended statuses:

- `pending`
- `accepted`
- `revoked`
- `expired`

### Invite Behavior

Required behavior:

- organization owner/admin invites member by email
- inviter chooses role
- invite email is sent or generated through an approved email workflow
- invited person signs in or creates account
- invite is accepted only by matching email/account
- membership is created or activated
- invite cannot be reused after acceptance
- revoked/expired invites cannot be accepted
- all sensitive actions write audit events

### Remove / Revoke Member

Required behavior:

- organization owner/admin can remove a member
- removed user immediately loses org access
- removal writes audit event
- system prevents removing the last owner/admin without replacement
- user cannot remove themselves if doing so leaves the org unmanaged

### Role Changes

Required behavior:

- organization owner/admin can change role
- role change writes audit event
- role change takes effect immediately on next request
- admin-only roles cannot be assigned by normal NGO admins unless explicitly allowed

## 6. RLS / Security Implications

### User Id Mapping

Use `auth.uid()` as the DB-level identity source.

RLS should use membership checks rather than trusting client-provided organization ids.

### Organization Isolation

Rules:

- user can read private organization data only when an active membership exists
- user can write organization data only when role permits it
- wrong-org access must fail at the database level where possible
- app-level helper checks should reinforce RLS, not replace it

### Service Role Usage Boundaries

Current limitation:

- server workflows use a service-role-backed server client after app-level guards.

Slice 1 should reduce this risk where feasible.

Recommended direction:

- use Supabase authenticated server client for normal user-scoped reads/writes so RLS applies naturally
- reserve service role for system/admin workflows that truly require it
- document every remaining service-role-backed workflow
- add tests proving user actions cannot bypass org isolation through service-role helpers

### Admin Access

Admin access must be separate from NGO organization roles.

Rules:

- admin routes require explicit Mishava admin/methodology/admin-equivalent permission
- NGO owner/admin does not imply Mishava admin
- internal admin actions write audit events where sensitive
- MFA should be required before production admin access

### Shared Report Access

Shared report grants must not become broad org access.

Rules:

- recipient can see only the selected report summary
- raw evidence remains hidden by default
- full org workspace remains hidden
- revoked/expired grants block access
- access checks must include grant status and recipient identity

## 7. Migration / Data Implications

### Existing Tables To Review

Review these before implementation:

- `organizations`
- `organization_memberships`
- `ngo_profiles`
- `evidence_items`
- `structured_claims`
- `ngo_reports`
- `ngo_share_grants`
- `audit_events`
- any existing role/permission helper functions

### Likely Needed Changes

Potential additions:

- `organization_invites`
- `user_profiles` or `account_profiles`
- membership status fields if missing
- invite token hash and expiration fields
- optional current organization preference table or user metadata
- shared grant recipient user id if authenticated recipient identity should be stored after acceptance

### Existing Test Data

Before implementation:

- verify whether current live verification user ids exist in Supabase `auth.users`
- decide whether to preserve or archive test rows
- do not assume temporary-cookie users map cleanly to final auth users
- create dedicated Supabase Auth test users for future live verification

### Migration Risk

High-risk areas:

- converting route helpers without breaking onboarding/evidence/report/share flows
- replacing temporary org cookie behavior
- preserving RLS behavior while changing server clients
- maintaining scoped shared report recipient access
- ensuring audit events still capture the acting user

Mitigation:

- implement behind compatible helper interfaces
- keep old test coverage and add final-auth tests before deleting temporary auth code
- live-verify against `mishava-v2-dev / snnscnodegbyqexnopvf`
- do not touch old `mishava / tghbfautnxblfxrtkdqb`

## 8. Tests Required

Slice 1 implementation should add or update tests for:

- unauthenticated user is blocked from `/org/*`
- unauthenticated user is blocked from `/admin/*`
- signed-in non-member is blocked from org data
- org member can access own org data
- wrong-org access is blocked at route/action level
- wrong-org access is blocked by RLS where applicable
- invited user can accept invite
- invite cannot be accepted by the wrong email/account
- revoked invite cannot be accepted
- expired invite cannot be accepted if expiration is implemented
- removed user loses access
- role changes affect permissions
- admin route requires admin permission
- NGO owner/admin is not automatically Mishava admin
- shared report recipient access still works safely
- revoked/expired shared report grants remain blocked
- invite/member/account changes write audit events
- service-role-backed workflows do not allow user-scoped RLS bypass
- existing NGO onboarding/evidence/report/sharing tests still pass
- `npm test`
- `npm run lint`
- `npm run build`

Live verification should confirm:

- Supabase Auth user can sign up/sign in
- org onboarding creates org/profile/membership rows tied to auth user
- org evidence/report/share flows still persist rows
- wrong-org DB reads are blocked
- old Supabase project remains untouched

## 9. Non-Goals

Do not include in Slice 1:

- billing
- Stripe
- file uploads
- AI workflows
- report exports
- Plus
- Shopping changes
- Business/Local/Gov/Corporate work
- final scoring math
- full SSO rollout unless Supabase configuration makes a narrow setup trivial
- SCIM provisioning
- advanced custom roles
- public report library
- production email branding beyond what auth/invite flows minimally require

## 10. Implementation Slices

Recommended implementation order:

### Slice 1A: Auth Provider Setup And Compatibility Layer

- configure Supabase Auth in the app
- add auth callback/reset routes
- implement session helper internals
- keep existing route helper interfaces where possible
- keep old temporary auth only behind test/dev compatibility if needed

Acceptance:

- authenticated session can be read server-side
- existing protected routes still block unauthenticated users

### Slice 1B: Sign-Up, Sign-In, Sign-Out, Password Reset

- add user-facing auth pages
- add clear error/success states
- add email verification handling if enabled
- add account menu sign-out

Acceptance:

- new user can create account and sign in without manual cookies

### Slice 1C: Organization Creation And Current Org Selection

- tie `/ngo/onboarding` to authenticated user
- create membership for org creator
- validate current org selection against membership
- add org switcher if user has multiple orgs

Acceptance:

- authenticated user can create NGO org and access only that org

### Slice 1D: Route And Server Action Hardening

- replace temporary cookie assumptions in `/app`, `/org/*`, `/admin/*`
- re-check permissions in server actions
- reduce service-role usage for normal user workflows where feasible

Acceptance:

- wrong-org and wrong-role tests pass at route/action/RLS levels

### Slice 1E: Invite And Member Management

- add invite model
- invite member by email
- accept invite
- revoke invite
- remove member
- assign/change role
- write audit events

Acceptance:

- NGO can manage a small team without founder/manual DB help

### Slice 1F: MFA And Admin Hardening

- require or enforce MFA for Mishava internal/admin roles
- optionally enable MFA setup for NGO owners/admins
- document recovery flow

Acceptance:

- sensitive admin access has stronger protection without locking out legitimate operators

### Slice 1G: Shared Report Recipient Access Review

- ensure shared report grants work with final auth identity
- optionally add recipient user id once recipient accepts invite/account
- preserve scoped summary-only access

Acceptance:

- shared reports remain private-by-default and grant-limited under final auth

## Risks

| Risk | Level | Mitigation |
| --- | --- | --- |
| Breaking live-verified NGO workflows | High | Keep helper interfaces stable; migrate internals incrementally; run full NGO tests after each slice. |
| RLS bypass through service-role workflows | Critical | Prefer authenticated server clients for user-scoped actions; document and test remaining service-role paths. |
| Temporary users do not map cleanly to Supabase Auth users | High | Create dedicated auth test users; reconcile or archive temporary test records. |
| Invite flow creates unauthorized membership | High | Match invite email to authenticated account; use token hashes; audit acceptance. |
| Removed users retain session access | High | Check membership on every request/action; do not cache permissions without revalidation. |
| Shared report access exposes too much | High | Keep grants report-scoped; never expose full org workspace or raw evidence by default. |
| MFA creates lockout risk | Medium | Add recovery process and staged MFA rollout for admins first. |
| Auth provider cost/features differ from assumptions | Medium | Verify project settings and current pricing before implementation. |
| Tests become too dependent on hosted auth | Medium | Use test helpers for unit tests and live-auth smoke tests for real provider behavior. |

## Acceptance Criteria

This plan is accepted only if:

- it recommends an auth path
- it preserves existing RLS and organization privacy goals
- it avoids breaking current live-verified NGO workflows
- it keeps service-role usage controlled and explicit
- it defines tests before implementation
- it identifies auth migration risks before code changes
- it keeps the work NGO-only
- it does not implement code

Recommended decision:

Proceed with Supabase Auth as the first full-scale NGO auth/account path, then revisit Clerk or enterprise identity options only after NGO self-serve workflows and RLS-backed privacy remain stable under real users.
