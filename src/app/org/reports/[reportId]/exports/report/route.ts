import { NextResponse, type NextRequest } from "next/server";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  buildExportFilename,
  buildNgoReportPrintHtml,
  getNgoReportExportPayload,
  recordNgoReportExportAudit,
} from "@/lib/ngo-report-exports";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;
  const { session, organizationId } = await requireCurrentOrganizationMembership();

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Report exports require the live database connection." },
      { status: 503 },
    );
  }

  const client = createSupabaseAuthenticatedServerClient(session.accessToken);
  const exportPayload = await getNgoReportExportPayload({
    client,
    session,
    organizationId,
    reportId,
    format: "print_html",
  });

  if (!exportPayload.ok) {
    return NextResponse.json(
      { error: exportPayload.message },
      { status: exportPayload.status },
    );
  }

  await recordNgoReportExportAudit({
    client,
    session,
    organizationId,
    reportId,
    format: "print_html",
    action: "ngo_report.export_print_html_generated",
    reason:
      "NGO report print-to-PDF-ready HTML export generated. Raw files and private storage paths were excluded.",
  });

  const html = buildNgoReportPrintHtml(exportPayload);

  return new NextResponse(html, {
    headers: {
      "content-disposition": `inline; filename="${buildExportFilename(
        exportPayload.detail.report.title,
        "html",
      )}"`,
      "content-type": "text/html; charset=utf-8",
    },
  });
}
