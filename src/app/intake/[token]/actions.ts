"use server";

import { redirect } from "next/navigation";
import { createSafeIntakeSubmission } from "@/lib/ngo-safe-intake";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitSafeIntakeAction(token: string, formData: FormData) {
  const maybeFile = formData.get("evidenceFile");
  const result = await createSafeIntakeSubmission({
    client: createSupabaseServerClient(),
    input: {
      token,
      submitterLabel: String(formData.get("submitterLabel") ?? ""),
      issueCategory: String(formData.get("issueCategory") ?? ""),
      industryTag: String(formData.get("industryTag") ?? ""),
      actorType: String(formData.get("actorType") ?? ""),
      worksiteOrEmployer: String(formData.get("worksiteOrEmployer") ?? ""),
      happenedAt: String(formData.get("happenedAt") ?? ""),
      narrative: String(formData.get("narrative") ?? ""),
      shareOutsideNgo: String(formData.get("shareOutsideNgo") ?? ""),
      retaliationConcern: String(formData.get("retaliationConcern") ?? ""),
      workerNamePrivate: String(formData.get("workerNamePrivate") ?? ""),
      immigrationConcern: String(formData.get("immigrationConcern") ?? ""),
      safeContactMethod: String(formData.get("safeContactMethod") ?? ""),
      contactDetail: String(formData.get("contactDetail") ?? ""),
      evidenceFile: maybeFile instanceof File ? maybeFile : null,
    },
  });

  if (!result.ok) {
    redirect(`/intake/${token}?error=${encodeURIComponent(result.message)}`);
  }

  redirect(`/intake/${token}?submitted=1`);
}
