import type { AuthSession } from "./auth";
import type { SupabaseServerClient } from "./supabase/server";

export type ProductResearchTaskStatus =
  | "new"
  | "researching"
  | "needs_source_review"
  | "blocked"
  | "completed"
  | "closed_no_reliable_sources"
  | "research_needed"
  | "source_found"
  | "claim_drafted"
  | "human_review_needed"
  | "reviewed"
  | "evidence_gap"
  | "stale"
  | "rejected";

export type ResearchSourceReviewStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_follow_up"
  | "stale"
  | "conflicting";

export type ProductResearchTask = {
  id: string;
  product_id: string | null;
  category_key: string;
  status: ProductResearchTaskStatus;
  assigned_to: string | null;
  last_reviewed_at: string | null;
  next_review_due_at: string | null;
  source_count: number;
  unresolved_gap_count: number;
  confidence_summary: string | null;
  notes: string | null;
  requested_product_name: string | null;
  requested_brand: string | null;
  requested_category: string | null;
  requested_upc: string | null;
  retailer_url: string | null;
  requester_notes: string | null;
  request_origin:
    | "shopping_product_not_found"
    | "shopping_evidence_gap"
    | "internal_review"
    | "source_review";
  requested_by: string | null;
  requested_by_email: string | null;
  closed_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductResearchSource = {
  id: string;
  task_id: string;
  source_url: string;
  source_title: string | null;
  source_type: string;
  publisher: string | null;
  claim_summary: string | null;
  review_status: ResearchSourceReviewStatus;
  submitted_by: string | null;
  reviewed_by: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  connected_evidence_item_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductResearchTaskEvent = {
  id: string;
  task_id: string;
  actor_user_id: string | null;
  event_type:
    | "request_created"
    | "status_changed"
    | "note_added"
    | "source_added"
    | "source_reviewed";
  from_status: string | null;
  to_status: string | null;
  note: string | null;
  created_at: string;
};

export const productResearchTaskStatuses: ProductResearchTaskStatus[] = [
  "new",
  "researching",
  "needs_source_review",
  "blocked",
  "completed",
  "closed_no_reliable_sources",
  "research_needed",
  "source_found",
  "claim_drafted",
  "human_review_needed",
  "reviewed",
  "evidence_gap",
  "stale",
  "rejected",
];

export const sourceReviewStatuses: ResearchSourceReviewStatus[] = [
  "pending_review",
  "approved",
  "rejected",
  "needs_follow_up",
  "stale",
  "conflicting",
];

export const sourceReviewGuardrail =
  "Pending or rejected sources do not affect public evidence cards, claims, scoring, rankings, verification, trust badges, publishing, supplier approval, seller approval, or legal conclusions.";

const researchTaskColumns =
  "id,product_id,category_key,status,assigned_to,last_reviewed_at,next_review_due_at,source_count,unresolved_gap_count,confidence_summary,notes,requested_product_name,requested_brand,requested_category,requested_upc,retailer_url,requester_notes,request_origin,requested_by,requested_by_email,closed_reason,created_at,updated_at";

const researchSourceColumns =
  "id,task_id,source_url,source_title,source_type,publisher,claim_summary,review_status,submitted_by,reviewed_by,reviewer_notes,reviewed_at,connected_evidence_item_id,created_at,updated_at";

const researchEventColumns =
  "id,task_id,actor_user_id,event_type,from_status,to_status,note,created_at";

export function normalizeResearchStatus(
  value: FormDataEntryValue | string | null,
): ProductResearchTaskStatus {
  const status = String(value ?? "new");
  return productResearchTaskStatuses.includes(status as ProductResearchTaskStatus)
    ? (status as ProductResearchTaskStatus)
    : "new";
}

export function normalizeSourceReviewStatus(
  value: FormDataEntryValue | string | null,
): ResearchSourceReviewStatus {
  const status = String(value ?? "pending_review");
  return sourceReviewStatuses.includes(status as ResearchSourceReviewStatus)
    ? (status as ResearchSourceReviewStatus)
    : "pending_review";
}

export function sanitizeOptionalText(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

export function sanitizeUrl(value: unknown) {
  const text = sanitizeOptionalText(value);
  if (!text) return null;
  if (!/^https?:\/\//i.test(text)) return text;
  try {
    return new URL(text).toString();
  } catch {
    return text;
  }
}

export async function createProductResearchRequest({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  session: AuthSession | null;
  input: {
    productName: string;
    brand?: string | null;
    category?: string | null;
    upc?: string | null;
    retailerUrl?: string | null;
    notes?: string | null;
  };
}) {
  const productName = sanitizeOptionalText(input.productName);
  if (!productName) {
    return { ok: false, message: "Product name is required." };
  }

  const created = await client.insert<ProductResearchTask>(
    "shopping_research_tasks",
    {
      product_id: null,
      category_key: sanitizeOptionalText(input.category) ?? "unknown",
      status: "new",
      source_count: 0,
      unresolved_gap_count: 1,
      requested_product_name: productName,
      requested_brand: sanitizeOptionalText(input.brand),
      requested_category: sanitizeOptionalText(input.category),
      requested_upc: sanitizeOptionalText(input.upc),
      retailer_url: sanitizeUrl(input.retailerUrl),
      requester_notes: sanitizeOptionalText(input.notes),
      request_origin: "shopping_product_not_found",
      requested_by: session?.user.id ?? null,
      requested_by_email: session?.user.email ?? null,
      confidence_summary:
        "User requested research from a product-not-found moment. No score, claim, or evidence fact has been created.",
      notes:
        "Research request only. Staff must collect and review sources before anything can support public evidence, claims, or scoring.",
    },
  );

  const task = created.data[0];
  if (task) {
    await recordResearchTaskEvent({
      client,
      taskId: task.id,
      actorUserId: session?.user.id ?? null,
      eventType: "request_created",
      toStatus: "new",
      note: "Product-not-found research request created from Shopping.",
    });
  }

  return { ok: true, taskId: task?.id ?? null };
}

export async function listProductResearchTasks({
  client,
  filters = {},
}: {
  client: SupabaseServerClient;
  filters?: {
    status?: string | null;
    category?: string | null;
    assigned?: string | null;
  };
}) {
  const tasks = await client.selectMany<ProductResearchTask>(
    "shopping_research_tasks",
    undefined,
    researchTaskColumns,
  );

  return tasks
    .filter((task) =>
      filters.status && filters.status !== "all" ? task.status === filters.status : true,
    )
    .filter((task) =>
      filters.category && filters.category !== "all"
        ? (task.requested_category ?? task.category_key) === filters.category
        : true,
    )
    .filter((task) => {
      if (filters.assigned === "assigned") return Boolean(task.assigned_to);
      if (filters.assigned === "unassigned") return !task.assigned_to;
      return true;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export async function getProductResearchTaskDetail({
  client,
  taskId,
}: {
  client: SupabaseServerClient;
  taskId: string;
}) {
  const task = await client.selectOne<ProductResearchTask>(
    "shopping_research_tasks",
    { id: taskId },
    researchTaskColumns,
  );

  if (!task) {
    return {
      task: null,
      sources: [] as ProductResearchSource[],
      events: [] as ProductResearchTaskEvent[],
    };
  }

  const [sources, events] = await Promise.all([
    client.selectMany<ProductResearchSource>(
      "shopping_research_sources",
      { task_id: taskId },
      researchSourceColumns,
    ),
    client.selectMany<ProductResearchTaskEvent>(
      "shopping_research_task_events",
      { task_id: taskId },
      researchEventColumns,
    ),
  ]);

  return {
    task,
    sources: sources.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
    events: events.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
  };
}

export async function updateProductResearchTask({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: {
    taskId: string;
    status: ProductResearchTaskStatus;
    assignedTo?: string | null;
    notes?: string | null;
    closedReason?: string | null;
  };
}) {
  const existing = await client.selectOne<ProductResearchTask>(
    "shopping_research_tasks",
    { id: input.taskId },
    researchTaskColumns,
  );

  if (!existing) return { ok: false, message: "Research task not found." };

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    status: input.status,
    assigned_to: sanitizeOptionalText(input.assignedTo),
    notes: sanitizeOptionalText(input.notes),
    closed_reason: sanitizeOptionalText(input.closedReason),
    updated_at: now,
  };

  if (input.status === "completed" || input.status === "reviewed") {
    payload.last_reviewed_at = now;
  }

  await client.update<ProductResearchTask>(
    "shopping_research_tasks",
    { id: input.taskId },
    payload,
  );

  await recordResearchTaskEvent({
    client,
    taskId: input.taskId,
    actorUserId: session.user.id,
    eventType: existing.status === input.status ? "note_added" : "status_changed",
    fromStatus: existing.status,
    toStatus: input.status,
    note: sanitizeOptionalText(input.notes) ?? "Research task updated.",
  });

  return { ok: true };
}

export async function addResearchSource({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: {
    taskId: string;
    sourceUrl: string;
    sourceTitle?: string | null;
    sourceType?: string | null;
    publisher?: string | null;
    claimSummary?: string | null;
  };
}) {
  const sourceUrl = sanitizeUrl(input.sourceUrl);
  if (!sourceUrl) return { ok: false, message: "Source URL is required." };

  const inserted = await client.insert<ProductResearchSource>(
    "shopping_research_sources",
    {
      task_id: input.taskId,
      source_url: sourceUrl,
      source_title: sanitizeOptionalText(input.sourceTitle),
      source_type: sanitizeOptionalText(input.sourceType) ?? "source submitted for review",
      publisher: sanitizeOptionalText(input.publisher),
      claim_summary: sanitizeOptionalText(input.claimSummary),
      review_status: "pending_review",
      submitted_by: session.user.id,
    },
  );

  const sources = await client.selectMany<ProductResearchSource>(
    "shopping_research_sources",
    { task_id: input.taskId },
    researchSourceColumns,
  );

  await client.update<ProductResearchTask>(
    "shopping_research_tasks",
    { id: input.taskId },
    {
      status: "needs_source_review",
      source_count: sources.length,
      unresolved_gap_count: sources.filter((source) =>
        [
          "pending_review",
          "rejected",
          "needs_follow_up",
          "stale",
          "conflicting",
        ].includes(source.review_status),
      ).length,
      updated_at: new Date().toISOString(),
    },
  );

  await recordResearchTaskEvent({
    client,
    taskId: input.taskId,
    actorUserId: session.user.id,
    eventType: "source_added",
    toStatus: "needs_source_review",
    note: `Source added pending review: ${sourceUrl}`,
  });

  return { ok: true, sourceId: inserted.data[0]?.id ?? null };
}

export async function reviewResearchSource({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: {
    taskId: string;
    sourceId: string;
    reviewStatus: ResearchSourceReviewStatus;
    reviewerNotes?: string | null;
  };
}) {
  const now = new Date().toISOString();
  await client.update<ProductResearchSource>(
    "shopping_research_sources",
    { id: input.sourceId },
    {
      review_status: input.reviewStatus,
      reviewed_by: session.user.id,
      reviewer_notes: sanitizeOptionalText(input.reviewerNotes),
      reviewed_at: now,
      updated_at: now,
    },
  );

  const sources = await client.selectMany<ProductResearchSource>(
    "shopping_research_sources",
    { task_id: input.taskId },
    researchSourceColumns,
  );
  const sourceCount = sources.length;
  const unresolvedGapCount = sources.filter((source) =>
    ["pending_review", "rejected", "needs_follow_up", "stale", "conflicting"].includes(
      source.review_status,
    ),
  ).length;
  const nextStatus =
    unresolvedGapCount === 0 && sourceCount > 0 ? "researching" : "needs_source_review";

  await client.update<ProductResearchTask>(
    "shopping_research_tasks",
    { id: input.taskId },
    {
      status: nextStatus,
      source_count: sourceCount,
      unresolved_gap_count: unresolvedGapCount,
      updated_at: now,
    },
  );

  await recordResearchTaskEvent({
    client,
    taskId: input.taskId,
    actorUserId: session.user.id,
    eventType: "source_reviewed",
    toStatus: nextStatus,
    note:
      sanitizeOptionalText(input.reviewerNotes) ??
      `Source marked ${input.reviewStatus}. ${sourceReviewGuardrail}`,
  });

  return { ok: true };
}

async function recordResearchTaskEvent({
  client,
  taskId,
  actorUserId,
  eventType,
  fromStatus,
  toStatus,
  note,
}: {
  client: SupabaseServerClient;
  taskId: string;
  actorUserId: string | null;
  eventType: ProductResearchTaskEvent["event_type"];
  fromStatus?: string | null;
  toStatus?: string | null;
  note?: string | null;
}) {
  await client.insert<ProductResearchTaskEvent>(
    "shopping_research_task_events",
    {
      task_id: taskId,
      actor_user_id: actorUserId,
      event_type: eventType,
      from_status: fromStatus ?? null,
      to_status: toStatus ?? null,
      note: sanitizeOptionalText(note),
    },
  );
}
