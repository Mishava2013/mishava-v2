"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ShoppingScoreExplanation } from "@/lib/shopping";

export function ShoppingScoreExplainer({
  explanation,
  triggerLabel = "Why this score?",
  mode = "popup",
}: {
  explanation: ShoppingScoreExplanation;
  triggerLabel?: string;
  mode?: "popup" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (mode === "inline") {
    return <ScoreExplanationBody explanation={explanation} />;
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        className="score-chip score-chip-button"
        onClick={() => setOpen(true)}
        ref={triggerButtonRef}
        type="button"
      >
        {triggerLabel}
      </button>
      {open ? (
        <div className="score-dialog-backdrop" role="presentation">
          <section
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="score-dialog"
            role="dialog"
          >
            <div className="score-dialog-header">
              <div>
                <p className="storefront-kicker">Trust explanation</p>
                <h2 id={titleId}>{explanation.label}</h2>
              </div>
              <button
                aria-label="Close score explanation"
                className="button"
                onClick={() => {
                  setOpen(false);
                  triggerButtonRef.current?.focus();
                }}
                ref={closeButtonRef}
                type="button"
              >
                Close
              </button>
            </div>
            <p className="score-caption" id={descriptionId}>
              {explanation.why}
            </p>
            <ScoreExplanationBody explanation={explanation} />
          </section>
        </div>
      ) : null}
    </>
  );
}

function ScoreExplanationBody({
  explanation,
}: {
  explanation: ShoppingScoreExplanation;
}) {
  return (
    <div className="score-explanation-body">
      <div className="score-row">
        <div className="score-badge">{explanation.score ?? "--"}</div>
        <p className="score-caption">
          {explanation.score === null
            ? "No public score value is shown until real reviewed evidence and a published snapshot support it."
            : "This value is the base Evidence Score. It is not a personal values score."}
        </p>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <span>Evidence coverage</span>
          <strong>{explanation.coverage}</strong>
        </div>
        <div className="metric">
          <span>Evidence recency</span>
          <strong>{explanation.recency}</strong>
        </div>
        <div className="metric">
          <span>Verification status</span>
          <strong>{explanation.verification}</strong>
        </div>
        <div className="metric">
          <span>Confidence</span>
          <strong>{explanation.confidence}</strong>
        </div>
      </div>

      <div className="score-explanation-grid">
        <section>
          <h3>What has been checked</h3>
          {explanation.checked.length > 0 ? (
            <ul>
              {explanation.checked.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No reviewed source checks are listed yet.</p>
          )}
        </section>
        <section>
          <h3>What is missing</h3>
          {explanation.missing.length > 0 ? (
            <ul>
              {explanation.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No missing score prerequisites are listed.</p>
          )}
        </section>
      </div>

      <div className="status-row">
        <span className="tag">{explanation.snapshotStatus}</span>
        <span className="tag">{explanation.sourceStatus}</span>
        <span className="tag">Source: {explanation.sourceName}</span>
      </div>

      {explanation.sourceUrl ? (
        <a href={explanation.sourceUrl}>Open recorded source</a>
      ) : null}

      <div className="score-policy-note">
        <strong>Payment firewall</strong>
        <p>
          Payment does not affect this score, ranking, or verification. Mishava
          does not earn shopping commissions from outbound links.
        </p>
      </div>
      <div className="score-policy-note">
        <strong>Shopping Priorities</strong>
        <p>
          Shopping Priorities personalize your view but do not change the base
          Evidence Score. {explanation.valuesMessage}
        </p>
      </div>
      <div className="score-policy-note">
        <strong>Red-line settings</strong>
        <p>
          Off means no red-line filtering. Warn means show a warning when
          evidence conflicts with priorities. Hide means matching results will be
          hidden by default only when a visible hidden count and view-hidden
          control are implemented.
        </p>
      </div>
    </div>
  );
}
