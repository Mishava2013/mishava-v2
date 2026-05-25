"use server";

import { redirect } from "next/navigation";
import { canManageNgoReports, canManageNgoTeam } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  createNgoReportShareGrant,
  revokeNgoReportShareGrant,
  updateNgoReportDraft,
} from "@/lib/ngo-evidence-reports";
import { createSupabaseAuthenticatedServerClient } from "@/lib/supabase/server";

export async function updateNgoReportDraftAction(
  reportId: string,
  formData: FormData,
) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoReports(session, organizationId)) {
    redirect(
      `/org/reports/${reportId}?error=Report%20editing%20requires%20member%20access.`,
    );
  }

  const result = await updateNgoReportDraft({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
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
  if (!canManageNgoTeam(session, organizationId)) {
    redirect(
      `/org/reports/${reportId}?error=Sharing%20requires%20admin%20access.`,
    );
  }

  const result = await createNgoReportShareGrant({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
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
  if (!canManageNgoTeam(session, organizationId)) {
    redirect(
      `/org/reports/${reportId}?error=Sharing%20requires%20admin%20access.`,
    );
  }

  const result = await revokeNgoReportShareGrant({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
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
