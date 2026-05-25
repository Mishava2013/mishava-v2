# NGO Full-Scale Slice 4 Plan: Evidence Files and Evidence Lifecycle

## Purpose

Plan the evidence file upload/storage and evidence lifecycle work needed for NGO full-scale readiness.

This is planning only. Do not implement code, migrations, storage buckets, UI changes, or Supabase policies yet.

## Source of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`
- `docs/ngo-pilot-readiness-reaudit.md`
- `docs/release-3-slice-3-result.md`

## Current Context

Mishava NGO currently supports:

- manual evidence entry;
- organization-scoped evidence records;
- evidence library display;
- structured claim drafts connected to evidence;
- private draft reports that can reference selected evidence and accepted claims;
- scoped report sharing that does not expose raw evidence by default;
- team roles where viewers cannot mutate evidence/report records.

Current limitation:

- file uploads/storage are not production-ready;
- `evidence_items.document_path` exists but is not wired to safe file storage;
- evidence lifecycle is still mostly represented through verification/review fields, not a full draft/submitted/reviewed/accepted/rejected/archived state machine;
- pilot guidance remains manual-evidence-first until storage, privacy, audit, and lifecycle controls are implemented.

## Slice Goal

Enable NGOs to attach private files to evidence while preserving Mishava’s trust rules:

- raw files private by default;
- file access scoped to the organization;
- file changes audited;
- evidence cannot be silently deleted when attached to claims, reports, or snapshots;
- archived evidence stays traceable but is excluded from new report/scoring workflows by default.

## 1. File Upload / Storage

### Bucket Strategy

Recommended Supabase Storage bucket:

```txt
evidence-files
```

Bucket type:

- private bucket;
- no public read by default;
- signed URLs only for authorized viewers;
- service-role operations only from server-side code after app-level authorization.

Do not use a public bucket for raw evidence files.

### Org-Scoped Paths

Suggested storage path format:

```txt
orgs/{organization_id}/evidence/{evidence_item_id}/v{version}/{safe_filename}
```

Examples:

```txt
orgs/123/evidence/abc/v1/worksite-photo.jpg
orgs/123/evidence/abc/v2/updated-registration.pdf
```

Path rules:

- organization id must come from server-side current org context;
- evidence id must belong to the same organization;
- filename must be sanitized;
- user-supplied path segments are not trusted;
- paths should not expose private user names or sensitive descriptions.

### Allowed File Types

Start conservative:

- PDF: `application/pdf`
- JPEG: `image/jpeg`
- PNG: `image/png`
- WebP: `image/webp`
- plain text: `text/plain`
- CSV: `text/csv`
- Word document: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

Defer or block initially:

- executable files;
- archives such as ZIP/RAR/7z;
- macros;
- unknown binary files;
- HTML files;
- SVG files unless sanitized;
- very large videos.

### Max File Size

Recommended first limit:

- 10 MB per file for Free/early pilot;
- 25 MB per file for paid NGO plans later;
- larger files only after storage cost controls and scanning are mature.

Implementation should enforce size both:

- client-side for user feedback;
- server-side before final storage write.

### Upload UX

Plan UI states:

- file selected;
- uploading;
- upload succeeded;
- upload failed;
- unsupported file type;
- file too large;
- upload saved but evidence still draft;
- file private to organization.

Do not imply the file has been reviewed just because upload succeeded.

### Malware / Virus Scanning

Future note:

- malware scanning should be added before broad public/institutional use;
- until scanning is implemented, uploaded files should be treated as private and untrusted;
- downloads/previews should be controlled;
- file type validation is not a substitute for scanning.

Potential later tools:

- Supabase Storage event processing;
- ClamAV worker;
- third-party malware scanning API;
- quarantine status before files become usable in reports.

### File Metadata

Do not rely only on `evidence_items.document_path`.

Recommended table:

