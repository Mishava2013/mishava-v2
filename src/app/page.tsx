import Link from "next/link";
import { trustSurfaces } from "@/lib/sample-data";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">Clear evidence, fair discovery</div>
          <h1>Trust infrastructure for choices people can explain.</h1>
          <p>
            Mishava turns evidence into auditable decision signals for NGOs,
            shoppers, local businesses, suppliers, auditors, and institutions.
            Scores are never sold, boosted, hidden, or improved by payment.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/ngo">
              Build NGO foundation
            </Link>
            <Link className="button" href="/shopping">
              Preview shopping
            </Link>
            <Link className="button" href="/methodology">
              View methodology
            </Link>
          </div>
        </div>
        <aside className="evidence-panel" aria-label="Trust score example">
          <h2 className="panel-title">Score display rule</h2>
          <div className="score-row">
            <div className="score-badge">--</div>
            <p className="score-caption">
              Scores stay hidden until real evidence exists. Shoppers without
              priorities see an Evidence Score. Shoppers with priorities see
              Your Values Score.
            </p>
          </div>
          <div className="metric-grid">
            <div className="metric">
              <span>Coverage</span>
              <strong>Evidence-backed</strong>
            </div>
            <div className="metric">
              <span>Recency</span>
              <strong>Snapshot dated</strong>
            </div>
            <div className="metric">
              <span>Confidence</span>
              <strong>Source quality shown</strong>
            </div>
            <div className="metric">
              <span>Payment firewall</span>
              <strong>No ranking boost</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="section">
        <h2>Release 1 foundation surfaces</h2>
        <p className="section-intro">
          The first build creates the product system, role boundaries, route
          map, audit-log assumptions, and data-safe UI states before any
          score-bearing evidence is imported.
        </p>
        <div className="card-grid">
          {trustSurfaces.map((surface) => (
            <Link className="card" href={surface.href} key={surface.title}>
              <h3>{surface.title}</h3>
              <p>{surface.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
