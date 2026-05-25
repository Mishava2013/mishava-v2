-- NGO Full-Scale Slice 4: private evidence files and lifecycle controls.

do $$
begin
  create type evidence_lifecycle_status as enum (
    'draft',
    'submitted',
    'reviewed',
    'accepted',
    'rejected',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type evidence_file_status as enum (
    'active',
    'replaced',
    'archived',
    'quarantined',
    'scan_failed'
  );
exception
  when duplicate_object then null;
end $$;

alter table evidence_items
  add column if not exists lifecycle_status evidence_lifecycle_status not null default 'draft',
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references auth.users(id);

create table if not exists evidence_files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  evidence_item_id uuid not null references evidence_items(id) on delete cascade,
  storage_bucket text not null default 'evidence-files',
  storage_path text not null unique,
  original_filename text not null,
  safe_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  file_hash text,
  version_number integer not null default 1,
  status evidence_file_status not null default 'active',
  visibility visibility_level not null default 'private',
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now(),
  replaced_by_file_id uuid references evidence_files(id),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  constraint evidence_files_private_bucket
    check (storage_bucket = 'evidence-files'),
  constraint evidence_files_org_path
    check (storage_path like ('orgs/' || organization_id::text || '/evidence/%'))
);

create index if not exists evidence_files_org_evidence_idx
on evidence_files (organization_id, evidence_item_id, status);

alter table evidence_files enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence-files',
  'evidence-files',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "members can read evidence file metadata" on evidence_files;
create policy "members can read evidence file metadata"
on evidence_files for select
to authenticated
using (is_org_member(organization_id));

drop policy if exists "members can create evidence file metadata" on evidence_files;
create policy "members can create evidence file metadata"
on evidence_files for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and is_org_member(organization_id)
  and exists (
    select 1
    from evidence_items e
    where e.id = evidence_files.evidence_item_id
    and e.organization_id = evidence_files.organization_id
    and coalesce(e.lifecycle_status::text, 'draft') <> 'archived'
  )
);

drop policy if exists "members can update evidence file metadata" on evidence_files;
create policy "members can update evidence file metadata"
on evidence_files for update
to authenticated
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

drop policy if exists "members can read private evidence files" on storage.objects;
create policy "members can read private evidence files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'evidence-files'
  and (storage.foldername(name))[1] = 'orgs'
  and is_org_member(((storage.foldername(name))[2])::uuid)
);

drop policy if exists "members can upload private evidence files" on storage.objects;
create policy "members can upload private evidence files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'evidence-files'
  and (storage.foldername(name))[1] = 'orgs'
  and is_org_member(((storage.foldername(name))[2])::uuid)
);

drop policy if exists "members can read organization evidence" on evidence_items;
create policy "members can read organization evidence"
on evidence_items for select
using (
  visibility in ('public_summary', 'public_full_record')
  or is_org_member(organization_id)
);

drop policy if exists "members can update private evidence" on evidence_items;
create policy "members can update private evidence"
on evidence_items for update
using (
  is_org_member(organization_id)
)
with check (
  is_org_member(organization_id)
);

grant select, insert, update on evidence_files to authenticated;
