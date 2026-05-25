"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  createNgoReportShareGrant,
  revokeNgoReportShareGrant,
  updateNgoReportDraft,
} from "@/lib/ngo-evidence-reports";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateNgoReportDraftAction(
  reportId: string,
  formData: FormData,
) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await updateNgoReportDraft({
    client: createSupabaseServerClient(),
    session,
    input: {
      organizationId,
      reportId,
      title: String(formData.get("title") ?? ""),
      evidenceItemIds: formData.getAll("evidenceItemIds").map(String),
      structuredClaimIds: formData.getAll("structuredClaimIds").map(String),
    },
  });

  if (!result.ok) {
    redirect(
      `/org/reports/${reportId}?error=${encodeURIComponent(result.message)}`,
    );
  }

  redirect(`/org/reports/${reportId}?updated=report`);
}

export async function createNgoReportShareGrantAction(
  reportId: string,
  formData: FormData,
) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await createNgoReportShareGrant({
    client: createSupabaseServerClient(),
    session,
    input: {
      organizationId,
      reportId,
      recipientName: String(formData.get("recipientName") ?? ""),
      recipientEmail: String(formData.get("recipientEmail") ?? ""),
      purpose: String(formData.get("purpose") ?? ""),
      expiresAt: String(formData.get("expiresAt") ?? "") || null,
    },
  });

  if (!result.ok) {
    redirect(
      `/org/reports/${reportId}?error=${encodeURIComponent(result.message)}`,
    );
  }

  redirect(`/org/reports/${reportId}?shared=grant`);
}

export async function revokeNgoReportShareGrantAction(
  reportId: string,
  shareGrantId: string,
) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await revokeNgoReportShareGrant({
    client: createSupabaseServerClient(),
    session,
    input: {
      organizationId,
      reportId,
      shareGrantId,
    },
  });

  if (!result.ok) {
    redirect(
      `/org/reports/${reportId}?error=${encodeURIComponent(result.message)}`,
    );
  }

  redirect(`/org/reports/${reportId}?revoked=grant`);
}
