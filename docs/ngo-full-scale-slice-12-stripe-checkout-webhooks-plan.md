# NGO Full-Scale Slice 12 Plan: Stripe Checkout And Webhooks

Status: planning only. Do not implement code from this document until Slice 12 is explicitly approved for implementation.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-6-billing-entitlements-result.md`
- `docs/ngo-full-scale-slice-11b-role-change-smoke-result.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`

## Goal

Plan the Stripe Checkout and webhook work needed to move NGO billing from a test-mode placeholder to a production-ready billing architecture.

This slice is for NGO billing only. It must preserve Mishava's payment firewall: payment, plan tier, setup purchase, sponsorship, customer status, invoice status, or Stripe subscription status must never affect score, ranking, verification, evidence truth, credibility labels, methodology outputs, report trust conclusions, or Shopping placement.

Production charging should not be enabled until legal, support, refund, tax, and operational readiness are explicitly approved.

## Scope

Slice 12 should plan:

- Stripe products and Prices for NGO subscriptions.
- Stripe Checkout Session creation for paid NGO plans.
- Free plan path without Stripe.
- One-time setup service payment path.
- Stripe customer and subscription mapping to organizations.
- Webhook processing and billing status synchronization.
- Entitlement updates after verified Stripe events.
- Payment firewall tests and trust-outcome separation.

This slice must not build Shopping, Business, Local, Gov, Corporate, Plus, AI evidence parsing, report exports, malware scanning, SOC 2 / ISO / VPAT implementation, or final scoring math.

## Locked NGO Pricing

| Plan | Monthly | Annual | Stripe mode |
| --- | ---: | ---: | --- |
| Free NGO Profile | $0 | $0 | No Stripe required |
| Grassroots | $19 | $190 | Subscription |
| Growth | $59 | $590 | Subscription |
| Trust Pro | $129 | $1,290 | Subscription |
| Network / Foundation / Association | Custom | Custom | Contact/manual quote path |

Setup options:

| Setup option | Price | Stripe mode |
| --- | ---: | --- |
| Self-Serve Setup | $0 | No Stripe required |
| Basic Assisted Setup | $99 | One-time Checkout payment |
| Guided Evidence Setup | $249 | One-time Checkout payment |
| Full Trust Profile Buildout | $499+ | One-time Checkout or manual quote |
| Network Setup | Custom | Contact/manual quote path |

## Stripe API Pattern

Use Stripe Billing APIs with Stripe-hosted Checkout Sessions.

Planning assumptions:

- Use Stripe Prices, not legacy Plans.
- Use Checkout Sessions with `mode: subscription` for paid monthly/annual NGO plans.
- Use Checkout Sessions with `mode: payment` for fixed-price setup services.
- Use Stripe Customer Portal later for payment method updates, cancellation, and self-service subscription management if it fits the support model.
- Use the current Stripe API version and SDK available at implementation time.
- Keep Stripe in test mode until production charging is approved.

## 1. Stripe Products And Prices

### Subscription Products

Recommended Stripe product structure:

| Stripe Product | Prices |
| --- | --- |
| Mishava NGO Grassroots | Monthly $19, annual $190 |
| Mishava NGO Growth | Monthly $59, annual $590 |
| Mishava NGO Trust Pro | Monthly $129, annual $1,290 |

Each Stripe Price should map to:

- internal `plan_key`;
- billing interval: `monthly` or `annual`;
- Stripe price id;
- active status;
- environment: `test` or `live`.

The Free plan should not have a required Stripe product or Price. It should remain a local/free self-serve path.

Network / Foundation / Association should be a contact/manual quote path. It should not use generic self-serve Checkout unless the terms, limits, and legal review are ready.

### Setup Service Products

Recommended Stripe product structure:

| Stripe Product | Price |
| --- | ---: |
| Mishava Basic Assisted Setup | $99 one-time |
| Mishava Guided Evidence Setup | $249 one-time |
| Mishava Full Trust Profile Buildout | $499+ one-time or manual quote |

Network Setup should remain custom/contact-only.

### Source Of Truth

Implementation should keep a local Stripe price mapping layer, separate from the display-only plan model in `src/lib/ngo-billing.ts`.

Recommended mapping shape:

- `plan_key`
- `billing_interval`
- `stripe_product_id`
- `stripe_price_id`
- `environment`
- `active`

Stripe ids should come from environment/configuration, not be hardcoded into user-facing logic.

## 2. Checkout Flow

### Billing Page Flow

`/org/billing` should eventually support:

1. User views current plan, usage, and limits.
2. Owner/admin selects a paid plan and interval.
3. Server verifies:
   - user is authenticated;
   - user is an active member of the selected organization;
   - user has `manage_billing`;
   - selected plan/interval is valid and active;
   - Stripe test/live mode is configured.
4. Server creates or reuses a Stripe Customer for the organization.
5. Server creates a Stripe Checkout Session.
6. User completes payment in Stripe-hosted Checkout.
7. Stripe redirects to success or cancel URL.
8. Webhook confirms subscription/payment before local plan status changes.

### Free Plan Path

Free NGO Profile must not require Stripe.

The free path should:

- remain usable with no Stripe environment variables;
- allow self-serve onboarding;
- apply Free entitlements;
- never require card collection;
- show clear upgrade options without blocking existing free use.

### Success And Cancel URLs

Recommended local routes:

- success: `/org/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`
- cancel: `/org/billing?checkout=cancelled`

The success page/message must not mark the subscription active by trusting the redirect alone. Local billing status should update only after a verified webhook or a server-side Stripe session verification.

### Setup Service Checkout

Setup service checkout should:

- require owner/admin permission;
- use `mode: payment`;
- map the payment to one organization;
- record selected setup service;
- avoid changing trust outcomes;
- create audit events for checkout start and payment confirmation.

Setup service purchases are assistance/service purchases only. They must not change score, ranking, verification, credibility labels, evidence truth, or report trust conclusions.

## 3. Webhook Handling

### Required Events

Plan webhook handling for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `invoice.paid`
- `payment_intent.succeeded` for setup services when needed

### Processing Rules

Webhook route requirements:

- require Stripe signature verification with `STRIPE_WEBHOOK_SECRET`;
- use raw request body for signature verification;
- be idempotent;
- never trust client-side plan changes;
- write audit events for processed billing changes;
- store enough event metadata to diagnose duplicate or failed processing;
- fail closed on invalid signature.

### Event Mapping

| Stripe event | Local effect |
| --- | --- |
| `checkout.session.completed` | Confirm checkout completion and map customer/session to org. Do not over-trust if subscription details are not finalized. |
| `customer.subscription.created` | Store subscription id, interval, plan key, billing status, current period end. |
| `customer.subscription.updated` | Sync status, interval, plan, period end, cancellation flags. |
| `customer.subscription.deleted` | Safely downgrade or mark canceled while preserving existing data reads. |
| `invoice.payment_failed` | Mark `past_due` or payment issue state. Do not delete data or alter trust outcomes. |
| `invoice.paid` | Confirm active/paid state where appropriate. |
| `payment_intent.succeeded` | Mark setup service paid/requested if the PaymentIntent belongs to an approved setup Checkout Session. |

## 4. Database Model

Slice 12 implementation should either add a dedicated billing table or safely extend existing organization/NGO profile billing fields. A dedicated table is preferred for auditability and to avoid overloading `ngo_profiles.tier`.

Recommended table:

`ngo_billing_accounts`

Suggested fields:

- `id`
- `organization_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `plan_key`
- `billing_status`
- `billing_interval`
- `current_period_end`
- `cancel_at_period_end`
- `setup_service_key`
- `setup_service_status`
- `last_stripe_event_id`
- `updated_by`
- `created_at`
- `updated_at`

