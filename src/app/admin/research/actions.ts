"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth-server";
import {
  addResearchSource,
  normalizeResearchStatus,
  normalizeSourceReviewStatus,
  reviewResearchSource,
  updateProductResearchTask,
} from "@/lib/research-evidence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateResearchTaskAction(formData: FormData) {
  const session = await requireAdminSession();
  const taskId = String(formData.get("taskId") ?? "");
  const result = await updateProductResearchTask({
    client: createSupabaseServerClient(),
    session,
    input: {
      taskId,
      status: normalizeResearchStatus(formData.get("status")),
      assignedTo: String(formData.get("assignedTo") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      closedReason: String(formData.get("closedReason") ?? ""),
    },
  });

  if (!result.ok) {
    const message =
      (result as { message?: string }).message ?? "Research task update failed.";
    redirect(`/admin/research/${taskId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/admin/research/${taskId}?updated=task`);
}

export async function addResearchSourceAction(formData: FormData) {
  const session = await requireAdminSession();
  const taskId = String(formData.get("taskId") ?? "");
  const result = await addResearchSource({
    client: createSupabaseServerClient(),
    session,
    input: {
      taskId,
      sourceUrl: String(formData.get("sourceUrl") ?? ""),
      sourceTitle: String(formData.get("sourceTitle") ?? ""),
      sourceType: String(formData.get("sourceType") ?? ""),
      publisher: String(formData.get("publisher") ?? ""),
      claimSummary: String(formData.get("claimSummary") ?? ""),
    },
  });

  if (!result.ok) {
    const message = (result as { message?: string }).message ?? "Source add failed.";
    redirect(`/admin/research/${taskId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/admin/research/${taskId}?updated=source`);
}

export async function reviewResearchSourceAction(formData: FormData) {
  const session = await requireAdminSession();
  const taskId = String(formData.get("taskId") ?? "");
  const result = await reviewResearchSource({
    client: createSupabaseServerClient(),
    session,
    input: {
      taskId,
      sourceId: String(formData.get("sourceId") ?? ""),
      reviewStatus: normalizeSourceReviewStatus(formData.get("reviewStatus")),
      reviewerNotes: String(formData.get("reviewerNotes") ?? ""),
    },
  });

  if (!result.ok) {
    const message =
      (result as { message?: string }).message ?? "Source review failed.";
    redirect(`/admin/research/${taskId}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/admin/research/${taskId}?updated=review`);
}
