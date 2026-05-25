"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { updateNgoReportDraft } from "@/lib/ngo-evidence-reports";
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
