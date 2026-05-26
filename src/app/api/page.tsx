import { ComingSoonSurface } from "@/components/ComingSoonSurface";

export default function ApiInfoPage() {
  return (
    <ComingSoonSurface
      eyebrow="API"
      title="Public API access is coming soon."
      description="This URL is reserved for future evidence, reporting, procurement, and partner integrations. Existing internal API routes remain protected by their own server-side checks."
      status="Public API keys, integration docs, partner access, and rate-limited API workflows are not live yet."
      links={[
        { href: "/legal/security", label: "Security overview" },
        { href: "/legal/privacy", label: "Privacy" },
        { href: "/support", label: "Support" },
      ]}
    />
  );
}
