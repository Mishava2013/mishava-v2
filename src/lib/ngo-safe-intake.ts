import { randomBytes } from "node:crypto";
import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import { validateEvidenceFile } from "./evidence-files";
import {
  workerRightsActorTypes,
  workerRightsIndustryTags,
  workerRightsIssueCategories,
} from "./ngo";
import type { SupabaseServerClient } from "./supabase/server";
import {
  evidenceFilesBucket,
  uploadPrivateEvidenceObject,
} from "./supabase/storage";

type InsertedRow = Record<string, unknown> & { id: string };

export type SafeIntakeLinkStatus = "active" | "paused" | "revoked";
export type SafeIntakeSubmissionStatus =
  | "pending_review"
  | "reviewed"
  | "accepted_for_evidence_review"
  | "rejected";

export type SafeIntakeLinkRow = InsertedRow & {
  organization_id: string;
  created_by: string | null;
  token: string;
  title: string;
  description: string | null;
  status: SafeIntakeLinkStatus;
  purpose: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SafeIntakeSubmissionRow = InsertedRow & {
  organization_id: string;
  intake_link_id: string;
  evidence_item_id: string | null;
  status: SafeIntakeSubmissionStatus;
  submitter_label: string | null;
  issue_category: string | null;
  industry_tag: string | null;
  actor_type: string | null;
  worksite_or_employer: string | null;
  happened_at: string | null;
  narrative: string | null;
  share_outside_ngo: string | null;
  retaliation_concern: string | null;
  worker_name_private: string | null;
  immigration_concern: string | null;
  safe_contact_method: string | null;
  contact_detail: string | null;
  attached_file_count: number;
  review_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SafeIntakeWorkspace = {
  links: SafeIntakeLinkRow[];
  submissions: SafeIntakeSubmissionRow[];
};

export type SafeIntakeSubmissionInput = {
  token: string;
  submitterLabel?: string;
  issueCategory?: string;
  industryTag?: string;
  actorType?: string;
  worksiteOrEmployer?: string;
  happenedAt?: string;
  narrative?: string;
  shareOutsideNgo?: string;
  retaliationConcern?: string;
  workerNamePrivate?: string;
  immigrationConcern?: string;
  safeContactMethod?: string;
  contactDetail?: string;
  evidenceFile?: File | null;
};

export async function getSafeIntakeWorkspace({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}): Promise<SafeIntakeWorkspace> {
  const [links, submissions] = await Promise.all([
    client.selectMany<SafeIntakeLinkRow>(
      "ngo_safe_intake_links",
      { organization_id: organizationId },
      safeIntakeLinkSelect,
    ),
    client.selectMany<SafeIntakeSubmissionRow>(
      "ngo_safe_intake_submissions",
      { organization_id: organizationId },
      safeIntakeSubmissionSelect,
    ),
  ]);

  return {
    links: links.sort(sortNewestFirst),
    submissions: submissions.sort(sortNewestFirst),
  };
}

export async function getSafeIntakeLinkByToken({
  client,
  token,
}: {
  client: SupabaseServerClient;
  token: string;
}) {
  const link = await client.selectOne<SafeIntakeLinkRow>(
    "ngo_safe_intake_links",
    { token },
    safeIntakeLinkSelect,
  );

  if (!link || !isSafeIntakeLinkOpen(link)) return null;
  return link;
}

export async function createSafeIntakeLink({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: {
    organizationId: string;
    title: string;
    description?: string;
    purpose?: string;
    expiresAt?: string | null;
  };
  session: AuthSession;
}) {
  if (input.title.trim().length < 2) {
    return { ok: false, message: "Add a short link name." };
  }

  const inserted = await client.insert<SafeIntakeLinkRow>("ngo_safe_intake_links", {
    organization_id: input.organizationId,
    created_by: session.user.id,
    token: createSafeIntakeToken(),
    title: input.title.trim(),
    description: input.description?.trim() || null,
    purpose: input.purpose?.trim() || null,
    expires_at: input.expiresAt || null,
    status: "active",
  });
  const link = inserted.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_safe_intake.link_created",
      subjectTable: "ngo_safe_intake_links",
      subjectId: link.id,
      reason: "NGO safe intake link created.",
      afterData: {
        status: link.status,
        public_complaint_portal: false,
        client_account_required: false,
      },
    }),
  );

  return { ok: true, message: "Safe intake link created.", link };
}

