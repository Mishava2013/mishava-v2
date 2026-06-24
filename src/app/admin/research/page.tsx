import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import {
  listProductResearchTasks,
  productResearchTaskStatuses,
  sourceReviewGuardrail,
} from "@/lib/research-evidence";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function AdminResearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    category?: string;
    assigned?: string;
  }>;
}) {
  const params = await searchParams;
  const tasks = isSupabaseServerConfigured()
    ? await listProductResearchTasks({
        client: createSupabaseServerClient(),
        filters: {
          status: params.status ?? "all",
          category: params.category ?? "all",
          assigned: params.assigned ?? "all",
        },
      })
    : [];
  const categories = Array.from(
    new Set(
      tasks
        .map((task) => task.requested_category ?? task.category_key)
        .filter(Boolean),
    ),
  ).sort();

  return (
    <>
      <PageHeader eyebrow="Research queue" title="Product requests and source review.">
        Internal staff use this queue to review product-not-found requests,
        collect sources, and keep pending sources out of public claims and
        scores until human review is complete.
      </PageHeader>

      <div className="notice" role="status">
        {sourceReviewGuardrail}
      </div>

      <section className="section">
        <h2>Research task filters</h2>
        <form className="form-grid">
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={params.status ?? "all"}>
              <option value="all">All statuses</option>
              {productResearchTaskStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={params.category ?? "all"}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="assigned">Assignment</label>
            <select id="assigned" name="assigned" defaultValue={params.assigned ?? "all"}>
              <option value="all">Assigned or unassigned</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
          <div className="field">
            <button className="button primary" type="submit">
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <h2>Product research tasks</h2>
        {tasks.length === 0 ? (
          <EmptyState title="No research tasks found">
            Product-not-found requests and source-review work will appear here
            after users ask Mishava to research products or staff adds source
            review work.
          </EmptyState>
        ) : (
          <div className="evidence-library">
            {tasks.map((task) => (
              <article className="evidence-record" key={task.id}>
                <div className="record-header">
                  <div>
                    <span className="tag">{formatStatus(task.status)}</span>
                    <span className="tag tag-source">
                      {task.request_origin.replaceAll("_", " ")}
                    </span>
                    <h3>{task.requested_product_name ?? "Existing product research"}</h3>
                    <p>
                      {task.requested_brand ?? "Brand not listed"} ·{" "}
                      {task.requested_category ?? task.category_key}
                    </p>
                  </div>
                  <Link className="button" href={`/admin/research/${task.id}`}>
                    Review task
                  </Link>
                </div>
                <div className="metric-grid">
                  <div className="metric">
                    <span>Sources</span>
                    <strong>{task.source_count}</strong>
                  </div>
                  <div className="metric">
                    <span>Open gaps</span>
                    <strong>{task.unresolved_gap_count}</strong>
                  </div>
                  <div className="metric">
                    <span>Assigned</span>
                    <strong>{task.assigned_to ? "Assigned" : "Unassigned"}</strong>
                  </div>
                  <div className="metric">
                    <span>Created</span>
                    <strong>{formatDate(task.created_at)}</strong>
                  </div>
                </div>
                <p className="section-intro">
                  {task.confidence_summary ??
                    "Research request only. No public evidence or score has been created."}
                </p>
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
  }).format(new Date(value));
}
