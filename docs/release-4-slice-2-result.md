# Release 4 Slice 2 Result: Shopping Priorities

Status: implemented and live migration applied to the clean Mishava V2 Supabase project.

Source context:

- `docs/release-4-slice-2-shopping-priorities-plan.md`
- `docs/release-4-slice-1-result.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-2-5-live-verification-result.md`

## Scope Implemented

Release 4 Slice 2 implements the first real Shopping Priorities flow.

Implemented:

- `/app/shopping-priorities` loads the current user's saved priority profile.
- Users can save priorities.
- Users can update/retake priorities.
- The starter path keeps the 12-question minimum before personalization can be enabled.
- Priority questions remain tied to labor, environment, governance, community, local preference, union-made/worker voice preference, environmental impact, price-vs-values likelihood, and transparency/accountability.
- Red-line settings persist as `Off`, `Warn me`, or `Hide`.
- The page now explains:
  - Evidence Score is the base evidence-backed score.
  - Shopping Priorities personalize the user's experience.
  - Shopping Priorities do not change any company or product Evidence Score.
  - Mishava does not sell personal priority profiles.
  - Payment does not affect score or ranking.
- Shopping now links users to complete priorities, but still withholds `Your Values Score` unless priorities and enough evidence-backed scoring data exist.
- Product detail copy clarifies that priorities do not change the base Evidence Score.
- Added helper state for safe `Your Values Score` eligibility:
  - `complete_priorities`
  - `more_evidence_needed`
  - `your_values_score_pending`
  - `evidence_score_only`

Not implemented:

- Plus monetization.
- Checkout.
- Affiliate/referral/commission logic.
- AI scoring.
- Local, Business, Gov, or Corporate work.
- Fake products, stores, evidence, or scores.
- Personalized score numbers.

## Database / Migration

Migration applied:

- `202605240010_release_4_slice_2_shopping_priorities.sql`

Clean project:

- Name: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Old project not modified:

- `mishava / tghbfautnxblfxrtkdqb`

Migration changes:

- Added Shopping Priorities privacy/review metadata to `shopping_priority_profiles`:
  - `consent_version`
  - `consented_at`
  - `privacy_acknowledged_at`
  - `last_reviewed_at`

No product, seller, evidence, score, price, affiliate, commission, checkout, Plus, or other product-surface data was seeded.

## Live Checks Performed

Live migration status:

- Migrations `202605240001` through `202605240010` are applied remotely on `mishava-v2-dev`.

Live persistence check:

- Upserted a Shopping Priorities profile for the existing Release 2.5 live test user.
- Confirmed:
  - `answered_count = 12`
  - `personalization_enabled = true`
  - red-line settings persisted with `warn`, `hide`, and `off`
  - `consent_version = Shopping_Priorities_Privacy_V1_2026.05.24`
  - `privacy_acknowledged_at` is populated
- Updated the saved `price_flexibility` answer and confirmed the row updated.

Live page/render check:

- Rendered `/app/shopping-priorities` with a valid temporary session cookie for the live test user.
- Confirmed the page shows:
  - `Your Values Score setup`
  - saved-profile update state
  - `Warn me` and `Hide` red-line options
  - privacy language
  - Evidence Score separation language

## Tests Run

- `npm test`
- `npm run lint`
- `npm run build`

Test coverage added or updated:

- Shopping priorities persist to the database with the 12-answer minimum.
- Shopping priorities store consent/privacy fields.
- Shopping priorities migration does not seed data.
- Shopping page shows safe priority setup guidance without inventing score values.
- Shopping priorities page supports save/update/retake state.
- Red-line settings persist as Off/Warn/Hide values.
- Your Values Score eligibility requires saved priorities and published evidence.
- Payment, subscription, hosted profile, claimed profile, sponsorship, commission, affiliate, referral, and paid placement fields do not affect Your Values Score.
- Existing payment firewall tests still pass.

## Known Limitations

- Auth remains the temporary cookie abstraction from Release 2.5.
- Shopping Priorities are stored for authenticated users only; anonymous/session-only priorities are deferred.
- `Your Values Score` is not calculated yet.
- The helper returns safe eligibility states, not personalized score numbers.
- Red-line `Warn`/`Hide` settings are stored, but product filtering is not fully active because evidence-backed red-line signals are not finalized.
- Hidden-result count and reveal controls are still future work.
- The full 25-question questionnaire remains future work.
- No aggregate Insights or report use of priority data exists yet.

## Remaining Shopping Readiness Work

Recommended next work:

1. Build evidence-backed personal-fit calculation from published score snapshots and pillar inputs.
2. Add red-line evidence signal mapping before filtering any results.
3. Implement hidden-result count and reveal controls when `Hide` is active.
4. Add user-visible score detail/popup once real score snapshots exist.
5. Add real baby-products data only through approved source/review workflow.
6. Add final questionnaire review before expanding beyond the 12-question starter path.

## Final Confirmation

Release 4 Slice 2 did not add fake scores, fake products, fake stores, fake evidence, Plus, checkout, affiliate logic, AI scoring, Local, Business, Gov, or Corporate work.

Shopping Priorities personalize only the user's future view. They do not change base Evidence Scores, ranking guardrails, or payment firewall rules.
