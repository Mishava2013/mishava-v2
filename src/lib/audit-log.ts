import type { VisibilityLevel } from "./foundation";

export type AuditEventInput = {
  actorUserId: string | null;
  organizationId?: string;
  action: string;
  subjectTable?: string;
  subjectId?: string;
  reason: string;
  visibility?: VisibilityLevel;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
};

export function buildAuditEvent(input: AuditEventInput) {
  return {
    actor_user_id: input.actorUserId,
    organization_id: input.organizationId ?? null,
    action: input.action,
    subject_table: input.subjectTable ?? null,
    subject_id: input.subjectId ?? null,
    reason: input.reason,
    visibility: input.visibility ?? "private",
    before_data: input.beforeData ?? null,
    after_data: input.afterData ?? null,
    created_at: new Date().toISOString(),
  };
}
