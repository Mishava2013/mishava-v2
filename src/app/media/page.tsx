import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function MediaPage() {
  return (
    <ComingSoonSurface
      eyebrow="Media"
      title="Media transparency access is coming soon."
      description="This URL is reserved for future media-facing methodology, evidence context, corrections, and transparency workflows. It is not a live media portal yet."
      status="Media inquiry workflows, press resources, and scoped evidence access are not enabled yet."
      links={[
        { href: "/methodology", label: "Methodology" },
        { href: "/legal/corrections", label: "Corrections" },
        { href: "/support", label: "Support" },
      ]}
    />
  );
}
