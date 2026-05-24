export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  evidenceScore: number | null;
  coverage: "High" | "Medium" | "Low" | "Pending";
  verification: string;
  availability: string;
};

export const products: Product[] = [
  {
    slug: "diaper-review-placeholder",
    name: "Diaper evidence review placeholder",
    brand: "Real product data required",
    category: "Diapers",
    price: "Pending real source",
    evidenceScore: null,
    coverage: "Pending",
    verification: "No invented score",
    availability: "Real places to buy required",
  },
  {
    slug: "baby-wipes-review-placeholder",
    name: "Baby wipes evidence review placeholder",
    brand: "Real product data required",
    category: "Baby wipes",
    price: "Pending real source",
    evidenceScore: null,
    coverage: "Pending",
    verification: "No invented score",
    availability: "Real places to buy required",
  },
];

export const trustSurfaces = [
  {
    title: "NGO profiles and reporting",
    body: "Evidence intake, scoped funder sharing, report drafts, and transparent organization profiles.",
    href: "/ngo",
  },
  {
    title: "Shopping discovery",
    body: "Google-like search with Target-like browsing, but scores come from evidence and user priorities.",
    href: "/shopping",
  },
  {
    title: "Business and local profiles",
    body: "Claimed records, lightweight verification, hosted pages, catalogs, and small business trust pathways.",
    href: "/business",
  },
  {
    title: "Audit and verification",
    body: "Separated field audit, review, evidence logs, AI assistance, human confirmation, and immutable paper trails.",
    href: "/audit",
  },
];

export const ngoProfiles = [
  {
    slug: "ngo-profile-foundation",
    name: "NGO trust profile foundation",
    status: "Profile shell",
    evidence: "Manual entry and approved uploads first",
  },
];

export const pricingPlans = [
  { surface: "Consumer", plan: "Free Consumer", price: "$0" },
  { surface: "Consumer", plan: "Mishava Plus", price: "$4.99/mo or $49/yr" },
  { surface: "NGO", plan: "Growth", price: "$59/mo or $590/yr" },
  { surface: "Business", plan: "Minimum Supplier/Seller", price: "Market-adjusted" },
];

export const sdgNames = [
  "No poverty",
  "Zero hunger",
  "Good health and well-being",
  "Quality education",
  "Gender equality",
  "Clean water and sanitation",
  "Affordable and clean energy",
  "Decent work and economic growth",
  "Industry, innovation and infrastructure",
  "Reduced inequalities",
  "Sustainable cities and communities",
  "Responsible consumption and production",
  "Climate action",
  "Life below water",
  "Life on land",
  "Peace, justice and strong institutions",
  "Partnerships for the goals",
];
