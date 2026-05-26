import { hasNgoPermission, type AuthSession } from "./auth";
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
  lifecycle_status: string | null;
};

type EvidenceFileRow = InsertedRow & {
  organization_id: string;
  evidence_item_id: string;
  status: string;
  scan_status: string;
};

export type AiEvidenceParseJobStatus =
  | "queued"
  | "completed"
  | "failed"
  | "canceled";

export type AiEvidenceSuggestionStatus =
  | "suggested"
  | "reviewed"
  | "accepted"
  | "rejected";

export type AiEvidenceSuggestionType =
  | "structured_claim"
  | "summary"
  | "category"
  | "missing_context"
  | "report_language";

export type AiEvidenceParseJobRow = InsertedRow & {
  organization_id: string;
  evidence_item_id: string;
  requested_by: string | null;
  provider: string;
  model: string;
  model_version: string | null;
  prompt_version: string;
  input_reference: string | null;
  input_summary: string | null;
  status: AiEvidenceParseJobStatus;
  error_message: string | null;
  token_input_count: number | null;
  token_output_count: number | null;
  estimated_cost_cents: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AiEvidenceSuggestionRow = InsertedRow & {
  organization_id: string;
  evidence_item_id: string;
  parse_job_id: string;
  suggestion_type: AiEvidenceSuggestionType;
  suggested_text: string;
  suggested_claim_type: string | null;
  suggested_claim_value: string | null;
  suggested_confidence: string | null;
  source_excerpt: string | null;
  source_reference: string | null;
  status: AiEvidenceSuggestionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_structured_claim_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAiEvidenceParseJobInput = {
  organizationId: string;
  evidenceItemId: string;
  inputSummary?: string | null;
  inputReference?: string | null;
};

export type CreateAiEvidenceSuggestionInput = {
  organizationId: string;
  evidenceItemId: string;
  parseJobId: string;
  suggestionType?: AiEvidenceSuggestionType;
  suggestedText: string;
  suggestedClaimType?: string | null;
  suggestedClaimValue?: string | null;
  suggestedConfidence?: string | null;
  sourceExcerpt?: string | null;
  sourceReference?: string | null;
};

export type ReviewAiEvidenceSuggestionInput = {
  organizationId: string;
  suggestionId: string;
  status: "accepted" | "rejected";
  reviewNote?: string | null;
};

export const aiEvidenceParseJobSelect =
  "id,organization_id,evidence_item_id,requested_by,provider,model,model_version,prompt_version,input_reference,input_summary,status,error_message,token_input_count,token_output_count,estimated_cost_cents,started_at,completed_at,created_at,updated_at";

export const aiEvidenceSuggestionSelect =
  "id,organization_id,evidence_item_id,parse_job_id,suggestion_type,suggested_text,suggested_claim_type,suggested_claim_value,suggested_confidence,source_excerpt,source_reference,status,reviewed_by,reviewed_at,review_note,created_structured_claim_id,created_at,updated_at";

export async function createAiEvidenceParseJob({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: CreateAiEvidenceParseJobInput;
  session: AuthSession;
}) {
  if (!hasNgoPermission(session, input.organizationId, "edit_evidence")) {
    return {
      ok: false,
      message: "AI evidence parsing requires evidence edit permission.",
    };
  }

  const evidenceCheck = await verifyEvidenceIsParseEligible({
    client,
    evidenceItemId: input.evidenceItemId,
    organizationId: input.organizationId,
  });

  if (!evidenceCheck.ok) return evidenceCheck;

  const rows = await client.insert<AiEvidenceParseJobRow>(
    "ai_evidence_parse_jobs",
    {
      organization_id: input.organizationId,
      evidence_item_id: input.evidenceItemId,
      requested_by: session.user.id,
      provider: "not_configured",
      model: "none",
      model_version: null,
      prompt_version: "ngo-evidence-suggestion-v0",
      input_reference: input.inputReference?.trim() || null,
      input_summary: input.inputSummary?.trim() || evidenceCheck.evidence.title,
      status: "queued",
      token_input_count: null,
      token_output_count: null,
      estimated_cost_cents: null,
    },
  );
  const job = rows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ai.evidence_parse_requested",
      subjectTable: "ai_evidence_parse_jobs",
      subjectId: job.id,
      reason:
        "AI evidence parsing job recorded as suggestion-only. No provider call was made.",
      afterData: {
        evidence_item_id: input.evidenceItemId,
        provider: "not_configured",
        prompt_version: "ngo-evidence-suggestion-v0",
        raw_files_sent_to_ai: false,
        trust_outcome_automated: false,
      },
    }),
  );

  return { ok: true, message: "AI parse job recorded.", job };
}

