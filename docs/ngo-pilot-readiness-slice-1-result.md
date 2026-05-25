# NGO Pilot Readiness Slice 1 Result

Status: implemented.

Source of truth:

- `docs/ngo-pilot-readiness-slice-1-plan.md`
- `docs/ngo-shopping-readiness-audit.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-2-5-live-verification-result.md`

## What Was Implemented

NGO Pilot Readiness Slice 1 improves the NGO workflow after evidence and draft report creation.

Implemented:

- Added protected report detail route:
  - `/org/reports/[reportId]`
- Report detail shows:
  - report title
  - report template/type
  - approval status
  - visibility
  - selected evidence
  - selected accepted claims
  - draft/provisional trust context
  - created date
  - updated date
  - what is still missing
  - "exports not enabled yet" label
  - "sharing not enabled yet" label
- Added private draft report update workflow for NGO members:
  - report title update
  - selected organization-owned evidence update
  - selected accepted organization-owned claims update
  - private visibility preserved
  - draft status preserved
  - audit event written on update
- Added backend guardrails:
  - report detail fetch is scoped by organization
  - report update requires organization ownership
  - report update rejects another organization's evidence
  - report update rejects another organization's claims
  - report update rejects draft/rejected claims from trust summary
  - accepted claims must be backed by selected evidence
- Improved `/org/evidence` clarity:
  - draft vs reviewed labels
  - "Evidence entered but not reviewed"
  - accepted claim counts
  - report attachment labels
  - next available action labels
  - future/later workflow labels
- Improved `/org/reports`:
  - created reports redirect to report detail
  - report list links to draft detail
  - private/not-shared/raw-evidence labels remain visible

## Migrations Applied

No migration was required.

Existing schema already supported this slice through:

- `ngo_reports.updated_at`
- `ngo_reports.evidence_item_ids`
- `ngo_reports.structured_claim_ids`
- `ngo_reports.visibility`
- `ngo_reports.approval_status`
- `audit_events`

Migration alignment was checked against the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`
- Local and remote migrations are aligned through `202605240010`.

The old Supabase project was not modified:

- `mishava / tghbfautnxblfxrtkdqb`

## Tests Run

```bash
npm test
npm run lint
npm run build
/private/tmp/supabase-cli-2.101.0/supabase migration list --linked
```

Results:

- `npm test`: pass, 45 tests.
- `npm run lint`: pass.
- `npm run build`: pass.
- Supabase migration list: pass, clean V2 project aligned through `202605240010`.

New test coverage includes:

- NGO member can view own report detail.
- Non-member cannot view private report detail because detail fetch is organization-scoped.
- NGO member can update a draft report.
- Report update writes an audit event.
- Report update rejects another organization's evidence.
- Report update rejects another organization's claims.
- Report trust summary rejects draft/rejected claims.
- Private reports remain private.
- Report detail does not show fake score values.
- Evidence page clarifies review state, report attachment, and available actions.

## Live Checks Performed

No live schema change was needed or applied.

Live project checks performed:

- Confirmed the repo remains linked to the clean V2 Supabase project.
- Confirmed local and remote migrations remain aligned through `202605240010`.
- Confirmed no migration was added for this slice.

Functional behavior is covered by the local automated suite and existing live-verified Release 2.5 / Release 3 Slice 3 foundations.

## Known Limitations

- Auth is still the temporary cookie abstraction, not the final hosted auth provider.
- Server workflows still use the service-role-backed server client after app-level route/session guards.
- Report sharing is still not enabled.
- Report exports are still not enabled.
- Report approval workflow is not implemented.
- Full structured claim review UI is not implemented.
- File uploads/storage are still not production-ready.
- AI report writing/rebuild is not implemented.
- Public report library is not implemented.
- No final SDG scoring math is implemented.
- No public scoring UI is implemented.

## Remaining NGO Pilot-Readiness Work

- Replace temporary auth with final hosted auth provider.
- Add production-safe file upload/storage with visibility, redaction, scanning, and retention controls.
- Build full structured claim review and acceptance UI for authorized reviewers.
- Add report approval workflow.
- Add scoped share grants and protected shared views.
- Add export generation later after privacy, accessibility, and legal requirements are reviewed.
- Add audit trail viewing for NGO evidence/report actions.
- Add mobile/accessibility QA pass for report and evidence workflows.

## Scope Confirmation

This slice did not add:

- Shopping work
- Business work
- Local work
- Gov work
- Corporate work
- Plus work
- AI workflows
- Stripe
- exports
- public report library
- full sharing
- fake scores
- public scoring UI
- final scoring math

## Acceptance

NGO Pilot Readiness Slice 1 is accepted because:

- NGO report workflow is clearer after report creation.
- NGO members can view protected report detail pages for their own reports.
- NGO members can update private draft reports.
- Report updates write audit events.
- Another organization's evidence cannot be attached.
- Draft/rejected claims cannot enter report trust summaries.
- Private reports remain private.
- No private data leaks were introduced.
- No fake scoring claims or invented score values were introduced.
- User-facing labels are honest about private, draft, provisional, export, and sharing states.
