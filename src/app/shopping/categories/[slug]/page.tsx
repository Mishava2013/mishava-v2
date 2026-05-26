import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ShoppingProductImage } from "@/components/ShoppingProductImage";
import { ShoppingScoreExplainer } from "@/components/ShoppingScoreExplainer";
import {
  buildShoppingScoreExplanation,
  formatFreshness,
  getProductTrustLabel,
  getShoppingProducts,
} from "@/lib/shopping";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = slug.replaceAll("-", " ");
  const isBabyPoc = ["baby-products", "diapers", "wipes"].includes(slug);
  const { products, configured } = isBabyPoc
    ? await getShoppingProducts({ category: slug })
    : { products: [], configured: true };

  return (
    <>
      <PageHeader eyebrow="Shopping category" title={label}>
        {isBabyPoc
          ? "This is part of the baby products proof of concept. Products appear only after real source records are approved."
          : "Category pages will map product types to evidence needs, shopping filters, local availability, and score explanation. Scores remain unavailable until real evidence exists for each product or business."}
      </PageHeader>
      {isBabyPoc && !configured ? (
        <EmptyState title="Shopping database is not configured yet">
          Add Supabase environment variables and reviewed real product records
          before Mishava displays this shelf.
        </EmptyState>
      ) : isBabyPoc && products.length === 0 ? (
        <EmptyState title="Baby products POC uses real records only">
          Mishava will not create placeholder diapers, wipes, places to buy, or
          score values. Reviewed products remain hidden until real source
          metadata is approved.
        </EmptyState>
      ) : isBabyPoc ? (
        <section className="shopping-results" aria-labelledby="category-products-title">
          <div className="results-heading">
            <div>
              <p className="storefront-kicker">Real data only</p>
              <h2 id="category-products-title">{label} records</h2>
            </div>
            <Link className="button" href="/shopping">
              Back to shopping
            </Link>
          </div>
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });

              return (
                <article className="product-card" key={product.id}>
                  <Link href={`/shopping/products/${product.slug}`}>
                    <div className="product-media">
                      <ShoppingProductImage product={product} />
                    </div>
                  </Link>
                  <div className="product-body">
                    <p className="product-meta">
                      {product.brand_name ?? "Brand not listed"}
                    </p>
                    <h3>
                      <Link href={`/shopping/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    {product.package_details ? (
                      <p className="product-meta">{product.package_details}</p>
                    ) : null}
                    <ShoppingScoreExplainer
                      explanation={explanation}
                      triggerLabel={getProductTrustLabel(product)}
                    />
                    <div className="status-row">
                      <span className="tag tag-score">
                        {product.evidence_coverage ?? "Evidence profile pending"}
                      </span>
                      <span className="tag tag-source">
                        Source {product.source_review_status}
                      </span>
                      <span className="tag">
                        {formatFreshness(product.source_captured_at)}
                      </span>
                      <span className="tag tag-commerce">No paid ranking</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
