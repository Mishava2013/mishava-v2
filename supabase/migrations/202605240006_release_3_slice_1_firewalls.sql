-- Release 3 Slice 1: scoring/ranking firewalls and snapshot immutability.
-- This migration adds no fake scores and no public scoring UI.

create or replace function prevent_score_snapshot_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'score_snapshots are append-only';
end;
$$;

drop trigger if exists score_snapshots_no_update on score_snapshots;
create trigger score_snapshots_no_update
before update on score_snapshots
for each row execute function prevent_score_snapshot_mutation();

drop trigger if exists score_snapshots_no_delete on score_snapshots;
create trigger score_snapshots_no_delete
before delete on score_snapshots
for each row execute function prevent_score_snapshot_mutation();

update ranking_formula_versions
set
  allowed_inputs = array[
    'search_match',
    'evidence_score',
    'user_preference_match',
    'evidence_coverage',
    'evidence_recency',
    'verification_confidence',
    'category_fit',
    'local_distance_availability'
  ],
  forbidden_inputs = array[
    'payment_status',
    'subscription_tier',
    'hosted_profile_enabled',
    'claimed_profile_status',
    'sponsorship_status',
    'ad_spend',
    'paid_boost',
    'sales_commission',
    'affiliate_fee',
    'referral_fee'
  ],
  payment_inputs_used = false
where code = 'Mishava_Ranking_V2.01_2026.05.24';
