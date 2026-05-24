import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Mishava exists to make trust clearer.">
        Mishava is built around transparency, human dignity, fair discovery, and
        evidence-backed accountability. It is meant to serve consumers, NGOs,
        small businesses, auditors, institutions, and the people affected by commerce.
      </PageHeader>
      <div className="card-grid">
        <div className="card">
          <h3>Values</h3>
          <p>
            Choice matters. Mishava helps people make choices through values
            they understand, evidence they can inspect, and explanations they can trust.
          </p>
        </div>
        <div className="card">
          <h3>Transparency</h3>
          <p>
            Evidence is retained, corrections are documented, and methodology
            changes are versioned with dates and public explanations.
          </p>
        </div>
        <div className="card">
          <h3>People</h3>
          <p>
            The company story should ultimately center the people who make
            Mishava work: reviewers, NGOs, builders, auditors, and communities.
          </p>
        </div>
      </div>
      <section className="section">
        <Link className="button" href="/about/founder">
          Founder note
        </Link>
      </section>
    </>
  );
}

