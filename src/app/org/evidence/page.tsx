import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { canManageNgoEvidence } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoEvidenceLibrary } from "@/lib/ngo-evidence-reports";
import { evidenceIntakeTypes } from "@/lib/ngo";
import {
  archiveEvidenceAction,
  createEvidenceAction,
  createStructuredClaimDraftAction,
  reviewAiEvidenceSuggestionAction,
  updateEvidenceMetadataAction,
  uploadEvidenceFileAction,
} from "./actions";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function OrgEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const canManageEvidence = canManageNgoEvidence(session, organizationId);
  const evidenceLibrary = isSupabaseServerConfigured()
    ? await getNgoEvidenceLibrary({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
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
      {params.updated ? (
        <div className="notice" role="status">
          Evidence update saved and audit event recorded.
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
          Raw files are private to your organization and are not shared by
          default. New uploads are pending/not scanned until a scanner or
          authorized review clears them; quarantined or rejected files are
          blocked from new reports, exports, and sharing by default. AI
          suggestions, when present, are private draft assistance only and do
          not become verified facts or trust outcomes without human review.
        </p>

        {evidenceLibrary.length === 0 ? (
          <EmptyState title="No evidence yet">
            Add manual evidence first. Evidence records will appear here after
            real entries or public-record lookups, and they remain private to
            your organization unless future sharing explicitly allows access.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {evidenceLibrary.map((item) => (
              <article className="evidence-record" key={item.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{item.draftLabel}</span>
                    {item.lifecycle_status === "archived" ? (
                      <span className="tag">Archived</span>
                    ) : null}
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
                    <strong>
                      {item.visibility === "private"
                        ? "Private to your organization"
                        : item.visibility}
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Review state</span>
                    <strong>{item.reviewLabel}</strong>
                  </div>
                  <div className="metric">
                    <span>Lifecycle</span>
                    <strong>{item.lifecycle_status}</strong>
                  </div>
                  <div className="metric">
                    <span>Files</span>
                    <strong>{item.fileAttachmentLabel}</strong>
                  </div>
                  <div className="metric">
                    <span>File security</span>
                    <strong>{item.fileScanStatusLabel}</strong>
                  </div>
                  <div className="metric">
                    <span>Structured claims</span>
                    <strong>
                      {item.linkedStructuredClaimsCount} linked ·{" "}
                      {item.linkedAcceptedClaimsCount} accepted
                    </strong>
                  </div>
                  <div className="metric">
                    <span>AI assistance</span>
                    <strong>{item.aiSuggestionLabel}</strong>
                  </div>
                  <div className="metric">
                    <span>Reports</span>
                    <strong>{item.reportAttachmentLabel}</strong>
                  </div>
                </div>

                <div className="metric-grid">
                  <div className="metric">
                    <span>Created</span>
                    <strong>{new Date(item.created_at).toLocaleDateString()}</strong>
                  </div>
                  <div className="metric">
                    <span>Audit trail</span>
                    <strong>{item.hasAuditTrail ? "Recorded" : "Pending"}</strong>
                  </div>
                  <div className="metric">
                    <span>Available now</span>
                    <strong>{item.nextStepLabel}</strong>
                  </div>
                  <div className="metric">
                    <span>File privacy</span>
                    <strong>Raw files are private and unavailable until cleared</strong>
                  </div>
                </div>

                {item.url ? (
                  <p className="record-note">
                    Source URL: <a href={item.url}>{item.url}</a>
                  </p>
                ) : null}
                {item.notes ? <p className="record-note">{item.notes}</p> : null}
                {item.fileSummaries.length > 0 ? (
                  <div className="inline-workflow">
                    <strong>Attached private files</strong>
                    <ul>
                      {item.fileSummaries.map((file) => (
                        <li key={file.id}>
                          {file.original_filename} · v{file.version_number} ·{" "}
                          {file.status} · {file.scan_status} ·{" "}
                          {Math.round(file.file_size_bytes / 1024)} KB
                          {file.quarantine_reason
                            ? ` · ${file.quarantine_reason}`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {item.aiSuggestionSummaries.length > 0 ? (
                  <div className="inline-workflow">
                    <strong>AI-assisted suggestions</strong>
                    <p className="muted-copy">
                      AI-assisted suggestions are private to your organization.
                      Human review is required. A suggestion is not a verified
                      fact and does not affect score, ranking, verification, or
                      report trust context by itself.
                    </p>
                    <ul>
                      {item.aiSuggestionSummaries.map((suggestion) => (
                        <li key={suggestion.id}>
                          <strong>{suggestion.status}</strong>:{" "}
                          {suggestion.suggested_text}
                          {suggestion.created_structured_claim_id
                            ? " · reviewed draft claim created"
                            : ""}
                          {canManageEvidence &&
                          (suggestion.status === "suggested" ||
                            suggestion.status === "reviewed") ? (
                            <form action={reviewAiEvidenceSuggestionAction} className="toolbar">
                              <input name="suggestionId" type="hidden" value={suggestion.id} />
                              <label className="sr-only" htmlFor={`review-note-${suggestion.id}`}>
                                Review note
                              </label>
                              <input
                                id={`review-note-${suggestion.id}`}
                                name="reviewNote"
                                placeholder="Optional review note"
                              />
                              <button
                                className="button"
                                name="reviewStatus"
                                type="submit"
                                value="accepted"
                              >
                                Accept as reviewed draft claim
                              </button>
                              <button
                                className="button"
                                name="reviewStatus"
                                type="submit"
                                value="rejected"
                              >
                                Reject suggestion
                              </button>
                            </form>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {canManageEvidence && item.lifecycle_status !== "archived" ? (
                  <details className="inline-workflow">
                    <summary>Edit evidence metadata</summary>
                    <form action={updateEvidenceMetadataAction} className="form-grid compact-form">
                      <input name="evidenceItemId" type="hidden" value={item.id} />
                      <div className="field">
                        <label htmlFor={`edit-title-${item.id}`}>Title</label>
                        <input id={`edit-title-${item.id}`} name="title" defaultValue={item.title} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-source-${item.id}`}>Source name</label>
                        <input id={`edit-source-${item.id}`} name="sourceName" defaultValue={item.source_name} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-type-${item.id}`}>Source type</label>
                        <input id={`edit-type-${item.id}`} name="sourceType" defaultValue={item.source_type} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-lifecycle-${item.id}`}>Lifecycle</label>
                        <select id={`edit-lifecycle-${item.id}`} name="lifecycleStatus" defaultValue={item.lifecycle_status}>
                          <option value="draft">Draft</option>
                          <option value="submitted">Submitted</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-visibility-${item.id}`}>Visibility</label>
                        <select id={`edit-visibility-${item.id}`} name="visibility" defaultValue={item.visibility}>
                          <option value="private">Private</option>
                          <option value="organization_shared">Organization shared</option>
                          <option value="approved_viewer">Approved viewer</option>
                          <option value="public_summary">Public summary</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-url-${item.id}`}>Source URL</label>
                        <input id={`edit-url-${item.id}`} name="url" defaultValue={item.url ?? ""} />
                      </div>
                      <div className="field full">
                        <label htmlFor={`edit-notes-${item.id}`}>Notes</label>
                        <textarea id={`edit-notes-${item.id}`} name="notes" defaultValue={item.notes ?? ""} />
                      </div>
                      <div className="field full">
                        <button className="button" type="submit">
                          Save evidence updates
                        </button>
                      </div>
                    </form>
                  </details>
                ) : null}

                {canManageEvidence && item.lifecycle_status !== "archived" ? (
                  <details className="inline-workflow">
                    <summary>Attach or replace private file</summary>
                    <p className="muted-copy">
                      Files are stored privately under this organization. PDF,
                      PNG, JPG, WebP, TXT, CSV, or DOCX only, up to 10 MB.
                      New uploads are not treated as clean until a scanner or
                      authorized review supports that status.
                    </p>
                    <form action={uploadEvidenceFileAction} className="form-grid compact-form">
                      <input name="evidenceItemId" type="hidden" value={item.id} />
                      <div className="field full">
                        <label htmlFor={`file-${item.id}`}>Evidence file</label>
                        <input
                          id={`file-${item.id}`}
                          name="evidenceFile"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.docx,application/pdf,image/png,image/jpeg,image/webp,text/plain,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          required
                        />
                      </div>
                      <div className="field full">
                        <button className="button" type="submit">
                          Attach private file
                        </button>
                      </div>
                    </form>
                  </details>
                ) : null}

                {canManageEvidence && item.lifecycle_status !== "archived" ? (
                  <form action={archiveEvidenceAction} className="toolbar">
                    <input name="evidenceItemId" type="hidden" value={item.id} />
                    <button className="button" type="submit">
                      Archive evidence
                    </button>
                  </form>
                ) : null}

                {canManageEvidence && item.lifecycle_status !== "archived" ? (
                  <details className="inline-workflow">
                    <summary>Create structured claim draft</summary>
                    <p className="muted-copy">
                      Evidence entered but not reviewed can become a draft claim.
                      Only accepted claims can support report trust summaries.
                    </p>
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
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Manual evidence entry</h2>
        <div className="notice" role="note">
          Submit only evidence your organization is legally allowed to provide
          and store. Evidence may be incomplete or require review. Mishava does
          not guarantee funding, donations, ratings, certifications,
          procurement decisions, or other outcomes from submitted evidence.
          AI assistance is not enabled for raw-file processing in this slice;
          future AI suggestions require human review before becoming structured
          claim drafts.
        </div>
        {canManageEvidence ? (
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
            <label htmlFor="lifecycle-status">Lifecycle status</label>
            <select id="lifecycle-status" name="lifecycleStatus" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="url">Source URL</label>
            <input id="url" name="url" placeholder="https://example.org/source" />
          </div>
          <div className="field full">
            <label htmlFor="evidence-file">Private file attachment</label>
            <input
              id="evidence-file"
              name="evidenceFile"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.docx,application/pdf,image/png,image/jpeg,image/webp,text/plain,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <p className="muted-copy">
              Optional. Raw files are private to your organization and are not
              shared by default. PDF, PNG, JPG, WebP, TXT, CSV, or DOCX only,
              up to 10 MB. Shared reports expose selected summaries unless a
              future explicit raw-file sharing control is added and used.
              Upload acceptance does not mean a file is malware-free, reviewed,
              or accepted for trust context.
            </p>
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
        ) : (
          <EmptyState title="Evidence editing requires member access">
            Your role can view evidence allowed for this workspace, but cannot
            create, edit, upload, or archive evidence.
          </EmptyState>
        )}
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
