-- NGO Full-Scale Slice 1B: allow real auth workflows to read back their own
-- organization audit rows after append-only inserts.

drop policy if exists "members can read organization audit events" on audit_events;
create policy "members can read organization audit events"
on audit_events for select
to authenticated
using (
  organization_id is null
  or is_org_member(organization_id)
);
