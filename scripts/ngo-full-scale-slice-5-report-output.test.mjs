import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("NGO report detail renders a polished private report preview with print readiness", () => {
  const page = read("src/app/org/reports/[reportId]/page.tsx");
  const printButton = read("src/components/PrintReportButton.tsx");
  const css = read("src/app/globals.css");

  assert.match(page, /report-preview/);
  assert.match(page, /Organization profile summary/);
  assert.match(page, /Draft\/provisional trust context/);
  assert.match(page, /Report limitations/);
  assert.match(page, /Private to your organization/);
  assert.match(page, /Not publicly scored/);
  assert.match(page, /Raw files are private by default/);
  assert.match(page, /generatedAt/);
  assert.match(printButton, /window\.print\(\)/);
  assert.match(printButton, /aria-label="Open the browser print dialog for this report"/);
  assert.match(css, /@media print/);
  assert.match(css, /\.site-header,/);
  assert.match(css, /\.report-actions,/);
});

test("report output does not expose raw private files by default and labels archived evidence", () => {
  const page = read("src/app/org/reports/[reportId]/page.tsx");
  const sharedPage = read("src/app/shared/ngo-reports/[grantId]/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /Raw files are private by default and are not included in print output/);
  assert.match(page, /Archived evidence remains traceable/);
  assert.match(sharedPage, /Raw files not included/);
  assert.match(sharedPage, /private file links/);
  assert.match(sharedPage, /archived and remains labeled for traceability/);
  assert.match(helper, /document_path,lifecycle_status,archived_at/);
  assert.doesNotMatch(sharedPage, /storage_path/);
  assert.doesNotMatch(sharedPage, /signedUrl|signed URL|createSignedUrl/i);
});

test("shared recipient report view is limited to the selected report and sender summary", () => {
  const page = read("src/app/shared/ngo-reports/[grantId]/page.tsx");
  const helper = read("src/lib/ngo-evidence-reports.ts");

  assert.match(page, /Sender profile summary/);
  assert.match(page, /Limited to this report/);
  assert.match(page, /does not provide\s+full workspace access/);
  assert.match(page, /No full workspace access/);
  assert.match(helper, /granted_to_email\.toLowerCase\(\) !== session\.user\.email\.toLowerCase\(\)/);
  assert.match(helper, /action: "ngo_report\.shared_viewed"/);
  assert.match(helper, /raw_evidence_exposed: false/);
  assert.doesNotMatch(page, /href="\/org\//);
  assert.doesNotMatch(page, /href=\{`\/org\//);
});

test("rejected and draft claims remain excluded from report trust summaries", () => {
  const helper = read("src/lib/ngo-evidence-reports.ts");
  const page = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(helper, /claim\.status === "accepted"/);
  assert.match(helper, /claim\.status !== "accepted"/);
  assert.match(page, /Draft and rejected claims cannot enter this report/);
  assert.match(page, /will not appear in the trust summary/);
});

test("Slice 5 result document records browser-print audit limitation and scope boundaries", () => {
  const result = read("docs/ngo-full-scale-slice-5-report-output-result.md");

  assert.match(result, /Browser print is client-side/);
  assert.match(result, /No migration was needed/);
  assert.match(result, /raw file sharing/);
  assert.match(result, /Shopping;/);
  assert.match(result, /Business;/);
  assert.match(result, /Corporate;/);
});
