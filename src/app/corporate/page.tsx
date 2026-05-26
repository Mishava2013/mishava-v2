import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function CorporatePage() {
  return (
    <ComingSoonSurface
      eyebrow="Corporate"
      title="Corporate trust workflows are coming soon."
      description="This URL is reserved for future supplier review, procurement support, internal reporting, and enterprise evidence workflows. It is not a live Corporate portal yet."
      status="Corporate procurement, supplier dashboards, and enterprise reporting are not enabled yet."
      links={[
        { href: "/methodology", label: "Methodology" },
        { href: "/legal/security", label: "Security overview" },
        { href: "/legal/no-paid-trust-outcomes", label: "No paid trust outcomes" },
      ]}
    />
  );
}
