"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-server";
import { createProductResearchRequest } from "@/lib/research-evidence";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function createProductResearchRequestAction(formData: FormData) {
  const productName = String(formData.get("productName") ?? "").trim();

  if (!productName) {
    redirect("/shopping?research=missing-name");
  }

  if (!isSupabaseServerConfigured()) {
    redirect(`/shopping?research=unavailable&q=${encodeURIComponent(productName)}`);
  }

  const session = await getCurrentSession();
  const result = await createProductResearchRequest({
    client: createSupabaseServerClient(),
    session,
    input: {
      productName,
      brand: String(formData.get("brand") ?? ""),
      category: String(formData.get("category") ?? ""),
      upc: String(formData.get("upc") ?? ""),
      retailerUrl: String(formData.get("retailerUrl") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    },
  });

  if (!result.ok) {
    const message =
      (result as { message?: string }).message ?? "Research request failed.";
    redirect(
      `/shopping?research=error&q=${encodeURIComponent(productName)}&message=${encodeURIComponent(message)}`,
    );
  }

  redirect(`/shopping?research=requested&q=${encodeURIComponent(productName)}`);
}
