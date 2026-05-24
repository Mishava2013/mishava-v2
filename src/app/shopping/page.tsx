import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { getShoppingProducts } from "@/lib/shopping";

const departmentLinks = [
  "Baby",
  "Household",
  "Personal care",
  "Kitchen",
  "Apparel",
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
            Browse familiar shelves with evidence details available when a real
            score snapshot exists. Payment never changes placement.
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
                <option value="values">Your Values Score</option>
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
              <h2 id="shopping-results-title">Shopping results</h2>
            </div>
            <form className="compact-controls" id="shopping-controls">
              <input name="q" type="hidden" value={params.q ?? ""} />
              <button className="button" type="submit">
                Apply
              </button>
            </form>
          </div>

          <div className="trust-callout">
            <span className="score-pill">
              {params.sort === "values" ? "Your Values Score" : "Evidence Score"}
            </span>
            <p>
              Shoppers can click a score for the evidence details. If there is
              no real snapshot, Mishava shows pending evidence instead of a made-up score.
            </p>
          </div>

        {!configured ? (
          <EmptyState title="Shopping database is not configured yet">
            Add Supabase environment variables and real product records before
            Mishava displays product results.
          </EmptyState>
        ) : products.length === 0 ? (
          <EmptyState title="No real products found">
            No active real product records matched this search. Mishava will not
            show placeholder product cards as shopping results.
          </EmptyState>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link className="product-card" href={`/shopping/products/${product.slug}`} key={product.id}>
                <div className="product-media">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" src={product.image_url} />
                  ) : (
                    <span>{product.category}</span>
                  )}
                </div>
                <div className="product-body">
                  <p className="product-meta">
                    {product.brand_name ?? "Brand not listed"}
                  </p>
                  <h3>{product.name}</h3>
                  <span className="score-chip">
                    {product.evidence_score === null
                      ? "Evidence Score pending"
                      : `Evidence Score ${product.evidence_score}`}
                  </span>
                  <div className="status-row">
                    <span className="tag">
                      {product.evidence_coverage ?? "Pending"} coverage
                    </span>
                    <span className="tag">
                      {product.evidence_recency ?? "Pending"} recency
                    </span>
                    <span className="tag">
                      {product.score_snapshot_id
                        ? "Snapshot linked"
                        : "No public score snapshot"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </section>
      </div>
    </div>
  );
}
