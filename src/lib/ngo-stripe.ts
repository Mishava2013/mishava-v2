import { createHmac, timingSafeEqual } from "node:crypto";
import { canManageNgoBilling } from "./auth";
import { buildAuditEvent } from "./audit-log";
import {
  ngoPlanDefinitions,
  ngoSetupOptions,
  planFromKey,
  type NgoBillingInterval,
  type NgoPlanKey,
  type NgoSetupOption,
} from "./ngo-billing";
import type { AuthSession } from "./auth";
import type { SupabaseServerClient } from "./supabase/server";

export type StripeBillingMode = "not_configured" | "test_mode" | "live_key_blocked";

export type StripeCheckoutPurpose = "subscription" | "setup_service";

export type StripeCheckoutResult =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; message: string; reason: "not_configured" | "forbidden" | "invalid" | "stripe_error" };

type BillingAccountRow = Record<string, unknown> & {
  id: string;
  organization_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_key: NgoPlanKey;
  billing_status: string;
  billing_interval: NgoBillingInterval;
};

type OrganizationRow = Record<string, unknown> & {
  id: string;
  name: string;
};

type WebhookEventRow = Record<string, unknown> & {
  id: string;
  stripe_event_id: string;
  processing_status: string;
};

type StripeApiSession = {
  id: string;
  url?: string | null;
  customer?: string | null;
  subscription?: string | null;
};

type StripeApiCustomer = {
  id: string;
};

export type StripeEventPayload = {
  id: string;
  type: string;
  livemode?: boolean;
  data?: {
    object?: Record<string, unknown>;
  };
};

export const stripeCheckoutNotConfiguredMessage =
  "Stripe test-mode billing setup is pending. Free NGO access still works, and payment does not affect trust outcomes.";

const stripeApiVersion = "2026-02-25.clover";

export const stripeEnvNames = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_GRASSROOTS_MONTHLY_PRICE_ID",
  "STRIPE_GRASSROOTS_ANNUAL_PRICE_ID",
  "STRIPE_GROWTH_MONTHLY_PRICE_ID",
  "STRIPE_GROWTH_ANNUAL_PRICE_ID",
  "STRIPE_TRUST_PRO_MONTHLY_PRICE_ID",
  "STRIPE_TRUST_PRO_ANNUAL_PRICE_ID",
  "STRIPE_SETUP_BASIC_PRICE_ID",
  "STRIPE_SETUP_GUIDED_PRICE_ID",
  "STRIPE_SETUP_FULL_PRICE_ID",
] as const;

export const stripeWebhookEventTypes = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "invoice.paid",
  "payment_intent.succeeded",
] as const;

export function getStripeBillingMode(): StripeBillingMode {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return "not_configured";
  if (!secretKey.startsWith("sk_test_")) return "live_key_blocked";
  return "test_mode";
}

export function isStripeCheckoutConfigured() {
  return getStripeBillingMode() === "test_mode";
}

export function getSubscriptionPriceId({
  interval,
  planKey,
}: {
  interval: "monthly" | "annual";
  planKey: NgoPlanKey;
}) {
  switch (`${planKey}:${interval}`) {
    case "grassroots:monthly":
      return process.env.STRIPE_GRASSROOTS_MONTHLY_PRICE_ID ?? "";
    case "grassroots:annual":
      return process.env.STRIPE_GRASSROOTS_ANNUAL_PRICE_ID ?? "";
    case "growth:monthly":
      return process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID ?? "";
    case "growth:annual":
      return process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID ?? "";
    case "trust_pro:monthly":
      return process.env.STRIPE_TRUST_PRO_MONTHLY_PRICE_ID ?? "";
    case "trust_pro:annual":
      return process.env.STRIPE_TRUST_PRO_ANNUAL_PRICE_ID ?? "";
    default:
      return "";
  }
}

export function getSetupPriceId(setupKey: NgoSetupOption["key"]) {
  switch (setupKey) {
    case "basic_assisted_setup":
      return process.env.STRIPE_SETUP_BASIC_PRICE_ID ?? "";
    case "guided_evidence_setup":
      return process.env.STRIPE_SETUP_GUIDED_PRICE_ID ?? "";
    case "full_trust_profile_buildout":
      return process.env.STRIPE_SETUP_FULL_PRICE_ID ?? "";
    default:
      return "";
  }
}

