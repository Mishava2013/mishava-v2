# NGO Full-Scale Slice 13 Result: Server-Generated Report Exports

## Status

Implemented and locally verified.

## What Was Implemented

- Added an `export_reports` permission to the central NGO permission matrix.
- Allowed owner, admin, member, and viewer roles to export reports according to the matrix.
- Added a centralized export-safe payload helper in `src/lib/ngo-report-exports.ts`.
- Added server-side CSV evidence summary export for private NGO reports.
- Added server-side print-to-PDF-ready HTML report export.
- Added export controls to `/org/reports/[reportId]`.
- Updated report missing-item language so CSV export is no longer described as unavailable.
- Kept shared-recipient export deferred.
- Kept raw evidence files private by default.

## Export Types Added

### CSV Evidence Summary Export

Route:

```txt
/org/reports/[reportId]/exports/evidence.csv
```

The CSV includes safe report/evidence fields:

- report title;
- organization name;
- exported date;
- evidence title;
- evidence type;
- lifecycle status;
- verification status;
- visibility;
- source URL where present;
- attached file indicator only;
- linked accepted claim count;
- archived label/flag;
- export limitation language.

The CSV excludes:

- raw evidence file contents;
- private storage paths;
- signed URL internals;
- unrelated organization data;
- rejected/draft claims in trust summary;
- secrets;
- audit internals;
- Stripe/customer/billing identifiers.

### Print-To-PDF-Ready HTML Export

Route:

```txt
/org/reports/[reportId]/exports/report
```

This is a server-generated HTML report view that can be printed or saved as PDF from the browser. It includes:

- report title/type/status;
- organization summary;
- evidence summaries;
- accepted claims/trust facts;
- provisional trust context;
- generated/exported date;
- disclaimers.

It excludes raw files and private storage paths by default.

## Export Types Deferred

- PDF file generation is deferred. The HTML export is intentionally print-to-PDF-ready, but Mishava does not yet generate a durable PDF binary server-side.
- DOCX export is deferred.
- Shared-recipient export is deferred. Shared recipients can view their scoped report summary, but they cannot export reports in this slice.
- Raw file bundle download is deferred and remains out of scope.

## Migrations Applied

No migration was needed.

The existing report, evidence, permission, and audit-event foundations supported this slice.

## Tests Run

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm test` - passed.
- `npm run build` - passed.

## Live Checks Performed

No live database migration or storage change was needed.

This slice was verified locally through typecheck, lint, source-level tests, and production build. The clean V2 Supabase project remains the target for future live verification:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

The old Supabase project was not touched:

- `mishava / tghbfautnxblfxrtkdqb`

## Known Limitations

- Server-generated PDF binary output is not implemented.
- DOCX export is not implemented.
- Shared-recipient exports are not implemented.
- Exported HTML does not persist as a stored artifact.
- Export audit events are written when the route runs against a configured database, but this slice did not perform a live browser export against Supabase.
- Export accessibility is improved through headings and plain language, but no external PDF/DOCX accessibility review has been completed.

## Remaining Export Work

- Add a real server-generated PDF engine if pilots need downloadable PDF files rather than print-to-PDF HTML.
- Add DOCX export if funder or board workflows require editable reports.
- Decide whether shared recipients should be allowed to export scoped summaries.
- Add live export smoke tests against `mishava-v2-dev`.
- Add export retention/storage only if durable generated artifacts are required.

## Scope Confirmation

Raw evidence files and private storage paths are excluded by default.

This slice did not add:

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
- raw file sharing;
- enterprise compliance packages;
- automated recurring exports.

The old Supabase project was not touched.
