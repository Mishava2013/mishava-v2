import type { AuthSession } from "./auth";
import type { RoleCode } from "./foundation";
import type { SupabaseServerClient } from "./supabase/server";

export type OrganizationSwitcherItem = {
  id: string;
  name: string;
  organizationType: string;
  roles: RoleCode[];
};

export type OrganizationSwitcherState = {
  organizations: OrganizationSwitcherItem[];
  currentOrganization: OrganizationSwitcherItem | null;
  selectedOrganizationId: string | null;
  hasStaleSelection: boolean;
};

type OrganizationRow = {
  id: string;
  name: string;
  organization_type: string;
};

export async function getOrganizationSwitcherState({
  client,
  currentOrganizationId,
  session,
}: {
  client: SupabaseServerClient;
  currentOrganizationId: string | null;
  session: AuthSession;
}): Promise<OrganizationSwitcherState> {
  const organizations = await getSessionOrganizations({ client, session });
  const selectedOrganizationId =
    currentOrganizationId ??
    (organizations.length === 1 ? organizations[0]?.id ?? null : null);
  const currentOrganization =
    organizations.find((item) => item.id === selectedOrganizationId) ?? null;

  return {
    organizations,
    currentOrganization,
    selectedOrganizationId,
    hasStaleSelection: Boolean(currentOrganizationId && !currentOrganization),
  };
}

export function canSelectOrganization(
  session: AuthSession,
  organizationId: string | null,
) {
  if (!organizationId) return false;
  return session.memberships.some(
    (membership) => membership.organizationId === organizationId,
  );
}

async function getSessionOrganizations({
  client,
  session,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
}) {
  const items = await Promise.all(
    session.memberships.map(async (membership) => {
      const organization = await client.selectOne<OrganizationRow>(
        "organizations",
        { id: membership.organizationId },
        "id,name,organization_type",
      );

      if (!organization) return null;

      return {
        id: organization.id,
        name: organization.name,
        organizationType: organization.organization_type,
        roles: membership.roles,
      };
    }),
  );

  return items
    .filter((item): item is OrganizationSwitcherItem => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name));
}
