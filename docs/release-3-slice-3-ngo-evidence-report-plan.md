# Release 3 Slice 3 NGO Evidence Report Plan

Status: planning only. Do not implement Slice 3 code or migrations from this
document until explicitly approved.

Source documents:

- `docs/release-3-slice-2-result.md`
- `docs/release-3-slice-2-plan.md`
- `docs/release-3-scoring-foundation-plan.md`
- `docs/release-2-5-live-verification-result.md`

## Goal

Release 3 Slice 3 should make NGO evidence more useful by connecting NGO
evidence, structured claims, report templates, and private draft score
snapshots.

The slice should move NGO from:

```txt
evidence can be entered
```

to:

```txt
evidence can begin supporting a basic report/trust profile flow
```

This remains a narrow NGO-only backend/product-foundation slice. It should not
build Shopping, Business, Local, Gov, Corporate, Plus, AI workflows, public
scoring UI, final SDG math, or full report exports.

## 1. NGO Evidence Library Readiness

After an NGO enters evidence, the NGO evidence library should be able to show
the user a useful evidence record without implying that scoring is complete.

Minimum evidence library fields:

- Evidence title.
- Evidence type/source type.
- Source name.
- URL, if provided.
- Notes or description, if provided.
- Visibility:
  - `private`
  - `organization_shared`
  - `approved_viewer`
  - `public_summary`
  - `public_full_record`
- Verification/review status:
  - `unverified`
  - `self_attested`
  - `public_record_checked`
  - `document_checked`
  - `verified`
  - `audit_reviewed`
- Confidence level.
- Created/captured date.
- Created by, where available.
- NGO submission status from `ngo_evidence_submissions`, where applicable.
- Linked structured claims, if any.
- Audit trail indicator showing whether evidence creation/update has an
  associated `audit_events` row.

Recommended display behavior for future implementation:

- Show evidence and submission status separately.
- Do not present evidence as accepted scoring fact until a structured claim is
  accepted.
- Preserve negative, weak, disputed, or incomplete evidence in the library.
- Make visibility explicit so NGO users understand what is private versus
  shareable later.
- Add a "Used in reports" indicator only when report linkage exists.

Current state:

- `evidence_items` stores the core evidence record.
- `ngo_evidence_submissions` links NGO intake/submission records to evidence.
- `/org/evidence` can create manual evidence records and audit events.
- Evidence library UI exists as a functional foundation but is not yet a full
  report-supporting library.

Likely Slice 3 need:

- Backend helper to fetch NGO evidence with linked NGO submission metadata,
  linked structured claim count/status, and report usage count.
- No heavy file uploads in this slice.

## 2. Structured Claim Review Flow

Slice 3 should build on Slice 2 structured-claim guardrails.

Required relationship:

```txt
evidence_items
  -> structured_claims
  -> accepted/rejected review status
  -> report trust context
  -> private draft score snapshot where applicable
```

Structured claim rules:

- A claim must cite at least one `evidence_item_id`.
- A claim may be `draft`, `reviewed`, `accepted`, or `rejected`.
- Only `accepted` claims are eligible for report trust summaries or draft
  snapshot creation.
- `draft` and `rejected` claims remain visible in review/history contexts but
  must not enter trust-summary calculations.
- Negative evidence must not be suppressed.
- A rejected claim should not delete or hide the underlying evidence.
- Claim acceptance/rejection should create an `audit_events` row.
- The reviewer/action status should be visible to authorized NGO members or
  Mishava review staff.

Current state:

- `structured_claims` exists.
- Slice 2 added claim status, reviewer metadata, evidence-reference constraint,
  and helper support for accepting/rejecting claims.
- Slice 2 created audit-event helper support for structured claim review.

Likely Slice 3 need:

- Report-facing helper to select only accepted claims for an NGO and selected
  evidence set.
- Helper should reject cross-organization evidence/claim references.
- UI can remain minimal, but backend relationships must be explicit before
  richer report screens are built.

## 3. Basic NGO Report Creation

Slice 3 should plan a minimum report workflow using existing report templates.

Minimum workflow:

1. NGO member selects a report template.
2. NGO member enters report title.
3. NGO member selects report type/template.
4. NGO member selects evidence items owned by the NGO organization.
5. NGO member optionally selects accepted structured claims linked to that
   evidence.
6. Report is created in `draft` status.
7. Report visibility defaults to `private`.
8. Report records `created_by`, if added.
9. Report records `organization_id` directly or through `ngo_profile_id`.
10. Report creation writes an `audit_events` row.

Minimum report fields for implementation:

- `organization_id`, either direct field or resolved through `ngo_profile_id`.
- `ngo_profile_id`.
- `template_id`.
- `title`.
- `report_type` or template code.
- `body` JSON for draft report structure.
- `evidence_item_ids`.
- `structured_claim_ids`, if added.
- `score_snapshot_id`, optional.
- `scoring_version_id`, optional.
- `visibility`, default `private`.
- `approval_status`, default `draft`.
- `created_by`, if added.
- `created_at` and `updated_at`.

