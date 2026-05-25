import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoReportWorkspace } from "@/lib/ngo-evidence-reports";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import { createNgoReportDraftAction } from "./actions";

export default async function OrgReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { organizationId } = await requireCurrentOrganizationMembership();
  const workspace = isSupabaseServerConfigured()
    ? await getNgoReportWorkspace({
        client: createSupabaseServerClient(),
        organizationId,
      })
    : {
        ngoProfile: null,
        templates: [],
        reports: [],
        evidence: [],
        acceptedClaims: [],
        draftSnapshots: [],
      };

  return (
    <>
      <PageHeader eyebrow="Reports" title="Report builder and scoped sharing.">
        Reports can begin from real evidence and accepted claims. Exports, AI
        rebuilding, and public sharing remain intentionally out of scope for this
        slice.
      </PageHeader>

      {params.created ? (
        <div className="notice" role="status">
          Report draft saved privately and audit event recorded.
        </div>
      ) : null}

      {params.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(params.error)}
        </div>
      ) : null}

      <section className="section">
        <h2>Create draft report</h2>
        <p className="section-intro">
          Reports are private by default. They can reference selected evidence,
          accepted claims, and an optional private draft score snapshot. No score
          is invented when scoring output is incomplete.
        </p>

        {workspace.templates.length === 0 || workspace.evidence.length === 0 ? (
          <EmptyState title="Evidence and templates are required">
            Add real evidence before creating report drafts. Active templates
            must also exist in the database.
          </EmptyState>
        ) : (
          <form action={createNgoReportDraftAction} className="form-grid">
            <div className="field">
              <label htmlFor="title">Report title</label>
              <input
                id="title"
                name="title"
                placeholder="Spring donor transparency packet"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="templateId">Report template</label>
              <select id="templateId" name="templateId" required>
                {workspace.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {String(template.name)}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="field full fieldset-panel">
              <legend>Select evidence</legend>
              <div className="checkbox-grid">
                {workspace.evidence.map((item) => (
                  <label className="check-card" key={item.id}>
                    <input name="evidenceItemIds" type="checkbox" value={item.id} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.source_type} · {item.verification_status} · {item.visibility}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field full fieldset-panel">
              <legend>Accepted claims</legend>
              {workspace.acceptedClaims.length === 0 ? (
                <p className="muted-copy">
                  No accepted claims are available yet. Draft and rejected claims
                  will not enter the report trust summary.
                </p>
              ) : (
                <div className="checkbox-grid">
                  {workspace.acceptedClaims.map((claim) => (
                    <label className="check-card" key={claim.id}>
                      <input
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
              <label htmlFor="scoreSnapshotId">Draft score snapshot</label>
              <select id="scoreSnapshotId" name="scoreSnapshotId" defaultValue="">
                <option value="">No snapshot attached</option>
                {workspace.draftSnapshots.map((snapshot) => (
                  <option key={snapshot.id} value={snapshot.id}>
                    Draft snapshot {String(snapshot.id).slice(0, 8)} · score pending
                  </option>
                ))}
              </select>
            </div>

            <div className="field full">
              <button className="button primary" type="submit">
                Save private draft report
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="section">
        <h2>Draft reports</h2>
        {workspace.reports.length === 0 ? (
          <EmptyState title="No report drafts yet">
            Report drafts will be created from selected evidence and accepted
            claims. AI-generated text and exports are not part of this slice.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {workspace.reports.map((report) => (
              <article className="evidence-record" key={report.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">Private draft</span>
                    <h3>{report.title}</h3>
                    <p>
                      Created {new Date(report.created_at).toLocaleDateString()} ·{" "}
                      {report.approval_status}
                    </p>
                  </div>
                  <span className="score-pill">{report.visibility}</span>
                </div>
                <div className="metric-grid">
                  <div className="metric">
                    <span>Evidence</span>
                    <strong>{report.evidence_item_ids.length} selected</strong>
                  </div>
                  <div className="metric">
                    <span>Accepted claims</span>
                    <strong>{report.structured_claim_ids.length} attached</strong>
                  </div>
                  <div className="metric">
                    <span>Trust context</span>
                    <strong>
                      {report.score_snapshot_id
                        ? "Draft snapshot attached"
                        : "Evidence only"}
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Exports/sharing</span>
                    <strong>Not enabled</strong>
                  </div>
                </div>
                <p className="record-note">
                  Private to your organization. Not shared. Raw evidence remains private unless future scoped sharing explicitly allows it.
                </p>
                <Link className="button" href={`/org/reports/${report.id}`}>
                  Open draft detail
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
