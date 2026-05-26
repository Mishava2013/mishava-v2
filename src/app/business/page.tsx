import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function BusinessPage() {
  return (
    <ComingSoonSurface
      eyebrow="Business / Local"
      title="Business and local trust tools are coming soon."
      description="This URL is reserved for future business profiles, local seller workflows, evidence setup, and verification support. The page resolves cleanly, but the full Business/local product is not live yet."
      status="Business/local profiles, claim flows, seller catalogs, and local inventory are not enabled yet."
      links={[
        { href: "/shopping", label: "Shopping preview" },
        { href: "/support", label: "Support" },
        { href: "/legal/no-paid-trust-outcomes", label: "No paid trust outcomes" },
      ]}
    />
  );
}
