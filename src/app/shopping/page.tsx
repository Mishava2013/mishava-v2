import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";
import { getShoppingProducts } from "@/lib/shopping";

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
    <>
      <PageHeader eyebrow="Shopping" title="Search the web through trust context.">
        Mishava shopping will feel familiar: strong search, simple filters, product
        browsing, places to buy, and score details on demand. The first product
        proof of concept starts with diapers and baby wipes using real data only.
      </PageHeader>

      <form className="toolbar" role="search">
        <input
          className="search-input"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder="Search products, brands, sellers, or local stores"
        />
        <select className="select-input" defaultValue={params.source ?? "all"} name="source">
          <option value="all">All sources</option>
          <option value="online">Online</option>
          <option value="local">Local radius</option>
        </select>
        <select className="select-input" defaultValue={params.sort ?? "evidence"} name="sort">
          <option value="evidence">Evidence Score</option>
          <option value="values">Your Values Score</option>
          <option value="price">Price</option>
          <option value="distance">Distance</option>
        </select>
        <button className="button primary" type="submit">
          Search
        </button>
      </form>

      <div className="surface-list">
        <ScoreExplainer />
        <div className="card">
          <h3>Real data rule</h3>
          <p>
            Mishava does not seed fake products, fake prices, fake sellers, or
            invented trust scores. Products appear only after real source data is
            added to the database.
          </p>
          <div className="status-row">
            <span className="tag">No paid ranking</span>
            <span className="tag">No commission ranking</span>
            <span className="tag">No fake score</span>
          </div>
        </div>
      </div>

      <section className="section">
        <h2>Shopping results</h2>
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
                  {product.image_url ? "Product image available" : product.category}
                </div>
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p className="product-meta">
                    {product.brand_name ?? "Brand not listed"}
                  </p>
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
    </>
  );
}
