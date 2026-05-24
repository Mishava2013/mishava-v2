# Release 2.5 Live-Readiness Checklist

Status: verification checklist only. This document does not add product scope.

Release 2.5 is locally verified through static checks, route protection checks,
build checks, and source-level acceptance tests. It has not yet been verified
against a live Supabase project.

## 1. Required Environment Variables

Required for live database-backed workflows:

```txt
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
```

Current auth abstraction also requires cookies:

```txt
mishava_session
mishava_current_org_id
```

`mishava_session` is a base64url JSON payload shaped like:

```json
{
  "user": {
    "id": "auth-user-uuid",
    "email": "person@example.com",
    "roles": ["consumer"]
  },
  "memberships": [
    {
      "organizationId": "organization-uuid",
      "roles": ["ngo_owner"]
    }
  ]
}
```

`mishava_current_org_id` must match an organization ID in the user's session
memberships for `/org/*` access.

## 2. Supabase Project Setup Steps

1. Create or select the Supabase project for Mishava V2.0.
2. Confirm Auth is enabled.
3. Create at least one test user in Supabase Auth.
4. Add `NEXT_PUBLIC_SUPABASE_URL` from the Supabase project settings.
5. Add `SUPABASE_SERVICE_ROLE_KEY` for server-side local verification.
6. Add `SUPABASE_ANON_KEY` for future client-side reads as needed.
7. Run migrations in order.
8. Confirm RLS is enabled on all tables from the migrations.
9. Start the app locally with the environment variables loaded.
10. Use test cookies to exercise protected routes until the final auth provider UI is wired.

## 3. Migration Order

Run in this order:

1. `supabase/migrations/202605240001_foundation.sql`
2. `supabase/migrations/202605240002_ngo_foundation.sql`
3. `supabase/migrations/202605240003_scoring_guardrails.sql`
4. `supabase/migrations/202605240004_release_2_5_cleanup.sql`
5. `supabase/migrations/202605240005_shopping_poc.sql`

Release 2.5 specifically depends on migrations 1, 2, and 4. Migration 3 is
needed for scoring guardrails already started. Migration 5 is Release 4.

## 4. RLS Verification Steps

Verify in Supabase SQL editor or using API calls:

1. Confirm RLS is enabled for:
   - `organizations`
   - `organization_memberships`
   - `ngo_profiles`
   - `evidence_items`
   - `ngo_evidence_submissions`
   - `audit_events`
   - `score_snapshots`
2. Confirm insert policies exist for:
   - `organizations`
   - `organization_memberships`
   - `ngo_profiles`
   - `evidence_items`
   - `ngo_evidence_submissions`
   - `audit_events`
3. Confirm helper functions exist:
   - `is_org_member(uuid)`
   - `has_org_role(uuid, role_code[])`
4. Confirm `audit_events` update/delete triggers reject mutation.
5. Confirm public score snapshots require:
   - `published_at is not null`
   - `visibility in ('public_summary', 'public_full_record')`
6. Confirm private score snapshots are readable only to organization members.

## 5. Test User / Organization Setup Steps

For manual verification:

1. Create test Supabase Auth user A.
2. Create test Supabase Auth user B.
3. For user A, generate a `mishava_session` cookie with:
   - user A's Supabase Auth UUID
   - role `consumer`
   - no memberships initially
4. Visit `/ngo/onboarding` with user A session.
5. Submit the NGO onboarding form.
6. Copy the resulting organization ID from the redirect query or database row.
7. Set `mishava_current_org_id` to that organization ID.
8. Update or regenerate user A's `mishava_session` cookie so memberships includes:
   - `organizationId`: new organization ID
   - `roles`: `["ngo_owner"]`
9. Generate user B's session without membership to user A's organization.
10. Use user B to verify wrong-org access is blocked.

## 6. Manual Test Path

### Create NGO Org From `/ngo/onboarding`

1. Start app with live Supabase environment variables.
2. Set a valid `mishava_session` cookie for test user A.
3. Open `/ngo/onboarding`.
4. Submit:
   - Public organization name
   - Country
   - Mission area
   - Optional legal name
   - Optional website URL
   - Optional registration identifier
   - Visibility
   - Summary
5. Expected result:
   - Redirect to `/org/profile?created=ngo&organization=<id>`

### Confirm Rows

Confirm in Supabase:

1. `organizations`
   - one new row
   - `organization_type = 'ngo'`
   - `name` matches form input
