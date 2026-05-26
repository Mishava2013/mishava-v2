-- NGO Full-Scale Slice 14: malware scan status and quarantine-first file security.

do $$
begin
  create type evidence_file_scan_status as enum (
    'pending',
    'clean',
    'suspicious',
    'rejected',
    'failed',
    'not_scanned'
  );
exception
  when duplicate_object then null;
end $$;

alter table evidence_files
  add column if not exists scan_status evidence_file_scan_status not null default 'not_scanned',
  add column if not exists scanned_at timestamptz,
  add column if not exists scanner_name text,
  add column if not exists scanner_result_reference text,
  add column if not exists quarantine_reason text,
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

update evidence_files
set scan_status = 'not_scanned'
where scan_status is null;

create index if not exists evidence_files_org_scan_status_idx
on evidence_files (organization_id, scan_status, status);

drop policy if exists "members can read private evidence files" on storage.objects;
create policy "members can read private evidence files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'evidence-files'
  and (storage.foldername(name))[1] = 'orgs'
  and is_org_member(((storage.foldername(name))[2])::uuid)
  and exists (
    select 1
    from evidence_files ef
    where ef.storage_bucket = storage.objects.bucket_id
    and ef.storage_path = storage.objects.name
    and ef.organization_id = ((storage.foldername(name))[2])::uuid
    and ef.status = 'active'
    and ef.scan_status = 'clean'
  )
);
