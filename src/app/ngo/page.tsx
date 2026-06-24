import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ngoTiers } from "@/lib/ngo";

const valueCards = [
  {
    title: "Create account",
    body: "Save your work privately.",
  },
  {
    title: "Add NGO profile",
    body: "Add your NGO name and basic details.",
  },
  {
    title: "Organize evidence",
    body: "Keep files, links, and notes together.",
  },
  {
    title: "Share reports later",
    body: "Share only what someone needs to see.",
  },
];

const nextSteps = [
  {
    step: "1",
    title: "Create your account",
  },
  {
    step: "2",
    title: "Add your NGO name",
  },
  {
    step: "3",
    title: "Upload or list evidence",
  },
  {
    step: "4",
    title: "Build a report when ready",
  },
];

const planGuidance: Record<string, string> = {
  free_ngo: "Start organizing a basic profile.",
  grassroots: "For small NGOs getting evidence organized.",
  growth: "For NGOs preparing reports and sharing with funders.",
  trust_pro: "For larger or more evidence-heavy organizations.",
  network: "For portfolio or network reporting.",
};

export default function NgoPage() {
  const ngoSignUpHref = "/auth/sign-up?next=%2Fngo%2Fonboarding&surface=ngo";

  return (
    <>
      <PageHeader
        eyebrow="NGO"
        title="Keep NGO proof organized, private, and ready."
      >
        Mishava helps your organization keep proof in one private place. This
        can include unpaid wages, unsafe work, retaliation, harassment,
        discrimination, or other harm.
      </PageHeader>

      <section className="ngo-public-hero">
        <div className="hero-actions">
          <Link className="button primary" href={ngoSignUpHref}>
            Create your account and NGO profile
          </Link>
          <Link className="button" href="/ngo/reports">
            See how reports work
          </Link>
        </div>
        <p className="ngo-trust-line">
          You choose what stays private and what can be shared later. A plan
          never changes trust outcomes.
        </p>
      </section>

      <section className="section">
        <h2>What happens next</h2>
        <div className="ngo-flow-grid">
          {nextSteps.map((item) => (
            <div className="card ngo-step-card" key={item.step}>
              <span className="ngo-step-number">{item.step}</span>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Why worker-rights groups and NGOs need this</h2>
        <p className="section-intro">
          Start with one case, one worksite, or one issue. Add proof now and
          build a private packet or report later.
        </p>
        <div className="card-grid ngo-value-grid">
          {valueCards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section ngo-guardrails">
        <h2>Built for careful evidence</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Private first</h3>
            <p>
              Worker names, files, and notes stay private unless your
              organization chooses to share them.
            </p>
          </div>
          <div className="card">
            <h3>Missing proof is okay</h3>
            <p>
              You can start with what you have. Add more proof later when it is
              safe or available.
            </p>
          </div>
          <div className="card">
            <h3>Review before sharing</h3>
            <p>
              A person reviews what is known, what is missing, and what is safe
              to share.
            </p>
          </div>
        </div>
      </section>

      <section className="section ngo-pricing-section">
        <h2>Choose your starting point</h2>
        <p className="section-intro">
          Create a free account and start with a basic NGO profile. Add capacity
          later only when your team needs more evidence, reports, sharing, or
          setup support.
        </p>
        <div className="table-scroll" role="region" aria-label="NGO access model">
          <table className="table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Best fit</th>
                <th>Price</th>
                <th>Evidence</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {ngoTiers.map((tier) => (
                <tr key={tier.code}>
                  <td>{tier.name}</td>
                  <td>{planGuidance[tier.code]}</td>
                  <td>{tier.price}</td>
                  <td>{tier.evidenceLimit}</td>
                  <td>{tier.reportAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ngo-pricing-note">
          Plans unlock tools, capacity, setup support, and reporting. They do
          not buy a better trust outcome.
        </p>
      </section>

      <section className="section">
        <div className="hero-actions">
          <Link className="button primary" href={ngoSignUpHref}>
            Create your account and NGO profile
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
