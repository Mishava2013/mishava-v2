import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "./supabase/server";

export type ShoppingProduct = {
  id: string;
  slug: string;
  name: string;
  brand_name: string | null;
  category: string;
  product_subcategory: string | null;
  product_summary: string | null;
  package_details: string | null;
  product_url: string | null;
  image_url: string | null;
  image_alt_text: string | null;
  image_source_url: string | null;
  image_source_type:
    | "manufacturer"
    | "brand"
    | "retailer"
    | "manual_upload"
    | "placeholder"
    | null;
  image_review_status:
    | "missing"
    | "pending_review"
    | "approved"
    | "rejected"
    | "stale"
    | null;
  image_last_reviewed_at: string | null;
  image_rights_notes: string | null;
  recycled_content_claim: string | null;
  post_consumer_recycled_content_claim: string | null;
  bamboo_fsc_claim: string | null;
  virgin_fiber_claim: string | null;
  bleaching_process_claim: string | null;
  packaging_claim: string | null;
  brand_sourcing_policy_url: string | null;
  external_evidence_reference_url: string | null;
  external_evidence_reference_notes: string | null;
  retailer_name: string | null;
  brand_display_name: string | null;
  private_label_owner: string | null;
  parent_company: string | null;
  manufacturer_name: string | null;
  supplier_name: string | null;
  supplier_role: string | null;
  supplier_region: string | null;
  manufacturer_source_url: string | null;
  supplier_source_url: string | null;
  manufacturer_confidence: SupplierConfidence;
  supplier_confidence: SupplierConfidence;
  evidence_gap_notes: string | null;
  supplier_reviewed_at: string | null;
  mishava_evidence_review_status:
    | "not_started"
    | "external_evidence_available"
    | "draft_claims"
    | "reviewed_claims"
    | "score_ready";
  evidence_score: number | null;
  score_label: string | null;
  evidence_coverage: "Low" | "Medium" | "High" | null;
  evidence_recency: "Fresh" | "Recent" | "Stale" | null;
  verification_confidence: "low" | "medium" | "high" | null;
  score_snapshot_id: string | null;
  score_published_at: string | null;
  source_name: string | null;
  source_url: string | null;
  source_captured_at: string | null;
  source_review_status: "draft" | "reviewed" | "approved" | "rejected";
  data_origin:
    | "manual_admin"
    | "brand_page"
    | "retailer_page"
    | "local_store_submission"
    | "business_catalog";
  active: boolean;
};

export type SupplierConfidence = "verified" | "likely" | "unverified" | "unknown";

export type ShoppingResearchQuestion = {
  key: string;
  label: string;
  sourcePriority: "primary" | "secondary";
};

export type ShoppingResearchTaskStatus =
  | "new"
  | "researching"
  | "needs_source_review"
  | "blocked"
  | "completed"
  | "closed_no_reliable_sources"
  | "research_needed"
  | "source_found"
  | "claim_drafted"
  | "human_review_needed"
  | "reviewed"
  | "evidence_gap"
  | "stale"
  | "rejected";

