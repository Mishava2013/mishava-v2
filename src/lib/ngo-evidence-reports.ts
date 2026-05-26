import type { AuthSession } from "./auth";
import type { AiEvidenceSuggestionRow } from "./ai-evidence-parsing";
import { buildAuditEvent } from "./audit-log";
import { enforceNgoEntitlement } from "./ngo-billing";
import type { SupabaseServerClient } from "./supabase/server";

type InsertedRow = Record<string, unknown> & { id: string };

type EvidenceRow = InsertedRow & {
  organization_id: string;
  title: string;
  source_name: string;
  source_type: string;
  url: string | null;
  notes: string | null;
  verification_status: string;
  visibility: string;
  created_at: string;
  created_by: string | null;
  document_path: string | null;
  lifecycle_status: "draft" | "submitted" | "reviewed" | "accepted" | "rejected" | "archived";
  archived_at: string | null;
};

type EvidenceFileRow = InsertedRow & {
  organization_id: string;
  evidence_item_id: string;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  safe_filename: string;
  mime_type: string;
  file_size_bytes: number;
  version_number: number;
  status: string;
  scan_status: "pending" | "clean" | "suspicious" | "rejected" | "failed" | "not_scanned";
  scanned_at: string | null;
  scanner_name: string | null;
  scanner_result_reference: string | null;
  quarantine_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  visibility: string;
  uploaded_by: string | null;
  uploaded_at: string;
};

type NgoEvidenceSubmissionRow = InsertedRow & {
  ngo_profile_id: string;
  evidence_item_id: string | null;
  approval_status: string;
  ai_parse_status: string;
};

type StructuredClaimRow = InsertedRow & {
  organization_id: string;
  statement: string;
  pillar_id: string;
  fact_type: string;
  evidence_item_ids: string[];
  status: "draft" | "reviewed" | "accepted" | "rejected";
  confidence: string;
  recency: string;
};

