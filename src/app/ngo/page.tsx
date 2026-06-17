import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ngoTiers } from "@/lib/ngo";

const valueCards = [
  {
    title: "Stop rebuilding the same funder packet",
    body: "Keep reports, source notes, outcomes, and supporting evidence connected so each new request starts from organized work.",
  },
  {
    title: "Keep evidence organized and reviewable",
    body: "Track documents, claims, links, and report context in one workspace instead of scattered folders and last-minute searches.",
  },
  {
    title: "Show what is verified, pending, and missing",
    body: "Make the state of evidence clear before a report is shared, including gaps that still need review or stronger support.",
  },
  {
    title: "Share limited reports without opening your workspace",
    body: "Give funders, donors, and partners scoped report access while raw files and unrelated organization data stay private by default.",
  },
];

const workflowSteps = [
  {
    step: "1",
    title: "Create an account",
    body: "Use your email and password so Mishava can save your NGO profile privately.",
  },
  {
    step: "2",
    title: "Save your NGO profile",
    body: "Add the basic organization details funders and partners need to understand who you are.",
  },
  {
    step: "3",
    title: "Add evidence later",
    body: "Attach source links, files, notes, and context so claims can be reviewed instead of simply asserted.",
  },
  {
    step: "4",
    title: "Build a report from reviewed evidence",
    body: "Turn selected evidence and accepted facts into a clearer report preview with limitations visible.",
  },
  {
    step: "5",
    title: "Share a scoped report",
    body: "Share only the report a recipient needs, without exposing the whole workspace or raw files by default.",
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
        Create an account first so your organization profile and evidence stay
        private. Then Mishava helps you organize documents, claims, outcomes,
        and reports in one place.
      </PageHeader>

      <section className="ngo-public-hero">
        <div className="hero-actions">
          <Link className="button primary" href={ngoSignUpHref}>
            Create account to start
          </Link>
          <Link className="button" href="/ngo/reports">
            See how reports work
          </Link>
        </div>
        <p className="ngo-trust-line">
          First step: create or sign in to your Mishava account. No paid trust
          outcomes. Reports stay private until shared.
        </p>
      </section>

      <section className="section">
        <h2>Why NGOs need this</h2>
        <p className="section-intro">
          Reporting gets harder when evidence lives across folders, email
          threads, public links, and old board packets. Mishava gives teams a
          calmer way to prepare credible, limited, evidence-based reports.
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

      <section className="section">
        <h2>How Mishava works for NGOs</h2>
        <p className="section-intro">
          Start small, build a reviewable evidence base, and share only the
          report context a recipient needs.
        </p>
        <div className="ngo-flow-grid">
          {workflowSteps.map((item) => (
            <div className="card ngo-step-card" key={item.step}>
              <span className="ngo-step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div className="hero-actions">
          <Link className="button primary" href={ngoSignUpHref}>
            Create account to start
          </Link>
          <Link className="button" href="/ngo/sharing">
            See scoped sharing
          </Link>
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
            Create account to start
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
