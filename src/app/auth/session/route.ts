import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseAccessTokenCookieName,
  supabaseRefreshTokenCookieName,
} from "@/lib/auth";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    accessToken?: unknown;
    expiresIn?: unknown;
    refreshToken?: unknown;
  };
  const accessToken = typeof body.accessToken === "string" ? body.accessToken : "";
  const refreshToken =
    typeof body.refreshToken === "string" ? body.refreshToken : "";
  const expiresIn =
    typeof body.expiresIn === "number" && Number.isFinite(body.expiresIn)
      ? body.expiresIn
      : 60 * 60;

  if (!accessToken || accessToken.length < 20) {
    return NextResponse.json(
      { ok: false, message: "The email link was missing account access details." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(supabaseAccessTokenCookieName, accessToken, {
    ...authCookieOptions,
    maxAge: expiresIn,
  });

  if (refreshToken) {
    response.cookies.set(supabaseRefreshTokenCookieName, refreshToken, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
