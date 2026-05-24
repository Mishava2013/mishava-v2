import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoEvidenceLibrary } from "@/lib/ngo-evidence-reports";
import { evidenceIntakeTypes } from "@/lib/ngo";
import {
  createEvidenceAction,
  createStructuredClaimDraftAction,
} from "./actions";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function OrgEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { organizationId } = await requireCurrentOrganizationMembership();
  const evidenceLibrary = isSupabaseServerConfigured()
    ? await getNgoEvidenceLibrary({
        client: createSupabaseServerClient(),
        organizationId,
      })
    : [];

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
        <h2>Evidence library</h2>
        <p className="section-intro">
          Draft evidence appears here with its visibility, review status, linked
          structured claims, and audit trail indicator. This is still a beta
          workflow: evidence can support reports only after claims are reviewed.
        </p>

        {evidenceLibrary.length === 0 ? (
          <EmptyState title="No evidence uploaded">
            Evidence records will appear here after real manual entries or
            public-record lookups. Free tiers rely mostly on manual entry and
            limited uploads.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {evidenceLibrary.map((item) => (
              <article className="evidence-record" key={item.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{item.draftLabel}</span>
                    <h3>{item.title}</h3>
                    <p>
                      {item.source_type} from {item.source_name}
                    </p>
                  </div>
                  <span className="score-pill">{item.verification_status}</span>
                </div>

                <div className="metric-grid">
                  <div className="metric">
                    <span>Visibility</span>
                    <strong>{item.visibility}</strong>
                  </div>
                  <div className="metric">
                    <span>Created</span>
                    <strong>{new Date(item.created_at).toLocaleDateString()}</strong>
                  </div>
                  <div className="metric">
                    <span>Structured claims</span>
                    <strong>
                      {item.linkedStructuredClaimsCount} linked ·{" "}
                      {item.linkedAcceptedClaimsCount} accepted
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Audit trail</span>
                    <strong>{item.hasAuditTrail ? "Recorded" : "Pending"}</strong>
                  </div>
                </div>

                {item.url ? (
                  <p className="record-note">
                    Source URL: <a href={item.url}>{item.url}</a>
                  </p>
                ) : null}
                {item.notes ? <p className="record-note">{item.notes}</p> : null}

                <details className="inline-workflow">
                  <summary>Create structured claim draft</summary>
                  <form action={createStructuredClaimDraftAction} className="form-grid compact-form">
                    <input name="evidenceItemId" type="hidden" value={item.id} />
                    <div className="field">
                      <label htmlFor={`pillar-${item.id}`}>Pillar</label>
                      <select id={`pillar-${item.id}`} name="pillarId" defaultValue="governance">
                        <option value="labor">Labor</option>
                        <option value="environment">Environment</option>
                        <option value="governance">Governance</option>
                        <option value="community">Community</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor={`fact-${item.id}`}>Claim type</label>
                      <select id={`fact-${item.id}`} name="factType" defaultValue="neutral">
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                        <option value="corrective_action">Corrective action</option>
                        <option value="unknown">Unknown</option>
                        <option value="gap">Gap</option>
                      </select>
                    </div>
                    <div className="field full">
                      <label htmlFor={`statement-${item.id}`}>Claim statement</label>
                      <textarea
                        id={`statement-${item.id}`}
                        name="statement"
                        placeholder="State only what this evidence supports."
                        required
                      />
                    </div>
                    <div className="field full">
                      <button className="button" type="submit">
                        Save claim draft
                      </button>
                    </div>
                  </form>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>

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
    </>
  );
}
