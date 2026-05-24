import { PageHeader } from "@/components/PageHeader";

export default async function NgoProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PageHeader eyebrow="NGO profile" title={slug.replaceAll("-", " ")}>
      Public NGO profiles will show mission context, evidence, reports, source
      links, scoped public summaries, and funder-ready trust records once real
      organization data has been approved.
    </PageHeader>
  );
}

