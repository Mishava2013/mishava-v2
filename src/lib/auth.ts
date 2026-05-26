import type { RoleCode } from "./foundation";
import { rolesHaveNgoPermission, type NgoPermission } from "./ngo-permissions";

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
  accessToken?: string;
};

export const sessionCookieName = "mishava_session";
export const currentOrganizationCookieName = "mishava_current_org_id";
export const supabaseAccessTokenCookieName = "mishava_sb_access_token";
export const supabaseRefreshTokenCookieName = "mishava_sb_refresh_token";

export const adminRoles: RoleCode[] = [
  "mishava_admin",
  "methodology_owner",
  "support",
];

export const organizationAdminRoles: RoleCode[] = [
  "ngo_owner",
  "ngo_admin",
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
  return session.memberships.some(
    (membership) =>
      membership.organizationId === organizationId &&
      membership.roles.some((role) => allowedRoles.includes(role)),
  );
}

export function canManageNgoTeam(
  session: AuthSession | null,
  organizationId: string | null,
) {
  return hasNgoPermission(session, organizationId, "manage_team");
}

export function canManageNgoEvidence(
  session: AuthSession | null,
  organizationId: string | null,
) {
  return hasNgoPermission(session, organizationId, "create_evidence");
}

export function canManageNgoReports(
  session: AuthSession | null,
  organizationId: string | null,
) {
  return canManageNgoEvidence(session, organizationId);
}

export function canManageNgoBilling(
  session: AuthSession | null,
  organizationId: string | null,
) {
  return hasNgoPermission(session, organizationId, "manage_billing");
}

export function canViewNgoWorkspace(
  session: AuthSession | null,
  organizationId: string | null,
) {
  return hasNgoPermission(session, organizationId, "view_evidence");
}

export function hasNgoPermission(
  session: AuthSession | null,
  organizationId: string | null,
  permission: NgoPermission,
) {
  if (!session || !organizationId) return false;
  return session.memberships.some(
    (membership) =>
      membership.organizationId === organizationId &&
      rolesHaveNgoPermission(membership.roles, permission),
  );
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

export type SupabaseJwtClaims = {
  sub?: string;
  email?: string;
  app_metadata?: {
    roles?: unknown;
  };
  user_metadata?: {
    roles?: unknown;
  };
};

export function parseSupabaseAccessTokenValue(
  value?: string | null,
): Pick<AuthSession, "user"> | null {
  if (!value) return null;

  try {
    const [, payload] = value.split(".");
    if (!payload) return null;

    const claims = JSON.parse(decodeCookiePayload(payload)) as SupabaseJwtClaims;
    if (!claims.sub || !claims.email) return null;

    return {
      user: {
        id: claims.sub,
        email: claims.email,
        roles: parseRoleClaims(claims),
      },
    };
  } catch {
    return null;
  }
}

export function parseRoleClaims(claims: SupabaseJwtClaims): RoleCode[] {
  const rawRoles = [
    ...(Array.isArray(claims.app_metadata?.roles) ? claims.app_metadata.roles : []),
    ...(Array.isArray(claims.user_metadata?.roles) ? claims.user_metadata.roles : []),
  ];
  const roles = rawRoles.filter(isRoleCode);

  return roles.length > 0 ? roles : ["consumer"];
}

function isRoleCode(value: unknown): value is RoleCode {
  return (
    typeof value === "string" &&
    [
      "consumer",
      "ngo_owner",
      "ngo_admin",
      "ngo_member",
      "ngo_viewer",
      "business_owner",
      "business_member",
      "auditor_field",
      "audit_reviewer",
      "mishava_admin",
      "methodology_owner",
      "support",
      "press_reviewer",
      "sponsor_manager",
    ].includes(value)
  );
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
