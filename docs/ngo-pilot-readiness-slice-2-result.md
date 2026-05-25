# NGO Pilot Readiness Slice 2 Result

Status: implemented.

Source of truth:

- `docs/ngo-pilot-readiness-slice-2-sharing-plan.md`
- `docs/ngo-pilot-readiness-slice-1-result.md`
- `docs/ngo-shopping-readiness-audit.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

NGO Pilot Readiness Slice 2 added scoped report sharing for NGO draft reports.

Implemented:

- Share grant creation from `/org/reports/[reportId]`.
- Share grant revocation from `/org/reports/[reportId]`.
- Sharing status display on report detail:
  - Shared
  - Not shared
  - Revoked
  - Expires
  - Raw evidence is not shared by default
- Minimal shared report summary view:
  - `/shared/ngo-reports/[grantId]`
- Shared view access requires:
  - authenticated user
  - valid active share grant
  - recipient email matching the signed-in user email
  - non-revoked grant
  - non-expired grant
- Shared view exposes only:
  - report summary
  - report template/status context
  - sharing purpose
  - recipient context
  - selected evidence summaries
  - selected accepted claims
  - draft/provisional trust context
- Shared view does not expose:
  - full organization workspace
  - unrelated reports
  - unrelated evidence
  - raw evidence notes
  - internal evidence URLs
  - file attachments
  - team data
  - billing data
  - internal audit events
- Audit events are written for:
  - `ngo_report.share_grant_created`
  - `ngo_report.share_grant_revoked`
  - `ngo_report.shared_viewed`

## Migrations Applied

Applied to clean V2 Supabase project only:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Migration applied:

- `202605240011_ngo_share_grants_slice_2.sql`

Migration added:

- `share_grant_status` enum:
  - `active`
  - `revoked`
- `ngo_share_grants.organization_id`
- `ngo_share_grants.granted_to_name`
- `ngo_share_grants.status`
- Insert policy for member-created share grants.
- Update policy for member revocation/status changes.

Migration application result:

- `supabase db push --linked`: passed.
- `supabase migration list --linked`: local and remote aligned through `202605240011`.

The old Supabase project was not modified:

- `mishava / tghbfautnxblfxrtkdqb`

## Tests Run

```bash
npm test
npm run lint
npm run build
/private/tmp/supabase-cli-2.101.0/supabase db push --linked
/private/tmp/supabase-cli-2.101.0/supabase migration list --linked
```

Results:

- `npm test`: pass, 51 tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Migration push: pass.
- Migration alignment: pass through `202605240011`.

New test coverage includes:

- report owner/org member can create share grant.
- non-member creation is blocked by organization route/action guard.
- grant cannot be created for another organization's report.
- share grant migration stores organization, recipient name, and status.
- share action writes audit event.
- revoke action writes audit event.
- revoked grant blocks access.
- expired grant blocks access.
- shared grant view exposes only report summary and allowed evidence summaries.
- raw evidence is not exposed by default.
- private reports remain private unless a valid grant exists.
- no public report library route is added.

## Live Checks Performed

Live checks were performed against the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Live verification created and revoked one scoped share grant using an existing NGO report:

- Report: `7d29d91e-e991-4cb9-8926-4ce9fa2e6a6b`
- Share grant: `b76e3871-af6c-4c10-9f82-9ea88766e672`
- Final grant status: `revoked`
- Revoked at: `2026-05-25T01:25:46.666+00:00`

Audit rows were inserted for the live share-grant creation and revocation checks.

## Known Limitations

- Auth is still the temporary cookie abstraction, not the final hosted auth provider.
- Shared recipient access currently relies on authenticated user email matching the grant recipient email.
- Server workflows still use the service-role-backed server client after app-level route/session guards.
- Tokenized external sharing was not implemented.
- Public report library was not implemented.
- Report exports are still not enabled.
- Raw evidence sharing is still not enabled.
- Report approval workflow is not implemented.
- Full funder portal/dashboard is not implemented.
- File uploads/storage remain not production-ready.
- AI report writing/rebuild is not implemented.
- No final SDG scoring math is implemented.
- No public scoring UI is implemented.

## Remaining NGO Pilot-Readiness Work

- Replace temporary auth with final hosted auth provider.
- Decide whether pilot sharing should use authenticated recipient accounts, tokenized links, or both.
- Add production-safe token handling if external links are needed.
- Add report approval workflow.
- Add full structured claim review and acceptance UI for authorized reviewers.
- Add raw-evidence sharing policy before exposing raw notes, URLs, files, or attachments.
- Add report export generation later after privacy, accessibility, and legal requirements are reviewed.
- Add audit trail viewing for NGO evidence/report/share actions.
- Add mobile/accessibility QA pass for report detail, sharing forms, and shared summary views.

## Scope Confirmation

This slice did not add:

- Shopping work
- Business work
- Local work
- Gov work
- Corporate work
- Plus work
- AI workflows
- Stripe
- public report library
- exports
- fake scores
- public scoring UI
- final scoring math

## Acceptance

NGO Pilot Readiness Slice 2 is accepted because:

- sharing is scoped to one selected report
- reports remain private by default
- share grants can be created by authorized NGO members
- share grants can be revoked
- expiration is enforced
- sharing and revocation write audit events
- shared view exposes only selected report summary and allowed evidence summaries
- raw evidence is not exposed by default
- private org workspace is not exposed
- non-granted users cannot access shared reports
- expired/revoked grants cannot access shared reports
- labels are honest: Shared, Not shared, Revoked, Expires
- no public report library was added