Recommended supporting table:

`stripe_webhook_events`

Suggested fields:

- `id`
- `stripe_event_id`
- `event_type`
- `livemode`
- `processing_status`
- `organization_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `received_at`
- `processed_at`
- `error_message`

This table supports idempotency and operational debugging.

### Status Values

Billing status should be explicit and limited:

- `free`
- `checkout_pending`
- `active`
- `trialing` if trials are later approved
- `past_due`
- `canceled`
- `incomplete`
- `unpaid`
- `manual_custom`

Billing interval:

- `monthly`
- `annual`
- `none`
- `custom`

Setup service status:

- `none`
- `requested`
- `checkout_pending`
- `paid`
- `scheduled`
- `completed`
- `canceled`
- `manual_custom`

## 5. Entitlement Sync

Entitlement limits should continue to come from the internal plan model.

Rules:

- successful subscription webhook updates `plan_key`, interval, and billing status;
- failed payment moves billing state to `past_due` without deleting data;
- canceled subscription safely downgrades at the correct time;
- downgrade never deletes evidence, reports, files, share grants, members, or audit history;
- existing data remains readable;
- new creation may be limited according to the resulting plan;
- custom/network plans require manual/support handling until a safe contract path exists.

Entitlement checks must remain feature-volume gates only. They must not influence trust outcomes.

## 6. Security Requirements

Stripe security requirements:

- `STRIPE_SECRET_KEY` server-side only.
- `STRIPE_WEBHOOK_SECRET` server-side only.
- no Stripe secret in browser bundles.
- no raw card data stored by Mishava.
- Stripe-hosted Checkout should minimize PCI scope.
- webhook signature verification required.
- webhook processing idempotent.
- server-side organization membership and role checks for checkout creation.
- no client-provided `plan_key`, `price_id`, or `organization_id` trusted without server validation.
- success redirect is not authoritative.
- Stripe metadata should include organization id and checkout purpose, but not sensitive evidence data.

Recommended Stripe metadata:

- `organization_id`
- `plan_key`
- `billing_interval`
- `checkout_purpose`
- `setup_service_key` where applicable
- `initiated_by_user_id`

Do not include raw evidence content, private report content, sensitive documents, or unnecessary personal data in Stripe metadata.

## 7. Environment Variables

Implementation should plan safe blank placeholders only:

- `STRIPE_SECRET_KEY=`
- `STRIPE_WEBHOOK_SECRET=`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=` if a client-side Stripe component is ever needed; Checkout redirects may not require it in the first implementation.
- `STRIPE_NGO_GRASSROOTS_MONTHLY_PRICE_ID=`
- `STRIPE_NGO_GRASSROOTS_ANNUAL_PRICE_ID=`
- `STRIPE_NGO_GROWTH_MONTHLY_PRICE_ID=`
- `STRIPE_NGO_GROWTH_ANNUAL_PRICE_ID=`
- `STRIPE_NGO_TRUST_PRO_MONTHLY_PRICE_ID=`
- `STRIPE_NGO_TRUST_PRO_ANNUAL_PRICE_ID=`
- `STRIPE_SETUP_BASIC_ASSISTED_PRICE_ID=`
- `STRIPE_SETUP_GUIDED_EVIDENCE_PRICE_ID=`
- `STRIPE_SETUP_FULL_PROFILE_PRICE_ID=`

