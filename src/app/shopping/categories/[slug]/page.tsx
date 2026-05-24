import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = slug.replaceAll("-", " ");
  const isBabyPoc = ["baby-products", "diapers", "wipes"].includes(slug);

  return (
    <>
      <PageHeader eyebrow="Shopping category" title={label}>
        {isBabyPoc
          ? "This is part of the baby products proof of concept. Products appear only after real source records are approved."
          : "Category pages will map product types to evidence needs, shopping filters, local availability, and score explanation. Scores remain unavailable until real evidence exists for each product or business."}
      </PageHeader>
      {isBabyPoc ? (
        <EmptyState title="Baby products POC uses real records only">
          Mishava will not create placeholder diapers, wipes, places to buy, or
          score values. Add reviewed real product records before this shelf
          appears live.
        </EmptyState>
      ) : null}
    </>
  );
}
