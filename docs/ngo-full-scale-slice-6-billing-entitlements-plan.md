# NGO Full-Scale Slice 6 Plan: Billing, Plans, and Entitlements

Status: planning only. Do not implement from this document directly.

## Purpose

Plan NGO billing, plan display, and entitlement enforcement for full-scale NGO readiness.

This slice should prepare Mishava NGO to show locked NGO pricing, support a free/self-serve path, and enforce feature limits without allowing payment to affect trust outcomes.

## Source Of Truth

- `docs/ngo-full-scale-readiness-gap-plan.md`
- `docs/ngo-full-scale-slice-5-report-output-result.md`
- `docs/ngo-full-scale-slice-4-evidence-files-result.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`

## Goal

Create a narrow implementation plan for NGO plans, billing readiness, entitlement limits, and Stripe test-mode planning.

The first implementation should make `/org/billing` truthful and useful:

- show the current NGO plan;
- show usage against feature limits;
- show upgrade options;
- preserve the free self-serve path;
- keep Stripe in test mode;
- prove plan/payment status never affects scoring, ranking, verification outcomes, evidence truth, or credibility labels.

## Scope

In scope:

- NGO plan definitions;
- NGO plan display;
- feature entitlement limits;
- safe limit messaging;
- Stripe test-mode planning;
- setup-service planning;
- audit-event planning;
- no-paid-ranking/no-paid-score language.

Out of scope:

- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- AI;
- final scoring math;
- public report library;
- live production billing;
- production tax/refund/accounting automation.

## Locked NGO Pricing

| Plan | Monthly | Annual | Setup |
| --- | ---: | ---: | --- |
| Free NGO Profile | $0 | $0 | $0 self-serve |
| Grassroots | $19/month | $190/year | $0 self-serve |
| Growth | $59/month | $590/year | $0 self-serve or paid setup |
| Trust Pro | $129/month | $1,290/year | Paid setup recommended |
| Network / Foundation / Association | Custom | Custom | Custom |

Setup options:

| Setup option | Price | Notes |
| --- | ---: | --- |
| Self-Serve Setup | $0 | NGO enters its own information |
| Basic Assisted Setup | $99 | Light help getting started |
| Guided Evidence Setup | $249 | Help organizing evidence |
| Full Trust Profile Buildout | $499+ | More hands-on buildout |
| Network Setup | Custom | Foundations, associations, denominations, or multi-NGO programs |

Important pricing rule:

NGO pricing should remain accessible. Free and Grassroots tiers should stay mostly self-serve. Growth should be treated as the main paid NGO plan. Trust Pro can include deeper workflows, reporting, and stronger evidence capacity. Network/Foundation/Association pricing should be modeled separately from individual NGO pricing.

## 1. Plan Model

Recommended plan codes:

- `free_ngo`
- `grassroots`
- `growth`
- `trust_pro`
- `network`

Recommended setup service codes:

- `self_serve_setup`
- `basic_assisted_setup`
- `guided_evidence_setup`
- `full_trust_profile_buildout`
- `network_setup`

Recommended plan fields:

- plan code;
- display name;
- monthly price;
- annual price;
- setup recommendation;
- active flag;
- Stripe test product id later;
- Stripe test monthly price id later;
- Stripe test annual price id later;
- custom pricing flag;
- self-serve allowed flag;
- recommended flag.

Initial plan descriptions:

- Free NGO Profile: basic NGO profile, limited manual evidence, limited premade reporting, no paid AI-heavy workflows.
- Grassroots: low-cost access for small NGOs that need more evidence/report capacity but still mostly self-serve.
- Growth: main paid NGO plan for organizations that need funder reporting, scoped sharing, and practical evidence/report workflows.
- Trust Pro: deeper reporting, stronger evidence workflow, more team capacity, and setup support recommended.
- Network/Foundation/Association: multi-organization programs, sponsored seats, portfolio reporting, and custom setup.

## 2. Entitlements

Entitlements are feature and capacity limits only. They must not affect:

- trust scores;
- scoring math;
- rankings;
- verification status;
- credibility labels;
- evidence truth;
- evidence review outcomes;
- public score presentation;
- dispute/correction outcomes.

