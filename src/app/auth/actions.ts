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

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const result = await signUpWithPassword({
    email,
    password,
    redirectTo: appUrl("/auth/callback"),
  });

  if (!result.ok) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(result.message)}`);
  }

  if (result.accessToken) {
    await setSupabaseAuthCookies({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    });
    redirect("/ngo/onboarding?created=account");
  }

  redirect("/auth/sign-in?notice=check_email");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const result = await signInWithPassword({ email, password });

  if (!result.ok || !result.accessToken) {
    redirect(`/auth/sign-in?error=${encodeURIComponent(result.message)}`);
  }

  await setSupabaseAuthCookies({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  });

  redirect("/app");
}

export async function signOutAction() {
  const session = await getCurrentSession();
  await signOutAccessToken(session?.accessToken);
  await clearAuthCookies();
  redirect("/auth/sign-in?notice=signed_out");
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

  redirect("/auth/sign-in?notice=reset_requested");
}

export async function updatePasswordAction(formData: FormData) {
  const session = await getCurrentSession();
  const password = String(formData.get("password") ?? "");

  if (!session?.accessToken) {
    redirect("/auth/sign-in?error=session_required");
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
