"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-server";
import { createNgoOnboardingRecord } from "@/lib/release-2-5-workflows";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createNgoOnboardingAction(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/ngo/onboarding?error=auth_required");
  }

  const result = await createNgoOnboardingRecord({
    client: createSupabaseServerClient(),
    session,
    input: {
      publicName: String(formData.get("publicName") ?? ""),
      legalName: String(formData.get("legalName") ?? ""),
      country: String(formData.get("country") ?? ""),
      missionArea: String(formData.get("missionArea") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      registrationIdentifier: String(formData.get("registrationIdentifier") ?? ""),
      defaultVisibility:
        formData.get("defaultVisibility") === "public_summary"
          ? "public_summary"
          : formData.get("defaultVisibility") === "approved_viewer"
            ? "approved_viewer"
            : "private",
      summary: String(formData.get("summary") ?? ""),
    },
  });

  if (!result.ok) {
    redirect(`/ngo/onboarding?error=${encodeURIComponent(result.message)}`);
  }

  redirect(`/org/profile?created=ngo&organization=${result.organizationId}`);
}

