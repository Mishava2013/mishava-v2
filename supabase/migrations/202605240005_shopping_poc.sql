-- Release 4 Shopping POC
-- Real products only. No seeded products, no invented scores, no commission ranking.

create table shopping_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand_name text,
  category text not null,
  product_url text,
  image_url text,
  evidence_score numeric(5,2),
  score_label text,
  evidence_coverage coverage_level,
  evidence_recency recency_level,
  verification_confidence confidence_level,
  score_snapshot_id uuid references score_snapshots(id),
  score_published_at timestamptz,
  active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shopping_products_score_requires_snapshot check (
    evidence_score is null
    or (
      score_snapshot_id is not null
      and score_published_at is not null
    )
  )
);

create table shopping_places_to_buy (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references shopping_products(id) on delete cascade,
  seller_name text not null,
  seller_type text not null,
  url text,
  price_cents integer,
  currency text,
  availability_status text,
  fulfillment_notes text,
  local_pickup boolean not null default false,
  local_delivery boolean not null default false,
  active boolean not null default true,
  last_checked_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table shopping_priority_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  automatic_zero_rules jsonb not null default '{}'::jsonb,
  answered_count integer not null default 0,
  personalization_enabled boolean not null default false,
  version_code text not null default 'Shopping_Priorities_V2.01_2026.05.24',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, version_code),
  constraint priorities_require_minimum_answers check (
    personalization_enabled = false
    or answered_count >= 12
  )
);

alter table shopping_products enable row level security;
alter table shopping_places_to_buy enable row level security;
alter table shopping_priority_profiles enable row level security;

create policy "public can read active shopping products"
on shopping_products for select
using (active = true);

create policy "public can read active places to buy"
on shopping_places_to_buy for select
using (
  active = true
  and exists (
    select 1
    from shopping_products p
    where p.id = shopping_places_to_buy.product_id
    and p.active = true
  )
);

create policy "admin can create shopping products"
on shopping_products for insert
with check (
  auth.uid() is not null
  and exists (
    select 1
    from organization_memberships m
    where m.user_id = auth.uid()
    and m.role in ('mishava_admin', 'methodology_owner')
  )
);

create policy "admin can update shopping products"
on shopping_products for update
using (
  exists (
    select 1
    from organization_memberships m
    where m.user_id = auth.uid()
    and m.role in ('mishava_admin', 'methodology_owner')
  )
)
with check (
  exists (
    select 1
    from organization_memberships m
    where m.user_id = auth.uid()
    and m.role in ('mishava_admin', 'methodology_owner')
  )
);

create policy "admin can create places to buy"
on shopping_places_to_buy for insert
with check (
  auth.uid() is not null
  and exists (
    select 1
    from organization_memberships m
    where m.user_id = auth.uid()
    and m.role in ('mishava_admin', 'methodology_owner')
  )
);

create policy "users can read own shopping priorities"
on shopping_priority_profiles for select
using (user_id = auth.uid());

create policy "users can create own shopping priorities"
on shopping_priority_profiles for insert
with check (user_id = auth.uid());

create policy "users can update own shopping priorities"
on shopping_priority_profiles for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