export type ShoppingResearchTask = {
  id: string;
  product_id: string;
  category_key: string;
  status: ShoppingResearchTaskStatus;
  assigned_to: string | null;
  last_reviewed_at: string | null;
  next_review_due_at: string | null;
  source_count: number;
  unresolved_gap_count: number;
  confidence_summary: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ShoppingCategoryResearchTemplate = {
  categoryKey: string;
  requiredIdentityFields: string[];
  requiredSupplierFields: string[];
  claimAreas: ShoppingResearchQuestion[];
  sourceTypes: string[];
  scoreReadinessPrerequisites: string[];
};

export type PlaceToBuy = {
  id: string;
  product_id: string;
  seller_name: string;
  seller_type: "external_retailer" | "brand_direct" | "local_store" | "mishava_hosted";
  url: string | null;
  price_cents: number | null;
  currency: string | null;
  availability_status: string | null;
  fulfillment_notes: string | null;
  local_pickup: boolean;
  local_delivery: boolean;
  last_checked_at: string | null;
  source_url: string | null;
  source_captured_at: string | null;
  source_review_status: "draft" | "reviewed" | "approved" | "rejected";
};

export type ShoppingPriorityProfile = {
  id: string;
  user_id: string;
  answers: Record<string, number>;
  automatic_zero_rules: Record<string, RedLineMode>;
  answered_count: number;
  personalization_enabled: boolean;
  version_code: string;
  consent_version: string | null;
  consented_at: string | null;
  privacy_acknowledged_at: string | null;
  last_reviewed_at: string | null;
  updated_at: string;
};

export type RedLineMode = "off" | "warn" | "hide";

export type YourValuesScoreState =
  | "complete_priorities"
  | "more_evidence_needed"
  | "your_values_score_pending"
  | "evidence_score_only";

export type ShoppingScoreExplanation = {
  label:
    | "Evidence Score"
    | "Evidence Score Preview"
    | "Evidence review preview"
    | "Draft trust context"
    | "Score pending"
    | "Mishava is still reviewing this product"
    | "Your Values Score unavailable"
    | "Your Values Match Preview"
    | "Your Values Match Preview unavailable"
    | "Personal match preview"
    | "Personal match is not ready yet"
    | "Your Values Score pending"
    | "More evidence needed";
  score: number | null;
  coverage: "Low" | "Medium" | "High" | "Pending";
  recency: "Fresh" | "Recent" | "Stale" | "Pending";
  verification: string;
  confidence: "low" | "medium" | "high" | "pending";
  snapshotStatus: string;
  sourceStatus: string;
  sourceName: string;
  sourceUrl: string | null;
  checked: string[];
  missing: string[];
  why: string;
  valuesMessage: string;
};

export type ToiletPaperEvidenceDimension = {
  label: string;
  status:
    | "Reviewed"
    | "Source recorded"
    | "External reference only"
    | "Missing"
    | "Not reviewed"
    | "Not applicable";
  detail: string;
};

export type ToiletPaperPreview = {
  evidenceLabel:
    | "Evidence review preview"
    | "Mishava is still reviewing this product";
  valuesLabel: "Personal match preview" | "Personal match is not ready yet";
  confidenceLabel: "Evidence profile incomplete" | "Mishava review not finalized";
  disclaimer: string;
  summary: string;
};

export const shoppingPriorityVersionCode = "Shopping_Priorities_V2.01_2026.05.24";
export const shoppingPriorityConsentVersion = "Shopping_Priorities_Privacy_V1_2026.05.24";

const shoppingProductColumns =
  "id,slug,name,brand_name,category,product_subcategory,product_summary,package_details,product_url,image_url,image_alt_text,image_source_url,image_source_type,image_review_status,image_last_reviewed_at,image_rights_notes,recycled_content_claim,post_consumer_recycled_content_claim,bamboo_fsc_claim,virgin_fiber_claim,bleaching_process_claim,packaging_claim,brand_sourcing_policy_url,external_evidence_reference_url,external_evidence_reference_notes,retailer_name,brand_display_name,private_label_owner,parent_company,manufacturer_name,supplier_name,supplier_role,supplier_region,manufacturer_source_url,supplier_source_url,manufacturer_confidence,supplier_confidence,evidence_gap_notes,supplier_reviewed_at,mishava_evidence_review_status,evidence_score,score_label,evidence_coverage,evidence_recency,verification_confidence,score_snapshot_id,score_published_at,source_name,source_url,source_captured_at,source_review_status,data_origin,active";

export const shoppingResearchTaskStatuses: ShoppingResearchTaskStatus[] = [
  "new",
  "researching",
  "needs_source_review",
  "blocked",
  "completed",
  "closed_no_reliable_sources",
  "research_needed",
  "source_found",
  "claim_drafted",
  "human_review_needed",
  "reviewed",
  "evidence_gap",
  "stale",
  "rejected",
];

export const shoppingSourceHierarchy = {
  primary: [
    "brand/manufacturer official website",
    "product packaging or label",
    "retailer product page",
    "sustainability, sourcing, or impact report",
    "certification or certifier database",
    "government or regulatory source",
  ],
  secondary: [
    "third-party scorecard",
    "NGO report",
    "credible journalism",
    "academic or industry report",
  ],
} as const;

export const shoppingCategoryResearchTemplates: Record<
  string,
  ShoppingCategoryResearchTemplate
> = {
  "toilet-paper": {
    categoryKey: "toilet-paper",
    requiredIdentityFields: [
      "product name",
      "consumer-facing brand",
      "retailer",
      "private-label owner when applicable",
    ],
    requiredSupplierFields: [
      "manufacturer",
      "supplier",
      "supplier role",
      "manufacturer confidence",
      "supplier confidence",
    ],
    claimAreas: [
      {
        key: "recycled_content",
        label: "Recycled content percentage",
        sourcePriority: "primary",
      },
      {
        key: "post_consumer_recycled_content",
        label: "Post-consumer recycled content",
        sourcePriority: "primary",
      },
      {
        key: "bamboo_fsc",
        label: "Bamboo/FSC certification",
        sourcePriority: "primary",
      },
      {
        key: "virgin_fiber",
        label: "Virgin forest fiber reliance",
        sourcePriority: "secondary",
      },
      {
        key: "bleaching_process",
        label: "Bleaching/process claims",
        sourcePriority: "primary",
      },
      {
        key: "packaging",
        label: "Packaging claims",
        sourcePriority: "primary",
      },
      {
        key: "sourcing_policy",
        label: "Company/brand sourcing policy",
        sourcePriority: "primary",
      },
      {
        key: "third_party_references",
        label: "Third-party tissue scorecards as evidence references only",
        sourcePriority: "secondary",
      },
    ],
    sourceTypes: [
      "brand/manufacturer official website",
      "retailer product page",
      "product packaging/label",
      "sustainability or sourcing report",
      "certification database",
      "third-party scorecard as evidence reference",
    ],
    scoreReadinessPrerequisites: [
      "reviewed product identity",
      "explicit manufacturer/supplier confidence",
      "reviewed tissue sourcing claims",
      "accepted structured claims",
      "supported scoring version",
      "published score snapshot",
    ],
  },
};

export async function getShoppingProducts({
  query,
  category,
  sort = "evidence",
}: {
  query?: string;
  category?: string;
  sort?: string;
}) {
  if (!isSupabaseServerConfigured()) {
    return {
      products: [] as ShoppingProduct[],
      configured: false,
    };
  }

  const client = createSupabaseServerClient();
  const rows = await client.selectMany<ShoppingProduct>(
    "shopping_products",
    { active: true },
    shoppingProductColumns,
  );

  const normalizedQuery = query?.trim().toLowerCase();
  const categoryProducts = category
    ? rows.filter((product) => isProductInCategory(product, category))
    : rows;
  const products = normalizedQuery
    ? categoryProducts.filter((product) =>
        [product.name, product.brand_name, product.category, product.product_subcategory]
          .concat([
            product.retailer_name,
            product.brand_display_name,
            product.private_label_owner,
            product.parent_company,
            product.manufacturer_name,
            product.supplier_name,
          ])
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery)),
      )
    : categoryProducts;

  return {
    products: sortShoppingProducts(products, sort),
    configured: true,
  };
}

