"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ButtonHTMLAttributes,
  type FormEvent,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

type SignInModalButtonProps = {
  children?: string;
  className?: string;
  nextPath?: string;
  surface?: AuthSurface;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

type OpenDetail = {
  nextPath?: string;
  surface?: AuthSurface;
};

const signInEventName = "mishava:open-sign-in";
const authQueryKeys = ["signIn", "auth", "error", "notice", "next", "surface"];
const hostRootSurfacePaths: Record<string, string> = {
  shopping: "/shopping",
  ngo: "/ngo",
  business: "/business",
  local: "/local",
  corporate: "/corporate",
  app: "/app",
  support: "/support",
  trust: "/methodology",
  admin: "/admin",
  api: "/api",
  gov: "/gov",
  research: "/research",
  media: "/media",
};
type AuthSurface = keyof typeof hostRootSurfacePaths;
const authSurfaces = new Set<string>(Object.keys(hostRootSurfacePaths));

function safeAuthSurface(value: string | null | undefined): AuthSurface | null {
  return value && authSurfaces.has(value) ? (value as AuthSurface) : null;
}

function safeNextPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function statusMessage(error?: string | null, notice?: string | null) {
  if (error) {
    return { tone: "error", text: decodeURIComponent(error) };
  }

  if (notice === "check_email") {
    return {
      tone: "default",
      text: "Check your email to confirm the account if confirmation is enabled.",
    };
  }

  if (notice === "reset_requested") {
    return { tone: "default", text: "Password reset instructions were sent." };
  }

  if (notice === "signed_out") {
    return { tone: "default", text: "You have been signed out." };
  }

  if (notice === "session_required") {
    return { tone: "default", text: "Sign in before continuing." };
  }

  return null;
}

function getCurrentSurfaceRoot(pathname: string) {
  if (pathname !== "/" || typeof window === "undefined") {
    return pathname;
  }

  const hostname = window.location.hostname.toLowerCase();
  if (hostname === "mishava.org" || hostname === "www.mishava.org") {
    return "/shopping";
  }

  const subdomain = hostname.endsWith(".mishava.org")
    ? hostname.slice(0, -1 * ".mishava.org".length).split(".")[0]
    : null;

  return (subdomain ? hostRootSurfacePaths[subdomain] : null) ?? pathname;
}

function inferAuthSurface(pathname: string): AuthSurface | null {
  if (
    pathname === "/" ||
    pathname.startsWith("/shopping") ||
    pathname.startsWith("/app/shopping-priorities")
  ) {
    return "shopping";
  }

  if (pathname.startsWith("/ngo") || pathname.startsWith("/org")) {
    return "ngo";
  }

  if (pathname.startsWith("/business")) return "business";
  if (pathname.startsWith("/local")) return "local";
  if (pathname.startsWith("/corporate")) return "corporate";
  if (pathname.startsWith("/app")) return "app";
  if (pathname.startsWith("/support")) return "support";
  if (pathname.startsWith("/methodology") || pathname.startsWith("/legal")) {
    return "trust";
  }
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/api")) return "api";
  if (pathname.startsWith("/gov")) return "gov";
  if (pathname.startsWith("/research")) return "research";
  if (pathname.startsWith("/media")) return "media";

  return null;
}

function stripAuthParams(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());
  for (const key of authQueryKeys) {
    params.delete(key);
  }
  return params;
}

