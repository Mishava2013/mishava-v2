import { processStripeWebhookEvent, verifyStripeWebhookSignature } from "@/lib/ngo-stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json(
      { error: "Stripe webhook secret is not configured." },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");
  const verified = verifyStripeWebhookSignature({
    payload,
    secret: webhookSecret,
    signatureHeader,
  });

  if (!verified) {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const event = JSON.parse(payload);
  await processStripeWebhookEvent({
    client: createSupabaseServerClient(),
    event,
  });

  return Response.json({ received: true });
}
