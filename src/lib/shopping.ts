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
  product_url: string | null;
  image_url: string | null;
  evidence_score: number | null;
  score_label: string | null;
  evidence_coverage: "Low" | "Medium" | "High" | null;
  evidence_recency: "Fresh" | "Recent" | "Stale" | null;
  verification_confidence: "low" | "medium" | "high" | null;
  score_snapshot_id: string | null;
  score_published_at: string | null;
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
};

export type ShoppingPriorityProfile = {
  user_id: string;
  answers: Record<string, unknown>;
  answered_count: number;
  personalization_enabled: boolean;
};

export async function getShoppingProducts({
  query,
}: {
  query?: string;
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
    "id,slug,name,brand_name,category,product_url,image_url,evidence_score,score_label,evidence_coverage,evidence_recency,verification_confidence,score_snapshot_id,score_published_at,active",
  );

  const normalizedQuery = query?.trim().toLowerCase();
  const products = normalizedQuery
    ? rows.filter((product) =>
        [product.name, product.brand_name, product.category]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery)),
      )
    : rows;

  return {
    products,
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
    "id,slug,name,brand_name,category,product_url,image_url,evidence_score,score_label,evidence_coverage,evidence_recency,verification_confidence,score_snapshot_id,score_published_at,active",
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
    "id,product_id,seller_name,seller_type,url,price_cents,currency,availability_status,fulfillment_notes,local_pickup,local_delivery,last_checked_at",
  );

  return {
    product,
    placesToBuy,
    configured: true,
  };
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

