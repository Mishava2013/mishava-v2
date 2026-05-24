import type { RoleCode } from "./foundation";

export type SessionUser = {
  id: string;
  email: string;
  roles: RoleCode[];
};

export function canReviewAudit(user: SessionUser) {
  return user.roles.includes("audit_reviewer") || user.roles.includes("mishava_admin");
}

export function canPerformFieldAudit(user: SessionUser) {
  return user.roles.includes("auditor_field") || user.roles.includes("mishava_admin");
}

export function canApproveScoringVersion(user: SessionUser) {
  return (
    user.roles.includes("methodology_owner") ||
    user.roles.includes("mishava_admin")
  );
}

export function assertFieldAuditorIsNotReviewer({
  fieldAuditorUserId,
  reviewerUserId,
}: {
  fieldAuditorUserId: string;
  reviewerUserId: string;
}) {
  if (fieldAuditorUserId === reviewerUserId) {
    throw new Error("Field auditor and audit reviewer must be separate people.");
  }
}

