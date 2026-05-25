"use server";

import { redirect } from "next/navigation";
import {
  clearCurrentOrganizationId,
  requireAuthenticatedSession,
  setCurrentOrganizationId,
} from "@/lib/auth-server";
import { canSelectOrganization } from "@/lib/organization-context";

function safeReturnTo(value: FormDataEntryValue | null) {
  const path = String(value ?? "/app");

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/app";
  }

  return path;
}

export async function switchCurrentOrganizationAction(formData: FormData) {
  const organizationId = String(formData.get("organizationId") ?? "");
  const returnTo = safeReturnTo(formData.get("returnTo"));
  const session = await requireAuthenticatedSession();

  if (!canSelectOrganization(session, organizationId)) {
    await clearCurrentOrganizationId();
    redirect("/app?org=invalid");
  }

  await setCurrentOrganizationId(organizationId);
  redirect(returnTo);
}
