import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ShoppingProductImage } from "@/components/ShoppingProductImage";
import { ShoppingScoreExplainer } from "@/components/ShoppingScoreExplainer";
import {
  buildShoppingScoreExplanation,
  formatFreshness,
  getEvidenceReadinessLabels,
  getProductTrustLabel,
  getShoppingProducts,
  getSupplierTransparencyLabels,
  getToiletPaperPreview,
  hasSupplierEvidenceGap,
} from "@/lib/shopping";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = slug.replaceAll("-", " ");
  const isShoppingPoc = ["baby-products", "diapers", "wipes", "toilet-paper"].includes(slug);
  const { products, configured } = isShoppingPoc
    ? await getShoppingProducts({ category: slug })
    : { products: [], configured: true };
  const isToiletPaper = slug === "toilet-paper";
  const title = isToiletPaper ? "Toilet paper preview" : label;

  return (
    <>
      <PageHeader eyebrow="Shopping category" title={title}>
        {isShoppingPoc
          ? isToiletPaper
            ? "This early preview shows real toilet paper products, where Mishava found source information, and what is still missing. Mishava is not the store, and this is not medical advice."
            : "This is part of the baby products proof of concept. Products appear only after real source records are approved."
          : "Category pages will map product types to evidence needs, shopping filters, local availability, and score explanation. Scores remain unavailable until real evidence exists for each product or business."}
      </PageHeader>
      {isShoppingPoc && !configured ? (
        <EmptyState title="Shopping database is not configured yet">
          Add Supabase environment variables and reviewed real product records
          before Mishava displays this shelf.
        </EmptyState>
      ) : isShoppingPoc && products.length === 0 ? (
        <EmptyState title={`${isToiletPaper ? "Toilet paper" : "Baby products"} POC uses real records only`}>
          Mishava will not create placeholder products, places to buy, or score
          values. Reviewed products remain hidden until real source
          metadata is approved.
        </EmptyState>
      ) : isShoppingPoc ? (
        <section className="shopping-results" aria-labelledby="category-products-title">
          <div className="results-heading">
            <div>
              <p className="storefront-kicker">Real data only</p>
              <h2 id="category-products-title">
                {isToiletPaper ? "Choose a toilet paper product to review" : `${label} records`}
              </h2>
            </div>
            <Link className="button" href="/shopping">
              Back to shopping
            </Link>
          </div>
          {isToiletPaper ? (
            <div className="trust-callout">
              <span className="score-pill">Score not ready yet</span>
              <p>
                These are real product records, not products for sale by
                Mishava. Click a product to see what Mishava found, what is
                still missing, and why a final score is not shown yet.
              </p>
              <Link href="/app/shopping-priorities">
                Tell Mishava what matters to you after you look around.
              </Link>
            </div>
          ) : null}
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });
              const readinessLabels = getEvidenceReadinessLabels(product);
              const supplierLabels = getSupplierTransparencyLabels(product);
              const preview = isToiletPaper ? getToiletPaperPreview(product) : null;

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
                      triggerLabel={
                        product.score_snapshot_id
                          ? getProductTrustLabel(product)
                          : "Why this score is pending"
                      }
                    />
                    <div className="status-row">
                      <span className="tag tag-score">
                        {preview?.confidenceLabel ?? product.evidence_coverage ?? "Evidence profile pending"}
                      </span>
                      {preview ? (
                        <span className="tag tag-score">{preview.evidenceLabel}</span>
                      ) : null}
                      <span className="tag tag-source">
                        Source {product.source_review_status}
                      </span>
                      <span className="tag">
                        {formatFreshness(product.source_captured_at)}
                      </span>
                      {readinessLabels.slice(0, 2).map((status) => (
                        <span className="tag tag-score" key={status}>
                          {status}
                        </span>
                      ))}
                      {isToiletPaper && hasSupplierEvidenceGap(product) ? (
                        <span className="tag tag-source">
                          Manufacturer/supplier gap
                        </span>
                      ) : isToiletPaper ? (
                        supplierLabels.slice(4, 5).map((label) => (
                          <span className="tag tag-source" key={label}>
                            {label}
                          </span>
                        ))
                      ) : null}
                      <span className="tag tag-commerce">No paid ranking</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {isToiletPaper ? (
            <p className="filter-note">
              Outside scorecards can help Mishava identify evidence, but they
              are not Mishava Scores. Toilet paper records stay score-pending
              until Mishava review and a supported scoring version are complete.
            </p>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
