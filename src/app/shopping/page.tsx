import Link from "next/link";
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

const departmentLinks = [
  { label: "Baby products", href: "/shopping/categories/baby-products" },
  { label: "Diapers", href: "/shopping/categories/diapers" },
  { label: "Wipes", href: "/shopping/categories/wipes" },
  { label: "Toilet paper", href: "/shopping/categories/toilet-paper" },
  { label: "Household", href: "/shopping?q=Household" },
  { label: "Personal care", href: "/shopping?q=Personal%20care" },
  { label: "Toys", href: "/shopping?q=Toys" },
  { label: "Local picks", href: "/shopping?q=Local%20picks" },
];

const quickFilters = [
  "Pickup nearby",
  "Ships today",
  "Evidence checked",
  "Small business",
  "Family owned",
];

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { products, configured } = await getShoppingProducts({
    query: params.q,
    category: params.q ? undefined : "baby-products",
    sort: params.sort,
  });

  return (
    <div className="shopping-storefront">
      <div className="storefront-topline">
        <span>Early Shopping preview</span>
        <Link
          className="button ink"
          href="/auth/sign-up?next=%2Fapp%2Fshopping-priorities&surface=shopping"
        >
          Create a free Shopping account
        </Link>
      </div>

      <form className="storefront-search" role="search">
        <input
          aria-label="Search products, brands, sellers, or local stores"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder="Search products or brands"
        />
        <button className="button primary" type="submit">
          Search
        </button>
      </form>

      <nav aria-label="Shopping departments" className="department-rail">
        {departmentLinks.map((department) => (
          <Link href={department.href} key={department.label}>
            {department.label}
          </Link>
        ))}
      </nav>

      <div className="shopping-masthead">
        <div>
          <p className="storefront-kicker">Shopping</p>
          <h1>Compare products by evidence, not ads.</h1>
          <p>
            Mishava helps you see what has been found, what is still missing,
            and why some scores are not ready yet. You can browse toilet paper
            and baby products without signing in. Mishava is not the store and
            does not sell these products. Create a free Shopping account when
            you want Mishava to remember your priorities for personal match
            previews.
          </p>
        </div>
        <div className="storefront-promise">
          <strong>What matters here</strong>
          <span>
            No paid ranking. No commission sorting. Missing evidence is shown
            instead of hidden.
          </span>
        </div>
      </div>

      <div className="shopping-layout">
        <aside className="shopping-filters" aria-label="Shopping filters">
          <div className="filter-block">
            <h2>Shop by</h2>
            <label>
              Source
              <select defaultValue={params.source ?? "all"} form="shopping-controls" name="source">
                <option value="all">All sources</option>
                <option value="online">Online</option>
                <option value="local">Local radius</option>
              </select>
            </label>
            <label>
              Sort
              <select defaultValue={params.sort ?? "evidence"} form="shopping-controls" name="sort">
                <option value="evidence">Evidence status</option>
                <option value="price">Price</option>
                <option value="distance">Distance</option>
              </select>
            </label>
          </div>

          <div className="filter-block">
            <h2>Quick filters</h2>
            <div className="filter-stack">
              {quickFilters.map((filter) => (
                <label className="check-row" key={filter}>
                  <input type="checkbox" />
                  <span>{filter}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-note">
            <strong>No paid ranking</strong>
            <span>
              Companies cannot pay to move products higher. Mishava does not
              earn shopping commissions from these links.
            </span>
          </div>
        </aside>

        <section className="shopping-results" aria-labelledby="shopping-results-title">
          <div className="results-heading">
            <div>
              <p className="storefront-kicker">Real data only</p>
              <h2 id="shopping-results-title">Start with toilet paper or baby products</h2>
            </div>
            <form className="compact-controls" id="shopping-controls">
              <input name="q" type="hidden" value={params.q ?? ""} />
              <button className="button" type="submit">
                Apply
              </button>
            </form>
          </div>

          <div className="trust-callout">
            <span className="score-pill">Score not ready yet</span>
            <p>
              Some products have source records but no final score yet. That is
              intentional: Mishava shows what it found and what it still needs
              instead of making up a number.
            </p>
            <Link href="/app/shopping-priorities">
              Already have an account? Sign in to set Shopping Priorities.
            </Link>
            <Link href="/auth/sign-up?next=%2Fapp%2Fshopping-priorities&surface=shopping">
              New here? Create a free Shopping account for personal match previews.
            </Link>
          </div>

        {!configured ? (
          <EmptyState title="Shopping database is not configured yet">
            Add Supabase environment variables and real product records before
            Mishava displays product results.
          </EmptyState>
        ) : products.length === 0 ? (
          <EmptyState title="No real Shopping POC product records found">
            Mishava is adding reviewed baby diapers, wipes, and toilet paper records here.
            Products stay hidden until real source metadata is approved, and
            scores stay pending until evidence supports them.
          </EmptyState>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });
              const readinessLabels = getEvidenceReadinessLabels(product);
              const supplierLabels = getSupplierTransparencyLabels(product);
              const toiletPaperPreview =
                product.product_subcategory === "toilet-paper"
                  ? getToiletPaperPreview(product)
                  : null;

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
                    {product.product_summary ? <p>{product.product_summary}</p> : null}
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
                        {toiletPaperPreview?.confidenceLabel ??
                          product.evidence_coverage ??
                          "Evidence profile pending"}
                      </span>
                      {toiletPaperPreview ? (
                        <span className="tag tag-score">
                          {toiletPaperPreview.evidenceLabel}
                        </span>
                      ) : null}
                      <span className="tag">
                        {product.product_subcategory ?? product.category}
                      </span>
                      <span className="tag tag-source">
                        Source {product.source_review_status}
                      </span>
                      <span className="tag">
                        {formatFreshness(product.source_captured_at)}
                      </span>
                      <span className="tag tag-score">
                        {product.score_snapshot_id ? "Snapshot linked" : "Score pending"}
                      </span>
                      {readinessLabels.slice(0, 2).map((label) => (
                        <span className="tag tag-source" key={label}>
                          {label}
                        </span>
                      ))}
                      {hasSupplierEvidenceGap(product) ? (
                        <span className="tag tag-source">
                          Manufacturer/supplier gap
                        </span>
                      ) : (
                        supplierLabels.slice(4, 5).map((label) => (
                          <span className="tag tag-source" key={label}>
                            {label}
                          </span>
                        ))
                      )}
                      <span className="tag tag-commerce">No commission</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        </section>
      </div>
    </div>
  );
}
