# Clean Supabase Project Plan For Mishava V2

Status: plan and verification instructions only.

Do not repair, reset, push migrations to, or otherwise modify the existing
linked Supabase project:

- Project name: `mishava`
- Project ref: `tghbfautnxblfxrtkdqb`

Reason: the existing project contains old Mishava migration history. It should
not be used for V2 migration testing without a separate reconciliation plan.

Preferred V2 development project name:

- `mishava-v2-dev`

## Required Environment Variables

For the clean V2 project:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ACCESS_TOKEN=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` comes from the clean V2 Supabase project settings.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` comes from the clean V2 Supabase API settings.
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side local verification
  workflows and must not be exposed client-side.
- `SUPABASE_ACCESS_TOKEN` is only needed for Supabase CLI workflows when the CLI
  is not already authenticated.

## Clean Project Setup Steps

1. Create a new Supabase project named `mishava-v2-dev`.
2. Confirm the new project has no old Mishava migration history.
3. Add the required environment variables to local `.env.local`.
4. Ensure the existing `mishava` project is not used for V2 migration testing.
5. Link this repo to the clean V2 project:

```bash
supabase link --project-ref <mishava-v2-dev-project-ref>
```

6. Confirm link status:

```bash
supabase projects list
supabase migration list --linked
```

Expected migration status before applying V2 migrations:

- Local migrations should appear as pending.
- Remote should not show old Mishava migration versions.

## Migration Order

Apply V2 migrations in this order:

1. `supabase/migrations/202605240001_foundation.sql`
2. `supabase/migrations/202605240002_ngo_foundation.sql`
3. `supabase/migrations/202605240003_scoring_guardrails.sql`
4. `supabase/migrations/202605240004_release_2_5_cleanup.sql`
5. `supabase/migrations/202605240005_shopping_poc.sql`

Command:

```bash
supabase db push --linked
```

Do not run `supabase migration repair` against the old `mishava` project.

## Release 2.5 Live-Readiness Verification

Use:

```txt
docs/release-2-5-live-readiness-checklist.md
```

Required checks:

1. Confirm migrations apply cleanly.
2. Confirm RLS is enabled for Release 2.5 tables.
3. Confirm insert/update policies exist for the first real workflows.
4. Confirm `is_org_member(uuid)` and `has_org_role(uuid, role_code[])` exist.
5. Confirm `audit_events` are append-only.
6. Confirm score snapshot public access requires publication and public visibility.

## Live Manual Test Path

### NGO Onboarding

1. Create Supabase Auth test user A.
2. Set a `mishava_session` cookie for test user A.
3. Open `/ngo/onboarding`.
4. Submit the NGO onboarding form.
5. Confirm rows:
   - `organizations`
   - `organization_memberships`
   - `ngo_profiles`
   - `audit_events`

Expected:

- `organizations.organization_type = 'ngo'`
- `organization_memberships.role = 'ngo_owner'`
- `ngo_profiles.profile_status = 'draft'`
- `audit_events.action = 'ngo_profile.created'`

### Evidence Creation

1. Set `mishava_current_org_id` to the created organization ID.
2. Update the test user cookie so membership includes the organization ID.
3. Open `/org/evidence`.
4. Submit manual evidence.
5. Confirm rows:
   - `evidence_items`
   - `ngo_evidence_submissions`, if an NGO profile exists
   - `audit_events`

Expected:

- `evidence_items.organization_id` matches current org.
- `evidence_items.created_by` matches test user A.
- `ngo_evidence_submissions.evidence_item_id` matches the evidence row.
- `audit_events.action = 'evidence.created'`.

## Access-Control Verification

Verify:

- `/org/*` requires authentication and organization membership.
- `/admin/*` requires admin, methodology owner, or equivalent permission.
- Wrong-org access redirects or is rejected.
- Non-admin user cannot access `/admin/scoring`.
- RLS blocks unauthorized direct database access, not only middleware access.

## Snapshot Visibility Verification

Verify:

- Unpublished `score_snapshots` are not publicly readable.
- Private `score_snapshots` are not publicly readable.
- Published snapshots are publicly readable only when visibility is:
  - `public_summary`
  - `public_full_record`

## Current Status

Clean V2 Supabase linked: No.

Migrations applied cleanly: Not yet.

Release 2.5 live-readiness checklist passed: Not yet.

Current blocker:

- A clean V2 Supabase project has not been provided or linked in this workspace.
- The existing `mishava` project is intentionally not being modified.

## Required Fixes If Verification Fails

Record failures in this section once live verification starts:

- Migration failures:
- RLS failures:
- Policy failures:
- Server-action failures:
- Auth/session failures:
- Schema changes needed:

## Decision Gate

Do not continue deep Release 3 scoring work until Release 2.5 is live-verified
against the clean V2 Supabase project.
