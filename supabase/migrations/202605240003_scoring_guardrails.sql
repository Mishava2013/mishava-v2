-- Mishava V2.0 Release 3 scoring governance and payment firewall guardrails

create type methodology_change_status as enum (
  'draft',
  'review_requested',
  'approved',
  'published',
  'retired'
);

create table scoring_methodology_changes (
  id uuid primary key default gen_random_uuid(),
  scoring_version_id uuid references scoring_versions(id),
  proposed_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  status methodology_change_status not null default 'draft',
  public_change_note text not null,
  internal_change_reason text not null,
  effective_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ranking_formula_versions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  active boolean not null default false,
  allowed_inputs text[] not null,
  forbidden_inputs text[] not null,
  payment_inputs_used boolean not null default false,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ranking_formula_no_payment_inputs check (payment_inputs_used = false)
);

create table ranking_audit_samples (
  id uuid primary key default gen_random_uuid(),
  ranking_formula_version_id uuid not null references ranking_formula_versions(id),
  query_context jsonb not null,
  ranked_subject_ids uuid[] not null,
  payment_fields_present boolean not null default false,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ranking_audit_no_payment_fields check (payment_fields_present = false)
);

alter table scoring_methodology_changes enable row level security;
alter table ranking_formula_versions enable row level security;
alter table ranking_audit_samples enable row level security;

create policy "public can read published methodology changes"
on scoring_methodology_changes for select
using (published_at is not null);

create policy "public can read active ranking formulas"
on ranking_formula_versions for select
using (active = true);

insert into ranking_formula_versions
  (code, active, allowed_inputs, forbidden_inputs, payment_inputs_used)
values
  (
    'Mishava_Ranking_V2.01_2026.05.24',
    false,
    array[
      'relevance_score',
      'mishava_score',
      'user_preference_match',
      'evidence_coverage_score',
      'evidence_recency_score',
      'verification_confidence',
      'category_fit',
      'location_or_logistics_fit',
      'availability_fit'
    ],
    array[
      'payment_status',
      'subscription_tier',
      'hosted_profile_enabled',
      'ad_spend',
      'sponsorship',
      'paid_boost',
      'sales_commission'
    ],
    false
  );
