# NGO Full-Scale Slice 13 Plan: Server-Generated Report Exports

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-12-stripe-checkout-webhooks-result.md`
- `docs/ngo-full-scale-slice-5-report-output-result.md`
- `docs/ngo-full-scale-slice-4-evidence-files-result.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`

## Goal

Plan server-generated NGO report exports for full-scale readiness.

This slice should turn the existing report preview and browser-print foundation into access-controlled, audit-aware server exports that NGOs can use with funders, boards, partners, and internal records.

## Scope

NGO report exports only.

Do not build:

- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI evidence parsing;
- malware scanning;
- SOC 2 / ISO / VPAT implementation;
- final scoring math;
- public report library;
- production billing;
- raw file sharing.

Do not expose raw evidence files by default.

Do not touch the old Supabase project `mishava / tghbfautnxblfxrtkdqb`.

## 1. Export Types

### Recommended Implementation Order

1. **CSV evidence summary export**
   - Lowest risk.
   - Useful for funders, internal review, and spreadsheet workflows.
   - Easier to test for access boundaries and content exclusions.
   - Should be implemented first.

2. **PDF report export**
   - Highest user value for sharing a polished report packet.
   - Should follow after CSV access, audit, and disclaimer rules are proven.
   - Should use the existing report preview structure as the content source where practical.

3. **DOCX report export**
   - Useful for funder/board editing workflows.
   - Should be implemented only if feasible without heavy complexity.
   - Can wait until after CSV and PDF are working unless a pilot user requires it.

### Minimum Export Set For Slice 13 Implementation

Slice 13 implementation should start with:

- CSV evidence summary export.
- PDF report export if the selected PDF generation approach is stable within the existing Next.js runtime.

DOCX should be treated as optional unless the implementation path is straightforward.

## 2. Export Routes / Actions

Plan server-side export actions rather than client-only print buttons.

Recommended routes/actions:

- `GET /org/reports/[reportId]/exports/evidence.csv`
- `GET /org/reports/[reportId]/exports/report.pdf`
- optional later: `GET /org/reports/[reportId]/exports/report.docx`

Access rules:

- owner/admin/member can export allowed organization reports.
- viewer export permission should follow the central permission matrix.
- non-members cannot export private reports.
- removed/suspended members cannot export.
- current org cookie is not authoritative; server-side membership remains the source of truth.
- shared recipients may export only a shared-safe version if explicitly allowed.

Recommended permission matrix addition or confirmation:

- `export_reports`

Initial recommendation:

- owner: yes
- admin: yes
- member: yes
- viewer: yes for read/export of reports if viewer already has `view_reports`, unless the product owner wants viewer to be browser-only.

If `export_reports` is not added yet, export should use the existing `view_reports` permission but document the limitation.

## 3. Export Content Rules

Exports must include:

- organization name;
- organization profile summary where available;
- report title;
- report type/template;
- report status;
- report visibility;
- generated/exported date;
- selected evidence summaries;
- accepted claims/trust facts;
- provisional trust context;
- sharing/visibility status;
- limitations and disclaimers.

Exports must not include by default:

- raw evidence file contents;
- private storage paths;
- signed URL internals;
- unrelated organization data;
- rejected claims in trust summary;
- draft claims in trust summary;
- secrets;
- audit internals;
- service-role details;
- Stripe/customer/billing identifiers.

Evidence summary fields should be limited to safe report context:

- evidence title;
- evidence type;
- source URL if the report already allows it;
- source/note summary if safe;
- visibility label;
- lifecycle/review status;
- archived label where applicable;
- created date;
- reviewed/accepted status where applicable.

## 4. Privacy And Access

Exports must respect the same privacy model as report detail and shared report views:

- private reports remain private.
- exports require authenticated organization membership unless using a valid share grant.
- raw files are excluded by default.
- archived evidence can appear only if already attached to the report, and must be labeled as archived.
- draft/provisional/private status must be visible in the export.
- rejected/draft claims must not appear in trust summaries.
- no public report library is introduced.

Shared recipient export policy:

- default recommendation: shared recipients can view the shared report in browser but cannot export in Slice 13 unless a specific shared-safe export action is added.
- if shared export is implemented, it must use the share grant scope, not org membership.
- shared export must exclude raw files, workspace navigation, internal notes, private paths, and unrelated org data.
- revoked/expired grants must block shared exports.

## 5. Audit Events

Plan audit events for:

- `report.export_csv_generated`
- `report.export_pdf_generated`
- `report.export_docx_generated` if DOCX is implemented
- `report.shared_export_generated` if shared-recipient export is allowed
- `report.export_blocked` if practical for blocked/suspicious attempts

Audit event metadata should include:

- `organization_id`
- `report_id`
- export type
- actor user id where authenticated
- share grant id where applicable
- timestamp
- success/failure status

Audit metadata must not include raw evidence contents, secrets, private file paths, or signed URLs.

## 6. Storage Strategy

Recommendation: start with on-demand generation and stream/download the file.

Reasons:

- less storage complexity;
- fewer retention/deletion questions;
- avoids generated files becoming stale when reports change;
- easier to keep raw files private;
- lower operational burden for the first export slice.

Do not store generated exports in Supabase Storage for Slice 13 unless a clear pilot need exists.

If durable export storage is added later:

- use a private bucket;
- use organization-scoped paths;
- store export metadata;
- log access;
- add retention/deletion rules;
- ensure old exports do not imply current trust status.

## 7. Accessibility

CSV:

- use clear column headers;
- avoid abbreviations where possible;
- include status text, not color/state codes only;
- keep dates in a consistent format.

PDF:

- use readable headings;
- preserve report structure from the preview page;
- include plain-language disclaimers;
- use adequate contrast;
- avoid image-only text;
- include generated/exported date;
- keep tables readable on standard page sizes.

DOCX if implemented:

- use heading styles;
- use readable tables/lists;
- include disclaimer sections;
- avoid floating layout complexity.

Important: do not claim PDF/Word accessibility certification or VPAT completion from this slice. Export accessibility should be described as improved or targeted, not certified.

## 8. Tests Required

Implementation must add or extend tests proving:

- org member can export own report.
- non-member cannot export private report.
- removed/suspended member cannot export.
- viewer export follows the permission matrix.
- shared recipient export is blocked by default or grant-limited if allowed.
- revoked/expired share grant blocks shared export if shared export exists.
- raw files are excluded.
- private storage paths are excluded.
- unrelated org data is excluded.
- rejected/draft claims are excluded from trust summaries.
- archived evidence is labeled if included.
- generated/exported date appears.
- report disclaimers appear.
- export writes an audit event.
- payment plan/billing status does not affect export trust conclusions.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## 9. Non-Goals

Exclude:

- public report library;
- raw file bundle download;
- raw evidence sharing;
- AI report writing;
- final scoring math;
- enterprise compliance report package;
- automated recurring exports;
- scheduled funder deliveries;
- email attachments;
- export storage/retention automation unless explicitly approved;
- Shopping integration;
- production billing changes.

## 10. Acceptance Criteria

Slice 13 implementation can begin only if:

- export scope stays NGO-only.
- CSV is implemented before heavier formats unless there is a clear reason to reverse the order.
- exports are private and access-controlled.
- raw evidence stays private by default.
- rejected/draft claims are excluded from trust summaries.
- archived evidence is labeled.
- report disclaimers are included.
- export actions are audit-logged.
- no public report library is introduced.
- implementation does not alter scoring, ranking, verification, evidence truth, or report trust conclusions.
- old Supabase project is not touched.

## Recommended Build Order

1. Confirm or add `export_reports` permission in the central permission matrix.
2. Add a shared server helper that loads an export-safe report payload by organization membership.
3. Add CSV evidence summary export route/action.
4. Add CSV audit event.
5. Add tests for access control, content exclusions, archived labels, and audit event.
6. Add PDF export using the same export-safe payload.
7. Add PDF audit event.
8. Add PDF tests for disclaimers, excluded raw files, and rejected/draft claim exclusion.
9. Decide whether DOCX is feasible for the same slice or should become Slice 13B.

## Launch Requirement

Server-generated exports are required before full-scale NGO launch if Mishava markets exportable reports as part of the NGO value promise.

If not marketed at launch, CSV and/or PDF exports could be limited to a supported pilot while browser print remains the fallback. However, full-scale self-serve readiness should include at least CSV evidence export and PDF report export.