No real secrets should be committed. `.env.local` must remain ignored.

## 8. Audit Events

Plan audit events:

- `billing.checkout_started`
- `billing.checkout_completed`
- `billing.plan_selected`
- `billing.plan_changed`
- `billing.subscription_active`
- `billing.subscription_updated`
- `billing.payment_failed`
- `billing.subscription_canceled`
- `billing.downgrade_scheduled`
- `billing.webhook_processed`
- `billing.webhook_failed`
- `setup_service.requested`
- `setup_service.checkout_started`
- `setup_service.paid`
- `ngo_entitlement.limit_reached` already exists and should continue

Audit details should include safe metadata:

- organization id;
- actor user id where applicable;
- plan key;
- billing interval;
- Stripe event id where applicable;
- checkout/session id where applicable;
- no raw card data;
- no sensitive evidence content.

## 9. Payment Firewall Rules

Slice 12 must extend the existing payment firewall tests.

Forbidden trust/ranking inputs:

- `plan_key`
- `billing_status`
- `billing_interval`
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `current_period_end`
- `cancel_at_period_end`
- `setup_service_status`
- `checkout_session_id`
- `invoice_status`
- `payment_status`
- `sponsorship_status`
- `paid_boost`
- `commission`
- `affiliate_fee`
- `referral_fee`