export async function markAiEvidenceParseJobFailed({
  client,
  errorMessage,
  organizationId,
  parseJobId,
  session,
}: {
  client: SupabaseServerClient;
  errorMessage: string;
  organizationId: string;
  parseJobId: string;
  session: AuthSession;
}) {
  if (!hasNgoPermission(session, organizationId, "edit_evidence")) {
    return {
      ok: false,
      message: "AI evidence parsing requires evidence edit permission.",
    };
  }

  const rows = await client.update<AiEvidenceParseJobRow>(
    "ai_evidence_parse_jobs",
    { id: parseJobId, organization_id: organizationId },
    {
      status: "failed",
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  );

  if (rows.data.length === 0) {
    return { ok: false, message: "AI parse job was not found." };
  }

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "ai.evidence_parse_failed",
      subjectTable: "ai_evidence_parse_jobs",
      subjectId: parseJobId,
      reason: "AI evidence parsing job marked failed.",
      afterData: {
        error_message: errorMessage,
        trust_outcome_automated: false,
      },
    }),
  );

  return { ok: true, message: "AI parse job marked failed." };
}

export async function createAiEvidenceSuggestion({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: CreateAiEvidenceSuggestionInput;
  session: AuthSession;
}) {
  if (!hasNgoPermission(session, input.organizationId, "edit_evidence")) {
    return {
      ok: false,
      message: "AI evidence suggestions require evidence edit permission.",
    };
  }

  if (!input.evidenceItemId) {
    return { ok: false, message: "AI suggestion requires an evidence reference." };
  }

  const text = input.suggestedText.trim();
  if (text.length < 8) {
    return { ok: false, message: "AI suggestion text must be more specific." };
  }

  const evidenceCheck = await verifyEvidenceIsParseEligible({
    client,
    evidenceItemId: input.evidenceItemId,
    organizationId: input.organizationId,
  });

  if (!evidenceCheck.ok) return evidenceCheck;

  const job = await client.selectOne<AiEvidenceParseJobRow>(
    "ai_evidence_parse_jobs",
    {
      id: input.parseJobId,
      organization_id: input.organizationId,
      evidence_item_id: input.evidenceItemId,
    },
    aiEvidenceParseJobSelect,
  );

  if (!job) {
    return { ok: false, message: "AI parse job was not found for this evidence." };
  }

  const rows = await client.insert<AiEvidenceSuggestionRow>(
    "ai_evidence_suggestions",
    {
      organization_id: input.organizationId,
      evidence_item_id: input.evidenceItemId,
      parse_job_id: input.parseJobId,
      suggestion_type: input.suggestionType ?? "structured_claim",
      suggested_text: text,
      suggested_claim_type: input.suggestedClaimType?.trim() || "neutral",
      suggested_claim_value: input.suggestedClaimValue?.trim() || text,
      suggested_confidence: input.suggestedConfidence?.trim() || "low",
      source_excerpt: input.sourceExcerpt?.trim() || null,
      source_reference: input.sourceReference?.trim() || null,
      status: "suggested",
    },
  );
  const suggestion = rows.data[0];

  await client.update<AiEvidenceParseJobRow>(
    "ai_evidence_parse_jobs",
    { id: input.parseJobId, organization_id: input.organizationId },
    {
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ai.suggestion_created",
      subjectTable: "ai_evidence_suggestions",
      subjectId: suggestion.id,
      reason:
        "AI suggestion stored privately as a draft suggestion requiring human review.",
      afterData: {
        evidence_item_id: input.evidenceItemId,
        parse_job_id: input.parseJobId,
        status: "suggested",
        raw_files_sent_to_ai: false,
        trust_outcome_automated: false,
      },
    }),
  );

  return { ok: true, message: "AI suggestion recorded.", suggestion };
}

export async function listAiEvidenceSuggestions({
  client,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  session: AuthSession;
}) {
  if (!hasNgoPermission(session, organizationId, "view_evidence")) {
    return [];
  }

  return client.selectMany<AiEvidenceSuggestionRow>(
    "ai_evidence_suggestions",
    { organization_id: organizationId },
    aiEvidenceSuggestionSelect,
  );
}

