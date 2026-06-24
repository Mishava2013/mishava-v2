import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { canManageNgoEvidence } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoEvidenceLibrary } from "@/lib/ngo-evidence-reports";
import {
  evidenceIntakeTypes,
  workerRightsActorTypes,
  workerRightsIndustryTags,
  workerRightsIssueCategories,
} from "@/lib/ngo";
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
      <PageHeader eyebrow="Evidence" title="Add evidence and source notes.">
        Add proof, links, photos, and notes for a case, worksite, issue, packet,
        or report. It is okay if you do not have every item.
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
        <h2>Safe intake links</h2>
        <p className="section-intro">
          Create a private link a worker or client can open without a Mishava
          account. Submissions stay private until your organization reviews
          them.
        </p>
        <Link className="button" href="/org/intake">
          Open safe intake links
        </Link>
      </section>

      <section className="section">
        <h2>Evidence library</h2>
        <p className="section-intro">
          Evidence is private to your organization unless you choose to share a
          packet or report. New files are held for review. Files that are still
          being checked or rejected are blocked from reports, downloads, and
          sharing by default. These files are blocked from new reports,
          downloads, and sharing until review allows use. Draft suggestions,
          when present, stay private until a person reviews them.
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
                    <span>Use status</span>
                    <strong>
                      {item.lifecycle_status === "archived"
                        ? "Hidden from active evidence"
                        : item.lifecycle_status}
                    </strong>
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
                    <span>Draft help</span>
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
                          {file.status} ·{" "}
                          {file.status === "quarantined"
                            ? "held for review"
                            : file.scan_status}{" "}
                          ·{" "}
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
                    <strong>Draft suggestions</strong>
                    <p className="muted-copy">
                      Draft suggestions are private to your organization. A
                      person must review them. A suggestion is not a verified
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
                    <summary>Edit evidence details</summary>
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
                        <label htmlFor={`edit-lifecycle-${item.id}`}>Use status</label>
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
          Add what you have. You can add more later. Do not add information your
          organization is not allowed to keep. Mishava does not give legal
          advice or decide whether harm happened.
        </div>
        {canManageEvidence ? (
        <form action={createEvidenceAction} className="form-grid">
          <div className="field">
            <label htmlFor="title">Proof title</label>
            <input id="title" name="title" placeholder="Paystub, timecard, photo, message, or note" required />
          </div>
          <div className="field">
            <label htmlFor="source-name">Source name</label>
            <input id="source-name" name="sourceName" placeholder="Worker, NGO, employer, agency, or public website" required />
          </div>
          <div className="field">
            <label htmlFor="source-type">Source type</label>
            <select id="source-type" name="sourceType" defaultValue="worker_evidence" required>
              <option value="worker_evidence">Worker proof</option>
              <option value="worker_statement">Worker statement</option>
              <option value="worksite_photo">Worksite photo</option>
              <option value="pay_or_time_record">Pay or time record</option>
              <option value="message_or_letter">Message or letter</option>
              <option value="complaint_or_injury_record">Complaint or injury record</option>
              <option value="public_record">Public record</option>
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
              <option value="private">Keep private</option>
              <option value="organization_shared">Organization shared</option>
              <option value="approved_viewer">Approved viewer</option>
              <option value="public_summary">Public summary</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="lifecycle-status">Use status</label>
            <select id="lifecycle-status" name="lifecycleStatus" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="url">Source URL</label>
            <input id="url" name="url" placeholder="https://example.org/source" />
          </div>
          <div className="field">
            <label htmlFor="worker-issue-category">What issue is this about?</label>
            <select id="worker-issue-category" name="workerIssueCategory" defaultValue="">
              <option value="">Not sure yet</option>
              {workerRightsIssueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="worker-industry-tag">What work is this about?</label>
            <select id="worker-industry-tag" name="workerIndustryTag" defaultValue="">
              <option value="">Not sure yet</option>
              {workerRightsIndustryTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="actor-type">Who was involved?</label>
            <select id="actor-type" name="actorType" defaultValue="">
              <option value="">Not sure yet</option>
              {workerRightsActorTypes.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="worksite-or-employer">Employer or worksite</label>
            <input
              id="worksite-or-employer"
              name="worksiteOrEmployer"
              placeholder="Optional. Add only if safe."
            />
          </div>
          <fieldset className="field full fieldset-panel">
            <legend>Privacy and safety</legend>
            <p className="muted-copy">
              Names and contact details can stay private. Choose “Not sure” if
              your team needs more time.
            </p>
            <div className="form-grid compact-form">
              <div className="field">
                <label htmlFor="share-outside-ngo">Can this be shared outside the NGO?</label>
                <select id="share-outside-ngo" name="shareOutsideNgo" defaultValue="Not sure yet">
                  <option>No</option>
                  <option>Yes</option>
                  <option>Only without names</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="retaliation-concern">Is there a retaliation concern?</label>
                <select id="retaliation-concern" name="retaliationConcern" defaultValue="Not sure">
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="worker-name-private">Should the worker's name stay private?</label>
                <select id="worker-name-private" name="workerNamePrivate" defaultValue="Yes">
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="immigration-concern">Is there an immigration-related threat or fear?</label>
                <select id="immigration-concern" name="immigrationConcern" defaultValue="Not sure">
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="safe-contact-method">Safe contact method</label>
                <select id="safe-contact-method" name="safeContactMethod" defaultValue="Through the NGO only">
                  <option>Phone</option>
                  <option>Text</option>
                  <option>Email</option>
                  <option>Through the NGO only</option>
                  <option>Not safe to contact yet</option>
                </select>
              </div>
            </div>
          </fieldset>
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
              up to 10 MB. A file may still need review before it can support a
              packet or report.
            </p>
          </div>
          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" placeholder="What happened? What proof do you have? What is still missing?" />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Save private proof
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
              Add what you have. It can stay private until your organization
              reviews what is safe to share.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
