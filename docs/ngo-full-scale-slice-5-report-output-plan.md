# NGO Full-Scale Slice 5 Plan: Report Output and Export Readiness

Status: planning only. Do not implement from this document directly.

## Purpose

Plan the report output/export work needed to move Mishava NGO closer to full-scale self-serve use.

This slice should make NGO reports more useful as polished, readable, recipient-safe outputs while preserving Mishava's trust rules:

- reports are private by default;
- raw evidence is not exposed by default;
- exported/shared content must respect evidence visibility;
- no public score exists unless explicitly created through a future scoring workflow;
- no invented scoring values or unsupported claims may appear.

## Source Of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-4-evidence-files-result.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`
- `docs/ngo-pilot-readiness-reaudit.md`

## Current Context

Mishava NGO currently supports:

- authenticated NGO organization workflows;
- current organization selection and org-scoped access;
- team roles and member management;
- manual evidence creation;
- private evidence file metadata and private storage bucket setup;
- evidence lifecycle states;
- draft report creation;
- report detail/update;
- scoped share grants;
- shared report summary view;
- audit events for sensitive NGO actions.

Remaining report-output gap:

- report detail is functional but not yet a polished report preview;
- exports are not enabled;
- recipient-facing shared view is safe but still basic;
- report lifecycle/status is not yet mature enough for production-ready output;
- there is no print/PDF/CSV/DOCX readiness path.

## Slice Goal

Create a narrow implementation plan for NGO report presentation, preview, export readiness, and safe recipient-facing output.

The first implementation should make one report usable as a clean, readable, private or shared artifact without introducing public reporting, fake scores, final scoring math, billing, AI writing, or broad export complexity.

## 1. Report Preview / Readability

The report detail page should become a polished report preview, not just an editing workspace.

The preview should include:

- report title;
- report type/template;
- report status;
- visibility;
- organization profile summary;
- selected evidence summaries;
- selected accepted claims;
- provisional trust context;
- created date;
- updated date;
- sharing status;
- archive/status labels when applicable;
- clear missing-items section.

Required labels:

- `Draft report`
- `Private to your organization`
- `Not publicly scored`
- `Trust context is provisional`
- `Raw evidence is not included by default`
- `Evidence coverage may be incomplete`
- `Exports generated from this report must respect evidence visibility`

Recommended layout:

- report header with status and visibility labels;
- organization summary block;
- trust context block;
- evidence summary section;
- accepted claims section;
- limitations/disclaimer section;
- sharing/export action area;
- print-friendly footer with generated date if in print mode.

Important:

The preview must not look like a final certification if the report is still draft/provisional. The visual tone should feel credible and readable, but every unresolved state must be clearly labeled.

## 2. Export Options

Recommended export sequence:

1. Print-friendly browser view.
2. PDF export only after the print view is stable.
3. CSV export for evidence list if useful.
4. DOCX/Word export later as optional.

### Print-Friendly Browser View

This should be the first output target because it is the fastest and safest way to create useful report output.

Plan:

- add print styles for the report preview;
- hide editing/share controls in print;
- include generated date;
- include report status and visibility;
- include disclaimers;
- preserve evidence/claim summaries;
- avoid raw file links by default;
- ensure the printed report does not imply public scoring or certification.

### PDF Export

PDF should be considered after the print preview is solid.

Options:

- browser print-to-PDF first;
- server-generated PDF later if needed for institutional/funder use.

PDF requirements:

- generated/exported date;
- report status;
- visibility label;
- evidence coverage/recency caveat;
- no raw files by default;
- no unrelated organization data;
- audit event if generated through an app action.

### CSV Evidence List

CSV may be useful for funders, internal NGO reporting, or evidence tracking.

CSV should include only allowed fields:

- report title;
- evidence title;
- evidence type/source type;
- source name;
- URL if visibility permits;
- evidence lifecycle status;
- verification/review status;
- archived label if applicable;
- created/updated date.

CSV should not include:

- raw file paths;
- signed URLs;
- private notes unless explicitly allowed later;
- unrelated org evidence;
- rejected/draft claims as accepted trust context.

### DOCX / Word Export

DOCX should be treated as later optional work.

It may become important for foundations, grant reporting, or board packets, but it should follow the same privacy and disclaimer rules as print/PDF.

## 3. Export Privacy Rules

All export paths must enforce privacy server-side.

Rules:

- private reports remain private;
- exported content must respect evidence visibility;
- raw files are not included by default;
- raw file access requires explicit future permission and audit trail;
- archived evidence must be labeled when included;
- exported reports must include generated/exported date;
- exported reports must include report status;
- exported reports must include visibility status;
- exported reports must not expose unrelated organization data;
- exports must not include another organization's evidence or claims;
- revoked/expired share grants cannot access export output;
- a shared recipient export, if enabled, can only include the shared report summary and allowed evidence summaries.

Recommended default:

Only NGO organization members can export in Slice 5. Shared-recipient export can wait unless the print view is safe and clearly scoped.

## 4. Shared Recipient View

The shared report view should become a cleaner recipient-facing report summary.

It should show:

- report title;
- sender NGO name/profile summary;
- report type/template;
- purpose of the share grant;
- recipient name/email if appropriate;
- expiration status;
- report status;
- selected evidence summaries;
- selected accepted claims;
- provisional trust context;
- clear limitations/disclaimer language.

It must not show:

- full organization workspace;
- unrelated reports;
- unrelated evidence;
- raw evidence files by default;
- internal notes by default;
- report edit controls;
- team/member data;
- billing/admin links.

