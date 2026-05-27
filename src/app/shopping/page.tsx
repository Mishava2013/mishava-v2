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
        <span>Preview storefront</span>
        <Link className="button ink" href="/app/shopping-priorities">
          Set shopping priorities
        </Link>
      </div>

      <form className="storefront-search" role="search">
        <input
          aria-label="Search products, brands, sellers, or local stores"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder="Search products, brands, sellers, or local favorites"
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
          <h1>Everyday products, clearer proof.</h1>
          <p>
            The proof of concept starts with baby diapers, wipes, and toilet
            paper records from real reviewed source metadata only. Payment
            never changes placement.
          </p>
        </div>
        <div className="storefront-promise">
          <strong>Score on demand</strong>
          <span>Evidence first. Values overlay after priorities are set.</span>
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
                <option value="evidence">Evidence Score</option>
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
            <span>Tools, hosting, and catalogs can be paid. Placement cannot.</span>
          </div>
        </aside>

        <section className="shopping-results" aria-labelledby="shopping-results-title">
          <div className="results-heading">
            <div>
              <p className="storefront-kicker">Real data only</p>
              <h2 id="shopping-results-title">Baby diapers, wipes, and toilet paper POC</h2>
            </div>
            <form className="compact-controls" id="shopping-controls">
              <input name="q" type="hidden" value={params.q ?? ""} />
              <button className="button" type="submit">
                Apply
              </button>
            </form>
          </div>

          <div className="trust-callout">
            <span className="score-pill">Evidence Score</span>
            <p>
              Shoppers can click through for trust details. If there is no real
              published score snapshot, Mishava shows score pending or draft
              trust context instead of a made-up number. Personal values
              sorting stays off until Shopping Priorities are complete and
              enough evidence-backed scoring data exists.
            </p>
            <Link href="/app/shopping-priorities">
              Complete Shopping Priorities to see Your Values Score when it is valid.
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
                      triggerLabel={getProductTrustLabel(product)}
                    />
                    <div className="status-row">
                      <span className="tag tag-score">
                        {product.evidence_coverage ?? "Evidence profile pending"}
                      </span>
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
