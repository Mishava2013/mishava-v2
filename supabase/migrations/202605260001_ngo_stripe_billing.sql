-- NGO Full-Scale Slice 12: Stripe Checkout and webhook foundation.
-- Test-mode billing architecture only. Payment cannot affect trust outcomes.

create table if not exists ngo_billing_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_key text not null default 'free',
  billing_status text not null default 'free',
  billing_interval text not null default 'none',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  setup_service_key text,
  setup_service_status text not null default 'none',
  last_stripe_event_id text,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ngo_billing_accounts_plan_key_check check (
    plan_key in ('free', 'grassroots', 'growth', 'trust_pro', 'network_custom')
  ),
  constraint ngo_billing_accounts_status_check check (
    billing_status in (
      'free',
      'checkout_pending',
      'active',
      'trialing',
      'past_due',
      'canceled',
      'incomplete',
      'unpaid',
      'manual_custom'
    )
  ),
  constraint ngo_billing_accounts_interval_check check (
    billing_interval in ('monthly', 'annual', 'none', 'custom')
  ),
  constraint ngo_billing_accounts_setup_status_check check (
    setup_service_status in (
      'none',
      'requested',
      'checkout_pending',
      'paid',
      'scheduled',
      'completed',
      'canceled',
      'manual_custom'
    )
  )
);

create index if not exists ngo_billing_accounts_customer_idx
on ngo_billing_accounts (stripe_customer_id);

create index if not exists ngo_billing_accounts_subscription_idx
on ngo_billing_accounts (stripe_subscription_id);

create table if not exists stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  livemode boolean not null default false,
  processing_status text not null default 'received',
  organization_id uuid references organizations(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text,
  constraint stripe_webhook_events_status_check check (
    processing_status in ('received', 'processed', 'failed', 'ignored')
  )
);

create index if not exists stripe_webhook_events_org_idx
on stripe_webhook_events (organization_id);

alter table ngo_billing_accounts enable row level security;
alter table stripe_webhook_events enable row level security;

drop policy if exists "members can read ngo billing accounts" on ngo_billing_accounts;
create policy "members can read ngo billing accounts"
on ngo_billing_accounts for select
to authenticated
using (is_org_member(organization_id));

drop policy if exists "billing managers can update ngo billing accounts" on ngo_billing_accounts;
create policy "billing managers can update ngo billing accounts"
on ngo_billing_accounts for update
to authenticated
using (
  has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
)
with check (
  has_org_role_text(organization_id, array['ngo_owner', 'ngo_admin', 'mishava_admin'])
);

drop policy if exists "members can read stripe webhook event summaries" on stripe_webhook_events;
create policy "members can read stripe webhook event summaries"
on stripe_webhook_events for select
to authenticated
using (
  organization_id is not null
  and is_org_member(organization_id)
);
