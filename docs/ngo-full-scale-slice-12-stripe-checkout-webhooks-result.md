# NGO Full-Scale Slice 12 Result: Stripe Checkout And Webhooks

## Status

Implemented as a test-mode-only Stripe billing foundation.

Production charging is not enabled. Real cards must not be processed from this slice.

## What Was Implemented

- Added safe Stripe environment placeholders to `.env.example`.
- Added a server-side Stripe helper in `src/lib/ngo-stripe.ts`.
- Added test-mode Checkout Session creation for:
  - Grassroots monthly and annual;
  - Growth monthly and annual;
  - Trust Pro monthly and annual;
  - fixed-price setup services where a configured Stripe test price id exists.
- Kept Free NGO Profile independent of Stripe.
- Kept Network / Foundation / Association billing contact-only.
- Added owner/admin-only billing actions for plan and setup Checkout.
- Updated `/org/billing` with:
  - current plan;
  - billing status;
  - monthly/annual test Checkout controls;
  - setup service test Checkout controls;
  - custom plan contact path;
  - disabled billing setup pending state when Stripe test env is missing;
  - no-paid-trust-outcomes language.
- Added a Stripe webhook route at `/api/stripe/webhook`.
- Added webhook signature verification using the raw request body and `STRIPE_WEBHOOK_SECRET`.
- Added idempotent webhook event tracking through `stripe_webhook_events`.
- Added billing account tracking through `ngo_billing_accounts`.
- Extended payment firewall fields to include Stripe customer, subscription, invoice, checkout, period, and setup-service billing fields.

## Migration Applied

Migration added:

- `supabase/migrations/202605260001_ngo_stripe_billing.sql`

It creates:

- `ngo_billing_accounts`
- `stripe_webhook_events`

Both tables have RLS enabled. NGO members can read billing summaries for their own organization. App/server workflows and verified webhooks remain responsible for billing writes.

Applied to the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

Migration status:

- Local `202605260001`
- Remote `202605260001`

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.

Apply notes:

- The migration applied cleanly.
- Supabase reported expected first-run notices for `drop policy if exists ... does not exist, skipping`.

## Stripe Status

Stripe status: test-mode only.

The implementation only allows Checkout when `STRIPE_SECRET_KEY` starts with `sk_test_`. Live keys are treated as blocked in this slice.

No production charging was enabled.

No raw card data is stored by Mishava. Checkout is Stripe-hosted.

## Required Environment Variables

Required server/deployment secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_GRASSROOTS_MONTHLY_PRICE_ID`
- `STRIPE_GRASSROOTS_ANNUAL_PRICE_ID`
- `STRIPE_GROWTH_MONTHLY_PRICE_ID`
- `STRIPE_GROWTH_ANNUAL_PRICE_ID`
- `STRIPE_TRUST_PRO_MONTHLY_PRICE_ID`
- `STRIPE_TRUST_PRO_ANNUAL_PRICE_ID`
- `STRIPE_SETUP_BASIC_PRICE_ID`
- `STRIPE_SETUP_GUIDED_PRICE_ID`
- `STRIPE_SETUP_FULL_PRICE_ID`

Optional / future:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

No real Stripe secrets or price ids were committed.

## Webhook Events Planned / Handled

The webhook foundation handles:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `invoice.paid`
- `payment_intent.succeeded` for setup services

Webhook updates are accepted only after signature verification.

## Trust Outcome Confirmation

Payment does not affect trust outcomes.

Plan key, billing status, billing interval, Stripe customer id, Stripe subscription id, invoice state, checkout state, setup-service purchase, and cancellation state are forbidden trust/ranking influence fields.

Billing can gate feature capacity only. It cannot affect:

- score;
- ranking;
- verification outcomes;
- evidence truth;
- credibility labels;
- methodology outputs;
- report trust conclusions;
- Shopping placement.

## Tests Run

Final verification commands:

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm test` - passed, 112/112 tests.
- `npm run build` - passed.

Additional live checks:

- `supabase migration list --linked` before push showed `202605260001` pending remotely.
- `supabase db push --linked` applied `202605260001_ngo_stripe_billing.sql`.
- `supabase migration list --linked` after push showed local and remote aligned through `202605260001`.

## Known Limitations

- Stripe products and test Prices still need to be created in the Stripe dashboard.
- Stripe webhook endpoint still needs dashboard registration.
- The live webhook path has not processed a real Stripe test webhook yet.
- Customer Portal is not implemented.
- Refunds are not implemented.
- Tax automation is not implemented.
- Invoice customization and accounting automation are not implemented.
- Production charging is blocked pending legal, support, refund, tax, and operational approval.
- Custom/network billing remains contact-only.

## Manual Stripe Dashboard Setup Still Needed

Before live test-mode verification:

1. Create Stripe test products and Prices matching locked NGO pricing.
2. Add the Stripe test Price ids to local/deployment env vars.
3. Configure webhook endpoint:
   - `/api/stripe/webhook`
   - events listed above.
4. Add `STRIPE_WEBHOOK_SECRET` from the Stripe webhook endpoint.
5. Run a Stripe CLI or dashboard test webhook pass.
6. Run a full Checkout test with Stripe test cards only.

## Production Go-Live Gates

Before production charging:

- attorney review of billing, refund, cancellation, and Terms language;
- support workflow for billing issues;
- tax review;
- Stripe account go-live checklist;
- chargeback/dispute process;
- production secret management;
- production webhook endpoint verification;
- payment firewall tests passing;
- final approval that paid self-serve NGO billing is ready.

## Scope Confirmation

This slice did not add:

- production charging;
- real card processing;
- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI evidence parsing;
- report exports;
- malware scanning;
- SOC 2 / ISO / VPAT implementation;
- final scoring math;
- tax automation;
- refunds;
- invoice customization;
- revenue recognition;
- consumer billing;
- marketplace commissions;
- affiliate/referral logic;
- production billing emails.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
