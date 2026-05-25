"use server";

import { redirect } from "next/navigation";
import {
  requireAuthenticatedSession,
  setCurrentOrganizationId,
} from "@/lib/auth-server";
import { acceptTeamInvite } from "@/lib/ngo-team";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function acceptTeamInviteAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const result = await acceptTeamInvite({
    client: createSupabaseServerClient(),
    inviteId: String(formData.get("inviteId") ?? ""),
    session,
  });

  if (!result.ok) {
    redirect(
      `/app/team-invites/${formData.get("inviteId")}?error=${encodeURIComponent(
        result.message,
      )}`,
    );
  }

  if (result.organizationId) {
    await setCurrentOrganizationId(result.organizationId);
  }

  redirect("/org/team?accepted=invite");
}
