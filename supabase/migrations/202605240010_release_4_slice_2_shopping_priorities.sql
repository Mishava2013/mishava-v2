-- Release 4 Slice 2: Shopping Priorities privacy/readiness metadata.
-- No products, stores, evidence, scores, affiliate, commission, or Plus data.

alter table shopping_priority_profiles
  add column if not exists consent_version text,
  add column if not exists consented_at timestamptz,
  add column if not exists privacy_acknowledged_at timestamptz,
  add column if not exists last_reviewed_at timestamptz;
