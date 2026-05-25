-- NGO Full-Scale Slice 3: team invites, active memberships, and basic NGO roles.

alter type role_code add value if not exists 'ngo_admin';
alter type role_code add value if not exists 'ngo_viewer';

do $$
begin
  create type membership_status as enum (
    'active',
    'removed',
    'suspended'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type organization_invite_status as enum (
    'pending',
    'accepted',
    'revoked',
    'expired'
  );
exception
  when duplicate_object then null;
end $$;

alter table organization_memberships
  add column if not exists status membership_status not null default 'active',
  add column if not exists display_email text,
  add column if not exists display_name text,
  add column if not exists invited_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists removed_at timestamptz,
  add column if not exists removed_by uuid references auth.users(id),
  add column if not exists status_reason text;

update organization_memberships
set accepted_at = coalesce(accepted_at, created_at)
where status = 'active';

create table if not exists organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role role_code not null,
  status organization_invite_status not null default 'pending',
  token_hash text,
  note text,
  invited_by uuid references auth.users(id),
  accepted_by uuid references auth.users(id),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_invites_org_status_idx
on organization_invites (organization_id, status);

create index if not exists organization_invites_email_status_idx
on organization_invites (lower(email), status);

alter table organization_invites enable row level security;

create or replace function is_org_member(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_memberships m
    where m.organization_id = target_organization_id
    and m.user_id = auth.uid()
    and coalesce(m.status::text, 'active') = 'active'
  );
$$;

create or replace function has_org_role(target_organization_id uuid, allowed_roles role_code[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_memberships m
    where m.organization_id = target_organization_id
    and m.user_id = auth.uid()
    and coalesce(m.status::text, 'active') = 'active'
    and m.role = any(allowed_roles)
  );
$$;

create or replace function has_org_role_text(target_organization_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_memberships m
    where m.organization_id = target_organization_id
    and m.user_id = auth.uid()
    and coalesce(m.status::text, 'active') = 'active'
    and m.role::text = any(allowed_roles)
  );
$$;

drop policy if exists "members and creators can read their organizations" on organizations;
create policy "members and creators can read their organizations"
on organizations for select
using (
  created_by = auth.uid()
  or is_org_member(id)
);

drop policy if exists "organization owners can update organizations" on organizations;
create policy "organization owners can update organizations"
on organizations for update
using (
  has_org_role_text(id, array['ngo_owner', 'ngo_admin', 'business_owner', 'mishava_admin'])
)
with check (
  has_org_role_text(id, array['ngo_owner', 'ngo_admin', 'business_owner', 'mishava_admin'])
);

drop policy if exists "organization owners can update memberships" on organization_memberships;
create policy "organization owners can update memberships"
on organization_memberships for update
using (
  has_org_role_text(
    organization_id,
    array['ngo_owner', 'ngo_admin', 'business_owner', 'mishava_admin']
  )
)
with check (
  has_org_role_text(
    organization_id,
    array['ngo_owner', 'ngo_admin', 'business_owner', 'mishava_admin']
  )
);

drop policy if exists "team managers can read organization invites" on organization_invites;
create policy "team managers can read organization invites"
on organization_invites for select
to authenticated
using (
  has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "team managers can create organization invites" on organization_invites;
create policy "team managers can create organization invites"
on organization_invites for insert
to authenticated
with check (
  invited_by = auth.uid()
  and has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
);

drop policy if exists "team managers can update organization invites" on organization_invites;
create policy "team managers can update organization invites"
on organization_invites for update
to authenticated
using (
  has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "members can read ngo profiles" on ngo_profiles;
create policy "members can read ngo profiles"
on ngo_profiles for select
using (is_org_member(organization_id));

drop policy if exists "members can read ngo evidence submissions" on ngo_evidence_submissions;
create policy "members can read ngo evidence submissions"
on ngo_evidence_submissions for select
using (
  exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_evidence_submissions.ngo_profile_id
    and is_org_member(p.organization_id)
  )
);

drop policy if exists "members can read organization evidence" on evidence_items;
create policy "members can read organization evidence"
on evidence_items for select
using (
  visibility in ('public_summary', 'public_full_record')
  or is_org_member(organization_id)
);

drop policy if exists "members can read structured claims" on structured_claims;
create policy "members can read structured claims"
on structured_claims for select
to authenticated
using (is_org_member(organization_id));

drop policy if exists "members can read ngo reports" on ngo_reports;
create policy "members can read ngo reports"
on ngo_reports for select
using (
  visibility in ('public_summary', 'public_full_record')
  or exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_reports.ngo_profile_id
    and is_org_member(p.organization_id)
  )
);

drop policy if exists "members can read share grants" on ngo_share_grants;
create policy "members can read share grants"
on ngo_share_grants for select
using (
  exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_share_grants.ngo_profile_id
    and is_org_member(p.organization_id)
  )
);

grant select, insert, update on organization_invites to authenticated;

drop policy if exists "members can read organization memberships" on organization_memberships;
create policy "members can read organization memberships"
on organization_memberships for select
to authenticated
using (
  user_id = auth.uid()
  or is_org_member(organization_id)
);
