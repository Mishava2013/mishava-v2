import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import { evidenceFilesBucket, uploadPrivateEvidenceObject } from "./supabase/storage";
import type { SupabaseServerClient } from "./supabase/server";

export type EvidenceLifecycleStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "accepted"
  | "rejected"
  | "archived";

export type EvidenceFileStatus =
  | "active"
  | "replaced"
  | "archived"
  | "quarantined"
  | "scan_failed";

export type EvidenceFileRow = Record<string, unknown> & {
  id: string;
  organization_id: string;
  evidence_item_id: string;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  safe_filename: string;
  mime_type: string;
  file_size_bytes: number;
  version_number: number;
  status: EvidenceFileStatus;
  visibility: string;
  uploaded_by: string | null;
  uploaded_at: string;
};

type EvidenceRow = Record<string, unknown> & {
  id: string;
  organization_id: string;
  title: string;
  source_name: string;
  source_type: string;
  url: string | null;
  notes: string | null;
  visibility: string;
  verification_status: string;
  lifecycle_status?: EvidenceLifecycleStatus | null;
  document_path?: string | null;
};

export type EvidenceMetadataInput = {
  organizationId: string;
  evidenceItemId: string;
  title: string;
  sourceName: string;
  sourceType: string;
  url?: string | null;
  notes?: string | null;
  visibility: string;
  lifecycleStatus: EvidenceLifecycleStatus;
};

const allowedEvidenceFileTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const maxEvidenceFileSizeBytes = 10 * 1024 * 1024;

export function normalizeEvidenceLifecycleStatus(
  value: FormDataEntryValue | string | null,
): EvidenceLifecycleStatus {
  const status = String(value ?? "draft");
  if (
    status === "submitted" ||
    status === "reviewed" ||
    status === "accepted" ||
    status === "rejected" ||
    status === "archived"
  ) {
    return status;
  }
  return "draft";
}

export function validateEvidenceFile(file: File | null | undefined) {
  if (!file || file.size === 0) return null;

  if (!allowedEvidenceFileTypes.has(file.type)) {
    return "Unsupported file type. Use PDF, PNG, JPG, WebP, TXT, CSV, or DOCX.";
  }

  if (file.size > maxEvidenceFileSizeBytes) {
    return "Evidence files must be 10 MB or smaller.";
  }

  return null;
}

export async function uploadEvidenceFileForItem({
  client,
  evidenceItemId,
  file,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  evidenceItemId: string;
  file: File | null | undefined;
  organizationId: string;
  session: AuthSession;
}) {
  const validationError = validateEvidenceFile(file);
  if (validationError) return { ok: false, message: validationError };
  if (!file || file.size === 0) return { ok: true, message: "No file attached." };

  const evidence = await client.selectOne<EvidenceRow>(
    "evidence_items",
    { id: evidenceItemId, organization_id: organizationId },
    "id,organization_id,title,lifecycle_status,document_path",
  );

  if (!evidence) {
    return { ok: false, message: "Evidence item was not found for this organization." };
  }

  if ((evidence.lifecycle_status ?? "draft") === "archived") {
    return { ok: false, message: "Archived evidence cannot receive new files." };
  }

  const existingFiles = await client.selectMany<EvidenceFileRow>(
    "evidence_files",
    { evidence_item_id: evidenceItemId, organization_id: organizationId },
    "id,organization_id,evidence_item_id,storage_bucket,storage_path,original_filename,safe_filename,mime_type,file_size_bytes,version_number,status,visibility,uploaded_by,uploaded_at",
  );
  const nextVersion =
    existingFiles.reduce(
      (highest, item) => Math.max(highest, Number(item.version_number) || 0),
      0,
    ) + 1;
  const safeFilename = buildSafeFilename(file.name);
  const storagePath = `orgs/${organizationId}/evidence/${evidenceItemId}/v${nextVersion}/${safeFilename}`;

  await uploadPrivateEvidenceObject({
    contentType: file.type,
    fileBytes: await file.arrayBuffer(),
    path: storagePath,
  });

  const inserted = await client.insert<EvidenceFileRow>("evidence_files", {
    organization_id: organizationId,
    evidence_item_id: evidenceItemId,
    storage_bucket: evidenceFilesBucket,
    storage_path: storagePath,
    original_filename: file.name,
    safe_filename: safeFilename,
    mime_type: file.type,
    file_size_bytes: file.size,
    version_number: nextVersion,
    status: "active",
    visibility: "private",
    uploaded_by: session.user.id,
  });
  const evidenceFile = inserted.data[0];

  if (existingFiles.length > 0) {
    const activeFiles = existingFiles.filter((item) => item.status === "active");
    await Promise.all(
      activeFiles.map((item) =>
        client.update(
          "evidence_files",
          { id: item.id },
          {
            status: "replaced",
            replaced_by_file_id: evidenceFile.id,
          },
        ),
      ),
    );
  }

  await client.update(
    "evidence_items",
    { id: evidenceItemId },
    { document_path: storagePath },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: existingFiles.length > 0
        ? "evidence.file_replaced"
        : "evidence.file_uploaded",
      subjectTable: "evidence_files",
      subjectId: evidenceFile.id,
      reason: "Private evidence file attached.",
      afterData: {
        evidence_item_id: evidenceItemId,
        storage_bucket: evidenceFilesBucket,
        storage_path: storagePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        version_number: nextVersion,
      },
    }),
  );

  return {
    ok: true,
    message: "Evidence file uploaded.",
    evidenceFileId: evidenceFile.id,
  };
}

