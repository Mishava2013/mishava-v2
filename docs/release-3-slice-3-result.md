# Release 3 Slice 3 Result

Status: accepted for Slice 3 implementation.

Source documents:

- `docs/release-3-slice-3-ngo-evidence-report-plan.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

Release 3 Slice 3 added NGO-only evidence-to-report readiness.

Implemented:

- Improved `/org/evidence` so NGO members can view their evidence library.
- Evidence library now shows:
  - title
  - source type
  - source name
  - URL, where available
  - notes, where available
  - visibility
  - verification status
  - created date
  - linked structured claim count
  - accepted linked claim count
  - audit trail indicator
  - draft/review-ready label
- Added a minimal structured-claim draft path from evidence records.
- Structured claim drafts:
  - are linked to one evidence item
  - start as `draft`
  - write an audit event
  - do not become accepted without the existing Slice 2 review guardrails
- Improved `/org/reports` so NGO members can create private draft reports from:
  - active report template
  - selected organization-owned evidence items
  - selected accepted structured claims, if available
  - optional private draft score snapshot
- Reports default to:
  - `visibility = private`
  - `approval_status = draft`
  - `ai_assisted = false`
- Report list now shows draft reports and attached evidence/claim counts.
- Report UI labels exports and sharing as not enabled.
- Raw evidence remains private by default.
- Added audit events for draft report creation.

No Shopping, Business, Local, Gov, Corporate, Plus, AI workflow, fake scoring,
public scoring UI, final SDG math, or report export work was added.

## Migrations Applied

Applied to clean V2 Supabase project only:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Migration applied:

- `202605240008_release_3_slice_3_ngo_reports.sql`

Migration added:

- `ngo_reports.organization_id`
- `ngo_reports.created_by`
- `ngo_reports.structured_claim_ids`
- `ngo_reports.score_snapshot_id`
- `ngo_reports.scoring_version_id`
- Insert policy for private member-created NGO reports.
- Update policy for member-owned private/shared NGO reports.

Current migration alignment:

- Local and remote migrations are aligned through `202605240008`.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not modified.

## Live Checks Performed

Live verification against `mishava-v2-dev / snnscnodegbyqexnopvf` confirmed:

- Active NGO report template was readable.
- Existing NGO organization/member/profile/evidence records were usable.
- Existing accepted structured claim was usable.
- A private draft NGO report could be created with selected evidence and
  accepted claim references.
- The created report stayed private.
- A matching `ngo_report.draft_created` audit event was created.
- Anonymous read of the private report returned zero rows.
- Selected evidence was real and organization-linked.
- Selected structured claim was accepted and evidence-backed.

Representative live verification rows:

- Report: `7d29d91e-e991-4cb9-8926-4ce9fa2e6a6b`
- Report audit event: `d5e3e3a5-405b-4f2d-b3d6-3fcfe7cd2989`
- Evidence item: `145463e7-00cb-42ea-93e4-ee78ff729890`
- Accepted structured claim: `e121cf7d-0cbd-450e-8c32-c1e89db5051f`

Anonymous report read result:

```txt
rowCount: 0
```

## Tests Run

```bash
npm test
npm run lint
npm run build
/private/tmp/supabase-cli-2.101.0/supabase db push --linked
/private/tmp/supabase-cli-2.101.0/supabase migration list --linked
node /private/tmp/release3-slice3-live-check.mjs
```

Result:

- `npm test`: pass, 32 tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Live migration status: pass through `202605240008`.
- Live Slice 3 NGO report behavior: pass.

## Known Limitations

- Auth is still the temporary cookie abstraction from Release 2.5.
- Server workflows still use the service-role-backed server client after
  app-level route/session guards.
- Structured claim acceptance/rejection remains a backend/helper path from Slice
  2; Slice 3 adds claim draft creation from evidence but does not build a full
  review console.
- Report creation does not export PDF, Word, Excel, or other files.
- Report sharing remains not enabled in this slice.
- AI report rebuilding is not implemented.
- File uploads/storage remain not production-ready.
- Draft score snapshots can be referenced only when already created; Slice 3
  does not generate final scores.
- No public report routes were added.

## Remaining NGO Readiness Work

- Build full structured claim review UI for authorized reviewers.
- Add manager approval workflow for reports.
- Add scoped share grants and protected shared-view routes.
- Add report-safe evidence summaries separate from raw evidence exposure.
- Add export generation later after privacy/accessibility/legal requirements are
  reviewed.
- Add file upload/storage with safe permissions and scanning.
- Add AI report rebuild only after AI cost controls and human review rules are
  wired.
- Replace temporary auth with final hosted auth provider.

## Scope Confirmation

Release 3 Slice 3 did not add:

- Shopping work.
- Business work.
- Local work.
- Gov work.
- Corporate work.
- Plus work.
- AI workflows.
- Fake scores.
- Seeded fake report examples.
- Public scoring UI.
- Final SDG scoring math.
- Full report exports.

## Acceptance

Release 3 Slice 3 is accepted because:

- Scope stayed NGO-only.
- Evidence/report relationships are explicit.
- Reports can reference selected organization-owned evidence.
- Reports can reference accepted organization-owned structured claims.
- Draft/rejected claims are excluded from report trust summaries.
- Private reports are not publicly readable.
- Raw evidence is not exposed by default.
- Organization isolation is preserved at app-helper and RLS policy boundaries.
- Audit events are written for report creation and structured claim drafting.
- Payment firewall tests still pass.
- No fake scoring data or public scoring UI was introduced.
