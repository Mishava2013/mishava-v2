import type { ReactNode } from "react";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";

export default async function OrgLayout({ children }: { children: ReactNode }) {
  await requireCurrentOrganizationMembership();
  return children;
}

