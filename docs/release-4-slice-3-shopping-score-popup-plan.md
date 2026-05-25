# Release 4 Slice 3 Plan: Shopping Score Popup And Trust Explanation Readiness

Status: planning only. Do not implement Release 4 Slice 3 code, migrations, UI changes, or scoring changes from this document until explicitly approved.

Source context:

- `docs/release-4-slice-2-result.md`
- `docs/release-4-slice-2-shopping-priorities-plan.md`
- `docs/release-4-slice-1-result.md`
- `docs/release-3-slice-2-result.md`
- `docs/release-3-slice-1-result.md`
- `docs/release-2-5-live-verification-result.md`
- Existing component: `src/components/ScoreExplainer.tsx`
- Existing shopping route: `/shopping`
- Existing product route: `/shopping/products/[slug]`

## Goal

Release 4 Slice 3 should make Shopping score explanation ready without pretending scoring is complete.

The goal is a small, accessible score popup or expandable trust explanation that tells shoppers:

- what score state they are seeing,
- what evidence supports it,
- what is still missing,
- whether the score is an Evidence Score, pending state, or future Your Values Score state,
- and that payment cannot affect score, ranking, or trust treatment.

Slice 3 is not final scoring math, not AI scoring, not Plus, not checkout, and not a full public score-report product.

## 1. Score Explanation Purpose

The score popup should answer:

- Why does this product/business have a score, or why is the score pending?
- What evidence coverage exists?
- How recent is the evidence?
- What verification/confidence status exists?
- What source or snapshot backs the score?
- What is missing?
- Does payment affect this result?

Required distinction:

- `Evidence Score`: the base evidence-backed score from a published score snapshot.
- `Score pending`: no published score snapshot exists.
- `Draft trust context`: internal/provisional context exists but is not a public score.
- `Your Values Score`: personal fit overlay, available only later when user priorities and enough evidence-backed scoring inputs exist.

Do not show a naked score without explanation.

## 2. UI Pattern

Preferred first implementation:

- Product card score chip opens an accessible dialog or expandable disclosure.
- Product detail score panel can reuse the same explanation component inline.
- If no product score exists, the popup still explains why the score is pending.

Accessibility requirements:

- Keyboard reachable trigger.
- Visible focus state.
- Proper dialog semantics if using a modal.
- Escape/close button if modal.
- Screen-reader labels.
- Non-color-only status labels.
- No hover-only access.
- Mobile-friendly layout.

Recommended labels:

- `Why this score?`
- `Evidence coverage`
- `Evidence recency`
- `Verification status`
- `What has been checked`
- `What is missing`
- `Snapshot date`
- `Payment firewall`

Avoid:

- `Top pick`
- `Premium`
- `Preferred`
- `Sponsored`
- `Best`
- `Trusted because paid`

## 3. Data Inputs

Existing shopping fields:

- `evidence_score`
- `score_label`
- `evidence_coverage`
- `evidence_recency`
- `verification_confidence`
- `score_snapshot_id`
- `score_published_at`
- `source_name`
- `source_url`
- `source_captured_at`
- `source_review_status`

Existing helper states:

- `Evidence Score`
- `Draft trust context`
- `Score pending`
- `complete_priorities`
- `more_evidence_needed`
- `your_values_score_pending`
- `evidence_score_only`

Possible component input shape:

```ts
type ShoppingScoreExplanation = {
  label: "Evidence Score" | "Draft trust context" | "Score pending" | "Your Values Score pending";
  score: number | null;
  coverage: "High" | "Medium" | "Low" | "Pending";
  recency: "Fresh" | "Recent" | "Stale" | "Pending";
  verification: string;
  confidence: "high" | "medium" | "low" | "pending";
  snapshotId?: string | null;
  snapshotPublishedAt?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  sourceCapturedAt?: string | null;
  sourceReviewStatus?: string | null;
  why: string;
  missing: string[];
  paymentFirewall: string;
};
```

No new database fields are required for Slice 3 unless implementation discovers that published snapshot visibility needs a safer display helper.

## 4. Explanation Rules

Evidence Score explanation:

- Show the numeric score only if `hasPublishedEvidenceScore(product)` is true.
- Show `score_snapshot_id` or shortened snapshot reference.
- Show `score_published_at`.
- Show coverage, recency, verification, and confidence.
- Explain that the score is evidence-backed and payment cannot affect it.

