-- NGO Full-Scale Slice 15: AI evidence parsing readiness.
-- Suggestion-only foundation; no production AI provider, no automated trust outcomes.

create table if not exists ai_evidence_parse_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  evidence_item_id uuid not null references evidence_items(id) on delete cascade,
  requested_by uuid references auth.users(id),
  provider text not null default 'not_configured',
  model text not null default 'none',
  model_version text,
  prompt_version text not null default 'ngo-evidence-suggestion-v0',
  input_reference text,
  input_summary text,
  status text not null default 'queued',
  error_message text,
  token_input_count integer,
  token_output_count integer,
  estimated_cost_cents integer,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_evidence_parse_jobs_status_check
    check (status in ('queued', 'completed', 'failed', 'canceled'))
);

create table if not exists ai_evidence_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  evidence_item_id uuid not null references evidence_items(id) on delete cascade,
  parse_job_id uuid not null references ai_evidence_parse_jobs(id) on delete cascade,
  suggestion_type text not null default 'structured_claim',
  suggested_text text not null,
  suggested_claim_type text,
  suggested_claim_value text,
  suggested_confidence text,
  source_excerpt text,
  source_reference text,
  status text not null default 'suggested',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  created_structured_claim_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_evidence_suggestions_status_check
    check (status in ('suggested', 'reviewed', 'accepted', 'rejected')),
  constraint ai_evidence_suggestions_type_check
    check (suggestion_type in ('structured_claim', 'summary', 'category', 'missing_context', 'report_language')),
  constraint ai_evidence_suggestions_review_fields_check
    check (
      (status in ('suggested', 'reviewed') and reviewed_by is null and reviewed_at is null)
      or (status in ('accepted', 'rejected') and reviewed_by is not null and reviewed_at is not null)
    )
);

alter table structured_claims
  add column if not exists source_ai_suggestion_id uuid references ai_evidence_suggestions(id);

alter table ai_evidence_suggestions
  drop constraint if exists ai_evidence_suggestions_created_claim_fk,
  add constraint ai_evidence_suggestions_created_claim_fk
    foreign key (created_structured_claim_id) references structured_claims(id);

create index if not exists ai_evidence_parse_jobs_org_evidence_idx
on ai_evidence_parse_jobs (organization_id, evidence_item_id, status);

create index if not exists ai_evidence_suggestions_org_evidence_idx
on ai_evidence_suggestions (organization_id, evidence_item_id, status);

alter table ai_evidence_parse_jobs enable row level security;
alter table ai_evidence_suggestions enable row level security;

drop policy if exists "members can read ai evidence parse jobs" on ai_evidence_parse_jobs;
create policy "members can read ai evidence parse jobs"
on ai_evidence_parse_jobs for select
to authenticated
using (is_org_member(organization_id));

drop policy if exists "members can create ai evidence parse jobs" on ai_evidence_parse_jobs;
create policy "members can create ai evidence parse jobs"
on ai_evidence_parse_jobs for insert
to authenticated
with check (
  requested_by = auth.uid()
  and is_org_member(organization_id)
  and exists (
    select 1
    from evidence_items e
    where e.id = ai_evidence_parse_jobs.evidence_item_id
    and e.organization_id = ai_evidence_parse_jobs.organization_id
  )
);

drop policy if exists "members can update ai evidence parse jobs" on ai_evidence_parse_jobs;
create policy "members can update ai evidence parse jobs"
on ai_evidence_parse_jobs for update
to authenticated
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

drop policy if exists "members can read ai evidence suggestions" on ai_evidence_suggestions;
create policy "members can read ai evidence suggestions"
on ai_evidence_suggestions for select
to authenticated
using (is_org_member(organization_id));

drop policy if exists "members can create ai evidence suggestions" on ai_evidence_suggestions;
create policy "members can create ai evidence suggestions"
on ai_evidence_suggestions for insert
to authenticated
with check (
  is_org_member(organization_id)
  and exists (
    select 1
    from evidence_items e
    where e.id = ai_evidence_suggestions.evidence_item_id
    and e.organization_id = ai_evidence_suggestions.organization_id
  )
  and exists (
    select 1
    from ai_evidence_parse_jobs j
    where j.id = ai_evidence_suggestions.parse_job_id
    and j.organization_id = ai_evidence_suggestions.organization_id
    and j.evidence_item_id = ai_evidence_suggestions.evidence_item_id
  )
);

drop policy if exists "members can update ai evidence suggestions" on ai_evidence_suggestions;
create policy "members can update ai evidence suggestions"
on ai_evidence_suggestions for update
to authenticated
using (is_org_member(organization_id))
with check (is_org_member(organization_id));

grant select, insert, update on ai_evidence_parse_jobs to authenticated;
grant select, insert, update on ai_evidence_suggestions to authenticated;

comment on table ai_evidence_parse_jobs is
  'Suggestion-only AI evidence parsing job metadata. This must not create accepted claims or trust outcomes by itself.';

comment on table ai_evidence_suggestions is
  'Private organization-scoped AI suggestions requiring human review before any structured claim linkage.';

comment on column structured_claims.source_ai_suggestion_id is
  'Traceability link for human-reviewed AI-assisted suggestions. AI suggestions must not become accepted trust facts by default.';
