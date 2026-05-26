# NGO Full-Scale Slice 11B: Live Role-Change Smoke Result

Status: live-verified with fixes.

## Scope

This was a live role-change and permission smoke pass against the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.

No new product features were added.

## Live Fixture

Created isolated live smoke-test records:

- Organization: `45873aaa-cd3a-4a76-b09c-89b26829b315`
- Evidence item: `daa5fcec-3274-431f-b615-e03e73a1bbc7`
- Report: `d22bb438-94dc-420b-9056-5015fa8a2e48`

Live test users were created for:

- owner
- member
- member2
- member3
- viewer
- outsider

Secrets/passwords were kept in local temp storage only and were not committed.

## Browser Verification Note

The in-app browser successfully reached `localhost:3000`, but its text-entry path failed because the Browser Use virtual clipboard was unavailable. Because of that, the full browser-only click/type flow could not be completed.

To avoid blocking the smoke pass, the live verification was completed through:

- real Supabase Auth users;
- real live Supabase rows;
- live authenticated app-route HTTP checks against `localhost:3000`;
- live backend role-change helpers using authenticated Supabase clients.

This verifies live behavior against the real clean V2 project, but a later manual/browser pass should retest the exact click path once browser text input is available.

## Bugs Found And Fixed

### 1. Session Membership Scope Bug

Problem:

`readUserMemberships()` read active organization memberships without filtering by the signed-in user ID. Because org members can read membership rows for their organization, a viewer could inherit owner/admin roles from other active membership rows in the same org session.

Fix:

- `getAuthSessionFromAccessToken()` now passes the authenticated Supabase user ID into `readUserMemberships()`.
- `readUserMemberships()` now filters memberships by both:
  - `status = active`
  - `user_id = signed-in user id`

Result:

Viewer sessions no longer receive owner/admin capabilities.

### 2. Viewer Report Creation UI Bug

Problem:

`/org/reports` displayed the report creation form to viewers even though the server action would reject report creation.

Fix:

- `/org/reports` now checks `canManageNgoReports()`.
- Viewers see a read-only empty state instead of the create-report form.

Result:

Viewer report access is read-only in both UI and server action behavior.

## Pass / Fail Results

| Check | Result |
| --- | --- |
| Owner/admin can change a member role | Pass |
| Member/viewer cannot change roles | Pass |
| Last owner cannot be demoted | Pass |
| Last owner cannot be removed | Pass |
| Viewer cannot create/edit/archive evidence | Pass |
| Viewer cannot create/edit/share reports | Pass |
| Member can perform allowed member actions | Pass |
| Removed member loses access | Pass |
| Org switcher excludes removed/inactive memberships | Pass |
| Role change writes audit event | Pass |
| Existing org/evidence/report/share/team routes still render with expected access | Pass |
| Current org cookie is not authoritative | Pass |
| Non-admin remains blocked from `/admin/support` | Pass |

## Live Checks Performed

- Owner changed a member role from `ngo_member` to `ngo_admin`.
- Viewer attempted role change through the live helper and was blocked.
- Last-owner demotion was blocked.
- Last-owner removal was blocked.
- Owner removed a separate member.
- Removed member session reloaded with zero active memberships.
- Removed member with stale current-org cookie was redirected away from `/org/*`.
- Outsider with stale current-org cookie was redirected away from `/org/*`.
- Viewer app routes showed no team, evidence, report, or share mutation controls.
- Member app routes showed evidence/report creation controls but no team-management controls.
- Non-admin users were redirected away from `/admin/support`.
- Live audit events were confirmed for:
  - `team.member_role_changed`
  - `team.last_owner_change_blocked`
  - `team.member_removed`

## Tests Run

- `npm run typecheck` — passed after clearing stale ignored `.next` cache.
- `npm run lint` — passed.
- `npm test` — passed, 106/106 tests.
- `npm run build` — passed.

## Cache Note

The first typecheck run hit a stale ignored Next generated type file:

- `.next/types/routes.d 2.ts`

The ignored `.next` cache was cleared, then typecheck passed. No cache artifacts were committed.

## Migrations Applied

None.

No migration was required for the Slice 11B fixes.

## Live Verification Status

Role-change and permission behavior are live-verified against the clean V2 Supabase project through real Auth users, live database rows, authenticated app-route checks, and backend helper mutation checks.

The only caveat is that the exact browser click/type path still needs a manual/in-browser retest once Browser Use text entry is available.

## Remaining Role / Team Caveats

- Full manual browser click-through should be repeated when browser text entry works.
- Suspended/reactivated membership actions are still not implemented.
- There is still no richer confirmation modal for role changes.
- Future custom permissions remain intentionally deferred.

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

