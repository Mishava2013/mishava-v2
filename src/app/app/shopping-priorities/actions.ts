"use server";

import { redirect } from "next/navigation";
import { requireAuthenticatedSession } from "@/lib/auth-server";
import {
  automaticZeroQuestions,
  shoppingPriorityQuestions,
} from "@/lib/shopping";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveShoppingPrioritiesAction(formData: FormData) {
  const session = await requireAuthenticatedSession();
  const client = createSupabaseServerClient();

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
    const value = String(formData.get(key) ?? "off");
    automaticZeroRules[key] =
      value === "hide" || value === "warn" ? value : "off";
  });

  const answeredCount = Object.keys(answers).length;
  const personalizationEnabled =
    answeredCount >= 12 && formData.get("personalizationEnabled") === "on";

  const existing = await client.selectOne<{ id: string }>(
    "shopping_priority_profiles",
    {
      user_id: session.user.id,
      version_code: "Shopping_Priorities_V2.01_2026.05.24",
    },
    "id",
  );

  const payload = {
    user_id: session.user.id,
    answers,
    automatic_zero_rules: automaticZeroRules,
    answered_count: answeredCount,
    personalization_enabled: personalizationEnabled,
    version_code: "Shopping_Priorities_V2.01_2026.05.24",
    updated_at: new Date().toISOString(),
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

