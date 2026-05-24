import { PageHeader } from "@/components/PageHeader";

export default function AdminUsersPage() {
  return (
    <PageHeader eyebrow="Admin users" title="Tens of thousands of users, narrow permissions.">
      User administration will support memberships, roles, SSO-ready boundaries,
      reviewer separation, access reviews, and immutable audit trails.
    </PageHeader>
  );
}

