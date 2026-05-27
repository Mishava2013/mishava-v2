-- Release 4 Slice 7: Shopping research pipeline and supplier transparency.
-- Supplier/manufacturer identity is explicit and confidence-scored. Unknowns
-- are preserved as evidence gaps rather than guessed.

alter table public.shopping_products
  add column if not exists retailer_name text,
  add column if not exists brand_display_name text,
  add column if not exists private_label_owner text,
  add column if not exists parent_company text,
  add column if not exists manufacturer_name text,
  add column if not exists supplier_name text,
  add column if not exists supplier_role text,
  add column if not exists supplier_region text,
  add column if not exists manufacturer_source_url text,
  add column if not exists supplier_source_url text,
  add column if not exists manufacturer_confidence text not null default 'unknown',
  add column if not exists supplier_confidence text not null default 'unknown',
  add column if not exists evidence_gap_notes text,
  add column if not exists supplier_reviewed_at timestamptz,
  add column if not exists supplier_reviewed_by uuid references auth.users(id);

alter table public.shopping_products
  drop constraint if exists shopping_products_manufacturer_confidence_check,
  add constraint shopping_products_manufacturer_confidence_check
    check (manufacturer_confidence in ('verified', 'likely', 'unverified', 'unknown'));

alter table public.shopping_products
  drop constraint if exists shopping_products_supplier_confidence_check,
  add constraint shopping_products_supplier_confidence_check
    check (supplier_confidence in ('verified', 'likely', 'unverified', 'unknown'));

alter table public.shopping_products
  drop constraint if exists shopping_products_verified_manufacturer_requires_source,
  add constraint shopping_products_verified_manufacturer_requires_source
    check (
      manufacturer_confidence <> 'verified'
      or (
        manufacturer_name is not null
        and manufacturer_source_url is not null
      )
    );

alter table public.shopping_products
  drop constraint if exists shopping_products_verified_supplier_requires_source,
  add constraint shopping_products_verified_supplier_requires_source
    check (
      supplier_confidence <> 'verified'
      or (
        supplier_name is not null
        and supplier_source_url is not null
      )
    );

alter table public.shopping_products
  drop constraint if exists shopping_products_likely_identity_requires_notes,
  add constraint shopping_products_likely_identity_requires_notes
    check (
      (manufacturer_confidence <> 'likely' and supplier_confidence <> 'likely')
      or evidence_gap_notes is not null
    );

alter table public.shopping_products
  drop constraint if exists shopping_products_toilet_paper_score_ready_requires_supplier_context,
  add constraint shopping_products_toilet_paper_score_ready_requires_supplier_context
    check (
      product_subcategory <> 'toilet-paper'
      or mishava_evidence_review_status <> 'score_ready'
      or (
        manufacturer_confidence in ('verified', 'likely')
        and supplier_confidence in ('verified', 'likely')
      )
    );

update public.shopping_products
set
  brand_display_name = coalesce(brand_display_name, brand_name, name),
  retailer_name = coalesce(
    retailer_name,
    case
      when source_url ilike '%target.com%' then 'Target'
      when source_url ilike '%costco.com%' then 'Costco'
      else source_name
    end,
    'Retailer/source not identified'
  ),
  manufacturer_confidence = coalesce(manufacturer_confidence, 'unknown'),
  supplier_confidence = coalesce(supplier_confidence, 'unknown'),
  evidence_gap_notes = coalesce(
    evidence_gap_notes,
    case
      when product_subcategory = 'toilet-paper'
        then 'Manufacturer and supplier evidence has not been fully reviewed for this toilet paper product.'
      else 'Manufacturer and supplier transparency review is pending.'
    end
  )
where active = true;

update public.shopping_products
set
  private_label_owner = 'Target',
  evidence_gap_notes = 'Target private-label product. Manufacturer and supplier are not verified in the reviewed source metadata.'
where slug = 'up-and-up-soft-and-strong-toilet-paper-18-mega-rolls';

