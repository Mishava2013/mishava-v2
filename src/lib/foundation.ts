export type RoleCode =
  | "consumer"
  | "ngo_owner"
  | "ngo_admin"
  | "ngo_member"
  | "ngo_viewer"
  | "business_owner"
  | "business_member"
  | "auditor_field"
  | "audit_reviewer"
  | "mishava_admin"
  | "methodology_owner"
  | "support"
  | "press_reviewer"
  | "sponsor_manager";

export type VisibilityLevel =
  | "private"
  | "organization_shared"
  | "approved_viewer"
  | "public_summary"
  | "public_full_record";

export const allowedRankingInputs = [
  "search_match",
  "evidence_score",
  "user_preference_match",
  "evidence_coverage",
  "evidence_recency",
  "verification_confidence",
  "category_fit",
  "local_distance_availability",
] as const;

export const forbiddenTrustInfluenceInputs = [
  "payment_status",
  "subscription_tier",
  "hosted_profile_enabled",
  "claimed_profile_status",
  "sponsorship_status",
  "ad_spend",
  "paid_boost",
  "sales_commission",
  "affiliate_fee",
  "referral_fee",
] as const;

export const billableInfrastructureSurfaces = [
  "billable_entitlements",
  "profile_tools",
  "hosted_pages",
  "catalogs",
  "reports",
] as const;

export const trustCalculationSurfaces = [
  "score_calculation",
  "ranking_calculation",
  "verification_status",
  "credibility_labels",
] as const;

export const paymentFirewall = {
  rankingPaymentBoostAllowed: false,
  allowedRankingInputs,
  forbiddenRankingInputs: forbiddenTrustInfluenceInputs,
  billableInfrastructureSurfaces,
  trustCalculationSurfaces,
  allowedMonetization: [
    "tools",
    "hosting",
    "catalogs",
    "evidence parsing",
    "verification workflow",
    "audit services",
    "reports",
    "exports",
    "team access",
    "API access",
    "sponsored access",
  ],
};

export const releaseOneObjects = [
  "users",
  "organizations",
  "memberships",
  "roles",
  "audit events",
  "evidence items",
  "claims",
  "score snapshots",
  "reports",
  "pricing records",
  "feature gates",
];