export async function createNgoPlanCheckout({
  client,
  interval,
  organizationId,
  session,
  planKey,
}: {
  client: SupabaseServerClient;
  interval: "monthly" | "annual";
  organizationId: string;
  session: AuthSession;
  planKey: NgoPlanKey;
}): Promise<StripeCheckoutResult> {
  if (!canManageNgoBilling(session, organizationId)) {
    return { ok: false, message: "Only NGO owners or admins can manage billing.", reason: "forbidden" };
  }

  const plan = planFromKey(planKey);
  if (!plan.selfServeAllowed || plan.customPricing || plan.key === "free") {
    return { ok: false, message: "This plan is not available for self-serve Checkout.", reason: "invalid" };
  }

  const priceId = getSubscriptionPriceId({ planKey, interval });
  if (!isStripeCheckoutConfigured() || !priceId) {
    return { ok: false, message: stripeCheckoutNotConfiguredMessage, reason: "not_configured" };
  }

  const customerId = await ensureStripeCustomer({
    client,
    organizationId,
    session,
  });

  const metadata = {
    organization_id: organizationId,
    plan_key: planKey,
    billing_interval: interval,
    checkout_purpose: "subscription",
    initiated_by_user_id: session.user.id,
  };

  const checkoutSession = await stripeApiRequest<StripeApiSession>(
    "/v1/checkout/sessions",
    checkoutSessionParams({
      customerId,
      lineItemPriceId: priceId,
      metadata,
      mode: "subscription",
      organizationId,
      session,
    }),
  );

  await upsertBillingAccount({
    client,
    organizationId,
    payload: {
      stripe_customer_id: customerId,
      plan_key: planKey,
      billing_status: "checkout_pending",
      billing_interval: interval,
      updated_by: session.user.id,
    },
  });

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "billing.checkout_started",
      subjectTable: "ngo_billing_accounts",
      reason: `Started Stripe test-mode Checkout for ${plan.name} ${interval}.`,
      afterData: {
        checkout_session_id: checkoutSession.id,
        plan_key: planKey,
        billing_interval: interval,
        test_mode_only: true,
      },
    }),
  );

  if (!checkoutSession.url) {
    return { ok: false, message: "Stripe did not return a Checkout URL.", reason: "stripe_error" };
  }

  return { ok: true, url: checkoutSession.url, sessionId: checkoutSession.id };
}

export async function createNgoSetupCheckout({
  client,
  organizationId,
  session,
  setupKey,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  session: AuthSession;
  setupKey: NgoSetupOption["key"];
}): Promise<StripeCheckoutResult> {
  if (!canManageNgoBilling(session, organizationId)) {
    return { ok: false, message: "Only NGO owners or admins can manage billing.", reason: "forbidden" };
  }

  const setupOption = ngoSetupOptions.find((option) => option.key === setupKey);
  const priceId = getSetupPriceId(setupKey);
  if (!setupOption || setupOption.customPricing || setupOption.priceCents === 0) {
    return { ok: false, message: "This setup option is not available for self-serve Checkout.", reason: "invalid" };
  }
  if (!isStripeCheckoutConfigured() || !priceId) {
    return { ok: false, message: stripeCheckoutNotConfiguredMessage, reason: "not_configured" };
  }

  const customerId = await ensureStripeCustomer({
    client,
    organizationId,
    session,
  });
  const metadata = {
    organization_id: organizationId,
    setup_service_key: setupKey,
    checkout_purpose: "setup_service",
    initiated_by_user_id: session.user.id,
  };

  const checkoutSession = await stripeApiRequest<StripeApiSession>(
    "/v1/checkout/sessions",
    checkoutSessionParams({
      customerId,
      lineItemPriceId: priceId,
      metadata,
      mode: "payment",
      organizationId,
      session,
    }),
  );

  await upsertBillingAccount({
    client,
    organizationId,
    payload: {
      stripe_customer_id: customerId,
      setup_service_key: setupKey,
      setup_service_status: "checkout_pending",
      updated_by: session.user.id,
    },
  });

  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: session.user.id,
      organizationId,
      action: "setup_service.checkout_started",
      subjectTable: "ngo_billing_accounts",
      reason: `Started Stripe test-mode Checkout for ${setupOption.name}.`,
      afterData: {
        checkout_session_id: checkoutSession.id,
        setup_service_key: setupKey,
        test_mode_only: true,
      },
    }),
  );

  if (!checkoutSession.url) {
    return { ok: false, message: "Stripe did not return a Checkout URL.", reason: "stripe_error" };
  }

  return { ok: true, url: checkoutSession.url, sessionId: checkoutSession.id };
}

