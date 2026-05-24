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
}> = [
  {
    code: "free_ngo",
    name: "Free NGO Profile",
    price: "$0",
    aiAccess: "none",
    evidenceLimit: "Limited uploads and manual entry",
    reportAccess: "Premade public profile report only",
  },
  {
    code: "grassroots",
    name: "Grassroots",
    price: "$19/mo or $190/yr",
    aiAccess: "limited",
    evidenceLimit: "More uploads and basic evidence organization",
    reportAccess: "Premade reports and limited exports",
  },
  {
    code: "growth",
    name: "Growth",
    price: "$59/mo or $590/yr",
    aiAccess: "included",
    evidenceLimit: "Expanded evidence intake and review queues",
    reportAccess: "Custom reports, funder sharing, approval workflow",
  },
  {
    code: "trust_pro",
    name: "Trust Pro",
    price: "$129/mo or $1,290/yr",
    aiAccess: "included",
    evidenceLimit: "Advanced evidence workflow and stronger reporting",
    reportAccess: "Deeper reports, exports, reviewer notes",
  },
  {
    code: "network",
    name: "Network / Foundation / Association",
    price: "Custom",
    aiAccess: "custom",
    evidenceLimit: "Portfolio evidence and sponsored participant workflows",
    reportAccess: "Network dashboards and portfolio exports",
  },
];

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

