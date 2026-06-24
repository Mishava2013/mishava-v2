"use server";

import { redirect } from "next/navigation";
import { canManageNgoEvidence } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  createSafeIntakeLink,
  reviewSafeIntakeSubmission,
  updateSafeIntakeLinkStatus,
  type SafeIntakeLinkStatus,
  type SafeIntakeSubmissionStatus,
} from "@/lib/ngo-safe-intake";
import { createSupabaseAuthenticatedServerClient } from "@/lib/supabase/server";

export async function createSafeIntakeLinkAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/intake?error=Safe%20intake%20link%20creation%20requires%20member%20access.");
  }

  const result = await createSafeIntakeLink({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      purpose: String(formData.get("purpose") ?? ""),
      expiresAt: String(formData.get("expiresAt") ?? "") || null,
    },
  });

  if (!result.ok) {
    redirect(`/org/intake?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/intake?created=link");
}

export async function updateSafeIntakeLinkStatusAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/intake?error=Safe%20intake%20link%20updates%20require%20member%20access.");
  }

  const status = normalizeLinkStatus(formData.get("status"));
  const result = await updateSafeIntakeLinkStatus({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      linkId: String(formData.get("linkId") ?? ""),
      status,
    },
  });

  if (!result.ok) {
    redirect(`/org/intake?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/intake?updated=link");
}

export async function reviewSafeIntakeSubmissionAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/intake?error=Safe%20intake%20review%20requires%20member%20access.");
  }

  const result = await reviewSafeIntakeSubmission({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      submissionId: String(formData.get("submissionId") ?? ""),
      status: normalizeSubmissionStatus(formData.get("status")),
      reviewNote: String(formData.get("reviewNote") ?? ""),
    },
  });

  if (!result.ok) {
    redirect(`/org/intake?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/intake?updated=submission");
}

function normalizeLinkStatus(value: FormDataEntryValue | null): SafeIntakeLinkStatus {
  const status = String(value ?? "active");
  if (status === "paused" || status === "revoked") return status;
  return "active";
}

function normalizeSubmissionStatus(
  value: FormDataEntryValue | null,
): SafeIntakeSubmissionStatus {
  const status = String(value ?? "reviewed");
  if (
    status === "pending_review" ||
    status === "accepted_for_evidence_review" ||
    status === "rejected"
  ) {
    return status;
  }
  return "reviewed";
}
