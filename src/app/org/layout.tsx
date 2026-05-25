import type { ReactNode } from "react";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getOrganizationSwitcherState } from "@/lib/organization-context";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function OrgLayout({ children }: { children: ReactNode }) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const switcherState = isSupabaseServerConfigured()
    ? await getOrganizationSwitcherState({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        currentOrganizationId: organizationId,
        session,
      })
    : null;

  return (
    <>
      {switcherState ? (
        <OrganizationSwitcher returnTo="/org/profile" state={switcherState} />
      ) : null}
      {children}
    </>
  );
}
