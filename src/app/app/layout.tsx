import type { ReactNode } from "react";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import {
  getCurrentOrganizationId,
  requireAuthenticatedSession,
} from "@/lib/auth-server";
import { getOrganizationSwitcherState } from "@/lib/organization-context";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireAuthenticatedSession();
  const currentOrganizationId = await getCurrentOrganizationId();
  const switcherState = isSupabaseServerConfigured()
    ? await getOrganizationSwitcherState({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        currentOrganizationId,
        session,
      })
    : null;

  return (
    <>
      {switcherState ? (
        <OrganizationSwitcher returnTo="/app" state={switcherState} />
      ) : null}
      {children}
    </>
  );
}