export function SignInModalButton({
  children = "Sign in",
  className = "button",
  nextPath,
  surface,
  ...buttonProps
}: SignInModalButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      className={className}
      onClick={() => {
        if (pathname === "/auth/sign-up") {
          const target = new URLSearchParams({ signIn: "1" });
          const currentParams = new URLSearchParams(window.location.search);
          const safeNext = safeNextPath(nextPath ?? currentParams.get("next"), "/app");
          const safeSurface =
            surface ?? safeAuthSurface(currentParams.get("surface")) ?? inferAuthSurface(safeNext);
          target.set("next", safeNext);
          if (safeSurface) {
            target.set("surface", safeSurface);
          }
          router.push(`/?${target.toString()}`);
          return;
        }

        window.dispatchEvent(
          new CustomEvent<OpenDetail>(signInEventName, {
            detail: { nextPath, surface },
          }),
        );
      }}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export function SignInModalController({
  fallbackPath = "/",
}: {
  fallbackPath?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const titleId = useId();
  const descriptionId = useId();
  const [manualOpen, setManualOpen] = useState(false);
  const [manualNextPath, setManualNextPath] = useState<string | null>(null);
  const [manualSurface, setManualSurface] = useState<AuthSurface | null>(null);

  const queryWantsSignIn =
    pathname === "/auth/sign-in" ||
    searchParams.has("signIn") ||
    searchParams.has("auth");
  const pageParams = stripAuthParams(searchParams);
  const pageQuery = pageParams.toString();
  const currentSurfacePath =
    pathname === "/auth/sign-in" ? fallbackPath : getCurrentSurfaceRoot(pathname);
  const currentPathWithQuery = pageQuery
    ? `${currentSurfacePath}?${pageQuery}`
    : currentSurfacePath;
  const open = manualOpen || queryWantsSignIn;
  const requestedNextPath = safeNextPath(
    manualNextPath ?? searchParams.get("next"),
    currentPathWithQuery,
  );
  const currentSurface = inferAuthSurface(currentSurfacePath);
  const requestedNextSurface = inferAuthSurface(requestedNextPath);
  const authSurface =
    manualSurface ??
    safeAuthSurface(searchParams.get("surface")) ??
    currentSurface ??
    requestedNextSurface;
  const nextPath =
    authSurface &&
    currentSurface === authSurface &&
    requestedNextSurface &&
    requestedNextSurface !== authSurface
      ? currentPathWithQuery
      : requestedNextPath;
  const message = statusMessage(searchParams.get("error"), searchParams.get("notice"));

  const cleanedUrl = useMemo(() => {
    const params = stripAuthParams(searchParams);
    const query = params.toString();
    const targetPath =
      pathname === "/auth/sign-in" ? fallbackPath : getCurrentSurfaceRoot(pathname);
    return query ? `${targetPath}?${query}` : targetPath;
  }, [fallbackPath, pathname, searchParams]);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenDetail>).detail;
      setManualNextPath(detail?.nextPath ?? null);
      setManualSurface(detail?.surface ?? null);
      setManualOpen(true);
    };

    window.addEventListener(signInEventName, handleOpen);
    return () => window.removeEventListener(signInEventName, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function closeModal() {
    setManualOpen(false);
    setManualNextPath(null);
    setManualSurface(null);
    if (queryWantsSignIn) {
      router.replace(cleanedUrl, { scroll: false });
    }
  }

  function goToCreateAccount() {
    setManualOpen(false);
    setManualNextPath(null);
    setManualSurface(null);
    const target = new URLSearchParams({ next: nextPath });
    if (authSurface) {
      target.set("surface", authSurface);
    }
    router.push(`/auth/sign-up?${target.toString()}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const nextInput = form.elements.namedItem("next");
    if (nextInput instanceof HTMLInputElement) {
      nextInput.value = safeNextPath(nextInput.value, "/app");
    }
  }

  if (!open) return null;

  return (
    <div
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="modal-backdrop"
      role="dialog"
    >
      <button
        aria-label="Close sign in popup"
        className="modal-scrim"
        onClick={closeModal}
        type="button"
      />
      <form
        action="/auth/sign-in/submit"
        className="auth-card sign-in-modal"
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Account access</p>
            <h2 id={titleId}>Sign in to Mishava</h2>
          </div>
          <button
            aria-label="Close sign in popup"
            className="modal-close"
            onClick={closeModal}
            type="button"
          >
            x
          </button>
        </div>
        <p className="modal-copy" id={descriptionId}>
          Sign in here and keep your place. Payment never changes Mishava trust
          outcomes.
        </p>
        {message ? (
          <p
            className={
              message.tone === "error" ? "form-message error" : "form-message"
            }
          >
            {message.text}
          </p>
        ) : null}
        <input name="next" type="hidden" value={nextPath} />
        {authSurface ? <input name="surface" type="hidden" value={authSurface} /> : null}
        <label>
          Email
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>
        <button className="button primary" type="submit">
          Sign in
        </button>
        <div className="auth-links">
          <Link
            href={`/auth/reset-password?${new URLSearchParams({
              next: nextPath,
              ...(authSurface ? { surface: authSurface } : {}),
            }).toString()}`}
          >
            Reset password
          </Link>
          <button className="link-button" onClick={goToCreateAccount} type="button">
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