type NgoReportRow = InsertedRow & {
  organization_id: string;
  ngo_profile_id: string;
  template_id: string | null;
  title: string;
  body: Record<string, unknown>;
  evidence_item_ids: string[];
  structured_claim_ids: string[];
  score_snapshot_id: string | null;
  scoring_version_id: string | null;
  visibility: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type NgoReportTemplateRow = InsertedRow & {
  code: string;
  name: string;
  description: string;
  minimum_tier: string;
  ai_assist_allowed: boolean;
  active: boolean;
};

type OrganizationRow = InsertedRow & {
  name: string;
  country_code: string | null;
  public_summary: string | null;
};

type NgoProfileRow = InsertedRow & {
  organization_id: string;
  tier: string;
  public_name: string;
  legal_name: string | null;
  mission_area: string | null;
  website_url: string | null;
  registration_identifier: string | null;
  default_visibility: string;
  profile_status: string;
};

type NgoShareGrantRow = InsertedRow & {
  organization_id: string;
  ngo_profile_id: string;
  report_id: string;
  granted_to_email: string;
  granted_to_name: string | null;
  viewer_type: string;
  visibility: string;
  purpose: string;
  starts_at: string;
  expires_at: string | null;
  granted_by: string | null;
  revoked_at: string | null;
  revoked_by: string | null;
  status: "active" | "revoked";
  created_at: string;
};

export type NgoEvidenceLibraryItem = EvidenceRow & {
  submissionStatus: string | null;
  activeFileCount: number;
  fileAttachmentLabel: string;
  fileSummaries: EvidenceFileRow[];
  fileScanStatusLabel: string;
  blockedFileCount: number;
  hasBlockedFiles: boolean;
  linkedStructuredClaimsCount: number;
  linkedAcceptedClaimsCount: number;
  linkedReportCount: number;
  hasAuditTrail: boolean;
  draftLabel: "Draft evidence" | "Review-ready evidence";
  reviewLabel:
    | "Evidence entered but not reviewed"
    | "Evidence reviewed"
    | "Evidence accepted for trust context";
  reportAttachmentLabel: string;
  nextStepLabel: string;
  canUseInNewReports: boolean;
  aiSuggestionSummaries: AiEvidenceSuggestionRow[];
  aiSuggestionLabel: string;
};

export type NgoReportDraftInput = {
  organizationId: string;
  title: string;
  templateId: string;
  evidenceItemIds: string[];
  structuredClaimIds: string[];
  scoreSnapshotId?: string | null;
};

export type NgoReportUpdateInput = {
  organizationId: string;
  reportId: string;
  title: string;
  evidenceItemIds: string[];
  structuredClaimIds: string[];
};

export type NgoShareGrantInput = {
  organizationId: string;
  reportId: string;
  recipientName?: string;
  recipientEmail: string;
  purpose: string;
  expiresAt?: string | null;
};

export type NgoShareGrantRevokeInput = {
  organizationId: string;
  reportId: string;
  shareGrantId: string;
};

export type StructuredClaimDraftInput = {
  organizationId: string;
  evidenceItemId: string;
  statement: string;
  pillarId: string;
  factType: "positive" | "negative" | "neutral" | "corrective_action" | "unknown" | "gap";
};

export async function getNgoEvidenceLibrary({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}) {
  const ngoProfile = await client.selectOne<InsertedRow>(
    "ngo_profiles",
    { organization_id: organizationId },
    "id,organization_id",
  );

  const evidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );

  const evidenceFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { organization_id: organizationId },
    "id,organization_id,evidence_item_id,storage_bucket,storage_path,original_filename,safe_filename,mime_type,file_size_bytes,version_number,status,scan_status,scanned_at,scanner_name,scanner_result_reference,quarantine_reason,reviewed_by,reviewed_at,visibility,uploaded_by,uploaded_at",
  );

  const submissions = ngoProfile
    ? await client.selectMany<NgoEvidenceSubmissionRow>(
        "ngo_evidence_submissions",
        { ngo_profile_id: ngoProfile.id },
        "id,ngo_profile_id,evidence_item_id,approval_status,ai_parse_status",
      )
    : [];

  const claims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: organizationId },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );

  const reports = ngoProfile
    ? await client.selectMany<NgoReportRow>(
        "ngo_reports",
        { organization_id: organizationId },
        "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
      )
    : [];

  const auditEvents = await client.selectMany<InsertedRow>(
    "audit_events",
    { organization_id: organizationId },
    "id,subject_table,subject_id",
  );
  const aiSuggestions = await client.selectMany<AiEvidenceSuggestionRow>(
    "ai_evidence_suggestions",
    { organization_id: organizationId },
    "id,organization_id,evidence_item_id,parse_job_id,suggestion_type,suggested_text,suggested_claim_type,suggested_claim_value,suggested_confidence,source_excerpt,source_reference,status,reviewed_by,reviewed_at,review_note,created_structured_claim_id,created_at,updated_at",
  );

  return evidence
    .map<NgoEvidenceLibraryItem>((item) => {
      const linkedClaims = claims.filter((claim) =>
        claim.evidence_item_ids.includes(item.id),
      );
      const linkedReports = reports.filter((report) =>
        report.evidence_item_ids.includes(item.id),
      );
      const files = evidenceFiles
        .filter((file) => file.evidence_item_id === item.id)
        .sort((left, right) => right.version_number - left.version_number);
      const activeFileCount = files.filter((file) => file.status === "active").length;
      const blockedFileCount = files.filter(isEvidenceFileBlockedFromUse).length;
      const submission = submissions.find(
        (entry) => entry.evidence_item_id === item.id,
      );
      const hasAuditTrail = auditEvents.some(
        (event) =>
          event.subject_table === "evidence_items" && event.subject_id === item.id,
      );
      const itemAiSuggestions = aiSuggestions
        .filter((suggestion) => suggestion.evidence_item_id === item.id)
        .sort(
          (left, right) =>
            Date.parse(right.created_at) - Date.parse(left.created_at),
        );
      const pendingAiSuggestionCount = itemAiSuggestions.filter(
        (suggestion) =>
          suggestion.status === "suggested" || suggestion.status === "reviewed",
      ).length;

      return {
        ...item,
        submissionStatus: submission?.approval_status ?? null,
        activeFileCount,
        fileAttachmentLabel:
          activeFileCount > 0
            ? `${activeFileCount} private file${activeFileCount === 1 ? "" : "s"}`
            : "No private files attached",
        fileSummaries: files,
        fileScanStatusLabel: buildEvidenceFileScanStatusLabel(files),
        blockedFileCount,
        hasBlockedFiles: blockedFileCount > 0,
        linkedStructuredClaimsCount: linkedClaims.length,
        linkedAcceptedClaimsCount: linkedClaims.filter(
          (claim) => claim.status === "accepted",
        ).length,
        linkedReportCount: linkedReports.length,
        hasAuditTrail,
        draftLabel:
          item.lifecycle_status === "archived"
            ? "Draft evidence"
            : item.verification_status === "unverified"
              ? "Draft evidence"
              : "Review-ready evidence",
        reviewLabel:
          item.lifecycle_status === "archived"
            ? "Evidence entered but not reviewed"
            : item.verification_status === "unverified"
              ? "Evidence entered but not reviewed"
              : item.verification_status === "verified" ||
                  item.verification_status === "audit_reviewed"
                ? "Evidence accepted for trust context"
                : "Evidence reviewed",
        reportAttachmentLabel:
          linkedReports.length > 0
            ? `Attached to ${linkedReports.length} draft report${
                linkedReports.length === 1 ? "" : "s"
              }`
            : "Not attached to any report yet",
        nextStepLabel:
          item.lifecycle_status === "archived"
            ? "Archived: remains traceable but excluded from new reports by default"
            : linkedClaims.some((claim) => claim.status === "accepted")
              ? "Available now: use accepted claims in draft reports"
              : linkedClaims.length > 0
                ? "Needs review: draft claims cannot support report trust summaries yet"
                : "Available now: create a structured claim draft",
        canUseInNewReports: item.lifecycle_status !== "archived",
        aiSuggestionSummaries: itemAiSuggestions,
        aiSuggestionLabel:
          itemAiSuggestions.length === 0
            ? "No AI suggestions"
            : pendingAiSuggestionCount > 0
              ? `${pendingAiSuggestionCount} AI suggestion${
                  pendingAiSuggestionCount === 1 ? "" : "s"
                } need human review`
              : "AI suggestions reviewed",
      };
    })
    .sort(
      (left, right) =>
        Date.parse(right.created_at) - Date.parse(left.created_at),
    );
}

