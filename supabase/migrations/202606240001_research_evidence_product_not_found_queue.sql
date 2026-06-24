-- Research + Evidence Slice 1: product-not-found research queue and source review workflow.
-- This extends the existing Shopping research task model without creating fake products,
-- fake evidence, final scores, public claims, AI ingestion, or paid-ranking influence.

alter table public.shopping_research_tasks
  alter column product_id drop not null;

alter table public.shopping_research_tasks
  add column if not exists requested_product_name text,
  add column if not exists requested_brand text,
  add column if not exists requested_category text,
  add column if not exists requested_upc text,
  add column if not exists retailer_url text,
  add column if not exists requester_notes text,
  add column if not exists request_origin text not null default 'internal_review',
  add column if not exists requested_by uuid references auth.users(id),
  add column if not exists requested_by_email text,
  add column if not exists closed_reason text;

alter table public.shopping_research_tasks
  drop constraint if exists shopping_research_tasks_status_check;

alter table public.shopping_research_tasks
  add constraint shopping_research_tasks_status_check
    check (
      status in (
        'research_needed',
        'source_found',
        'claim_drafted',
        'human_review_needed',
        'reviewed',
        'evidence_gap',
        'stale',
        'rejected',
        'new',
        'researching',
        'needs_source_review',
        'blocked',
        'completed',
        'closed_no_reliable_sources'
      )
    );

alter table public.shopping_research_tasks
  drop constraint if exists shopping_research_tasks_reviewed_requires_review_date;

alter table public.shopping_research_tasks
  add constraint shopping_research_tasks_reviewed_requires_review_date
    check (status not in ('reviewed', 'completed') or last_reviewed_at is not null);

alter table public.shopping_research_tasks
  drop constraint if exists shopping_research_tasks_product_or_request_required;

alter table public.shopping_research_tasks
  add constraint shopping_research_tasks_product_or_request_required
    check (product_id is not null or nullif(trim(requested_product_name), '') is not null);

alter table public.shopping_research_tasks
  drop constraint if exists shopping_research_tasks_request_origin_check;

alter table public.shopping_research_tasks
  add constraint shopping_research_tasks_request_origin_check
    check (
      request_origin in (
        'shopping_product_not_found',
        'shopping_evidence_gap',
        'internal_review',
        'source_review'
      )
    );

create index if not exists shopping_research_tasks_requested_category_status_idx
  on public.shopping_research_tasks(requested_category, status);

create index if not exists shopping_research_tasks_request_origin_idx
  on public.shopping_research_tasks(request_origin);

create table if not exists public.shopping_research_sources (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.shopping_research_tasks(id) on delete cascade,
  source_url text not null,
  source_title text,
  source_type text not null,
  publisher text,
  claim_summary text,
  review_status text not null default 'pending_review',
  submitted_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewer_notes text,
  reviewed_at timestamptz,
  connected_evidence_item_id uuid references public.evidence_items(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shopping_research_sources_review_status_check
    check (
      review_status in (
        'pending_review',
        'approved',
        'rejected',
        'needs_follow_up',
        'stale',
        'conflicting'
      )
    ),
  constraint shopping_research_sources_reviewed_requires_reviewer
    check (
      review_status = 'pending_review'
      or (reviewed_by is not null and reviewed_at is not null)
    ),
  constraint shopping_research_sources_url_required
    check (nullif(trim(source_url), '') is not null)
);

create index if not exists shopping_research_sources_task_id_idx
  on public.shopping_research_sources(task_id);

create index if not exists shopping_research_sources_review_status_idx
  on public.shopping_research_sources(review_status);

alter table public.shopping_research_sources enable row level security;

drop policy if exists "Service role can manage shopping research sources"
  on public.shopping_research_sources;

create policy "Service role can manage shopping research sources"
  on public.shopping_research_sources
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create table if not exists public.shopping_research_task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.shopping_research_tasks(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  created_at timestamptz not null default now(),
  constraint shopping_research_task_events_type_check
    check (
      event_type in (
        'request_created',
        'status_changed',
        'note_added',
        'source_added',
        'source_reviewed'
      )
    )
);

create index if not exists shopping_research_task_events_task_id_idx
  on public.shopping_research_task_events(task_id);

alter table public.shopping_research_task_events enable row level security;

drop policy if exists "Service role can manage shopping research task events"
  on public.shopping_research_task_events;

create policy "Service role can manage shopping research task events"
  on public.shopping_research_task_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

comment on table public.shopping_research_sources is
  'Internal source review queue. Pending, rejected, stale, conflicting, or follow-up sources must not feed public evidence cards, claims, scores, rankings, verification, trust badges, or publishing.';
