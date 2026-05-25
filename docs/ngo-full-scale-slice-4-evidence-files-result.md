# NGO Full-Scale Slice 4 Result: Evidence Files and Evidence Lifecycle

## Status

Implemented and locally verified.

## What Was Implemented

- Added evidence lifecycle states:
  - draft
  - submitted
  - reviewed
  - accepted
  - rejected
  - archived
- Added private evidence file metadata through `evidence_files`.
- Added private Supabase Storage bucket planning/migration setup for `evidence-files`.
- Added organization-scoped file paths:

```txt
orgs/{organization_id}/evidence/{evidence_item_id}/v{version}/{safe_filename}
```

- Added server-only evidence file upload helper using Supabase service role on the server.
- Added file validation:
  - PDF
  - PNG/JPG/WebP
  - TXT
  - CSV
  - DOCX
  - 10 MB maximum
- Added file versioning behavior:
  - new uploads create metadata rows;
  - replacement uploads mark previous active files as replaced;
  - raw files are not made public.
- Added evidence metadata update workflow.
- Added evidence archive workflow.
- Added audit events for:
  - `evidence.file_uploaded`
  - `evidence.file_replaced`
  - `evidence.updated`
  - `evidence.archived`
- Updated `/org/evidence` to show:
  - lifecycle status;
  - archived label;
  - private file indicator;
  - attached file summaries;
  - edit action;
  - upload/replace action;
  - archive action;
  - private raw-file language.
- Updated report/claim behavior so archived evidence:
  - remains visible where already attached;
  - is excluded from new report selection by default;
  - cannot support new structured claim drafts.
- Kept score snapshots immutable; this slice does not rewrite score snapshots.

## Migration

Migration added:

- `supabase/migrations/202605240017_ngo_evidence_files_lifecycle.sql`

It adds:

- `evidence_lifecycle_status`
- `evidence_file_status`
- lifecycle/archive fields on `evidence_items`
- `evidence_files`
- private `evidence-files` storage bucket configuration
- member-scoped evidence file metadata policies
- private storage object policies

Applied to the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Command used:

```bash
supabase db push --linked
```

Migration list confirmed `202605240017` is present locally and remotely.

## Storage Bucket Setup Result

Verified against the clean V2 Supabase project.

Expected bucket:

- `evidence-files`
- private
- 10 MB file size limit
- restricted MIME types

Live storage check returned:

```txt
status: 200
id: evidence-files
public: false
file_size_limit: 10485760
```

## Tests Run

- `npm test` - passed, 74 tests.
- `npm run lint` - passed.
- `npm run build` - passed.

## Live Checks Performed

- Confirmed linked Supabase project ref before push: `snnscnodegbyqexnopvf`.
- Applied migration `202605240017_ngo_evidence_files_lifecycle.sql` to `mishava-v2-dev`.
- Confirmed remote migration list includes `202605240017`.
- Confirmed `evidence-files` storage bucket exists and is private.
- Did not modify the old `mishava / tghbfautnxblfxrtkdqb` project.

## Known Limitations

- Malware scanning is not implemented.
- OCR is not implemented.
- AI evidence parsing is not implemented.
- Public raw evidence sharing is not implemented.
- Signed URL viewing/downloading is not exposed in the UI yet.
- File upload progress is basic form submission only, not a rich progress bar.
- Evidence review/admin workflows remain limited; this slice focuses on NGO-side lifecycle and storage readiness.

## Remaining Evidence / File Lifecycle Work

- Add signed URL preview/download workflow for authorized users.
- Add malware scanning/quarantine before broad external use.
- Add dedicated evidence detail page if the inline evidence library becomes too dense.
- Add richer review workflow and reviewer notes.
- Add redaction workflow for sensitive files.
- Add retention policy controls.
- Add accessibility/mobile QA on file upload and evidence edit/archive flows.

## Scope Confirmation

This slice did not add:

- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI scoring;
- Stripe;
- billing;
- report exports;
- OCR;
- public evidence library;
- malware scanning implementation;
- final scoring math.
