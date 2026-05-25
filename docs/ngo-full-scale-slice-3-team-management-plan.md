# NGO Full-Scale Slice 3 Plan: Team Invites and Member Management

## Purpose

Plan the smallest safe team-management flow needed to move Mishava NGO closer to full-scale self-serve readiness.

This is planning only. Do not implement code, migrations, email delivery, billing seats, exports, AI, Shopping, Business, Local, Gov, Corporate, or Plus in this slice.

## Source of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-2-org-switching-result.md`
- `docs/ngo-full-scale-slice-1b-browser-auth-retest-result.md`
- `docs/ngo-pilot-readiness-reaudit.md`

## Current Context

Release status after Slice 2:

- Supabase Auth browser sign-in is verified enough for continued NGO account work.
- NGO onboarding creates organization, membership, profile, and audit rows.
- `/app`, `/org/*`, and `/admin/*` are protected.
- `/org/*` uses server-side membership checks.
- The current organization switcher now uses current org state as convenience only, not as authority.
- Team management is still display-only.

Known foundation limitation:

- `organization_memberships` currently treats an active membership as an existing row.
- The existing role enum includes `ngo_owner` and `ngo_member`, but does not yet include NGO admin/viewer roles.
- Public sign-up and password reset need another live retest after Supabase rate limits clear before broad self-serve launch.

## Slice Goal

Let an NGO owner/admin safely manage team access for one organization:

- view members;
- invite members;
- assign simple roles;
- accept/revoke invites;
- remove members;
- prevent removed members from accessing org data;
- preserve audit history for every team-sensitive action.

## 1. Team Page Readiness

`/org/team` should move from role-description scaffold to a real current-org team page.

Minimum display:

- current organization name from the selected org context;
- member name if available;
- member email;
- role;
- membership status;
- created date;
- invited date if applicable;
- accepted date if applicable;
- removed/revoked state if applicable;
- clear empty state when the org has only the current owner.

Suggested labels:

- `Owner`
- `Admin`
- `Member`
- `Viewer`
- `Pending invite`
- `Accepted`
- `Removed`
- `Revoked`
- `Expired`

The page should clearly say team changes affect access to private organization records.

## 2. Invite Flow

Minimum invite workflow:

1. NGO owner/admin opens `/org/team`.
2. Enters recipient email.
3. Selects role.
4. Optional note/purpose.
5. Creates an org-scoped invite.
6. Invite is pending and does not grant access yet.
7. Invited user signs in or signs up.
8. User accepts invite only if their authenticated email matches the invite email.
9. Accepting creates or activates an `organization_memberships` row.
10. Invite status changes to accepted.
11. Audit event is written.

Invite statuses:

- `pending`
- `accepted`
- `revoked`
- `expired`

Invite fields to plan:

```ts
type OrganizationInvite = {
  id: string;
  organization_id: string;
  email: string;
  role: "ngo_owner" | "ngo_admin" | "ngo_member" | "ngo_viewer";
  status: "pending" | "accepted" | "revoked" | "expired";
  note?: string | null;
  token_hash?: string | null;
  invited_by: string;
  accepted_by?: string | null;
  invited_at: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
  expires_at?: string | null;
};
```

Email behavior for this slice:

- Do not depend on production email delivery.
- It is acceptable for the first implementation to show a dev/test invite acceptance link on the team page.
- The invite acceptance link must not be treated as secure by itself; authenticated email matching must still be required.
- Real email sending can come later after Supabase email/rate-limit behavior is stable.

## 3. Roles

Use simple NGO roles first.

Planned role model:

| User-facing role | Internal role | Capabilities |
| --- | --- | --- |
| Owner | `ngo_owner` | Manage org profile, team, evidence, reports, sharing, and ownership-sensitive settings. |
| Admin | `ngo_admin` | Manage team except ownership transfer/last owner removal; manage evidence, reports, and sharing. |
| Member | `ngo_member` | Create and edit evidence/reports; create draft report materials; cannot manage team. |
| Viewer | `ngo_viewer` | Read-only access to allowed org workspace areas; cannot create/edit evidence, reports, sharing, or team settings. |

Recommended migration note:

- Add `ngo_admin` and `ngo_viewer` to `role_code`.
- Add the same roles to TypeScript role definitions and auth role parsing.
- Keep `ngo_owner` and `ngo_member` unchanged for existing data.

Permission helpers should be explicit:

- `canManageNgoTeam(session, organizationId)`
- `canManageNgoEvidence(session, organizationId)`
- `canManageNgoReports(session, organizationId)`
- `canViewNgoWorkspace(session, organizationId)`

Server-side checks must be authoritative. UI hiding is not permission enforcement.

## 4. Member Removal and Status

The current schema has no membership status. Slice 3 should add status without deleting history.

Recommended membership statuses:

- `active`
- `removed`
- `suspended`

Minimum implementation should support:

- owner/admin can remove a member;
- removed member immediately loses access to `/org/*` for that organization;
- removed membership does not appear in the org switcher as selectable;
- stale current org state is rejected by existing server-side membership checks;
- removing a member writes an audit event;
- removing the last owner is blocked.

Recommended migration note:

- Add `status` to `organization_memberships`, default `active`.
- Add `removed_at`, `removed_by`, and optional `status_reason`.
- Update membership reads to include only `status = 'active'`.
- Update RLS helper functions so removed/suspended memberships do not satisfy `is_org_member`.

