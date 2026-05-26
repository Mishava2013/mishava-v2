import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function CorporatePage() {
  return (
    <>
      <PageHeader eyebrow="Corporate" title="Enterprise trust workflows without paid trust outcomes.">
        Corporate access is reserved for larger organizations that need evidence
        workflows, supplier review, procurement support, and internal reporting.
        Payment can unlock tools and capacity, not score, ranking, verification,
        or credibility.
      </PageHeader>

      <div className="card-grid">
        <div className="card">
          <h3>Supplier review</h3>
          <p>
            Corporate teams can prepare supplier evidence review workflows
            without changing Mishava methodology outputs.
          </p>
        </div>
        <div className="card">
          <h3>Procurement readiness</h3>
          <p>
            Future procurement tools will separate workflow access from trust
            conclusions, corrections, and evidence review.
          </p>
        </div>
        <div className="card">
          <h3>Trust firewall</h3>
          <p>
            Hosted tools, subscriptions, and support services cannot buy better
            rankings, verification labels, or score treatment.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>Useful links</h2>
        <div className="actions-row">
          <Link className="button" href="/business">
            Business portal
          </Link>
          <Link className="button" href="/methodology">
            Methodology
          </Link>
          <Link className="button" href="/legal/no-paid-trust-outcomes">
            No paid trust outcomes
          </Link>
        </div>
      </section>
    </>
  );
}
