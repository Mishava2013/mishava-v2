import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function ResearchPage() {
  return (
    <>
      <PageHeader eyebrow="Research / Media" title="Reserved evidence access for research and media.">
        Mishava research and media access is reserved for future evidence,
        methodology, corrections, and transparency workflows. Shared access must
        protect raw evidence, private organizations, and correction rights.
      </PageHeader>

      <div className="card-grid">
        <div className="card">
          <h3>Evidence context</h3>
          <p>
            Future research access should show source limits, evidence coverage,
            recency, and review status without overclaiming certainty.
          </p>
        </div>
        <div className="card">
          <h3>Corrections</h3>
          <p>
            Researchers and media users should have a clear path to report
            missing context, errors, or disputed evidence.
          </p>
        </div>
        <div className="card">
          <h3>Privacy</h3>
          <p>
            Raw evidence and personal data stay private unless explicitly
            permitted and safe to share.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>Current trust resources</h2>
        <div className="actions-row">
          <Link className="button" href="/methodology">
            Methodology
          </Link>
          <Link className="button" href="/legal/corrections">
            Corrections
          </Link>
          <Link className="button" href="/support">
            Support
          </Link>
        </div>
      </section>
    </>
  );
}
