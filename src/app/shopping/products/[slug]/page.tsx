import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";
import { products } from "@/lib/sample-data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  return (
    <>
      <PageHeader eyebrow="Product profile" title={product?.name ?? "Product profile foundation"}>
        Product pages will show the selected product, business or brand context,
        places to buy, local availability, score detail, evidence, and why the
        product appears. This page will not display invented product data.
      </PageHeader>
      <div className="surface-list">
        <ScoreExplainer />
        <div className="card">
          <h3>Places to buy</h3>
          <p>
            Online retailers, brand websites, local stores, pickup, delivery, and
            shipping options will appear only after real source data is ingested.
          </p>
          <Link className="button" href="/shopping">
            Back to shopping
          </Link>
        </div>
      </div>
    </>
  );
}

