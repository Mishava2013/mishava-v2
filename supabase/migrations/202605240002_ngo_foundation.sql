-- Mishava V2.0 Release 2 NGO foundation
-- NGO evidence, reports, sharing, and AI usage are transparent and cost-aware.

create type ngo_tier_code as enum (
  'free_ngo',
  'grassroots',
  'growth',
  'trust_pro',
  'network'
);

create type approval_status as enum (
  'draft',
  'submitted',
  'needs_changes',
  'approved',
  'rejected',
  'published',
  'revoked'
);

create type ai_usage_status as enum (
  'not_requested',
  'queued',
  'completed',
  'failed',
  'requires_human_review'
);

create table ngo_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references organizations(id) on delete cascade,
  tier ngo_tier_code not null default 'free_ngo',
  public_name text not null,
  legal_name text,
  mission_area text,
  website_url text,
  registration_identifier text,
  default_visibility visibility_level not null default 'private',
  profile_status approval_status not null default 'draft',
  manager_approved_by uuid references auth.users(id),
  manager_approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ngo_evidence_submissions (
  id uuid primary key default gen_random_uuid(),
  ngo_profile_id uuid not null references ngo_profiles(id) on delete cascade,
  evidence_item_id uuid references evidence_items(id),
  submitted_by uuid references auth.users(id),
  intake_type text not null,
  title text not null,
  description text,
  ai_parse_status ai_usage_status not null default 'not_requested',
  approval_status approval_status not null default 'draft',
  manager_approved_by uuid references auth.users(id),
  manager_approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ngo_report_templates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text not null,
  minimum_tier ngo_tier_code not null default 'free_ngo',
  ai_assist_allowed boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table ngo_reports (
  id uuid primary key default gen_random_uuid(),
  ngo_profile_id uuid not null references ngo_profiles(id) on delete cascade,
  template_id uuid references ngo_report_templates(id),
  title text not null,
  body jsonb not null default '{}'::jsonb,
  evidence_item_ids uuid[] not null default '{}',
  visibility visibility_level not null default 'private',
  ai_assisted boolean not null default false,
  approval_status approval_status not null default 'draft',
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ngo_share_grants (
  id uuid primary key default gen_random_uuid(),
  ngo_profile_id uuid not null references ngo_profiles(id) on delete cascade,
  report_id uuid references ngo_reports(id) on delete cascade,
  granted_to_email text not null,
  viewer_type text not null,
  visibility visibility_level not null default 'approved_viewer',
  purpose text not null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  granted_by uuid references auth.users(id),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table ai_usage_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  actor_user_id uuid references auth.users(id),
  product_surface text not null,
  workflow text not null,
  source_table text,
  source_id uuid,
  status ai_usage_status not null default 'queued',
  billable boolean not null default true,
  covered_by_plan boolean not null default false,
  estimated_cost_cents integer,
  actual_cost_cents integer,
  model_name text,
  prompt_version text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table ngo_profiles enable row level security;
alter table ngo_evidence_submissions enable row level security;
alter table ngo_report_templates enable row level security;
alter table ngo_reports enable row level security;
alter table ngo_share_grants enable row level security;
alter table ai_usage_ledger enable row level security;

create policy "members can read ngo profiles"
on ngo_profiles for select
using (
  exists (
    select 1 from organization_memberships m
    where m.organization_id = ngo_profiles.organization_id
    and m.user_id = auth.uid()
  )
);

create policy "members can read ngo evidence submissions"
on ngo_evidence_submissions for select
using (
  exists (
    select 1
    from ngo_profiles p
    join organization_memberships m on m.organization_id = p.organization_id
    where p.id = ngo_evidence_submissions.ngo_profile_id
    and m.user_id = auth.uid()
  )
);

create policy "public can read active report templates"
on ngo_report_templates for select
using (active = true);

create policy "members can read ngo reports"
on ngo_reports for select
using (
  visibility in ('public_summary', 'public_full_record')
  or exists (
    select 1
    from ngo_profiles p
    join organization_memberships m on m.organization_id = p.organization_id
    where p.id = ngo_reports.ngo_profile_id
    and m.user_id = auth.uid()
  )
);

create policy "members can read share grants"
on ngo_share_grants for select
using (
  exists (
    select 1
    from ngo_profiles p
    join organization_memberships m on m.organization_id = p.organization_id
    where p.id = ngo_share_grants.ngo_profile_id
    and m.user_id = auth.uid()
  )
);

create policy "members can read ai usage"
on ai_usage_ledger for select
using (
  exists (
    select 1 from organization_memberships m
    where m.organization_id = ai_usage_ledger.organization_id
    and m.user_id = auth.uid()
  )
);

insert into ngo_report_templates
  (code, name, description, minimum_tier, ai_assist_allowed)
values
  ('public_trust_profile', 'Public trust profile summary', 'Approved public overview of mission, evidence, and current transparency status.', 'free_ngo', false),
  ('funder_evidence_packet', 'Funder evidence packet', 'Selected evidence, source notes, photos, and manager-approved summaries for a funder.', 'growth', true),
  ('program_impact_report', 'Program impact report', 'Program-specific impact narrative with approved metrics and evidence citations.', 'growth', true),
  ('donation_transparency', 'Donation transparency report', 'Donor-facing transparency report with scoped visibility.', 'grassroots', false),
  ('photo_field_report', 'Photo-supported field report', 'Field-photo report with captions, source notes, and approval trail.', 'growth', true),
  ('custom_report_builder', 'Custom report builder', 'User-defined report structure with optional AI rebuild support.', 'growth', true);
