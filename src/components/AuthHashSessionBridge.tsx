"use client";

import { useEffect, useState } from "react";

type BridgeStatus = "idle" | "saving" | "ready" | "error";

export function AuthHashSessionBridge({
  readyMessage = "Your email link was accepted. You can continue.",
}: {
  readyMessage?: string;
}) {
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresIn = Number(params.get("expires_in") ?? 3600);

    if (!accessToken) return;

    setStatus("saving");

    fetch("/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        expiresIn: Number.isFinite(expiresIn) ? expiresIn : 3600,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(body.message ?? "The email link could not be saved.");
        }

        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
        setStatus("ready");
        setMessage(readyMessage);
      })
      .catch((error: Error) => {
        setStatus("error");
        setMessage(
          error.message ||
            "The email link could not be saved. Please request a new link.",
        );
      });
  }, [readyMessage]);

  if (status === "idle") return null;

  return (
    <p className={`form-message ${status === "error" ? "error" : ""}`} role="status">
      {status === "saving" ? "Checking your email link..." : message}
    </p>
  );
}
