import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { getNgoSupportSummaries } from "@/lib/ngo-support";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function AdminSupportPage() {
  const summaries = isSupabaseServerConfigured()
    ? await getNgoSupportSummaries({ client: createSupabaseServerClient() })
    : [];

  const totalEvidence = summaries.reduce(
    (count, summary) => count + summary.evidenceCount,
    0,
  );
  const totalReports = summaries.reduce(
    (count, summary) => count + summary.reportCount,
    0,
  );
  const totalActiveShares = summaries.reduce(
    (count, summary) => count + summary.activeShareGrantCount,
    0,
  );

  return (
    <>
      <PageHeader eyebrow="Admin support" title="NGO support operations.">
        This protected internal view helps Mishava troubleshoot NGO accounts,
        evidence, reports, sharing, team access, billing-plan confusion, and
        recent audit history without exposing raw files or allowing silent trust
        outcome changes.
      </PageHeader>

      <div className="notice" role="status">
        Read-only support console. Admin/support users cannot directly edit
        scores, rankings, evidence truth, verification outcomes, or credibility
        labels from this route. Raw evidence file contents and storage paths are
        not exposed by default.
      </div>

      <section className="section">
        <h2>Support queue summary</h2>
        <div className="metric-grid">
          <div className="metric">
            <span>NGO organizations</span>
            <strong>{summaries.length}</strong>
          </div>
          <div className="metric">
            <span>Evidence items</span>
            <strong>{totalEvidence}</strong>
          </div>
          <div className="metric">
            <span>Reports</span>
            <strong>{totalReports}</strong>
          </div>
          <div className="metric">
            <span>Active share grants</span>
            <strong>{totalActiveShares}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>NGO organizations</h2>
        <p className="section-intro">
          Use this list for support triage only. It shows counts and status
          indicators, not raw evidence files or score-edit controls.
        </p>

        {summaries.length === 0 ? (
          <EmptyState title="No NGO organizations found">
            Supabase may be unconfigured in this environment, or no NGO profiles
            exist yet.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {summaries.map((summary) => (
              <article className="evidence-record" key={summary.organizationId}>
                <div className="record-header">
                  <div>
                    <span className="tag">Support status: {summary.supportStatus}</span>
                    <h3>{summary.organizationName}</h3>
                    <p>
                      {summary.profileName} · {summary.profileStatus} ·{" "}
                      {summary.planName}
                    </p>
                  </div>
                  <Link
                    className="button"
                    href={`/admin/support/${summary.organizationId}`}
                  >
                    View support summary
                  </Link>
                </div>

                <div className="metric-grid">
                  <div className="metric">
                    <span>Members</span>
                    <strong>
                      {summary.activeMemberCount} active / {summary.memberCount} total
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Pending invites</span>
                    <strong>{summary.pendingInviteCount}</strong>
                  </div>
                  <div className="metric">
                    <span>Evidence</span>
                    <strong>{summary.evidenceCount}</strong>
                  </div>
                  <div className="metric">
                    <span>Private files</span>
                    <strong>{summary.privateFileCount} metadata records</strong>
                  </div>
                  <div className="metric">
                    <span>Reports</span>
                    <strong>{summary.reportCount}</strong>
                  </div>
                  <div className="metric">
                    <span>Active shares</span>
                    <strong>{summary.activeShareGrantCount}</strong>
                  </div>
                  <div className="metric">
                    <span>Billing</span>
                    <strong>{summary.billingStatus}</strong>
                  </div>
                  <div className="metric">
                    <span>Latest audit event</span>
                    <strong>{summary.latestAuditAction ?? "None found"}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
