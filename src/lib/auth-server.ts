import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  currentOrganizationCookieName,
  hasOrganizationMembership,
  isAdminSession,
  parseSessionCookieValue,
  sessionCookieName,
  supabaseAccessTokenCookieName,
  supabaseRefreshTokenCookieName,
  type AuthSession,
} from "./auth";
import { getAuthSessionFromAccessToken } from "./supabase/auth";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(supabaseAccessTokenCookieName)?.value;

  if (accessToken) {
    const session = await getAuthSessionFromAccessToken(accessToken);
    if (session) return session;
  }

  return parseSessionCookieValue(cookieStore.get(sessionCookieName)?.value);
}

export async function getCurrentOrganizationId() {
  const cookieStore = await cookies();
  return cookieStore.get(currentOrganizationCookieName)?.value ?? null;
}

export async function setSupabaseAuthCookies({
  accessToken,
  refreshToken,
  expiresIn,
}: {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}) {
  const cookieStore = await cookies();

  cookieStore.set(supabaseAccessTokenCookieName, accessToken, {
    ...authCookieOptions,
    maxAge: expiresIn ?? 60 * 60,
  });

  if (refreshToken) {
    cookieStore.set(supabaseRefreshTokenCookieName, refreshToken, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
  cookieStore.delete(supabaseAccessTokenCookieName);
  cookieStore.delete(supabaseRefreshTokenCookieName);
  cookieStore.delete(currentOrganizationCookieName);
}

export async function setCurrentOrganizationId(organizationId: string) {
  const cookieStore = await cookies();

  cookieStore.set(currentOrganizationCookieName, organizationId, {
    ...authCookieOptions,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCurrentOrganizationId() {
  const cookieStore = await cookies();
  cookieStore.delete(currentOrganizationCookieName);
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
  const selectedOrganizationId = await getCurrentOrganizationId();
  const hasSelectedOrganization = hasOrganizationMembership(
    session,
    selectedOrganizationId,
  );
  const organizationId =
    (hasSelectedOrganization ? selectedOrganizationId : null) ??
    (session.memberships.length === 1
      ? session.memberships[0]?.organizationId
      : null);

  if (!hasOrganizationMembership(session, organizationId)) {
    redirect(selectedOrganizationId ? "/app?org=invalid" : "/app?org=select");
  }

  return {
    session,
    organizationId: organizationId as string,
  };
}
