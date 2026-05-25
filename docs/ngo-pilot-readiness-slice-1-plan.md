# NGO Pilot Readiness Slice 1 Plan

Status: planning only. Do not implement in this slice plan.

Source of truth:

- `docs/ngo-shopping-readiness-audit.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-2-5-live-verification-result.md`

## Goal

Move Mishava NGO from demo-ready toward pilot-ready by improving the real NGO workflow after evidence and draft report creation.

This slice should help an NGO user understand:

- what report they created
- what evidence and accepted claims support it
- what is still missing
- what remains private
- what actions are available now
- what features are intentionally not enabled yet

Scope is NGO-only. This slice must not build Shopping, Business, Local, Gov, Corporate, Plus, AI, Stripe, exports, or full sharing.

## 1. Report Detail Page

Plan a new protected report detail view for organization members:

```txt
/org/reports/[reportId]
```

The page should require:

- authenticated user
- current organization membership
- report belongs to current organization

The report detail page should show:

- report title
- report type/template
- report status, such as draft
- visibility, defaulting to private
- selected evidence
- selected accepted claims
- draft/provisional trust context
- created date
- updated date, if available
- created by, if available
- what is still missing
- clear "exports not enabled yet" label
- clear "sharing not enabled yet" label

Selected evidence display should include:

- evidence title
- source type
- source name or URL where available
- visibility
- verification/review status
- whether it is attached to structured claims

Selected accepted claims display should include:

- claim statement
- pillar or SDG context where available
- review status
- linked evidence reference

Draft/provisional trust context should be honest:

- "Trust context is provisional"
- "No public score has been created"
- "Only accepted, evidence-backed claims can support this report"
- "Draft or rejected claims are not included in the trust summary"

If a report references a draft score snapshot, show the snapshot status only. Do not show invented score values.

## 2. Report Edit / Update

Plan a minimal protected edit path for draft reports only.

The user should be able to update:

- report title
- selected organization-owned evidence
- selected accepted organization-owned structured claims

Private defaults must remain:

- report remains private unless future sharing logic explicitly changes visibility
- exports remain unavailable
- public publishing remains unavailable

Update rules:

- only organization members can update their own organization's draft reports
- report update must reject evidence from another organization
- report update must reject claims from another organization
- report update must reject draft/rejected claims for the trust summary
- report update should preserve existing private visibility
- report update must write an audit event

Recommended audit event:

```txt
ngo_report.draft_updated
```

Suggested audit metadata:

- report_id
- organization_id
- updated_by
- changed_fields
- selected_evidence_count
- accepted_claim_count
- rejected_selection_reason, if applicable

Do not implement approval workflow in this slice.

## 3. Evidence Clarity

Improve `/org/evidence` so NGO users can better understand evidence state and next steps.

Add or clarify labels for:

- Draft evidence
- Evidence entered but not reviewed
- Evidence with draft structured claims
- Evidence with accepted structured claims
- Evidence attached to draft reports
- Evidence not attached to any report yet
- Evidence still needing review

Evidence cards or rows should help answer:

- Is this evidence private?
- Has it been reviewed?
- Does it support any accepted claim?
- Is it used in any report?
- What can I do with it now?
- What is coming later?

Available-now actions may include:

- create a draft structured claim from evidence, if already available
- use accepted claims in reports
- attach evidence to a draft report through report edit

Later/not-yet actions should be clearly labeled:

- file upload
- full reviewer approval workflow
- export
- sharing
- AI report writing

## 4. Basic Empty / Error States

Add helpful empty and blocked states for the NGO report workflow.

Required empty states:

- No evidence yet
  - Encourage the user to add manual evidence first.
- No accepted claims yet
  - Explain that claims must be accepted before they support the trust summary.
- No reports yet
  - Guide the user to create a draft report.
- Report has no evidence selected
  - Explain that the report is still private and incomplete.
- Report has no accepted claims selected
  - Explain that trust context is provisional.

Required blocked/error states:

- report not found
- report belongs to another organization
- selected evidence belongs to another organization
- selected claim belongs to another organization
- rejected/draft claim cannot be included in trust summary
- update failed

Do not expose whether another organization's private report or evidence exists. Use a generic not-found or access-blocked message.

## 5. Privacy and Trust Labels

Use consistent labels across report detail, report edit, and evidence views.

Recommended labels:

- Private to your organization
- Draft report
- Not shared
- Evidence entered but not reviewed
- Evidence reviewed
- Accepted claim
- Draft claim
- Rejected claim
- Trust context is provisional
- No public score has been created
- Exports not enabled yet
- Sharing not enabled yet

Recommended explanatory text:

```txt
This draft report is private to your organization. Exports and sharing are not enabled yet.
```

```txt
Trust context is provisional until evidence-backed claims are reviewed and accepted.
```

```txt
No public Mishava score has been created from this report.
```

Avoid public-facing credibility language such as:

- verified
- certified
- trusted
- public score

unless it is supported by the current evidence, review status, and snapshot publication state.

## 6. Tests Required

Add or update tests for:

- NGO member can view own report detail.
- Non-member cannot view private report detail.
- NGO member can update report draft.
- Report update writes an audit event.
- Report cannot attach another organization's evidence.
- Report cannot include another organization's claims.
- Report cannot include rejected/draft claims in trust summary.
- Private reports remain private.
- Report detail does not show fake score values.
- Report detail labels exports/sharing as not enabled.
- Evidence view shows reviewed/draft/accepted/report attachment clarity.
- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.

If a migration is required during implementation, it must apply only to:

- `mishava-v2-dev / snnscnodegbyqexnopvf`

It must not touch:

- `mishava / tghbfautnxblfxrtkdqb`

## 7. Non-Goals

Exclude from this slice:

- PDF export
- Word export
- Excel export
- AI report writing
- AI evidence review
- funder portal
- public report library
- live billing
- team management
- Shopping changes
- Business changes
- Local changes
- Gov changes
- Corporate changes
- Plus changes
- scoring finalization
- public score publication
- full sharing workflow
- Stripe

## 8. Acceptance Criteria

This slice is accepted only if:

- NGO report workflow becomes clearer after report creation.
- NGO members can view a protected report detail page for their own reports.
- NGO members can update a draft report without changing its private default.
- Report updates write audit events.
- Reports cannot attach another organization's private evidence.
- Reports cannot include rejected or draft claims in the trust summary.
- Private reports remain private.
- No private data leaks.
- No fake scoring claims appear.
- No invented score values appear.
- User-facing labels are honest about draft, provisional, private, export, and sharing states.
- Tests are defined before implementation and pass when implemented.

## Recommended Build Order For Future Implementation

1. Add backend helper for fetching a report detail scoped to current organization.
2. Add report detail route and private/draft/provisional labels.
3. Add backend helper for draft report update with organization-owned evidence and accepted-claim validation.
4. Add audit event for report update.
5. Add report edit controls for title, selected evidence, and selected accepted claims.
6. Improve `/org/evidence` labels for review status, claim linkage, and report attachment.
7. Add empty/error states.
8. Add tests and run build/lint/test.

## Final Scope Note

NGO Pilot Readiness Slice 1 should make the existing NGO workflow more understandable and safer for a real NGO user. It should not broaden Mishava's product surface or make the system appear more complete than it is.
