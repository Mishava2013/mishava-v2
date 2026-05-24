import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ngoTiers } from "@/lib/ngo";

export default function NgoPage() {
  return (
    <>
      <PageHeader eyebrow="NGO" title="NGO trust profiles, evidence, and funder reports.">
        NGO launches early because it creates credible evidence context for the
        rest of Mishava. Free NGOs get limited self-serve tools; paid tiers add
        report building, scoped sharing, AI-assisted drafting, and stronger workflows.
      </PageHeader>

      <div className="card-grid">
        <div className="card">
          <h3>Evidence intake</h3>
          <p>
            Start with uploaded evidence, photos, manual data entry, and limited
            public-record lookup. AI assistance scales only where pricing can
            cover the cost.
          </p>
        </div>
        <div className="card">
          <h3>Reports</h3>
          <p>
            NGOs can use Mishava templates or create their own reports, with
            manager approval, export controls, and funder-specific visibility.
          </p>
        </div>
        <div className="card">
          <h3>Scoped sharing</h3>
          <p>
            Funders, donors, and partners can be granted limited access by the
            NGO, including what they can see and when they can see it.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>NGO access model</h2>
        <p className="section-intro">
          NGO pricing stays accessible. AI and deeper report workflows are tied
          to paid tiers so Mishava does not create runaway AI cost without revenue.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>AI access</th>
              <th>Evidence</th>
              <th>Reports</th>
            </tr>
          </thead>
          <tbody>
            {ngoTiers.map((tier) => (
              <tr key={tier.code}>
                <td>{tier.name}</td>
                <td>{tier.price}</td>
                <td>{tier.aiAccess}</td>
                <td>{tier.evidenceLimit}</td>
                <td>{tier.reportAccess}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <div className="hero-actions">
          <Link className="button primary" href="/ngo/onboarding">
            Start NGO onboarding
          </Link>
          <Link className="button" href="/ngo/reports">
            Review report tools
          </Link>
          <Link className="button" href="/ngo/sharing">
            Scoped sharing
          </Link>
        </div>
      </section>
    </>
  );
}