export async function getNgoReportWorkspace({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}) {
  const ngoProfile = await client.selectOne<NgoProfileRow>(
    "ngo_profiles",
    { organization_id: organizationId },
    "id,organization_id,tier,public_name,legal_name,mission_area,website_url,registration_identifier,default_visibility,profile_status",
  );

  const templates = await client.selectMany<NgoReportTemplateRow>(
    "ngo_report_templates",
    { active: true },
    "id,code,name,description,minimum_tier,ai_assist_allowed,active",
  );

  const reports = ngoProfile
    ? await client.selectMany<NgoReportRow>(
        "ngo_reports",
        { organization_id: organizationId },
        "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
      )
    : [];

  const evidence = (await getNgoEvidenceLibrary({ client, organizationId })).filter(
    (item) => item.canUseInNewReports && !item.hasBlockedFiles,
  );
  const acceptedClaimsRaw = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: organizationId, status: "accepted" },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );
  const usableEvidenceIds = new Set(evidence.map((item) => item.id));
  const acceptedClaims = acceptedClaimsRaw.filter((claim) =>
    claim.evidence_item_ids.every((evidenceId) => usableEvidenceIds.has(evidenceId)),
  );
  const draftSnapshots = await client.selectMany<InsertedRow>(
    "score_snapshots",
    { organization_id: organizationId, snapshot_status: "draft" },
    "id,organization_id,scoring_version_id,snapshot_status,overall_score,overall_label,evidence_coverage,recency,verification_confidence,created_at",
  );

  return {
    ngoProfile,
    templates,
    reports: reports.sort(
      (left, right) =>
        Date.parse(right.created_at) - Date.parse(left.created_at),
    ),
    evidence,
    acceptedClaims,
    draftSnapshots,
  };
}

export async function getNgoReportDetail({
  client,
  organizationId,
  reportId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  reportId: string;
}) {
  const workspace = await getNgoReportWorkspace({ client, organizationId });
  const fullEvidenceLibrary = await getNgoEvidenceLibrary({ client, organizationId });
  const organization = await client.selectOne<OrganizationRow>(
    "organizations",
    { id: organizationId },
    "id,name,country_code,public_summary",
  );
  const report = await client.selectOne<NgoReportRow>(
    "ngo_reports",
    { id: reportId, organization_id: organizationId },
    "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
  );

  if (!report) {
    return null;
  }

  const template = report.template_id
    ? await client.selectOne<NgoReportTemplateRow>(
        "ngo_report_templates",
        { id: report.template_id },
        "id,code,name,description,minimum_tier,ai_assist_allowed,active",
      )
    : null;

  const allClaims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: organizationId },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );
  const shareGrants = await client.selectMany<NgoShareGrantRow>(
    "ngo_share_grants",
    { organization_id: organizationId, report_id: report.id },
    "id,organization_id,ngo_profile_id,report_id,granted_to_email,granted_to_name,viewer_type,visibility,purpose,starts_at,expires_at,granted_by,revoked_at,revoked_by,status,created_at",
  );

  const selectedEvidence = fullEvidenceLibrary.filter((item) =>
    report.evidence_item_ids.includes(item.id),
  );
  const selectedAcceptedClaims = allClaims.filter(
    (claim) =>
      report.structured_claim_ids.includes(claim.id) && claim.status === "accepted",
  );
  const excludedClaims = allClaims.filter(
    (claim) =>
      report.structured_claim_ids.includes(claim.id) && claim.status !== "accepted",
  );

  return {
    ...workspace,
    organization,
    report,
    template,
    selectedEvidence,
    selectedAcceptedClaims,
    excludedClaims,
    shareGrants: shareGrants
      .sort(
        (left, right) =>
          Date.parse(right.created_at) - Date.parse(left.created_at),
      )
      .map((grant) => ({
        ...grant,
        displayStatus: getShareGrantDisplayStatus(grant),
        isRevocable: grant.status === "active" && !grant.revoked_at,
      })),
    activeShareGrantCount: shareGrants.filter(isShareGrantActive).length,
    missingItems: buildReportMissingItems({
      report,
      selectedEvidenceCount: selectedEvidence.length,
      selectedAcceptedClaimCount: selectedAcceptedClaims.length,
      activeShareGrantCount: shareGrants.filter(isShareGrantActive).length,
    }),
  };
}

