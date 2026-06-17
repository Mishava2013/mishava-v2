import Link from "next/link";
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

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const session = await getCurrentSession();
  const { products, configured } = await getShoppingProducts({
    query: params.q,
    category: params.q ? undefined : "baby-products",
    sort: params.sort,
  });

  return (
    <div className="shopping-storefront">
      {!session ? <ShoppingAccountPrompt nextPath="/shopping" /> : null}
      <div className="storefront-topline">
        <span>Free Shopping account available</span>
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
            and why some products are still being reviewed. You can browse toilet paper
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
        <aside className="shopping-filters" aria-label="Shopping guide">
          <div className="filter-note">
            <strong>How to use Shopping</strong>
            <span>
              Start with Toilet paper, open a product, and compare what
              Mishava found with what still needs review.
            </span>
          </div>
          <div className="filter-note">
            <strong>Free account</strong>
            <span>
              Browse first. Create a free Shopping account when you want
              Mishava to remember your priorities.
            </span>
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
          </div>

          <div className="trust-callout">
            <span className="score-pill">Mishava is reviewing</span>
            <p>
              Some products have source records but no final score yet. That is
              intentional: Mishava shows what it found and what it still needs
              instead of making up a number.
            </p>
            <Link href="/?signIn=1&next=%2Fapp%2Fshopping-priorities&surface=shopping">
              Already have an account? Sign in to set Shopping Priorities.
            </Link>
            <Link href="/auth/sign-up?next=%2Fapp%2Fshopping-priorities&surface=shopping">
              New here? Create a free Shopping account for personal match previews.
            </Link>
          </div>

        {!configured ? (
          <EmptyState title="Shopping is getting product records ready">
            Mishava shows real product records only after source metadata is
            connected. Please check back shortly.
          </EmptyState>
        ) : products.length === 0 ? (
          <EmptyState title="No matching products found">
            Try Toilet paper, Diapers, or Wipes. Mishava only shows products
            with real source records.
          </EmptyState>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const explanation = buildShoppingScoreExplanation({ product });
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
                      {toiletPaperPreview ? (
                        <span className="tag tag-score">
                          {toiletPaperPreview.valuesLabel}
                        </span>
                      ) : null}
                      <span className="tag tag-source">
                        Source {product.source_review_status}
                      </span>
                      <span className="tag tag-commerce">No commission</span>
                    </div>
                    <Link className="button product-card-link" href={`/shopping/products/${product.slug}`}>
                      View product details
                    </Link>
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
