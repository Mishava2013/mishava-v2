import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { requireAuthenticatedSession } from "@/lib/auth-server";
import { getSharedNgoReportByGrant } from "@/lib/ngo-evidence-reports";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function SharedNgoReportPage({
  params,
}: {
  params: Promise<{ grantId: string }>;
}) {
  const { grantId } = await params;
  const session = await requireAuthenticatedSession();
  const shared = isSupabaseServerConfigured()
    ? await getSharedNgoReportByGrant({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        session,
        shareGrantId: grantId,
      })
    : null;

  if (!shared) {
    notFound();
  }

  const organizationName =
    shared.ngoProfile?.public_name ??
    shared.organization?.name ??
    "The sharing NGO";
  const expiresLabel = shared.grant.expires_at
    ? new Date(shared.grant.expires_at).toLocaleDateString()
    : "No expiration";
  const generatedAt = new Date().toLocaleDateString();

  return (
    <>
      <PageHeader eyebrow="Shared NGO report" title={shared.report.title}>
        This limited report summary was shared by {organizationName}. It does
        not expose the full organization workspace or raw private files by
        default.
      </PageHeader>

      <section className="section report-preview" aria-labelledby="shared-report-title">
        <div className="record-header report-preview-header">
          <div>
            <span className="tag">Shared by the NGO</span>
            <h2 id="shared-report-title">{shared.report.title}</h2>
            <p>
              {shared.template?.name ?? "Template not listed"} ·{" "}
              {shared.report.approval_status}
            </p>
          </div>
          <div className="status-row">
            <span className="tag">Shared report summary</span>
            <span className="tag">Raw files not included</span>
            <span className="tag">No full workspace access</span>
            <span className="tag">No public score has been created</span>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <span>Sender NGO</span>
            <strong>{organizationName}</strong>
          </div>
          <div className="metric">
            <span>Purpose</span>
            <strong>{shared.grant.purpose}</strong>
          </div>
          <div className="metric">
            <span>Recipient</span>
            <strong>
              {shared.grant.granted_to_name || shared.grant.granted_to_email}
            </strong>
          </div>
          <div className="metric">
            <span>Created</span>
            <strong>{new Date(shared.report.created_at).toLocaleDateString()}</strong>
          </div>
          <div className="metric">
            <span>Expires</span>
            <strong>{expiresLabel}</strong>
          </div>
          <div className="metric">
            <span>Generated</span>
            <strong>{generatedAt}</strong>
          </div>
        </div>

        <div className="report-summary">
          <h3>Sender profile summary</h3>
          <p>
            {shared.organization?.public_summary ||
              shared.ngoProfile?.mission_area ||
              "The sender has not added a public summary yet."}
          </p>
          <dl className="detail-list">
            <div>
              <dt>Organization</dt>
              <dd>{organizationName}</dd>
            </div>
            <div>
              <dt>Mission area</dt>
              <dd>{shared.ngoProfile?.mission_area ?? "Not provided"}</dd>
            </div>
            <div>
              <dt>Grant status</dt>
              <dd>Active report-summary access. Access expires: {expiresLabel}.</dd>
            </div>
          </dl>
        </div>

        <div className="evidence-panel">
          <h3>Draft/provisional trust context</h3>
          <p>
            This report is evidence-based but may be incomplete. Trust context
            is provisional unless a published Mishava score snapshot is
            explicitly referenced. This shared view includes only report summary
            information, allowed evidence summaries, and selected accepted
            claims.
          </p>
          <div className="status-row">
            <span className="tag">Trust context is provisional</span>
            <span className="tag">Limited to this report</span>
            <span className="tag">No raw private files</span>
          </div>
        </div>

        <div className="report-disclaimer">
          <h3>Shared report limits</h3>
          <p>
            This shared content is limited to this report. It does not provide
            full workspace access, raw private files, unrelated evidence,
            unrelated reports, legal advice, financial advice, or a guaranteed
            outcome. Mishava does not guarantee funding, donations, ratings,
            certifications, procurement decisions, or other outcomes from shared
            report access.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Allowed evidence summaries</h2>
        {shared.selectedEvidence.length === 0 ? (
          <EmptyState title="No evidence summaries selected">
            The NGO has not selected evidence summaries for this shared report.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {shared.selectedEvidence.map((item) => (
              <article className="evidence-record" key={item.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">Evidence summary</span>
                    <h3>{item.title}</h3>
                    <p>
                      {item.source_type} from {item.source_name}
                    </p>
                  </div>
                  <span className="score-pill">{item.verification_status}</span>
                </div>
                <p className="record-note">
                  Raw notes, source files, internal URLs, private file links,
                  and workspace details are not included in this shared view.
                  {item.lifecycle_status === "archived"
                    ? " This evidence is archived and remains labeled for traceability."
                    : ""}
                </p>
                <dl className="detail-list">
                  <div>
                    <dt>Lifecycle</dt>
                    <dd>{item.lifecycle_status}</dd>
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
        {shared.selectedAcceptedClaims.length === 0 ? (
          <EmptyState title="No accepted claims selected">
            Draft and rejected claims are not shown in this shared trust summary.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {shared.selectedAcceptedClaims.map((claim) => (
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
      </section>

      <section className="section">
        <Link className="button" href="/">
          Return to Mishava
        </Link>
      </section>
    </>
  );
}
