import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { canManageNgoEvidence } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  getSafeIntakeWorkspace,
  isSafeIntakeLinkOpen,
  type SafeIntakeLinkRow,
  type SafeIntakeSubmissionRow,
} from "@/lib/ngo-safe-intake";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import {
  createSafeIntakeLinkAction,
  reviewSafeIntakeSubmissionAction,
  updateSafeIntakeLinkStatusAction,
} from "./actions";

export default async function OrgSafeIntakePage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    error?: string;
    updated?: string;
  }>;
}) {
  const params = await searchParams;
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const canManage = canManageNgoEvidence(session, organizationId);
  const workspace = isSupabaseServerConfigured()
    ? await getSafeIntakeWorkspace({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        organizationId,
      })
    : { links: [], submissions: [] };

  return (
    <>
      <PageHeader eyebrow="Safe intake" title="Create safe intake links.">
        Create a private link a worker or client can open without a Mishava
        account. This is not a public complaint portal. Your organization
        reviews each submission before it becomes evidence for a packet or report.
      </PageHeader>

      {params.created ? (
        <div className="notice" role="status">
          Safe intake link created. Share it only with the people or intake
          stations you choose.
        </div>
      ) : null}
      {params.updated ? (
        <div className="notice" role="status">
          Safe intake update saved.
        </div>
      ) : null}
      {params.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(params.error)}
        </div>
      ) : null}

      <section className="section">
        <h2>Create a controlled intake link</h2>
        <p className="section-intro">
          Use this for a phone, iPad, intake-center tablet, QR code, text, or
          email. Nothing becomes public automatically. No legal conclusion is
          made from the form.
        </p>

        {canManage ? (
          <form action={createSafeIntakeLinkAction} className="form-grid">
            <div className="field">
              <label htmlFor="title">Link name</label>
              <input
                id="title"
                name="title"
                placeholder="Worker intake link"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="purpose">Who should use this link?</label>
              <input
                id="purpose"
                name="purpose"
                placeholder="Farmworker intake, wage theft clinic, tablet station"
              />
            </div>
            <div className="field">
              <label htmlFor="expiresAt">Optional expiration date</label>
              <input id="expiresAt" name="expiresAt" type="date" />
            </div>
            <div className="field full">
              <label htmlFor="description">Short note for staff</label>
              <textarea
                id="description"
                name="description"
                placeholder="Private staff note about where this link will be used"
              />
            </div>
            <div className="field full">
              <button className="button primary" type="submit">
                Create intake link
              </button>
            </div>
          </form>
        ) : (
          <EmptyState title="Member access required">
            Ask an organization owner or admin to create safe intake links.
          </EmptyState>
        )}
      </section>

      <section className="section">
        <h2>Active and paused links</h2>
        {workspace.links.length === 0 ? (
          <EmptyState title="No safe intake links yet">
            Create a link when your organization is ready to collect private
            intake from a worker, client, or intake station.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {workspace.links.map((link) => (
              <SafeIntakeLinkCard
                canManage={canManage}
                key={link.id}
                link={link}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>NGO-only review queue</h2>
        <p className="section-intro">
          Submissions stay private by default. Review, classify, and decide
          whether they should move into evidence review. Nothing is published
          from this queue.
        </p>
        {workspace.submissions.length === 0 ? (
          <EmptyState title="No intake submissions yet">
            When someone sends an intake form, it will appear here for staff
            review.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {workspace.submissions.map((submission) => (
              <SafeIntakeSubmissionCard
                canManage={canManage}
                key={submission.id}
                submission={submission}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SafeIntakeLinkCard({
  canManage,
  link,
}: {
  canManage: boolean;
  link: SafeIntakeLinkRow;
}) {
  const publicPath = `/intake/${link.token}`;

  return (
    <article className="evidence-record">
      <div className="record-header">
        <div>
          <span className="tag">{isSafeIntakeLinkOpen(link) ? "Open" : "Closed"}</span>
          <h3>{link.title}</h3>
          <p>{link.description || "Private intake link for this organization."}</p>
        </div>
        <span className="score-pill">{link.status}</span>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>Client link</span>
          <strong>
            <Link href={publicPath}>{publicPath}</Link>
          </strong>
        </div>
        <div className="metric">
          <span>Purpose</span>
          <strong>{link.purpose || "Not specified"}</strong>
        </div>
        <div className="metric">
          <span>Expires</span>
          <strong>
            {link.expires_at
              ? new Date(link.expires_at).toLocaleDateString()
              : "No expiration set"}
          </strong>
        </div>
        <div className="metric">
          <span>Privacy</span>
          <strong>NGO-controlled link, not public posting</strong>
        </div>
      </div>
      {canManage ? (
        <form action={updateSafeIntakeLinkStatusAction} className="toolbar">
          <input name="linkId" type="hidden" value={link.id} />
          <label className="sr-only" htmlFor={`status-${link.id}`}>
            Link status
          </label>
          <select id={`status-${link.id}`} name="status" defaultValue={link.status}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="revoked">Revoked</option>
          </select>
          <button className="button" type="submit">
            Save link status
          </button>
        </form>
      ) : null}
    </article>
  );
}

function SafeIntakeSubmissionCard({
  canManage,
  submission,
}: {
  canManage: boolean;
  submission: SafeIntakeSubmissionRow;
}) {
  return (
    <article className="evidence-record">
      <div className="record-header">
        <div>
          <span className="tag">Private intake</span>
          <h3>{submission.issue_category || "Intake needs classification"}</h3>
          <p>
            Sent {new Date(submission.created_at).toLocaleDateString()} ·{" "}
            {submission.worksite_or_employer || "Worksite not provided"}
          </p>
        </div>
        <span className="score-pill">{formatSubmissionStatus(submission.status)}</span>
      </div>

      <div className="metric-grid">
        <Metric label="Issue" value={submission.issue_category || "Not sure"} />
        <Metric label="Work type" value={submission.industry_tag || "Not sure"} />
        <Metric label="Who was involved" value={submission.actor_type || "Not sure"} />
        <Metric
          label="Safe contact"
          value={submission.safe_contact_method || "Not provided"}
        />
        <Metric
          label="Share outside NGO"
          value={submission.share_outside_ngo || "No or not sure"}
        />
        <Metric
          label="Files"
          value={
            submission.attached_file_count > 0
              ? `${submission.attached_file_count} private file attached`
              : "No files attached"
          }
        />
        <Metric
          label="Evidence item"
          value={submission.evidence_item_id ? "Private draft created" : "Pending"}
        />
        <Metric label="Public status" value="Nothing public created" />
      </div>

      {submission.narrative ? (
        <div className="inline-workflow">
          <strong>Tell us what happened</strong>
          <p>{submission.narrative}</p>
        </div>
      ) : null}

      {canManage ? (
        <form action={reviewSafeIntakeSubmissionAction} className="form-grid">
          <input name="submissionId" type="hidden" value={submission.id} />
          <div className="field">
            <label htmlFor={`submission-status-${submission.id}`}>Review status</label>
            <select
              id={`submission-status-${submission.id}`}
              name="status"
              defaultValue={submission.status}
            >
              <option value="pending_review">Needs review</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted_for_evidence_review">
                Move to evidence review
              </option>
              <option value="rejected">Do not use</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor={`review-note-${submission.id}`}>Staff review note</label>
            <textarea
              id={`review-note-${submission.id}`}
              name="reviewNote"
              placeholder="Add a private note for your organization"
              defaultValue={submission.review_note ?? ""}
            />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Save review
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatSubmissionStatus(status: SafeIntakeSubmissionRow["status"]) {
  if (status === "accepted_for_evidence_review") return "Evidence review";
  if (status === "pending_review") return "Needs review";
  if (status === "rejected") return "Do not use";
  return "Reviewed";
}
