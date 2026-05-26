import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoReportDetail } from "@/lib/ngo-evidence-reports";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import {
  createNgoReportShareGrantAction,
  revokeNgoReportShareGrantAction,
  updateNgoReportDraftAction,
} from "./actions";

export default async function OrgReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{
    created?: string;
    error?: string;
    revoked?: string;
    shared?: string;
    updated?: string;
  }>;
}) {
  const { reportId } = await params;
  const query = await searchParams;
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const detail = isSupabaseServerConfigured()
    ? await getNgoReportDetail({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        organizationId,
        reportId,
      })
    : null;

  if (!detail) {
    notFound();
  }

  const updateAction = updateNgoReportDraftAction.bind(null, detail.report.id);
  const createShareGrantAction = createNgoReportShareGrantAction.bind(
    null,
    detail.report.id,
  );
  const selectedEvidenceIds = new Set(detail.report.evidence_item_ids);
  const selectedClaimIds = new Set(detail.report.structured_claim_ids);
  const hasActiveGrant = detail.activeShareGrantCount > 0;
  const generatedAt = new Date().toLocaleDateString();
  const organizationName =
    detail.ngoProfile?.public_name ?? detail.organization?.name ?? "NGO organization";
  const reportStatusLabel =
    hasActiveGrant && detail.report.approval_status === "draft"
      ? "Shared draft"
      : detail.report.approval_status;

  return (
    <>
      <PageHeader eyebrow="Draft report" title={detail.report.title}>
        This report preview is private to your organization. It can be printed
        for internal use, but no public score has been created from this draft
        and raw files remain private by default.
      </PageHeader>

      {query.created ? (
        <div className="notice" role="status">
          Report draft saved privately and audit event recorded.
        </div>
      ) : null}

      {query.updated ? (
        <div className="notice" role="status">
          Report draft updated and audit event recorded.
        </div>
      ) : null}

      {query.shared ? (
        <div className="notice" role="status">
          Share grant created. The report remains private by default and raw
          evidence is not shared.
        </div>
      ) : null}

      {query.revoked ? (
        <div className="notice" role="status">
          Share grant revoked and access blocked.
        </div>
      ) : null}

      {query.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}

      <section className="section report-preview" aria-labelledby="report-preview-title">
        <div className="record-header report-preview-header">
          <div>
            <span className="tag">Draft</span>
            <h2 id="report-preview-title">{detail.report.title}</h2>
            <p>
              {detail.template?.name ?? "Template not listed"} ·{" "}
              {reportStatusLabel} · {detail.report.visibility}
            </p>
          </div>
          <div className="status-row report-controls">
            <PrintReportButton />
            <span className="tag">Private to your organization</span>
            <span className="tag">{hasActiveGrant ? "Shared" : "Not shared"}</span>
            <span className="tag">Raw files are private by default</span>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <span>Organization</span>
            <strong>{organizationName}</strong>
          </div>
          <div className="metric">
            <span>Mission area</span>
            <strong>{detail.ngoProfile?.mission_area ?? "Not provided"}</strong>
          </div>
          <div className="metric">
            <span>Created</span>
            <strong>{new Date(detail.report.created_at).toLocaleDateString()}</strong>
          </div>
          <div className="metric">
            <span>Updated</span>
            <strong>{new Date(detail.report.updated_at).toLocaleDateString()}</strong>
          </div>
          <div className="metric">
            <span>Evidence</span>
            <strong>{detail.selectedEvidence.length} selected</strong>
          </div>
          <div className="metric">
            <span>Accepted claims</span>
            <strong>{detail.selectedAcceptedClaims.length} attached</strong>
          </div>
          <div className="metric">
            <span>Generated</span>
            <strong>{generatedAt}</strong>
          </div>
        </div>

        <div className="report-summary">
          <h3>Organization profile summary</h3>
          <p>
            {detail.organization?.public_summary ||
              detail.ngoProfile?.mission_area ||
              "This NGO has not added a public summary yet."}
          </p>
          <dl className="detail-list">
            <div>
              <dt>Public name</dt>
              <dd>{organizationName}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{detail.organization?.country_code ?? "Not provided"}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>
                {detail.ngoProfile?.website_url ? (
                  <a href={detail.ngoProfile.website_url}>
                    {detail.ngoProfile.website_url}
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
            <div>
              <dt>Profile status</dt>
              <dd>{detail.ngoProfile?.profile_status ?? "draft"}</dd>
            </div>
          </dl>
        </div>

        <div className="evidence-panel">
          <h3>Draft/provisional trust context</h3>
          <p>
            This report is evidence-based but may be incomplete. Trust context
            is provisional until evidence-backed claims are reviewed and
            accepted. No public score has been created unless a published
            Mishava score snapshot is explicitly referenced.
          </p>
          <div className="status-row">
            <span className="tag">Trust context is provisional</span>
            <span className="tag">No public score has been created</span>
            <span className="tag">Not publicly scored</span>
            <span className="tag">
              {hasActiveGrant ? "Scoped sharing enabled" : "Not shared"}
            </span>
          </div>
        </div>

        <div className="report-disclaimer">
          <h3>Report limitations</h3>
          <p>
            This report is based on selected evidence and may not represent a
            complete record. Evidence coverage and recency limits may apply. Raw
            evidence files are not included unless explicitly shared in a future
            approved workflow. Mishava does not guarantee outcomes or provide
            legal, financial, or procurement advice. Mishava also does not
            guarantee funding, donations, ratings, certifications, procurement
            decisions, or other outcomes from this draft report.
          </p>
        </div>
      </section>

      <section className="section report-actions">
        <h2>Scoped sharing</h2>
        <p className="section-intro">
          Share grants are scoped to this report only. They do not expose the
          full organization workspace, unrelated reports, or raw evidence by
          default. Shared, Revoked, and Expires labels show the current access
          state for each grant. Shared reports expose selected summaries unless
          explicitly expanded by a future approved sharing control.
        </p>

        <form action={createShareGrantAction} className="form-grid">
          <div className="field">
            <label htmlFor="recipientName">Recipient name</label>
            <input
              id="recipientName"
              name="recipientName"
              placeholder="Funder, donor, reviewer, or partner"
            />
          </div>
          <div className="field">
            <label htmlFor="recipientEmail">Recipient email</label>
            <input
              id="recipientEmail"
              name="recipientEmail"
              placeholder="reviewer@example.org"
              required
              type="email"
            />
          </div>
          <div className="field">
            <label htmlFor="expiresAt">Expires</label>
            <input id="expiresAt" name="expiresAt" type="date" />
          </div>
          <div className="field full">
            <label htmlFor="purpose">Purpose / note</label>
            <textarea
              id="purpose"
              name="purpose"
              placeholder="Why this recipient is being granted report-summary access"
              required
            />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Create scoped share grant
            </button>
          </div>
        </form>

        {detail.shareGrants.length === 0 ? (
          <EmptyState title="Not shared">
            This report has no share grants. Private reports remain private
            unless a valid active grant exists.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {detail.shareGrants.map((grant) => {
              const revokeAction = revokeNgoReportShareGrantAction.bind(
                null,
                detail.report.id,
                grant.id,
              );

              return (
                <article className="evidence-record" key={grant.id}>
                  <div className="record-header">
                    <div>
                      <span className="tag">{grant.displayStatus}</span>
                      <h3>{grant.granted_to_name || grant.granted_to_email}</h3>
                      <p>{grant.granted_to_email}</p>
                    </div>
                    <span className="score-pill">
                      {grant.expires_at
                        ? `Expires ${new Date(grant.expires_at).toLocaleDateString()}`
                        : "No expiration"}
                    </span>
                  </div>
                  <p className="record-note">
                    Purpose: {grant.purpose}. Raw files are private by default
                    and this grant exposes only the selected report summary.
                  </p>
                  <div className="status-row">
                    <Link className="button" href={`/shared/ngo-reports/${grant.id}`}>
                      Preview shared summary
                    </Link>
                    {grant.isRevocable ? (
                      <form action={revokeAction}>
                        <button className="button danger" type="submit">
                          Revoke
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Selected evidence</h2>
        {detail.selectedEvidence.length === 0 ? (
          <EmptyState title="Report has no evidence selected">
            Add organization-owned evidence below before this report can support
            any trust context.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {detail.selectedEvidence.map((item) => (
              <article className="evidence-record" key={item.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{item.reviewLabel}</span>
                    <h3>{item.title}</h3>
                    <p>
                      {item.source_type} from {item.source_name}
                    </p>
                  </div>
                  <span className="score-pill">{item.visibility}</span>
                </div>
                <p className="record-note">
                  {item.reportAttachmentLabel}. {item.nextStepLabel}.{" "}
                  {item.lifecycle_status === "archived"
                    ? "Archived evidence remains traceable but is labeled and excluded from new report selection by default."
                    : "Raw files are private by default and are not included in print output."}
                </p>
                <dl className="detail-list">
                  <div>
                    <dt>Lifecycle</dt>
                    <dd>
                      {item.lifecycle_status}
                      {item.archived_at
                        ? ` · archived ${new Date(item.archived_at).toLocaleDateString()}`
                        : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>{item.source_name}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{new Date(item.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Selected accepted claims</h2>
        {detail.selectedAcceptedClaims.length === 0 ? (
          <EmptyState title="No accepted claims selected">
            Draft and rejected claims cannot enter this report&apos;s trust
            summary. Add accepted claims when review is complete.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {detail.selectedAcceptedClaims.map((claim) => (
              <article className="evidence-record" key={claim.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">Accepted claim</span>
                    <h3>{claim.statement}</h3>
                    <p>
                      {claim.pillar_id} · {claim.fact_type} · {claim.confidence}
                    </p>
                  </div>
                  <span className="score-pill">{claim.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {detail.excludedClaims.length > 0 ? (
          <div className="notice" role="status">
            This report references {detail.excludedClaims.length} draft or
            rejected claim that will not appear in the trust summary.
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>What is still missing</h2>
        {detail.missingItems.length === 0 ? (
          <p className="section-intro">
            Required draft context is present. Exports and sharing are still not
            enabled.
          </p>
        ) : (
          <ul className="plain-list">
            {detail.missingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="section report-actions">
        <h2>Server exports</h2>
        <p className="section-intro">
          Exports are generated server-side for this private report. Raw
          evidence files, private storage paths, rejected claims, draft claims,
          unrelated organization data, audit internals, and billing identifiers
          are excluded by default.
        </p>
        <div className="status-row">
          <Link
            className="button primary"
            href={`/org/reports/${detail.report.id}/exports/evidence.csv`}
          >
            Download CSV evidence summary
          </Link>
          <Link
            className="button"
            href={`/org/reports/${detail.report.id}/exports/report`}
          >
            Open PDF-ready report view
          </Link>
          <span className="tag">DOCX coming later</span>
        </div>
        <p className="muted-copy">
          The CSV summarizes selected evidence only. The PDF-ready report view
          can be printed or saved as PDF from the browser. These exports are
          evidence-based, may be incomplete, and do not create a public score.
          Shared recipients cannot export reports from their shared view in this
          slice.
        </p>
      </section>

      <section className="section report-actions">
        <h2>Edit private draft</h2>
        <p className="section-intro">
          Updates keep this report private and write an audit event. Rejected or
          draft claims cannot be included in the trust summary.
        </p>
        <form action={updateAction} className="form-grid">
          <div className="field full">
            <label htmlFor="title">Report title</label>
            <input
              id="title"
              name="title"
              defaultValue={detail.report.title}
              required
            />
          </div>

          <fieldset className="field full fieldset-panel">
            <legend>Evidence</legend>
            {detail.evidence.length === 0 ? (
              <p className="muted-copy">
                No evidence yet. Add manual evidence before updating report
                contents.
              </p>
            ) : (
              <div className="checkbox-grid">
                {detail.evidence.map((item) => (
                  <label className="check-card" key={item.id}>
                    <input
                      defaultChecked={selectedEvidenceIds.has(item.id)}
                      name="evidenceItemIds"
                      type="checkbox"
                      value={item.id}
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.reviewLabel} · {item.reportAttachmentLabel}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset className="field full fieldset-panel">
            <legend>Accepted claims</legend>
            {detail.acceptedClaims.length === 0 ? (
              <p className="muted-copy">
                No accepted claims yet. Draft and rejected claims cannot enter
                the report trust summary.
              </p>
            ) : (
              <div className="checkbox-grid">
                {detail.acceptedClaims.map((claim) => (
                  <label className="check-card" key={claim.id}>
                    <input
                      defaultChecked={selectedClaimIds.has(claim.id)}
                      name="structuredClaimIds"
                      type="checkbox"
                      value={claim.id}
                    />
                    <span>
                      <strong>{claim.statement}</strong>
                      <small>
                        {claim.pillar_id} · {claim.fact_type} · accepted
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="field full">
            <button className="button primary" type="submit">
              Update private draft
            </button>
            <Link className="button" href="/org/reports">
              Back to reports
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
