# Release 3 Slice 2 Plan

Status: planning only. Do not implement Slice 2 code or migrations from this
document until explicitly approved.

Source documents:

- `docs/release-3-scoring-foundation-plan.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-2-5-live-verification-result.md`

## Goal

Release 3 Slice 2 should define a controlled backend path from evidence to
structured claims/facts to draft score snapshots.

This slice is not final scoring math. It is not public scoring UI. It is not AI
scoring. It is not Plus reports. It must not create fake scores or invented
scoring data.

The purpose is to make the scoring pipeline traceable and auditable before the
final scoring formula is approved.

## 1. Scoring Version Lifecycle

Slice 2 should plan a lifecycle for scoring versions:

- Draft scoring version.
- Published scoring version.
- Archived/retired scoring version.
- Immutable published version.
- Version code/name/date/status.
- Audit events for publish, archive, and material change.
- No silent edits to published scoring versions.

Required implementation direction:

- Draft versions may be edited by authorized methodology/admin roles.
- Published versions should not be edited in place.
- Any change to a published methodology should create a new version.
- Published versions should preserve:
  - `code`
  - `name`
  - `pillar_weights`
  - `indicator_weights`
  - methodology summary
  - approval metadata
  - published timestamp
- Scoring-sensitive version actions should write `audit_events`.

Open implementation decision:

- Whether to add a formal status enum/field to `scoring_versions`, or use
  existing `active`, `approved_at`, and `published_at` fields plus a lifecycle
  helper.

## 2. Evidence To Structured Claim / Fact Path

Slice 2 should use existing `evidence_items` as the source record.

Rules:

- Structured claims/facts must be created from reviewed evidence only.
- Each claim/fact must reference at least one evidence item.
- No evidence citation means no scoring fact.
- Rejected or draft claims/facts must not enter score snapshots.
- Negative evidence must not be suppressed.
- Unknowns/gaps may be recorded, but should not inflate scores.

Existing table to review:

- `structured_claims`

Potential fields to add or verify:

- `status`: `draft`, `reviewed`, `accepted`, `rejected`
- `reviewed_by`
- `review_reason`
- `source_evidence_item_ids` or use current `evidence_item_ids`
- `created_by`

Implementation direction:

- If `structured_claims.evidence_item_ids` remains the evidence citation field,
  add tests and database constraints/helpers ensuring it is never empty for
  accepted scoring facts.
- If the final naming should be `structured_facts`, plan a future migration
  carefully; do not rename in Slice 2 unless necessary.

## 3. Draft Score Snapshot Creation

Slice 2 should create a backend helper/server workflow for generating a draft
score snapshot from accepted claims/facts.

The helper should:

- Accept an organization/subject identifier.
- Accept a scoring version identifier.
- Select accepted claims/facts only.
- Select only cited evidence items connected to those claims/facts.
- Create a new `score_snapshots` row.
- Never update an existing snapshot.
- Write an audit event for snapshot creation.

Each draft snapshot should record:

- `scoring_version_id`
- `organization_id` or subject/profile linkage
- evidence snapshot
- claim/fact snapshot
- score outputs if available
- coverage/recency/confidence
- visibility/publication status
- `created_by`, if added to schema

If final scoring math is not ready:

- Do not fabricate score values.
- Use `overall_score = null` where allowed.
- Use a draft/provisional status or clear non-public marker.
- Store coverage/recency/confidence only when derived from real evidence and
  accepted claims.
- Keep `visibility = private` by default.
- Keep `published_at = null`.

Open implementation decision:

- `score_snapshots` currently has `overall_score` nullable and visibility fields
  from Release 2.5. Slice 2 should decide whether to add:
  - `snapshot_status`
  - `created_by`
  - `draft_reason`
  - `source_claim_ids`

## 4. Score Output Rules

Release 3 Slice 2 must preserve these rules:

- Do not fabricate score values.
- Do not use placeholder score values.
- Do not seed fake scores.
- If only partial scoring is possible, store draft/provisional status.
- Avoid public display.
- Preserve traceability from score output to:
  - evidence
  - structured claims/facts
  - scoring version
  - snapshot timestamp
  - actor who created the snapshot, if available

If the system cannot calculate a legitimate score:

- Store `overall_score = null`.
- Store an explanation that scoring is pending or insufficiently supported.
- Do not expose it as a public Mishava Score.

## 5. Admin Guardrails

Admin and methodology users may eventually manage scoring versions, but Slice 2
must preserve these guardrails:

- Admin can create/publish scoring versions only through a versioned workflow.
- Admin cannot directly edit one company/org/product score.
- Scoring-sensitive changes create audit events.
- Published versions cannot be edited in place.
- Draft versions must be clearly marked draft.
- Snapshot creation should be append-only.
- Public publication should be a separate explicit action, not the default.

Guardrail implication:

- Any future admin screen should edit methodology/version records, not individual
  company scores.

## 6. Tests Required Before Slice 2 Acceptance

Planned tests:

- No structured claim/fact can become accepted without an evidence reference.
- Rejected claims do not enter score snapshots.
- Draft claims do not enter score snapshots.
- Accepted claims can enter a draft snapshot.
- Draft snapshot creation writes an audit event.
- Published scoring version cannot be silently edited.
- Draft snapshot is not public by default.
- Non-member cannot read private draft snapshot.
- Organization member can read their own private draft snapshot when allowed.
- Payment firewall tests from Slice 1 still pass.
- Snapshot immutability tests from Slice 1 still pass.
- No fake score seed data is introduced.

Live DB/RLS checks to plan:

- Confirm any new fields are present in `mishava-v2-dev`.
- Confirm RLS preserves private snapshot behavior.
- Confirm anonymous users cannot read draft/private snapshots.
- Confirm non-members cannot read another org's private draft snapshots.
- Confirm append-only triggers still block update/delete.

## 7. Non-Goals

Release 3 Slice 2 should not include:

- Final SDG scoring formula.
- AI extraction.
- AI scoring automation.
- Public score pages.
- Consumer Plus deep reports.
- Product catalog scoring.
- Gov scoring.
- Corporate scoring.
- Fake score seed data.
- Public claims that Mishava scoring is complete.

## 8. Recommended Build Order

1. Review current `structured_claims` and `score_snapshots` schema.
2. Decide whether Slice 2 needs minimal schema additions:
   - claim status
   - claim reviewer metadata
   - snapshot status
   - snapshot creator
   - source claim IDs
3. Add database constraints/helpers preventing accepted claims without evidence.
4. Add scoring version lifecycle helper.
5. Add accepted-claims-only snapshot helper.
6. Add audit event for draft snapshot creation.
7. Add tests for claim inclusion/exclusion and snapshot default privacy.
8. Run `npm test`, `npm run lint`, and `npm run build`.
9. If schema changes are added, apply migrations to `mishava-v2-dev`.
10. Run live DB/RLS checks against the clean V2 Supabase project.

## 9. Acceptance Criteria

Slice 2 is accepted only when:

- Implementation scope remains narrow.
- No fake scores are allowed.
- No invented score outputs are stored.
- Only accepted evidence-backed claims/facts enter draft snapshots.
- Draft snapshots are private by default.
- Snapshot creation is append-only.
- Scoring-sensitive actions create audit events where implemented.
- Live DB/RLS implications are identified and verified if schema changes are
  added.
- Payment firewall tests from Slice 1 still pass.
- Tests are listed and passing before implementation is accepted.
