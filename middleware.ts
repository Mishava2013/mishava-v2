import { NextResponse, type NextRequest } from "next/server";
import {
  currentOrganizationCookieName,
  isAdminSession,
  parseSupabaseAccessTokenValue,
  parseSessionCookieValue,
  sessionCookieName,
  supabaseAccessTokenCookieName,
} from "@/lib/auth";

const protectedPrefixes = ["/app", "/org", "/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(supabaseAccessTokenCookieName)?.value;
  const session =
    (accessToken ? await readMiddlewareSupabaseSession(accessToken) : null) ??
    parseSessionCookieValue(request.cookies.get(sessionCookieName)?.value);

  if (!session) {
    return redirectWithReason(request, "required");
  }

  if (pathname.startsWith("/admin") && !isAdminSession(session)) {
    return redirectWithReason(request, "admin_required");
  }

  if (pathname.startsWith("/org")) {
    if (!request.cookies.get(currentOrganizationCookieName)?.value) {
      return redirectWithReason(request, "organization_required");
    }
  }

  return NextResponse.next();
}

async function readMiddlewareSupabaseSession(accessToken: string) {
  const parsed = parseSupabaseAccessTokenValue(accessToken);

  if (!parsed) return null;

  return {
    user: parsed.user,
    memberships: [],
    accessToken,
  };
}

function redirectWithReason(request: NextRequest, reason: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("auth", reason);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*", "/org/:path*", "/admin/:path*"],
};
