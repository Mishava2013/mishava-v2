# Release 2.5 Live Verification Result

Status: Release 2.5 live-verified against the clean Mishava V2 Supabase project.

This document records the live verification result only. It does not add product
scope, features, routes, database tables, or Release 3 work.

## Project

- Name: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`
- Old project not modified: `mishava / tghbfautnxblfxrtkdqb`

## Verification Result

Release 2.5 is live-verified against the clean V2 Supabase project.

Confirmed:

- Migrations `202605240001` through `202605240005` are applied cleanly.
- `.env.local` is configured locally and git-ignored.
- The repo is linked to `snnscnodegbyqexnopvf`.
- The old `mishava / tghbfautnxblfxrtkdqb` Supabase project was not modified.

## Checks Passed

- NGO onboarding creates:
  - `organizations`
  - `organization_memberships`
  - `ngo_profiles`
  - `audit_events`
- `/org/evidence` creates:
  - `evidence_items`
  - optional `ngo_evidence_submissions` where applicable
  - `audit_events`
- Unauthenticated `/org/evidence` redirects or blocks.
- Unauthenticated `/admin/scoring` redirects or blocks.
- Wrong-org access is blocked.
- Non-admin access to `/admin/scoring` is blocked.
- RLS blocks non-member private org/evidence reads.
- `audit_events` are append-only / immutable for normal users.
- `score_snapshots` visibility rules block private snapshots from anonymous
  users.

## Rows Created During Verification

- Organization: `fb5f1b15-0a24-40b6-b3b9-81e7c6394f57`
- Membership: `8f5dd494-ce1d-4d38-9c8f-c64429640ff6`
- NGO profile: `c3d82929-0c24-436e-9118-fdd0aeda7288`
- Onboarding audit event: `c4301025-9d55-47a6-b900-339f81a68994`
- Evidence item: `145463e7-00cb-42ea-93e4-ee78ff729890`
- NGO evidence submission: `f2e68850-773f-498c-893e-d028903c58f5`
- Evidence audit event: `72b54734-073c-4461-a838-aee798cb6ea2`

## Known Limitations

- Auth is still the temporary cookie abstraction, not the final hosted auth
  provider.
- Server workflows use a service-role-backed server client after app-level
  route/session guards.
- `/org/team`, `/org/reports`, `/org/billing`, and most `/admin/*` pages remain
  display-only.
- File uploads/storage are not production-ready.
- Stripe is not wired.
- AI workflows are not production-ready.
- Report creation/export/sharing flows are not production-ready.
- Shopping has live tables but no ingestion/admin pipeline yet.

## Final Status

Release 2.5 is live-verified and accepted as a functional foundation slice, with
caveats.
