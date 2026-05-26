import { NextResponse, type NextRequest } from "next/server";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  buildExportFilename,
  buildNgoReportEvidenceCsv,
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
    format: "csv",
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
    format: "csv",
    action: "ngo_report.export_csv_generated",
    reason:
      "NGO report CSV evidence summary generated. Raw files and private storage paths were excluded.",
  });

  const csv = buildNgoReportEvidenceCsv(exportPayload);

  return new NextResponse(csv, {
    headers: {
      "content-disposition": `attachment; filename="${buildExportFilename(
        exportPayload.detail.report.title,
        "csv",
      )}"`,
      "content-type": "text/csv; charset=utf-8",
    },
  });
}