export async function createStructuredClaimDraft({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: StructuredClaimDraftInput;
}) {
  const evidence = await client.selectOne<EvidenceRow>(
    "evidence_items",
    { id: input.evidenceItemId, organization_id: input.organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );

  if (!evidence) {
    return {
      ok: false,
      message: "Evidence item was not found for this organization.",
    };
  }

  if (evidence.lifecycle_status === "archived") {
    return {
      ok: false,
      message: "Archived evidence cannot support new structured claim drafts.",
    };
  }

  const evidenceFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { evidence_item_id: input.evidenceItemId, organization_id: input.organizationId },
    "id,organization_id,evidence_item_id,storage_bucket,storage_path,original_filename,safe_filename,mime_type,file_size_bytes,version_number,status,scan_status,scanned_at,scanner_name,scanner_result_reference,quarantine_reason,reviewed_by,reviewed_at,visibility,uploaded_by,uploaded_at",
  );

  if (evidenceFiles.some(isEvidenceFileBlockedFromUse)) {
    return {
      ok: false,
      message:
        "Quarantined, rejected, or failed-scan files cannot support new structured claim drafts.",
    };
  }

  if (input.statement.trim().length < 8) {
    return {
      ok: false,
      message: "Structured claim statement must be more specific.",
    };
  }

  const claimRows = await client.insert<InsertedRow>("structured_claims", {
    organization_id: input.organizationId,
    subject_type: "ngo",
    subject_id: input.organizationId,
    pillar_id: input.pillarId,
    statement: input.statement.trim(),
    fact_type: input.factType,
    evidence_item_ids: [input.evidenceItemId],
    confidence: "low",
    recency: "Fresh",
    status: "draft",
    created_by: session.user.id,
  });

  const claim = claimRows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "structured_claim.draft_created",
      subjectTable: "structured_claims",
      subjectId: claim.id,
      reason: "Structured claim draft created from NGO evidence.",
      afterData: {
        evidence_item_id: input.evidenceItemId,
        status: "draft",
        pillar_id: input.pillarId,
      },
    }),
  );

  return {
    ok: true,
    message: "Structured claim draft created.",
    claimId: claim.id,
  };
}

