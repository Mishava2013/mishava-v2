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
      ? "Custom portfolio evidence workflows"
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
    title: "Organization identity",
    body: "Capture legal name, public name, location, website, mission area, registration identifiers, and profile visibility.",
  },
  {
    title: "Evidence intake",
    body: "Accept documents, photos, public links, attestations, and manual data entry with source type and visibility controls.",
  },
  {
    title: "AI parse request",
    body: "Run AI only when the plan or paid setup covers the cost, then convert extracted claims into manager-reviewable drafts.",
  },
  {
    title: "Manager approval",
    body: "Require approval before evidence, AI-drafted claims, reports, or shared views become final.",
  },
  {
    title: "Scoped sharing",
    body: "Let NGOs grant funders, donors, press reviewers, or partners limited access by report, date range, and visibility level.",
  },
];

export const ngoReportTemplates = [
  "Public trust profile summary",
  "Funder evidence packet",
  "Program impact report",
  "Donation transparency report",
  "Photo-supported field report",
  "Custom report builder",
];

export const evidenceIntakeTypes = [
  "Registration or public record",
  "Program document",
  "Photo evidence",
  "Financial or donation summary",
  "Partner or beneficiary reference",
  "Published report or public link",
];
