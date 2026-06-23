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
        title="Start an NGO profile, then build clearer funder reports."
      >
        Create your account, add your NGO name, and keep important proof in one
        private place.
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
          Reports stay private until shared. Payment never changes trust
          outcomes.
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
        <h2>Why NGOs need this</h2>
        <p className="section-intro">
          Mishava helps your team stop digging through folders and emails when
          someone asks for proof.
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
        <h2>Built for trust without overclaiming</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Evidence-based, not absolute</h3>
            <p>
              Reports can explain what is supported, incomplete, provisional, or
              still waiting for review.
            </p>
          </div>
          <div className="card">
            <h3>Payment buys tools, not credibility</h3>
            <p>
              Plan tier can unlock capacity and workflows. It does not change
              trust outcomes, rankings, verification, or evidence truth.
            </p>
          </div>
          <div className="card">
            <h3>Human review stays central</h3>
            <p>
              AI assistance can help draft or organize where available, but it
              does not replace human review or create final trust outcomes.
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
                <th>AI access</th>
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
                  <td>{tier.aiAccess}</td>
                  <td>{tier.evidenceLimit}</td>
                  <td>{tier.reportAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ngo-pricing-note">
          Payment unlocks tools, capacity, setup services, and reporting
          workflows. It does not buy a better trust outcome.
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