export async function getShoppingProductBySlug(slug: string) {
  if (!isSupabaseServerConfigured()) {
    return {
      product: null as ShoppingProduct | null,
      placesToBuy: [] as PlaceToBuy[],
      configured: false,
    };
  }

  const client = createSupabaseServerClient();
  const product = await client.selectOne<ShoppingProduct>(
    "shopping_products",
    { slug, active: true },
    shoppingProductColumns,
  );

  if (!product) {
    return {
      product,
      placesToBuy: [] as PlaceToBuy[],
      configured: true,
    };
  }

  const placesToBuy = await client.selectMany<PlaceToBuy>(
    "shopping_places_to_buy",
    { product_id: product.id, active: true },
    "id,product_id,seller_name,seller_type,url,price_cents,currency,availability_status,fulfillment_notes,local_pickup,local_delivery,last_checked_at,source_url,source_captured_at,source_review_status",
  );

  return {
    product,
    placesToBuy: sortPlacesToBuy(placesToBuy),
    configured: true,
  };
}

export async function getShoppingPriorityProfile(userId: string) {
  if (!isSupabaseServerConfigured()) return null;

  const client = createSupabaseServerClient();

  return client.selectOne<ShoppingPriorityProfile>(
    "shopping_priority_profiles",
    {
      user_id: userId,
      version_code: shoppingPriorityVersionCode,
    },
    "id,user_id,answers,automatic_zero_rules,answered_count,personalization_enabled,version_code,consent_version,consented_at,privacy_acknowledged_at,last_reviewed_at,updated_at",
  );
}