export async function updateEvidenceMetadata({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: EvidenceMetadataInput;
  session: AuthSession;
}) {
  const evidence = await client.selectOne<EvidenceRow>(
    "evidence_items",
    { id: input.evidenceItemId, organization_id: input.organizationId },
    "id,organization_id,title,source_name,source_type,url,notes,visibility,verification_status,lifecycle_status",
  );

  if (!evidence) {
    return { ok: false, message: "Evidence item was not found for this organization." };
  }

  if ((evidence.lifecycle_status ?? "draft") === "archived") {
    return { ok: false, message: "Archived evidence cannot be edited." };
  }

  if (input.title.trim().length < 2 || input.sourceName.trim().length < 2) {
    return { ok: false, message: "Evidence title and source are required." };
  }

  await client.update(
    "evidence_items",
    { id: input.evidenceItemId },
    {
      title: input.title.trim(),
      source_name: input.sourceName.trim(),
      source_type: input.sourceType.trim(),
      url: input.url?.trim() || null,
      notes: input.notes?.trim() || null,
      visibility: input.visibility,
      lifecycle_status: input.lifecycleStatus,
      updated_at: new Date().toISOString(),
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "evidence.updated",
      subjectTable: "evidence_items",
      subjectId: input.evidenceItemId,
      reason: "Evidence metadata updated.",
      beforeData: {
        title: evidence.title,
        source_name: evidence.source_name,
        visibility: evidence.visibility,
        lifecycle_status: evidence.lifecycle_status ?? "draft",
      },
      afterData: {
        title: input.title.trim(),
        source_name: input.sourceName.trim(),
        visibility: input.visibility,
        lifecycle_status: input.lifecycleStatus,
      },
    }),
  );

  return { ok: true, message: "Evidence updated." };
}

export async function archiveEvidenceItem({
  client,
  evidenceItemId,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  evidenceItemId: string;
  organizationId: string;
  session: AuthSession;
}) {
  const evidence = await client.selectOne<EvidenceRow>(
    "evidence_items",
    { id: evidenceItemId, organization_id: organizationId },
    "id,organization_id,title,lifecycle_status",
  );

  if (!evidence) {
    return { ok: false, message: "Evidence item was not found for this organization." };
  }

  if ((evidence.lifecycle_status ?? "draft") === "archived") {
    return { ok: false, message: "Evidence is already archived." };
  }

  const archivedAt = new Date().toISOString();

  await client.update(
    "evidence_items",
    { id: evidenceItemId },
    {
      lifecycle_status: "archived",
      archived_at: archivedAt,
      archived_by: session.user.id,
      updated_at: archivedAt,
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "evidence.archived",
      subjectTable: "evidence_items",
      subjectId: evidenceItemId,
      reason: "Evidence archived without deleting traceability.",
      beforeData: { lifecycle_status: evidence.lifecycle_status ?? "draft" },
      afterData: { lifecycle_status: "archived", archived_at: archivedAt },
    }),
  );

  return { ok: true, message: "Evidence archived." };
}

function buildSafeFilename(filename: string) {
  const [baseName, ...extensionParts] = filename.trim().split(".");
  const extension = extensionParts.pop();
  const safeBase =
    baseName
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || "evidence-file";
  const safeExtension = extension
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);

  return safeExtension ? `${safeBase}.${safeExtension}` : safeBase;
}