export async function updateSafeIntakeLinkStatus({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: {
    organizationId: string;
    linkId: string;
    status: SafeIntakeLinkStatus;
  };
  session: AuthSession;
}) {
  const rows = await client.update<SafeIntakeLinkRow>(
    "ngo_safe_intake_links",
    { id: input.linkId, organization_id: input.organizationId },
    {
      status: input.status,
      updated_at: new Date().toISOString(),
    },
  );
  const link = rows.data[0];
  if (!link) return { ok: false, message: "Safe intake link was not found." };

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_safe_intake.link_status_changed",
      subjectTable: "ngo_safe_intake_links",
      subjectId: input.linkId,
      reason: "NGO safe intake link status changed.",
      afterData: { status: input.status },
    }),
  );

  return { ok: true, message: "Safe intake link updated.", link };
}

export async function createSafeIntakeSubmission({
  client,
  input,
}: {
  client: SupabaseServerClient;
  input: SafeIntakeSubmissionInput;
}) {
  const link = await getSafeIntakeLinkByToken({ client, token: input.token });
  if (!link) return { ok: false, message: "This intake link is not open." };

  const validationError = validateSafeIntakeSubmission(input);
  if (validationError) return { ok: false, message: validationError };

  const fileValidation = validateEvidenceFile(input.evidenceFile);
  if (fileValidation) return { ok: false, message: fileValidation };

  const ngoProfileId = await getNgoProfileId(client, link.organization_id);
  if (!ngoProfileId) {
    return {
      ok: false,
      message: "This organization is not ready to receive intake yet.",
    };
  }

  const evidenceRows = await client.insert<InsertedRow>("evidence_items", {
    organization_id: link.organization_id,
    subject_type: "ngo",
    title: buildSubmissionTitle(input),
    source_name: input.submitterLabel?.trim() || "Client intake",
    source_type: "safe_intake_submission",
    url: null,
    notes: buildSubmissionNotes(input),
    visibility: "private",
    verification_status: "unverified",
    lifecycle_status: "draft",
    confidence: "low",
    provenance: {
      intake: "safe_intake_link",
      intake_link_id: link.id,
      public_complaint_portal: false,
      client_account_required: false,
      staff_review_required: true,
    },
    created_by: null,
  });
  const evidence = evidenceRows.data[0];

  const fileUpload = await uploadSafeIntakeFile({
    client,
    evidenceItemId: evidence.id,
    file: input.evidenceFile,
    organizationId: link.organization_id,
  });
  if (!fileUpload.ok) return fileUpload;

  const submissionRows = await client.insert<SafeIntakeSubmissionRow>(
    "ngo_safe_intake_submissions",
    {
      organization_id: link.organization_id,
      intake_link_id: link.id,
      evidence_item_id: evidence.id,
      status: "pending_review",
      submitter_label: input.submitterLabel?.trim() || null,
      issue_category: normalizeOption(input.issueCategory),
      industry_tag: normalizeOption(input.industryTag),
      actor_type: normalizeOption(input.actorType),
      worksite_or_employer: input.worksiteOrEmployer?.trim() || null,
      happened_at: input.happenedAt?.trim() || null,
      narrative: input.narrative?.trim() || null,
      share_outside_ngo: normalizeOption(input.shareOutsideNgo),
      retaliation_concern: normalizeOption(input.retaliationConcern),
      worker_name_private: normalizeOption(input.workerNamePrivate),
      immigration_concern: normalizeOption(input.immigrationConcern),
      safe_contact_method: normalizeOption(input.safeContactMethod),
      contact_detail: input.contactDetail?.trim() || null,
      attached_file_count: fileUpload.fileAttached ? 1 : 0,
    },
  );
  const submission = submissionRows.data[0];

  await client.insert("ngo_evidence_submissions", {
    ngo_profile_id: ngoProfileId,
    evidence_item_id: evidence.id,
    submitted_by: null,
    intake_type: "safe_intake_link",
    title: buildSubmissionTitle(input),
    description: input.narrative?.trim() || null,
    approval_status: "submitted",
  });

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: null,
      organizationId: link.organization_id,
      action: "ngo_safe_intake.submission_created",
      subjectTable: "ngo_safe_intake_submissions",
      subjectId: submission.id,
      reason: "Client submitted a private safe intake form.",
      afterData: {
        intake_link_id: link.id,
        evidence_item_id: evidence.id,
        status: submission.status,
        raw_file_public: false,
        public_report_created: false,
        staff_review_required: true,
      },
    }),
  );

  return { ok: true, message: "Intake sent to the organization." };
}

