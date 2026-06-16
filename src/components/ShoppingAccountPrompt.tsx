"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

type ShoppingAccountPromptProps = {
  nextPath?: string;
};

function safeShoppingNextPath(value: string | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/auth")
  ) {
    return "/shopping";
  }

  if (
    value === "/" ||
    value.startsWith("/shopping") ||
    value.startsWith("/app/shopping-priorities")
  ) {
    return value;
  }

  return "/shopping";
}

export function ShoppingAccountPrompt({
  nextPath = "/shopping",
}: ShoppingAccountPromptProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(true);
  const safeNextPath = safeShoppingNextPath(nextPath);
  const signUpHref = `/auth/sign-up?${new URLSearchParams({
    next: safeNextPath,
    surface: "shopping",
  }).toString()}`;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function openShoppingSignIn() {
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("mishava:open-sign-in", {
        detail: { nextPath: safeNextPath, surface: "shopping" },
      }),
    );
  }

  if (!open) return null;

  return (
    <div
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="modal-backdrop shopping-account-backdrop"
      role="dialog"
    >
      <button
        aria-label="Close Shopping account prompt"
        className="modal-scrim"
        onClick={() => setOpen(false)}
        type="button"
      />
      <section className="auth-card shopping-account-modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Free Shopping account</p>
            <h2 id={titleId}>Save your Shopping priorities.</h2>
          </div>
          <button
            aria-label="Close Shopping account prompt"
            className="modal-close"
            onClick={() => setOpen(false)}
            type="button"
          >
            x
          </button>
        </div>
        <p className="modal-copy" id={descriptionId}>
          Sign in if you already have a Mishava account, or create a free
          Mishava Shopping account so Mishava can remember what matters to you.
          You can keep browsing products without an account.
        </p>
        <div className="shopping-account-actions">
          <button className="button primary" onClick={openShoppingSignIn} type="button">
            Sign in
          </button>
          <Link className="button" href={signUpHref}>
            Create free Shopping account
          </Link>
        </div>
        <p className="shopping-account-note">
          Shopping accounts are for personal priorities and match previews.
          They do not create final scores, medical claims, paid ranking, or
          commission sorting.
        </p>
      </section>
    </div>
  );
}
