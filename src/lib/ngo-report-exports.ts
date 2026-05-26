import { hasNgoPermission, type AuthSession } from "./auth";
import { buildAuditEvent } from "./audit-log";
import { getNgoReportDetail } from "./ngo-evidence-reports";
import type { SupabaseServerClient } from "./supabase/server";

export type NgoReportExportFormat = "csv" | "print_html";

export type NgoReportExportPayload = NonNullable<
  Awaited<ReturnType<typeof getNgoReportDetail>>
>;

export async function getNgoReportExportPayload({
  client,
  session,
  organizationId,
  reportId,
  format,
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  organizationId: string;
  reportId: string;
  format: NgoReportExportFormat;
}): Promise<
  | { ok: true; detail: NgoReportExportPayload; exportedAt: string }
  | { ok: false; status: number; message: string }
> {
  if (!hasNgoPermission(session, organizationId, "export_reports")) {
    await recordNgoReportExportAudit({
      client,
      session,
      organizationId,
      reportId,
      format,
      action: "ngo_report.export_blocked",
      reason: "NGO report export blocked because the user lacks export permission.",
      status: "blocked_permission",
    });

    return {
      ok: false,
      status: 403,
      message: "You do not have permission to export reports for this organization.",
    };
  }

  const detail = await getNgoReportDetail({ client, organizationId, reportId });

  if (!detail) {
    return {
      ok: false,
      status: 404,
      message: "Report was not found for this organization.",
    };
  }

  return { ok: true, detail, exportedAt: new Date().toISOString() };
}

export async function recordNgoReportExportAudit({
  client,
  session,
  organizationId,
  reportId,
  format,
  action,
  reason,
  status = "generated",
}: {
  client: SupabaseServerClient;
  session: AuthSession;
  organizationId: string;
  reportId: string;
  format: NgoReportExportFormat;
  action: string;
  reason: string;
  status?: "generated" | "blocked_permission" | "failed";
}) {
  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action,
      subjectTable: "ngo_reports",
      subjectId: reportId,
      reason,
      afterData: {
        export_format: format,
        export_status: status,
        raw_evidence_files_included: false,
        private_storage_paths_included: false,
        public_report_library_created: false,
      },
    }),
  );
}

export function buildNgoReportEvidenceCsv({
  detail,
  exportedAt,
}: {
  detail: NgoReportExportPayload;
  exportedAt: string;
}) {
  const organizationName =
    detail.ngoProfile?.public_name ??
    detail.organization?.name ??
    "NGO organization";
  const rows = detail.selectedEvidence.map((item) => {
    const linkedAcceptedClaimCount = detail.selectedAcceptedClaims.filter((claim) =>
      claim.evidence_item_ids.includes(item.id),
    ).length;

    return [
      detail.report.title,
      organizationName,
      exportedAt,
      item.title,
      item.source_type,
      item.lifecycle_status,
      item.verification_status,
      item.visibility,
      item.url ?? "",
      item.activeFileCount > 0 ? "Private file attached" : "No private file attached",
      String(linkedAcceptedClaimCount),
      item.lifecycle_status === "archived" ? "Yes" : "No",
      item.archived_at ?? "",
      "Raw evidence files and private storage paths are excluded by default.",
    ];
  });

  return [
    [
      "Report title",
      "Organization name",
      "Exported at",
      "Evidence title",
      "Evidence type",
      "Evidence lifecycle status",
      "Evidence verification status",
      "Visibility",
      "Source URL",
      "Attached file indicator",
      "Linked accepted claim count",
      "Archived",
      "Archived at",
      "Export limitation",
    ],
    ...rows,
  ]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");
}

export function buildNgoReportPrintHtml({
  detail,
  exportedAt,
}: {
  detail: NgoReportExportPayload;
  exportedAt: string;
}) {
  const organizationName =
    detail.ngoProfile?.public_name ??
    detail.organization?.name ??
    "NGO organization";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(detail.report.title)} - Mishava report export</title>
  <style>
    body { color: #15213a; font-family: Arial, sans-serif; line-height: 1.5; margin: 40px; }
    h1, h2 { color: #142b55; }
    .meta, .tag { color: #526173; }
    .section { border-top: 1px solid #d8e0ec; margin-top: 24px; padding-top: 16px; }
    .item { margin: 0 0 16px; }
    .disclaimer { background: #f4f7fb; border: 1px solid #d8e0ec; padding: 16px; }
    @media print { body { margin: 24px; } }
  </style>
</head>
<body>
  <main>
    <p class="tag">Mishava NGO report export</p>
    <h1>${escapeHtml(detail.report.title)}</h1>
    <p class="meta">
      ${escapeHtml(detail.template?.name ?? "Template not listed")} ·
      ${escapeHtml(detail.report.approval_status)} ·
      ${escapeHtml(detail.report.visibility)}
    </p>
    <p><strong>Organization:</strong> ${escapeHtml(organizationName)}</p>
    <p><strong>Generated/exported:</strong> ${escapeHtml(exportedAt)}</p>
    <p><strong>Status:</strong> Draft/provisional. Not publicly scored.</p>

    <section class="section">
      <h2>Organization Profile Summary</h2>
      <p>${escapeHtml(
        detail.organization?.public_summary ??
          detail.ngoProfile?.mission_area ??
          "This NGO has not added a public summary yet.",
      )}</p>
    </section>

    <section class="section">
      <h2>Evidence Summaries</h2>
      ${
        detail.selectedEvidence.length === 0
          ? "<p>No evidence has been selected for this report.</p>"
          : detail.selectedEvidence
              .map(
                (item) => `<article class="item">
        <h3>${escapeHtml(item.title)}</h3>
        <p>
          ${escapeHtml(item.source_type)} from ${escapeHtml(item.source_name)} ·
          ${escapeHtml(item.lifecycle_status)} ·
          ${escapeHtml(item.visibility)}
          ${item.lifecycle_status === "archived" ? " · Archived" : ""}
        </p>
        <p>${escapeHtml(item.fileAttachmentLabel)}. Raw evidence files are not included by default.</p>
      </article>`,
              )
              .join("\n")
      }
    </section>

    <section class="section">
      <h2>Accepted Claims / Trust Facts</h2>
      ${
        detail.selectedAcceptedClaims.length === 0
          ? "<p>No accepted claims are attached. Draft and rejected claims are excluded from this trust summary.</p>"
          : detail.selectedAcceptedClaims
              .map(
                (claim) => `<article class="item">
        <h3>${escapeHtml(claim.statement)}</h3>
        <p>${escapeHtml(claim.pillar_id)} · ${escapeHtml(claim.fact_type)} · ${escapeHtml(claim.confidence)}</p>
      </article>`,
              )
              .join("\n")
      }
    </section>

    <section class="section disclaimer">
      <h2>Limitations</h2>
      <p>
        This report is evidence-based but may be incomplete. Trust context may be provisional.
        No public score has been created unless a published Mishava score snapshot is explicitly referenced.
        Raw evidence files, private storage paths, rejected claims, draft claims, unrelated organization data,
        secrets, audit internals, and billing identifiers are excluded by default.
        Mishava does not guarantee funding, donations, ratings, certifications, procurement decisions, or other outcomes.
      </p>
    </section>
  </main>
</body>
</html>`;
}

export function buildExportFilename(reportTitle: string, extension: "csv" | "html") {
  const safeTitle = reportTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

  return `${safeTitle || "ngo-report"}-${new Date().toISOString().slice(0, 10)}.${extension}`;
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
