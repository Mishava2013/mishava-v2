-- NGO Full-Scale Slice 1B: allow real auth users to create and read their
-- organization row before the first membership row exists.

alter table organizations
  add column if not exists created_by uuid references auth.users(id);

drop policy if exists "members can read their organizations" on organizations;
create policy "members and creators can read their organizations"
on organizations for select
using (
  created_by = auth.uid()
  or exists (
    select 1
    from organization_memberships m
    where m.organization_id = organizations.id
    and m.user_id = auth.uid()
  )
);

drop policy if exists "authenticated users can create organizations" on organizations;
create policy "authenticated users can create organizations"
on organizations for insert
to authenticated
with check (
  auth.role() = 'authenticated'
  and created_by = auth.uid()
);
