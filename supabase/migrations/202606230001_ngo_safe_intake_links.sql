-- NGO Safe Intake Links
-- Controlled NGO-created intake links for private client/worker submissions.
-- This is not a public complaint portal. Public clients submit through a
-- server-side token route; direct table access remains RLS-protected.

create table if not exists ngo_safe_intake_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  created_by uuid references auth.users(id),
  token text not null unique,
  title text not null,
  description text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'revoked')),
  purpose text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ngo_safe_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  intake_link_id uuid not null references ngo_safe_intake_links(id) on delete cascade,
  evidence_item_id uuid references evidence_items(id),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'reviewed', 'accepted_for_evidence_review', 'rejected')),
  submitter_label text,
  issue_category text,
  industry_tag text,
  actor_type text,
  worksite_or_employer text,
  happened_at text,
  narrative text,
  share_outside_ngo text,
  retaliation_concern text,
  worker_name_private text,
  immigration_concern text,
  safe_contact_method text,
  contact_detail text,
  attached_file_count integer not null default 0,
  review_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ngo_safe_intake_links_org_idx
  on ngo_safe_intake_links(organization_id, status, created_at desc);

create index if not exists ngo_safe_intake_links_token_idx
  on ngo_safe_intake_links(token);

create index if not exists ngo_safe_intake_submissions_org_idx
  on ngo_safe_intake_submissions(organization_id, status, created_at desc);

create index if not exists ngo_safe_intake_submissions_link_idx
  on ngo_safe_intake_submissions(intake_link_id, created_at desc);

alter table ngo_safe_intake_links enable row level security;
alter table ngo_safe_intake_submissions enable row level security;

drop policy if exists "org members can read safe intake links" on ngo_safe_intake_links;
create policy "org members can read safe intake links"
on ngo_safe_intake_links for select
using (is_org_member(organization_id));

drop policy if exists "org members can create safe intake links" on ngo_safe_intake_links;
create policy "org members can create safe intake links"
on ngo_safe_intake_links for insert
with check (
  is_org_member(organization_id)
  and created_by = auth.uid()
);

drop policy if exists "org members can update safe intake links" on ngo_safe_intake_links;
create policy "org members can update safe intake links"
on ngo_safe_intake_links for update
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

drop policy if exists "org members can read safe intake submissions" on ngo_safe_intake_submissions;
create policy "org members can read safe intake submissions"
on ngo_safe_intake_submissions for select
using (is_org_member(organization_id));

drop policy if exists "org members can update safe intake submissions" on ngo_safe_intake_submissions;
create policy "org members can update safe intake submissions"
on ngo_safe_intake_submissions for update
using (is_org_member(organization_id))
with check (is_org_member(organization_id));
