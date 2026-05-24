"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { createStructuredClaimDraft } from "@/lib/ngo-evidence-reports";
import { createEvidenceRecord } from "@/lib/release-2-5-workflows";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createEvidenceAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await createEvidenceRecord({
    client: createSupabaseServerClient(),
    session,
    input: {
      organizationId,
      title: String(formData.get("title") ?? ""),
      sourceName: String(formData.get("sourceName") ?? ""),
      sourceType: String(formData.get("sourceType") ?? ""),
      url: String(formData.get("url") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      visibility:
        formData.get("visibility") === "public_summary"
          ? "public_summary"
          : formData.get("visibility") === "approved_viewer"
            ? "approved_viewer"
            : formData.get("visibility") === "organization_shared"
              ? "organization_shared"
              : "private",
      verificationStatus:
        formData.get("verificationStatus") === "public_record_checked"
          ? "public_record_checked"
          : formData.get("verificationStatus") === "document_checked"
            ? "document_checked"
            : formData.get("verificationStatus") === "self_attested"
              ? "self_attested"
              : "unverified",
    },
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  redirect(`/org/evidence?created=evidence&id=${result.evidenceId}`);
}

export async function createStructuredClaimDraftAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  const result = await createStructuredClaimDraft({
    client: createSupabaseServerClient(),
    session,
    input: {
      organizationId,
      evidenceItemId: String(formData.get("evidenceItemId") ?? ""),
      statement: String(formData.get("statement") ?? ""),
      pillarId: String(formData.get("pillarId") ?? "governance"),
      factType:
        formData.get("factType") === "negative"
          ? "negative"
          : formData.get("factType") === "positive"
            ? "positive"
            : formData.get("factType") === "corrective_action"
              ? "corrective_action"
              : formData.get("factType") === "gap"
                ? "gap"
                : formData.get("factType") === "unknown"
                  ? "unknown"
                  : "neutral",
    },
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  redirect(`/org/evidence?created=claim&id=${result.claimId}`);
}
