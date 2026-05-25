# NGO Full-Scale Slice 2: Organization Switching And Current Org UX Plan

Status: planning only. Do not implement from this document directly.

Source of truth:

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-1a-auth-foundation-result.md`
- `docs/ngo-full-scale-slice-1b-auth-live-config-result.md`
- `docs/ngo-full-scale-slice-1b-browser-auth-retest-result.md`

## Goal

Plan the smallest safe organization switching flow so a signed-in user with one or more memberships can select the active organization and the app consistently scopes `/org/*` actions to that organization.

This slice should make the current organization obvious, changeable, and server-verified without letting a cookie, client state, URL, or stale membership grant access by itself.

## Context

Verified from Slice 1B:

- Supabase Auth browser sign-in works.
- `/app` is accessible after sign-in.
- NGO onboarding creates real rows.
- `/org/evidence` works after org selection/onboarding.
- Evidence creation works and writes audit events.
- Sign-out blocks `/org/evidence`.
- Non-admin access to `/admin/scoring` is blocked.
- Wrong-org access is blocked.

Still blocked before broad self-serve launch:

- Public sign-up is blocked by Supabase `429` rate limiting.
- Password reset is blocked by Supabase `429` rate limiting.
- Email confirmation/reset-link behavior must be retested after Supabase dashboard/email settings settle.

## Scope

Included:

- NGO current organization selection.
- Minimal organization switcher UX.
- Membership list read path.
- Current organization cookie/storage handling.
- Server-side current-org validation.
- Tests for org selection and wrong-org protection.

Excluded:

- Team invites.
- Member removal.
- Custom roles.
- SSO.
- MFA enforcement.
- Billing.
- File uploads.
- Report exports.
- AI.
- Shopping changes.
- Business, Local, Gov, Corporate, or Plus work.

## 1. Current Org Behavior

### Current Org After NGO Onboarding

After a user completes `/ngo/onboarding`, the app should:

- create the organization;
- create the `organization_memberships` row;
- create the `ngo_profiles` row;
- write the onboarding audit event;
- set the new organization as the current organization;
- redirect the user into the organization workspace.

Current behavior already sets `mishava_current_org_id` after onboarding. Slice 2 should keep that behavior but make it visible and recoverable.

### Current Org Storage

Recommended storage:

- Continue using the server-set `mishava_current_org_id` cookie.
- Cookie should remain HTTP-only where possible.
- Cookie should store only the selected organization ID.
- Cookie must never be treated as authorization by itself.

Server source of truth:

- Supabase Auth user identity.
- `organization_memberships` rows for that user.
- RLS policies and server helper checks.

### Current Org Change

The switch action should:

1. require a signed-in user;
2. receive the requested `organization_id`;
3. query memberships for the signed-in user;
4. confirm the requested org is an active membership;
5. set `mishava_current_org_id`;
6. redirect back to the intended workspace route or `/org/profile`.

If the selected org is not valid, the action should:

- clear the invalid current org cookie if needed;
- redirect to `/app?org=required` or a future organization selection screen;
- avoid revealing private details about the requested organization.

### How `/org/*` Reads Current Org

`/org/*` should continue to use `requireCurrentOrganizationMembership`.

Expected behavior:

- read the current organization cookie;
- load the signed-in user's memberships from Supabase Auth-aware server helpers;
- confirm the current org is in those memberships;
- return the authenticated session and organization ID;
- redirect to `/?auth=organization_required` or a later org-selection page if invalid.

### Missing Current Org

If the user has no current org cookie:

- If the user has exactly one active membership, the server helper may treat that org as selected for read-only route access.
- The UI should still set the cookie at the first safe opportunity so the workspace header is consistent.
- If the user has multiple memberships, redirect to org selection.
- If the user has no memberships, send them to NGO onboarding or a clear "create or join an organization" state.

### Invalid Or Stale Current Org

If the current org cookie points to an org where the user is no longer an active member:

- do not allow access;
- clear or overwrite the stale cookie;
- show an honest message such as "Choose an organization to continue";
- do not disclose whether the stale organization exists.

## 2. Org Switcher UI

### Minimal Placement

Recommended first placement:

- App shell/header workspace area for signed-in users.
- Organization workspace header on `/org/*`.

Minimal display:

- current org name;
- current role label if available;
- switch control when the user has more than one membership;
- link to organization profile.

Recommended label:

- `Workspace`
- `Current organization`

Avoid:

- making it look like a marketplace account selector;
- exposing internal IDs;
- showing inactive/removed organizations;
- adding team invite or billing controls in this slice.

### Switcher Pattern

Use a simple form/dropdown first:

- label: `Current organization`
- select: organization names from active memberships;
- submit button: `Switch`

Future refinement:

- menu-style account switcher;
- search/filter for users with many organizations;
- create/join organization entry point.

### Create Another Org Link

Do not include "Create another organization" in the first implementation unless needed for testing. If included later, it should point to `/ngo/onboarding` with clear language that each org is separate and private.

## 3. Membership Scope

Membership query should return only organizations where:

- `organization_memberships.user_id = auth.uid()`;
- membership is active, if an active/status field exists;
- organization is not archived, if an archived/status field exists.

Current schema may not yet have membership status. If missing, Slice 2 can:

- use existing membership rows as active;
- document that membership status/removal belongs to the team invite/removal slice;
- avoid adding status unless absolutely needed for org switching.

Data needed by the switcher:

- organization ID;
- organization name/public name;
- organization type;
- role;
- membership created date if useful for sorting.

Sorting:

- current org first;
- then organization name ascending;
- later: recently used.

## 4. Access And Security Rules

Required rules:

- A user can switch only to an organization where they are a member.
- A non-member org selection must fail.
- Removed/inactive membership must fail once membership status exists.
- Current org cookie/storage must not override RLS.
- Server-side membership check remains authoritative.
- Wrong-org URL/cookie access remains blocked.
- Sign-out clears the current organization cookie.

Implementation principles:

- All switch actions must run server-side.
- Do not trust client-supplied org name, role, or membership state.
- Do not show private org details for organizations outside the user's memberships.
- Keep service-role usage out of normal user switching.
- Use Supabase Auth-aware server client where user RLS should apply.

Recommended invalid selection behavior:

- return a generic failure;
- clear stale org cookie;
- redirect to `/app?org=invalid` or future `/app/organizations`.

## 5. Audit Logging

Recommendation:

- Do not write an audit event for every normal org switch.

Reason:

- Switching workspaces is frequent and not itself a trust/evidence mutation.
- Logging every switch would create noisy audit trails.

Audit events should be required later for:

- organization creation;
- membership invitation;
- membership acceptance;
- membership removal;
- role changes;
- suspicious or repeated failed org selection attempts, if security monitoring is added.

Optional later security log:

- write lower-level security telemetry for repeated invalid org selections, not normal audit events.

## 6. Tests Required

Automated tests should cover:

- user with one org lands in that org;
- user with multiple orgs can switch;
- non-member org cannot be selected;
- stale current org is cleared or rejected;
- `/org/evidence` uses selected org;
- `/org/reports` uses selected org;
- wrong-org access remains blocked;
- sign-out clears current org;
- build/lint/test pass.

Browser/manual checks should cover:

- sign in;
- see current organization name;
- switch organization when multiple memberships exist;
- confirm `/org/evidence` changes context;
- confirm `/org/reports` changes context;
- sign out and confirm `/org/*` is blocked.

## 7. Non-Goals

Slice 2 must not include:

- invites or team management;
- custom roles;
- SSO;
- MFA enforcement;
- billing;
- file uploads;
- exports;
- AI;
- Shopping changes;
- Business, Local, Gov, Corporate, or Plus work;
- public organization directory behavior;
- organization analytics.

## 8. Acceptance Criteria

Slice 2 can be accepted only if:

- active org selection is clear;
- current org name is visible in the workspace;
- a signed-in user with one org has a usable current-org path;
- a signed-in user with multiple orgs can switch safely;
- server-side checks remain authoritative;
- current org cookie cannot grant access by itself;
- existing NGO onboarding, evidence, reports, and sharing still work;
- wrong-org protections remain intact;
- sign-out clears current org;
- tests are defined before implementation and pass during implementation.

## Recommended Implementation Order

1. Add membership listing helper for the signed-in user.
2. Add server action to switch current organization.
3. Add minimal workspace/org switcher UI.
4. Update `/app` or `/org/*` header to show current org.
5. Handle missing/stale org states cleanly.
6. Add tests for switch success, non-member rejection, stale cookie handling, and existing org route behavior.
7. Run browser smoke test using two organizations for one user.

## Open Questions Before Implementation

- Should the first switcher live in the global header, only the `/org/*` workspace header, or both?
- Should users with one organization see a static org label or a disabled selector?
- Should `/app` become the default org-selection landing page for users with multiple orgs?
- Do we want to add membership `status` now, or defer it to the team invite/removal slice?
