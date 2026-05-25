import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoReportDetail } from "@/lib/ngo-evidence-reports";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import { updateNgoReportDraftAction } from "./actions";

export default async function OrgReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ created?: string; error?: string; updated?: string }>;
}) {
  const { reportId } = await params;
  const query = await searchParams;
  const { organizationId } = await requireCurrentOrganizationMembership();
  const detail = isSupabaseServerConfigured()
    ? await getNgoReportDetail({
        client: createSupabaseServerClient(),
        organizationId,
        reportId,
      })
    : null;

  if (!detail) {
    notFound();
  }

  const updateAction = updateNgoReportDraftAction.bind(null, detail.report.id);
  const selectedEvidenceIds = new Set(detail.report.evidence_item_ids);
  const selectedClaimIds = new Set(detail.report.structured_claim_ids);

  return (
    <>
      <PageHeader eyebrow="Draft report" title={detail.report.title}>
        This report is private to your organization. Exports and sharing are not
        enabled yet, and no public score has been created from this draft.
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

      {query.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}

      <section className="section">
        <div className="record-header">
          <div>
            <span className="tag">Draft report</span>
            <h2>{detail.report.title}</h2>
            <p>
              {detail.template?.name ?? "Template not listed"} ·{" "}
              {detail.report.approval_status} · {detail.report.visibility}
            </p>
          </div>
          <div className="status-row">
            <span className="tag">Private to your organization</span>
            <span className="tag">Not shared</span>
          </div>
        </div>

        <div className="metric-grid">
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
        </div>

        <div className="evidence-panel">
          <h3>Draft/provisional trust context</h3>
          <p>
            Trust context is provisional until evidence-backed claims are reviewed
            and accepted. No public score has been created from this report.
          </p>
          <div className="status-row">
            <span className="tag">Trust context is provisional</span>
            <span className="tag">No public score has been created</span>
            <span className="tag">Exports not enabled yet</span>
            <span className="tag">Sharing not enabled yet</span>
          </div>
        </div>
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
                  {item.reportAttachmentLabel}. {item.nextStepLabel}.
                </p>
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

      <section className="section">
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
