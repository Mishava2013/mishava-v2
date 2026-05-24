-- Release 4 Slice 1: Shopping POC real-data readiness.
-- Adds source/review metadata only. No product, seller, evidence, or score seed data.

alter table shopping_products
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists source_captured_at timestamptz,
  add column if not exists source_review_status text not null default 'draft',
  add column if not exists data_origin text not null default 'manual_admin',
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

alter table shopping_products
  drop constraint if exists shopping_products_source_review_status_check,
  add constraint shopping_products_source_review_status_check
    check (source_review_status in ('draft', 'reviewed', 'approved', 'rejected'));

alter table shopping_products
  drop constraint if exists shopping_products_data_origin_check,
  add constraint shopping_products_data_origin_check
    check (data_origin in (
      'manual_admin',
      'brand_page',
      'retailer_page',
      'local_store_submission',
      'business_catalog'
    ));

alter table shopping_products
  drop constraint if exists shopping_products_active_requires_real_source,
  add constraint shopping_products_active_requires_real_source
    check (
      active = false
      or (
        source_review_status = 'approved'
        and source_name is not null
        and source_url is not null
        and source_captured_at is not null
      )
    );

alter table shopping_places_to_buy
  add column if not exists source_url text,
  add column if not exists source_captured_at timestamptz,
  add column if not exists source_review_status text not null default 'draft',
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

alter table shopping_places_to_buy
  drop constraint if exists shopping_places_to_buy_source_review_status_check,
  add constraint shopping_places_to_buy_source_review_status_check
    check (source_review_status in ('draft', 'reviewed', 'approved', 'rejected'));

alter table shopping_places_to_buy
  drop constraint if exists shopping_places_to_buy_active_requires_real_source,
  add constraint shopping_places_to_buy_active_requires_real_source
    check (
      active = false
      or (
        source_review_status = 'approved'
        and source_url is not null
        and source_captured_at is not null
      )
    );
