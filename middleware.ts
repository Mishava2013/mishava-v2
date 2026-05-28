import { NextResponse, type NextRequest } from "next/server";
import {
  isAdminSession,
  parseSupabaseAccessTokenValue,
  parseSessionCookieValue,
  sessionCookieName,
  supabaseAccessTokenCookieName,
} from "@/lib/auth";
import { resolveMishavaSubdomainRoute } from "@/lib/subdomain-routing";

const protectedPrefixes = ["/app", "/org", "/admin"];

export async function middleware(request: NextRequest) {
  const routeDecision = resolveMishavaSubdomainRoute({
    host: request.headers.get("host"),
    pathname: request.nextUrl.pathname,
  });
  const pathname = routeDecision.targetPath ?? request.nextUrl.pathname;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return rewriteIfNeeded(request, routeDecision.targetPath);
  }

  const accessToken = request.cookies.get(supabaseAccessTokenCookieName)?.value;
  const session =
    (accessToken ? await readMiddlewareSupabaseSession(accessToken) : null) ??
    parseSessionCookieValue(request.cookies.get(sessionCookieName)?.value);

  if (!session) {
    return redirectWithReason(request, "required", pathname);
  }

  if (pathname.startsWith("/admin") && !isAdminSession(session)) {
    return redirectWithReason(request, "admin_required", pathname);
  }

  return rewriteIfNeeded(request, routeDecision.targetPath);
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

function redirectWithReason(request: NextRequest, reason: string, nextPath: string) {
  const url = request.nextUrl.clone();

  url.pathname = "/auth/sign-in";
  url.searchParams.set("auth", reason);
  url.searchParams.set("signIn", "1");
  url.searchParams.set("next", `${nextPath}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

function rewriteIfNeeded(request: NextRequest, targetPath: string | null) {
  if (!targetPath) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = targetPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
