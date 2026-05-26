"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  createTeamInvite,
  normalizeTeamRole,
  removeTeamMember,
  resendTeamInvite,
  revokeTeamInvite,
  updateTeamMemberRole,
} from "@/lib/ngo-team";
import { createSupabaseAuthenticatedServerClient } from "@/lib/supabase/server";

function normalizeDateTimeLocal(value: FormDataEntryValue | null) {
  const raw = String(value ?? "");
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export async function createTeamInviteAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const result = await createTeamInvite({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    session,
    input: {
      organizationId,
      email: String(formData.get("email") ?? ""),
      role: normalizeTeamRole(formData.get("role")),
      note: String(formData.get("note") ?? ""),
      expiresAt: normalizeDateTimeLocal(formData.get("expiresAt")),
    },
  });

  if (!result.ok) {
    redirect(`/org/team?error=${encodeURIComponent(result.message)}`);
  }

  redirect(
    `/org/team?created=invite&id=${result.inviteId}&email=${result.emailDeliveryStatus ?? "not_configured"}`,
  );
}

export async function resendTeamInviteAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const result = await resendTeamInvite({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    inviteId: String(formData.get("inviteId") ?? ""),
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/team?error=${encodeURIComponent(result.message)}`);
  }

  redirect(
    `/org/team?updated=invite_resent&id=${result.inviteId}&email=${result.emailDeliveryStatus ?? "not_configured"}`,
  );
}

export async function revokeTeamInviteAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const result = await revokeTeamInvite({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    inviteId: String(formData.get("inviteId") ?? ""),
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/team?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/team?updated=invite_revoked");
}

export async function removeTeamMemberAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const result = await removeTeamMember({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    membershipId: String(formData.get("membershipId") ?? ""),
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/team?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/team?updated=member_removed");
}

export async function updateTeamMemberRoleAction(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const result = await updateTeamMemberRole({
    client: createSupabaseAuthenticatedServerClient(session.accessToken),
    membershipId: String(formData.get("membershipId") ?? ""),
    newRole: normalizeTeamRole(formData.get("role")),
    organizationId,
    session,
  });

  if (!result.ok) {
    redirect(`/org/team?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/org/team?updated=member_role_changed");
}