export async function createNgoReportDraft({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: NgoReportDraftInput;
}) {
  const title = input.title.trim();

  if (title.length < 2) {
    return { ok: false, message: "Report title is required." };
  }

  const ngoProfile = await client.selectOne<InsertedRow>(
    "ngo_profiles",
    { organization_id: input.organizationId },
    "id,organization_id",
  );

  if (!ngoProfile) {
    return { ok: false, message: "NGO profile is required before reports." };
  }

  const entitlement = await enforceNgoEntitlement({
    check: "report_create",
    client,
    organizationId: input.organizationId,
    session,
  });

  if (!entitlement.allowed) {
    return { ok: false, message: entitlement.message };
  }

  const template = await client.selectOne<InsertedRow>(
    "ngo_report_templates",
    { id: input.templateId, active: true },
    "id,code,name,active",
  );

  if (!template) {
    return { ok: false, message: "Report template was not found." };
  }

  const evidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: input.organizationId, lifecycle_status: "draft" },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const submittedEvidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: input.organizationId, lifecycle_status: "submitted" },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const reviewedEvidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: input.organizationId, lifecycle_status: "reviewed" },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const acceptedEvidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: input.organizationId, lifecycle_status: "accepted" },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const allowedEvidence = [
    ...evidence,
    ...submittedEvidence,
    ...reviewedEvidence,
    ...acceptedEvidence,
  ];
  const evidenceFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { organization_id: input.organizationId },
    "id,organization_id,evidence_item_id,storage_bucket,storage_path,original_filename,safe_filename,mime_type,file_size_bytes,version_number,status,scan_status,scanned_at,scanner_name,scanner_result_reference,quarantine_reason,reviewed_by,reviewed_at,visibility,uploaded_by,uploaded_at",
  );
  const evidenceIdsWithBlockedFiles = new Set(
    evidenceFiles
      .filter(isEvidenceFileBlockedFromUse)
      .map((file) => file.evidence_item_id),
  );
  const allowedEvidenceIds = new Set(allowedEvidence.map((item) => item.id));
  const selectedEvidenceIds = unique(input.evidenceItemIds).filter((id) =>
    allowedEvidenceIds.has(id) && !evidenceIdsWithBlockedFiles.has(id),
  );

  if (selectedEvidenceIds.length !== unique(input.evidenceItemIds).length) {
    return {
      ok: false,
      message: "Reports can only include evidence owned by this organization.",
    };
  }

  const acceptedClaims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: input.organizationId, status: "accepted" },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );
  const allowedAcceptedClaimIds = new Set(acceptedClaims.map((claim) => claim.id));
  const selectedClaimIds = unique(input.structuredClaimIds).filter((id) =>
    allowedAcceptedClaimIds.has(id),
  );

  if (selectedClaimIds.length !== unique(input.structuredClaimIds).length) {
    return {
      ok: false,
      message: "Reports can only include accepted claims owned by this organization.",
    };
  }

  const claimEvidenceIds = new Set(
    acceptedClaims
      .filter((claim) => selectedClaimIds.includes(claim.id))
      .flatMap((claim) => claim.evidence_item_ids),
  );
  const selectedEvidenceSet = new Set(selectedEvidenceIds);
  const claimWithoutSelectedEvidence = [...claimEvidenceIds].some(
    (evidenceId) => !selectedEvidenceSet.has(evidenceId),
  );

  if (claimWithoutSelectedEvidence) {
    return {
      ok: false,
      message: "Accepted claims must be backed by evidence selected for the report.",
    };
  }

  const snapshot = input.scoreSnapshotId
    ? await client.selectOne<InsertedRow>(
        "score_snapshots",
        {
          id: input.scoreSnapshotId,
          organization_id: input.organizationId,
          snapshot_status: "draft",
        },
        "id,organization_id,scoring_version_id,snapshot_status,overall_score,overall_label,evidence_coverage,recency,verification_confidence",
      )
    : null;

  if (input.scoreSnapshotId && !snapshot) {
    return {
      ok: false,
      message: "Only private draft score snapshots for this organization can be attached.",
    };
  }

  const reportRows = await client.insert<InsertedRow>("ngo_reports", {
    organization_id: input.organizationId,
    ngo_profile_id: ngoProfile.id,
    template_id: template.id,
    title,
    body: {
      status: "draft",
      trust_context:
        snapshot && snapshot.overall_score === null
          ? "provisional_without_score"
          : snapshot
            ? "draft_snapshot_attached"
            : "evidence_only",
      note: "Draft NGO report. No final score or export has been generated.",
    },
    evidence_item_ids: selectedEvidenceIds,
    structured_claim_ids: selectedClaimIds,
    score_snapshot_id: snapshot?.id ?? null,
    scoring_version_id: snapshot?.scoring_version_id ?? null,
    visibility: "private",
    approval_status: "draft",
    ai_assisted: false,
    created_by: session.user.id,
  });

  const report = reportRows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_report.draft_created",
      subjectTable: "ngo_reports",
      subjectId: report.id,
      reason: "NGO report draft created from selected evidence and accepted claims.",
      afterData: {
        template_id: template.id,
        evidence_item_ids: selectedEvidenceIds,
        structured_claim_ids: selectedClaimIds,
        score_snapshot_id: snapshot?.id ?? null,
        visibility: "private",
      },
    }),
  );

  return {
    ok: true,
    message: "Report draft created.",
    reportId: report.id,
  };
}

