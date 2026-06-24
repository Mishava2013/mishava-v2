import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import {
  getProductResearchTaskDetail,
  productResearchTaskStatuses,
  sourceReviewGuardrail,
  sourceReviewStatuses,
} from "@/lib/research-evidence";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  addResearchSourceAction,
  reviewResearchSourceAction,
  updateResearchTaskAction,
} from "../actions";

export default async function AdminResearchTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { taskId } = await params;
  const query = await searchParams;
  const { task, sources, events } = await getProductResearchTaskDetail({
    client: createSupabaseServerClient(),
    taskId,
  });

  if (!task) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Research task"
        title={task.requested_product_name ?? "Existing product source review"}
      >
        Staff can collect sources, review them, and keep unresolved gaps visible
        without creating public claims, final scores, or verification labels.
      </PageHeader>

      {query.error ? (
        <div className="notice" role="alert">
          {query.error}
        </div>
      ) : null}
      {query.updated ? (
        <div className="notice" role="status">
          Research task updated.
        </div>
      ) : null}

      <div className="notice" role="status">
        {sourceReviewGuardrail}
      </div>

      <section className="section">
        <div className="record-header">
          <div>
            <h2>Request details</h2>
            <p className="section-intro">
              {task.request_origin.replaceAll("_", " ")} ·{" "}
              {task.requested_category ?? task.category_key}
            </p>
          </div>
          <Link className="button" href="/admin/research">
            Back to queue
          </Link>
        </div>
        <div className="metric-grid">
          <div className="metric">
            <span>Status</span>
            <strong>{formatStatus(task.status)}</strong>
          </div>
          <div className="metric">
            <span>Brand</span>
            <strong>{task.requested_brand ?? "Not listed"}</strong>
          </div>
          <div className="metric">
            <span>Barcode/UPC</span>
            <strong>{task.requested_upc ?? "Not listed"}</strong>
          </div>
          <div className="metric">
            <span>Retailer link</span>
            <strong>
              {task.retailer_url ? (
                <a href={task.retailer_url} rel="noreferrer" target="_blank">
                  Open source
                </a>
              ) : (
                "Not provided"
              )}
            </strong>
          </div>
          <div className="metric">
            <span>Sources</span>
            <strong>{task.source_count}</strong>
          </div>
          <div className="metric">
            <span>Open gaps</span>
            <strong>{task.unresolved_gap_count}</strong>
          </div>
        </div>
        <p className="section-intro">
          <strong>User notes:</strong> {task.requester_notes ?? "No user notes provided."}
        </p>
        <p className="section-intro">
          <strong>Research notes:</strong>{" "}
          {task.notes ?? "No internal notes have been added yet."}
        </p>
      </section>

      <section className="section">
        <h2>Update task</h2>
        <form action={updateResearchTaskAction} className="form-grid">
          <input name="taskId" type="hidden" value={task.id} />
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={task.status}>
              {productResearchTaskStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="assignedTo">Assigned user ID, optional</label>
            <input
              id="assignedTo"
              name="assignedTo"
              placeholder="Reviewer user ID"
              defaultValue={task.assigned_to ?? ""}
            />
          </div>
          <div className="field full">
            <label htmlFor="notes">Internal notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="What should the next reviewer know?"
              defaultValue={task.notes ?? ""}
            />
          </div>
          <div className="field full">
            <label htmlFor="closedReason">Closed reason, if closing</label>
            <textarea
              id="closedReason"
              name="closedReason"
              placeholder="For example: no reliable sources found."
              defaultValue={task.closed_reason ?? ""}
            />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Save task update
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <h2>Add source for review</h2>
        <form action={addResearchSourceAction} className="form-grid">
          <input name="taskId" type="hidden" value={task.id} />
          <div className="field full">
            <label htmlFor="sourceUrl">Source URL</label>
            <input
              id="sourceUrl"
              name="sourceUrl"
              placeholder="https://..."
              required
              type="url"
            />
          </div>
          <div className="field">
            <label htmlFor="sourceTitle">Source title</label>
            <input id="sourceTitle" name="sourceTitle" placeholder="Product page title" />
          </div>
          <div className="field">
            <label htmlFor="sourceType">Source type</label>
            <input
              id="sourceType"
              name="sourceType"
              placeholder="Retailer page, brand page, report..."
            />
          </div>
          <div className="field">
            <label htmlFor="publisher">Publisher</label>
            <input id="publisher" name="publisher" placeholder="Brand, retailer, NGO..." />
          </div>
          <div className="field full">
            <label htmlFor="claimSummary">What might this source support?</label>
            <textarea
              id="claimSummary"
              name="claimSummary"
              placeholder="Keep this as a draft note until reviewed."
            />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Add pending source
            </button>
            <p className="form-help">
              New sources start as pending review and cannot create public
              claims, scores, rankings, verification, or publishing.
            </p>
          </div>
        </form>
      </section>

      <section className="section">
        <h2>Source review queue</h2>
        {sources.length === 0 ? (
          <EmptyState title="No sources added yet">
            Add source URLs here. Sources stay pending until a human reviewer
            marks them approved, rejected, stale, conflicting, or needing
            follow-up.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {sources.map((source) => (
              <article className="evidence-record" key={source.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{formatStatus(source.review_status)}</span>
                    <h3>{source.source_title ?? source.source_url}</h3>
                    <p>
                      {source.source_type} · {source.publisher ?? "Publisher not listed"}
                    </p>
                  </div>
                  <a className="button" href={source.source_url} rel="noreferrer" target="_blank">
                    Open source
                  </a>
                </div>
                <p className="section-intro">
                  {source.claim_summary ??
                    "No draft claim summary has been recorded for this source."}
                </p>
                <form action={reviewResearchSourceAction} className="form-grid">
                  <input name="taskId" type="hidden" value={task.id} />
                  <input name="sourceId" type="hidden" value={source.id} />
                  <div className="field">
                    <label htmlFor={`reviewStatus-${source.id}`}>Review decision</label>
                    <select
                      id={`reviewStatus-${source.id}`}
                      name="reviewStatus"
                      defaultValue={source.review_status}
                    >
                      {sourceReviewStatuses.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field full">
                    <label htmlFor={`reviewerNotes-${source.id}`}>Reviewer notes</label>
                    <textarea
                      id={`reviewerNotes-${source.id}`}
                      name="reviewerNotes"
                      placeholder="Explain what this source supports, does not prove, or why it was rejected."
                      defaultValue={source.reviewer_notes ?? ""}
                    />
                  </div>
                  <div className="field full">
                    <button className="button primary" type="submit">
                      Save source review
                    </button>
                  </div>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Review history</h2>
        {events.length === 0 ? (
          <EmptyState title="No history yet">
            Status changes, notes, source additions, and source reviews will
            appear here.
          </EmptyState>
        ) : (
          <div className="surface-list">
            {events.map((event) => (
              <article className="evidence-panel" key={event.id}>
                <span className="tag">{event.event_type.replaceAll("_", " ")}</span>
                <p>
                  {event.from_status ? `${formatStatus(event.from_status)} -> ` : ""}
                  {event.to_status ? formatStatus(event.to_status) : "No status change"}
                </p>
                <p className="section-intro">{event.note ?? "No note recorded."}</p>
                <p className="product-meta">{formatDate(event.created_at)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDate(value: string | null) {
  if (!value) return "Not reviewed";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
