import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { ShoppingScoreExplainer } from "@/components/ShoppingScoreExplainer";
import {
  buildShoppingScoreExplanation,
  getProductTrustLabel,
  getShoppingProducts,
} from "@/lib/shopping";

const departmentLinks = [
  "Baby products",
  "Diapers",
  "Wipes",
  "Household",
  "Personal care",
  "Toys",
  "Local picks",
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
          <Link href={`/shopping?q=${encodeURIComponent(department)}`} key={department}>
            {department}
          </Link>
        ))}
      </nav>

      <div className="shopping-masthead">
        <div>
          <p className="storefront-kicker">Shopping</p>
          <h1>Everyday products, clearer proof.</h1>
          <p>
            The first proof of concept is baby products: diapers, wipes, and
            related basics from real source records only. Payment never changes
            placement.
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
              <h2 id="shopping-results-title">Baby products POC</h2>
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
          <EmptyState title="No real baby product records found">
            No active real product records matched this proof-of-concept view.
            Mishava will not show placeholder diapers, wipes, stores, prices, or
            scores as shopping results.
          </EmptyState>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });

              return (
                <article className="product-card" key={product.id}>
                  <Link href={`/shopping/products/${product.slug}`}>
                    <div className="product-media">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" src={product.image_url} />
                      ) : (
                        <span>{product.category}</span>
                      )}
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
                    <ShoppingScoreExplainer
                      explanation={explanation}
                      triggerLabel={getProductTrustLabel(product)}
                    />
                    <div className="status-row">
                      <span className="tag">
                        {product.evidence_coverage ?? "Evidence profile pending"}
                      </span>
                      <span className="tag">
                        {product.source_review_status} source
                      </span>
                      <span className="tag">
                        {product.score_snapshot_id
                          ? "Snapshot linked"
                          : "Score pending"}
                      </span>
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
