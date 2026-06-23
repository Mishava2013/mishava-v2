# Mishava Government New-Chat Brief

Date: 2026-06-23

## Short Current Status

Mishava Government is a future public-sector surface. It is not a live product.

Current Government state:

- Reserved `/gov` page exists.
- `gov.mishava.org` is supported by subdomain routing.
- The page explicitly says Government is not live for government use.
- `organization_type` includes `gov`, but there are no Gov-specific agency/procurement tables.
- A planning concept exists in `docs/mishava-gov-product-concept.md`.
- Related foundations exist in Business/Local planning, Shopping supplier transparency, NGO evidence/reporting, Scoring/Trust, Research/Evidence, Admin/Ops, AI guardrails, and payment firewall.

Government should not be treated as an implementation target yet. NGO and Shopping are much closer.

## Percent Estimates

| Area | Estimate |
| --- | ---: |
| Overall Government readiness | 6-9% |
| Government concept readiness | 35-45% |
| Public procurement support readiness | 5-8% |
| Vendor review readiness | 10-15% |
| Public accountability/reporting readiness | 4-8% |
| Business/Supplier dependency readiness | 15-20% |
| Scoring/Trust dependency readiness | 48-53% |
| Research/Evidence dependency readiness | 50-55% |
| Admin/Ops/Compliance dependency readiness | 48-53% |
| Legal/compliance readiness | 20-28% |
| Security/privacy readiness | 35-45% |
| Public launch readiness | 2-5% |

## What The New Chat Should Focus On

The new Government chat should focus on planning:

- concept clarity;
- dependency map;
- first safe use case;
- user groups;
- public-sector guardrails;
- procurement evidence packet model;
- vendor correction/dispute requirements;
- what must mature first in Business/Local, Research/Evidence, Scoring/Trust, and Admin/Ops.

## What The New Chat Should Not Touch

Do not:

- implement Government product features;
- add routes;
- add migrations;
- add agency/procurement tables;
- add vendor profiles;
- add fake evidence;
- add fake scores;
- add public procurement conclusions;
- add payment/Stripe work;
- add AI provider calls;
- change DNS/domains;
- change Vercel;
- change Supabase;
- touch `dsuupr-am`;
- touch old Supabase `tghbfautnxblfxrtkdqb`.

## First Recommended Task

**Create Mishava Government Concept Brief and Dependency Map**

Why this first:

- Government is too early for implementation.
- The current concept is promising but broad.
- A focused brief will prevent premature agency/product claims.
- The dependency map will show what Business/Local, Research/Evidence, Scoring/Trust, Admin/Ops, Compliance, and Infrastructure must finish before Government can become real.

## Key Guardrails

- No FedRAMP claims.
- No government authorization claims.
- No procurement certification claims.
- No automatic vendor approval/rejection.
- No public red flags without reviewed source, legal/correction path, and human review.
- No final scores until reviewed evidence and approved methodology exist.
- Evidence gaps remain visible.
- Payment cannot influence public-sector trust outcomes, vendor ranking, verification, evidence truth, or credibility labels.
- AI can suggest; humans decide.
- Missing supplier/manufacturer/vendor evidence should remain a visible gap.

## Key Docs

- `docs/chat-handoffs/mishava-government-deep-current-state-audit.md`
- `docs/mishava-gov-product-concept.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/chat-handoffs/mishava-business-local-chat-handoff.md`
- `docs/chat-handoffs/mishava-corporate-chat-handoff.md`
- `docs/chat-handoffs/mishava-scoring-trust-chat-handoff.md`
- `docs/chat-handoffs/mishava-research-evidence-chat-handoff.md`
- `docs/chat-handoffs/mishava-admin-ops-compliance-chat-handoff.md`
- `docs/mishava-ai-minimize-architecture-direction.md`
- `docs/mishava-ai-control-enforcement-result.md`

## Suggested Opening Message For New Chat

```text
We are starting a focused Mishava Government planning chat. Use docs/chat-handoffs/mishava-government-deep-current-state-audit.md and docs/chat-handoffs/mishava-government-new-chat-brief.md as the current source of truth.

Government is a future public-sector surface, not a live product. Keep the work planning-first: procurement transparency, vendor evidence, public accountability, correction/dispute requirements, and dependency mapping. Do not implement Government features, add migrations, add fake vendor data, create scores, make government authorization/FedRAMP/procurement certification claims, add payment influence, or enable AI provider calls.
```

## Suggested First Codex Prompt

```text
Create Mishava Government Concept Brief and Dependency Map.

Do not implement product features.
Do not add routes, tables, migrations, products, scores, vendor profiles, procurement workflows, payment, AI provider calls, or public government claims.
Do not touch DNS, Vercel, Supabase, dsuupr-am, or old Supabase.

Use:
- docs/chat-handoffs/mishava-government-deep-current-state-audit.md
- docs/chat-handoffs/mishava-government-new-chat-brief.md
- docs/mishava-gov-product-concept.md
- docs/mishava-v2-current-state-category-review.md

Create:
docs/mishava-government-concept-brief-dependency-map.md

Include:
- one-page Government concept summary;
- intended user groups;
- first safe use-case sequence;
- dependency map across Business/Local, Research/Evidence, Scoring/Trust, Admin/Ops, Compliance, and Infrastructure;
- what can be discussed in exploratory agency conversations;
- what must not be claimed;
- first three future implementation slices, planning only;
- acceptance criteria for when Government can move from concept to design.

Commit only the planning document.
```

## Ready For New Focused Chat?

Yes. Government is ready for a focused planning chat. It is not ready for a product implementation chat, agency pilot, public launch, or procurement-facing claims.
