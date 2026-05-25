-- NGO Pilot Readiness Slice 2: scoped report sharing.
-- Adds explicit organization/status fields while preserving private-by-default reports.

create type share_grant_status as enum ('active', 'revoked');

alter table ngo_share_grants
  add column if not exists organization_id uuid references organizations(id),
  add column if not exists granted_to_name text,
  add column if not exists status share_grant_status not null default 'active';

update ngo_share_grants g
set organization_id = p.organization_id
from ngo_profiles p
where g.ngo_profile_id = p.id
and g.organization_id is null;

alter table ngo_share_grants
  alter column organization_id set not null;

update ngo_share_grants
set status = 'revoked'
where revoked_at is not null;

drop policy if exists "members can create share grants" on ngo_share_grants;
create policy "members can create share grants"
on ngo_share_grants for insert
with check (
  is_org_member(organization_id)
  and granted_by = auth.uid()
  and status = 'active'
  and revoked_at is null
  and revoked_by is null
  and visibility = 'approved_viewer'
  and exists (
    select 1
    from ngo_profiles p
    join ngo_reports r on r.ngo_profile_id = p.id
    where p.id = ngo_share_grants.ngo_profile_id
    and p.organization_id = ngo_share_grants.organization_id
    and r.id = ngo_share_grants.report_id
    and r.organization_id = ngo_share_grants.organization_id
    and r.visibility = 'private'
  )
);

drop policy if exists "members can revoke share grants" on ngo_share_grants;
create policy "members can revoke share grants"
on ngo_share_grants for update
using (
  is_org_member(organization_id)
)
with check (
  is_org_member(organization_id)
  and status in ('active', 'revoked')
);