Recommended first-pass entitlement matrix:

| Entitlement | Free | Grassroots | Growth | Trust Pro | Network |
| --- | ---: | ---: | ---: | ---: | --- |
| Evidence items | 25 | 100 | 500 | 2,000 | Custom |
| Active private files | 10 | 50 | 250 | 1,000 | Custom |
| Storage allowance | 100 MB | 1 GB | 10 GB | 50 GB | Custom |
| Draft reports | 3 | 15 | 75 | 250 | Custom |
| Active share grants | 1 | 5 | 25 | 100 | Custom |
| Team members | 1 | 3 | 10 | 25 | Custom |
| Report templates | Basic | Basic | Basic + funder | Advanced | Custom |
| Print-friendly reports | Included | Included | Included | Included | Included |
| PDF/CSV/DOCX exports later | Not included | Limited | Included | Advanced | Custom |
| Assisted setup | Add-on | Add-on | Add-on | Recommended add-on | Custom |
| AI-assisted report rebuilding later | Not included | Limited/paid credits | Paid credits/included quota | Larger quota | Custom |

These numbers are planning defaults and should be reviewed before implementation.

Feature gate examples:

- Can create evidence if under evidence item limit.
- Can upload files if under active-file and storage allowance limits.
- Can create reports if under draft report limit.
- Can create share grants if under active share-grant limit.
- Can invite team members if under team-member limit.
- Can access advanced/funder templates if plan allows.

Rules:

- Reaching a limit should show an upgrade prompt.
- Downgrades should not delete existing evidence, reports, files, members, or share grants.
- Existing data should remain readable after downgrade.
- New creation can be paused or restricted when over limit.
- A downgraded org should be guided to archive/remove capacity voluntarily or upgrade.
- Payment must not unlock better score treatment or ranking placement.

## 3. Billing Flow

Planned flow:

1. NGO starts on Free by default after onboarding.
2. `/org/billing` shows current plan and usage.
3. User can compare Grassroots, Growth, Trust Pro, and Network.
4. User can choose monthly or annual pricing.
5. Paid plan selection starts Stripe Checkout in test mode in a later implementation.
6. Custom Network/Foundation/Association plan routes to a contact/request path.
7. Setup services are shown as optional add-ons but purchased later in a separate flow.

Onboarding plan selection:

- Do not require payment to complete NGO onboarding.
- Default to Free NGO Profile.
- Show plan selection after onboarding as a next step or from `/org/billing`.
- Keep self-serve Free path working even if Stripe is not configured.

Upgrade/downgrade:

- Upgrade should immediately update entitlement access once billing state is confirmed.
- Downgrade should preserve existing data.
- Downgrade should restrict new creation only when over new limits.
- Downgrade should never alter trust/scoring/ranking outcomes.

Annual/monthly:

- Annual pricing should be visible from the start.
- Billing interval should not affect trust outcomes.

## 4. Billing Page

`/org/billing` should show:

- current plan;
- current billing status;
- usage vs limits;
- upgrade options;
- monthly and annual prices;
- setup service options;
- custom plan contact path;
- no-paid-ranking/no-paid-score language.

Recommended usage cards:

- Evidence items used / limit.
- Private files used / limit.
- Storage used / allowance.
- Reports used / limit.
- Active share grants used / limit.
- Team members used / limit.

Required copy:

> Payment unlocks workflow capacity, support, setup services, and reporting tools. Payment does not affect Mishava trust scores, rankings, verification outcomes, evidence truth, or public trust display.

Billing status labels:

- Free
- Trial/test mode
- Active
- Past due
- Canceled
- Custom
- Sponsored/network-covered

## 5. Enforcement

Entitlement checks should be server-side.

Recommended enforcement points:

- evidence creation;
- evidence file upload;
- report creation;
- share grant creation;
- team invite creation;
- future export generation;
- future AI-assisted report rebuilding.

Do not enforce by hiding UI alone.

Safe enforcement behavior:

- allow reading existing data;
- block new creation when over limit;
- show a clear reason;
- show current usage and limit;
- link to billing/upgrade;
- do not delete or hide historical data;
- do not change evidence review status;
- do not change score/rank.

