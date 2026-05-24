-- Release 2.5 Functional Foundation Cleanup
-- Adds write-safe foundations for the first real NGO/evidence workflows.

alter table evidence_items
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists updated_at timestamptz not null default now();

alter table ngo_profiles
  add column if not exists created_by uuid references auth.users(id);

alter table score_snapshots
  add column if not exists visibility visibility_level not null default 'private',
  add column if not exists published_at timestamptz;

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
    and m.role = any(allowed_roles)
  );
$$;

create policy "authenticated users can create organizations"
on organizations for insert
with check (auth.uid() is not null);

create policy "organization owners can update organizations"
on organizations for update
using (
  has_org_role(id, array['ngo_owner', 'business_owner', 'mishava_admin']::role_code[])
)
with check (
  has_org_role(id, array['ngo_owner', 'business_owner', 'mishava_admin']::role_code[])
);

create policy "first member or org owner can create memberships"
on organization_memberships for insert
with check (
  user_id = auth.uid()
  and (
    not exists (
      select 1
      from organization_memberships existing
      where existing.organization_id = organization_memberships.organization_id
    )
    or has_org_role(
      organization_id,
      array['ngo_owner', 'business_owner', 'mishava_admin']::role_code[]
    )
  )
);

create policy "organization owners can update memberships"
on organization_memberships for update
using (
  has_org_role(
    organization_id,
    array['ngo_owner', 'business_owner', 'mishava_admin']::role_code[]
  )
)
with check (
  has_org_role(
    organization_id,
    array['ngo_owner', 'business_owner', 'mishava_admin']::role_code[]
  )
);

create policy "members can create ngo profiles"
on ngo_profiles for insert
with check (
  is_org_member(organization_id)
  and created_by = auth.uid()
);

create policy "ngo owners can update ngo profiles"
on ngo_profiles for update
using (
  has_org_role(organization_id, array['ngo_owner', 'mishava_admin']::role_code[])
)
with check (
  has_org_role(organization_id, array['ngo_owner', 'mishava_admin']::role_code[])
);

create policy "members can create evidence"
on evidence_items for insert
with check (
  is_org_member(organization_id)
  and created_by = auth.uid()
);

create policy "members can update private evidence"
on evidence_items for update
using (
  is_org_member(organization_id)
)
with check (
  is_org_member(organization_id)
);

create policy "members can create ngo evidence submissions"
on ngo_evidence_submissions for insert
with check (
  exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_evidence_submissions.ngo_profile_id
    and is_org_member(p.organization_id)
  )
);

create policy "members can update ngo evidence submissions"
on ngo_evidence_submissions for update
using (
  exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_evidence_submissions.ngo_profile_id
    and is_org_member(p.organization_id)
  )
)
with check (
  exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_evidence_submissions.ngo_profile_id
    and is_org_member(p.organization_id)
  )
);

create policy "members can append audit events"
on audit_events for insert
with check (
  actor_user_id = auth.uid()
  and (
    organization_id is null
    or is_org_member(organization_id)
  )
);

drop policy if exists "public can read public score snapshots" on score_snapshots;

create policy "public can read published public score snapshots"
on score_snapshots for select
using (
  published_at is not null
  and visibility in ('public_summary', 'public_full_record')
);

create policy "members can read organization score snapshots"
on score_snapshots for select
using (
  organization_id is not null
  and is_org_member(organization_id)
);
