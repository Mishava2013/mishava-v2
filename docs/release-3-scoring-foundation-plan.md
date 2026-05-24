# Release 3 Scoring Foundation Plan

Status: planning only. Do not implement Release 3 code from this document until
the scope is explicitly approved.

Release 2.5 is live-verified and documented in:

- `docs/release-2-5-live-verification-result.md`

## 1. Release 3 Goal

Release 3 should make Mishava scoring harder to corrupt, more auditable, and
better structured.

The goal is not to make flashy scoring UI or public claims that scoring is
complete. The goal is to create a trustworthy scoring foundation: versioned
methodology records, immutable score snapshots, backend helpers, admin
guardrails, and tests proving payment cannot affect scores or rankings.

Release 3 must preserve these rules:

- Do not create fake scores.
- Do not generate invented scoring data.
- Do not let payment, hosted profile status, claimed profile status,
  subscription tier, or sponsorship affect score or rank.
- Do not publish scoring claims until the evidence, scoring version, and
  snapshot rules support them.

## 2. Required Database / Backend Scope

Release 3 should verify or extend the existing live schema around these records:

- `scoring_versions`
- `evidence_items`
- `structured_claims`
- SDG score records, if already present or explicitly added as part of the
  approved Release 3 schema
- pillar score records, if already present or explicitly added as part of the
  approved Release 3 schema
- `score_snapshots`
- `ranking_formula_versions`
- `ranking_audit_samples`
- `audit_events`

Required backend/helper scope:

- Scoring version helper for draft/active/published states.
- Snapshot creation helper that always appends a new snapshot.
- Snapshot visibility helper for private, public summary, and public full record
  access.
- Ranking helper that accepts only allowed ranking inputs.
- Payment firewall helper or test fixture proving payment-derived fields are
  ignored.
- Audit-event helper usage for scoring-sensitive actions.

Recommended database review before build:

1. Confirm current live `score_snapshots` schema is sufficient for immutable
   snapshots.
2. Confirm whether SDG score and pillar score records should be normalized
   tables in Release 3 or remain inside snapshot JSON until the final math is
   approved.
3. Confirm whether `ranking_formula_versions` needs additional fields for
   forbidden-factor declarations and public methodology notes.
4. Confirm whether `ranking_audit_samples` should store input factors,
   excluded factors, final rank output, and explanation metadata.

## 3. Immutable Snapshot Rules

Score snapshots must be append-only.

Rules:

- Old snapshots are preserved.
- A new scoring run creates a new snapshot.
- New material evidence creates a new snapshot after scoring is rerun.
- Every snapshot records the scoring version used.
- Every snapshot records evidence/fact/indicator/pillar state as of scoring.
- Snapshot visibility and publication are controlled.
- Private organization-linked snapshots are not public by default.
- Public snapshots require explicit publication and public visibility.
- Snapshot changes should be represented by a newer snapshot, not mutation of
  the old one.

Release 3 should add tests proving:

- Existing snapshots cannot be overwritten through normal workflows.
- Private snapshots are not visible to anonymous users.
- Published public snapshots are visible only when visibility allows it.
- Organization members can read their private organization snapshots.

## 4. Payment Firewall Rules

Release 3 must include tests proving these fields do not affect score:

- `payment_status`
- `subscription_tier`
- `hosted_profile_enabled`
- `claimed_profile_status`
- `sponsorship`

Release 3 must include tests proving these fields do not affect ranking:

- `payment_status`
- `subscription_tier`
- `hosted_profile_enabled`
- `claimed_profile_status`
- `sponsorship`

Specific assertions:

- Payment status does not affect score.
- Subscription tier does not affect score.
- Hosted profile status does not affect score.
- Claimed profile status does not affect score.
- Sponsorship does not affect score.
- Payment status does not affect ranking.
- Subscription tier does not affect ranking.
- Hosted profile status does not affect ranking.
- Claimed profile status does not create a ranking boost.
- Sponsorship does not create a ranking boost.

Payment may unlock tools, workflows, hosting, reports, saved searches, team
features, and verification/audit services. Payment must not improve score,
ranking, perceived credibility, or visibility.

## 5. Ranking Helper Rules

Allowed ranking factors:

- Search match.
- Evidence score.
- User preference match.
- Evidence coverage.
- Evidence recency.
- Verification/confidence.
- Category fit.
- Local/distance/availability where relevant.

Forbidden ranking factors:

- Payment.
- Sponsorship.
- Subscription.
- Hosted profile.
- Claimed profile.
- Sales commission.
- Affiliate/referral fee.
- Ad spend.
- Paid boost.

The ranking helper should reject or ignore forbidden inputs. Tests should prove
that two otherwise identical records rank identically even when one has paid
features and the other does not.

## 6. Admin Scoring Guardrails

Admin scoring tools may eventually allow authorized users to view and configure
draft scoring versions, but Release 3 must preserve these guardrails:

- No admin should directly edit one company's score.
- Scoring changes require versioning.
- Scoring-sensitive actions require audit events.
- Published scoring versions should be immutable.
- Draft versions should be clearly marked draft.
- Draft versions should not be confused with published public methodology.
- Any future scoring version approval should require methodology/admin-level
  permission.

Admin tooling should make scoring more auditable, not easier to manipulate.

## 7. Tests Required Before Release 3 Acceptance

Required tests/checks:

- Payment firewall tests.
- Ranking forbidden-factor tests.
- Snapshot immutability tests.
- Snapshot visibility/RLS tests.
- Audit event tests for scoring-sensitive actions.
- Build check.
- Lint check.
- Test suite check.

Live checks should verify the clean V2 Supabase project behavior when database
changes are included in Release 3.

## 8. Non-Goals

Release 3 should not include:

- Full final SDG scoring math.
- Full public scoring UI.
- AI scoring automation.
- Paid Plus score reports.
- Final methodology certification.
- Fake/demo scores.
- Invented scoring data.
- Public claims that Mishava scoring is complete.

## 9. Recommended Build Order

1. Review current live scoring-related schema against this plan.
2. Decide whether SDG/pillar rollups stay in snapshot JSON for Release 3 or need
   normalized tables.
3. Add or tighten immutable snapshot database safeguards if needed.
4. Build backend scoring-version and snapshot helpers.
5. Build ranking helper with explicit allowed/forbidden factor boundaries.
6. Add payment firewall and forbidden-factor tests.
7. Add snapshot immutability and visibility tests.
8. Add audit-event tests for scoring-sensitive actions.
9. Run build/lint/test.
10. If database changes are added, apply them to `mishava-v2-dev` and re-run
    live checks.

## 10. Acceptance Criteria

Release 3 can be accepted only when:

- Scoring/snapshot schema is live-applied or confirmed current.
- Backend helpers exist.
- Tests pass.
- Payment firewall tests pass.
- Immutable snapshot behavior is proven.
- Public/private snapshot visibility is proven.
- Scoring-sensitive audit events are proven.
- No fake scoring data is introduced.
- No payment-derived field affects score or ranking.
