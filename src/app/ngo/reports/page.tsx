import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ngoReportTemplates } from "@/lib/ngo";

export default function NgoReportsPage() {
  return (
    <>
      <PageHeader eyebrow="NGO packets and reports" title="Build a packet when your NGO is ready.">
        Mishava helps organize proof into a clearer packet or report. A packet
        can stay private. You choose what is included and what is safe to share.
      </PageHeader>

      <div className="notice">
        Use a packet to review a case, prepare a complaint, show a pattern, or
        share a public report later. Early NGO partners can use this flow to
        review the structure and give feedback.
      </div>

      <section className="section">
        <h2>Packet and report types</h2>
        <div className="card-grid">
          {ngoReportTemplates.map((template) => (
            <div className="card" key={template}>
              <h3>{template}</h3>
              <p>
                Add reviewed proof, photos, source notes, and sharing choices.
                Keep it private until your organization is ready.
              </p>
            </div>
          ))}
        </div>
      </section>

      <EmptyState title="No packet data yet">
        Packets stay empty until your NGO adds real proof and chooses what is
        ready to review.
      </EmptyState>

      <section className="section">
        <Link className="button primary" href="/org/reports">
          Open report workspace
        </Link>
      </section>
    </>
  );
}
