# Release 4 Slice 2 Plan: Shopping Priorities

Status: planning only. Do not implement Release 4 Slice 2 code, migrations, UI changes, or scoring changes from this document until explicitly approved.

Source context:

- `docs/release-4-slice-1-result.md`
- `docs/release-4-slice-1-shopping-poc-real-data-plan.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-2-5-live-verification-result.md`
- Existing schema: `shopping_priority_profiles` in `supabase/migrations/202605240005_shopping_poc.sql`
- Existing route: `/app/shopping-priorities`

## Goal

Release 4 Slice 2 should plan the first real Shopping Priorities flow.

The goal is to let Mishava safely move from `Evidence Score` and `Score pending` toward `Your Values Score` only when:

- the user has saved valid Shopping Priorities,
- the product/business has enough evidence-backed scoring data,
- the match calculation uses allowed trust inputs only,
- and no payment, subscription, sponsorship, commission, affiliate, or hosted-profile factor affects the result.

Slice 2 is not the final SDG questionnaire, not Plus, not checkout, not AI scoring, and not a public scoring launch.

## 1. Shopping Priorities Purpose

Definitions:

- `Evidence Score`: the base score from available evidence, structured claims/facts, scoring versions, and published score snapshots.
- `Shopping Priorities`: the user's saved personal weighting preferences.
- `Your Values Score`: a personalized fit overlay between evidence-backed data and the user's saved priorities.

Rules:

- Shopping Priorities must not rewrite the base `Evidence Score`.
- `Your Values Score` must be shown as personal fit, not as an objective score.
- A company/product must not be made to look more trustworthy because a user cares more about one dimension.
- A low-evidence product should not receive a confident `Your Values Score`; it should show an evidence-needed state.
- Payment must not affect either score.

Recommended language:

> Evidence Score shows what Mishava's reviewed evidence supports. Your Values Score shows how that evidence lines up with the priorities you saved. Your priorities personalize your view; they do not change the product's base evidence score.

## 2. User Flow

Planned user path:

1. User can browse Shopping without an account.
2. Shopping page and score details can invite the user to create/save Shopping Priorities.
3. User signs in or creates an account before saving priorities.
4. User completes the starter questionnaire.
5. The starter path requires at least 12 answered preference questions before personalization can be enabled.
6. The longer path can expand to 25 total questions later: 20 preference questions plus 5 red-line rules.
7. User can retake/update priorities at any time.
8. The app should occasionally prompt users to answer additional questions or review old priorities, but not block basic shopping.
9. Red-line behavior can be set per rule as `Off`, `Warn me`, or `Hide`.

Current route:

- `/app/shopping-priorities` exists.
- Current page has starter questions and automatic-zero selectors.
- Current save action writes to `shopping_priority_profiles`.

Planned Slice 2 refinement:

- Treat current route as the authenticated saved-priorities surface.
- Add clearer language that this is a personal overlay, not base scoring.
- Add a route-safe way for Shopping and score popups to link to the priorities setup.
- Keep unauthenticated Shopping available.
- Do not show `Your Values Score` on Shopping until saved priorities and enough evidence-backed scoring inputs exist.

## 3. Data Model Review

Already exists:

```txt
shopping_priority_profiles
- id
- user_id
- answers jsonb
- automatic_zero_rules jsonb
- answered_count
- personalization_enabled
- version_code
- created_at
- updated_at
```

Already supported:

- User/account linkage through `user_id`.
- Version code.
- 12-answer minimum for enabled personalization.
- RLS for users reading/creating/updating their own priority profiles.
- Red-line style rules through `automatic_zero_rules`.

Gaps to consider before implementation:

- No explicit consent/privacy metadata.
- No separate `red_line_rules` table yet.
- No anonymous/session fallback.
- No priority-history table for previous versions or retakes.
- No `last_review_prompt_at` or `priority_review_due_at`.
- No explicit `red_line_mode` type/check constraint beyond JSON values.

Recommended Slice 2 migration, if implemented:

