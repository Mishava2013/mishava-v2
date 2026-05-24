import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  currentOrganizationCookieName,
  hasOrganizationMembership,
  isAdminSession,
  parseSessionCookieValue,
  sessionCookieName,
  type AuthSession,
} from "./auth";

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  return parseSessionCookieValue(cookieStore.get(sessionCookieName)?.value);
}

export async function getCurrentOrganizationId() {
  const cookieStore = await cookies();
  return cookieStore.get(currentOrganizationCookieName)?.value ?? null;
}

export async function requireAuthenticatedSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/?auth=required");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireAuthenticatedSession();

  if (!isAdminSession(session)) {
    redirect("/?auth=admin_required");
  }

  return session;
}

export async function requireCurrentOrganizationMembership() {
  const session = await requireAuthenticatedSession();
  const organizationId = await getCurrentOrganizationId();

  if (!hasOrganizationMembership(session, organizationId)) {
    redirect("/?auth=organization_required");
  }

  return {
    session,
    organizationId: organizationId as string,
  };
}
