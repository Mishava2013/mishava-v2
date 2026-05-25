# Release 4 Slice 3 Result: Shopping Score Popup And Trust Explanation Readiness

Status: implemented. No database migration was needed.

Source context:

- `docs/release-4-slice-3-shopping-score-popup-plan.md`
- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-1-result.md`
- `docs/release-3-slice-1-result.md`

## Scope Implemented

Release 4 Slice 3 adds a reusable Shopping score/trust explanation component.

Implemented:

- Added `ShoppingScoreExplainer` as a reusable client component.
- Product cards can open a score/trust explanation popup from the score chip.
- Product detail pages reuse the same explanation content inline and as a popup.
- Added a shopping score explanation helper that derives safe explanation state from the real product record.
- Supported states:
  - `Evidence Score`
  - `Draft trust context`
  - `Score pending`
  - `Your Values Score unavailable`
  - `Your Values Score pending`
  - `More evidence needed`
- The explanation includes:
  - evidence coverage,
  - evidence recency,
  - verification status,
  - confidence,
  - source/review metadata,
  - score/snapshot status,
  - what has been checked,
  - what is missing,
  - draft/provisional status where applicable.
- The popup includes payment firewall language.
- The popup states that Mishava does not earn shopping commissions from outbound links.
- The popup explains that Shopping Priorities personalize the user view but do not change the base Evidence Score.
- Red-line explanation readiness is included:
  - Off means no red-line filtering.
  - Warn means a future warning when evidence conflicts with priorities.
  - Hide requires a visible hidden count and view-hidden control before results are hidden by default.

## Accessibility

Implemented accessibility features:

- Keyboard-accessible score trigger button.
- Dialog semantics with `role="dialog"`.
- `aria-modal="true"`.
- `aria-labelledby`.
- `aria-describedby`.
- Close button with screen-reader-friendly label.
- Escape key closes the popup.
- Focus moves to the close button when the popup opens.
- Focus returns to the trigger after close.
- Statuses are expressed in text, not color alone.
- Mobile-friendly responsive layout.

## Tests Run

- `npm test`
- `npm run lint`
- `npm run build`
- Browser smoke check for `/shopping`

Test coverage added or updated:

- Score popup/expander wiring exists on shopping cards and product detail.
- Score popup uses accessible dialog labels.
- Score popup supports Escape close behavior.
- Score popup shows safe pending state without invented values.
- Score explanation helper uses real product state only.
- Score popup includes payment firewall language.
- Score popup includes no-commission language.
- Score popup explains Shopping Priorities do not change Evidence Score.
- Red-line explanation states hidden results require visible hidden-count behavior.
- Existing payment firewall tests still pass.
- Existing no-fake-product/no-fake-score tests still pass.
- `/shopping` still renders the real-data-only baby products empty state.

## Known Limitations

- No real product records are loaded yet, so the popup has no live product card data to display.
- No personalized score number is calculated.
- `Your Values Score` remains unavailable or pending unless future scoring and priority inputs make it valid.
- Red-line Warn/Hide settings are explained but not enforced yet.
- Hidden-result count and view-hidden controls are not implemented yet.
- Draft/private snapshot details are not exposed publicly.
- Full score report/export views are not implemented.

## Remaining Shopping Readiness Work

Recommended next work:

1. Add real baby-products records only through the approved source/review workflow.
2. Add product ingestion/admin review tooling.
3. Add published score snapshot attachment flow for real products.
4. Add evidence-backed personal-fit calculation from published pillar inputs.
5. Add red-line evidence signal mapping before filtering or hiding any results.
6. Add hidden-result count and view-hidden controls before enabling Hide behavior.

## Final Confirmation

Release 4 Slice 3 did not add fake scores, fake products, fake stores, fake evidence, Plus, checkout, affiliate logic, AI scoring, Local, Business, Gov, or Corporate work.

The score explanation layer is ready to explain real evidence states when real product and score data are available.
