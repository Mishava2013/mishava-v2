-- Mishava V2.0 Release 1 foundation
-- Trust infrastructure must preserve evidence, paper trails, and payment firewalls.

create extension if not exists pgcrypto;

create type organization_type as enum (
  'ngo',
  'business',
  'supplier',
  'seller',
  'local_business',
  'corporate',
  'gov',
  'internal'
);

create type role_code as enum (
  'consumer',
  'ngo_owner',
  'ngo_member',
  'business_owner',
  'business_member',
  'auditor_field',
  'audit_reviewer',
  'mishava_admin',
  'methodology_owner',
  'support',
  'press_reviewer',
  'sponsor_manager'
);

create type visibility_level as enum (
  'private',
  'organization_shared',
  'approved_viewer',
  'public_summary',
  'public_full_record'
);

create type evidence_verification_status as enum (
  'unverified',
  'self_attested',
  'public_record_checked',
  'document_checked',
  'verified',
  'audit_reviewed'
);

create type confidence_level as enum ('low', 'medium', 'high');
create type coverage_level as enum ('Low', 'Medium', 'High');
create type recency_level as enum ('Fresh', 'Recent', 'Stale');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  organization_type organization_type not null,
  name text not null,
  slug text unique not null,
  country_code text,
  market_income_tier text,
  public_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role role_code not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, role)
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  organization_id uuid references organizations(id),
  action text not null,
  subject_table text,
  subject_id uuid,
  reason text,
  visibility visibility_level not null default 'private',
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table evidence_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  subject_type text not null,
  subject_id uuid,
  title text not null,
  source_name text not null,
  source_type text not null,
  url text,
  document_path text,
  published_at timestamptz,
  captured_at timestamptz not null default now(),
  reviewed_at timestamptz,
  country_code text,
  notes text,
  provenance jsonb not null default '{}'::jsonb,
  verification_status evidence_verification_status not null default 'unverified',
  confidence confidence_level not null default 'low',
  visibility visibility_level not null default 'private',
  created_at timestamptz not null default now()
);

create table structured_claims (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  subject_type text not null,
  subject_id uuid,
  pillar_id text not null,
  statement text not null,
  fact_type text not null,
  evidence_item_ids uuid[] not null default '{}',
  confidence confidence_level not null default 'low',
  recency recency_level not null default 'Stale',
  ai_generated boolean not null default false,
  human_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table scoring_versions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  active boolean not null default false,
  methodology_summary text not null,
  pillar_weights jsonb not null,
  indicator_weights jsonb not null default '{}'::jsonb,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table score_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  subject_type text not null,
  subject_id uuid,
  scoring_version_id uuid not null references scoring_versions(id),
  scored_at timestamptz not null default now(),
  as_of_at timestamptz not null,
  evidence_snapshot jsonb not null,
  fact_snapshot jsonb not null,
  indicator_snapshot jsonb not null,
  pillar_snapshot jsonb not null,
  overall_score numeric(5,2),
  overall_label text,
  evidence_coverage coverage_level not null,
  recency recency_level not null,
  verification_confidence confidence_level not null,
  snapshot_hash text not null,
  created_at timestamptz not null default now()
);

create table pricing_records (
  id uuid primary key default gen_random_uuid(),
  product_surface text not null,
  plan_code text not null,
  plan_name text not null,
  market_income_tier text not null,
  country_code text,
  currency text not null,
  billing_interval text not null,
  monthly_price_cents integer,
  annual_price_cents integer,
  one_time_price_cents integer,
  custom_pricing_required boolean not null default false,
  sponsored_allowed boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table feature_gates (
  id uuid primary key default gen_random_uuid(),
  plan_code text not null,
  external_link_allowed boolean not null default false,
  hosted_profile_allowed boolean not null default false,
  hosted_catalog_allowed boolean not null default false,
  supplier_matching_allowed boolean not null default false,
  seller_matching_allowed boolean not null default false,
  saved_search_limit integer not null default 0,
  product_limit integer not null default 0,
  evidence_record_limit integer not null default 0,
  team_member_limit integer not null default 1,
  report_export_allowed boolean not null default false,
  api_access_allowed boolean not null default false,
  audit_workflow_allowed boolean not null default false,
  ranking_payment_boost_allowed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint feature_gates_no_paid_ranking check (ranking_payment_boost_allowed = false)
);

create function prevent_audit_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_events are append-only';
end;
$$;

create trigger audit_events_no_update
before update on audit_events
for each row execute function prevent_audit_event_mutation();

create trigger audit_events_no_delete
before delete on audit_events
for each row execute function prevent_audit_event_mutation();

alter table organizations enable row level security;
alter table organization_memberships enable row level security;
alter table audit_events enable row level security;
alter table evidence_items enable row level security;
alter table structured_claims enable row level security;
alter table scoring_versions enable row level security;
alter table score_snapshots enable row level security;
alter table pricing_records enable row level security;
alter table feature_gates enable row level security;

create policy "members can read their organizations"
on organizations for select
using (
  exists (
    select 1 from organization_memberships m
    where m.organization_id = organizations.id
    and m.user_id = auth.uid()
  )
);

create policy "members can read organization memberships"
on organization_memberships for select
using (user_id = auth.uid());

create policy "members can read organization evidence"
on evidence_items for select
using (
  visibility in ('public_summary', 'public_full_record')
  or exists (
    select 1 from organization_memberships m
    where m.organization_id = evidence_items.organization_id
    and m.user_id = auth.uid()
  )
);

create policy "public can read published scoring versions"
on scoring_versions for select
using (published_at is not null);

create policy "public can read public score snapshots"
on score_snapshots for select
using (
  exists (
    select 1 from organizations o
    where o.id = score_snapshots.organization_id
  )
);

create policy "public can read active pricing"
on pricing_records for select
using (active = true);

create policy "public can read feature gates"
on feature_gates for select
using (true);
