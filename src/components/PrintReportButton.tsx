"use client";

export function PrintReportButton() {
  return (
    <button
      aria-label="Open the browser print dialog for this report"
      className="button primary"
      onClick={() => window.print()}
      type="button"
    >
      Print report
    </button>
  );
}
