import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function GovPage() {
  return (
    <>
      <PageHeader eyebrow="Government" title="Reserved for public-sector readiness.">
        Mishava Gov is reserved for future public-sector procurement,
        transparency, accessibility, and evidence-review workflows. This area is
        not live for government use yet.
      </PageHeader>

      <div className="notice" role="status">
        Reserved surface: no government procurement claims, certifications, or
        public-sector compliance approvals are made from this placeholder.
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Accessibility path</h3>
          <p>
            Mishava targets accessible product foundations, with formal VPAT or
            Section 508 artifacts only after appropriate review.
          </p>
        </div>
        <div className="card">
          <h3>Security path</h3>
          <p>
            Future public-sector readiness will require stronger security,
            privacy, records, procurement, and incident-response review.
          </p>
        </div>
        <div className="card">
          <h3>Procurement firewall</h3>
          <p>
            Procurement access cannot buy better scores, rankings, verification,
            evidence treatment, or methodology outputs.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>Current trust resources</h2>
        <div className="actions-row">
          <Link className="button" href="/legal/accessibility">
            Accessibility statement
          </Link>
          <Link className="button" href="/legal/security">
            Security overview
          </Link>
          <Link className="button" href="/methodology">
            Methodology
          </Link>
        </div>
      </section>
    </>
  );
}
