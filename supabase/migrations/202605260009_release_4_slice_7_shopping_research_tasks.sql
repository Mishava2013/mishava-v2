-- Release 4 Slice 7B: lightweight Shopping research task/status model.
-- This is an internal research pipeline foundation only. It is not a crawler,
-- scraping system, scoring engine, or public admin console.

create table if not exists public.shopping_research_tasks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.shopping_products(id) on delete cascade,
  category_key text not null,
  status text not null default 'research_needed',
  assigned_to uuid references auth.users(id),
  last_reviewed_at timestamptz,
  next_review_due_at timestamptz,
  source_count integer not null default 0,
  unresolved_gap_count integer not null default 0,
  confidence_summary text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shopping_research_tasks_status_check
    check (
      status in (
        'research_needed',
        'source_found',
        'claim_drafted',
        'human_review_needed',
        'reviewed',
        'evidence_gap',
        'stale',
        'rejected'
      )
    ),
  constraint shopping_research_tasks_source_count_check
    check (source_count >= 0),
  constraint shopping_research_tasks_unresolved_gap_count_check
    check (unresolved_gap_count >= 0),
  constraint shopping_research_tasks_reviewed_requires_review_date
    check (status <> 'reviewed' or last_reviewed_at is not null)
);

create index if not exists shopping_research_tasks_product_id_idx
  on public.shopping_research_tasks(product_id);

create index if not exists shopping_research_tasks_status_idx
  on public.shopping_research_tasks(status);

create index if not exists shopping_research_tasks_category_status_idx
  on public.shopping_research_tasks(category_key, status);

alter table public.shopping_research_tasks enable row level security;

drop policy if exists "Service role can manage shopping research tasks"
  on public.shopping_research_tasks;

create policy "Service role can manage shopping research tasks"
  on public.shopping_research_tasks
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into public.shopping_research_tasks (
  id,
  product_id,
  category_key,
  status,
  assigned_to,
  last_reviewed_at,
  next_review_due_at,
  source_count,
  unresolved_gap_count,
  confidence_summary,
  notes,
  created_at,
  updated_at
)
values
  (
    '673b86e3-3afa-461c-8b36-09c0fcb77701',
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7001',
    'toilet-paper',
    'evidence_gap',
    null,
    '2026-05-27T00:00:00Z',
    '2026-08-27T00:00:00Z',
    2,
    2,
    'Costco and Kirkland Signature identity reviewed; manufacturer and supplier remain unknown.',
    'Do not treat Costco as manufacturer. Supplier may vary by region or time; stronger public supplier evidence is required before scoring.',
    '2026-05-27T00:00:00Z',
    '2026-05-27T00:00:00Z'
  ),
  (
    '673b86e3-3afa-461c-8b36-09c0fcb77702',
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7002',
    'toilet-paper',
    'evidence_gap',
    null,
    '2026-05-27T00:00:00Z',
    '2026-08-27T00:00:00Z',
    2,
    5,
    'Cashmere consumer brand and Kruger Products manufacturer/brand-owner relationship reviewed; supplier and product-level tissue claims remain unresolved.',
    'Need product-level fiber sourcing, recycled content, certification, bleaching/process, packaging, and supplier details before any Mishava score.',
    '2026-05-27T00:00:00Z',
    '2026-05-27T00:00:00Z'
  ),
  (
    '673b86e3-3afa-461c-8b36-09c0fcb77703',
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7003',
    'toilet-paper',
    'evidence_gap',
    null,
    '2026-05-27T00:00:00Z',
    '2026-08-27T00:00:00Z',
    2,
    5,
    'Purex consumer brand and Kruger Products manufacturer/brand-owner relationship reviewed; supplier and product-level tissue claims remain unresolved.',
    'Need product-level fiber sourcing, recycled content, certification, bleaching/process, packaging, and supplier details before any Mishava score.',
    '2026-05-27T00:00:00Z',
    '2026-05-27T00:00:00Z'
  )
on conflict (id) do update
set
  product_id = excluded.product_id,
  category_key = excluded.category_key,
  status = excluded.status,
  assigned_to = excluded.assigned_to,
  last_reviewed_at = excluded.last_reviewed_at,
  next_review_due_at = excluded.next_review_due_at,
  source_count = excluded.source_count,
  unresolved_gap_count = excluded.unresolved_gap_count,
  confidence_summary = excluded.confidence_summary,
  notes = excluded.notes,
  updated_at = excluded.updated_at;
