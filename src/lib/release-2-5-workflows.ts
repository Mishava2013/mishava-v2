import type { AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import { enforceNgoEntitlement } from "./ngo-billing";
import type { SupabaseServerClient } from "./supabase/server";

export type WorkflowResult = {
  ok: boolean;
  message: string;
  organizationId?: string;
  evidenceId?: string;
};

export type NgoOnboardingInput = {
  publicName: string;
  legalName?: string;
  country: string;
  missionArea: string;
  websiteUrl?: string;
  registrationIdentifier?: string;
  defaultVisibility: "private" | "approved_viewer" | "public_summary";
  summary?: string;
};

export type EvidenceInput = {
  organizationId: string;
  title: string;
  sourceName: string;
  sourceType: string;
  url?: string;
  notes?: string;
  visibility: "private" | "organization_shared" | "approved_viewer" | "public_summary";
  verificationStatus:
    | "unverified"
    | "self_attested"
    | "public_record_checked"
    | "document_checked";
  lifecycleStatus?: "draft" | "submitted";
};

type InsertedRow = Record<string, unknown> & { id: string };

export function validateNgoOnboardingInput(input: NgoOnboardingInput) {
  const errors: string[] = [];

  if (input.publicName.trim().length < 2) errors.push("Public name is required.");
  if (input.country.trim().length < 2) errors.push("Country is required.");
  if (input.missionArea.trim().length < 2) errors.push("Mission area is required.");

  if (input.websiteUrl && !isSafeUrl(input.websiteUrl)) {
    errors.push("Website URL must start with http:// or https://.");
  }

  return errors;
}

export function validateEvidenceInput(input: EvidenceInput) {
  const errors: string[] = [];

  if (!input.organizationId) errors.push("Organization is required.");
  if (input.title.trim().length < 2) errors.push("Evidence title is required.");
  if (input.sourceName.trim().length < 2) errors.push("Source name is required.");
  if (input.sourceType.trim().length < 2) errors.push("Source type is required.");

  if (input.url && !isSafeUrl(input.url)) {
    errors.push("Evidence URL must start with http:// or https://.");
  }

  return errors;
}

export async function createNgoOnboardingRecord({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: NgoOnboardingInput;
}): Promise<WorkflowResult> {
  const validationErrors = validateNgoOnboardingInput(input);

  if (validationErrors.length > 0) {
    return { ok: false, message: validationErrors.join(" ") };
  }

  const organizationRows = await client.insert<InsertedRow>("organizations", {
    organization_type: "ngo",
    name: input.publicName.trim(),
    slug: slugify(input.publicName),
    country_code: input.country.trim(),
    public_summary: input.summary?.trim() || null,
    created_by: session.user.id,
  });

  const organization = organizationRows.data[0];

  await client.insert("organization_memberships", {
    organization_id: organization.id,
    user_id: session.user.id,
    role: "ngo_owner",
  });

  await client.insert("ngo_profiles", {
    organization_id: organization.id,
    tier: "free_ngo",
    public_name: input.publicName.trim(),
    legal_name: input.legalName?.trim() || null,
    mission_area: input.missionArea.trim(),
    website_url: input.websiteUrl?.trim() || null,
    registration_identifier: input.registrationIdentifier?.trim() || null,
    default_visibility: input.defaultVisibility,
    profile_status: "draft",
    created_by: session.user.id,
  });

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: organization.id,
      action: "ngo_profile.created",
      subjectTable: "ngo_profiles",
      reason: "NGO onboarding submitted.",
      afterData: {
        public_name: input.publicName.trim(),
        mission_area: input.missionArea.trim(),
        default_visibility: input.defaultVisibility,
      },
    }),
  );

  return {
    ok: true,
    message: "NGO profile created.",
    organizationId: organization.id,
  };
}

export async function createEvidenceRecord({
  client,
  session,
  input,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  input: EvidenceInput;
}): Promise<WorkflowResult> {
  const validationErrors = validateEvidenceInput(input);

  if (validationErrors.length > 0) {
    return { ok: false, message: validationErrors.join(" ") };
  }

  const entitlement = await enforceNgoEntitlement({
    check: "evidence_item_create",
    client,
    organizationId: input.organizationId,
    session,
  });

  if (!entitlement.allowed) {
    return { ok: false, message: entitlement.message };
  }

  const evidenceRows = await client.insert<InsertedRow>("evidence_items", {
    organization_id: input.organizationId,
    subject_type: "ngo",
    title: input.title.trim(),
    source_name: input.sourceName.trim(),
    source_type: input.sourceType.trim(),
    url: input.url?.trim() || null,
    notes: input.notes?.trim() || null,
    visibility: input.visibility,
    verification_status: input.verificationStatus,
    lifecycle_status: input.lifecycleStatus ?? "draft",
    confidence: "low",
    provenance: {
      intake: "manual",
      submitted_by: session.user.id,
    },
    created_by: session.user.id,
  });

  const evidence = evidenceRows.data[0];
  const ngoProfile = await client.selectOne<InsertedRow>(
    "ngo_profiles",
    { organization_id: input.organizationId },
    "id",
  );

  if (ngoProfile) {
    await client.insert("ngo_evidence_submissions", {
      ngo_profile_id: ngoProfile.id,
      evidence_item_id: evidence.id,
      submitted_by: session.user.id,
      intake_type: input.sourceType.trim(),
      title: input.title.trim(),
      description: input.notes?.trim() || null,
      approval_status: "draft",
    });
  }

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "evidence.created",
      subjectTable: "evidence_items",
      subjectId: evidence.id,
      reason: "Manual evidence entry created.",
      afterData: {
        title: input.title.trim(),
        source_type: input.sourceType.trim(),
        visibility: input.visibility,
        verification_status: input.verificationStatus,
        lifecycle_status: input.lifecycleStatus ?? "draft",
      },
    }),
  );

  return {
    ok: true,
    message: "Evidence created.",
    evidenceId: evidence.id,
  };
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "organization"}-${Date.now()}`;
}

function isSafeUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}
