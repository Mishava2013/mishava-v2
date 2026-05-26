import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import type { SupabaseServerClient } from "./supabase/server";

export type NgoPlanKey =
  | "free"
  | "grassroots"
  | "growth"
  | "trust_pro"
  | "network_custom";

export type NgoDatabaseTier =
  | "free_ngo"
  | "grassroots"
  | "growth"
  | "trust_pro"
  | "network";

export type NgoBillingStatus =
  | "free"
  | "test_mode_placeholder"
  | "checkout_pending"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "unpaid"
  | "manual_custom"
  | "custom"
  | "sponsored";

export type NgoBillingInterval = "monthly" | "annual" | "custom" | "none";

export type NgoEntitlementCheck =
  | "evidence_item_create"
  | "evidence_file_upload"
  | "report_create"
  | "share_grant_create"
  | "team_member_invite"
  | "report_export_generate"
  | "ai_report_assist";

export type NgoEntitlementLimits = {
  evidenceItems: number | null;
  activePrivateFiles: number | null;
  storageBytes: number | null;
  reports: number | null;
  activeShareGrants: number | null;
  teamMembers: number | null;
  reportTemplates: "basic" | "basic_funder" | "advanced" | "custom";
  printFriendlyReports: boolean;
  futureExports: "none" | "limited" | "included" | "advanced" | "custom";
  aiReportAssist: "none" | "limited_paid_credits" | "paid_credits" | "quota" | "custom";
};

export type NgoPlanDefinition = {
  key: NgoPlanKey;
  databaseTier: NgoDatabaseTier;
  name: string;
  monthlyPriceCents: number | null;
  annualPriceCents: number | null;
  priceLabel: string;
  setupRecommendation: string;
  displayCopy: string;
  recommended: boolean;
  customPricing: boolean;
  selfServeAllowed: boolean;
  entitlements: NgoEntitlementLimits;
};

export type NgoSetupOption = {
  key:
    | "self_serve_setup"
    | "basic_assisted_setup"
    | "guided_evidence_setup"
    | "full_trust_profile_buildout"
    | "network_setup";
  name: string;
  priceLabel: string;
  priceCents: number | null;
  notes: string;
  customPricing: boolean;
};

export type NgoUsage = {
  evidenceItems: number;
  activePrivateFiles: number;
  storageBytes: number;
  reports: number;
  activeShareGrants: number;
  teamMembers: number;
};

export type NgoBillingWorkspace = {
  organizationId: string;
  plan: NgoPlanDefinition;
  databaseTier: NgoDatabaseTier;
  billingStatus: NgoBillingStatus;
  billingInterval: NgoBillingInterval;
  usage: NgoUsage;
  stripeStatus: "none" | "test_mode_configured" | "live_key_blocked";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  setupServiceStatus?: string | null;
  noPaidTrustOutcomeMessage: string;
};

type NgoProfileBillingRow = Record<string, unknown> & {
  id: string;
  organization_id: string;
  tier: NgoDatabaseTier;
  updated_at: string;
};

type NgoBillingAccountRow = Record<string, unknown> & {
  id: string;
  organization_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_key: NgoPlanKey;
  billing_status: NgoBillingStatus;
  billing_interval: NgoBillingInterval;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  setup_service_status: string | null;
};

type EvidenceRow = Record<string, unknown> & {
  id: string;
  lifecycle_status?: string | null;
};

type EvidenceFileRow = Record<string, unknown> & {
  id: string;
  file_size_bytes: number;
  status: string;
};

type ReportRow = Record<string, unknown> & {
  id: string;
  approval_status: string;
};

type ShareGrantRow = Record<string, unknown> & {
  id: string;
  status: string;
  revoked_at: string | null;
  expires_at: string | null;
};

type MembershipRow = Record<string, unknown> & {
  id: string;
  status?: string | null;
};

const mb = 1024 * 1024;
const gb = 1024 * mb;

export const noPaidTrustOutcomeMessage =
  "Payment unlocks workflow capacity, support, setup services, and reporting tools. Payment does not affect Mishava trust scores, rankings, verification outcomes, evidence truth, or public trust display.";