export async function processStripeWebhookEvent({
  client,
  event,
}: {
  client: SupabaseServerClient;
  event: StripeEventPayload;
}) {
  if (!event.id || !event.type) {
    throw new Error("Invalid Stripe event payload.");
  }

  const existing = await client.selectOne<WebhookEventRow>(
    "stripe_webhook_events",
    { stripe_event_id: event.id },
    "id,stripe_event_id,processing_status",
  );
  if (existing?.processing_status === "processed") {
    return { ok: true, duplicate: true };
  }

  const object = event.data?.object ?? {};
  const organizationId = getObjectMetadata(object, "organization_id");
  const stripeCustomerId = getStringField(object, "customer");
  const stripeSubscriptionId =
    getStringField(object, "subscription") ?? getStringField(object, "id");

  if (!existing) {
    await client.insert("stripe_webhook_events", {
      stripe_event_id: event.id,
      event_type: event.type,
      livemode: Boolean(event.livemode),
      processing_status: "received",
      organization_id: organizationId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      received_at: new Date().toISOString(),
    });
  }

  try {
    await applyWebhookObject({
      client,
      eventType: event.type,
      object,
      organizationId,
      stripeCustomerId,
      stripeEventId: event.id,
      stripeSubscriptionId,
    });

    await client.update(
      "stripe_webhook_events",
      { stripe_event_id: event.id },
      {
        processing_status: "processed",
        processed_at: new Date().toISOString(),
        error_message: null,
      },
    );

    if (organizationId) {
      await client.insert(
        "audit_events",
        buildAuditEvent({
          actorUserId: null,
          organizationId,
          action: "billing.webhook_processed",
          subjectTable: "stripe_webhook_events",
          reason: `Processed Stripe test-mode webhook ${event.type}.`,
          afterData: {
            stripe_event_id: event.id,
            event_type: event.type,
          },
        }),
      );
    }

    return { ok: true, duplicate: false };
  } catch (error) {
    await client.update(
      "stripe_webhook_events",
      { stripe_event_id: event.id },
      {
        processing_status: "failed",
        processed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : "Unknown webhook error.",
      },
    );
    throw error;
  }
}

export function verifyStripeWebhookSignature({
  payload,
  secret,
  signatureHeader,
  toleranceSeconds = 300,
}: {
  payload: string;
  secret: string;
  signatureHeader: string | null;
  toleranceSeconds?: number;
}) {
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;
  if (Math.abs(Date.now() / 1000 - timestampSeconds) > toleranceSeconds) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(signature, "hex");
  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

async function ensureStripeCustomer({
  client,
  organizationId,
  session,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  session: AuthSession;
}) {
  const existing = await client.selectOne<BillingAccountRow>(
    "ngo_billing_accounts",
    { organization_id: organizationId },
    "id,organization_id,stripe_customer_id,stripe_subscription_id,plan_key,billing_status,billing_interval",
  );
  if (existing?.stripe_customer_id) return existing.stripe_customer_id;

  const organization = await client.selectOne<OrganizationRow>(
    "organizations",
    { id: organizationId },
    "id,name",
  );
  const customer = await stripeApiRequest<StripeApiCustomer>("/v1/customers", {
    email: session.user.email,
    name: organization?.name ?? "Mishava NGO workspace",
    "metadata[organization_id]": organizationId,
    "metadata[created_by_user_id]": session.user.id,
  });

  await upsertBillingAccount({
    client,
    organizationId,
    payload: {
      stripe_customer_id: customer.id,
      updated_by: session.user.id,
    },
  });

  return customer.id;
}

async function upsertBillingAccount({
  client,
  organizationId,
  payload,
}: {
  client: SupabaseServerClient;
  organizationId: string;
  payload: Record<string, unknown>;
}) {
  const existing = await client.selectOne<BillingAccountRow>(
    "ngo_billing_accounts",
    { organization_id: organizationId },
    "id,organization_id,stripe_customer_id,stripe_subscription_id,plan_key,billing_status,billing_interval",
  );
  const nextPayload = {
    ...payload,
    organization_id: organizationId,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    return client.update("ngo_billing_accounts", { organization_id: organizationId }, nextPayload);
  }

  return client.insert("ngo_billing_accounts", {
    plan_key: "free",
    billing_status: "free",
    billing_interval: "none",
    setup_service_status: "none",
    ...nextPayload,
    created_at: new Date().toISOString(),
  });
}

async function stripeApiRequest<T>(path: string, params: Record<string, string>) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey?.startsWith("sk_test_")) {
    throw new Error("Stripe test-mode secret key is not configured.");
  }

  const response = await fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
      "stripe-version": stripeApiVersion,
    },
    body: new URLSearchParams(params),
    cache: "no-store",
  });

  const body = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string };
  };
  if (!response.ok) {
    throw new Error(body.error?.message ?? `Stripe request failed: ${response.status}`);
  }
  return body as T;
}