export async function updateNgoReportDraft({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: NgoReportUpdateInput;
}) {
  const title = input.title.trim();

  if (title.length < 2) {
    return { ok: false, message: "Report title is required." };
  }

  const report = await client.selectOne<NgoReportRow>(
    "ngo_reports",
    { id: input.reportId, organization_id: input.organizationId },
    "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
  );

  if (!report) {
    return {
      ok: false,
      message: "Report was not found for this organization.",
    };
  }

  if (report.approval_status !== "draft") {
    return {
      ok: false,
      message: "Only draft reports can be updated in this workflow.",
    };
  }

  const validation = await validateReportSelections({
    client,
    organizationId: input.organizationId,
    evidenceItemIds: input.evidenceItemIds,
    structuredClaimIds: input.structuredClaimIds,
  });

  if (!validation.ok) {
    return validation;
  }

  const changedFields = [
    report.title !== title ? "title" : null,
    arraysDiffer(report.evidence_item_ids, validation.selectedEvidenceIds)
      ? "evidence_item_ids"
      : null,
    arraysDiffer(report.structured_claim_ids, validation.selectedClaimIds)
      ? "structured_claim_ids"
      : null,
  ].filter(Boolean);

  const updatedAt = new Date().toISOString();
  const updateRows = await client.update<NgoReportRow>(
    "ngo_reports",
    { id: report.id, organization_id: input.organizationId },
    {
      title,
      evidence_item_ids: validation.selectedEvidenceIds,
      structured_claim_ids: validation.selectedClaimIds,
      visibility: "private",
      approval_status: "draft",
      updated_at: updatedAt,
      body: {
        ...(isPlainRecord(report.body) ? report.body : {}),
        status: "draft",
        trust_context: report.score_snapshot_id
          ? "draft_snapshot_attached"
          : validation.selectedClaimIds.length > 0
            ? "accepted_claims_attached"
            : validation.selectedEvidenceIds.length > 0
              ? "evidence_only"
              : "incomplete_no_evidence",
        note: "Draft NGO report. No final score, export, or sharing link has been generated.",
      },
    },
  );

  const updatedReport = updateRows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_report.draft_updated",
      subjectTable: "ngo_reports",
      subjectId: report.id,
      reason: "NGO report draft updated by organization member.",
      beforeData: {
        title: report.title,
        evidence_item_ids: report.evidence_item_ids,
        structured_claim_ids: report.structured_claim_ids,
        visibility: report.visibility,
      },
      afterData: {
        title: updatedReport.title,
        evidence_item_ids: validation.selectedEvidenceIds,
        structured_claim_ids: validation.selectedClaimIds,
        visibility: "private",
        changed_fields: changedFields,
        selected_evidence_count: validation.selectedEvidenceIds.length,
        accepted_claim_count: validation.selectedClaimIds.length,
      },
    }),
  );

  return {
    ok: true,
    message: "Report draft updated.",
    reportId: report.id,
  };
}

export async function createNgoReportShareGrant({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: NgoShareGrantInput;
}) {
  const recipientEmail = input.recipientEmail.trim().toLowerCase();
  const recipientName = input.recipientName?.trim() || null;
  const purpose = input.purpose.trim();

  if (!recipientEmail.includes("@")) {
    return { ok: false, message: "Recipient email is required." };
  }

  if (purpose.length < 3) {
    return { ok: false, message: "Sharing purpose is required." };
  }

  const report = await client.selectOne<NgoReportRow>(
    "ngo_reports",
    {
      id: input.reportId,
      organization_id: input.organizationId,
      visibility: "private",
    },
    "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
  );

  if (!report) {
    return {
      ok: false,
      message: "Share grants can only be created for private reports owned by this organization.",
    };
  }

  const entitlement = await enforceNgoEntitlement({
    check: "share_grant_create",
    client,
    organizationId: input.organizationId,
    session,
  });

  if (!entitlement.allowed) {
    return { ok: false, message: entitlement.message };
  }

  const expiresAt = parseOptionalFutureDate(input.expiresAt);

  if (input.expiresAt && !expiresAt) {
    return {
      ok: false,
      message: "Expiration date must be today or later.",
    };
  }

  const rows = await client.insert<NgoShareGrantRow>("ngo_share_grants", {
    organization_id: input.organizationId,
    ngo_profile_id: report.ngo_profile_id,
    report_id: report.id,
    granted_to_email: recipientEmail,
    granted_to_name: recipientName,
    viewer_type: "approved_recipient",
    visibility: "approved_viewer",
    purpose,
    expires_at: expiresAt,
    granted_by: session.user.id,
    status: "active",
  });

  const grant = rows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_report.share_grant_created",
      subjectTable: "ngo_share_grants",
      subjectId: grant.id,
      reason: "Scoped NGO report share grant created.",
      afterData: {
        report_id: report.id,
        share_grant_id: grant.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        viewer_type: "approved_recipient",
        purpose,
        expires_at: expiresAt,
        raw_evidence_exposed: false,
      },
    }),
  );

  return {
    ok: true,
    message: "Share grant created.",
    shareGrantId: grant.id,
  };
}

