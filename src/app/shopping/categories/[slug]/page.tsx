import { PageHeader } from "@/components/PageHeader";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = slug.replaceAll("-", " ");

  return (
    <PageHeader eyebrow="Shopping category" title={label}>
      Category pages will map product types to evidence needs, shopping filters,
      local availability, and score explanation. Scores remain unavailable until
      real evidence exists for each product or business.
    </PageHeader>
  );
}

