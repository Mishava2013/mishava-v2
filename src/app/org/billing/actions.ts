"use server";

import { redirect } from "next/navigation";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  createNgoPlanCheckout,
  createNgoSetupCheckout,
  type StripeCheckoutResult,
} from "@/lib/ngo-stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NgoPlanKey } from "@/lib/ngo-billing";
import type { NgoSetupOption } from "@/lib/ngo-billing";

export async function startNgoPlanCheckout(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const planKey = String(formData.get("planKey") ?? "") as NgoPlanKey;
  const interval = String(formData.get("billingInterval") ?? "");

  const result = await createNgoPlanCheckout({
    client: createSupabaseServerClient(),
    interval: interval === "annual" ? "annual" : "monthly",
    organizationId,
    planKey,
    session,
  });

  redirectForCheckoutResult(result);
}

export async function startNgoSetupCheckout(formData: FormData) {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const setupKey = String(formData.get("setupKey") ?? "") as NgoSetupOption["key"];

  const result = await createNgoSetupCheckout({
    client: createSupabaseServerClient(),
    organizationId,
    session,
    setupKey,
  });

  redirectForCheckoutResult(result);
}

function redirectForCheckoutResult(result: StripeCheckoutResult): never {
  if (result.ok) {
    redirect(result.url);
  }

  redirect(`/org/billing?billing=${result.reason}`);
}