export const ngoPlanDefinitions: NgoPlanDefinition[] = [
  {
    key: "free",
    databaseTier: "free_ngo",
    name: "Free NGO Profile",
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    priceLabel: "$0/month",
    setupRecommendation: "$0 self-serve setup",
    displayCopy:
      "Basic self-serve NGO profile with limited manual evidence and report capacity.",
    recommended: false,
    customPricing: false,
    selfServeAllowed: true,
    entitlements: {
      evidenceItems: 25,
      activePrivateFiles: 10,
      storageBytes: 100 * mb,
      reports: 3,
      activeShareGrants: 1,
      teamMembers: 1,
      reportTemplates: "basic",
      printFriendlyReports: true,
      futureExports: "none",
      aiReportAssist: "none",
    },
  },
  {
    key: "grassroots",
    databaseTier: "grassroots",
    name: "Grassroots",
    monthlyPriceCents: 1900,
    annualPriceCents: 19000,
    priceLabel: "$19/month or $190/year",
    setupRecommendation: "$0 self-serve setup",
    displayCopy:
      "Low-cost access for small NGOs that need more evidence and report capacity.",
    recommended: false,
    customPricing: false,
    selfServeAllowed: true,
    entitlements: {
      evidenceItems: 100,
      activePrivateFiles: 50,
      storageBytes: gb,
      reports: 15,
      activeShareGrants: 5,
      teamMembers: 3,
      reportTemplates: "basic",
      printFriendlyReports: true,
      futureExports: "limited",
      aiReportAssist: "limited_paid_credits",
    },
  },
  {
    key: "growth",
    databaseTier: "growth",
    name: "Growth",
    monthlyPriceCents: 5900,
    annualPriceCents: 59000,
    priceLabel: "$59/month or $590/year",
    setupRecommendation: "$0 self-serve or paid setup",
    displayCopy:
      "Main paid NGO plan for funder reporting, scoped sharing, and practical evidence workflows.",
    recommended: true,
    customPricing: false,
    selfServeAllowed: true,
    entitlements: {
      evidenceItems: 500,
      activePrivateFiles: 250,
      storageBytes: 10 * gb,
      reports: 75,
      activeShareGrants: 25,
      teamMembers: 10,
      reportTemplates: "basic_funder",
      printFriendlyReports: true,
      futureExports: "included",
      aiReportAssist: "paid_credits",
    },
  },
  {
    key: "trust_pro",
    databaseTier: "trust_pro",
    name: "Trust Pro",
    monthlyPriceCents: 12900,
    annualPriceCents: 129000,
    priceLabel: "$129/month or $1,290/year",
    setupRecommendation: "Paid setup recommended",
    displayCopy:
      "Deeper reporting, stronger evidence workflow, more team capacity, and setup support.",
    recommended: false,
    customPricing: false,
    selfServeAllowed: true,
    entitlements: {
      evidenceItems: 2000,
      activePrivateFiles: 1000,
      storageBytes: 50 * gb,
      reports: 250,
      activeShareGrants: 100,
      teamMembers: 25,
      reportTemplates: "advanced",
      printFriendlyReports: true,
      futureExports: "advanced",
      aiReportAssist: "quota",
    },
  },
  {
    key: "network_custom",
    databaseTier: "network",
    name: "Network / Foundation / Association",
    monthlyPriceCents: null,
    annualPriceCents: null,
    priceLabel: "Custom",
    setupRecommendation: "Custom setup",
    displayCopy:
      "Multi-organization programs, sponsored seats, portfolio reporting, and custom setup.",
    recommended: false,
    customPricing: true,
    selfServeAllowed: false,
    entitlements: {
      evidenceItems: null,
      activePrivateFiles: null,
      storageBytes: null,
      reports: null,
      activeShareGrants: null,
      teamMembers: null,
      reportTemplates: "custom",
      printFriendlyReports: true,
      futureExports: "custom",
      aiReportAssist: "custom",
    },
  },
];

export const ngoSetupOptions: NgoSetupOption[] = [
  {
    key: "self_serve_setup",
    name: "Self-Serve Setup",
    priceLabel: "$0",
    priceCents: 0,
    notes: "NGO enters its own information.",
    customPricing: false,
  },
  {
    key: "basic_assisted_setup",
    name: "Basic Assisted Setup",
    priceLabel: "$99",
    priceCents: 9900,
    notes: "Light help getting started.",
    customPricing: false,
  },
  {
    key: "guided_evidence_setup",
    name: "Guided Evidence Setup",
    priceLabel: "$249",
    priceCents: 24900,
    notes: "Help organizing evidence.",
    customPricing: false,
  },
  {
    key: "full_trust_profile_buildout",
    name: "Full Trust Profile Buildout",
    priceLabel: "$499+",
    priceCents: 49900,
    notes: "More hands-on buildout.",
    customPricing: false,
  },
  {
    key: "network_setup",
    name: "Network Setup",
    priceLabel: "Custom",
    priceCents: null,
    notes: "For foundations, associations, denominations, or multi-NGO programs.",
    customPricing: true,
  },
];