Recommended helper shape:

```ts
type NgoPlanCode =
  | "free_ngo"
  | "grassroots"
  | "growth"
  | "trust_pro"
  | "network";

type NgoEntitlementCheck =
  | "evidence_item_create"
  | "evidence_file_upload"
  | "report_create"
  | "share_grant_create"
  | "team_member_invite"
  | "report_export_generate"
  | "ai_report_assist";
```

The helper should return:

- allowed;
- plan code;
- usage;
- limit;
- message;
- upgrade suggestion if blocked.

## 6. Stripe / Test Mode

Stripe should start in test mode only.

Plan:

- create Stripe products/prices for Grassroots, Growth, and Trust Pro in test mode;
- map Stripe customer to organization;
- map Stripe subscription to organization plan;
- keep Free path independent of Stripe;
- keep Network/Foundation/Association as custom/manual request at first;
- avoid storing raw card data;
- minimize PCI scope through Stripe-hosted Checkout;
- use webhooks later for subscription state.

Future Stripe objects:

- customer;
- checkout session;
- subscription;
- price;
- product;
- setup service payment link or checkout item later.

Webhook events to plan later:

- checkout session completed;
- customer subscription created;
- customer subscription updated;
- customer subscription deleted/canceled;
- invoice payment failed;
- invoice paid.

Important:

Do not wire production billing until legal/support/refund/tax readiness is reviewed.

## 7. Audit Events

Planned audit events:

- `ngo_plan.selected`
- `ngo_plan.changed`
- `ngo_billing.checkout_started`
- `ngo_billing.checkout_completed` later
- `ngo_billing.subscription_updated` later
- `ngo_entitlement.limit_reached`
- `ngo_setup_service.requested`

Audit metadata should include:

- organization id;
- actor user id;
- previous plan;
- new plan;
- billing interval;
- Stripe customer/subscription ids only when needed;
- entitlement checked;
- usage and limit;
- whether the action was blocked.

Do not log raw card data or sensitive payment details.

## 8. Tests Required

Plan tests:

- Free plan limits apply.
- Growth plan limits apply.
- Plan upgrade changes entitlement access.
- Downgrade does not delete data.
- Downgrade preserves read access to existing evidence/reports/files.
- Plan status does not affect scoring.
- Plan status does not affect ranking.
- Payment firewall tests still pass.
- Billing page does not expose secrets.
- Stripe is not required for Free path.
- Entitlement limits are enforced server-side.
- Team/evidence/report/share tests still pass.
- Build/lint/test pass.

Payment firewall tests should explicitly prove these fields do not affect score or rank:

- plan code;
- billing status;
- Stripe subscription status;
- setup service purchase;
- sponsored/network-covered status.

## 9. Non-Goals

Exclude from this slice:

- live production billing;
- invoices/accounting automation;
- refunds;
- tax calculations;
- full Stripe webhook production hardening;
- Plus consumer billing;
- Shopping monetization;
- Business billing;
- Corporate billing;
- Gov procurement billing;
- final scoring math;
- public report library;
- AI credit billing implementation.

## 10. Acceptance Criteria

Slice 6 can be implemented only if:

- pricing matches locked NGO pricing;
- Free NGO self-serve path works without Stripe;
- entitlements are feature limits only;
- trust outcomes are not affected by plan or payment;
- Stripe remains test-mode until production legal/support is ready;
- existing NGO evidence/report/share/team workflows keep working;
- data is not deleted on downgrade;
- server-side checks enforce limits;
- payment firewall tests pass;
- no unrelated product surfaces are added.

## Recommended Build Order

1. Add plan/entitlement constants and helper functions.
2. Update `/org/billing` to show current plan, usage, limits, and locked pricing.
3. Add entitlement checks for new evidence/report/share/team creation only.
4. Add friendly limit-reached messages and upgrade prompts.
5. Add audit events for limit-reached and plan-selection actions.
6. Add Stripe test-mode planning fields but keep checkout disabled until the next implementation slice.
7. Extend payment firewall tests to include NGO plan/billing fields.

## Planning Status

This document is a planning artifact only. No billing code, Stripe integration, database changes, entitlement checks, or UI changes are implemented by this document.
