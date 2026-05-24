import { PageHeader } from "@/components/PageHeader";

export default function BusinessPage() {
  return (
    <>
      <PageHeader eyebrow="Business" title="Business profiles without paid trust treatment.">
        Businesses can claim profiles, link externally, use hosted Mishava pages,
        manage evidence, join supplier or seller workflows, and pursue verification.
        Hosting and tools never improve ranking.
      </PageHeader>
      <div className="card-grid">
        <div className="card">
          <h3>Small business trust pathway</h3>
          <p>
            Lightweight evidence can include registration, licenses, photos,
            owner attestations, references, redacted invoices, and public records.
          </p>
        </div>
        <div className="card">
          <h3>Catalog foundation</h3>
          <p>
            Local stores and suppliers will be able to list products they sell,
            with AI-assisted setup where the plan covers AI cost.
          </p>
        </div>
        <div className="card">
          <h3>Claim flow</h3>
          <p>
            Claimed changes require audit trails. Corrections stay transparent
            even when Mishava made the mistake.
          </p>
        </div>
      </div>
    </>
  );
}

