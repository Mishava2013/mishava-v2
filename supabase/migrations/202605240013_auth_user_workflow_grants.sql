-- NGO Full-Scale Slice 1B: live Supabase Auth user workflow grants.
-- Real authenticated users need explicit table privileges in addition to RLS.

grant usage on schema public to anon, authenticated;

grant select on organizations to authenticated;
grant insert, update on organizations to authenticated;

grant select on organization_memberships to authenticated;
grant insert, update on organization_memberships to authenticated;

grant select, insert, update on ngo_profiles to authenticated;
grant select, insert, update on ngo_evidence_submissions to authenticated;
grant select, insert, update on ngo_reports to authenticated;
grant select, insert, update on ngo_share_grants to authenticated;

grant select, insert, update on evidence_items to authenticated;
grant select, insert, update on structured_claims to authenticated;
grant select, insert on audit_events to authenticated;

grant select on ngo_report_templates to authenticated;
grant select on score_snapshots to authenticated;
grant select on scoring_versions to authenticated;

drop policy if exists "authenticated users can create organizations" on organizations;
create policy "authenticated users can create organizations"
on organizations for insert
to authenticated
with check (auth.role() = 'authenticated');