Current state:

- `ngo_report_templates` exists and has seeded real template records.
- `ngo_reports` exists with:
  - `ngo_profile_id`
  - `template_id`
  - `title`
  - `body`
  - `evidence_item_ids`
  - `visibility`
  - `ai_assisted`
  - `approval_status`
  - approval/publish timestamps
- `ngo_reports` does not yet explicitly store `created_by`,
  `structured_claim_ids`, `score_snapshot_id`, or `scoring_version_id`.
- `/org/reports` remains display-only.

Likely Slice 3 migration candidates:

- Add `created_by uuid references auth.users(id)` to `ngo_reports`.
- Add `structured_claim_ids uuid[] not null default '{}'` to `ngo_reports`.
- Add `score_snapshot_id uuid references score_snapshots(id)` to `ngo_reports`.
- Add `scoring_version_id uuid references scoring_versions(id)` to
  `ngo_reports`.
- Consider adding direct `organization_id uuid references organizations(id)` to
  `ngo_reports` for simpler RLS/testing, while preserving `ngo_profile_id` as
  the NGO-specific profile link.

Deferred:

- Full report builder.
- Report sections/content editor.
- Custom report layouts.
- File/PDF/Word/Excel export.
- AI report rebuild.

## 4. Report-To-Snapshot Relationship

Slice 3 should make the report relationship to evidence, claims, and draft
snapshots explicit without claiming final scoring is ready.

A basic NGO report may reference:

- Evidence snapshot:
  - Selected `evidence_item_ids`.
  - Evidence details copied into report body or represented by selected IDs.
- Claim/fact snapshot:
  - Selected accepted `structured_claim_ids`.
  - Rejected/draft claims excluded from trust summary.
- Draft score snapshot:
  - Optional `score_snapshot_id`.
  - Only private/draft snapshots by default.
  - `overall_score` may remain `null`.
- Scoring version:
  - Optional `scoring_version_id`.
  - Required only if report references a score snapshot or formal scoring
    context.
- Coverage/recency/confidence:
  - May be derived from accepted claims and selected evidence.
  - Should be labeled as draft/provisional until final scoring math is approved.

Important report language:

- Use "draft trust context" or "provisional evidence summary."
- Do not show a public Mishava Score if final scoring output is unavailable.
- Do not fabricate `overall_score`.
- If `overall_score` is `null`, the report should explain that scoring math is
  pending or insufficiently supported.

Recommended relationship rule:

- Report creation may reference an existing private draft snapshot.
- Report creation should not update a snapshot.
- If evidence/claims change materially, a new draft snapshot should be created
  and the report should reference the newer snapshot only through an explicit
  update/audit event.

## 5. Scoped Sharing Readiness

Slice 3 should only prepare minimum sharing readiness.

Rules:

- Reports are private by default.
- No public sharing unless explicitly marked.
- Raw evidence is not exposed by default.
- Shared views must respect evidence visibility rules.
- A report should not expose evidence whose visibility is stricter than the
  report/share scope.
- `ngo_share_grants` may remain mostly dormant in Slice 3 unless needed for
  tests.
- Share grants should be optional and future-facing, not the core of Slice 3.

Minimum future sharing model:

- `ngo_reports.visibility = private` by default.
- A later share grant can allow approved viewers to see a report.
- Raw evidence exposure requires either:
  - evidence visibility compatible with the share, or
  - explicit report-safe summary content that does not expose raw private files.
- Shared report access must never bypass organization, report, evidence, or
  snapshot visibility rules.

Deferred:

- Public report library.
- Funder portal.
- Tokenized share links.
- Press/media paid reporting access.
- Downloadable exports.

## 6. Database / Backend Implications

Existing tables reviewed:

- `evidence_items`
- `ngo_evidence_submissions`
- `structured_claims`
- `ngo_report_templates`
- `ngo_reports`
- `ngo_share_grants`
- `score_snapshots`
- `audit_events`

### Already Exists

`evidence_items`

- Stores core evidence records.
- Already linked to `organization_id`.
- Has visibility, verification status, confidence, source, URL, notes, and
  provenance fields.
- Release 2.5 added `created_by` and write policies.

`ngo_evidence_submissions`

- Stores NGO intake/submission records.
- Can link to `evidence_items` through `evidence_item_id`.
- Has AI parse and approval status fields, though AI remains out of scope.

`structured_claims`

- Stores claim/fact-like statements.
- Slice 2 added status/review fields and evidence-reference constraint.
- Used by scoring workflow helper for draft snapshots.

`ngo_report_templates`

- Stores active template definitions.
- Publicly readable when active.
- Has minimum tier and AI assist allowance fields, but AI is out of scope.

