# NGO Full-Scale Slice 11: Role Permissions Result

Status: implemented and locally verified.

## What Was Implemented

- Added a central NGO role/permission matrix in `src/lib/ngo-permissions.ts`.
- Rewired NGO auth helpers to use the central matrix for:
  - team management;
  - evidence management;
  - report management;
  - workspace viewing.
- Added audited role-change support for active NGO team members.
- Added last-owner protection for role demotion and removal.
- Added a blocked-attempt audit event for last-owner removal or demotion attempts.
- Improved `/org/team` to show:
  - role labels;
  - permission summaries;
  - active/removed/suspended labels;
  - owner/admin-only role-change actions;
  - owner/admin-only remove actions;
  - clear role-change audit/last-owner guidance.
- Added a shared screen-reader-only utility class for accessible form labeling.
- Added Slice 11 tests for the permission matrix, role-change helper, team UI, audit guardrails, and centralized permission use.

## Permission Matrix

Launch roles remain fixed enum roles:

- `ngo_owner`
- `ngo_admin`
- `ngo_member`
- `ngo_viewer`

The matrix covers:

- `manage_team`
- `manage_billing`
- `create_evidence`
- `edit_evidence`
- `archive_evidence`
- `upload_files`
- `create_reports`
- `edit_reports`
- `share_reports`
- `view_reports`
- `view_evidence`
- `view_billing`
- `view_audit_summary`
- `admin_support`

No enterprise custom-role builder was added. The helper is structured so future custom permissions can be layered in later without rewriting every route.

## Membership Status Handling

Existing supported statuses remain:

- `active`
- `removed`
- `suspended`

Removed and suspended memberships remain blocked by active-membership session loading and server-side organization checks. The org switcher continues to rely on active session memberships, so inactive memberships are excluded from switch options and stale current-org selections are rejected.

Evidence, reports, shares, file uploads, and audit events remain traceable to their original creator/user IDs even if a member is removed later.

## Migrations Applied

None.

No database schema change was required for Slice 11. Role values, membership statuses, invite statuses, and audit events were already supported.

## Live Checks Performed

No live Supabase mutation checks were run for this slice.

The implementation is local-code verified only. It does not require migration application and does not touch the old Supabase project.

## Tests Run

- `npm test` — passed, 105/105 tests.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed.

## Known Limitations

- Role changes are implemented, but there is no richer confirmation modal. The inline form text clearly states that changes affect permissions and are audited.
- Suspended/reactivated membership actions are not implemented yet. Suspended status is respected and labeled when present.
- Role-change browser/live Supabase checks should be included in a later end-to-end launch pass.
- The central matrix is code-based. Database-backed custom permissions are intentionally deferred.

## Remaining Role/Team Work

- Optional suspend/reactivate workflow.
- Optional richer role-change confirmation UI.
- Optional NGO-facing audit summary view.
- Future custom-permissions model only if real customer needs justify it.
- Later full-scale launch audit should browser-test role changes with real Supabase users.

## Scope Confirmation

This slice did not add:

- production Stripe;
- report exports;
- malware scanning;
- AI evidence parsing;
- SOC 2 / ISO / VPAT implementation;
- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- SSO;
- MFA enforcement;
- enterprise custom-role builder;
- billing seats;
- broad admin analytics.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.

