# NGO Full-Scale Slice 6 Result: Billing, Plans, and Entitlements

## Status

Implemented and locally verified.

## What Was Implemented

- Added a source-of-truth NGO plan and entitlement model in `src/lib/ngo-billing.ts`.
- Added locked NGO pricing:
  - Free NGO Profile: $0/month.
  - Grassroots: $19/month or $190/year.
  - Growth: $59/month or $590/year.
  - Trust Pro: $129/month or $1,290/year.
  - Network / Foundation / Association: custom.
- Added setup service definitions:
  - Self-Serve Setup: $0.
  - Basic Assisted Setup: $99.
  - Guided Evidence Setup: $249.
  - Full Trust Profile Buildout: $499+.
  - Network Setup: custom.
- Added entitlement limits for:
  - evidence items;
  - active private files;
  - storage allowance;
  - reports;
  - active share grants;
  - team members;
  - report template level;
  - future export level;
  - future AI report assist level.
- Updated `/org/billing` to show:
  - current plan;
  - billing status;
  - Stripe test-mode placeholder status;
  - usage vs limits;
  - available NGO plans;
  - setup service options;
  - no-paid-ranking/no-paid-score/no-paid-verification language.
- Added server-side entitlement checks for:
  - evidence creation;
  - private evidence file upload;
  - storage allowance;
  - report creation;
  - active share grant creation;
  - team invite creation.
- Added audit events for entitlement limit reached events through `ngo_entitlement.limit_reached`.
- Extended payment firewall boundaries so NGO plan and billing fields are forbidden trust/ranking influence inputs.
- Kept the Free NGO self-serve path independent of Stripe.

## Pricing / Plan Model Added

Plan keys:

- `free`
- `grassroots`
- `growth`
- `trust_pro`
- `network_custom`

Database tier mapping:

- `free` maps to existing `free_ngo`.
- `network_custom` maps to existing `network`.

Current plan tracking:

- The current NGO plan is derived from `ngo_profiles.tier`.
- Billing status is derived as `free` for the Free plan and `test_mode_placeholder` for paid/custom tiers until live billing is implemented.
- Billing interval is not persisted yet.

## Migrations Applied

No migration was needed.

This slice reuses the existing `ngo_profiles.tier` field and derives billing readiness state from existing NGO profile and usage data.

## Stripe Status

Stripe status: test-mode placeholder.

No production billing was implemented. No real cards can be charged by this slice. No Stripe Checkout session or webhook was added.

The billing page can report whether a test-mode secret key appears configured, but it does not expose secrets and does not require Stripe for the Free path.

## Tests Run

- `npm test` - passed.
- `npm run lint` - passed.
- `npm run build` - passed.

## Live Checks Performed

No live database migration was needed.

This slice was verified locally through source-level tests, lint, and production build. The clean V2 Supabase project remains the target for future live checks:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

The old `mishava / tghbfautnxblfxrtkdqb` project was not touched.

## Known Limitations

- Stripe Checkout is not implemented.
- Stripe webhooks are not implemented.
- Plan selection/change actions are not implemented yet.
- Billing interval is not persisted yet.
- Paid setup service purchase flow is not implemented yet.
- Usage gates rely on server-side app helpers; deeper database-level quota enforcement can be reviewed later if needed.
- Storage allowance is based on active file metadata size, not live object-store measurement.
- Existing data remains readable when limits are reached; new creation is blocked where gates are implemented.

## Remaining Billing / Full-Scale Work

- Add plan selection/change workflow.
- Add Stripe test-mode Checkout session creation.
- Add Stripe webhook handling in test mode.
- Add organization/customer/subscription mapping if production billing becomes ready.
- Add setup service request/purchase flow.
- Add billing support/refund/tax/legal readiness before production charging.
- Add UI for downgrade impact review without deleting data.
- Add admin/support view for billing state and entitlement issues.

## Trust Outcome Confirmation

Payment does not affect trust outcomes.

Plan key, billing status, Stripe subscription status, setup service purchase, and sponsored/network status are forbidden ranking/trust influence fields. Entitlements gate feature volume only and do not affect:

- score;
- ranking;
- verification outcomes;
- evidence truth;
- credibility labels;
- methodology outputs.

## Scope Confirmation

No production billing was implemented.

This slice did not add:

- real charging;
- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI;
- final scoring math;
- public report library;
- invoices/accounting automation;
- refunds;
- tax calculations;
- consumer billing.
