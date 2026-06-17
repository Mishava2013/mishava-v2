import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ShoppingAccountPrompt } from "@/components/ShoppingAccountPrompt";
import { ShoppingProductImage } from "@/components/ShoppingProductImage";
import { ShoppingScoreExplainer } from "@/components/ShoppingScoreExplainer";
import { getCurrentSession } from "@/lib/auth-server";
import {
  buildShoppingScoreExplanation,
  formatFreshness,
  getProductTrustLabel,
  getShoppingProducts,
  getToiletPaperPreview,
} from "@/lib/shopping";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getCurrentSession();
  const label = slug.replaceAll("-", " ");
  const isShoppingPoc = ["baby-products", "diapers", "wipes", "toilet-paper"].includes(slug);
  const { products, configured } = isShoppingPoc
    ? await getShoppingProducts({ category: slug })
    : { products: [], configured: true };
  const isToiletPaper = slug === "toilet-paper";
  const title = isToiletPaper ? "Toilet paper" : label;

  return (
    <>
      {!session && isShoppingPoc ? (
        <ShoppingAccountPrompt nextPath={`/shopping/categories/${slug}`} />
      ) : null}
      <PageHeader eyebrow="Shopping category" title={title}>
        {isShoppingPoc
          ? isToiletPaper
            ? "Compare real toilet paper products by what Mishava found, what is still missing, and why a product may still be under review. Mishava is not the store, and this is not medical advice."
            : "Compare baby product records with real source information. Mishava shows products only when source metadata is connected."
          : "Category pages will map product types to evidence needs, shopping filters, local availability, and score explanation. Scores remain unavailable until real evidence exists for each product or business."}
      </PageHeader>
      {isShoppingPoc && !configured ? (
        <EmptyState title="Shopping is getting product records ready">
          Mishava shows real product records only after source metadata is
          connected. Please check back shortly.
        </EmptyState>
      ) : isShoppingPoc && products.length === 0 ? (
        <EmptyState title={`No ${isToiletPaper ? "toilet paper" : "baby product"} records found`}>
          Mishava only shows products with real source records. Try another
          Shopping category.
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
              <span className="score-pill">Mishava is reviewing</span>
              <p>
                These are real product records, not products for sale by
                Mishava. Click a product to see what Mishava found, what is
                still missing, and why a final score is not shown yet.
              </p>
              <Link href="/?signIn=1&next=%2Fapp%2Fshopping-priorities&surface=shopping">
                Already have an account? Sign in to set Shopping Priorities.
              </Link>
              <Link href="/auth/sign-up?next=%2Fapp%2Fshopping-priorities&surface=shopping">
                Create a free Shopping account for personal match previews.
              </Link>
            </div>
          ) : null}
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });
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
                    <p className="product-card-summary">
                      {product.retailer_name ?? product.source_name ?? "Source listed"}
                      {product.source_captured_at
                        ? ` · ${formatFreshness(product.source_captured_at)}`
                        : ""}
                    </p>
                    <ShoppingScoreExplainer
                      explanation={explanation}
                      triggerLabel={
                        product.score_snapshot_id
                          ? getProductTrustLabel(product)
                          : "Why Mishava is still reviewing"
                      }
                    />
                    <div className="status-row">
                      <span className="tag tag-score">
                        {product.score_snapshot_id
                          ? getProductTrustLabel(product)
                          : "Mishava is still reviewing this product"}
                      </span>
                      {preview ? (
                        <span className="tag tag-score">{preview.valuesLabel}</span>
                      ) : null}
                      <span className="tag tag-source">
                        Source {product.source_review_status}
                      </span>
                      <span className="tag tag-commerce">No paid ranking</span>
                    </div>
                    <Link className="button product-card-link" href={`/shopping/products/${product.slug}`}>
                      View product details
                    </Link>
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