export async function revokeNgoReportShareGrant({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: NgoShareGrantRevokeInput;
}) {
  const grant = await client.selectOne<NgoShareGrantRow>(
    "ngo_share_grants",
    {
      id: input.shareGrantId,
      organization_id: input.organizationId,
      report_id: input.reportId,
    },
    "id,organization_id,ngo_profile_id,report_id,granted_to_email,granted_to_name,viewer_type,visibility,purpose,starts_at,expires_at,granted_by,revoked_at,revoked_by,status,created_at",
  );

  if (!grant) {
    return { ok: false, message: "Share grant was not found for this report." };
  }

  if (grant.status === "revoked" || grant.revoked_at) {
    return { ok: false, message: "Share grant is already revoked." };
  }

  const revokedAt = new Date().toISOString();
  await client.update<NgoShareGrantRow>(
    "ngo_share_grants",
    { id: grant.id, organization_id: input.organizationId },
    {
      status: "revoked",
      revoked_at: revokedAt,
      revoked_by: session.user.id,
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_report.share_grant_revoked",
      subjectTable: "ngo_share_grants",
      subjectId: grant.id,
      reason: "Scoped NGO report share grant revoked.",
      beforeData: {
        status: grant.status,
        recipient_email: grant.granted_to_email,
        purpose: grant.purpose,
      },
      afterData: {
        report_id: grant.report_id,
        share_grant_id: grant.id,
        revoked_at: revokedAt,
        status: "revoked",
      },
    }),
  );

  return {
    ok: true,
    message: "Share grant revoked.",
    shareGrantId: grant.id,
  };
}

export async function getSharedNgoReportByGrant({
  client,
  session,
  shareGrantId,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  shareGrantId: string;
}) {
  const grant = await client.selectOne<NgoShareGrantRow>(
    "ngo_share_grants",
    { id: shareGrantId },
    "id,organization_id,ngo_profile_id,report_id,granted_to_email,granted_to_name,viewer_type,visibility,purpose,starts_at,expires_at,granted_by,revoked_at,revoked_by,status,created_at",
  );

  if (!grant || !isShareGrantActive(grant)) {
    return null;
  }

  if (grant.granted_to_email.toLowerCase() !== session.user.email.toLowerCase()) {
    return null;
  }

  const report = await client.selectOne<NgoReportRow>(
    "ngo_reports",
    {
      id: grant.report_id,
      organization_id: grant.organization_id,
      visibility: "private",
    },
    "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at,updated_at,created_by",
  );

  if (!report) {
    return null;
  }

  const template = report.template_id
    ? await client.selectOne<NgoReportTemplateRow>(
        "ngo_report_templates",
        { id: report.template_id },
        "id,code,name,description,minimum_tier,ai_assist_allowed,active",
      )
    : null;

  const organization = await client.selectOne<OrganizationRow>(
    "organizations",
    { id: grant.organization_id },
    "id,name,country_code,public_summary",
  );
  const ngoProfile = await client.selectOne<NgoProfileRow>(
    "ngo_profiles",
    { id: grant.ngo_profile_id },
    "id,organization_id,tier,public_name,legal_name,mission_area,website_url,registration_identifier,default_visibility,profile_status",
  );

  const evidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: grant.organization_id },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const selectedEvidence = evidence
    .filter((item) => report.evidence_item_ids.includes(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      source_type: item.source_type,
      source_name: item.source_name,
      verification_status: item.verification_status,
      visibility: item.visibility,
      created_at: item.created_at,
      lifecycle_status: item.lifecycle_status,
      archived_at: item.archived_at,
    }));

  const claims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: grant.organization_id, status: "accepted" },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );
  const selectedAcceptedClaims = claims.filter((claim) =>
    report.structured_claim_ids.includes(claim.id),
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: grant.organization_id,
      action: "ngo_report.shared_viewed",
      subjectTable: "ngo_share_grants",
      subjectId: grant.id,
      reason: "Scoped NGO shared report viewed by granted recipient.",
      afterData: {
        report_id: report.id,
        recipient_email: session.user.email.toLowerCase(),
        raw_evidence_exposed: false,
      },
    }),
  );

  return {
    grant,
    organization,
    ngoProfile,
    report,
    template,
    selectedEvidence,
    selectedAcceptedClaims,
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function validateReportSelections({
  client,
  organizationId,
  evidenceItemIds,
  structuredClaimIds,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  evidenceItemIds: string[];
  structuredClaimIds: string[];
}): Promise<
  | { ok: true; selectedEvidenceIds: string[]; selectedClaimIds: string[] }
  | { ok: false; message: string }
> {
  const evidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by,document_path,lifecycle_status,archived_at",
  );
  const evidenceFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { organization_id: organizationId },
    "id,organization_id,evidence_item_id,storage_bucket,storage_path,original_filename,safe_filename,mime_type,file_size_bytes,version_number,status,scan_status,scanned_at,scanner_name,scanner_result_reference,quarantine_reason,reviewed_by,reviewed_at,visibility,uploaded_by,uploaded_at",
  );
  const evidenceIdsWithBlockedFiles = new Set(
    evidenceFiles
      .filter(isEvidenceFileBlockedFromUse)
      .map((file) => file.evidence_item_id),
  );
  const allowedEvidenceIds = new Set(
    evidence
      .filter((item) => item.lifecycle_status !== "archived")
      .filter((item) => !evidenceIdsWithBlockedFiles.has(item.id))
      .map((item) => item.id),
  );
  const selectedEvidenceIds = unique(evidenceItemIds).filter((id) =>
    allowedEvidenceIds.has(id),
  );

  if (selectedEvidenceIds.length !== unique(evidenceItemIds).length) {
    return {
      ok: false,
      message: "Reports can only include evidence owned by this organization.",
    };
  }

  const acceptedClaims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: organizationId, status: "accepted" },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
  );
  const allowedAcceptedClaimIds = new Set(acceptedClaims.map((claim) => claim.id));
  const selectedClaimIds = unique(structuredClaimIds).filter((id) =>
    allowedAcceptedClaimIds.has(id),
  );

  if (selectedClaimIds.length !== unique(structuredClaimIds).length) {
    return {
      ok: false,
      message:
        "Report trust summaries can only include accepted claims owned by this organization. Draft and rejected claims are excluded.",
    };
  }

  const claimEvidenceIds = new Set(
    acceptedClaims
      .filter((claim) => selectedClaimIds.includes(claim.id))
      .flatMap((claim) => claim.evidence_item_ids),
  );
  const selectedEvidenceSet = new Set(selectedEvidenceIds);
  const claimWithoutSelectedEvidence = [...claimEvidenceIds].some(
    (evidenceId) => !selectedEvidenceSet.has(evidenceId),
  );

  if (claimWithoutSelectedEvidence) {
    return {
      ok: false,
      message: "Accepted claims must be backed by evidence selected for the report.",
    };
  }

  return { ok: true, selectedEvidenceIds, selectedClaimIds };
}

