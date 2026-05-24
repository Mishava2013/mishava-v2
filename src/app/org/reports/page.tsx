import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ngoReportTemplates } from "@/lib/ngo";

export default function OrgReportsPage() {
  return (
    <>
      <PageHeader eyebrow="Reports" title="Report builder and scoped sharing.">
        Reports can be template-based or custom, AI-assisted when covered by plan
        economics, approved by managers, exported, and shared with limited viewers.
      </PageHeader>
      <div className="card-grid">
        {ngoReportTemplates.map((template) => (
          <div className="card" key={template}>
            <h3>{template}</h3>
            <p>
              Draft, approve, export, and share this report type with scoped
              viewer permissions and a visible audit trail.
            </p>
          </div>
        ))}
      </div>
      <EmptyState title="No report drafts yet">
        Report drafts will be created from approved evidence or user-authored
        content. AI-generated text always requires review before approval.
      </EmptyState>
    </>
  );
}
