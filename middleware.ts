import { NextResponse, type NextRequest } from "next/server";
import {
  currentOrganizationCookieName,
  hasOrganizationMembership,
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
    const organizationId =
      request.cookies.get(currentOrganizationCookieName)?.value ?? null;

    if (!hasOrganizationMembership(session, organizationId)) {
      return redirectWithReason(request, "organization_required");
    }
  }

  return NextResponse.next();
}

async function readMiddlewareSupabaseSession(accessToken: string) {
  const parsed = parseSupabaseAccessTokenValue(accessToken);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!parsed || !url || !anonKey) return null;

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

  if (!response.ok) return null;

  const memberships = (await response.json()) as Array<{
    organization_id: string;
    role: (typeof parsed.user.roles)[number];
  }>;

  return {
    user: {
      ...parsed.user,
      roles: [
        ...new Set([
          ...parsed.user.roles,
          ...memberships.map((membership) => membership.role),
        ]),
      ],
    },
    memberships: memberships.map((membership) => ({
      organizationId: membership.organization_id,
      roles: [membership.role],
    })),
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