function buildReportMissingItems({
  report,
  selectedEvidenceCount,
  selectedAcceptedClaimCount,
  activeShareGrantCount,
}: {
  report: NgoReportRow;
  selectedEvidenceCount: number;
  selectedAcceptedClaimCount: number;
  activeShareGrantCount: number;
}) {
  return [
    selectedEvidenceCount === 0 ? "No evidence selected yet." : null,
    selectedAcceptedClaimCount === 0
      ? "No accepted claims selected yet; trust context remains provisional."
      : null,
    report.score_snapshot_id
      ? null
      : "No public score has been created from this report.",
    activeShareGrantCount === 0 ? "Not shared." : null,
    "CSV evidence export is enabled; PDF/DOCX file generation is not enabled yet.",
  ].filter(Boolean) as string[];
}

function arraysDiffer(left: string[], right: string[]) {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return (
    sortedLeft.length !== sortedRight.length ||
    sortedLeft.some((value, index) => value !== sortedRight[index])
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isShareGrantActive(grant: NgoShareGrantRow) {
  const now = Date.now();
  return (
    grant.status === "active" &&
    !grant.revoked_at &&
    Date.parse(grant.starts_at) <= now &&
    (!grant.expires_at || Date.parse(grant.expires_at) > now)
  );
}

function getShareGrantDisplayStatus(grant: NgoShareGrantRow) {
  if (grant.status === "revoked" || grant.revoked_at) return "Revoked";
  if (grant.expires_at && Date.parse(grant.expires_at) <= Date.now()) {
    return "Expired";
  }
  return "Shared";
}

function isEvidenceFileBlockedFromUse(file: EvidenceFileRow) {
  return (
    file.status === "quarantined" ||
    file.status === "scan_failed" ||
    file.scan_status === "suspicious" ||
    file.scan_status === "rejected" ||
    file.scan_status === "failed"
  );
}

function buildEvidenceFileScanStatusLabel(files: EvidenceFileRow[]) {
  if (files.length === 0) return "No private files attached";
  if (files.some((file) => file.scan_status === "suspicious")) {
    return "Quarantined: suspicious file blocked";
  }
  if (files.some((file) => file.scan_status === "rejected")) {
    return "Rejected file blocked";
  }
  if (files.some((file) => file.scan_status === "failed")) {
    return "Scan failed: file blocked";
  }
  if (files.some((file) => file.scan_status === "pending")) {
    return "Scan pending: raw file unavailable";
  }
  if (files.some((file) => file.scan_status === "not_scanned")) {
    return "Not scanned: raw file unavailable";
  }
  return "Clean file available for authorized access";
}

function parseOptionalFutureDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const endOfDay = new Date(parsed);
  endOfDay.setHours(23, 59, 59, 999);
  if (endOfDay.getTime() < Date.now()) return null;
  return endOfDay.toISOString();
}
