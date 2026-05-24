import { PageHeader } from "@/components/PageHeader";

export default function AuditPage() {
  return (
    <>
      <PageHeader eyebrow="Audit / Verification" title="Separated audit work, review, and transparent outcomes.">
        The field auditor who documents an in-person review cannot be the same
        person who confirms the outcome. AI can extract claims, flag problems,
        and compare documents, but human oversight controls final review.
      </PageHeader>
      <div className="card-grid">
        <div className="card">
          <h3>Field audit</h3>
          <p>
            Photos, location records, documents, observations, and source notes
            are uploaded with chain-of-custody style audit events.
          </p>
        </div>
        <div className="card">
          <h3>Reviewer confirmation</h3>
          <p>
            Separate reviewers approve, reject, or request more evidence. No one
            can overwrite outcomes without a visible paper trail.
          </p>
        </div>
        <div className="card">
          <h3>AI assistance</h3>
          <p>
            AI identifies facts, uncertainty, contradictions, unsafe-workplace
            photo concerns, and review triggers. Opinions are not scoring facts.
          </p>
        </div>
      </div>
    </>
  );
}