These fields may control feature access and plan limits only. They must not affect:

- score;
- ranking;
- verification outcome;
- credibility labels;
- methodology outputs;
- evidence truth;
- report trust conclusions;
- Shopping placement.

## 10. Tests Required

Implementation should add or extend tests for:

- Free plan does not require Stripe.
- Checkout session creation requires owner/admin or equivalent `manage_billing`.
- Member/viewer cannot start billing checkout.
- Non-member cannot start billing checkout for an org.
- Invalid price/plan cannot be used.
- Stripe secret key is server-only and not exposed to client code.
- Webhook signature is required.
- Invalid webhook signature is rejected.
- Duplicate webhook events are idempotent.
- `checkout.session.completed` maps to the correct organization/customer.
- Subscription created/updated/deleted events update billing status.
- `invoice.payment_failed` moves billing status to payment issue state without deleting data.
- Canceled/downgraded plan preserves existing data read access.
- New creation is limited according to resulting entitlements.
- Setup service payment updates setup service status only.
- Plan key and billing status do not affect scoring.
- Plan key and billing status do not affect ranking.
- Plan tier does not affect verification labels.
- Existing payment firewall tests still pass.
- `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` pass.

## 11. Non-Goals

Slice 12 must exclude:

- production go-live charging;
- tax automation;
- refund automation;
- invoice customization;
- revenue recognition;
- accounting automation;
- Consumer Plus billing;
- Shopping monetization;
- marketplace commissions;
- affiliate/referral logic;
- Business, Local, Gov, or Corporate billing;
- custom procurement invoicing;
- broad admin analytics;
- final scoring math.

## 12. Legal / Support Readiness Before Production Charging

Before live charging is enabled, Mishava should complete or explicitly approve:

- final Terms and Privacy review for paid billing;
- refund/cancellation policy;
- support path for billing questions;
- support path for failed/canceled payments;
- tax review;
- invoice/receipt expectations;
- Stripe account go-live checklist;
- chargeback/dispute process;
- operational owner for billing support;
- production environment secret management;
- incident response path for billing bugs.

Until those are ready, Slice 12 implementation should remain test-mode only.

## 13. Recommended Implementation Order

1. Add Stripe environment placeholders and configuration validation.
2. Add database model for billing account and webhook event idempotency.
3. Add server-only Stripe client helper.
4. Add Stripe price mapping helpers with locked NGO pricing validation.
5. Add owner/admin checkout session action for subscriptions in test mode.
6. Add setup service checkout action in test mode.
7. Add webhook route with signature verification and idempotency.
8. Add billing status sync and entitlement update logic.
9. Update `/org/billing` to start test-mode Checkout when configured.
10. Add audit events.
11. Add payment firewall and billing/security tests.
12. Run live test-mode Stripe checkout/webhook verification before any production switch.

## 14. Acceptance Criteria

Slice 12 implementation may begin only if this plan remains true:

- Stripe remains test-mode until explicit production approval.
- Pricing matches the locked NGO pricing exactly.
- Free path remains usable without Stripe.
- Checkout creation is server-side and owner/admin protected.
- Webhook signature verification and idempotency are required.
- Payment firewall is preserved and tested.
- Downgrade/cancellation never deletes existing NGO data.
- Mishava stores no raw card data.
- Legal/support readiness requirements are documented before production charging.

## Final Planning Status

Slice 12 is ready to implement as a test-mode production-architecture slice, but it should not enable real charging until legal, support, refund, tax, and operational readiness are separately approved.
