export type MishavaSubdomain =
  | "root"
  | "shopping"
  | "ngo"
  | "business"
  | "corporate"
  | "app"
  | "support"
  | "trust"
  | "admin"
  | "api"
  | "gov"
  | "research"
  | "media";

export type SubdomainRouteDecision = {
  subdomain: MishavaSubdomain | null;
  targetPath: string | null;
};

const rootDomains = ["mishava.org", "localhost"];

const subdomainRootTargets: Record<MishavaSubdomain, string> = {
  root: "/shopping",
  shopping: "/shopping",
  ngo: "/ngo",
  business: "/business",
  corporate: "/corporate",
  app: "/app",
  support: "/support",
  trust: "/methodology",
  admin: "/admin",
  api: "/api",
  gov: "/gov",
  research: "/research",
  media: "/research",
};

const subdomainPathPrefixes: Partial<Record<MishavaSubdomain, string>> = {
  shopping: "/shopping",
  ngo: "/ngo",
  business: "/business",
  corporate: "/corporate",
  app: "/app",
  admin: "/admin",
  api: "/api",
  gov: "/gov",
  research: "/research",
  media: "/research",
};

const globalPathPrefixes = [
  "/_next",
  "/admin",
  "/api",
  "/app",
  "/auth",
  "/business",
  "/legal",
  "/ngo",
  "/org",
  "/shared",
  "/shopping",
  "/support",
] as const;

export function resolveMishavaSubdomainRoute({
  host,
  pathname,
}: {
  host: string | null;
  pathname: string;
}): SubdomainRouteDecision {
  const subdomain = getMishavaSubdomain(host);
  if (!subdomain) return { subdomain: null, targetPath: null };

  if (subdomain === "root" || subdomain === "trust" || subdomain === "support") {
    if (pathname === "/") {
      return { subdomain, targetPath: subdomainRootTargets[subdomain] };
    }
    return { subdomain, targetPath: null };
  }

  const rootTarget = subdomainRootTargets[subdomain];
  if (pathname === "/" || pathname === "") {
    return { subdomain, targetPath: rootTarget };
  }

  if (startsWithAny(pathname, globalPathPrefixes)) {
    return { subdomain, targetPath: null };
  }

  const pathPrefix = subdomainPathPrefixes[subdomain];
  if (!pathPrefix) return { subdomain, targetPath: null };

  return {
    subdomain,
    targetPath: `${pathPrefix}${pathname}`,
  };
}

export function getMishavaSubdomain(host: string | null): MishavaSubdomain | null {
  if (!host) return null;

  const normalizedHost = host.split(":")[0]?.toLowerCase() ?? "";
  for (const rootDomain of rootDomains) {
    if (normalizedHost === rootDomain || normalizedHost === `www.${rootDomain}`) {
      return rootDomain === "mishava.org" ? "root" : null;
    }

    if (normalizedHost.endsWith(`.${rootDomain}`)) {
      const prefix = normalizedHost.slice(0, -1 * (`.${rootDomain}`.length));
      const firstLabel = prefix.split(".")[0];
      return isMishavaSubdomain(firstLabel) ? firstLabel : null;
    }
  }

  return null;
}

function startsWithAny(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isMishavaSubdomain(value: string): value is MishavaSubdomain {
  return [
    "shopping",
    "ngo",
    "business",
    "corporate",
    "app",
    "support",
    "trust",
    "admin",
    "api",
    "gov",
    "research",
    "media",
  ].includes(value);
}
