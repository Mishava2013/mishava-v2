import {
  canManageNgoTeam,
  type AuthSession,
} from "./auth";
import { buildAuditEvent } from "./audit-log";
import type { SupabaseServerClient } from "./supabase/server";

export type TeamRole = "ngo_owner" | "ngo_admin" | "ngo_member" | "ngo_viewer";
export type MembershipStatus = "active" | "removed" | "suspended";
export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

export type TeamMember = {
  id: string;
  userId: string;
  role: TeamRole;
  status: MembershipStatus;
  displayEmail: string | null;
  displayName: string | null;
  createdAt: string;
  invitedAt: string | null;
  acceptedAt: string | null;
  removedAt: string | null;
};

export type TeamInvite = {
  id: string;
  email: string;
  role: TeamRole;
  status: InviteStatus;
  note: string | null;
  invitedBy: string | null;
  invitedAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
};

export type TeamWorkspace = {
  organizationName: string;
  canManageTeam: boolean;
  members: TeamMember[];
  invites: TeamInvite[];
};

export type TeamResult = {
  ok: boolean;
  message: string;
  inviteId?: string;
  organizationId?: string;
};

type OrganizationRow = {
  id: string;
  name: string;
};

type MembershipRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  status?: string | null;
  display_email?: string | null;
  display_name?: string | null;
  created_at: string;
  invited_at?: string | null;
  accepted_at?: string | null;
  removed_at?: string | null;
};

type InviteRow = {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  status: string;
  note?: string | null;
  invited_by?: string | null;
  accepted_by?: string | null;
  invited_at: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
  expires_at?: string | null;
};

const teamRoles: TeamRole[] = [
  "ngo_owner",
  "ngo_admin",
  "ngo_member",
  "ngo_viewer",
];

export function normalizeTeamRole(value: FormDataEntryValue | string | null): TeamRole {
  const role = String(value ?? "ngo_member");
  return teamRoles.includes(role as TeamRole) ? (role as TeamRole) : "ngo_member";
}

export function teamRoleLabel(role: string) {
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

export function canManageTeamRole(session: AuthSession, organizationId: string) {
  return canManageNgoTeam(session, organizationId);
}

export async function getNgoTeamWorkspace({
  client,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  session: AuthSession;
}): Promise<TeamWorkspace> {
  const organization = await client.selectOne<OrganizationRow>(
    "organizations",
    { id: organizationId },
    "id,name",
  );
  const members = await client.selectMany<MembershipRow>(
    "organization_memberships",
    { organization_id: organizationId },
    "id,organization_id,user_id,role,status,display_email,display_name,created_at,invited_at,accepted_at,removed_at",
  );
  const invites = await client.selectMany<InviteRow>(
    "organization_invites",
    { organization_id: organizationId },
    "id,organization_id,email,role,status,note,invited_by,accepted_by,invited_at,accepted_at,revoked_at,expires_at",
  );

  return {
    organizationName: organization?.name ?? "Current organization",
    canManageTeam: canManageTeamRole(session, organizationId),
    members: members
      .map((member) => ({
        id: member.id,
        userId: member.user_id,
        role: normalizeTeamRole(member.role),
        status: normalizeMembershipStatus(member.status),
        displayEmail:
          member.display_email ??
          (member.user_id === session.user.id ? session.user.email : null),
        displayName: member.display_name ?? null,
        createdAt: member.created_at,
        invitedAt: member.invited_at ?? null,
        acceptedAt: member.accepted_at ?? null,
        removedAt: member.removed_at ?? null,
      }))
      .sort(sortMembers),
    invites: invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: normalizeTeamRole(invite.role),
      status: normalizeInviteStatus(invite.status),
      note: invite.note ?? null,
      invitedBy: invite.invited_by ?? null,
      invitedAt: invite.invited_at,
      acceptedAt: invite.accepted_at ?? null,
      revokedAt: invite.revoked_at ?? null,
      expiresAt: invite.expires_at ?? null,
    })),
  };
}

export async function createTeamInvite({
  client,
  input,
  session,
}: {
  client: SupabaseServerClient;
  input: {
    organizationId: string;
    email: string;
    role: TeamRole;
    note?: string | null;
    expiresAt?: string | null;
  };
  session: AuthSession;
}): Promise<TeamResult> {
  if (!canManageTeamRole(session, input.organizationId)) {
    return { ok: false, message: "You do not have permission to manage this team." };
  }

  const email = input.email.trim().toLowerCase();
  if (!email.includes("@") || email.length < 5) {
    return { ok: false, message: "Invite email is required." };
  }

  const rows = await client.insert<InviteRow>("organization_invites", {
    organization_id: input.organizationId,
    email,
    role: input.role,
    status: "pending",
    note: input.note?.trim() || null,
    invited_by: session.user.id,
    expires_at: input.expiresAt || null,
  });
  const invite = rows.data[0];

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: input.organizationId,
      action: "team.invite_created",
      subjectTable: "organization_invites",
      subjectId: invite.id,
      reason: "NGO team invite created.",
      afterData: { email, role: input.role, status: "pending" },
    }),
  );

  return { ok: true, message: "Invite created.", inviteId: invite.id };
}

export async function revokeTeamInvite({
  client,
  inviteId,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  inviteId: string;
  organizationId: string;
  session: AuthSession;
}): Promise<TeamResult> {
  if (!canManageTeamRole(session, organizationId)) {
    return { ok: false, message: "You do not have permission to manage this team." };
  }

  const invite = await client.selectOne<InviteRow>(
    "organization_invites",
    { id: inviteId },
    "id,organization_id,email,role,status",
  );

  if (!invite || invite.organization_id !== organizationId) {
    return { ok: false, message: "Invite was not found for this organization." };
  }

  await client.update("organization_invites", { id: inviteId }, {
    status: "revoked",
    revoked_at: new Date().toISOString(),
    revoked_by: session.user.id,
  });

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "team.invite_revoked",
      subjectTable: "organization_invites",
      subjectId: inviteId,
      reason: "NGO team invite revoked.",
      beforeData: { status: invite.status },
      afterData: { status: "revoked" },
    }),
  );

  return { ok: true, message: "Invite revoked." };
}