```ts
type EvidenceFile = {
  id: string;
  organization_id: string;
  evidence_item_id: string;
  storage_bucket: "evidence-files";
  storage_path: string;
  original_filename: string;
  safe_filename: string;
  mime_type: string;
  file_size_bytes: number;
  file_hash?: string | null;
  version_number: number;
  status:
    | "active"
    | "replaced"
    | "archived"
    | "quarantined"
    | "scan_failed";
  visibility: "private" | "organization_shared" | "approved_viewer" | "public_summary";
  uploaded_by: string;
  uploaded_at: string;
  replaced_by_file_id?: string | null;
  archived_at?: string | null;
};
```

Relationship:

- one `evidence_item` may have many `evidence_files`;
- only one or more files may be active depending on evidence type;
- replacing a file creates a new version, not an overwrite.

## 2. Evidence Lifecycle

Recommended lifecycle states:

- `draft`
- `submitted`
- `reviewed`
- `accepted`
- `rejected`
- `archived`

Recommended field:

```ts
evidence_lifecycle_status:
  | "draft"
  | "submitted"
  | "reviewed"
  | "accepted"
  | "rejected"
  | "archived";
```

How this relates to existing fields:

- `verification_status` answers how/if the evidence was checked.
- `confidence` answers confidence in the evidence.
- `visibility` answers who may see it.
- `evidence_lifecycle_status` answers where the evidence is in the workflow.

### Role Transitions

Owner/admin/member:

- create draft evidence;
- submit evidence;
- edit draft/submitted evidence;
- archive their organization’s evidence if not blocked by traceability rules.

Viewer:

- read allowed organization evidence;
- cannot create, edit, submit, archive, upload, replace, or remove files.

Reviewer/admin later:

- review submitted evidence;
- accept/reject evidence;
- add review notes;
- change verification status.

Important:

- In this slice, “reviewer/admin later” can be planned but not overbuilt into advanced admin workflows.
- If no reviewer workflow is built yet, reviewed/accepted/rejected transitions can remain backend-ready and clearly labeled.

## 3. Evidence Edit / Update

Allow edits to:

- title;
- source name;
- source type;
- URL;
- notes;
- visibility;
- lifecycle status where permitted;
- file attachment/version.

Do not allow:

- silent hard delete;
- overwriting an existing raw file in place;
- changing organization ownership;
- changing evidence in a way that rewrites old reports, claims, or snapshots.

File replacement:

- create a new `evidence_files` row;
- mark prior active file as `replaced`;
- keep previous file metadata;
- write audit event with old/new file ids.

Archive action:

- set evidence lifecycle status to `archived`;
- optionally set file status to `archived`;
- preserve original evidence row;
- write audit event;
- show archived label anywhere the evidence already appears.

## 4. Report / Claim / Snapshot Impact

Evidence attached to reports:

- cannot be silently deleted;
- archived evidence remains visible on existing reports with an archived label;
- new reports should exclude archived evidence by default;
- users may optionally include archived evidence later only with explicit warning and reason.

Structured claims:

- accepted claims tied to evidence must preserve the evidence id and file version context;
- if evidence is archived later, accepted claims should keep their historical trace;
- new claim acceptance should exclude archived/rejected evidence by default.

Score snapshots:

- score snapshots are immutable;
- a file upload, file replacement, edit, or archive must not rewrite a past snapshot;
- any score update later must create a new snapshot;
- snapshot evidence payload should record the evidence/file state as of the snapshot.

## 5. Privacy / Security

Raw files must be private by default.

Access rules:

- org members may access private file metadata for their organization;
- raw file download/preview requires server-side authorization;
- share recipients do not see raw files by default;
- shared reports show evidence summaries unless raw file access is explicitly granted later;
- non-members cannot access file metadata or signed URLs;
- public users cannot access raw evidence files unless evidence is explicitly public and safe.

Signed URL strategy:

- server action validates session and org membership;
- server action validates evidence/file ownership;
- server action creates short-lived signed URL;
- URL expiration should be short, for example 5 to 15 minutes;
- signed URL creation should be logged if used for sensitive files.