- Add optional consent/privacy fields to `shopping_priority_profiles`:
  - `consent_version`
  - `consented_at`
  - `privacy_acknowledged_at`
  - `last_reviewed_at`
- Consider keeping red-line rules in JSON for Slice 2, because the current scope is narrow.
- Defer a normalized `shopping_red_line_rules` table until the 25-question path or analytics/reporting needs it.

Anonymous/session fallback:

- Defer for Slice 2 unless required by UX.
- Reason: saving and applying priorities safely is simpler with authenticated user linkage.
- Unauthenticated users should see `Evidence Score` or `Score pending`, never `Your Values Score`.

## 4. Priority Dimensions

Use the existing Mishava framework first:

- Labor.
- Environment.
- Governance.
- Community.
- Local preference.
- Union-made preference.
- Environmental footprint visibility.
- Price-vs-values likelihood.
- Red-line rules.

Do not force all 17 SDGs into the first UI.

Initial starter dimensions should map cleanly to the four core pillars:

- Labor: living wages, worker safety, equal pay/opportunity, union-made or worker voice preference.
- Environment: clean water, climate/emissions, durability/repairability/lower waste.
- Governance: transparency, anti-corruption, honest reporting, political-spending concerns.
- Community: local business, local production, community benefit, small/family-owned preference.

Potential starter path:

- Keep the current 12-question minimum.
- Continue to support 1-5 slider/select values.
- Use red-line rules separately from preference weighting.
- Keep category-specific willingness-to-pay questions for later unless the implementation can keep them clearly separate from scoring.

## 5. Your Values Score Guardrails

`Your Values Score` may appear only when all are true:

- User is authenticated.
- User has a saved current-version priority profile.
- `personalization_enabled = true`.
- `answered_count >= 12`.
- Product/business has a published evidence-backed score snapshot or equivalent approved scoring inputs.
- The match calculation can access allowed trust/pillar inputs.
- The result can explain which evidence-backed dimensions contributed.

Allowed inputs:

- Evidence-backed labor/environment/governance/community scores or indicators.
- Evidence coverage.
- Evidence recency.
- Verification/confidence.
- User priority weights.
- Red-line modes, when supported by evidence-backed disqualification signals.
- Local/distance/availability only as shopping fit, not trustworthiness.

Forbidden inputs:

- Payment status.
- Subscription tier.
- Hosted profile status.
- Claimed profile status.
- Sponsorship.
- Commission.
- Affiliate/referral fee.
- Ad spend.
- Paid boost.
- Sales relationship.

Fallback states:

- `Complete Shopping Priorities to see Your Values Score`.
- `More evidence needed`.
- `Your Values Score pending`.
- `Evidence Score only`.
- `Score pending`.

Important UI rule:

- If a product lacks real scoring data, do not compute `Your Values Score` from user priorities alone.
- If a user has not saved priorities, do not show `Your Values Score`.
- If scoring data is draft/private/provisional, do not expose it as public `Your Values Score`.

## 6. Red-Line Behavior

Each red-line rule should support:

- `Off`: do not change display or ordering for this rule.
- `Warn me`: keep the result visible, but show a clear warning when evidence supports the rule.
- `Hide`: move matching results out of the default result list.

Rules:

- Hidden results must not disappear silently.
- UI should show a hidden-result count.
- User should be able to view hidden results if desired.
- Hidden results should include a clear reason such as `Hidden by your child labor red-line setting`.
- Red-line handling must be evidence-backed; no source, no enforced red-line.
- Red-line rules must not punish a company for country location alone unless evidence shows transparency is blocked or a user explicitly chooses transparency/country-risk filtering.
- Restoration must be evidence-led. If a company has corrected the issue and Mishava has credible evidence of correction, the warning/hide state should reflect the updated evidence state.

Planned first five red-line areas:

1. Child labor or forced labor evidence.
2. Severe worker harm, wage theft, unsafe conditions, retaliation, or discrimination with no proven correction.
3. Major environmental harm, illegal dumping, water pollution, deforestation, or habitat destruction with no proven correction.
4. Corruption, bribery, falsified evidence, fake certifications, identity misrepresentation, or concealment of material negative evidence.
5. Financial or operational support for political violence, dehumanization, removal of basic rights, or political capture that causes harm, expressed without naming specific leaders.

