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
    | "Draft trust context"
    | "Score pending"
    | "Your Values Score unavailable"
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

export const shoppingPriorityVersionCode = "Shopping_Priorities_V2.01_2026.05.24";
export const shoppingPriorityConsentVersion = "Shopping_Priorities_Privacy_V1_2026.05.24";

const shoppingProductColumns =
  "id,slug,name,brand_name,category,product_subcategory,product_summary,package_details,product_url,image_url,image_alt_text,image_source_url,image_source_type,image_review_status,image_last_reviewed_at,image_rights_notes,recycled_content_claim,post_consumer_recycled_content_claim,bamboo_fsc_claim,virgin_fiber_claim,bleaching_process_claim,packaging_claim,brand_sourcing_policy_url,external_evidence_reference_url,external_evidence_reference_notes,mishava_evidence_review_status,evidence_score,score_label,evidence_coverage,evidence_recency,verification_confidence,score_snapshot_id,score_published_at,source_name,source_url,source_captured_at,source_review_status,data_origin,active";

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
        ? "Product image rejected during rights review"
        : product.image_review_status === "stale"
          ? "Product image rights need review"
          : product.image_review_status === "pending_review"
            ? "Product image pending rights review"
            : "Product image not available yet",
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

  if (!product.evidence_coverage) missing.push("reviewed evidence coverage");
  if (!product.evidence_recency) missing.push("published evidence recency");
  if (!product.verification_confidence) missing.push("verification confidence");
  if (!product.score_snapshot_id) missing.push("published score snapshot");
  if (!product.score_published_at) missing.push("snapshot publication date");
  if (product.evidence_score === null) missing.push("evidence-backed score value");
  if (
    product.product_subcategory === "toilet-paper" &&
    product.mishava_evidence_review_status !== "score_ready"
  ) {
    missing.push("toilet paper scoring version");
    missing.push("Mishava-reviewed tissue sourcing claims");
  }

  return {
    label: hasEvidenceScore
      ? "Evidence Score"
      : hasDraftContext
        ? "Draft trust context"
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
      ...evidenceReadiness,
    ].filter((item): item is string => Boolean(item)),
    missing,
    why: hasEvidenceScore
      ? "This Evidence Score is backed by a published score snapshot."
      : hasDraftContext
        ? "Mishava has draft trust context, but it is not a public score."
        : product.product_subcategory === "toilet-paper"
          ? "Toilet paper evidence is recorded as source context only. A public Mishava score needs reviewed tissue claims, a supported scoring version, and a published score snapshot."
        : "A public score needs reviewed evidence, accepted scoring facts, a scoring version, and a published score snapshot.",
    valuesMessage,
  };
}

export function getEvidenceReadinessLabels(product: ShoppingProduct) {
  return [
    product.mishava_evidence_review_status === "external_evidence_available"
      ? "External evidence available"
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
      return "Complete Shopping Priorities to see Your Values Score when enough evidence exists.";
    case "more_evidence_needed":
      return "More evidence needed before Your Values Score can be shown.";
    case "your_values_score_pending":
      return "Your Values Score pending until the personal fit calculation is enabled.";
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