Labels:

- `Shared by the NGO`
- `Shared report summary`
- `Raw evidence not included by default`
- `No full workspace access`
- `Access expires`
- `Access revoked` when blocked
- `No public score has been created`

The shared recipient view should remain authenticated/grant-protected unless a future tokenized sharing model is explicitly approved.

## 5. Report Status / Lifecycle

Planned report statuses:

- `draft`
- `ready_for_review`
- `shared`
- `archived`

Recommended for this slice:

- keep `draft` as the default;
- allow `shared` to be represented by active share grants rather than forcing status mutation immediately;
- add `archived` only if the implementation also prevents archived reports from being edited/shared as active work;
- defer `ready_for_review` unless a report review/approval workflow is included in a later slice.

Role expectations:

- owner/admin/member can create and update draft reports if permissions allow;
- viewer can read reports where permitted but cannot mutate;
- owner/admin can manage sharing;
- report archiving should require owner/admin or a clearly authorized role.

## 6. Audit Events

Planned audit events:

- `report.status_changed`
- `report.archived`
- `report.export_generated`
- `report.print_view_opened` only if useful and not too noisy;
- `shared_report.viewed` where already feasible;
- `shared_report.export_generated` if shared-recipient export is enabled later.

Recommendation:

Do not log every normal preview page load for internal NGO users unless needed for security/compliance. Log export generation, status changes, sharing, revocation, and shared recipient views.

Audit event metadata should include:

- report id;
- organization id;
- actor id;
- export type if applicable;
- share grant id if applicable;
- timestamp;
- whether raw evidence was included.

## 7. Legal / Trust Language

Minimum report disclaimer language should cover:

- the report is evidence-based but may be incomplete;
- trust context may be provisional;
- no public score exists unless explicitly published by Mishava through a scoring workflow;
- evidence coverage and recency may limit conclusions;
- raw evidence is not included unless explicitly shared;
- archived evidence is labeled when included;
- Mishava does not guarantee outcomes;
- report content should not be treated as legal, financial, or procurement advice.

Suggested draft language:

> This report is based on evidence selected by the organization and may not represent a complete record. Trust context is provisional unless a published Mishava score snapshot is explicitly referenced. Raw evidence files are not included by default. Mishava does not guarantee outcomes or provide legal, financial, or procurement advice.

## 8. Accessibility

Report output must be accessible from the start.

Plan:

- semantic report headings;
- clear heading order;
- keyboard-accessible controls;
- screen-reader-friendly status labels;
- no color-only status communication;
- readable tables;
- captions or summaries for evidence/claim tables;
- high contrast;
- mobile readability;
- print styles that preserve labels and disclaimers;
- accessible empty states;
- accessible error states for revoked/expired shared reports.

PDF/DOCX exports, if added later, should be reviewed for accessibility before being offered as production outputs.

## 9. Database / Backend Implications

Review before implementation:

- whether current report status fields are enough for `draft`, `ready_for_review`, `shared`, and `archived`;
- whether `ngo_reports` needs `archived_at`, `archived_by`, or `status_changed_at`;
- whether export events can be recorded through existing `audit_events`;
- whether a saved export artifact table is needed.

Recommendation:

Avoid storing generated export files in Slice 5 unless clearly needed. Start with a protected print-friendly route/view and audit generated exports only if a server action generates a durable artifact.

Potential future table, deferred unless needed:

- `ngo_report_exports`
  - report id;
  - organization id;
  - export type;
  - generated by;
  - generated at;
  - storage path if persisted;
  - share grant id if generated for recipient;
  - raw evidence included flag.

## 10. Tests Required

Planned tests:

- NGO member can view polished report preview.
- Non-member cannot view private report preview.
- Shared recipient sees only allowed content.
- Export/print view excludes raw private files by default.
- Archived evidence is labeled when included.
- Rejected/draft claims do not enter trust summary.
- Export action writes audit event if implemented.
- Private report output cannot include another organization's evidence.
- Shared recipient cannot access revoked grant output.
- Shared recipient cannot access expired grant output.
- Viewer role cannot mutate report status/export settings if mutation exists.
- Build/lint/test pass.

Existing payment firewall/scoring tests should continue to pass. Slice 5 must not alter scoring/ranking behavior.

## 11. Non-Goals

This slice must not include:

- full PDF engine if too large for first slice;
- AI report writing;
- AI report rebuilding;
- public report library;
- funder portal;
- billing;
- Stripe;
- Shopping integration;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- OCR;
- final scoring math;
- raw file sharing by default;
- public score publication.

## 12. Acceptance Criteria

Slice 5 implementation can be accepted only if:

- report output is useful to an NGO;
- private data stays private;
- shared recipient view is clear and limited;
- export/print output does not overclaim scoring;
- disclaimers are visible;
- raw files remain excluded by default;
- archived evidence is labeled;
- rejected/draft claims do not appear as accepted trust context;
- accessibility is considered;
- tests are added before acceptance;
- no unrelated product surfaces are added.

## Recommended Build Order

1. Add polished report preview layout to existing report detail.
2. Add print-friendly CSS and print controls.
3. Improve shared recipient view readability and disclaimers.
4. Add archived evidence labels in report output.
5. Add optional CSV evidence-list export only if it can be done without raw-file exposure.
6. Add audit event for server-generated export if implemented.
7. Add tests for privacy, report output, sharing boundaries, and claim filtering.

## Planning Status

This document is a planning artifact only. No routes, database changes, exports, or UI changes are implemented by this document.