export async function acceptTeamInvite({
  client,
  inviteId,
  session,
}: {
  client: SupabaseServerClient;
  inviteId: string;
  session: AuthSession;
}): Promise<TeamResult> {
  const invite = await client.selectOne<InviteRow>(
    "organization_invites",
    { id: inviteId },
    "id,organization_id,email,role,status,expires_at",
  );

  if (!invite) return { ok: false, message: "Invite was not found." };
  if (normalizeInviteStatus(invite.status) !== "pending") {
    return { ok: false, message: "Invite is not active." };
  }
  if (invite.expires_at && Date.parse(invite.expires_at) < Date.now()) {
    await client.update("organization_invites", { id: inviteId }, { status: "expired" });
    return { ok: false, message: "Invite has expired." };
  }
  if (invite.email.trim().toLowerCase() !== session.user.email.trim().toLowerCase()) {
    return { ok: false, message: "This invite belongs to a different email address." };
  }

  const existingMemberships = await client.selectMany<MembershipRow>(
    "organization_memberships",
    { organization_id: invite.organization_id, user_id: session.user.id },
    "id,organization_id,user_id,role,status",
  );
  const existingActive = existingMemberships.find(
    (membership) => normalizeMembershipStatus(membership.status) === "active",
  );
  const reactivatable = existingMemberships.find(
    (membership) => membership.role === invite.role,
  );
  const acceptedAt = new Date().toISOString();

  if (existingActive) {
    await client.update(
      "organization_memberships",
      { id: existingActive.id },
      {
        display_email: session.user.email,
        accepted_at: acceptedAt,
      },
    );
  } else if (reactivatable) {
    await client.update(
      "organization_memberships",
      { id: reactivatable.id },
      {
        status: "active",
        display_email: session.user.email,
        accepted_at: acceptedAt,
        removed_at: null,
        removed_by: null,
        status_reason: null,
      },
    );
  } else {
    await client.insert("organization_memberships", {
      organization_id: invite.organization_id,
      user_id: session.user.id,
      role: normalizeTeamRole(invite.role),
      status: "active",
      display_email: session.user.email,
      invited_at: acceptedAt,
      accepted_at: acceptedAt,
    });
  }

  await client.update(
    "organization_invites",
    { id: inviteId },
    {
      status: "accepted",
      accepted_by: session.user.id,
      accepted_at: acceptedAt,
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId: invite.organization_id,
      action: "team.invite_accepted",
      subjectTable: "organization_invites",
      subjectId: inviteId,
      reason: "NGO team invite accepted.",
      afterData: { email: session.user.email, role: invite.role },
    }),
  );

  return {
    ok: true,
    message: "Invite accepted.",
    organizationId: invite.organization_id,
  };
}

export async function removeTeamMember({
  client,
  membershipId,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  membershipId: string;
  organizationId: string;
  session: AuthSession;
}): Promise<TeamResult> {
  if (!canManageTeamRole(session, organizationId)) {
    return { ok: false, message: "You do not have permission to manage this team." };
  }

  const membership = await client.selectOne<MembershipRow>(
    "organization_memberships",
    { id: membershipId },
    "id,organization_id,user_id,role,status",
  );

  if (!membership || membership.organization_id !== organizationId) {
    return { ok: false, message: "Member was not found for this organization." };
  }
  if (normalizeMembershipStatus(membership.status) !== "active") {
    return { ok: false, message: "Member is already inactive." };
  }
  if (membership.role === "ngo_owner") {
    const activeOwners = await countActiveOwners(client, organizationId);
    if (activeOwners <= 1) {
      return { ok: false, message: "At least one active owner is required." };
    }
  }

  await client.update(
    "organization_memberships",
    { id: membershipId },
    {
      status: "removed",
      removed_at: new Date().toISOString(),
      removed_by: session.user.id,
      status_reason: "Removed from NGO team.",
    },
  );

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "team.member_removed",
      subjectTable: "organization_memberships",
      subjectId: membershipId,
      reason: "NGO team member removed.",
      beforeData: { role: membership.role, status: membership.status ?? "active" },
      afterData: { role: membership.role, status: "removed" },
    }),
  );

  return { ok: true, message: "Member removed." };
}

async function countActiveOwners(client: SupabaseServerClient, organizationId: string) {
  const members = await client.selectMany<MembershipRow>(
    "organization_memberships",
    { organization_id: organizationId },
    "id,role,status",
  );

  return members.filter(
    (member) =>
      member.role === "ngo_owner" && normalizeMembershipStatus(member.status) === "active",
  ).length;
}

function normalizeMembershipStatus(value?: string | null): MembershipStatus {
  if (value === "removed" || value === "suspended") return value;
  return "active";
}

function normalizeInviteStatus(value?: string | null): InviteStatus {
  if (value === "accepted" || value === "revoked" || value === "expired") {
    return value;
  }
  return "pending";
}

function sortMembers(a: TeamMember, b: TeamMember) {
  if (a.status !== b.status) return a.status === "active" ? -1 : 1;
  if (a.role === "ngo_owner" && b.role !== "ngo_owner") return -1;
  if (b.role === "ngo_owner" && a.role !== "ngo_owner") return 1;
  return (a.displayEmail ?? a.userId).localeCompare(b.displayEmail ?? b.userId);
}
