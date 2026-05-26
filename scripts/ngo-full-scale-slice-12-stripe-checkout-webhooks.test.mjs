import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("Slice 12 env placeholders are blank and safe", () => {
  const env = read(".env.example");

  for (const name of [
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
  ]) {
    assert.match(env, new RegExp(`^${name}=$`, "m"));
  }

  assert.doesNotMatch(env, /sk_test_/);
  assert.doesNotMatch(env, /sk_live_/);
  assert.doesNotMatch(env, /whsec_/);
});

test("Stripe helper is server-side, test-mode only, and keeps free path independent", () => {
  const stripe = read("src/lib/ngo-stripe.ts");

  assert.match(stripe, /sk_test_/);
  assert.match(stripe, /live_key_blocked/);
  assert.match(stripe, /stripeCheckoutNotConfiguredMessage/);
  assert.match(stripe, /Free NGO access still works/);
  assert.match(stripe, /canManageNgoBilling/);
  assert.match(stripe, /mode: "subscription"/);
  assert.match(stripe, /mode: "payment"/);
  assert.match(stripe, /metadata\[organization_id\]/);
  assert.match(stripe, /checkout_purpose/);
  assert.match(stripe, /payment does not affect trust outcomes/i);
  assert.doesNotMatch(stripe, /process\.env\.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY/);
});

test("billing page has owner-admin checkout controls and safe disabled state", () => {
  const page = read("src/app/org/billing/page.tsx");
  const actions = read("src/app/org/billing/actions.ts");

  assert.match(page, /startNgoPlanCheckout/);
  assert.match(page, /startNgoSetupCheckout/);
  assert.match(page, /stripeReady/);
  assert.match(page, /Billing setup pending/);
  assert.match(page, /Free NGO access does not require Stripe/);
  assert.match(page, /Contact Mishava/);
  assert.match(page, /verified webhooks update billing status/);
  assert.match(actions, /requireCurrentOrganizationMembership/);
  assert.match(actions, /createNgoPlanCheckout/);
  assert.match(actions, /createNgoSetupCheckout/);
  assert.doesNotMatch(page, /STRIPE_SECRET_KEY/);
});

test("webhook route requires signature verification and delegates idempotent processing", () => {
  const route = read("src/app/api/stripe/webhook/route.ts");
  const stripe = read("src/lib/ngo-stripe.ts");

  assert.match(route, /STRIPE_WEBHOOK_SECRET/);
  assert.match(route, /request\.text\(\)/);
  assert.match(route, /stripe-signature/);
  assert.match(route, /verifyStripeWebhookSignature/);
  assert.match(route, /processStripeWebhookEvent/);
  assert.match(stripe, /timingSafeEqual/);
  assert.match(stripe, /stripe_webhook_events/);
  assert.match(stripe, /processing_status.*processed/s);
  assert.match(stripe, /customer\.subscription\.updated/);
  assert.match(stripe, /invoice\.payment_failed/);
  assert.match(stripe, /payment_intent\.succeeded/);
  assert.match(stripe, /billing\.subscription_active/);
  assert.match(stripe, /billing\.payment_failed/);
  assert.match(stripe, /billing\.subscription_canceled/);
  assert.match(stripe, /setup_service\.paid/);
});

test("migration adds billing account and webhook event tables with RLS", () => {
  const migration = read("supabase/migrations/202605260001_ngo_stripe_billing.sql");

  assert.match(migration, /create table if not exists ngo_billing_accounts/);
  assert.match(migration, /stripe_customer_id text/);
  assert.match(migration, /stripe_subscription_id text/);
  assert.match(migration, /plan_key text not null default 'free'/);
  assert.match(migration, /billing_status text not null default 'free'/);
  assert.match(migration, /current_period_end timestamptz/);
  assert.match(migration, /create table if not exists stripe_webhook_events/);
  assert.match(migration, /stripe_event_id text not null unique/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /members can read ngo billing accounts/);
});

test("payment firewall includes Stripe billing fields and excludes trust influence", () => {
  const foundation = read("src/lib/foundation.ts");
  const paymentTest = read("scripts/payment-firewall.test.mjs");
  const result = read("docs/ngo-full-scale-slice-12-stripe-checkout-webhooks-result.md");

  for (const snakeCase of [
    "billing_interval",
    "stripe_customer_id",
    "stripe_subscription_id",
    "current_period_end",
    "cancel_at_period_end",
    "setup_service_status",
    "checkout_session_id",
    "invoice_status",
  ]) {
    assert.match(foundation, new RegExp(`"${snakeCase}"`));
  }

  for (const camelCase of [
    "billingInterval",
    "stripeCustomerId",
    "stripeSubscriptionId",
    "currentPeriodEnd",
    "cancelAtPeriodEnd",
    "setupServiceStatus",
    "checkoutSessionId",
    "invoiceStatus",
  ]) {
    assert.match(paymentTest, new RegExp(`"${camelCase}"`));
  }

  assert.match(result, /payment does not affect trust outcomes/i);
});
