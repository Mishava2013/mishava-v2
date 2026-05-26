import type { RoleCode } from "./foundation";

export type NgoRole = "ngo_owner" | "ngo_admin" | "ngo_member" | "ngo_viewer";

export type NgoPermission =
  | "manage_team"
  | "manage_billing"
  | "create_evidence"
  | "edit_evidence"
  | "archive_evidence"
  | "upload_files"
  | "create_reports"
  | "edit_reports"
  | "export_reports"
  | "share_reports"
  | "view_reports"
  | "view_evidence"
  | "view_billing"
  | "view_audit_summary"
  | "admin_support";

export const ngoRoles: NgoRole[] = [
  "ngo_owner",
  "ngo_admin",
  "ngo_member",
  "ngo_viewer",
];

export const ngoPermissions: NgoPermission[] = [
  "manage_team",
  "manage_billing",
  "create_evidence",
  "edit_evidence",
  "archive_evidence",
  "upload_files",
  "create_reports",
  "edit_reports",
  "export_reports",
  "share_reports",
  "view_reports",
  "view_evidence",
  "view_billing",
  "view_audit_summary",
  "admin_support",
];

export const ngoRolePermissionMatrix: Record<NgoRole, NgoPermission[]> = {
  ngo_owner: [
    "manage_team",
    "manage_billing",
    "create_evidence",
    "edit_evidence",
    "archive_evidence",
    "upload_files",
    "create_reports",
    "edit_reports",
    "export_reports",
    "share_reports",
    "view_reports",
    "view_evidence",
    "view_billing",
    "view_audit_summary",
  ],
  ngo_admin: [
    "manage_team",
    "manage_billing",
    "create_evidence",
    "edit_evidence",
    "archive_evidence",
    "upload_files",
    "create_reports",
    "edit_reports",
    "export_reports",
    "share_reports",
    "view_reports",
    "view_evidence",
    "view_billing",
    "view_audit_summary",
  ],
  ngo_member: [
    "create_evidence",
    "edit_evidence",
    "archive_evidence",
    "upload_files",
    "create_reports",
    "edit_reports",
    "export_reports",
    "view_reports",
    "view_evidence",
    "view_billing",
  ],
  ngo_viewer: [
    "export_reports",
    "view_reports",
    "view_evidence",
    "view_billing",
  ],
};

export function isNgoRole(role: RoleCode | string): role is NgoRole {
  return ngoRoles.includes(role as NgoRole);
}

export function roleHasNgoPermission(
  role: RoleCode | string,
  permission: NgoPermission,
) {
  if (role === "mishava_admin" && permission !== "admin_support") {
    return true;
  }
  if (role === "mishava_admin" || role === "support") {
    return permission === "admin_support";
  }
  if (!isNgoRole(role)) return false;
  return ngoRolePermissionMatrix[role].includes(permission);
}

export function rolesHaveNgoPermission(
  roles: readonly (RoleCode | string)[],
  permission: NgoPermission,
) {
  return roles.some((role) => roleHasNgoPermission(role, permission));
}

export function ngoRoleLabel(role: string) {
  switch (role) {
    case "ngo_owner":
      return "Owner";
    case "ngo_admin":
      return "Admin";
    case "ngo_viewer":
      return "Viewer";
    default:
      return "Member";
  }
}

export function ngoPermissionSummary(role: NgoRole) {
  switch (role) {
    case "ngo_owner":
      return "Full NGO workspace access, team management, billing management, reports, sharing, evidence, and files.";
    case "ngo_admin":
      return "Team management, billing management, reports, sharing, evidence, and files.";
    case "ngo_member":
      return "Create and edit evidence and reports, export report summaries, upload files, and view billing.";
    case "ngo_viewer":
      return "Read-only access to allowed evidence, report exports, and billing views.";
  }
}