export async function reviewSafeIntakeSubmission({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: {
    organizationId: string;
    submissionId: string;
    status: SafeIntakeSubmissionStatus;
    reviewNote?: string;
  };
  session: AuthSession;
}) {
  const submission = await client.selectOne<SafeIntakeSubmissionRow>(
    "ngo_safe_intake_submissions",
    { id: input.submissionId, organization_id: input.organizationId },
    safeIntakeSubmissionSelect,
  );

  if (!submission) {
    return { ok: false, message: "Safe intake submission was not found." };
  }

  const reviewedAt = new Date().toISOString();
  await client.update<SafeIntakeSubmissionRow>(
    "ngo_safe_intake_submissions",
    { id: submission.id, organization_id: input.organizationId },
    {
      status: input.status,
      review_note: input.reviewNote?.trim() || null,
      reviewed_by: session.user.id,
      reviewed_at: reviewedAt,
      updated_at: reviewedAt,
    },
  );

  if (submission.evidence_item_id) {
    await client.update(
      "evidence_items",
      { id: submission.evidence_item_id, organization_id: input.organizationId },
      {
        lifecycle_status:
          input.status === "accepted_for_evidence_review"
            ? "submitted"
            : input.status === "rejected"
              ? "rejected"
              : "reviewed",
        updated_at: reviewedAt,
      },
    );
  }

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "ngo_safe_intake.submission_reviewed",
      subjectTable: "ngo_safe_intake_submissions",
      subjectId: submission.id,
      reason: "NGO staff reviewed a safe intake submission.",
      beforeData: { status: submission.status },
      afterData: {
        status: input.status,
        evidence_item_id: submission.evidence_item_id,
        public_report_created: false,
        public_score_created: false,
      },
    }),
  );

  return { ok: true, message: "Safe intake submission reviewed." };
}

export function isSafeIntakeLinkOpen(link: SafeIntakeLinkRow) {
  if (link.status !== "active") return false;
  if (!link.expires_at) return true;
  return new Date(link.expires_at).getTime() > Date.now();
}

export const safeIntakeLinkSelect =
  "id,organization_id,created_by,token,title,description,status,purpose,expires_at,created_at,updated_at";

export const safeIntakeSubmissionSelect =
  "id,organization_id,intake_link_id,evidence_item_id,status,submitter_label,issue_category,industry_tag,actor_type,worksite_or_employer,happened_at,narrative,share_outside_ngo,retaliation_concern,worker_name_private,immigration_concern,safe_contact_method,contact_detail,attached_file_count,review_note,reviewed_by,reviewed_at,created_at,updated_at";

