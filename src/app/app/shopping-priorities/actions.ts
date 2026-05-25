"use server";

import { redirect } from "next/navigation";
import { requireAuthenticatedSession } from "@/lib/auth-server";
import {
  automaticZeroQuestions,
  sanitizeRedLineMode,
  shoppingPriorityQuestions,
  shoppingPriorityConsentVersion,
  shoppingPriorityVersionCode,
} from "@/lib/shopping";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveShoppingPrioritiesAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const client = createSupabaseServerClient();
  const privacyAcknowledged = formData.get("privacyAcknowledged") === "on";

  if (!privacyAcknowledged) {
    redirect("/app/shopping-priorities?error=privacy_required");
  }

  const answers: Record<string, number> = {};

  for (const question of shoppingPriorityQuestions) {
    const raw = Number(formData.get(question.id));
    if (Number.isInteger(raw) && raw >= 1 && raw <= 5) {
      answers[question.id] = raw;
    }
  }

  const automaticZeroRules: Record<string, string> = {};

  automaticZeroQuestions.forEach((_, index) => {
    const key = `zero_rule_${index + 1}`;
    automaticZeroRules[key] = sanitizeRedLineMode(formData.get(key));
  });

  const answeredCount = Object.keys(answers).length;
  const personalizationEnabled =
    answeredCount >= 12 && formData.get("personalizationEnabled") === "on";

  const existing = await client.selectOne<{ id: string }>(
    "shopping_priority_profiles",
    {
      user_id: session.user.id,
      version_code: shoppingPriorityVersionCode,
    },
    "id",
  );

  const now = new Date().toISOString();
  const payload = {
    user_id: session.user.id,
    answers,
    automatic_zero_rules: automaticZeroRules,
    answered_count: answeredCount,
    personalization_enabled: personalizationEnabled,
    version_code: shoppingPriorityVersionCode,
    consent_version: shoppingPriorityConsentVersion,
    consented_at: now,
    privacy_acknowledged_at: now,
    last_reviewed_at: now,
    updated_at: now,
  };

  if (existing) {
    await client.update("shopping_priority_profiles", { id: existing.id }, payload);
  } else {
    await client.insert("shopping_priority_profiles", payload);
  }

  redirect(
    `/app/shopping-priorities?saved=1&personalized=${personalizationEnabled ? "1" : "0"}`,
  );
}
