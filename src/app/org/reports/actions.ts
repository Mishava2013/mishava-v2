"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { createNgoReportDraft } from "@/lib/ngo-evidence-reports";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createNgoReportDraftAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await createNgoReportDraft({
    client: createSupabaseServerClient(),
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

  redirect(`/org/reports?created=report&id=${result.reportId}`);
}