`ngo_reports`

- Stores report shell with title, body, selected evidence IDs, visibility, and
  approval status.
- Needs stronger links to claims/snapshots before Slice 3 implementation.

`ngo_share_grants`

- Stores future approved-viewer sharing records.
- Should remain minimally used until report visibility rules are proven.

`score_snapshots`

- Stores immutable snapshots.
- Slice 1 made snapshots append-only.
- Slice 2 added draft/publication status, source claim/evidence IDs, and private
  draft snapshot support.

`audit_events`

- Append-only.
- Already used by onboarding/evidence workflows and Slice 2 scoring helpers.

### Small Migration Changes To Consider

Candidate Slice 3 migration:

- Add `created_by` to `ngo_reports`.
- Add `organization_id` to `ngo_reports`, if direct org isolation is worth the
  small redundancy.
- Add `structured_claim_ids` to `ngo_reports`.
- Add `score_snapshot_id` to `ngo_reports`.
- Add `scoring_version_id` to `ngo_reports`.
- Add a check or helper-level guard requiring reports to default to
  `visibility = 'private'`.
- Add insert/update RLS policies for `ngo_reports`, if not already sufficient
  for the first real workflow.

Candidate backend helpers:

- `getNgoEvidenceLibrary(organizationId)`.
- `createNgoReportDraft(input)`.
- `validateReportEvidenceOwnership(organizationId, evidenceItemIds)`.
- `validateReportClaimOwnershipAndStatus(organizationId, structuredClaimIds)`.
- `writeNgoReportAuditEvent(...)`.

### Can Be Deferred

- File storage policies and upload scanning.
- AI report rebuild usage ledger integration.
- Share grant creation workflow.
- Public report route.
- Report export tables/jobs.
- Full report approval workflow.
- Final SDG/pillar scoring output.

## 7. Tests Required

Planned tests before Slice 3 acceptance:

- NGO member can view own evidence library records.
- Non-member cannot view private NGO evidence.
- Report cannot include another organization's private evidence.
- Report can reference selected evidence owned by the NGO organization.
- Report can reference accepted structured claims owned by the NGO organization.
- Rejected claims do not enter report trust summary.
- Draft claims do not enter report trust summary.
- Report creation writes an `audit_events` row.
- Private report is not publicly readable.
- Report visibility defaults to private.
- Report cannot expose raw evidence by default.
- Payment firewall tests from Slice 1 and Slice 2 still pass.
- Build/lint/test pass.

Live checks to include if a migration is added:

- Apply migration to `mishava-v2-dev / snnscnodegbyqexnopvf` only.
- Confirm local and remote migration lists match.
- Confirm report creation inserts only org-owned evidence/claim references.
- Confirm wrong-org report creation fails.
- Confirm anonymous reads cannot see private reports.
- Confirm old project `mishava / tghbfautnxblfxrtkdqb` was not modified.

## 8. Non-Goals

Release 3 Slice 3 should not include:

- Final report export.
- PDF generation.
- Word generation.
- Excel generation.
- AI report rebuilding.
- Full funder portal.
- Public report library.
- Shopping integration.
- Business integration.
- Local integration.
- Gov, Corporate, or Plus integration.
- Fake scores.
- Seeded fake report examples.
- Final scoring math.
- Public scoring UI.

## 9. Recommended Build Order For Future Implementation

1. Review live schema for `ngo_reports`, `structured_claims`, and
   `score_snapshots`.
2. Add minimal report relationship fields only if needed:
   - `created_by`
   - `structured_claim_ids`
   - `score_snapshot_id`
   - `scoring_version_id`
   - direct `organization_id`, if chosen
3. Add or verify RLS policies for report insert/update/read.
4. Build backend helper to fetch NGO evidence library records with linked
   submissions/claims/report usage.
5. Build backend helper to create private draft NGO reports from templates,
   selected evidence, and accepted claims.
6. Write audit events for report creation.
7. Add tests for org isolation, claim status filtering, private defaults, and
   payment firewall regression.
8. Run build/lint/test.
9. Apply migration to clean V2 Supabase only if schema changes are included.
10. Document Slice 3 result after implementation.

## 10. Acceptance Criteria For Future Implementation

Release 3 Slice 3 can be accepted only when:

- Scope stays NGO-only.
- Evidence/report relationships are clear.
- Reports can reference selected evidence.
- Reports can reference accepted structured claims.
- Draft/rejected claims are excluded from trust summaries.
- Private reports are not publicly readable.
- Raw private evidence is not exposed by default.
- Organization isolation is preserved.
- Audit events are required for report creation and report-sensitive changes.
- Payment firewall tests still pass.
- No public scoring UI is introduced.
- No fake scoring data is introduced.
- No final SDG scoring math is introduced.
- No AI workflows or report exports are introduced.
