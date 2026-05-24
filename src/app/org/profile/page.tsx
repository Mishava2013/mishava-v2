import { PageHeader } from "@/components/PageHeader";
import { WorkflowList } from "@/components/WorkflowList";
import { ngoOnboardingSteps } from "@/lib/ngo";

export default function OrgProfilePage() {
  return (
    <>
      <PageHeader eyebrow="Organization profile" title="Claimed organization setup.">
        This workspace will hold NGO, business, supplier, seller, and local profile
        setup with role-based approvals and transparent update history.
      </PageHeader>
      <WorkflowList items={ngoOnboardingSteps} />
    </>
  );
}
