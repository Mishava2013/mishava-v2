import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function GovPage() {
  return (
    <ComingSoonSurface
      eyebrow="Government"
      title="Government and public-sector workflows are coming soon."
      description="This URL is reserved for future public-sector procurement, transparency, accessibility, and evidence-review workflows. Mishava Gov is not live for government use yet."
      status="Government procurement workflows, public-sector access, and formal compliance packages are not enabled yet."
      links={[
        { href: "/legal/accessibility", label: "Accessibility statement" },
        { href: "/legal/security", label: "Security overview" },
        { href: "/methodology", label: "Methodology" },
      ]}
    />
  );
}