Owner protection:

- The system should count active `ngo_owner` memberships before removal.
- It should block removal or role downgrade if it would leave the organization with zero active owners.
- The user should see a clear error: `At least one active owner is required.`

## 5. RLS and Security

RLS/security requirements:

- non-members cannot view team data;
- removed/suspended members are treated as non-members;
- viewer cannot invite, remove, or change roles;
- member cannot invite, remove, or change roles;
- only owner/admin can invite;
- only owner/admin can revoke invites;
- only owner/admin can remove members;
- owner-only actions remain owner-only if needed later;
- invite cannot be accepted by the wrong email;
- invite cannot be accepted for a different organization;
- current org cookie cannot grant access;
- service-role usage remains limited to server-side privileged workflows with app-level authorization first.

Invite acceptance security:

- verify authenticated user exists;
- compare lowercased authenticated email to lowercased invite email;
- require invite status `pending`;
- require `expires_at` not passed if expiration is implemented;
- create/activate only the invited org membership;
- never grant access only because a token/link exists.

## 6. Audit Events

Audit actions:

- `team.invite_created`
- `team.invite_accepted`
- `team.invite_revoked`
- `team.member_role_changed`
- `team.member_removed`
- `team.member_status_changed`

Each audit event should include:

- actor user id;
- organization id;
- subject table;
- subject id;
- before/after data where useful;
- reason/note where supplied;
- visibility `private`;
- created timestamp.

Normal org switching remains unaudited unless a suspicious/failed access attempt is simple to log later.

## 7. Email Behavior

Do not overbuild email in Slice 3.

Recommended path:

- create invite rows and token/hash fields now;
- show a development acceptance link or copyable invite link for testing;
- document that real email sending is not production-ready yet;
- later connect Supabase email templates or a transactional email provider;
- do not make full-scale launch depend on unverified email/rate-limit behavior.

Email text later should be:

- plain-language;
- trustworthy;
- no marketing fluff;
- clear that access is for a specific NGO workspace;
- clear that Mishava team access does not change public trust outcomes.

## 8. Database / Backend Implications

Likely migration:

- add `ngo_admin` and `ngo_viewer` to `role_code`;
- add membership status fields to `organization_memberships`;
- create `organization_invites`;
- add indexes for organization, email, status, token hash;
- update `is_org_member` and any admin/member helper functions to require active membership;
- add RLS policies for invite reads/writes scoped to owner/admin role.

Potential table:

```sql
organization_invites
```

Minimum columns:

- `id`
- `organization_id`
- `email`
- `role`
- `status`
- `token_hash`
- `note`
- `invited_by`
- `accepted_by`
- `invited_at`
- `accepted_at`
- `revoked_at`
- `expires_at`
- `created_at`
- `updated_at`

Backend helpers to plan:

- `getCurrentOrgTeamWorkspace`
- `createOrganizationInvite`
- `acceptOrganizationInvite`
- `revokeOrganizationInvite`
- `removeOrganizationMember`
- `changeOrganizationMemberRole`
- `assertCanManageNgoTeam`
- `assertLastOwnerIsPreserved`

## 9. UI Scope

Minimum `/org/team` UI:

- member table;
- pending invite table;
- invite form;
- revoke invite action;
- remove member action;
- role change action only if simple enough;
- clear display-only labels for anything deferred.

Do not add billing seat counts in this slice.

## 10. Tests Required

Add tests for:

- owner/admin can invite member;
- non-admin cannot invite member;
- invite is org-scoped;
- invited user cannot access before accepting;
- invited user can access after accepting;
- wrong email cannot accept invite;
- revoked invite cannot be accepted;
- expired invite cannot be accepted if expiration is implemented;
- removed member loses access;
- removed member does not appear in org switcher;
- last owner cannot be removed;
- role changes affect permissions;
- member/viewer cannot manage team;
- team actions write audit events;
- existing NGO onboarding/evidence/report/share tests still pass;
- payment firewall tests still pass;
- build/lint/test pass.

## 11. Non-Goals

Exclude from Slice 3:

- billing seats;
- custom permissions;
- SSO;
- MFA enforcement;
- production email provider integration;
- file uploads;
- report exports;
- AI;
- Shopping changes;
- Business, Local, Gov, Corporate, or Plus work;
- scoring behavior changes.

## 12. Acceptance Criteria

Slice 3 can be accepted only when:

- members and invites are scoped to the current organization;
- invite acceptance requires authenticated email match;
- pending invites do not grant access;
- removed members lose access immediately;
- removed/inactive memberships do not appear in org switching;
- role checks are server-side;
- last owner protection exists;
- audit events are written for team-sensitive actions;
- existing NGO workflows remain protected;
- no unrelated product surfaces or monetization features are added.

## Recommended Build Order

1. Add role/status/invite schema and RLS changes.
2. Update auth membership reads and org switching to active memberships only.
3. Add team permission helpers.
4. Add invite create/revoke backend helpers.
5. Add invite acceptance backend route/action.
6. Add member removal and last-owner protection.
7. Replace `/org/team` scaffold with current-org member/invite UI.
8. Add tests and result document.

## Planning Status

Planned. Not implemented.
