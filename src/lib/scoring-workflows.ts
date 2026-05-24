import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import type { Confidence, Level, PillarId, Recency } from "./scoring";
import type { SupabaseServerClient } from "./supabase/server";

type InsertedRow = Record<string, unknown> & { id: string };

type StructuredClaimRow = InsertedRow & {
  organization_id: string;
  subject_type: string;
  subject_id: string | null;
  pillar_id: PillarId;
  statement: string;
  fact_type: string;
  evidence_item_ids: string[];
  confidence: Confidence;
  recency: Recency;
  status: "draft" | "reviewed" | "accepted" | "rejected";
};

type EvidenceRow = InsertedRow & {
  organization_id: string;
  subject_type: string;
  subject_id: string | null;
  title: string;
  source_name: string;
  source_type: string;
  url: string | null;
  verification_status: string;
  confidence: Confidence;
  visibility: string;
  captured_at: string;
};

export type DraftScoringVersionInput = {
  code: string;
  name: string;
  methodologySummary: string;
  pillarWeights: Record<PillarId, number>;
  indicatorWeights?: Record<string, number>;
};

export type StructuredClaimReviewInput = {
  claimId: string;
  organizationId: string;
  status: "accepted" | "rejected";
  reason: string;
};

export type DraftSnapshotInput = {
  organizationId: string;
  subjectType: string;
  subjectId?: string | null;
  scoringVersionId: string;
  draftReason: string;
};

export async function createDraftScoringVersion({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: DraftScoringVersionInput;
}) {
  const versionRows = await client.insert<InsertedRow>("scoring_versions", {
    code: input.code,
    name: input.name,
    active: false,
    status: "draft",
    methodology_summary: input.methodologySummary,
    pillar_weights: input.pillarWeights,
    indicator_weights: input.indicatorWeights ?? {},
    created_by: session.user.id,
  });

  const version = versionRows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      action: "scoring_version.created",
      subjectTable: "scoring_versions",
      subjectId: version.id,
      reason: "Draft scoring version created.",
      afterData: {
        code: input.code,
        status: "draft",
      },
    }),
  );

  return version;
}

export async function publishScoringVersion({
  client,
  session,
  scoringVersionId,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  scoringVersionId: string;
}) {
  const existing = await client.selectOne<InsertedRow>(
    "scoring_versions",
    { id: scoringVersionId },
    "id,code,status,published_at",
  );

  if (!existing) {
    throw new Error("Scoring version not found.");
  }

  if (existing.status === "published" || existing.published_at) {
    throw new Error("Published scoring versions are immutable; create a new version.");
  }

  const publishedAt = new Date().toISOString();
  const versionRows = await client.update<InsertedRow>(
    "scoring_versions",
    { id: scoringVersionId },
    {
      status: "published",
      published_at: publishedAt,
      approved_at: publishedAt,
      approved_by: session.user.id,
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      action: "scoring_version.published",
      subjectTable: "scoring_versions",
      subjectId: scoringVersionId,
      reason: "Scoring version published.",
      beforeData: {
        status: existing.status,
        published_at: existing.published_at,
      },
      afterData: {
        status: "published",
        published_at: publishedAt,
      },
    }),
  );

  return versionRows.data[0];
}

export async function reviewStructuredClaim({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: StructuredClaimReviewInput;
}) {
  const claim = await client.selectOne<StructuredClaimRow>(
    "structured_claims",
    { id: input.claimId, organization_id: input.organizationId },
    "id,organization_id,status,evidence_item_ids",
  );

  if (!claim) {
    throw new Error("Structured claim not found.");
  }

  if (input.status === "accepted" && claim.evidence_item_ids.length === 0) {
    throw new Error("Accepted structured claims must cite evidence.");
  }

  const reviewedRows = await client.update<InsertedRow>(
    "structured_claims",
    { id: input.claimId },
    {
      status: input.status,
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
      review_reason: input.reason,
      human_confirmed: input.status === "accepted",
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: `structured_claim.${input.status}`,
      subjectTable: "structured_claims",
      subjectId: input.claimId,
      reason: input.reason,
      beforeData: { status: claim.status },
      afterData: { status: input.status },
    }),
  );

  return reviewedRows.data[0];
}

