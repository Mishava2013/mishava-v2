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

  return (
    <>
      <PageHeader eyebrow="Shared NGO report" title={shared.report.title}>
        This report summary was shared by the NGO for the stated purpose below.
        It does not expose the full organization workspace or raw evidence by
        default.
      </PageHeader>

      <section className="section">
        <div className="record-header">
          <div>
            <span className="tag">Shared by the NGO</span>
            <h2>{shared.report.title}</h2>
            <p>
              {shared.template?.name ?? "Template not listed"} ·{" "}
              {shared.report.approval_status}
            </p>
          </div>
          <div className="status-row">
            <span className="tag">Shared report summary</span>
            <span className="tag">Raw evidence not exposed</span>
            <span className="tag">No public score has been created</span>
          </div>
        </div>

        <div className="metric-grid">
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
            <strong>
              {shared.grant.expires_at
                ? new Date(shared.grant.expires_at).toLocaleDateString()
                : "No expiration"}
            </strong>
          </div>
        </div>

        <div className="evidence-panel">
          <h3>Draft/provisional trust context</h3>
          <p>
            Trust context is provisional. This shared view includes only report
            summary information, allowed evidence summaries, and selected
            accepted claims.
          </p>
          <div className="status-row">
            <span className="tag">Trust context is provisional</span>
            <span className="tag">Exports not enabled yet</span>
            <span className="tag">No raw evidence files</span>
          </div>
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
                  Raw notes, source files, internal URLs, and workspace details
                  are not included in this shared view.
                </p>
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
