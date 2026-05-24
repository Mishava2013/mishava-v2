-- Release 3 Slice 2: evidence-backed claims to private draft snapshots.
-- No final scoring math, no fake scores, and no public scoring UI.

alter table scoring_versions
  add column if not exists status text not null default 'draft',
  add column if not exists created_by uuid references auth.users(id);

alter table scoring_versions
  drop constraint if exists scoring_versions_status_check,
  add constraint scoring_versions_status_check
    check (status in ('draft', 'published', 'archived'));

update scoring_versions
set status = 'published'
where published_at is not null;

create or replace function prevent_published_scoring_version_mutation()
returns trigger
language plpgsql
as $$
begin
  if old.published_at is not null or old.status = 'published' then
    raise exception 'published scoring_versions are immutable; create a new version';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists scoring_versions_no_published_update on scoring_versions;
create trigger scoring_versions_no_published_update
before update on scoring_versions
for each row execute function prevent_published_scoring_version_mutation();

drop trigger if exists scoring_versions_no_published_delete on scoring_versions;
create trigger scoring_versions_no_published_delete
before delete on scoring_versions
for each row execute function prevent_published_scoring_version_mutation();

alter table structured_claims
  add column if not exists status text not null default 'draft',
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists review_reason text;

alter table structured_claims
  drop constraint if exists structured_claims_status_check,
  add constraint structured_claims_status_check
    check (status in ('draft', 'reviewed', 'accepted', 'rejected'));

alter table structured_claims
  drop constraint if exists structured_claims_require_evidence_reference,
  add constraint structured_claims_require_evidence_reference
    check (cardinality(evidence_item_ids) > 0);

alter table score_snapshots
  add column if not exists snapshot_status text not null default 'draft',
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists draft_reason text,
  add column if not exists source_claim_ids uuid[] not null default '{}',
  add column if not exists source_evidence_item_ids uuid[] not null default '{}';

alter table score_snapshots
  drop constraint if exists score_snapshots_status_check,
  add constraint score_snapshots_status_check
    check (snapshot_status in ('draft', 'published', 'archived'));

alter table score_snapshots disable trigger score_snapshots_no_update;

update score_snapshots
set snapshot_status = 'published'
where published_at is not null
and visibility in ('public_summary', 'public_full_record');

alter table score_snapshots enable trigger score_snapshots_no_update;

drop policy if exists "public can read published public score snapshots" on score_snapshots;

create policy "public can read published public score snapshots"
on score_snapshots for select
using (
  snapshot_status = 'published'
  and published_at is not null
  and visibility in ('public_summary', 'public_full_record')
);
