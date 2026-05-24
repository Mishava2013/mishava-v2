import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
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
};

export type NgoEvidenceLibraryItem = EvidenceRow & {
  submissionStatus: string | null;
  linkedStructuredClaimsCount: number;
  linkedAcceptedClaimsCount: number;
  linkedReportCount: number;
  hasAuditTrail: boolean;
  draftLabel: "Draft evidence" | "Review-ready evidence";
};

export type NgoReportDraftInput = {
  organizationId: string;
  title: string;
  templateId: string;
  evidenceItemIds: string[];
  structuredClaimIds: string[];
  scoreSnapshotId?: string | null;
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
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by",
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
        "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at",
      )
    : [];

  const auditEvents = await client.selectMany<InsertedRow>(
    "audit_events",
    { organization_id: organizationId },
    "id,subject_table,subject_id",
  );

  return evidence
    .map<NgoEvidenceLibraryItem>((item) => {
      const linkedClaims = claims.filter((claim) =>
        claim.evidence_item_ids.includes(item.id),
      );
      const linkedReports = reports.filter((report) =>
        report.evidence_item_ids.includes(item.id),
      );
      const submission = submissions.find(
        (entry) => entry.evidence_item_id === item.id,
      );
      const hasAuditTrail = auditEvents.some(
        (event) =>
          event.subject_table === "evidence_items" && event.subject_id === item.id,
      );

      return {
        ...item,
        submissionStatus: submission?.approval_status ?? null,
        linkedStructuredClaimsCount: linkedClaims.length,
        linkedAcceptedClaimsCount: linkedClaims.filter(
          (claim) => claim.status === "accepted",
        ).length,
        linkedReportCount: linkedReports.length,
        hasAuditTrail,
        draftLabel:
          item.verification_status === "unverified"
            ? "Draft evidence"
            : "Review-ready evidence",
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
  const ngoProfile = await client.selectOne<InsertedRow>(
    "ngo_profiles",
    { organization_id: organizationId },
    "id,organization_id",
  );

  const templates = await client.selectMany<InsertedRow>(
    "ngo_report_templates",
    { active: true },
    "id,code,name,description,minimum_tier,ai_assist_allowed,active",
  );

  const reports = ngoProfile
    ? await client.selectMany<NgoReportRow>(
        "ngo_reports",
        { organization_id: organizationId },
        "id,organization_id,ngo_profile_id,template_id,title,body,evidence_item_ids,structured_claim_ids,score_snapshot_id,scoring_version_id,visibility,approval_status,created_at",
      )
    : [];

  const evidence = await getNgoEvidenceLibrary({ client, organizationId });
  const acceptedClaims = await client.selectMany<StructuredClaimRow>(
    "structured_claims",
    { organization_id: organizationId, status: "accepted" },
    "id,organization_id,statement,pillar_id,fact_type,evidence_item_ids,status,confidence,recency",
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
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by",
  );

  if (!evidence) {
    return {
      ok: false,
      message: "Evidence item was not found for this organization.",
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
    { organization_id: input.organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,verification_status,visibility,created_at,created_by",
  );
  const allowedEvidenceIds = new Set(evidence.map((item) => item.id));
  const selectedEvidenceIds = unique(input.evidenceItemIds).filter((id) =>
    allowedEvidenceIds.has(id),
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

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
