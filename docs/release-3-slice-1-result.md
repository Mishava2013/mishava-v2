# Release 3 Slice 1 Result

Status: accepted for Slice 1 implementation.

Source documents:

- `docs/release-3-scoring-foundation-plan.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

Release 3 Slice 1 focused only on scoring/ranking corruption resistance and
snapshot safety.

Implemented:

- Expanded payment firewall constants to separate:
  - billable entitlements
  - profile tools
  - hosted pages
  - catalogs
  - reports
  from:
  - score calculation
  - ranking calculation
  - verification status
  - credibility labels
- Added complete forbidden trust-influence inputs:
  - `payment_status`
  - `subscription_tier`
  - `hosted_profile_enabled`
  - `claimed_profile_status`
  - `sponsorship_status`
  - `ad_spend`
  - `paid_boost`
  - `sales_commission`
  - `affiliate_fee`
  - `referral_fee`
- Hardened ranking helpers so `RankableResult` accepts only evidence/fit inputs,
  not payment-derived fields.
- Added helper assertions for billable entitlements and trust-control separation.
- Added migration `202605240006_release_3_slice_1_firewalls.sql`.
- Added append-only `score_snapshots` update/delete triggers.
- Updated the stored ranking formula version to include the full allowed and
  forbidden input boundaries.
- Added Release 3 Slice 1 guardrail tests.

No public scoring UI was added. No fake scores or invented scoring data were
created. No AI scoring workflow was added. No Plus score reports were added.

## What Was Verified

Local tests verified:

- Payment does not affect score.
- Payment does not affect ranking.
- Subscription tier does not affect score/ranking.
- Hosted profile status does not affect score/ranking.
- Claimed profile status does not affect score/ranking.
- Sponsorship status does not affect score/ranking.
- Commission, affiliate, and referral fields do not affect ranking.
- Billable surfaces are separated from trust calculation surfaces.
- Forbidden paid visibility concepts are not part of rankable result inputs.
- Snapshot visibility policies require publication and org membership.
- Score snapshots have append-only trigger protection in the migration.

Live Supabase verification against `mishava-v2-dev / snnscnodegbyqexnopvf`
confirmed:

- Migration `202605240006` applied cleanly.
- Local and remote migrations are aligned through `202605240006`.
- `score_snapshots_no_update` trigger exists.
- `score_snapshots_no_delete` trigger exists.
- The active ranking formula record includes the full allowed/forbidden input
  boundaries.
- A direct update attempt against `score_snapshots` failed with:
  `score_snapshots are append-only`.

Migration apply note:

- Supabase reported expected notices that the new snapshot triggers did not
  previously exist before being created.

## Tests Run

```bash
npm test
npm run lint
npm run build
/private/tmp/supabase-cli-2.101.0/supabase migration list --linked
/private/tmp/supabase-cli-2.101.0/supabase db push --linked
/private/tmp/supabase-cli-2.101.0/supabase db query --linked -o json "select tgname from pg_trigger ..."
/private/tmp/supabase-cli-2.101.0/supabase db query --linked -o json "select allowed_inputs, forbidden_inputs, payment_inputs_used from ranking_formula_versions ..."
/private/tmp/supabase-cli-2.101.0/supabase db query --linked -o json "update score_snapshots ..."
```

Result:

- `npm test`: pass, 19 tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Live migration status: pass through `202605240006`.
- Live snapshot immutability update attempt: blocked.

## Remaining Release 3 Work

- Decide whether SDG and pillar rollups remain inside snapshot JSON for Release
  3 or require normalized tables.
- Add scoring-version draft/published lifecycle helpers.
- Add audit events for scoring-sensitive actions once those actions exist.
- Add scoring-version immutability rules for published versions.
- Add snapshot creation helpers that append new snapshots instead of updating old
  ones.
- Add admin scoring workflow guardrails without direct company-score editing.
- Continue methodology planning before full final SDG scoring math is built.

## Known Limitations

- Release 3 Slice 1 does not implement final SDG scoring math.
- Release 3 Slice 1 does not implement public scoring UI.
- Release 3 Slice 1 does not implement AI scoring automation.
- Release 3 Slice 1 does not implement paid Plus score reports.
- Scoring-sensitive audit events are documented as required, but only workflows
  that already exist create audit events.
- Snapshot insertion remains a backend/service workflow; Slice 1 prevents
  mutation of existing snapshots.

## Acceptance

Release 3 Slice 1 is accepted because:

- Tests pass.
- Live migration was applied to the clean V2 Supabase project.
- Payment firewall tests pass.
- Ranking forbidden-factor tests pass.
- Snapshot immutability is enforced live.
- Snapshot visibility/RLS rules remain verified by tests and prior live
  verification.
- No public scoring claims/UI were added.
- No fake scoring data was introduced.
