import type { AuthSession, SupabaseJwtClaims } from "@/lib/auth";
import { parseRoleClaims } from "@/lib/auth";

type SupabaseAuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
  error?: string;
  error_description?: string;
  msg?: string;
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
  app_metadata?: SupabaseJwtClaims["app_metadata"];
  user_metadata?: SupabaseJwtClaims["user_metadata"];
};

type MembershipRow = {
  organization_id: string;
  role: string;
};

export type SupabaseAuthResult = {
  ok: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: SupabaseAuthUser;
  needsEmailConfirmation?: boolean;
};

export function isSupabaseAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function signUpWithPassword({
  email,
  password,
  redirectTo,
}: {
  email: string;
  password: string;
  redirectTo?: string;
}): Promise<SupabaseAuthResult> {
  const response = await authRequest<SupabaseAuthResponse>("/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      options: redirectTo ? { email_redirect_to: redirectTo } : undefined,
    }),
  });

  return normalizeAuthResponse(response, "Sign-up request submitted.");
}

export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SupabaseAuthResult> {
  const response = await authRequest<SupabaseAuthResponse>(
    "/token?grant_type=password",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  return normalizeAuthResponse(response, "Signed in.");
}

export async function requestPasswordReset({
  email,
  redirectTo,
}: {
  email: string;
  redirectTo?: string;
}): Promise<SupabaseAuthResult> {
  const response = await authRequest<SupabaseAuthResponse>("/recover", {
    method: "POST",
    body: JSON.stringify({
      email,
      gotrue_meta_security: redirectTo ? { redirect_to: redirectTo } : undefined,
    }),
  });

  return normalizeAuthResponse(response, "Password reset requested.");
}

export async function updatePasswordWithToken({
  accessToken,
  password,
}: {
  accessToken: string;
  password: string;
}): Promise<SupabaseAuthResult> {
  const response = await authRequest<SupabaseAuthResponse>(
    "/user",
    {
      method: "PUT",
      body: JSON.stringify({ password }),
    },
    accessToken,
  );

  return normalizeAuthResponse(response, "Password updated.");
}

export async function signOutAccessToken(accessToken?: string | null) {
  if (!accessToken || !isSupabaseAuthConfigured()) {
    return;
  }

  await authRequest<SupabaseAuthResponse>(
    "/logout",
    { method: "POST" },
    accessToken,
  );
}

export async function getAuthUser(accessToken: string) {
  const response = await authRequest<SupabaseAuthResponse>(
    "/user",
    { method: "GET" },
    accessToken,
  );

  return response.user ?? (isSupabaseAuthUser(response) ? response : null);
}

export async function getAuthSessionFromAccessToken(
  accessToken: string,
): Promise<AuthSession | null> {
  if (!accessToken || !isSupabaseAuthConfigured()) return null;

  const user = await getAuthUser(accessToken);
  if (!user?.id || !user.email) return null;

  const memberships = await readUserMemberships(accessToken);
  const membershipRoles = memberships.map((membership) => membership.role);
  const roles = new Set([
    ...parseRoleClaims({
      sub: user.id,
      email: user.email,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
    }),
    ...membershipRoles,
  ]);

  return {
    user: {
      id: user.id,
      email: user.email,
      roles: [...roles].filter(isKnownRole),
    },
    memberships: memberships.map((membership) => ({
      organizationId: membership.organization_id,
      roles: [membership.role].filter(isKnownRole),
    })),
    accessToken,
  };
}

export async function readUserMemberships(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return [];

  const params = new URLSearchParams();
  params.set("select", "organization_id,role");

  const response = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/organization_memberships?${params}`,
    {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return [];

  return (await response.json()) as MembershipRow[];
}

async function authRequest<T>(
  path: string,
  init: RequestInit,
  accessToken?: string,
): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${accessToken ?? anonKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = response.status === 204 ? {} : await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorBody = body as SupabaseAuthResponse;
    return {
      error: errorBody.error ?? errorBody.msg ?? "auth_request_failed",
      error_description:
        errorBody.error_description ?? `Supabase Auth request failed: ${response.status}`,
    } as T;
  }

  return body as T;
}

function normalizeAuthResponse(
  response: SupabaseAuthResponse,
  successMessage: string,
): SupabaseAuthResult {
  if (response.error || response.error_description || response.msg) {
    return {
      ok: false,
      message: response.error_description ?? response.msg ?? response.error ?? "Auth failed.",
    };
  }

  return {
    ok: true,
    message: successMessage,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresIn: response.expires_in,
    user: response.user,
    needsEmailConfirmation: Boolean(response.user && !response.access_token),
  };
}

function isSupabaseAuthUser(value: unknown): value is SupabaseAuthUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id?: unknown }).id === "string"
  );
}

function isKnownRole(value: string): value is AuthSession["user"]["roles"][number] {
  return [
    "consumer",
    "ngo_owner",
    "ngo_member",
    "business_owner",
    "business_member",
    "auditor_field",
    "audit_reviewer",
    "mishava_admin",
    "methodology_owner",
    "support",
    "press_reviewer",
    "sponsor_manager",
  ].includes(value);
}
