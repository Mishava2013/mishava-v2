import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";
import { getShoppingProductBySlug } from "@/lib/shopping";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, placesToBuy, configured } = await getShoppingProductBySlug(slug);

  return (
    <>
      <PageHeader eyebrow="Product profile" title={product?.name ?? "Product not available"}>
        Product pages will show the selected product, business or brand context,
        places to buy, local availability, score detail, evidence, and why the
        product appears. This page will not display invented product data.
      </PageHeader>
      <div className="surface-list">
        <ScoreExplainer />
        <div className="card">
          <h3>Places to buy</h3>
          {product ? (
            <p>
              Places to buy are shown only from real source records. Ranking is
              not commission-based and payment cannot create placement advantage.
            </p>
          ) : (
            <p>
              This product slug has no active real product record available.
            </p>
          )}
          <Link className="button" href="/shopping">
            Back to shopping
          </Link>
        </div>
      </div>

      <section className="section">
        <h2>Places to buy</h2>
        {!configured ? (
          <EmptyState title="Shopping database is not configured yet">
            Add Supabase environment variables before Mishava can read product
            and seller records.
          </EmptyState>
        ) : !product ? (
          <EmptyState title="No product record found">
            Mishava will not create placeholder product detail content when a
            real product record is missing.
          </EmptyState>
        ) : placesToBuy.length === 0 ? (
          <EmptyState title="No places to buy loaded">
            This product exists, but no active real seller or availability
            records are attached yet.
          </EmptyState>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Type</th>
                <th>Availability</th>
                <th>Fulfillment</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {placesToBuy.map((place) => (
                <tr key={place.id}>
                  <td>{place.seller_name}</td>
                  <td>{place.seller_type}</td>
                  <td>{place.availability_status ?? "Not listed"}</td>
                  <td>
                    {[
                      place.local_pickup ? "Local pickup" : null,
                      place.local_delivery ? "Local delivery" : null,
                      place.fulfillment_notes,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not listed"}
                  </td>
                  <td>
                    {place.url ? (
                      <Link href={place.url}>External source</Link>
                    ) : (
                      "No public URL"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
