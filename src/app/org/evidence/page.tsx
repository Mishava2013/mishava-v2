import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { evidenceIntakeTypes } from "@/lib/ngo";

export default function OrgEvidencePage() {
  return (
    <>
      <PageHeader eyebrow="Evidence" title="Evidence intake and source tracking.">
        Organizations will upload documents, photos, references, attestations, and
        public records. AI may parse facts, but humans confirm review outcomes.
      </PageHeader>
      <div className="card-grid">
        {evidenceIntakeTypes.map((type) => (
          <div className="card" key={type}>
            <h3>{type}</h3>
            <p>
              Each item stores source, submitter, confidence, visibility,
              review state, and whether AI extraction needs human confirmation.
            </p>
          </div>
        ))}
      </div>
      <EmptyState title="No evidence uploaded">
        Evidence records will appear here after real uploads or public-record
        lookups. Free tiers rely mostly on manual entry and limited uploads.
      </EmptyState>
    </>
  );
}
