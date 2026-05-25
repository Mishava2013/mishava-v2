# NGO Full-Scale Slice 2 Result: Organization Switching and Current Org UX

## Status

Implemented and locally verified.

## What Was Implemented

- Added a server-side organization switch action for authenticated users.
- Added a reusable organization switcher UI for authenticated app/org workspaces.
- Added current organization state resolution that:
  - uses the current organization cookie only as convenience state;
  - falls back to the only active membership when safe;
  - marks stale selections when the selected organization is no longer in the user's memberships;
  - only lists organizations from the signed-in user's active memberships.
- Updated `/app` and `/org/*` layouts to show the current organization context.
- Updated `/org/*` route behavior so middleware no longer trusts or requires a current-org cookie before the server-side membership check runs.
- Updated `requireCurrentOrganizationMembership()` to reject stale or missing multi-org selections with `/app` guidance.
- Added `/app` notices for invalid or missing organization selection.
- Confirmed sign-out already clears auth cookies and the current organization cookie through `clearAuthCookies()`.

## Migrations Applied

None.

This slice did not require database schema changes and did not touch either Supabase project.

## Tests Run

- `npm test` - passed, 63 tests.
- `npm run lint` - passed.
- `npm run build` - passed.

## Live Checks Performed

No new live Supabase migration or live database mutation was required for this slice.

Existing live-verified foundations remain the source of truth for:

- Supabase Auth browser sign-in
- NGO onboarding
- evidence creation
- wrong-org blocking
- non-admin blocking

## Known Limitations

- Organization switching is limited to active memberships already present in the authenticated session.
- The current schema treats an active membership as an existing `organization_memberships` row. A separate inactive/suspended membership status is still a later team-management enhancement.
- Team invites, member removal, role changes, and custom roles are not part of this slice.
- Normal org switches are not audit-logged by design; security-sensitive membership and data changes remain the audit focus.
- The switcher redirects to the workspace route supplied by the layout rather than preserving every nested page path.
- Public sign-up and password reset still require later retesting after Supabase rate limiting clears, as noted in the Slice 1B browser auth retest result.

## Remaining Auth / Account / Team Work

- Team member invites.
- Member removal and role management.
- MFA rollout decisions and enforcement.
- Org switching refinement for preserving exact nested return paths.
- Hosted auth production settings and broader live self-serve testing.

## Scope Confirmation

This slice did not add:

- team invites
- billing
- file uploads
- report exports
- AI
- Shopping
- Business
- Local
- Gov
- Corporate
- Plus
- scoring behavior changes
