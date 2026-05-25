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

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const result = await signInWithPassword({ email, password });

  if (!result.ok || !result.accessToken) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?error=${encodeURIComponent(result.message)}`, request.url),
      303,
    );
  }

  const response = NextResponse.redirect(new URL("/app", request.url), 303);

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
