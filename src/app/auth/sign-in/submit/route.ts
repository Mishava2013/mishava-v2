import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseAccessTokenCookieName,
  supabaseRefreshTokenCookieName,
} from "@/lib/auth";
import { signInWithPassword } from "@/lib/supabase/auth";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function safeNextPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "/app");

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/app";
  }

  if (path.startsWith("/auth/sign-in")) {
    return "/app";
  }

  return path;
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

function normalizeNextPathForSurface(nextPath: string, surface: string | null) {
  if (surface === "shopping") {
    return nextPath === "/" ||
      nextPath.startsWith("/shopping") ||
      nextPath.startsWith("/app/shopping-priorities")
      ? nextPath
      : "/shopping";
  }

  if (surface === "ngo") {
    return nextPath.startsWith("/ngo") || nextPath.startsWith("/org")
      ? nextPath
      : "/ngo";
  }

  return nextPath;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const surface = safeAuthSurface(formData.get("surface"));
  const nextPath = normalizeNextPathForSurface(
    safeNextPath(formData.get("next")),
    surface,
  );
  const result = await signInWithPassword({ email, password });

  if (!result.ok || !result.accessToken) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("signIn", "1");
    redirectUrl.searchParams.set("error", result.message);
    redirectUrl.searchParams.set("next", nextPath);
    if (surface) {
      redirectUrl.searchParams.set("surface", surface);
    }

    return NextResponse.redirect(
      redirectUrl,
      303,
    );
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), 303);

  response.cookies.set(supabaseAccessTokenCookieName, result.accessToken, {
    ...authCookieOptions,
    maxAge: result.expiresIn ?? 60 * 60,
  });

  if (result.refreshToken) {
    response.cookies.set(supabaseRefreshTokenCookieName, result.refreshToken, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