insert into public.shopping_products (
  id,
  slug,
  name,
  brand_name,
  category,
  product_subcategory,
  product_summary,
  package_details,
  product_url,
  image_url,
  image_alt_text,
  image_source_url,
  image_source_type,
  image_review_status,
  image_last_reviewed_at,
  image_rights_notes,
  evidence_score,
  score_label,
  evidence_coverage,
  evidence_recency,
  verification_confidence,
  score_snapshot_id,
  score_published_at,
  source_name,
  source_url,
  source_captured_at,
  source_review_status,
  data_origin,
  recycled_content_claim,
  post_consumer_recycled_content_claim,
  bamboo_fsc_claim,
  virgin_fiber_claim,
  bleaching_process_claim,
  packaging_claim,
  brand_sourcing_policy_url,
  external_evidence_reference_url,
  external_evidence_reference_notes,
  mishava_evidence_review_status,
  retailer_name,
  brand_display_name,
  private_label_owner,
  parent_company,
  manufacturer_name,
  supplier_name,
  supplier_role,
  supplier_region,
  manufacturer_source_url,
  supplier_source_url,
  manufacturer_confidence,
  supplier_confidence,
  evidence_gap_notes,
  supplier_reviewed_at,
  supplier_reviewed_by,
  active
)
values
  (
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7001',
    'kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls',
    'Kirkland Signature Bath Tissue - 2-Ply - 380 Sheets - 30 Rolls',
    'Kirkland Signature',
    'household',
    'toilet-paper',
    'Costco private-label toilet paper record. Mishava tracks Costco as retailer/private-label owner, but does not treat Costco as the manufacturer or supplier without evidence.',
    '2-ply, 380 sheets per roll, 30 rolls, 1,425 total sq ft',
    'https://www.costco.com/p/-/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls/100645583',
    null,
    null,
    null,
    null,
    'missing',
    null,
    'No product image is displayed until image rights are reviewed and approved.',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'Costco product page',
    'https://www.costco.com/p/-/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls/100645583',
    '2026-05-27T00:00:00Z',
    'approved',
    'retailer_page',
    null,
    null,
    'Costco product page states FSC Mix certification. Mishava has not reviewed certification chain-of-custody or product-level scoring impact.',
    'Virgin fiber reliance not reviewed by Mishava.',
    null,
    null,
    'https://www.costco.com/sustainability-environment.html#forest-conservation-commitment',
    null,
    'Costco source identifies the product and FSC Mix claim, but manufacturer/supplier identity is not verified by Mishava.',
    'external_evidence_available',
    'Costco',
    'Kirkland Signature',
    'Costco',
    'Costco',
    null,
    null,
    null,
    null,
    null,
    null,
    'unknown',
    'unknown',
    'Manufacturer and supplier are not publicly verified in the reviewed source. Supplier may vary by region or time; do not assign manufacturing credit or blame to Costco without stronger evidence.',
    '2026-05-27T00:00:00Z',
    null,
    true
  ),
  (
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7002',
    'cashmere-bathroom-tissue-kruger-products',
    'Cashmere Bathroom Tissue',
    'Cashmere',
    'household',
    'toilet-paper',
    'Kruger Products brand record for toilet paper supplier transparency. Mishava records Kruger Products as manufacturer/brand owner where the reviewed Kruger source supports that relationship.',
    null,
    'https://www.krugerproducts.ca/en-ca/our-brands',
    null,
    null,
    null,
    null,
    'missing',
    null,
    'No product image is displayed until image rights are reviewed and approved.',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'Kruger Products brands page',
    'https://www.krugerproducts.ca/en-ca/our-brands',
    '2026-05-27T00:00:00Z',
    'approved',
    'brand_page',
    null,
    null,
    null,
    'Virgin fiber reliance not reviewed by Mishava.',
    null,
    null,
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    'Kruger Products source identifies Cashmere as a consumer bathroom tissue brand. Mishava has not copied any outside score as a Mishava Score.',
    'external_evidence_available',
    'Retail availability not reviewed',
    'Cashmere',
    null,
    'Kruger Products',
    'Kruger Products',
    null,
    'manufacturer and brand owner',
    'Canada',
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    null,
    'verified',
    'unknown',
    'Kruger Products manufacturer/brand-owner relationship is sourced. Product-level fiber sourcing, recycled content, bleaching/process, packaging, and supplier details remain evidence gaps.',
    '2026-05-27T00:00:00Z',
    null,
    true
  ),
  (
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7003',
    'purex-bathroom-tissue-kruger-products',
    'Purex Bathroom Tissue',
    'Purex',
    'household',
    'toilet-paper',
    'Kruger Products brand record for toilet paper supplier transparency. Mishava records Kruger Products as manufacturer/brand owner where the reviewed Kruger source supports that relationship.',
    null,
    'https://www.krugerproducts.ca/en-ca/our-brands',
    null,
    null,
    null,
    null,
    'missing',
    null,
    'No product image is displayed until image rights are reviewed and approved.',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    'Kruger Products brands page',
    'https://www.krugerproducts.ca/en-ca/our-brands',
    '2026-05-27T00:00:00Z',
    'approved',
    'brand_page',
    null,
    null,
    null,
    'Virgin fiber reliance not reviewed by Mishava.',
    null,
    null,
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    'Kruger Products source identifies Purex as a consumer bathroom tissue brand. Mishava has not copied any outside score as a Mishava Score.',
    'external_evidence_available',
    'Retail availability not reviewed',
    'Purex',
    null,
    'Kruger Products',
    'Kruger Products',
    null,
    'manufacturer and brand owner',
    'Canada',
    'https://www.krugerproducts.ca/en-ca/about-us/what-we-do',
    null,
    'verified',
    'unknown',
    'Kruger Products manufacturer/brand-owner relationship is sourced. Product-level fiber sourcing, recycled content, bleaching/process, packaging, and supplier details remain evidence gaps.',
    '2026-05-27T00:00:00Z',
    null,
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  brand_name = excluded.brand_name,
  category = excluded.category,
  product_subcategory = excluded.product_subcategory,
  product_summary = excluded.product_summary,
  package_details = excluded.package_details,
  product_url = excluded.product_url,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  source_captured_at = excluded.source_captured_at,
  source_review_status = excluded.source_review_status,
  data_origin = excluded.data_origin,
  recycled_content_claim = excluded.recycled_content_claim,
  bamboo_fsc_claim = excluded.bamboo_fsc_claim,
  virgin_fiber_claim = excluded.virgin_fiber_claim,
  brand_sourcing_policy_url = excluded.brand_sourcing_policy_url,
  external_evidence_reference_url = excluded.external_evidence_reference_url,
  external_evidence_reference_notes = excluded.external_evidence_reference_notes,
  mishava_evidence_review_status = excluded.mishava_evidence_review_status,
  retailer_name = excluded.retailer_name,
  brand_display_name = excluded.brand_display_name,
  private_label_owner = excluded.private_label_owner,
  parent_company = excluded.parent_company,
  manufacturer_name = excluded.manufacturer_name,
  supplier_name = excluded.supplier_name,
  supplier_role = excluded.supplier_role,
  supplier_region = excluded.supplier_region,
  manufacturer_source_url = excluded.manufacturer_source_url,
  supplier_source_url = excluded.supplier_source_url,
  manufacturer_confidence = excluded.manufacturer_confidence,
  supplier_confidence = excluded.supplier_confidence,
  evidence_gap_notes = excluded.evidence_gap_notes,
  supplier_reviewed_at = excluded.supplier_reviewed_at,
  supplier_reviewed_by = excluded.supplier_reviewed_by,
  active = excluded.active;

alter table public.shopping_products
  drop constraint if exists shopping_products_active_requires_supplier_context,
  add constraint shopping_products_active_requires_supplier_context
    check (
      active = false
      or (
        brand_display_name is not null
        and retailer_name is not null
        and manufacturer_confidence is not null
        and supplier_confidence is not null
      )
    );

insert into public.shopping_places_to_buy (
  id,
  product_id,
  seller_name,
  seller_type,
  url,
  price_cents,
  currency,
  availability_status,
  fulfillment_notes,
  local_pickup,
  local_delivery,
  last_checked_at,
  source_url,
  source_captured_at,
  source_review_status,
  active
)
values
  (
    '8ed48d37-9052-4cd4-b7f5-2d46ac60a701',
    '7b1e4b00-5a6d-4611-a2db-74b2c89f7001',
    'Costco',
    'external_retailer',
    'https://www.costco.com/p/-/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls/100645583',
    null,
    'USD',
    'Availability varies by warehouse or delivery region',
    'Costco membership and regional availability may apply. Mishava is not the store.',
    false,
    false,
    '2026-05-27T00:00:00Z',
    'https://www.costco.com/p/-/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls/100645583',
    '2026-05-27T00:00:00Z',
    'approved',
    true
  )
on conflict (id) do update
set
  product_id = excluded.product_id,
  seller_name = excluded.seller_name,
  seller_type = excluded.seller_type,
  url = excluded.url,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  availability_status = excluded.availability_status,
  fulfillment_notes = excluded.fulfillment_notes,
  local_pickup = excluded.local_pickup,
  local_delivery = excluded.local_delivery,
  last_checked_at = excluded.last_checked_at,
  source_url = excluded.source_url,
  source_captured_at = excluded.source_captured_at,
  source_review_status = excluded.source_review_status,
  active = excluded.active;