2. `organization_memberships`
   - one new row
   - `organization_id` matches new organization
   - `user_id` matches test user A
   - `role = 'ngo_owner'`
3. `ngo_profiles`
   - one new row
   - `organization_id` matches new organization
   - `public_name` matches form input
   - `profile_status = 'draft'`
4. `audit_events`
   - one new row
   - `action = 'ngo_profile.created'`
   - `organization_id` matches new organization

### Create Manual Evidence From `/org/evidence`

1. Set `mishava_current_org_id` to the new organization ID.
2. Use a `mishava_session` cookie where user A has `ngo_owner` membership for that org.
3. Open `/org/evidence`.
4. Submit manual evidence:
   - Evidence title
   - Source name
   - Source type
   - Verification status
   - Visibility
   - Optional URL
   - Notes
5. Expected result:
   - Redirect to `/org/evidence?created=evidence&id=<id>`

Confirm in Supabase:

1. `evidence_items`
   - one new row
   - `organization_id` matches current org
   - `subject_type = 'ngo'`
   - `created_by` matches user A
   - `visibility` matches form input
   - `verification_status` matches form input
2. `ngo_evidence_submissions`
   - one new row if a matching `ngo_profiles` row exists
   - `evidence_item_id` matches new evidence row
   - `approval_status = 'draft'`
3. `audit_events`
   - one new row
   - `action = 'evidence.created'`
   - `subject_table = 'evidence_items'`
   - `subject_id` matches new evidence row

### Access Control Checks

1. Visit `/org/evidence` without cookies.
   - Expected: redirect to `/?auth=required`
2. Visit `/admin/scoring` without cookies.
   - Expected: redirect to `/?auth=required`
3. Visit `/admin/scoring` with user A as non-admin.
   - Expected: redirect to `/?auth=admin_required`
4. Visit `/org/evidence` with user B and `mishava_current_org_id` set to user A's org.
   - Expected: redirect to `/?auth=organization_required`
5. Visit `/org/evidence` with user A and correct `mishava_current_org_id`.
   - Expected: `200`

## 7. Currently Verified Locally

Verified by local tests/checks:

- Middleware exists for `/app/*`, `/org/*`, and `/admin/*`.
- Server layouts call auth guards.
- Membership helper exists.
- RLS migration contains org-member helper and write policies.
- NGO onboarding workflow inserts organization, membership, NGO profile, and audit event.
- Evidence workflow inserts evidence, NGO evidence submission, and audit event.
- Public score snapshots require publication and public visibility.
- Payment-derived fields are rejected from ranking tests.
- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Local HTTP checks confirmed:
  - unauthenticated `/org/evidence` redirects
  - unauthenticated `/admin/scoring` redirects
  - public `/ngo` returns `200`
  - member cookie can access `/org/evidence`
  - wrong org cookie is blocked
  - non-admin cookie is blocked from `/admin/scoring`

## 8. Not Yet Live-Verified

Requires live Supabase verification:

- Migrations applied successfully in a real project.
- RLS policies behave correctly with Supabase Auth JWTs.
- Server actions write to live tables.
- Audit events are actually inserted on onboarding/evidence creation.
- Wrong-org access is blocked against real data, not just middleware cookie checks.
- Service role usage is acceptable for local/server workflows and does not bypass intended app-level checks.
- Score snapshot visibility behaves correctly in Supabase.
- Shopping tables read live records without fake seed data.

## 9. Known Items Still Mocked Or Display-Only

- Final auth provider UI is not wired.
- Current auth is a cookie-based abstraction.
- No real sign-in/sign-out screens.
- No live Supabase project has been verified in this workspace.
- `/org/team` is display-only.
- `/org/reports` is display-only.
- `/org/billing` is display-only.
- `/admin/*` pages are protected but mostly display-only.
- Stripe test mode is not wired.
- File uploads/storage are not implemented.
- Evidence update flow is not implemented.
- Report creation, approval, export, and share grants are schema-only.
- AI usage ledger is schema-only.
- Shopping product ingestion/admin UI is not implemented.
- Shopping search is minimal database filtering, not full search/ranking.

## 10. Release 2.5 Live-Readiness Decision

Release 2.5 is locally functional and source/test verified.

It should not be considered live-verified until the manual Supabase path above
passes with real Supabase Auth users, live migrations, RLS enabled, and real
database writes confirmed.