export function planFromDatabaseTier(tier?: string | null) {
  return (
    ngoPlanDefinitions.find((plan) => plan.databaseTier === tier) ??
    ngoPlanDefinitions[0]
  );
}

export function planFromKey(planKey?: string | null) {
  return (
    ngoPlanDefinitions.find((plan) => plan.key === planKey) ??
    ngoPlanDefinitions[0]
  );
}

export function getStripeTestModeStatus() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return "none" as const;
  return key.startsWith("sk_test_")
    ? ("test_mode_configured" as const)
    : ("live_key_blocked" as const);
}

export async function getNgoBillingWorkspace({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}): Promise<NgoBillingWorkspace> {
  const profile = await client.selectOne<NgoProfileBillingRow>(
    "ngo_profiles",
    { organization_id: organizationId },
    "id,organization_id,tier,updated_at",
  );
  const billingAccount = await getNgoBillingAccount({ client, organizationId });
  const plan = billingAccount
    ? planFromKey(billingAccount.plan_key)
    : planFromDatabaseTier(profile?.tier);
  const usage = await getNgoUsage({ client, organizationId });

  return {
    organizationId,
    plan,
    databaseTier: plan.databaseTier,
    billingStatus:
      billingAccount?.billing_status ??
      (plan.key === "free" ? "free" : "test_mode_placeholder"),
    billingInterval:
      billingAccount?.billing_interval ??
      (plan.key === "network_custom" ? "custom" : "none"),
    usage,
    stripeStatus: getStripeTestModeStatus(),
    stripeCustomerId: billingAccount?.stripe_customer_id ?? null,
    stripeSubscriptionId: billingAccount?.stripe_subscription_id ?? null,
    currentPeriodEnd: billingAccount?.current_period_end ?? null,
    cancelAtPeriodEnd: billingAccount?.cancel_at_period_end ?? false,
    setupServiceStatus: billingAccount?.setup_service_status ?? null,
    noPaidTrustOutcomeMessage,
  };
}

export async function getNgoBillingAccount({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}) {
  try {
    return await client.selectOne<NgoBillingAccountRow>(
      "ngo_billing_accounts",
      { organization_id: organizationId },
      "id,organization_id,stripe_customer_id,stripe_subscription_id,plan_key,billing_status,billing_interval,current_period_end,cancel_at_period_end,setup_service_status",
    );
  } catch {
    return null;
  }
}

export async function getNgoUsage({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}): Promise<NgoUsage> {
  const [evidence, files, reports, shareGrants, memberships] = await Promise.all([
    client.selectMany<EvidenceRow>(
      "evidence_items",
      { organization_id: organizationId },
      "id,lifecycle_status",
    ),
    client.selectMany<EvidenceFileRow>(
      "evidence_files",
      { organization_id: organizationId },
      "id,file_size_bytes,status",
    ),
    client.selectMany<ReportRow>(
      "ngo_reports",
      { organization_id: organizationId },
      "id,approval_status",
    ),
    client.selectMany<ShareGrantRow>(
      "ngo_share_grants",
      { organization_id: organizationId },
      "id,status,revoked_at,expires_at",
    ),
    client.selectMany<MembershipRow>(
      "organization_memberships",
      { organization_id: organizationId },
      "id,status",
    ),
  ]);

  const activeFiles = files.filter((file) => file.status === "active");

  return {
    evidenceItems: evidence.filter((item) => item.lifecycle_status !== "archived").length,
    activePrivateFiles: activeFiles.length,
    storageBytes: activeFiles.reduce(
      (total, file) => total + (Number(file.file_size_bytes) || 0),
      0,
    ),
    reports: reports.filter((report) => report.approval_status !== "archived").length,
    activeShareGrants: shareGrants.filter(isActiveShareGrant).length,
    teamMembers: memberships.filter(
      (membership) => !membership.status || membership.status === "active",
    ).length,
  };
}

export async function checkNgoEntitlement({
  client,
  check,
  organizationId,
}: {
  client: SupabaseServerClient;
  check: NgoEntitlementCheck;
  organizationId: string;
}) {
  const workspace = await getNgoBillingWorkspace({ client, organizationId });
  const limit = getLimitForCheck(workspace.plan.entitlements, check);
  const usage = getUsageForCheck(workspace.usage, check);
  const allowed = limit === null || usage < limit;

  return {
    allowed,
    check,
    limit,
    usage,
    plan: workspace.plan,
    message: allowed
      ? "Entitlement available."
      : buildLimitMessage({
          check,
          limit,
          planName: workspace.plan.name,
          usage,
        }),
  };
}