export async function createDraftScoreSnapshot({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: DraftSnapshotInput;
}) {
  const acceptedClaims = (
    await client.selectMany<StructuredClaimRow>(
      "structured_claims",
      { organization_id: input.organizationId, status: "accepted" },
      "id,organization_id,subject_type,subject_id,pillar_id,statement,fact_type,evidence_item_ids,confidence,recency,status",
    )
  ).filter((claim) => {
    if (claim.subject_type !== input.subjectType) return false;
    if (input.subjectId && claim.subject_id !== input.subjectId) return false;
    return claim.evidence_item_ids.length > 0;
  });

  if (acceptedClaims.length === 0) {
    throw new Error("Draft score snapshots require accepted evidence-backed claims.");
  }

  const evidenceIds = Array.from(
    new Set(acceptedClaims.flatMap((claim) => claim.evidence_item_ids)),
  );

  const organizationEvidence = await client.selectMany<EvidenceRow>(
    "evidence_items",
    { organization_id: input.organizationId },
    "id,organization_id,subject_type,subject_id,title,source_name,source_type,url,verification_status,confidence,visibility,captured_at",
  );

  const evidenceSnapshot = organizationEvidence.filter((item) =>
    evidenceIds.includes(item.id),
  );

  if (evidenceSnapshot.length === 0) {
    throw new Error("Draft score snapshots require retrievable evidence records.");
  }

  const snapshotRows = await client.insert<InsertedRow>("score_snapshots", {
    organization_id: input.organizationId,
    subject_type: input.subjectType,
    subject_id: input.subjectId ?? input.organizationId,
    scoring_version_id: input.scoringVersionId,
    as_of_at: new Date().toISOString(),
    evidence_snapshot: evidenceSnapshot,
    fact_snapshot: acceptedClaims,
    indicator_snapshot: [],
    pillar_snapshot: [],
    overall_score: null,
    overall_label: "Draft score snapshot - scoring math pending",
    evidence_coverage: deriveCoverage(evidenceSnapshot.length),
    recency: deriveRecency(evidenceSnapshot),
    verification_confidence: deriveConfidence(evidenceSnapshot),
    snapshot_hash: buildDraftSnapshotHash({
      scoringVersionId: input.scoringVersionId,
      claimIds: acceptedClaims.map((claim) => claim.id),
      evidenceIds,
    }),
    visibility: "private",
    published_at: null,
    snapshot_status: "draft",
    created_by: session.user.id,
    draft_reason: input.draftReason,
    source_claim_ids: acceptedClaims.map((claim) => claim.id),
    source_evidence_item_ids: evidenceIds,
  });

  const snapshot = snapshotRows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "score_snapshot.draft_created",
      subjectTable: "score_snapshots",
      subjectId: snapshot.id,
      reason: input.draftReason,
      afterData: {
        scoring_version_id: input.scoringVersionId,
        snapshot_status: "draft",
        claim_count: acceptedClaims.length,
        evidence_count: evidenceSnapshot.length,
        public: false,
      },
    }),
  );

  return snapshot;
}

function deriveCoverage(evidenceCount: number): Level {
  if (evidenceCount >= 5) return "High";
  if (evidenceCount >= 2) return "Medium";
  return "Low";
}

function deriveRecency(evidence: EvidenceRow[]): Recency {
  const newestCapturedAt = evidence
    .map((item) => Date.parse(item.captured_at))
    .filter(Number.isFinite)
    .sort((left, right) => right - left)[0];

  if (!newestCapturedAt) return "Stale";

  const ageInDays = (Date.now() - newestCapturedAt) / (1000 * 60 * 60 * 24);

  if (ageInDays <= 365) return "Fresh";
  if (ageInDays <= 730) return "Recent";
  return "Stale";
}

function deriveConfidence(evidence: EvidenceRow[]): Confidence {
  if (evidence.some((item) => item.confidence === "high")) return "high";
  if (evidence.some((item) => item.confidence === "medium")) return "medium";
  return "low";
}

function buildDraftSnapshotHash({
  scoringVersionId,
  claimIds,
  evidenceIds,
}: {
  scoringVersionId: string;
  claimIds: string[];
  evidenceIds: string[];
}) {
  return [
    "draft",
    scoringVersionId,
    [...claimIds].sort().join("."),
    [...evidenceIds].sort().join("."),
    Date.now().toString(),
  ].join(":");
}