async function uploadSafeIntakeFile({
  client,
  evidenceItemId,
  file,
  organizationId,
}: {
  client: SupabaseServerClient;
  evidenceItemId: string;
  file: File | null | undefined;
  organizationId: string;
}) {
  if (!file || file.size === 0) {
    return { ok: true, message: "No file attached.", fileAttached: false };
  }

  const safeFilename = buildSafeFilename(file.name);
  const storagePath = `orgs/${organizationId}/intake/${evidenceItemId}/${Date.now()}-${safeFilename}`;
  await uploadPrivateEvidenceObject({
    contentType: file.type,
    fileBytes: await file.arrayBuffer(),
    path: storagePath,
  });

  await client.insert("evidence_files", {
    organization_id: organizationId,
    evidence_item_id: evidenceItemId,
    storage_bucket: evidenceFilesBucket,
    storage_path: storagePath,
    original_filename: file.name,
    safe_filename: safeFilename,
    mime_type: file.type,
    file_size_bytes: file.size,
    version_number: 1,
    status: "active",
    scan_status:
      process.env.EVIDENCE_FILE_SCANNER_ENABLED === "true"
        ? "pending"
        : "not_scanned",
    visibility: "private",
    uploaded_by: null,
  });

  await client.update(
    "evidence_items",
    { id: evidenceItemId, organization_id: organizationId },
    { document_path: storagePath },
  );

  return { ok: true, message: "Private file attached.", fileAttached: true };
}

async function getNgoProfileId(client: SupabaseServerClient, organizationId: string) {
  const profile = await client.selectOne<InsertedRow>(
    "ngo_profiles",
    { organization_id: organizationId },
    "id",
  );
  return profile?.id ?? null;
}

function validateSafeIntakeSubmission(input: SafeIntakeSubmissionInput) {
  if ((input.narrative?.trim().length ?? 0) < 3) {
    return "Tell us a little about what happened.";
  }
  return null;
}

function buildSubmissionTitle(input: SafeIntakeSubmissionInput) {
  const issue = normalizeOption(input.issueCategory) ?? "Safe intake";
  const worksite = input.worksiteOrEmployer?.trim();
  return worksite ? `${issue} - ${worksite}` : issue;
}

function buildSubmissionNotes(input: SafeIntakeSubmissionInput) {
  return [
    `Issue: ${normalizeOption(input.issueCategory) ?? "Not sure"}`,
    `Work type: ${normalizeOption(input.industryTag) ?? "Not sure"}`,
    `Who was involved: ${normalizeOption(input.actorType) ?? "Not sure"}`,
    `Employer or worksite: ${input.worksiteOrEmployer?.trim() || "Not sure"}`,
    `When: ${input.happenedAt?.trim() || "Not sure"}`,
    `Can this be shared outside the NGO: ${normalizeOption(input.shareOutsideNgo) ?? "Not sure"}`,
    `Retaliation concern: ${normalizeOption(input.retaliationConcern) ?? "Not sure"}`,
    `Worker name should stay private: ${normalizeOption(input.workerNamePrivate) ?? "Yes"}`,
    `Immigration-related threat or fear: ${normalizeOption(input.immigrationConcern) ?? "Not sure"}`,
    `Safe contact method: ${normalizeOption(input.safeContactMethod) ?? "Through the NGO only"}`,
    `Contact detail: ${input.contactDetail?.trim() || "Not provided"}`,
    "",
    "What happened:",
    input.narrative?.trim() || "Not provided",
  ].join("\n");
}

function normalizeOption(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "Not sure yet") return null;
  return trimmed;
}

function createSafeIntakeToken() {
  return randomBytes(18).toString("base64url");
}

function sortNewestFirst<T extends { created_at: string }>(left: T, right: T) {
  return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
}

function buildSafeFilename(filename: string) {
  const [baseName, ...extensionParts] = filename.trim().split(".");
  const extension = extensionParts.pop();
  const safeBase =
    baseName
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || "intake-file";
  const safeExtension = extension
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);

  return safeExtension ? `${safeBase}.${safeExtension}` : safeBase;
}

export const safeIntakeIssueOptions = workerRightsIssueCategories;
export const safeIntakeIndustryOptions = workerRightsIndustryTags;
export const safeIntakeActorOptions = workerRightsActorTypes;
