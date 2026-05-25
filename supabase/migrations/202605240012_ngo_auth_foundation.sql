-- NGO Full-Scale Slice 1A: Supabase Auth foundation support.
-- Adds the minimum RLS policies needed for authenticated user-scoped NGO flows.

drop policy if exists "members can read structured claims" on structured_claims;
create policy "members can read structured claims"
on structured_claims for select
using (
  organization_id is not null
  and is_org_member(organization_id)
);

drop policy if exists "members can create structured claim drafts" on structured_claims;
create policy "members can create structured claim drafts"
on structured_claims for insert
with check (
  organization_id is not null
  and is_org_member(organization_id)
  and created_by = auth.uid()
  and status = 'draft'
  and cardinality(evidence_item_ids) > 0
);

drop policy if exists "members can update structured claim drafts" on structured_claims;
create policy "members can update structured claim drafts"
on structured_claims for update
using (
  organization_id is not null
  and is_org_member(organization_id)
)
with check (
  organization_id is not null
  and is_org_member(organization_id)
  and cardinality(evidence_item_ids) > 0
);
