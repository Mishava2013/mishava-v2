import { NextResponse, type NextRequest } from "next/server";
import {
  currentOrganizationCookieName,
  hasOrganizationMembership,
  isAdminSession,
  parseSessionCookieValue,
  sessionCookieName,
} from "@/lib/auth";

const protectedPrefixes = ["/app", "/org", "/admin"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const session = parseSessionCookieValue(
    request.cookies.get(sessionCookieName)?.value,
  );

  if (!session) {
    return redirectWithReason(request, "required");
  }

  if (pathname.startsWith("/admin") && !isAdminSession(session)) {
    return redirectWithReason(request, "admin_required");
  }

  if (pathname.startsWith("/org")) {
    const organizationId =
      request.cookies.get(currentOrganizationCookieName)?.value ?? null;

    if (!hasOrganizationMembership(session, organizationId)) {
      return redirectWithReason(request, "organization_required");
    }
  }

  return NextResponse.next();
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
