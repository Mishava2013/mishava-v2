import Link from "next/link";
import { SignInModalButton } from "@/components/SignInModal";

const workspaceItems = [
  "Board reports",
  "Funder reporting",
  "Evidence files",
  "Programs",
  "Locations",
  "Organization records",
];

const workspaceStats = [
  {
    value: "12",
    label: "Evidence items tied to active reporting work",
  },
  {
    value: "4",
    label: "Program areas reviewed in one reporting view",
  },
  {
    value: "Ready",
    label: "Governance defaults saved before reporting begins",
  },
];

const whyNgoCards = [
  {
    title: "Clearer reporting",
    body: "Build reports that are easier for boards, funders, and supporters to understand.",
  },
  {
    title: "Evidence-backed trust",
    body: "Keep files, notes, and supporting documents connected to the right sections and claims.",
  },
  {
    title: "Less reporting scramble",
    body: "Replace scattered folders, last-minute searching, and disconnected reporting workflows.",
  },
];

const steps = [
  {
    number: "1",
    title: "Organize",
    body: "Bring reports, evidence, programs, locations, and organization details into one secure workspace.",
  },
  {
    number: "2",
    title: "Connect",
    body: "Keep supporting documents tied to the right sections so reporting stays consistent and credible.",
  },
  {
    number: "3",
    title: "Present",
    body: "Share stronger reporting with boards, funders, partners, and supporters.",
  },
];

export default function NgoSignInPage() {
  return (
    <div className="ngo-signin-page">
      <section className="ngo-signin-hero">
        <div>
          <p className="eyebrow">Mishava for NGOs</p>
          <h1>Show your impact with evidence, not scramble.</h1>
          <p>
            A focused NGO workspace for evidence files, board reports, funder
            updates, and scoped sharing. New organizations should request access
            first; approved users can sign in from a popup without leaving this
            page.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/support">
              Request access
            </Link>
            <Link className="button" href="#how-mishava-works">
              See how it works
            </Link>
          </div>
        </div>
        <div className="auth-card ngo-signin-panel">
          <p className="eyebrow">Approved access</p>
          <h2>Sign in without losing context</h2>
          <p>
            Sign in opens in a popup so the NGO overview stays visible while
            you access your workspace.
          </p>
          <SignInModalButton className="button primary" nextPath="/app" />
          <div className="auth-links">
            <Link href="/auth/reset-password">Reset password</Link>
            <Link href="/auth/sign-up?next=/ngo/onboarding">Create NGO account</Link>
          </div>
        </div>
      </section>

      <section className="ngo-workspace-preview" aria-label="NGO workspace preview">
        <div className="card">
          <p className="eyebrow">Workspace preview</p>
          <h2>What teams bring into Mishava</h2>
          <div className="workspace-item-grid">
            {workspaceItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="eyebrow">Inside the workspace</p>
          <h2>Keep the reporting picture in one place</h2>
          <p>
            Mishava is designed to help teams see what is ready, what still
            needs evidence, and what is ready to share with boards or funders.
          </p>
          <div className="workspace-stat-grid">
            {workspaceStats.map((stat) => (
              <div className="workspace-stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Why NGOs use Mishava</p>
        <h2>Why NGOs use Mishava</h2>
        <div className="card-grid">
          {whyNgoCards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="how-mishava-works">
        <p className="eyebrow">How Mishava works</p>
        <h2>How Mishava works</h2>
        <div className="card-grid">
          {steps.map((step) => (
            <div className="card step-card" key={step.number}>
              <span className="step-number" aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Built for organizations that need clarity</p>
        <h2>Built for organizations that need credibility and clarity</h2>
        <p className="section-intro">
          Mishava is designed for teams that need to present their work with
          order, evidence, and trust. Raw evidence stays private unless your
          organization chooses what to share.
        </p>
      </section>
    </div>
  );
}
