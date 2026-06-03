"use server";

import { redirect } from "next/navigation";
import {
  clearAuthCookies,
  getCurrentSession,
  setSupabaseAuthCookies,
} from "@/lib/auth-server";
import {
  requestPasswordReset,
  signInWithPassword,
  signOutAccessToken,
  signUpWithPassword,
  updatePasswordWithToken,
} from "@/lib/supabase/auth";

function appUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL?.replace(/^/, "https://") ??
    "http://localhost:3000";

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function safeAuthNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return null;
  }

  return next;
}

const authSurfaces = new Set([
  "shopping",
  "ngo",
  "business",
  "local",
  "corporate",
  "admin",
  "support",
  "trust",
  "gov",
  "app",
]);

function safeAuthSurface(value: FormDataEntryValue | null) {
  const surface = String(value ?? "");
  return authSurfaces.has(surface) ? surface : null;
}

function appendAuthNotice(path: string, notice: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}signIn=1&notice=${notice}`;
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeAuthNextPath(formData.get("next"));
  const surface = safeAuthSurface(formData.get("surface"));

  const result = await signUpWithPassword({
    email,
    password,
    redirectTo: appUrl("/auth/callback"),
  });

  if (!result.ok) {
    const nextQuery = nextPath ? `&next=${encodeURIComponent(nextPath)}` : "";
    const surfaceQuery = surface ? `&surface=${encodeURIComponent(surface)}` : "";
    redirect(
      `/auth/sign-up?error=${encodeURIComponent(result.message)}${nextQuery}${surfaceQuery}`,
    );
  }

  if (result.accessToken) {
    await setSupabaseAuthCookies({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    });
    redirect(nextPath ?? "/app");
  }

  redirect(appendAuthNotice(nextPath ?? "/", "check_email"));
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeAuthNextPath(formData.get("next"));

  const result = await signInWithPassword({ email, password });

  if (!result.ok || !result.accessToken) {
    const nextQuery = nextPath ? `&next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/?signIn=1&error=${encodeURIComponent(result.message)}${nextQuery}`);
  }

  await setSupabaseAuthCookies({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  });

  redirect(nextPath ?? "/app");
}

export async function signOutAction() {
  const session = await getCurrentSession();
  await signOutAccessToken(session?.accessToken);
  await clearAuthCookies();
  redirect("/?signIn=1&notice=signed_out");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const result = await requestPasswordReset({
    email,
    redirectTo: appUrl("/auth/update-password"),
  });

  if (!result.ok) {
    redirect(`/auth/reset-password?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/?signIn=1&notice=reset_requested");
}

export async function updatePasswordAction(formData: FormData) {
  const session = await getCurrentSession();
  const password = String(formData.get("password") ?? "");

  if (!session?.accessToken) {
    redirect("/?signIn=1&notice=session_required&next=/auth/update-password");
  }

  const result = await updatePasswordWithToken({
    accessToken: session.accessToken,
    password,
  });

  if (!result.ok) {
    redirect(`/auth/update-password?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/app?password=updated");
}