function checkoutSessionParams({
  customerId,
  lineItemPriceId,
  metadata,
  mode,
  organizationId,
  session,
}: {
  customerId: string;
  lineItemPriceId: string;
  metadata: Record<string, string>;
  mode: "payment" | "subscription";
  organizationId: string;
  session: AuthSession;
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const params: Record<string, string> = {
    mode,
    customer: customerId,
    client_reference_id: organizationId,
    success_url: `${siteUrl}/org/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/org/billing?checkout=cancelled`,
    "line_items[0][price]": lineItemPriceId,
    "line_items[0][quantity]": "1",
  };

  for (const [key, value] of Object.entries(metadata)) {
    params[`metadata[${key}]`] = value;
    if (mode === "subscription") {
      params[`subscription_data[metadata][${key}]`] = value;
    } else {
      params[`payment_intent_data[metadata][${key}]`] = value;
    }
  }
  params["metadata[initiated_by_email]"] = session.user.email;

  return params;
}

async function applyWebhookObject({
  client,
  eventType,
  object,
  organizationId,
  stripeCustomerId,
  stripeEventId,
  stripeSubscriptionId,
}: {
  client: SupabaseServerClient;
  eventType: string;
  object: Record<string, unknown>;
  organizationId?: string | null;
  stripeCustomerId?: string | null;
  stripeEventId: string;
  stripeSubscriptionId?: string | null;
}) {
  const resolvedOrganizationId =
    organizationId ??
    (await findOrganizationIdForStripeObject({
      client,
      stripeCustomerId,
      stripeSubscriptionId,
    }));
  if (!resolvedOrganizationId) return;

  const planKey = getObjectMetadata(object, "plan_key") as NgoPlanKey | null;
  const billingInterval = getObjectMetadata(object, "billing_interval") as
    | NgoBillingInterval
    | null;
  const setupServiceKey = getObjectMetadata(object, "setup_service_key");
  const subscriptionStatus = getStringField(object, "status");
  const currentPeriodEnd = timestampToIso(getNumberField(object, "current_period_end"));
  const cancelAtPeriodEnd = Boolean(object.cancel_at_period_end);

  if (eventType === "checkout.session.completed") {
    await upsertBillingAccount({
      client,
      organizationId: resolvedOrganizationId,
      payload: {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_key: planKey ?? "free",
        billing_status: planKey ? "checkout_pending" : "free",
        billing_interval: billingInterval ?? "none",
        setup_service_key: setupServiceKey,
        setup_service_status: setupServiceKey ? "checkout_pending" : "none",
        last_stripe_event_id: stripeEventId,
      },
    });
    await writeBillingWebhookAudit({
      action: "billing.checkout_completed",
      client,
      eventType,
      organizationId: resolvedOrganizationId,
      reason: "Stripe test-mode Checkout completed. Subscription status still depends on verified subscription or invoice events.",
      stripeEventId,
      afterData: {
        plan_key: planKey,
        billing_interval: billingInterval,
        setup_service_key: setupServiceKey,
      },
    });
    return;
  }

  if (eventType.startsWith("customer.subscription.")) {
    const billingStatus = mapStripeSubscriptionStatus(subscriptionStatus, eventType);
    await upsertBillingAccount({
      client,
      organizationId: resolvedOrganizationId,
      payload: {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_key: planKey ?? "free",
        billing_status: billingStatus,
        billing_interval: billingInterval ?? "none",
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        last_stripe_event_id: stripeEventId,
      },
    });
    await writeBillingWebhookAudit({
      action:
        billingStatus === "active"
          ? "billing.subscription_active"
          : billingStatus === "canceled"
            ? "billing.subscription_canceled"
            : "billing.subscription_updated",
      client,
      eventType,
      organizationId: resolvedOrganizationId,
      reason: `Stripe test-mode subscription event updated billing status to ${billingStatus}.`,
      stripeEventId,
      afterData: {
        plan_key: planKey,
        billing_interval: billingInterval,
        billing_status: billingStatus,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    });
    return;
  }

  if (eventType === "invoice.payment_failed") {
    await upsertBillingAccount({
      client,
      organizationId: resolvedOrganizationId,
      payload: {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        billing_status: "past_due",
        last_stripe_event_id: stripeEventId,
      },
    });
    await writeBillingWebhookAudit({
      action: "billing.payment_failed",
      client,
      eventType,
      organizationId: resolvedOrganizationId,
      reason: "Stripe test-mode invoice payment failed. Existing NGO data remains readable and trust outcomes are unchanged.",
      stripeEventId,
      afterData: {
        billing_status: "past_due",
      },
    });
    return;
  }

  if (eventType === "invoice.paid") {
    await upsertBillingAccount({
      client,
      organizationId: resolvedOrganizationId,
      payload: {
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        billing_status: "active",
        last_stripe_event_id: stripeEventId,
      },
    });
    await writeBillingWebhookAudit({
      action: "billing.subscription_active",
      client,
      eventType,
      organizationId: resolvedOrganizationId,
      reason: "Stripe test-mode invoice paid and subscription billing is active.",
      stripeEventId,
      afterData: {
        billing_status: "active",
      },
    });
    return;
  }

  if (eventType === "payment_intent.succeeded" && setupServiceKey) {
    await upsertBillingAccount({
      client,
      organizationId: resolvedOrganizationId,
      payload: {
        stripe_customer_id: stripeCustomerId,
        setup_service_key: setupServiceKey,
        setup_service_status: "paid",
        last_stripe_event_id: stripeEventId,
      },
    });
    await writeBillingWebhookAudit({
      action: "setup_service.paid",
      client,
      eventType,
      organizationId: resolvedOrganizationId,
      reason: "Stripe test-mode setup service payment succeeded.",
      stripeEventId,
      afterData: {
        setup_service_key: setupServiceKey,
        setup_service_status: "paid",
      },
    });
  }
}

async function writeBillingWebhookAudit({
  action,
  afterData,
  client,
  eventType,
  organizationId,
  reason,
  stripeEventId,
}: {
  action: string;
  afterData: Record<string, unknown>;
  client: SupabaseServerClient;
  eventType: string;
  organizationId: string;
  reason: string;
  stripeEventId: string;
}) {
  await client.insert(
    "audit_events",
    buildAuditEvent({
      actorUserId: null,
      organizationId,
      action,
      subjectTable: "ngo_billing_accounts",
      reason,
      afterData: {
        ...afterData,
        event_type: eventType,
        stripe_event_id: stripeEventId,
        test_mode_only: true,
      },
    }),
  );
}

async function findOrganizationIdForStripeObject({
  client,
  stripeCustomerId,
  stripeSubscriptionId,
}: {
  client: SupabaseServerClient;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  if (stripeSubscriptionId) {
    const bySubscription = await client.selectOne<BillingAccountRow>(
      "ngo_billing_accounts",
      { stripe_subscription_id: stripeSubscriptionId },
      "id,organization_id,stripe_customer_id,stripe_subscription_id,plan_key,billing_status,billing_interval",
    );
    if (bySubscription?.organization_id) return bySubscription.organization_id;
  }

  if (stripeCustomerId) {
    const byCustomer = await client.selectOne<BillingAccountRow>(
      "ngo_billing_accounts",
      { stripe_customer_id: stripeCustomerId },
      "id,organization_id,stripe_customer_id,stripe_subscription_id,plan_key,billing_status,billing_interval",
    );
    if (byCustomer?.organization_id) return byCustomer.organization_id;
  }

  return null;
}

function mapStripeSubscriptionStatus(status: string | null, eventType: string) {
  if (eventType === "customer.subscription.deleted") return "canceled";
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "incomplete":
      return "incomplete";
    case "unpaid":
      return "unpaid";
    default:
      return "checkout_pending";
  }
}

function getObjectMetadata(object: Record<string, unknown>, key: string) {
  const metadata = object.metadata;
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" && value ? value : null;
}

function getStringField(object: Record<string, unknown>, key: string) {
  const value = object[key];
  return typeof value === "string" && value ? value : null;
}

function getNumberField(object: Record<string, unknown>, key: string) {
  const value = object[key];
  return typeof value === "number" ? value : null;
}

function timestampToIso(timestamp: number | null) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

export function selfServePaidPlans() {
  return ngoPlanDefinitions.filter(
    (plan) => plan.selfServeAllowed && !plan.customPricing && plan.key !== "free",
  );
}

export function selfServeSetupOptions() {
  return ngoSetupOptions.filter(
    (option) => !option.customPricing && option.priceCents !== null && option.priceCents > 0,
  );
}
