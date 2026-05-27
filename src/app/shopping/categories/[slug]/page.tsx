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

  return (
    <>
      <PageHeader eyebrow="Shopping category" title={label}>
        {isShoppingPoc
          ? isToiletPaper
            ? "This early toilet paper preview records real product sources, evidence dimensions, and tissue-sourcing gaps. Scores stay pending until Mishava-reviewed claims and a supported scoring version exist. This is not medical advice."
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
              <h2 id="category-products-title">{label} records</h2>
            </div>
            <Link className="button" href="/shopping">
              Back to shopping
            </Link>
          </div>
          {isToiletPaper ? (
            <div className="trust-callout">
              <span className="score-pill">Evidence Score Preview</span>
              <p>
                Mishava is showing reviewed evidence, supplier transparency,
                and evidence gaps for toilet paper. This preview does not make
                medical claims, does not guarantee suitability for a medical
                condition, and does not show a completed public score.
              </p>
              <Link href="/app/shopping-priorities">
                Complete Shopping Priorities to unlock match context when
                enough reviewed evidence exists.
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
                      triggerLabel={getProductTrustLabel(product)}
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
              Outside scorecards may be evidence references, but they are not
              Mishava Scores. Toilet paper records remain score-pending until
              Mishava review and a supported scoring version are complete.
            </p>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