Score pending explanation:

- Show no score number.
- Explain that a score requires reviewed evidence, a scoring version, and a published score snapshot.
- Show available source/review metadata if it exists.
- Show what is missing, such as:
  - reviewed evidence,
  - accepted claims/facts,
  - scoring version,
  - published snapshot.

Draft trust context explanation:

- Show no public score number.
- Explain that Mishava may have provisional context, but it is not public scoring yet.
- Do not reveal private/draft snapshot details.

Your Values Score explanation:

- Do not show a value in Slice 3 unless supported by Slice 2 guardrails and real published scoring inputs.
- If priorities are not complete, show setup prompt.
- If evidence is missing, show `More evidence needed`.
- Explain that Your Values Score does not change the base Evidence Score.

## 5. Payment Firewall Language

Every popup should include a plain-language payment firewall note.

Recommended copy:

> Payment can unlock tools, hosting, catalogs, verification workflows, or reporting. It cannot buy score improvement, ranking advantage, placement, suppression of negative evidence, or a credibility label.

Short version for cards:

> Score and ranking cannot be bought.

## 6. Real-Data-Only Rules

Slice 3 must not:

- invent score values,
- invent evidence,
- invent source URLs,
- invent snapshot dates,
- create demo products,
- expose draft/private snapshots publicly,
- convert source review metadata into trust claims,
- show Your Values Score without valid priorities and evidence-backed scoring inputs.

If the app has no real products, the Shopping page should continue showing the real-data-only empty state.

## 7. Red-Line Explanation Readiness

Because Slice 2 stores red-line settings but does not fully filter results yet, Slice 3 should only prepare explanation language.

Allowed in Slice 3:

- Explain that red-line behavior is stored.
- Explain that Warn/Hide requires evidence-backed signals.
- Show `behavior pending` if filtering is not active.

Not allowed in Slice 3:

- Hide results silently.
- Enforce red-line rules without evidence-backed signals.
- Invent a red-line match.

## 8. Tests Required

Planned tests before Slice 3 acceptance:

- Score popup/expander exists on product cards or product detail.
- Score popup is keyboard accessible.
- Score popup shows `Score pending` when no published score snapshot exists.
- Score popup shows no invented numeric value when score is pending.
- Score popup shows Evidence Score only when published snapshot fields exist.
- Score popup explains coverage, recency, verification/confidence, and missing evidence states.
- Score popup includes payment firewall language.
- Score popup does not expose draft/private snapshot details.
- `Your Values Score` does not appear as a value without valid priorities and evidence-backed data.
- Red-line explanation states behavior requires evidence-backed signals.
- Existing payment firewall tests still pass.
- Existing no-fake-product/no-fake-score tests still pass.
- `npm test`, `npm run lint`, and `npm run build` pass.

## 9. Non-Goals

Release 4 Slice 3 should not include:

- Final SDG scoring math.
- AI scoring.
- Plus reports.
- Checkout.
- Affiliate/referral/commission logic.
- Local inventory.
- Business, Gov, or Corporate work.
- Product ingestion/admin workflow.
- Real product seed data.
- Fake products.
- Fake scores.
- Fake evidence.
- Hidden-result filtering.
- Full score report exports.

## 10. Acceptance Criteria

Slice 3 can be implemented only if:

- The explanation UI is accessible.
- Score states remain honest and evidence-backed.
- Pending/draft states do not display invented numbers.
- Public UI does not expose private/draft scoring data.
- Payment firewall language is visible.
- Evidence Score and Your Values Score remain separate.
- Red-line behavior is not enforced without evidence-backed signals.
- Tests are added before acceptance.
- No new product surfaces are expanded.

## Recommended Build Order For Future Implementation

1. Add tests for popup/expander copy and score-state guardrails.
2. Create a reusable score explanation helper from `ShoppingProduct` and optional priority profile state.
3. Create or update a reusable `ScoreExplainer`/`ShoppingScoreExplainer` component.
4. Add the explanation trigger to product cards and inline detail page panel.
5. Keep fallback states honest for empty/no-score products.
6. Run browser accessibility smoke checks on `/shopping` and product detail pages.
7. Run `npm test`, `npm run lint`, and `npm run build`.
