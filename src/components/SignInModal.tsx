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
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

type OpenDetail = {
  nextPath?: string;
};

const signInEventName = "mishava:open-sign-in";

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

export function SignInModalButton({
  children = "Sign in",
  className = "button",
  nextPath,
  ...buttonProps
}: SignInModalButtonProps) {
  return (
    <button
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<OpenDetail>(signInEventName, {
            detail: { nextPath },
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

  const queryWantsSignIn =
    pathname === "/auth/sign-in" ||
    searchParams.has("signIn") ||
    searchParams.has("auth");
  const currentQuery = searchParams.toString();
  const currentPathWithQuery = currentQuery ? `${pathname}?${currentQuery}` : pathname;
  const open = manualOpen || queryWantsSignIn;
  const nextPath = safeNextPath(
    manualNextPath ?? searchParams.get("next"),
    queryWantsSignIn ? "/app" : currentPathWithQuery,
  );
  const message = statusMessage(searchParams.get("error"), searchParams.get("notice"));

  const cleanedUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["signIn", "auth", "error", "notice", "next"]) {
      params.delete(key);
    }
    const query = params.toString();
    const targetPath = pathname === "/auth/sign-in" ? fallbackPath : pathname;
    return query ? `${targetPath}?${query}` : targetPath;
  }, [fallbackPath, pathname, searchParams]);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenDetail>).detail;
      setManualNextPath(detail?.nextPath ?? null);
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
    if (queryWantsSignIn) {
      router.replace(cleanedUrl, { scroll: false });
    }
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
          <Link href="/auth/reset-password">Reset password</Link>
          <Link href="/auth/sign-up">Create account</Link>
        </div>
      </form>
    </div>
  );
}
