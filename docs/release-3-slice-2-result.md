# Release 3 Slice 2 Result

Status: accepted for Slice 2 implementation.

Source documents:

- `docs/release-3-slice-2-plan.md`
- `docs/release-3-scoring-foundation-plan.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

Release 3 Slice 2 added the backend-only scoring pipeline foundation from
evidence-backed structured claims to private draft score snapshots.

Implemented:

- Added migration `202605240007_release_3_slice_2_scoring_pipeline.sql`.
- Added scoring version lifecycle fields:
  - `status`: `draft`, `published`, `archived`
  - `created_by`
- Added database triggers preventing silent mutation or deletion of published
  scoring versions.
- Added structured claim review fields:
  - `status`: `draft`, `reviewed`, `accepted`, `rejected`
  - `created_by`
  - `reviewed_by`
  - `review_reason`
- Added a database constraint requiring structured claims to cite at least one
  evidence item.
- Added draft snapshot fields:
  - `snapshot_status`
  - `created_by`
  - `draft_reason`
  - `source_claim_ids`
  - `source_evidence_item_ids`
- Updated public snapshot visibility policy so public reads require:
  - `snapshot_status = 'published'`
  - `published_at is not null`
  - public visibility
- Added backend scoring workflow helpers in `src/lib/scoring-workflows.ts`:
  - create draft scoring version
  - publish scoring version
  - accept or reject structured claims
  - create private draft score snapshot from accepted evidence-backed claims
- Added audit events for:
  - scoring version creation
  - scoring version publication
  - structured claim acceptance/rejection
  - draft score snapshot creation
- Added Release 3 Slice 2 guardrail tests.

No public scoring UI was added. No fake scores or invented scoring data were
created. No AI scoring workflow was added. No Plus score reports were added.
No new product surfaces were added.

## Migrations Applied

Applied to clean V2 Supabase project only:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Migration applied:

- `202605240007_release_3_slice_2_scoring_pipeline.sql`

Current migration alignment:

- Local and remote migrations are aligned through `202605240007`.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not modified.

## Live Checks Performed

Live verification against `mishava-v2-dev / snnscnodegbyqexnopvf` confirmed:

- A structured claim with no evidence reference is blocked by the database.
- Accepted, draft, and rejected claims can be represented with explicit status.
- A draft scoring version can be created.
- A draft scoring version can be published.
- A published scoring version cannot be silently edited.
- A private draft score snapshot can be created with `overall_score = null`.
- Draft snapshots are private by default.
- Anonymous users cannot read private draft snapshots.
- Previously published public snapshots remain publicly readable.

Representative live verification rows/actions:

- Accepted structured claim:
  `e121cf7d-0cbd-450e-8c32-c1e89db5051f`
- Draft structured claim:
  `17aba695-1b7c-43e7-969f-6f73e197dbde`
- Rejected structured claim:
  `aaa6cad8-ddff-4a2e-bc87-f3b3f313b5ff`
- Published scoring version:
  `5beb85f8-34d0-4c92-a0b1-cb06fa5485f4`
- Private draft score snapshot:
  `2bc87f43-1909-49a2-bfc0-377646a684e5`

The published-version mutation attempt failed with:

```txt
published scoring_versions are immutable; create a new version
```

The no-evidence claim insert failed with:

```txt
structured_claims_require_evidence_reference
```

## Tests Run

```bash
npm test
npm run lint
npm run build
/private/tmp/supabase-cli-2.101.0/supabase db push --linked
/private/tmp/supabase-cli-2.101.0/supabase migration list --linked
node /private/tmp/release3-slice2-live-check.mjs
```

Result:

- `npm test`: pass, 26 tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Live migration status: pass through `202605240007`.
- Live Slice 2 database behavior: pass.

## Known Limitations

- Release 3 Slice 2 does not implement final SDG scoring math.
- Draft score snapshots intentionally use `overall_score = null` until scoring
  math is approved.
- Snapshot hash generation is sufficient for draft traceability in this slice,
  but should be replaced or strengthened with a deterministic cryptographic hash
  before final public scoring publication workflows.
- The workflow helpers are backend/domain utilities; no public or admin scoring
  UI was added.
- Auth remains the temporary cookie abstraction from Release 2.5.
- Scoring workflow permissions should be narrowed further when final staff roles
  and methodology roles are implemented.
- AI extraction/scoring remains out of scope and not implemented.

## Remaining Release 3 Work

- Finalize SDG-to-pillar scoring methodology and math after review.
- Decide which normalized scoring tables are needed beyond snapshot JSON.
- Build controlled admin/methodology workflows without direct company-score
  editing.
- Add publication workflow for score snapshots.
- Strengthen snapshot hashing for final public score publication.
- Add more live RLS tests once final staff/member roles are wired.
- Continue payment firewall regression tests as scoring surfaces expand.

## Acceptance

Release 3 Slice 2 is accepted because:

- Tests pass.
- Live migration was applied to the clean V2 Supabase project.
- Structured claims cannot exist without evidence references.
- Only accepted evidence-backed claims are eligible for draft snapshot creation.
- Draft snapshots are private by default.
- Published scoring versions are immutable.
- Scoring-sensitive actions have audit-event workflow support.
- No public scoring claims/UI were added.
- No fake scoring data was introduced.
- No AI scoring or Plus score reporting was added.