export function hasPublishedEvidenceScore(product: ShoppingProduct) {
  return Boolean(
    product.evidence_score !== null &&
      product.score_snapshot_id &&
      product.score_published_at,
  );
}

export function getProductTrustLabel(product: ShoppingProduct) {
  if (hasPublishedEvidenceScore(product)) {
    return `Evidence Score ${product.evidence_score}`;
  }

  if (product.score_snapshot_id) {
    return "Draft trust context";
  }

  if (!product.evidence_coverage && !product.score_snapshot_id) {
    return "Evidence profile pending";
  }

  return "Score pending";
}

export function hasApprovedProductImage(product: ShoppingProduct) {
  return Boolean(
    product.image_url &&
      product.image_alt_text &&
      product.image_source_url &&
      product.image_review_status === "approved",
  );
}

export function getProductImageFallback(product: ShoppingProduct) {
  const basis =
    product.product_subcategory ??
    product.category ??
    product.brand_name ??
    product.name;
  const initials = basis
    .split(/[\s/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return {
    initials: initials || "MI",
    label:
      product.product_subcategory === "wipes"
        ? "Baby wipes"
        : product.product_subcategory === "diapers"
          ? "Diaper product"
          : product.product_subcategory === "toilet-paper"
            ? "Toilet paper"
          : product.category,
    reason:
      product.image_review_status === "rejected"
        ? "Image not shown"
        : product.image_review_status === "stale"
          ? "Image rights need review"
          : product.image_review_status === "pending_review"
            ? "Image rights being reviewed"
            : "Not a product photo",
  };
}

export function buildShoppingScoreExplanation({
  product,
  valuesState = "complete_priorities",
}: {
  product: ShoppingProduct;
  valuesState?: YourValuesScoreState;
}): ShoppingScoreExplanation {
  const hasEvidenceScore = hasPublishedEvidenceScore(product);
  const hasDraftContext = Boolean(product.score_snapshot_id && !hasEvidenceScore);
  const valuesMessage = getYourValuesScoreMessage(valuesState);
  const missing = [];
  const evidenceReadiness = getEvidenceReadinessLabels(product);
  const isToiletPaper = product.product_subcategory === "toilet-paper";

  if (!product.evidence_coverage) missing.push("reviewed evidence coverage");
  if (!product.evidence_recency) missing.push("published evidence recency");
  if (!product.verification_confidence) missing.push("verification confidence");
  if (!product.score_snapshot_id) missing.push("published score snapshot");
  if (!product.score_published_at) missing.push("snapshot publication date");
  if (product.evidence_score === null) missing.push("evidence-backed score value");
  if (
    isToiletPaper &&
    product.mishava_evidence_review_status !== "score_ready"
  ) {
    missing.push("toilet paper scoring version");
    missing.push("Mishava-reviewed tissue sourcing claims");
  }
  if (isLowConfidence(product.manufacturer_confidence)) {
    missing.push("verified manufacturer source");
  }
  if (isLowConfidence(product.supplier_confidence)) {
    missing.push("verified supplier source");
  }

  return {
    label: hasEvidenceScore
      ? "Evidence Score"
      : hasDraftContext
        ? "Draft trust context"
        : isToiletPaper
          ? "Evidence review preview"
        : valuesState === "more_evidence_needed"
          ? "More evidence needed"
          : valuesState === "your_values_score_pending"
            ? "Your Values Score pending"
            : valuesState === "complete_priorities"
              ? "Your Values Score unavailable"
              : "Score pending",
    score: hasEvidenceScore ? Number(product.evidence_score) : null,
    coverage: product.evidence_coverage ?? "Pending",
    recency: product.evidence_recency ?? "Pending",
    verification: product.score_snapshot_id
      ? "Snapshot linked"
      : "No public score snapshot",
    confidence: product.verification_confidence ?? "pending",
    snapshotStatus: hasEvidenceScore
      ? `Published ${formatFreshness(product.score_published_at)}`
      : hasDraftContext
        ? "Draft or provisional; not public scoring"
        : "No public score snapshot",
    sourceStatus: `${product.source_review_status} source`,
    sourceName: product.source_name ?? "Source not listed",
    sourceUrl: product.source_url,
    checked: [
      product.source_name ? `Source recorded: ${product.source_name}` : null,
      product.product_summary ? "Product summary recorded from source" : null,
      product.package_details ? `Package details: ${product.package_details}` : null,
      hasApprovedProductImage(product)
        ? `Product image approved from ${product.image_source_type ?? "reviewed source"}`
        : "No approved product image displayed",
      product.source_captured_at
        ? `Source freshness: ${formatFreshness(product.source_captured_at)}`
        : null,
      product.source_review_status
        ? `Source review status: ${product.source_review_status}`
        : null,
      ...getSupplierTransparencyLabels(product),
      ...evidenceReadiness,
    ].filter((item): item is string => Boolean(item)),
    missing,
    why: hasEvidenceScore
      ? "This Evidence Score is backed by a published score snapshot."
      : hasDraftContext
        ? "Mishava has draft trust context, but it is not a public score."
        : isToiletPaper
          ? "This is an early toilet paper evidence preview. A public Mishava score needs reviewed tissue claims, a supported scoring version, and a published score snapshot."
        : "A public score needs reviewed evidence, accepted scoring facts, a scoring version, and a published score snapshot.",
    valuesMessage,
  };
}

export function getToiletPaperEvidenceDimensions(
  product: ShoppingProduct,
  placesToBuy: PlaceToBuy[] = [],
) {
  const hasReviewedPlace =
    placesToBuy.length > 0 &&
    placesToBuy.some((place) => place.source_review_status === "approved");
  const hasPrice = placesToBuy.some((place) => place.price_cents !== null);

  return [
    {
      label: "Softness/comfort claim",
      status: "Not reviewed",
      detail:
        "Comfort claims are not reviewed yet. Mishava does not make medical suitability claims.",
    },
    {
      label: "Fragrance/free-from claim",
      status: "Not reviewed",
      detail:
        "Fragrance, dye, lotion, or similar sensitive-use claims are not reviewed unless a source-backed claim is recorded.",
    },
    {
      label: "Recycled content",
      status: product.recycled_content_claim ? "Source recorded" : "Missing",
      detail: product.recycled_content_claim ?? "No reviewed recycled-content claim is recorded.",
    },
    {
      label: "Post-consumer recycled content",
      status: product.post_consumer_recycled_content_claim
        ? "Source recorded"
        : "Missing",
      detail:
        product.post_consumer_recycled_content_claim ??
        "No reviewed post-consumer recycled-content claim is recorded.",
    },
    {
      label: "Bamboo/tree-free/FSC claim",
      status: product.bamboo_fsc_claim ? "Source recorded" : "Missing",
      detail: product.bamboo_fsc_claim ?? "No reviewed bamboo, tree-free, or FSC claim is recorded.",
    },
    {
      label: "Virgin fiber reliance",
      status: product.virgin_fiber_claim ? "Source recorded" : "Not reviewed",
      detail: product.virgin_fiber_claim ?? "Virgin-fiber reliance has not been reviewed.",
    },
    {
      label: "Bleaching/process claims",
      status: product.bleaching_process_claim ? "Source recorded" : "Not reviewed",
      detail: product.bleaching_process_claim ?? "Bleaching/process claims have not been reviewed.",
    },
    {
      label: "Packaging claims",
      status: product.packaging_claim ? "Source recorded" : "Not reviewed",
      detail: product.packaging_claim ?? "Packaging claims have not been reviewed.",
    },
    {
      label: "Brand/manufacturer/supplier transparency",
      status: hasSupplierEvidenceGap(product) ? "Missing" : "Reviewed",
      detail: getSupplierTransparencyLabels(product).join(" | "),
    },
    {
      label: "Retailer/source freshness",
      status: product.source_captured_at ? "Reviewed" : "Missing",
      detail: `${product.source_name ?? "Source"} - ${formatFreshness(product.source_captured_at)}`,
    },
    {
      label: "Price/value",
      status: hasPrice ? "Source recorded" : hasReviewedPlace ? "Not reviewed" : "Missing",
      detail: hasPrice
        ? "At least one reviewed place-to-buy row includes price."
        : hasReviewedPlace
          ? "Place-to-buy source exists, but price/value is not safely verified."
          : "No reviewed place-to-buy source is available.",
    },
    {
      label: "Third-party scorecard/reference",
      status: product.external_evidence_reference_url
        ? "External reference only"
        : "Not applicable",
      detail: product.external_evidence_reference_url
        ? "Recorded as evidence context only. It is not copied as a Mishava Score."
        : "No outside evidence reference is recorded.",
    },
  ] satisfies ToiletPaperEvidenceDimension[];
}

export function getToiletPaperPreview(product: ShoppingProduct): ToiletPaperPreview {
  const hasEvidenceScore = hasPublishedEvidenceScore(product);
  const scoreReady = product.mishava_evidence_review_status === "score_ready";

  return {
    evidenceLabel: hasEvidenceScore
      ? "Evidence review preview"
      : "Mishava is still reviewing this product",
    valuesLabel:
      hasEvidenceScore && scoreReady
        ? "Personal match preview"
        : "Personal match is not ready yet",
    confidenceLabel: scoreReady
      ? "Mishava review not finalized"
      : "Evidence profile incomplete",
    disclaimer:
      "This is not medical advice. Mishava does not guarantee that a product is safe or suitable for any medical condition.",
    summary:
      "Mishava is showing reviewed evidence, source context, and evidence gaps. Final scores stay pending until reviewed claims, a supported scoring version, and a published score snapshot exist.",
  };
}

export function getShoppingCategoryResearchTemplate(category: string) {
  return shoppingCategoryResearchTemplates[category] ?? null;
}

export function getShoppingResearchReadiness(product: ShoppingProduct) {
  const template = product.product_subcategory
    ? getShoppingCategoryResearchTemplate(product.product_subcategory)
    : null;
  const missing = [
    !product.retailer_name ? "retailer/source identity" : null,
    !product.brand_display_name ? "consumer-facing brand" : null,
    isLowConfidence(product.manufacturer_confidence)
      ? "verified or likely manufacturer evidence"
      : null,
    isLowConfidence(product.supplier_confidence)
      ? "verified or likely supplier evidence"
      : null,
    product.product_subcategory === "toilet-paper" && !product.virgin_fiber_claim
      ? "virgin forest fiber review"
      : null,
    product.product_subcategory === "toilet-paper" && !product.bleaching_process_claim
      ? "bleaching/process review"
      : null,
    product.product_subcategory === "toilet-paper" && !product.packaging_claim
      ? "packaging review"
      : null,
  ].filter((item): item is string => Boolean(item));

  return {
    template,
    status: missing.length === 0 ? "human_review_needed" : "evidence_gap",
    missing,
    sourceHierarchy: shoppingSourceHierarchy,
  } satisfies {
    template: ShoppingCategoryResearchTemplate | null;
    status: Extract<ShoppingResearchTaskStatus, "human_review_needed" | "evidence_gap">;
    missing: string[];
    sourceHierarchy: typeof shoppingSourceHierarchy;
  };
}

export function getSupplierTransparencyLabels(product: ShoppingProduct) {
  const labels = [
    product.retailer_name ? `Retailer/source: ${product.retailer_name}` : null,
    product.brand_display_name ? `Consumer brand: ${product.brand_display_name}` : null,
    product.private_label_owner
      ? `Private-label owner: ${product.private_label_owner}`
      : null,
    product.parent_company ? `Parent company: ${product.parent_company}` : null,
    product.manufacturer_name
      ? `Manufacturer: ${product.manufacturer_name} (${product.manufacturer_confidence})`
      : `Manufacturer not verified (${product.manufacturer_confidence})`,
    product.supplier_name
      ? `Supplier: ${product.supplier_name} (${product.supplier_confidence})`
      : `Supplier not verified (${product.supplier_confidence})`,
    product.supplier_role ? `Supplier role: ${product.supplier_role}` : null,
    product.supplier_region ? `Supplier region: ${product.supplier_region}` : null,
    product.evidence_gap_notes ? `Evidence gap: ${product.evidence_gap_notes}` : null,
  ];

  return labels.filter((item): item is string => Boolean(item));
}

export function hasSupplierEvidenceGap(product: ShoppingProduct) {
  return (
    isLowConfidence(product.manufacturer_confidence) ||
    isLowConfidence(product.supplier_confidence)
  );
}

export function getEvidenceReadinessLabels(product: ShoppingProduct) {
  return [
    product.mishava_evidence_review_status === "external_evidence_available"
      ? "Outside source found"
      : null,
    product.mishava_evidence_review_status === "draft_claims"
      ? "Draft trust context"
      : null,
    product.recycled_content_claim
      ? `Recycled content: ${product.recycled_content_claim}`
      : null,
    product.post_consumer_recycled_content_claim
      ? `Post-consumer recycled content: ${product.post_consumer_recycled_content_claim}`
      : null,
    product.bamboo_fsc_claim ? `Bamboo/FSC claim: ${product.bamboo_fsc_claim}` : null,
    product.virgin_fiber_claim
      ? `Virgin fiber review: ${product.virgin_fiber_claim}`
      : null,
    product.bleaching_process_claim
      ? `Bleaching/process review: ${product.bleaching_process_claim}`
      : null,
    product.packaging_claim ? `Packaging review: ${product.packaging_claim}` : null,
    product.external_evidence_reference_url
      ? "Outside scorecard/reference recorded as evidence only, not a Mishava Score"
      : null,
    product.mishava_evidence_review_status !== "score_ready"
      ? "Mishava review not finalized"
      : null,
  ].filter((item): item is string => Boolean(item));
}

function isLowConfidence(value: SupplierConfidence) {
  return value === "unknown" || value === "unverified";
}

export function getYourValuesScoreState({
  product,
  priorityProfile,
}: {
  product: ShoppingProduct;
  priorityProfile: ShoppingPriorityProfile | null;
}): YourValuesScoreState {
  if (!priorityProfile?.personalization_enabled || priorityProfile.answered_count < 12) {
    return "complete_priorities";
  }

  if (!hasPublishedEvidenceScore(product)) {
    return "more_evidence_needed";
  }

  return "your_values_score_pending";
}

export function getYourValuesScoreMessage(state: YourValuesScoreState) {
  switch (state) {
    case "complete_priorities":
      return "Tell Mishava what matters to you to see personal fit later, when enough evidence exists.";
    case "more_evidence_needed":
      return "More evidence is needed before Mishava can show personal fit.";
    case "your_values_score_pending":
      return "Personal fit is pending until the calculation is enabled.";
    case "evidence_score_only":
      return "Evidence Score only.";
  }
}

export function sanitizeRedLineMode(value: FormDataEntryValue | null): RedLineMode {
  return value === "hide" || value === "warn" ? value : "off";
}

export function sortShoppingProducts(products: ShoppingProduct[], sort: string) {
  const sorted = [...products];

  if (sort === "price" || sort === "distance") {
    return sorted.sort((left, right) => left.name.localeCompare(right.name));
  }

  return sorted.sort((left, right) => {
    const leftScore = hasPublishedEvidenceScore(left) ? Number(left.evidence_score) : -1;
    const rightScore = hasPublishedEvidenceScore(right) ? Number(right.evidence_score) : -1;

    if (rightScore !== leftScore) return rightScore - leftScore;

    return left.name.localeCompare(right.name);
  });
}

export function sortPlacesToBuy(places: PlaceToBuy[]) {
  return [...places].sort((left, right) => {
    const leftAvailability = availabilityRank(left.availability_status);
    const rightAvailability = availabilityRank(right.availability_status);

    if (rightAvailability !== leftAvailability) {
      return rightAvailability - leftAvailability;
    }

    const leftPrice = left.price_cents ?? Number.MAX_SAFE_INTEGER;
    const rightPrice = right.price_cents ?? Number.MAX_SAFE_INTEGER;

    if (leftPrice !== rightPrice) return leftPrice - rightPrice;

    return left.seller_name.localeCompare(right.seller_name);
  });
}

export function formatPrice(place: PlaceToBuy) {
  if (place.price_cents === null || !place.currency) return "Price not listed";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: place.currency,
  }).format(place.price_cents / 100);
}

