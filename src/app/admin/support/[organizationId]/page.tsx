import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { getNgoSupportDetail } from "@/lib/ngo-support";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function AdminSupportDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const detail = isSupabaseServerConfigured()
    ? await getNgoSupportDetail({
        client: createSupabaseServerClient(),
        organizationId,
      })
    : null;

  if (!detail) notFound();

  return (
    <>
      <PageHeader eyebrow="NGO support detail" title={detail.organizationName}>
        Read-only operational summary for support troubleshooting. This page
        does not expose raw evidence file contents and cannot directly edit
        trust outcomes.
      </PageHeader>

      <div className="notice" role="status">
        {detail.rawFileAccessPolicy} {detail.trustOutcomePolicy} Use{" "}
        <Link href="/support">Support</Link> and{" "}
        <Link href="/legal/corrections">Corrections</Link> workflows for intake;
        full ticketing and support actions remain future work.
      </div>

      <section className="section">
        <div className="record-header">
          <div>
            <span className="tag">Support status: {detail.supportStatus}</span>
            <h2>Organization summary</h2>
            <p className="section-intro">
              {detail.publicSummary ?? "No public summary has been added."}
            </p>
          </div>
          <Link className="button" href="/admin/support">
            Back to support dashboard
          </Link>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <span>NGO profile</span>
            <strong>{detail.profileName}</strong>
          </div>
          <div className="metric">
            <span>Profile status</span>
            <strong>{detail.profileStatus}</strong>
          </div>
          <div className="metric">
            <span>Country</span>
            <strong>{detail.countryCode ?? "Not provided"}</strong>
          </div>
          <div className="metric">
            <span>Plan</span>
            <strong>{detail.planName}</strong>
          </div>
          <div className="metric">
            <span>Billing status</span>
            <strong>{detail.billingStatus}</strong>
          </div>
          <div className="metric">
            <span>Mission area</span>
            <strong>{detail.profile?.mission_area ?? "Not provided"}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Team and invites</h2>
        <div className="metric-grid">
          <div className="metric">
            <span>Active members</span>
            <strong>{detail.activeMemberCount}</strong>
          </div>
          <div className="metric">
            <span>Total memberships</span>
            <strong>{detail.memberCount}</strong>
          </div>
          <div className="metric">
            <span>Pending invites</span>
            <strong>{detail.pendingInviteCount}</strong>
          </div>
        </div>

        <div className="evidence-library">
          {detail.members.map((member) => (
            <article className="evidence-record" key={member.id}>
              <div className="record-header">
                <div>
                  <span className="tag">{member.status}</span>
                  <h3>{member.email ?? member.name ?? "Member email unavailable"}</h3>
                  <p>{member.role}</p>
                </div>
                <span className="score-pill">
                  {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>

        {detail.invites.length > 0 ? (
          <div className="evidence-panel">
            <h3>Pending/recent invites</h3>
            <ul className="plain-list">
              {detail.invites.map((invite) => (
                <li key={invite.id}>
                  {invite.email} · {invite.role} · {invite.status}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>Evidence and private files</h2>
        <p className="section-intro">
          File metadata counts are visible for troubleshooting. Raw file
          contents, signed URLs, and storage paths are not shown by default.
        </p>
        <div className="metric-grid">
          <div className="metric">
            <span>Evidence items</span>
            <strong>{detail.evidenceCount}</strong>
          </div>
          <div className="metric">
            <span>Private file metadata records</span>
            <strong>{detail.privateFileCount}</strong>
          </div>
        </div>
        <StatusCounts counts={detail.evidenceStatusCounts} label="Evidence lifecycle" />
        <StatusCounts counts={detail.fileScanStatusCounts} label="File scan status" />
        <div className="evidence-library">
          {detail.evidenceItems.map((item) => (
            <article className="evidence-record" key={item.id}>
              <div className="record-header">
                <div>
                  <span className="tag">{item.lifecycleStatus}</span>
                  <h3>{item.title}</h3>
                  <p>
                    {item.verificationStatus} · {item.visibility}
                  </p>
                </div>
                <span className="score-pill">
                  {item.privateFileCount} private file
                  {item.privateFileCount === 1 ? "" : "s"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Reports and scoped sharing</h2>
        <div className="metric-grid">
          <div className="metric">
            <span>Reports</span>
            <strong>{detail.reportCount}</strong>
          </div>
          <div className="metric">
            <span>Active share grants</span>
            <strong>{detail.activeShareGrantCount}</strong>
          </div>
        </div>
        <StatusCounts counts={detail.reportStatusCounts} label="Report status" />

        {detail.reports.length === 0 ? (
          <EmptyState title="No reports yet">
            Reports will appear here when this NGO creates draft or shared
            report workflows.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {detail.reports.map((report) => (
              <article className="evidence-record" key={report.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{report.status}</span>
                    <h3>{report.title}</h3>
                    <p>{report.visibility}</p>
                  </div>
                  <span className="score-pill">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {detail.shareGrants.length > 0 ? (
          <div className="evidence-panel">
            <h3>Recent share grants</h3>
            <ul className="plain-list">
              {detail.shareGrants.map((grant) => (
                <li key={grant.id}>
                  {grant.recipientEmail} · {grant.status} · report {grant.reportId}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>Billing and entitlement support</h2>
        {detail.billing ? (
          <div className="metric-grid">
            <div className="metric">
              <span>Current plan</span>
              <strong>{detail.billing.plan.name}</strong>
            </div>
            <div className="metric">
              <span>Billing status</span>
              <strong>{detail.billing.billingStatus}</strong>
            </div>
            <div className="metric">
              <span>Stripe status</span>
              <strong>{detail.billing.stripeStatus}</strong>
            </div>
            <div className="metric">
              <span>Storage used</span>
              <strong>{detail.billing.usage.storageBytes} bytes</strong>
            </div>
          </div>
        ) : (
          <EmptyState title="Billing summary unavailable">
            Billing usage could not be loaded for this organization in the
            current environment.
          </EmptyState>
        )}
      </section>

      <section className="section">
        <h2>Recent audit events</h2>
        {detail.recentAuditEvents.length === 0 ? (
          <EmptyState title="No audit events found">
            Audit events will appear here as users take support-relevant actions.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {detail.recentAuditEvents.map((event) => (
              <article className="evidence-record" key={event.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{event.visibility}</span>
                    <h3>{event.action}</h3>
                    <p>{event.reason}</p>
                  </div>
                  <span className="score-pill">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="record-note">
                  {event.subjectTable ?? "No subject table"} ·{" "}
                  {event.subjectId ?? "No subject id"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Support workflow placeholders</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Correction/dispute intake</h3>
            <p>
              Use the public corrections page for intake. Admin status tracking
              is planned, but not implemented in this read-only slice.
            </p>
          </div>
          <div className="card">
            <h3>Access/security issues</h3>
            <p>
              Use support escalation for access concerns. This route does not
              bypass organization privacy or expose raw files by default.
            </p>
          </div>
          <div className="card">
            <h3>Safe interventions</h3>
            <p>
              Invite/share revocation and support notes remain future slices
              unless explicitly implemented with audit events.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function StatusCounts({
  counts,
  label,
}: {
  counts: Record<string, number>;
  label: string;
}) {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;

  return (
    <div className="status-row" aria-label={label}>
      {entries.map(([status, count]) => (
        <span className="tag" key={status}>
          {status}: {count}
        </span>
      ))}
    </div>
  );
}
