import type { RoleCode } from "./foundation";

export type SessionUser = {
  id: string;
  email: string;
  roles: RoleCode[];
};

export type OrganizationMembership = {
  organizationId: string;
  roles: RoleCode[];
};

export type AuthSession = {
  user: SessionUser;
  memberships: OrganizationMembership[];
};

export const sessionCookieName = "mishava_session";
export const currentOrganizationCookieName = "mishava_current_org_id";

export const adminRoles: RoleCode[] = [
  "mishava_admin",
  "methodology_owner",
  "support",
];

export const organizationAdminRoles: RoleCode[] = [
  "ngo_owner",
  "business_owner",
  "mishava_admin",
];

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

export function isAdminSession(session: AuthSession | null) {
  if (!session) return false;
  return session.user.roles.some((role) => adminRoles.includes(role));
}

export function hasOrganizationMembership(
  session: AuthSession | null,
  organizationId: string | null,
) {
  if (!session || !organizationId) return false;
  return session.memberships.some(
    (membership) => membership.organizationId === organizationId,
  );
}

export function hasOrganizationRole(
  session: AuthSession | null,
  organizationId: string | null,
  allowedRoles: RoleCode[],
) {
  if (!session || !organizationId) return false;
  const membership = session.memberships.find(
    (item) => item.organizationId === organizationId,
  );

  if (!membership) return false;

  return membership.roles.some((role) => allowedRoles.includes(role));
}

export function parseSessionCookieValue(value?: string | null): AuthSession | null {
  if (!value) return null;

  try {
    const decoded = decodeCookiePayload(value);
    const parsed = JSON.parse(decoded) as AuthSession;

    if (!parsed.user?.id || !parsed.user?.email || !Array.isArray(parsed.user.roles)) {
      return null;
    }

    if (!Array.isArray(parsed.memberships)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function decodeCookiePayload(value: string) {
  if (value.trim().startsWith("{")) {
    return value;
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  return atob(padded);
}
