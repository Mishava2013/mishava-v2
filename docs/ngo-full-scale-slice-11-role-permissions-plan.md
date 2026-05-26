# NGO Full-Scale Slice 11: Role-Change UI and Permissions Foundation Plan

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`
- `docs/ngo-full-scale-slice-2-org-switching-result.md`
- `docs/ngo-full-scale-slice-8-admin-support-result.md`
- `docs/next-build-typescript-hang-fix-result.md`

## Current Tooling Context

The repo/tooling is healthy again:

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.
- Clean-cache build passes.

Slice 11 can proceed from a build/tooling standpoint once this plan is accepted.

## Goal

Move NGO team management from invite/remove only to safe self-serve role management before full-scale launch.

Slice 11 should add:

- role-change UI on `/org/team`;
- clearer role and permission labels;
- explicit last-owner protections for role changes;
- suspended/removed status handling readiness;
- a central permission matrix foundation that current server helpers and UI labels can share.

This slice should **not** build a full enterprise custom-role builder. Mishava should launch with a simple, auditable role model and leave custom permissions as a future extension point.

## Non-Goals

Do not include:

- full custom-role builder;
- SSO;
- SCIM;
- MFA enforcement;
- enterprise admin console;
- billing seats;
- production email provider implementation;
- broad admin analytics;
- Shopping, Business, Local, Gov, Corporate, or Plus work;
- production Stripe;
- report exports;
- malware scanning;
- AI evidence parsing;
- SOC 2 / ISO / VPAT implementation.

Do not touch the old Supabase project.

## 1. Current Role Model Review

Current NGO team roles:

| Internal role | User-facing label | Current purpose |
| --- | --- | --- |
| `ngo_owner` | Owner | Highest NGO workspace role. Can manage team and ordinary NGO workflows. Protected by last-owner rules during removal. |
| `ngo_admin` | Admin | Can manage team and ordinary NGO workflows. Cannot remove/demote last owner because they are not an owner. |
| `ngo_member` | Member | Can create/edit evidence and reports, but cannot manage team. |
| `ngo_viewer` | Viewer | Read-only workspace access where allowed. Cannot mutate evidence, reports, sharing, or team. |

Current membership statuses:

| Status | Meaning |
| --- | --- |
| `active` | User can access the org according to role. |
| `removed` | User loses access; existing created records remain traceable. |
| `suspended` | Type exists in app model and should block access, but full UI/action support is not complete. |

Current invite statuses:

| Status | Meaning |
| --- | --- |
| `pending` | Invite exists but does not grant access yet. |
| `accepted` | Invite has been accepted by matching authenticated email. |
| `revoked` | Invite cannot be accepted. |
| `expired` | Invite cannot be accepted after expiration. |

## 2. Current Permissions By Role

Based on the current helpers and UI behavior:

| Capability | Owner | Admin | Member | Viewer | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Org/profile access | Yes | Yes | Yes | Yes | Access depends on active org membership. |
| View evidence | Yes | Yes | Yes | Yes | Viewer can read allowed workspace evidence. |
| Create evidence | Yes | Yes | Yes | No | `canManageNgoEvidence` allows owner/admin/member. |
| Edit evidence | Yes | Yes | Yes | No | Same as evidence management. |
| Archive evidence | Yes | Yes | Yes | No | Same as evidence management. |
| Upload evidence files | Yes | Yes | Yes | No | Same role boundary as evidence mutation. |
| View reports | Yes | Yes | Yes | Yes | Viewer can read allowed reports where route permits. |
| Create reports | Yes | Yes | Yes | No | `canManageNgoReports` currently follows evidence management. |
| Edit reports | Yes | Yes | Yes | No | Same as report management. |
| Share reports | Yes | Yes | No | No | Current share actions use team-management permission. |
| Invite team members | Yes | Yes | No | No | `canManageNgoTeam` allows owner/admin. |
| Revoke invites | Yes | Yes | No | No | Same as team management. |
| Remove members | Yes | Yes | No | No | Current removal uses team management plus last-owner protection. |
| Change member roles | Missing | Missing | No | No | Planned in Slice 11. |
| View billing | Yes | Yes | Yes | Yes | Current billing route is org-member scoped; action limits are separate. |
| Manage billing | Planned | Planned | No | No | Billing checkout/webhooks are future Slice 12. |
| View audit summary | Partial | Partial | Partial | Partial | Admin/support has separate read-only support visibility. NGO-facing audit summary is not fully built. |
| Admin/support access | No | No | No | No | Mishava admin/support roles only, not NGO roles. |

## 3. Role-Change UI Plan

Update `/org/team` with a safe role-change area for each active member.

Minimum UX:

- Display current role with clear label and a short description.
- For owner/admin users, show a role-change form for editable active members.
- For member/viewer users, show read-only role labels and no mutation controls.
- Require explicit confirmation copy near the form, such as:
  - "Changing this role changes what this person can do in this workspace."
  - "Mishava records role changes in the audit trail."
- Keep the UI simple:
  - select new role;
  - submit button;
  - success/error notice;
  - no modal required unless a destructive/demotion state needs extra clarity.

Recommended first implementation:

- Add a role dropdown in the existing member table action column.
- Only show it when:
  - current session can manage team;
  - member is `active`;
  - member is not already inactive;
  - the target change is not blocked by last-owner rules.
- Keep "Remove" as a separate action.
- Show "No action available" for inactive members or insufficient role.

Role labels should remain:

- Owner
- Admin
- Member
- Viewer

Do not introduce role names like "manager", "editor", or "auditor" in Slice 11.

## 4. Role-Change Server Workflow

Add a server-side role-change action/helper.

Suggested helper:

```text
updateTeamMemberRole({
  client,
  membershipId,
  organizationId,
  newRole,
  session
})
```

Server-side rules:

- Caller must be owner/admin for the organization.
- Membership must belong to the current organization.
- Membership must be active.
- New role must be one of:
  - `ngo_owner`
  - `ngo_admin`
  - `ngo_member`
  - `ngo_viewer`
- If current role is `ngo_owner` and new role is not `ngo_owner`, block when this is the last active owner.
- If user is changing their own role, block self-demotion from owner when it would leave no active owner.
- Do not allow role changes for removed/suspended memberships until reactivation is explicitly implemented.
- Do not allow role changes to create access for a non-member org.
- Current org cookie must remain convenience state only; server membership check remains authoritative.

Recommended user-facing blocked messages:

- "At least one active owner is required."
- "This member is not active."
- "Member was not found for this organization."
- "You do not have permission to manage this team."
- "Choose a different role before saving."

## 5. Membership Status Handling Plan

Slice 11 should clarify and prepare support for:

| Status | Access behavior | UI behavior |
| --- | --- | --- |
| `active` | Access allowed by role. | Show role controls if manager has permission. |
| `removed` | Access blocked. | Show removed label, removed date, no role mutation. |
| `suspended` | Access blocked. | Show suspended label, no role mutation. Reactivation can be future unless simple. |

Rules:

- Removed/suspended users lose access immediately.
- Removed/suspended memberships must not appear in active org switcher options.
- Stale current-org selection must be rejected by server-side membership logic.
- Evidence/reports/share grants created by removed users remain traceable by `created_by`, `uploaded_by`, `granted_by`, or audit event fields.
- Do not delete or rewrite historical audit trails when membership status changes.

Slice 11 implementation options:

- Required: role-change UI and last-owner protection.
- Required: keep removed/suspended access blocked.
- Optional if simple: suspend/reactivate actions.
- If suspend/reactivate is deferred, label it as future work and do not show inactive controls that imply it is implemented.

## 6. Central Permission Matrix Plan

Create or document a central permission matrix that can be used by server helpers and UI labels.

Suggested location:

```text
src/lib/ngo-permissions.ts
```

Suggested exported permission names:

```text
manage_team
manage_billing
create_evidence
edit_evidence
archive_evidence
upload_files
create_reports
edit_reports
share_reports
view_reports
view_evidence
view_billing
view_audit_summary
admin_support
```

Suggested matrix:

| Permission | Owner | Admin | Member | Viewer | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `manage_team` | Yes | Yes | No | No | Includes invites, revokes, removals, role changes. |
| `manage_billing` | Yes | Yes | No | No | Full checkout/billing changes are Slice 12. |
| `create_evidence` | Yes | Yes | Yes | No | Feature gates may still limit volume. |
| `edit_evidence` | Yes | Yes | Yes | No | Existing records remain readable after downgrade/removal. |
| `archive_evidence` | Yes | Yes | Yes | No | Archive must audit. |
| `upload_files` | Yes | Yes | Yes | No | Raw files private by default. |
| `create_reports` | Yes | Yes | Yes | No | Existing report helpers already follow evidence management. |
| `edit_reports` | Yes | Yes | Yes | No | Same as create reports. |
| `share_reports` | Yes | Yes | No | No | Sharing currently uses team-management level. |
| `view_reports` | Yes | Yes | Yes | Yes | Subject to org membership and report visibility. |
| `view_evidence` | Yes | Yes | Yes | Yes | Subject to org membership and evidence visibility. |
| `view_billing` | Yes | Yes | Yes | Yes | Billing is display-only/currently org-scoped. |
| `view_audit_summary` | Yes | Yes | Yes | Viewer maybe later | Keep conservative unless NGO-facing audit view is implemented. |
| `admin_support` | No | No | No | No | Mishava admin/support roles only. |

Implementation recommendation:

- Keep existing `canManageNgoTeam`, `canManageNgoEvidence`, `canManageNgoReports`, and `canViewNgoWorkspace` wrappers for compatibility.
- Internally route those helpers through the central matrix where practical.
- Add a `getNgoRolePermissions(role)` or `roleHasNgoPermission(role, permission)` helper.
- Add UI helper text from the same role descriptions to avoid copy drift.
- Do not rewrite every route in one sweep if it risks broad regressions; start with team/evidence/report/share helpers.

## 7. Custom Permissions Foundation

Slice 11 should be future-safe, not enterprise-heavy.

Recommended:

- Keep enum roles for launch.
- Keep role-to-permission mapping in code.
- Do not create custom role tables yet.
- Do not add a custom role builder UI.
- Do not add per-user overrides yet.
- Use permission names that could later map to database-backed roles.

Future path:

1. Add database-backed custom role definitions only if real enterprise/network users require it.
2. Store custom role permission sets per organization.
3. Keep default roles immutable or restorable.
4. Require audit events for custom role creation, update, assignment, and removal.
5. Consider support/admin review for high-risk permission combinations.

## 8. Audit Events

Required audit events:

| Action | When |
| --- | --- |
| `team.member_role_changed` | Active member role changes. |
| `team.member_removed` | Existing removal event continues. |
| `team.member_suspended` | If suspension action is implemented. |
| `team.member_reactivated` | If reactivation action is implemented. |
| `team.last_owner_change_blocked` | Optional; useful if simple and not noisy. |

Role-change audit event should include:

- actor user id;
- organization id;
- membership id;
- before role/status;
- after role/status;
- reason: "NGO team member role changed.";
- no private evidence/report data.

## 9. Database / RLS Implications

Likely no migration is required for basic role change because:

- `organization_memberships.role` already exists.
- statuses exist in app/model/migration from team management.
- audit events already exist.

Implementation should confirm:

- update policies allow only safe server-side privileged updates or service-role-backed action after app-level role checks;
- normal users cannot update their own membership role directly through client-side access;
- non-members cannot read or update team data;
- inactive memberships no longer satisfy org access helpers/RLS checks.

Do not loosen RLS just to make UI work.

If a migration is needed, apply only to:

```text
mishava-v2-dev / snnscnodegbyqexnopvf
```

Do not touch:

```text
mishava / tghbfautnxblfxrtkdqb
```

## 10. Tests Required

Add/extend tests proving:

- owner can change member role;
- admin can change member role;
- member cannot change roles;
- viewer cannot change roles;
- last active owner cannot be demoted;
- last active owner cannot be removed;
- self-demotion from owner is blocked if it would leave no active owner;
- role change writes `team.member_role_changed` audit event;
- removed member loses access;
- suspended member loses access if suspension is implemented;
- org switcher excludes inactive memberships;
- permission matrix matches expected role behavior;
- role changes affect access:
  - promoted viewer/member can gain appropriate permissions;
  - demoted member/viewer loses mutation permissions;
- existing NGO onboarding/evidence/report/share/team tests still pass;
- `npm run typecheck` passes;
- `npm run lint` passes;
- `npm test` passes;
- `npm run build` passes.

## 11. Acceptance Criteria

Slice 11 can be accepted only when:

- role-change UI exists on `/org/team`;
- role changes are enforced server-side;
- owner/admin can manage roles;
- member/viewer cannot manage roles;
- last owner is protected from demotion/removal;
- removed/suspended users do not regain access through stale org state;
- permission behavior is centralized and testable;
- role-change audit events are written;
- existing NGO evidence/report/share/team workflows remain protected;
- no full enterprise role builder is introduced;
- no unrelated product surfaces are added;
- typecheck/lint/test/build pass.

## Recommended Implementation Order

1. Add central NGO permission matrix helper.
2. Adapt existing NGO team/evidence/report helper checks to use the matrix where low-risk.
3. Add `updateTeamMemberRole` backend helper.
4. Add `updateTeamMemberRoleAction` server action.
5. Add role-change UI to `/org/team`.
6. Add role descriptions/permission labels to the team page.
7. Add/extend tests.
8. Run full verification:
   - `npm run typecheck`
   - `npm run lint`
   - `npm test`
   - `npm run build`
9. Create Slice 11 result document after implementation.

## Final Planning Recommendation

Proceed with Slice 11 as a narrow team/permissions slice.

Do **not** build custom roles yet. The launch-safe path is:

```text
simple fixed roles + central permission matrix + audited role changes + last-owner protection
```

That gives NGOs enough self-serve team control for launch while keeping Mishava's trust and audit boundaries understandable.
