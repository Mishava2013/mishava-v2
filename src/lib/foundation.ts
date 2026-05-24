export type RoleCode =
  | "consumer"
  | "ngo_owner"
  | "ngo_member"
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

export const paymentFirewall = {
  rankingPaymentBoostAllowed: false,
  forbiddenRankingInputs: [
    "payment_status",
    "subscription_tier",
    "hosted_profile_enabled",
    "ad_spend",
    "sponsorship",
    "paid_boost",
    "sales_commission",
  ],
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

