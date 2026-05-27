import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";
import { ShoppingProductImage } from "@/components/ShoppingProductImage";
import { ShoppingScoreExplainer } from "@/components/ShoppingScoreExplainer";
import {
  buildShoppingScoreExplanation,
  formatFreshness,
  formatPrice,
  getEvidenceReadinessLabels,
  getProductTrustLabel,
  getShoppingCategoryResearchTemplate,
  getShoppingProductBySlug,
  getShoppingResearchReadiness,
  getSupplierTransparencyLabels,
  hasSupplierEvidenceGap,
  hasPublishedEvidenceScore,
} from "@/lib/shopping";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, placesToBuy, configured } = await getShoppingProductBySlug(slug);
  const explanation = product ? buildShoppingScoreExplanation({ product }) : null;
  const evidenceReadiness = product ? getEvidenceReadinessLabels(product) : [];
  const supplierTransparency = product ? getSupplierTransparencyLabels(product) : [];
  const researchReadiness = product ? getShoppingResearchReadiness(product) : null;
  const researchTemplate =
    product?.product_subcategory ? getShoppingCategoryResearchTemplate(product.product_subcategory) : null;
  const isToiletPaper = product?.product_subcategory === "toilet-paper";

  return (
    <>
      <PageHeader eyebrow="Product profile" title={product?.name ?? "Product not available"}>
        Product pages show only real product and place-to-buy records. If scoring
        evidence is not ready, Mishava labels the trust context as pending rather
        than inventing a number.
      </PageHeader>
      <div className="surface-list">
        {product ? (
          <div className="evidence-panel">
            <div className="product-detail-hero">
              <ShoppingProductImage product={product} size="detail" />
              <div>
                <p className="product-meta">{product.brand_name ?? "Brand not listed"}</p>
                <h2 className="panel-title">{getProductTrustLabel(product)}</h2>
                <div className="score-row">
                  <div className="score-badge">
                    {hasPublishedEvidenceScore(product) ? product.evidence_score : "--"}
                  </div>
                  <p className="score-caption">
                    {hasPublishedEvidenceScore(product)
                      ? "This score is backed by a published score snapshot."
                      : "Evidence profile pending. No public score appears until real reviewed evidence and a published snapshot exist."}
                  </p>
                </div>
                <div className="status-row">
                  <span className="tag tag-score">Score pending</span>
                  <span className="tag tag-source">
                    Source {product.source_review_status}
                  </span>
                  {isToiletPaper ? (
                    <span className="tag tag-source">External evidence available</span>
                  ) : null}
                  {product && hasSupplierEvidenceGap(product) ? (
                    <span className="tag tag-source">
                      Supplier/manufacturer evidence gap
                    </span>
                  ) : null}
                  <span className="tag tag-commerce">No paid ranking</span>
                </div>
              </div>
            </div>
            <div className="metric-grid">
              <div className="metric">
                <span>Coverage</span>
                <strong>{product.evidence_coverage ?? "Pending"}</strong>
              </div>
              <div className="metric">
                <span>Recency</span>
                <strong>{product.evidence_recency ?? "Pending"}</strong>
              </div>
              <div className="metric">
                <span>Source</span>
                <strong>{product.source_name ?? "Not listed"}</strong>
              </div>
              <div className="metric">
                <span>Manufacturer</span>
                <strong>{product.manufacturer_confidence}</strong>
              </div>
              <div className="metric">
                <span>Supplier</span>
                <strong>{product.supplier_confidence}</strong>
              </div>
              <div className="metric">
                <span>Freshness</span>
                <strong>{formatFreshness(product.source_captured_at)}</strong>
              </div>
            </div>
            {explanation ? (
              <div className="score-explainer-inline">
                <ShoppingScoreExplainer explanation={explanation} mode="inline" />
                <ShoppingScoreExplainer
                  explanation={explanation}
                  triggerLabel="Why this score?"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <ScoreExplainer />
        )}
        <div className="card">
            <h3>{product?.brand_name ?? "Brand or seller context"}</h3>
          {product ? (
            <>
              {product.product_summary ? <p>{product.product_summary}</p> : null}
              <p>
                Category: {product.category}
                {product.product_subcategory ? ` / ${product.product_subcategory}` : ""}.
                {product.package_details ? ` Package: ${product.package_details}.` : ""}
                Places to buy are shown only from real source records. Ranking is
                not commission-based and payment cannot create placement
                advantage.
              </p>
              <p>
                Shopping Priorities can personalize explanations later, but they
                do not change this product&apos;s base Evidence Score.
              </p>
              <p>
                What is missing: reviewed evidence coverage, accepted scoring
                facts, and a published score snapshot. Until those exist, this
                page withholds score values.
              </p>
              {isToiletPaper ? (
                <div className="surface-list compact">
                  <div>
                    <h4>Toilet paper research readiness</h4>
                    <p>
                      Recycled content, bamboo/FSC, virgin-fiber reliance,
                      bleaching/process, packaging, and sourcing-policy claims
                      are tracked as evidence context. Retailer, brand,
                      private-label owner, manufacturer, and supplier are kept
                      separate. Outside scorecards may be evidence references,
                      but they are not Mishava Scores.
                    </p>
                    {researchTemplate ? (
                      <p>
                        Required before a public tissue score:{" "}
                        {researchTemplate.scoreReadinessPrerequisites.join(", ")}.
                      </p>
                    ) : null}
                    {researchReadiness?.missing.length ? (
                      <p>
                        Current research task status: evidence gap. Missing:{" "}
                        {researchReadiness.missing.join(", ")}.
                      </p>
                    ) : null}
                    <div className="status-row">
                      {evidenceReadiness.map((label) => (
                        <span className="tag tag-source" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4>Supplier and manufacturer transparency</h4>
                    <p>
                      Mishava shows unknowns as evidence gaps. A retailer or
                      private-label owner is not treated as the manufacturer
                      unless a reviewed source supports that link.
                    </p>
                    <div className="status-row">
                      {supplierTransparency.map((label) => (
                        <span className="tag tag-source" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="surface-list compact">
                      {product.manufacturer_source_url ? (
                        <Link href={product.manufacturer_source_url}>
                          Open manufacturer source
                        </Link>
                      ) : null}
                      {product.supplier_source_url ? (
                        <Link href={product.supplier_source_url}>
                          Open supplier source
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  {product.external_evidence_reference_url ? (
                    <Link href={product.external_evidence_reference_url}>
                      Open external evidence reference
                    </Link>
                  ) : null}
                  {product.brand_sourcing_policy_url ? (
                    <Link href={product.brand_sourcing_policy_url}>
                      Open brand sourcing context
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <div className="status-row">
                <span className="tag tag-commerce">No commission ranking</span>
                <span className="tag tag-commerce">No paid placement</span>
                <span className="tag tag-commerce">Mishava is not the store</span>
                <span className="tag tag-source">
                  {product.source_url ? "Source URL recorded" : "Source URL pending"}
                </span>
              </div>
              {product.product_url ? (
                <Link href={product.product_url}>Open product source</Link>
              ) : null}
            </>
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
            records are attached yet. Mishava will not create placeholder stores
            or checkout links.
          </EmptyState>
        ) : (
          <>
            <p>
              Mishava is not the store. These outbound links are source records
              only; Mishava does not earn shopping commissions and does not
              provide checkout.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Fulfillment</th>
                  <th>Source freshness</th>
                </tr>
              </thead>
              <tbody>
                {placesToBuy.map((place) => (
                  <tr key={place.id}>
                    <td>{place.seller_name}</td>
                    <td>{place.seller_type}</td>
                    <td>{formatPrice(place)}</td>
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
                      <div className="status-row">
                        <span className="tag tag-source">
                          Source {place.source_review_status}
                        </span>
                        <span className="tag">
                          {formatFreshness(place.source_captured_at ?? place.last_checked_at)}
                        </span>
                      </div>
                      {place.url ? (
                        <Link href={place.url}>External seller page</Link>
                      ) : (
                        "No public URL"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  );
}
