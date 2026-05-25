"use server";

import { redirect } from "next/navigation";
import { canManageNgoReports } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { createNgoReportDraft } from "@/lib/ngo-evidence-reports";
import { createSupabaseAuthenticatedServerClient } from "@/lib/supabase/server";

export async function createNgoReportDraftAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoReports(session, organizationId)) {
    redirect("/org/reports?error=Report%20editing%20requires%20member%20access.");
  }

  const result = await createNgoReportDraft({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      title: String(formData.get("title") ?? ""),
      templateId: String(formData.get("templateId") ?? ""),
      evidenceItemIds: formData.getAll("evidenceItemIds").map(String),
      structuredClaimIds: formData.getAll("structuredClaimIds").map(String),
      scoreSnapshotId: String(formData.get("scoreSnapshotId") ?? "") || null,
    },
  });

  if (!result.ok) {
    redirect(`/org/reports?error=${encodeURIComponent(result.message)}`);
  }

  redirect(`/org/reports/${result.reportId}?created=report`);
}
