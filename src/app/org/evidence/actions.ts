"use server";

import { redirect } from "next/navigation";
import { canManageNgoEvidence } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  archiveEvidenceItem,
  normalizeEvidenceLifecycleStatus,
  updateEvidenceMetadata,
  uploadEvidenceFileForItem,
} from "@/lib/evidence-files";
import {
  enforceNgoEntitlement,
  enforceNgoStorageEntitlement,
} from "@/lib/ngo-billing";
import { createStructuredClaimDraft } from "@/lib/ngo-evidence-reports";
import { createEvidenceRecord } from "@/lib/release-2-5-workflows";
import { createSupabaseAuthenticatedServerClient } from "@/lib/supabase/server";

export async function createEvidenceAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/evidence?error=Evidence%20editing%20requires%20member%20access.");
  }
  const evidenceFile = formData.get("evidenceFile") as File | null;

  if (evidenceFile && evidenceFile.size > 0) {
    const fileCountEntitlement = await enforceNgoEntitlement({
      check: "evidence_file_upload",
      client: createSupabaseAuthenticatedServerClient(session.accessToken),
      incomingFileSizeBytes: evidenceFile.size,
      organizationId,
      session,
    });

    if (!fileCountEntitlement.allowed) {
      redirect(
        `/org/evidence?error=${encodeURIComponent(fileCountEntitlement.message)}`,
      );
    }

    const storageEntitlement = await enforceNgoStorageEntitlement({
      client: createSupabaseAuthenticatedServerClient(session.accessToken),
      incomingFileSizeBytes: evidenceFile.size,
      organizationId,
      session,
    });

    if (!storageEntitlement.allowed) {
      redirect(
        `/org/evidence?error=${encodeURIComponent(storageEntitlement.message)}`,
      );
    }
  }

  const result = await createEvidenceRecord({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
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
      lifecycleStatus:
        formData.get("lifecycleStatus") === "submitted" ? "submitted" : "draft",
    },
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  const fileResult = await uploadEvidenceFileForItem({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    evidenceItemId: result.evidenceId as string,
    file: evidenceFile,
    organizationId,
    session,
  });

  if (!fileResult.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(fileResult.message)}`);
  }

  redirect(`/org/evidence?created=evidence&id=${result.evidenceId}`);
}

export async function createStructuredClaimDraftAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/evidence?error=Evidence%20editing%20requires%20member%20access.");
  }

  const result = await createStructuredClaimDraft({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
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

export async function updateEvidenceMetadataAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/evidence?error=Evidence%20editing%20requires%20member%20access.");
  }

  const result = await updateEvidenceMetadata({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      evidenceItemId: String(formData.get("evidenceItemId") ?? ""),
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
      lifecycleStatus: normalizeEvidenceLifecycleStatus(
        formData.get("lifecycleStatus"),
      ),
    },
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/evidence?updated=evidence");
}

export async function uploadEvidenceFileAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/evidence?error=Evidence%20upload%20requires%20member%20access.");
  }

  const result = await uploadEvidenceFileForItem({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    evidenceItemId: String(formData.get("evidenceItemId") ?? ""),
    file: formData.get("evidenceFile") as File | null,
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/evidence?updated=file");
}

export async function archiveEvidenceAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  if (!canManageNgoEvidence(session, organizationId)) {
    redirect("/org/evidence?error=Evidence%20archive%20requires%20member%20access.");
  }

  const result = await archiveEvidenceItem({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    evidenceItemId: String(formData.get("evidenceItemId") ?? ""),
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/evidence?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/evidence?updated=archived");
}
