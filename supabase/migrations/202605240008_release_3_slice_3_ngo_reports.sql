-- Release 3 Slice 3: NGO evidence-to-report readiness.
-- NGO-only report linkage fields and safe report write policies.

alter table ngo_reports
  add column if not exists organization_id uuid references organizations(id),
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists structured_claim_ids uuid[] not null default '{}',
  add column if not exists score_snapshot_id uuid references score_snapshots(id),
  add column if not exists scoring_version_id uuid references scoring_versions(id);

update ngo_reports r
set organization_id = p.organization_id
from ngo_profiles p
where r.ngo_profile_id = p.id
and r.organization_id is null;

alter table ngo_reports
  alter column organization_id set not null;

drop policy if exists "members can create ngo reports" on ngo_reports;
create policy "members can create ngo reports"
on ngo_reports for insert
with check (
  is_org_member(organization_id)
  and created_by = auth.uid()
  and visibility = 'private'
  and exists (
    select 1
    from ngo_profiles p
    where p.id = ngo_reports.ngo_profile_id
    and p.organization_id = ngo_reports.organization_id
  )
);

drop policy if exists "members can update private ngo reports" on ngo_reports;
create policy "members can update private ngo reports"
on ngo_reports for update
using (
  is_org_member(organization_id)
)
with check (
  is_org_member(organization_id)
  and visibility in ('private', 'organization_shared', 'approved_viewer')
);
