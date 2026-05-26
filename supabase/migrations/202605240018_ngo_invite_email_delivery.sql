do $$
begin
  create type invite_email_delivery_status as enum (
    'not_configured',
    'sent',
    'failed'
  );
exception
  when duplicate_object then null;
end $$;

alter table organization_invites
  add column if not exists email_delivery_status invite_email_delivery_status not null default 'not_configured',
  add column if not exists email_delivery_error text,
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_last_attempt_at timestamptz,
  add column if not exists email_sent_count integer not null default 0,
  add column if not exists email_provider_message_id text;

comment on column organization_invites.email_delivery_status is
  'Operational invite email delivery status only. This must never grant access or affect trust outcomes.';

comment on column organization_invites.email_provider_message_id is
  'Transactional provider message id for support/debugging. Never expose provider secrets here.';
