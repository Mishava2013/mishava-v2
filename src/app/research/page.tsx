import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function ResearchPage() {
  return (
    <ComingSoonSurface
      eyebrow="Research"
      title="Research evidence access is coming soon."
      description="This URL is reserved for future evidence, methodology, corrections, and transparency workflows for researchers. Shared access must protect raw evidence, private organizations, and correction rights."
      status="Researcher access, data-use workflows, and expanded evidence review tools are not live yet."
      links={[
        { href: "/methodology", label: "Methodology" },
        { href: "/legal/corrections", label: "Corrections" },
        { href: "/support", label: "Support" },
      ]}
    />
  );
}