export async function reviewAiEvidenceSuggestion({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: ReviewAiEvidenceSuggestionInput;
  session: AuthSession;
}) {
  if (!hasNgoPermission(session, input.organizationId, "edit_evidence")) {
    return {
      ok: false,
      message: "AI suggestion review requires evidence edit permission.",
    };
  }

  const suggestion = await client.selectOne<AiEvidenceSuggestionRow>(
    "ai_evidence_suggestions",
    { id: input.suggestionId, organization_id: input.organizationId },
    aiEvidenceSuggestionSelect,
  );

  if (!suggestion) {
    return { ok: false, message: "AI suggestion was not found." };
  }

  if (suggestion.status === "accepted" || suggestion.status === "rejected") {
    return { ok: false, message: "AI suggestion was already reviewed." };
  }

  const reviewedAt = new Date().toISOString();
  let createdClaimId: string | null = null;

  if (input.status === "accepted") {
    const evidenceCheck = await verifyEvidenceIsParseEligible({
      client,
      evidenceItemId: suggestion.evidence_item_id,
      organizationId: input.organizationId,
    });

    if (!evidenceCheck.ok) return evidenceCheck;

    const claimRows = await client.insert<InsertedRow>("structured_claims", {
      organization_id: input.organizationId,
      subject_type: "ngo",
      subject_id: input.organizationId,
      pillar_id: normalizeSuggestedClaimPillar(suggestion.suggested_claim_type),
      statement: suggestion.suggested_claim_value || suggestion.suggested_text,
      fact_type: normalizeSuggestedClaimType(suggestion.suggested_claim_type),
      evidence_item_ids: [suggestion.evidence_item_id],
      confidence: "low",
      recency: "Fresh",
      status: "reviewed",
      created_by: session.user.id,
      reviewed_by: session.user.id,
      reviewed_at: reviewedAt,
      review_reason:
        input.reviewNote?.trim() ||
        "Human accepted AI-assisted suggestion as a reviewed draft claim.",
      source_ai_suggestion_id: suggestion.id,
    });
    createdClaimId = claimRows.data[0].id;
  }

  await client.update<AiEvidenceSuggestionRow>(
    "ai_evidence_suggestions",
    { id: suggestion.id, organization_id: input.organizationId },
    {
      status: input.status,
      reviewed_by: session.user.id,
      reviewed_at: reviewedAt,
      review_note: input.reviewNote?.trim() || null,
      created_structured_claim_id: createdClaimId,
      updated_at: reviewedAt,
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action:
        input.status === "accepted"
          ? "ai.suggestion_accepted"
          : "ai.suggestion_rejected",
      subjectTable: "ai_evidence_suggestions",
      subjectId: suggestion.id,
      reason:
        input.reviewNote?.trim() ||
        `AI suggestion ${input.status} through human review.`,
      beforeData: {
        status: suggestion.status,
      },
      afterData: {
        status: input.status,
        created_structured_claim_id: createdClaimId,
        structured_claim_status: createdClaimId ? "reviewed" : null,
        evidence_item_id: suggestion.evidence_item_id,
        trust_outcome_automated: false,
      },
    }),
  );

  return {
    ok: true,
    message:
      input.status === "accepted"
        ? "AI suggestion accepted as a reviewed draft claim. It is not an accepted trust fact yet."
        : "AI suggestion rejected and excluded from reports and scoring.",
    structuredClaimId: createdClaimId,
  };
}

async function verifyEvidenceIsParseEligible({
  client,
  evidenceItemId,
  organizationId,
}: {
  client: SupabaseServerClient;
  evidenceItemId: string;
  organizationId: string;
}): Promise<
  | { ok: true; evidence: EvidenceRow }
  | { ok: false; message: string }
> {
  if (!evidenceItemId) {
    return { ok: false, message: "AI parsing requires an evidence reference." };
  }

  const evidence = await client.selectOne<EvidenceRow>(
    "evidence_items",
    { id: evidenceItemId, organization_id: organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,lifecycle_status",
  );

  if (!evidence) {
    return { ok: false, message: "Evidence item was not found for this organization." };
  }

  if (evidence.lifecycle_status === "archived") {
    return { ok: false, message: "Archived evidence cannot be parsed with AI." };
  }

  const evidenceFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { evidence_item_id: evidenceItemId, organization_id: organizationId },
    "id,organization_id,evidence_item_id,status,scan_status",
  );

  if (evidenceFiles.some(isBlockedFromAiParsing)) {
    return {
      ok: false,
      message:
        "Suspicious, rejected, or failed-scan files cannot be used for AI suggestions.",
    };
  }

  return { ok: true, evidence };
}

function isBlockedFromAiParsing(file: EvidenceFileRow) {
  return (
    file.status === "quarantined" ||
    file.status === "scan_failed" ||
    file.scan_status === "suspicious" ||
    file.scan_status === "rejected" ||
    file.scan_status === "failed"
  );
}

function normalizeSuggestedClaimType(value: string | null) {
  if (
    value === "positive" ||
    value === "negative" ||
    value === "corrective_action" ||
    value === "unknown" ||
    value === "gap"
  ) {
    return value;
  }

  return "neutral";
}

function normalizeSuggestedClaimPillar(value: string | null) {
  if (
    value === "labor" ||
    value === "environment" ||
    value === "governance" ||
    value === "community"
  ) {
    return value;
  }

  return "governance";
}