## 7. Privacy And Trust Language

Required user-facing language concepts:

- Priorities are personal.
- Priorities personalize ordering and explanations.
- Priorities do not change the base score for a company/product.
- Mishava does not sell personal priority profiles.
- Mishava does not use priorities for paid targeting.
- Payment does not affect scores or ranking.
- Users can update or retake priorities.

Recommended concise copy:

> Your Shopping Priorities are private to your account. They help Mishava explain which products line up with what matters to you. They do not change a product's Evidence Score, and Mishava does not sell your priority profile.

Recommended score popup copy:

> Evidence Score is Mishava's evidence-backed base score. Your Values Score is your personal fit overlay after you save priorities. Neither score can be bought.

Privacy considerations:

- Do not expose user priority profiles publicly.
- Do not include user priority profiles in public reports.
- Do not sell or license individual-level priority profiles.
- Any future aggregate Insights product must use privacy-safe aggregation thresholds and avoid identifying individuals.

## 8. Tests Required

Planned tests before Slice 2 acceptance:

- User can save Shopping Priorities.
- User can update Shopping Priorities.
- Saved priorities do not alter base `Evidence Score`.
- `Your Values Score` does not appear without saved priorities.
- `Your Values Score` does not appear without enough evidence-backed scoring data.
- `Your Values Score` does not appear from draft/private score snapshots.
- Payment status does not affect `Your Values Score`.
- Subscription tier does not affect `Your Values Score`.
- Hosted profile status does not affect `Your Values Score`.
- Claimed profile status does not affect `Your Values Score`.
- Sponsorship does not affect `Your Values Score`.
- Commission, affiliate fee, referral fee, and paid placement do not affect `Your Values Score`.
- Red-line `Warn me` shows a warning without hiding the result.
- Red-line `Hide` hides matching results from the default list and shows hidden-result count.
- Hidden results can be revealed by the user.
- Red-line handling does not apply without evidence-backed signals.
- Payment firewall tests still pass.
- `npm test`, `npm run lint`, and `npm run build` pass.

## 9. Non-Goals

Release 4 Slice 2 should not include:

- Plus monetization.
- AI personal shopper.
- Full SDG questionnaire.
- Final 25-question questionnaire if it expands beyond the narrow starter path.
- Public profile sharing of priorities.
- Selling priority data.
- Checkout.
- Affiliate/referral/commission logic.
- Local inventory.
- Business, Gov, Corporate, or Plus surfaces.
- Fake products.
- Fake scores.
- Fake evidence.
- Public claims that scoring is complete.

## 10. Acceptance Criteria

Slice 2 can be implemented only if:

- `Evidence Score` and `Your Values Score` remain separate.
- Shopping Priorities do not alter base evidence scoring.
- No fake or premature scores are introduced.
- `Your Values Score` is withheld unless user priorities and evidence-backed scoring data make it valid.
- Red-line modes are defined as `Off`, `Warn me`, and `Hide`.
- Hidden results are not silently removed.
- Privacy language is included.
- Payment and commission fields are explicitly excluded from personalization and ordering.
- Tests are written before acceptance.
- No product surfaces outside Shopping Priorities are expanded.

## Recommended Build Order For Future Implementation

1. Add/update tests around priority saving, withholding `Your Values Score`, and payment firewall boundaries.
2. Add small schema migration only if consent/privacy metadata is approved for Slice 2.
3. Harden `saveShoppingPrioritiesAction` validation and version handling.
4. Add a backend helper for determining whether `Your Values Score` is eligible.
5. Add a backend helper for calculating a provisional personal fit only from published evidence-backed pillar inputs.
6. Add red-line evaluation helper with `Off`, `Warn me`, and `Hide`.
7. Update Shopping display states without showing any invented values.
8. Re-run local checks and, if a migration is added, apply only to `mishava-v2-dev / snnscnodegbyqexnopvf`.
