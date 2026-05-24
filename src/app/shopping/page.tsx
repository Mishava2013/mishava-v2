import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";
import { products } from "@/lib/sample-data";

export default function ShoppingPage() {
  return (
    <>
      <PageHeader eyebrow="Shopping" title="Search the web through trust context.">
        Mishava shopping will feel familiar: strong search, simple filters, product
        browsing, places to buy, and score details on demand. The first product
        proof of concept starts with diapers and baby wipes using real data only.
      </PageHeader>

      <div className="toolbar" role="search">
        <input className="search-input" placeholder="Search products, brands, sellers, or local stores" />
        <select className="select-input" defaultValue="all">
          <option value="all">All sources</option>
          <option value="online">Online</option>
          <option value="local">Local radius</option>
        </select>
        <select className="select-input" defaultValue="evidence">
          <option value="evidence">Evidence Score</option>
          <option value="values">Your Values Score</option>
          <option value="price">Price</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      <div className="surface-list">
        <ScoreExplainer />
        <div className="card">
          <h3>Real data rule</h3>
          <p>
            Product cards below are intake slots, not scored examples. Mishava
            will not seed fake products, fake prices, fake sellers, or invented
            trust scores.
          </p>
          <div className="status-row">
            <span className="tag">No paid ranking</span>
            <span className="tag">No commission ranking</span>
            <span className="tag">No fake score</span>
          </div>
        </div>
      </div>

      <section className="section">
        <h2>Product proof-of-concept queue</h2>
        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-card" href={`/shopping/products/${product.slug}`} key={product.slug}>
              <div className="product-media">{product.category}</div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <p className="product-meta">{product.brand}</p>
                <span className="score-chip">Score pending</span>
                <div className="status-row">
                  <span className="tag">{product.coverage} coverage</span>
                  <span className="tag">{product.verification}</span>
                  <span className="tag">{product.availability}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

