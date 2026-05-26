-- Release 4 Slice 5: conservative image metadata for Shopping POC.
-- This migration does not add or display real product images. Existing baby
-- diapers/wipes products remain on the reviewed fallback state until image
-- rights are explicitly approved.

alter table public.shopping_products
  add column if not exists image_alt_text text,
  add column if not exists image_source_url text,
  add column if not exists image_source_type text,
  add column if not exists image_review_status text not null default 'missing',
  add column if not exists image_last_reviewed_at timestamptz,
  add column if not exists image_rights_notes text;

alter table public.shopping_products
  drop constraint if exists shopping_products_image_source_type_check;

alter table public.shopping_products
  add constraint shopping_products_image_source_type_check
  check (
    image_source_type is null
    or image_source_type in (
      'manufacturer',
      'brand',
      'retailer',
      'manual_upload',
      'placeholder'
    )
  );

alter table public.shopping_products
  drop constraint if exists shopping_products_image_review_status_check;

alter table public.shopping_products
  add constraint shopping_products_image_review_status_check
  check (
    image_review_status in (
      'missing',
      'pending_review',
      'approved',
      'rejected',
      'stale'
    )
  );

alter table public.shopping_products
  drop constraint if exists shopping_products_approved_image_requires_reviewed_rights;

alter table public.shopping_products
  add constraint shopping_products_approved_image_requires_reviewed_rights
  check (
    image_review_status <> 'approved'
    or (
      image_url is not null
      and image_alt_text is not null
      and image_source_url is not null
      and image_source_type is not null
      and image_last_reviewed_at is not null
      and image_rights_notes is not null
    )
  );

update public.shopping_products
set
  image_url = null,
  image_alt_text = null,
  image_source_url = null,
  image_source_type = null,
  image_review_status = 'missing',
  image_last_reviewed_at = null,
  image_rights_notes = 'No product image is displayed until image rights are reviewed and approved.'
where slug in (
  'pampers-swaddlers-sensitive-size-7-44ct',
  'huggies-little-snugglers-size-1-32ct',
  'millie-moon-luxury-size-8-40ct',
  'dyper-charcoal-enhanced-size-4-44ct',
  'up-and-up-disposable-diapers-size-4-200ct',
  'waterwipes-sensitive-plus-540ct',
  'huggies-natural-care-sensitive-wipes-960ct',
  'pampers-sensitive-baby-wipes-36ct'
);
