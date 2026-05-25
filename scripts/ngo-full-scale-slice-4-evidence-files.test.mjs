import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("evidence files migration creates private storage metadata and bucket policies", () => {
  const migration = read("supabase/migrations/202605240017_ngo_evidence_files_lifecycle.sql");

  assert.match(migration, /create type evidence_lifecycle_status/);
  assert.match(migration, /create type evidence_file_status/);
  assert.match(migration, /create table if not exists evidence_files/);
  assert.match(migration, /storage_bucket text not null default 'evidence-files'/);
  assert.match(migration, /storage_path like \('orgs\/' \|\| organization_id::text \|\| '\/evidence\/%'\)/);
  assert.match(migration, /insert into storage\.buckets/);
  assert.match(migration, /public,\s*file_size_limit,\s*allowed_mime_types/);
  assert.match(migration, /false,\s*10485760/);
  assert.match(migration, /members can read private evidence files/);
  assert.match(migration, /members can upload private evidence files/);
  assert.doesNotMatch(migration, /public = true/);
});

test("server-only storage upload uses service role and keeps raw file access out of browser code", () => {
  const storage = read("src/lib/supabase/storage.ts");

  assert.match(storage, /evidence-files/);
  assert.match(storage, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(storage, /\/storage\/v1\/object\/\$\{evidenceFilesBucket\}\/\$\{path\}/);
  assert.match(storage, /"x-upsert": "false"/);
  assert.doesNotMatch(read("src/app/org/evidence/page.tsx"), /SUPABASE_SERVICE_ROLE_KEY/);
});

test("file helper validates file type and size, writes metadata, versions replacements, and audits", () => {
  const helper = read("src/lib/evidence-files.ts");

  assert.match(helper, /allowedEvidenceFileTypes/);
  assert.match(helper, /maxEvidenceFileSizeBytes = 10 \* 1024 \* 1024/);
  assert.match(helper, /orgs\/\$\{organizationId\}\/evidence\/\$\{evidenceItemId\}\/v\$\{nextVersion\}/);
  assert.match(helper, /insert<EvidenceFileRow>\("evidence_files"/);
  assert.match(helper, /status: "replaced"/);
  assert.match(helper, /evidence\.file_uploaded/);
  assert.match(helper, /evidence\.file_replaced/);
  assert.match(helper, /Archived evidence cannot receive new files/);
});

test("evidence lifecycle supports edit/archive and excludes archived evidence from new workflows", () => {
  const helper = read("src/lib/evidence-files.ts");
  const reports = read("src/lib/ngo-evidence-reports.ts");

  assert.match(helper, /updateEvidenceMetadata/);
  assert.match(helper, /archiveEvidenceItem/);
  assert.match(helper, /evidence\.updated/);
  assert.match(helper, /evidence\.archived/);
  assert.match(reports, /canUseInNewReports: item\.lifecycle_status !== "archived"/);
  assert.match(reports, /Archived evidence cannot support new structured claim drafts/);
  assert.match(reports, /lifecycle_status: "draft"/);
  assert.match(reports, /lifecycle_status: "submitted"/);
  assert.match(reports, /lifecycle_status: "reviewed"/);
  assert.match(reports, /lifecycle_status: "accepted"/);
});

test("evidence UI exposes lifecycle, private file labels, edit/upload/archive actions, and viewer-safe gating", () => {
  const page = read("src/app/org/evidence/page.tsx");
  const actions = read("src/app/org/evidence/actions.ts");

  assert.match(page, /lifecycle_status/);
  assert.match(page, /Raw files are private to your organization/);
  assert.match(page, /Attached private files/);
  assert.match(page, /updateEvidenceMetadataAction/);
  assert.match(page, /uploadEvidenceFileAction/);
  assert.match(page, /archiveEvidenceAction/);
  assert.match(page, /canManageEvidence/);
  assert.match(actions, /canManageNgoEvidence/);
  assert.match(actions, /uploadEvidenceFileForItem/);
  assert.match(actions, /archiveEvidenceItem/);
});