export function formatFreshness(value: string | null) {
  if (!value) return "Freshness not listed";

  return `Checked ${new Date(value).toLocaleDateString()}`;
}

function availabilityRank(value: string | null) {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.includes("in stock") || normalized.includes("available")) return 3;
  if (normalized.includes("limited")) return 2;
  if (normalized.includes("unknown") || !normalized) return 1;

  return 0;
}

function normalizeCategory(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isProductInCategory(product: ShoppingProduct, category: string) {
  const normalizedCategory = normalizeCategory(product.category);
  const normalizedSubcategory = product.product_subcategory
    ? normalizeCategory(product.product_subcategory)
    : null;

  if (category === "baby-products") {
    return (
      normalizedCategory === "baby-products" ||
      normalizedSubcategory === "diapers" ||
      normalizedSubcategory === "wipes"
    );
  }

  return normalizedCategory === category || normalizedSubcategory === category;
}

export const shoppingPriorityQuestions = [
  {
    id: "living_wages",
    label: "Living wages and fair pay",
    pillar: "labor",
  },
  {
    id: "worker_safety",
    label: "Safe work and health protections",
    pillar: "labor",
  },
  {
    id: "gender_fairness",
    label: "Equal pay and opportunity for all people",
    pillar: "labor",
  },
  {
    id: "clean_water",
    label: "Clean water and responsible wastewater",
    pillar: "environment",
  },
  {
    id: "climate",
    label: "Climate and emissions reduction",
    pillar: "environment",
  },
  {
    id: "repairability",
    label: "Durable, repairable, lower-waste products",
    pillar: "environment",
  },
  {
    id: "local_business",
    label: "Local businesses and local production",
    pillar: "community",
  },
  {
    id: "community_benefit",
    label: "Community benefit and responsible local impact",
    pillar: "community",
  },
  {
    id: "transparency",
    label: "Transparency and honesty in claims",
    pillar: "governance",
  },
  {
    id: "anti_corruption",
    label: "Anti-corruption and accountable leadership",
    pillar: "governance",
  },
  {
    id: "responsible_politics",
    label: "Balanced or limited political giving",
    pillar: "governance",
  },
  {
    id: "price_flexibility",
    label: "Willingness to pay more when evidence supports values",
    pillar: "preference",
  },
];

export const automaticZeroQuestions = [
  "Documented child labor with no proven correction",
  "Documented forced labor with no proven correction",
  "Severe worker harm or unsafe conditions with no proven correction",
  "Major environmental harm with no proven correction",
  "Fiscal support for political violence, dehumanization, or removal of basic rights",
];
