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
  getToiletPaperEvidenceDimensions,
  getToiletPaperPreview,
  hasSupplierEvidenceGap,
  hasPublishedEvidenceScore,
} from "@/lib/shopping";

type EvidenceSourceCard = {
  title: string;
  type: string;
  url: string | null;
  reviewedStatus: string;
  reviewedDate: string | null;
  claimSummary: string;
  supports: string;
  doesNotProve: string;
  gaps: string;
  confidence: string;
};

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
  const toiletPaperPreview = product && isToiletPaper ? getToiletPaperPreview(product) : null;
  const toiletPaperDimensions =
    product && isToiletPaper ? getToiletPaperEvidenceDimensions(product, placesToBuy) : [];
  const evidenceSources: EvidenceSourceCard[] = product
    ? ([
        {
          title: product.source_name ?? "Product source",
          type:
            product.data_origin === "retailer_page"
              ? "Retailer/product page"
              : "Product source",
          url: product.source_url ?? product.product_url,
          reviewedStatus: product.source_review_status,
          reviewedDate: product.source_captured_at,
          claimSummary:
            product.product_summary ??
            "Source recorded for product identity and basic product context.",
          supports: "Product identity, package details, source freshness, and recorded product claims where present.",
          doesNotProve:
            "This source does not create a final score or verify medical suitability.",
          gaps:
            product.evidence_gap_notes ??
            "Reviewed evidence coverage, accepted scoring facts, and a published score snapshot are still missing.",
          confidence:
            product.source_review_status === "approved"
              ? "Source reviewed"
              : "Needs Mishava review",
        },
        product.brand_sourcing_policy_url
          ? {
              title: "Brand sourcing context",
              type: "Brand/manufacturer context",
              url: product.brand_sourcing_policy_url,
              reviewedStatus: product.source_review_status,
              reviewedDate: product.supplier_reviewed_at ?? product.source_captured_at,
              claimSummary:
                "Brand or company sourcing context is available as evidence context.",
              supports:
                "Company-level sourcing or sustainability context where the source supports it.",
              doesNotProve:
                "Company-level context does not automatically prove product-level recycled content, FSC status, bleaching/process claims, packaging claims, or supplier identity.",
              gaps:
                "Product-level claims still need Mishava review before they can support scoring.",
              confidence:
                product.manufacturer_confidence === "verified" ||
                product.supplier_confidence === "verified"
                  ? "Verified source context"
                  : "Context only; product-level evidence still needed",
            }
          : null,
        product.external_evidence_reference_url
          ? {
              title: "External evidence reference",
              type: "Third-party reference",
              url: product.external_evidence_reference_url,
              reviewedStatus: product.source_review_status,
              reviewedDate: product.source_captured_at,
              claimSummary:
                product.external_evidence_reference_notes ??
                "External reference recorded as evidence context.",
              supports:
                "Outside context that may help Mishava identify claims, gaps, or research questions.",
              doesNotProve:
                "Outside scorecards or rankings are not Mishava Scores and are not copied into Mishava scoring.",
              gaps:
                "Mishava-reviewed structured claims and a supported scoring method are still required.",
              confidence: "Evidence reference only",
            }
          : null,
        ...placesToBuy.slice(0, 2).map((place) => ({
          title: `${place.seller_name} place-to-buy source`,
          type: "Retailer/place-to-buy page",
          url: place.source_url ?? place.url,
          reviewedStatus: place.source_review_status,
          reviewedDate: place.source_captured_at ?? place.last_checked_at,
          claimSummary:
            place.fulfillment_notes ??
            "Place-to-buy record is available as shopping context.",
          supports:
            "Seller identity, availability context, fulfillment notes, and source freshness where recorded.",
          doesNotProve:
            "A seller link does not create checkout, commission ranking, medical suitability, or a Mishava Score.",
          gaps: "Price/value may remain unverified unless a current reviewed price source is present.",
          confidence:
            place.source_review_status === "approved"
              ? "Source reviewed"
              : "Needs Mishava review",
        })),
      ].filter(Boolean) as EvidenceSourceCard[])
    : [];

  return (
    <>
      <PageHeader eyebrow="Product profile" title={product?.name ?? "Product not available"}>
        Product pages show real source records, what Mishava found, and what is
        still missing. If evidence is not ready, Mishava says the score is not
        ready instead of inventing a number.
      </PageHeader>
      <div className="surface-list">
        {product ? (
          <div className="evidence-panel">
            <div className="product-detail-hero">
              <ShoppingProductImage product={product} size="detail" />
              <div>
                <p className="product-meta">{product.brand_name ?? "Brand not listed"}</p>
                <h2 className="panel-title">
                  {hasPublishedEvidenceScore(product)
                    ? getProductTrustLabel(product)
                    : "Score not ready yet"}
                </h2>
                <div className="score-row">
                  <div className="score-badge">
                    {hasPublishedEvidenceScore(product) ? product.evidence_score : "--"}
                  </div>
                  <p className="score-caption">
                    {toiletPaperPreview
                      ? `${toiletPaperPreview.summary} ${toiletPaperPreview.disclaimer}`
                      : hasPublishedEvidenceScore(product)
                      ? "This score is backed by a published score snapshot."
                      : "No final score is shown until real reviewed evidence and a published score snapshot exist."}
                  </p>
                </div>
                <div className="status-row">
                  <span className="tag tag-score">
                    {toiletPaperPreview?.evidenceLabel ?? "Score pending"}
                  </span>
                  {toiletPaperPreview ? (
                    <>
                      <span className="tag tag-score">
                        {toiletPaperPreview.confidenceLabel}
                      </span>
                      <span className="tag tag-score">
                        {toiletPaperPreview.valuesLabel}
                      </span>
                    </>
                  ) : null}
                  <span className="tag tag-source">
                    Source {product.source_review_status}
                  </span>
                  {isToiletPaper ? (
                    <span className="tag tag-source">Outside source found</span>
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
                <span>What we found</span>
                <strong>{product.evidence_coverage ?? "Pending"}</strong>
              </div>
              <div className="metric">
                <span>Source age</span>
                <strong>{product.evidence_recency ?? "Pending"}</strong>
              </div>
              <div className="metric">
                <span>Source</span>
                <strong>{product.source_name ?? "Not listed"}</strong>
              </div>
              <div className="metric">
                <span>Manufacturer info</span>
                <strong>{product.manufacturer_confidence}</strong>
              </div>
              <div className="metric">
                <span>Supplier info</span>
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
                  triggerLabel="Why this score is pending"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <ScoreExplainer />
        )}
        {product ? (
          <div className="card">
            <p className="storefront-kicker">Where to buy</p>
            <h3>Retailer links are source records.</h3>
            <p>
              Mishava does not sell this product or provide checkout. These
              links go to outside retailer or source pages, and they are not
              sorted by commission.
            </p>
            {placesToBuy.length > 0 ? (
              <div className="simple-list">
                {placesToBuy.slice(0, 3).map((place) => (
                  <div className="simple-list-item" key={place.id}>
                    <div>
                      <strong>{place.seller_name}</strong>
                      <p>
                        {formatPrice(place)} · {place.availability_status ?? "Availability not listed"} ·{" "}
                        {formatFreshness(place.source_captured_at ?? place.last_checked_at)}
                      </p>
                    </div>
                    {place.url ? (
                      <Link className="button" href={place.url}>
                        Open retailer page
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviewed places to buy are attached yet.</p>
            )}
          </div>
        ) : null}
        <div className="card">
          <p className="storefront-kicker">Product summary</p>
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
                  {toiletPaperPreview ? (
                    <div>
                      <h4>What Mishava found</h4>
                      <p>
                        This is an early preview. Mishava is showing reviewed
                        evidence, source context, and evidence gaps so a shopper
                        can understand what is known and what is still missing.
                        Scores remain pending when evidence is incomplete.
                      </p>
                      <p>
                        Personal match appears only when Shopping Priorities
                        and reviewed evidence are both sufficient.
                        This is not medical advice; Mishava does not guarantee
                        that a product is safe or suitable for any medical
                        condition. Comfort, fragrance-free, or
                        sensitivity-related claims are shown only when
                        source-supported. Ask a medical professional for
                        medical suitability.
                      </p>
                      <p>{toiletPaperPreview.disclaimer}</p>
                      <div className="status-row">
                        <span className="tag tag-score">
                          Score not ready yet
                        </span>
                        <span className="tag tag-score">
                          Personal match is not ready yet
                        </span>
                        <span className="tag tag-source">
                          Not a completed public score
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <h4>What Mishava still needs</h4>
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
                        Still needed before a final score:{" "}
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
                    <h4>Company/source information</h4>
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
                  <div>
                    <h4>What Mishava is checking</h4>
                    <p>
                      These dimensions are preview signals only. They do not
                      create a final score, and unreviewed research tasks do not
                      become score facts.
                    </p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Dimension</th>
                          <th>Status</th>
                          <th>Evidence context</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toiletPaperDimensions.map((dimension) => (
                          <tr key={dimension.label}>
                            <td>{dimension.label}</td>
                            <td>{dimension.status}</td>
                            <td>{dimension.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4>Source details</h4>
                    <p>
                      Mishava separates product, company, supplier, and seller
                      evidence. A source can support one claim while leaving
                      other claims unproven.
                    </p>
                    <div className="card-grid">
                      {evidenceSources.map((source) => (
                        <div className="card" key={`${source.title}-${source.url}`}>
                          <h5>{source.title}</h5>
                          <p className="product-meta">
                            {source.type} · {source.confidence}
                          </p>
                          <div className="status-row">
                            <span className="tag tag-source">
                              Source {source.reviewedStatus}
                            </span>
                            <span className="tag">
                              {formatFreshness(source.reviewedDate)}
                            </span>
                          </div>
                          <p>
                            <strong>Claim summary:</strong> {source.claimSummary}
                          </p>
                          <p>
                            <strong>What this source supports:</strong>{" "}
                            {source.supports}
                          </p>
                          <p>
                            <strong>What this source does not prove:</strong>{" "}
                            {source.doesNotProve}
                          </p>
                          <p>
                            <strong>Missing evidence gaps:</strong> {source.gaps}
                          </p>
                          {source.url ? (
                            <Link href={source.url}>Open evidence source</Link>
                          ) : (
                            <p>Source URL not available for public review.</p>
                          )}
                        </div>
                      ))}
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