export async function enforceNgoEntitlement({
  client,
  check,
  incomingFileSizeBytes = 0,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  check: NgoEntitlementCheck;
  incomingFileSizeBytes?: number;
  organizationId: string;
  session: AuthSession;
}) {
  void incomingFileSizeBytes;
  const result = await checkNgoEntitlement({
    client,
    check,
    organizationId,
  });

  if (!result.allowed) {
    await client.insert(
      "audit_events",
      buildAuditEvent({
        actorUserId: session.user.id,
        organizationId,
        action: "ngo_entitlement.limit_reached",
        subjectTable: "ngo_profiles",
        reason: result.message,
        afterData: {
          check,
          plan_key: result.plan.key,
          billing_status:
            result.plan.key === "free" ? "free" : "checkout_pending",
          usage: result.usage,
          limit: result.limit,
        },
      }),
    );
  }

  return result;
}

export function formatLimit(limit: number | null, unit = "") {
  if (limit === null) return "Custom";
  return `${limit.toLocaleString()}${unit}`;
}

export function formatBytes(value: number | null) {
  if (value === null) return "Custom";
  if (value >= gb) return `${Math.round(value / gb)} GB`;
  if (value >= mb) return `${Math.round(value / mb)} MB`;
  return `${value} bytes`;
}

function getLimitForCheck(
  limits: NgoEntitlementLimits,
  check: NgoEntitlementCheck,
) {
  switch (check) {
    case "evidence_item_create":
      return limits.evidenceItems;
    case "evidence_file_upload":
      return limits.activePrivateFiles;
    case "report_create":
      return limits.reports;
    case "share_grant_create":
      return limits.activeShareGrants;
    case "team_member_invite":
      return limits.teamMembers;
    case "report_export_generate":
      return limits.futureExports === "none" ? 0 : null;
    case "ai_report_assist":
      return limits.aiReportAssist === "none" ? 0 : null;
  }
}

function getUsageForCheck(
  usage: NgoUsage,
  check: NgoEntitlementCheck,
) {
  switch (check) {
    case "evidence_item_create":
      return usage.evidenceItems;
    case "evidence_file_upload":
      return usage.activePrivateFiles;
    case "report_create":
      return usage.reports;
    case "share_grant_create":
      return usage.activeShareGrants;
    case "team_member_invite":
      return usage.teamMembers;
    case "report_export_generate":
    case "ai_report_assist":
      return 0;
  }
}

export async function enforceNgoStorageEntitlement({
  client,
  incomingFileSizeBytes,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  incomingFileSizeBytes: number;
  organizationId: string;
  session: AuthSession;
}) {
  const workspace = await getNgoBillingWorkspace({ client, organizationId });
  const storageLimit = workspace.plan.entitlements.storageBytes;
  const nextStorageUsage = workspace.usage.storageBytes + incomingFileSizeBytes;

  if (storageLimit === null || nextStorageUsage <= storageLimit) {
    return {
      allowed: true,
      limit: storageLimit,
      usage: nextStorageUsage,
      message: "Storage entitlement available.",
      plan: workspace.plan,
    };
  }

  const message = `${workspace.plan.name} storage allowance reached. Upgrade to add more private evidence files. Existing evidence remains readable and no trust outcome changes.`;

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "ngo_entitlement.limit_reached",
      subjectTable: "ngo_profiles",
      reason: message,
      afterData: {
        check: "storage_allowance",
        plan_key: workspace.plan.key,
        usage: nextStorageUsage,
        limit: storageLimit,
      },
    }),
  );

  return {
    allowed: false,
    limit: storageLimit,
    usage: nextStorageUsage,
    message,
    plan: workspace.plan,
  };
}

function buildLimitMessage({
  check,
  limit,
  planName,
  usage,
}: {
  check: NgoEntitlementCheck;
  limit: number | null;
  planName: string;
  usage: number;
}) {
  const label = checkLabel(check);
  return `${planName} ${label} limit reached (${usage}/${limit ?? "custom"}). Upgrade to add more capacity. Existing data remains readable and no trust outcome changes.`;
}

function checkLabel(check: NgoEntitlementCheck) {
  switch (check) {
    case "evidence_item_create":
      return "evidence";
    case "evidence_file_upload":
      return "private file";
    case "report_create":
      return "report";
    case "share_grant_create":
      return "active share grant";
    case "team_member_invite":
      return "team member";
    case "report_export_generate":
      return "export";
    case "ai_report_assist":
      return "AI report assist";
  }
}

function isActiveShareGrant(grant: ShareGrantRow) {
  return (
    grant.status === "active" &&
    !grant.revoked_at &&
    (!grant.expires_at || Date.parse(grant.expires_at) > Date.now())
  );
}
