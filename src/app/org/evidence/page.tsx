import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { evidenceIntakeTypes } from "@/lib/ngo";
import { createEvidenceAction } from "./actions";

export default async function OrgEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="Evidence" title="Evidence intake and source tracking.">
        Organizations will upload documents, photos, references, attestations, and
        public records. AI may parse facts, but humans confirm review outcomes.
      </PageHeader>

      {params.created ? (
        <div className="notice" role="status">
          Evidence saved and audit event recorded.
        </div>
      ) : null}

      {params.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(params.error)}
        </div>
      ) : null}

      <section className="section">
        <h2>Manual evidence entry</h2>
        <form action={createEvidenceAction} className="form-grid">
          <div className="field">
            <label htmlFor="title">Evidence title</label>
            <input id="title" name="title" placeholder="Business registration, program report, public source" required />
          </div>
          <div className="field">
            <label htmlFor="source-name">Source name</label>
            <input id="source-name" name="sourceName" placeholder="Agency, NGO, organization, public website" required />
          </div>
          <div className="field">
            <label htmlFor="source-type">Source type</label>
            <select id="source-type" name="sourceType" defaultValue="public_disclosure" required>
              <option value="business_registration">Registration or public record</option>
              <option value="public_disclosure">Public disclosure</option>
              <option value="attestation">Attestation</option>
              <option value="reference">Reference</option>
              <option value="ngo_report">NGO report</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="verification-status">Verification status</label>
            <select id="verification-status" name="verificationStatus" defaultValue="unverified">
              <option value="unverified">Unverified</option>
              <option value="self_attested">Self-attested</option>
              <option value="public_record_checked">Public record checked</option>
              <option value="document_checked">Document checked</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="visibility">Visibility</label>
            <select id="visibility" name="visibility" defaultValue="private">
              <option value="private">Private</option>
              <option value="organization_shared">Organization shared</option>
              <option value="approved_viewer">Approved viewer</option>
              <option value="public_summary">Public summary</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="url">Source URL</label>
            <input id="url" name="url" placeholder="https://example.org/source" />
          </div>
          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" placeholder="What this evidence supports and what remains unverified" />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Save evidence
            </button>
          </div>
        </form>
      </section>

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
