import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ngoReportTemplates } from "@/lib/ngo";

export default function NgoReportsPage() {
  return (
    <>
      <PageHeader eyebrow="NGO reports" title="Reports that NGOs can control and share.">
        Mishava helps organize evidence into clearer reports. You stay in
        control of what is included, what is still missing, and when a report is
        ready to share.
      </PageHeader>

      <div className="notice">
        Early NGO partners can use this flow to review report structure and give
        feedback. Reports can be built when your information is ready.
      </div>

      <section className="section">
        <h2>Report templates</h2>
        <div className="card-grid">
          {ngoReportTemplates.map((template) => (
            <div className="card" key={template}>
              <h3>{template}</h3>
              <p>
                Reports can include approved evidence, photos, source notes,
                manager approvals, export format, and viewer permissions.
              </p>
            </div>
          ))}
        </div>
      </section>

      <EmptyState title="No approved report data yet">
        Report output will remain empty until an NGO adds real evidence and a
        manager approves the report contents.
      </EmptyState>

      <section className="section">
        <Link className="button primary" href="/org/reports">
          Open report workspace
        </Link>
      </section>
    </>
  );
}