Service-role boundaries:

- service role may be used only server-side;
- service role must not be exposed to browser code;
- service role should be called after app-level auth/role checks;
- browser uploads should use signed upload URLs or server-mediated upload if feasible.

Storage policy alignment:

- Storage object path must include organization id;
- RLS/storage policies must confirm active org membership;
- removed/suspended members must not satisfy storage access;
- current org cookie must not grant file access.

## 6. UI Changes

Minimum UI updates:

- upload file field in `/org/evidence`;
- supported file type/size text;
- upload progress and error states;
- file attachment display in evidence library;
- lifecycle status labels;
- “Private to your organization” label;
- “Evidence entered but not reviewed” label;
- archive action;
- edit action or evidence detail/edit page.

Recommended evidence detail/edit page:

```txt
/org/evidence/[evidenceId]
```

The page should show:

- evidence metadata;
- lifecycle status;
- verification status;
- visibility;
- attached files and versions;
- reports using this evidence;
- structured claims tied to this evidence;
- audit trail summary;
- edit form;
- archive action.

If a detail page is too large for the first implementation, start with:

- edit/update actions in `/org/evidence`;
- file list under each evidence record;
- archive button with clear confirmation.

## 7. Audit Events

Audit actions:

- `evidence.updated`
- `evidence.archived`
- `evidence.file_uploaded`
- `evidence.file_replaced`
- `evidence.file_archived`
- `evidence.lifecycle_changed`
- `evidence.visibility_changed`

Each event should include:

- actor user id;
- organization id;
- evidence item id;
- evidence file id when relevant;
- before/after data;
- reason where supplied;
- visibility `private`;
- timestamp.

Normal file viewing may not need audit in the first implementation unless the file is sensitive or shared externally.

## 8. Tests Required

Plan tests for:

- org member can upload evidence file;
- viewer cannot upload or mutate evidence;
- non-member cannot access file metadata;
- private raw file is not publicly readable;
- file path is organization-scoped;
- unsupported file type is rejected;
- oversized file is rejected;
- evidence edit writes audit event;
- evidence archive writes audit event;
- file upload writes audit event;
- file replacement creates a new version and does not overwrite old metadata;
- archived evidence is excluded from new report creation by default;
- archived evidence is excluded from new scoring/snapshot input by default;
- report-linked evidence cannot be silently deleted;
- accepted claims preserve evidence traceability;
- existing evidence/report/share/team tests still pass;
- payment firewall tests still pass;
- build/lint/test pass.

## 9. Non-Goals

Exclude from Slice 4:

- OCR;
- AI evidence parsing;
- AI scoring;
- malware scanning implementation if too large;
- public evidence library;
- report export;
- billing;
- Stripe;
- Shopping integration;
- Business, Local, Gov, Corporate, or Plus work;
- final scoring math;
- advanced admin review workflows;
- bulk evidence import.

## 10. Acceptance Criteria

Slice 4 can be implemented only if:

- raw files are private by default;
- storage paths are organization-scoped;
- file access is server-authorized;
- storage access does not depend on UI alone;
- evidence lifecycle is explicit;
- edits/archive/file changes are audited;
- evidence attached to reports/claims/snapshots cannot be silently deleted;
- archived evidence remains traceable;
- archived evidence is excluded from new reports/scoring by default;
- service-role usage is server-only and bounded;
- no unrelated product surfaces or monetization features are added.

## Recommended Build Order

1. Add evidence lifecycle fields and `evidence_files` metadata table.
2. Add private Supabase Storage bucket setup documentation or migration/config step.
3. Add storage path helper and file validation helper.
4. Add server action for authorized upload/signing.
5. Add evidence file display in `/org/evidence`.
6. Add evidence edit/archive actions.
7. Add report/claim filtering so archived evidence is excluded from new workflows by default.
8. Add audit events.
9. Add tests and result document.
10. Apply migration only to the clean V2 Supabase project.

## Planning Status

Planned. Not implemented.
