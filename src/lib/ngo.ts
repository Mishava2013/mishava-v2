import { ngoPlanDefinitions } from "./ngo-billing";

export type NgoTierCode =
  | "free_ngo"
  | "grassroots"
  | "growth"
  | "trust_pro"
  | "network";

export type AiAccessLevel = "none" | "limited" | "included" | "custom";

export const ngoTiers: Array<{
  code: NgoTierCode;
  name: string;
  price: string;
  aiAccess: AiAccessLevel;
  evidenceLimit: string;
  reportAccess: string;
}> = ngoPlanDefinitions.map((plan) => ({
  code: plan.databaseTier,
  name: plan.name,
  price: plan.priceLabel,
  aiAccess:
    plan.entitlements.aiReportAssist === "none"
      ? "none"
      : plan.entitlements.aiReportAssist === "custom"
        ? "custom"
        : plan.key === "grassroots"
          ? "limited"
          : "included",
  evidenceLimit:
    plan.entitlements.evidenceItems === null
      ? "Custom portfolio evidence support"
      : `${plan.entitlements.evidenceItems.toLocaleString()} active evidence items`,
  reportAccess:
    plan.entitlements.futureExports === "none"
      ? "Print-friendly reports only"
      : plan.entitlements.futureExports === "limited"
        ? "Print-friendly reports and limited future exports"
        : plan.entitlements.futureExports === "custom"
          ? "Network dashboards and portfolio exports"
          : "Reports, scoped sharing, and future exports",
}));

export const ngoOnboardingSteps = [
  {
    title: "NGO profile",
    body: "Add your NGO name, country, mission area, and who can see the profile at first.",
  },
  {
    title: "Add proof",
    body: "Add files, photos, links, messages, notes, or other proof when your team is ready.",
  },
  {
    title: "Keep it private",
    body: "Choose what stays inside your organization and what may be safe to share later.",
  },
  {
    title: "Review first",
    body: "A person checks evidence before it supports a packet or report.",
  },
  {
    title: "Share only when ready",
    body: "Share a private packet, pattern report, or public report only when your NGO chooses.",
  },
];

export const ngoReportTemplates = [
  "Private case packet",
  "Evidence packet",
  "Pattern report",
  "Funder evidence packet",
  "Program report",
  "Photo-supported report",
  "Custom report builder",
];

export const evidenceIntakeTypes = [
  "Paystub or timecard",
  "Work schedule",
  "Text message or letter",
  "Photo or worksite photo",
  "Handwritten hours",
  "Complaint form",
  "Witness note",
  "Injury record",
  "Program document",
  "Public link",
];

export const workerRightsIssueCategories = [
  "Unpaid wages",
  "Unpaid overtime",
  "Missed breaks",
  "Stolen tips",
  "Unsafe work",
  "Heat or weather danger",
  "Injury at work",
  "Retaliation",
  "Threats",
  "Harassment",
  "Sexual harassment",
  "Discrimination",
  "Immigration-related threat",
  "Labor contractor problem",
  "Staffing agency problem",
  "Housing tied to work",
  "Transportation tied to work",
  "Other workplace harm",
];

export const workerRightsIndustryTags = [
  "Farm work",
  "Restaurant",
  "Retail",
  "Day labor",
  "Warehouse",
  "Delivery",
  "Garment",
  "Car wash",
  "Construction",
  "Domestic work",
  "Cleaning",
  "Food processing",
  "Other",
];

export const workerRightsActorTypes = [
  "Worker",
  "Employer",
  "Boss or supervisor",
  "Labor contractor",
  "Staffing agency",
  "Worksite",
  "Brand or company connected to the work",
  "Landlord or housing provider tied to work",
  "Transportation provider tied to work",
  "Witness",
  "Government agency",
  "Legal aid partner",
  "Other",
];
