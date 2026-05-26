import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("report exports use a central permission matrix and membership-scoped payload helper", () => {
  const permissions = read("src/lib/ngo-permissions.ts");
  const exportsHelper = read("src/lib/ngo-report-exports.ts");

  assert.match(permissions, /"export_reports"/);
  assert.match(permissions, /ngo_viewer: \[\s*"export_reports"/);
  assert.match(exportsHelper, /hasNgoPermission\(session, organizationId, "export_reports"\)/);
  assert.match(exportsHelper, /getNgoReportDetail\(\{ client, organizationId, reportId \}\)/);
  assert.match(exportsHelper, /action: "ngo_report\.export_blocked"/);
});

test("CSV evidence export is server-side, private, audit-logged, and excludes raw file details", () => {
  const route = read(
    "src/app/org/reports/[reportId]/exports/evidence.csv/route.ts",
  );
  const helper = read("src/lib/ngo-report-exports.ts");

  assert.match(route, /requireCurrentOrganizationMembership/);
  assert.match(route, /createSupabaseAuthenticatedServerClient\(session\.accessToken\)/);
  assert.match(route, /buildNgoReportEvidenceCsv/);
  assert.match(route, /action: "ngo_report\.export_csv_generated"/);
  assert.match(route, /text\/csv; charset=utf-8/);
  assert.match(route, /attachment; filename/);
  assert.match(helper, /Raw evidence files and private storage paths are excluded by default/);
  assert.match(helper, /Private file attached/);
  assert.match(helper, /Linked accepted claim count/);
  assert.match(helper, /Archived/);
  assert.doesNotMatch(helper, /item\.fileSummaries|storage_bucket|safe_filename|original_filename/);
});

test("print-to-PDF-ready report export is access-controlled and avoids raw evidence exposure", () => {
  const route = read("src/app/org/reports/[reportId]/exports/report/route.ts");
  const helper = read("src/lib/ngo-report-exports.ts");
  const page = read("src/app/org/reports/[reportId]/page.tsx");

  assert.match(route, /requireCurrentOrganizationMembership/);
  assert.match(route, /buildNgoReportPrintHtml/);
  assert.match(route, /action: "ngo_report\.export_print_html_generated"/);
  assert.match(route, /text\/html; charset=utf-8/);
  assert.match(helper, /Draft and rejected claims are excluded/);
  assert.match(helper, /Raw evidence files, private storage paths/);
  assert.match(page, /Open PDF-ready report view/);
  assert.match(page, /DOCX coming later/);
  assert.match(page, /Shared recipients cannot export reports/);
});

test("Slice 13 result documents deferred formats, scope boundaries, and old-project safety", () => {
  const result = read("docs/ngo-full-scale-slice-13-report-exports-result.md");

  assert.match(result, /CSV evidence summary export/);
  assert.match(result, /print-to-PDF-ready HTML/);
  assert.match(result, /PDF file generation is deferred/);
  assert.match(result, /DOCX export is deferred/);
  assert.match(result, /raw evidence files and private storage paths are excluded/i);
  assert.match(result, /old Supabase project was not touched/);
  assert.doesNotMatch(result, /public report library was added|raw file sharing was added/i);
});
