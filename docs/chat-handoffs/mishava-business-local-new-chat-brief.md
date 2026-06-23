# Mishava Business / Local / Supplier / Seller New-Chat Brief

Date: June 23, 2026

## Current State

Business / Local / Supplier / Seller is **not pilot ready**. It is a planned Mishava surface with a useful foundation from Shopping, scoring guardrails, and AI-control work.

Current readiness estimate: **17-22% overall**.

Current status by area:

- Business profiles: **12-18%**
- Supplier profiles: **18-25%**
- Seller profiles: **14-20%**
- Local business profiles: **10-16%**
- Claim/ownership flow: **8-14%**
- Evidence submission/review: **20-30%**
- Payment firewall: **85-92%**
- AI guardrails: **80-88%**
- Public pilot readiness: **5-10%**

## What Is Already Useful

1. Business and Local routes exist as reserved public surfaces.
2. A Business profile route exists as a placeholder.
3. Shopping has real seller/place-to-buy data concepts.
4. Shopping has manufacturer/supplier transparency fields.
5. Shopping can distinguish unknown, likely, unverified, and verified supplier/manufacturer confidence.
6. Evidence gaps can be shown without inventing scores.
7. Payment firewall tests strongly block paid ranking, paid verification, affiliate influence, and commission-driven trust outcomes.
8. AI-control foundation blocks AI from final scores, approvals, publishing, verification, and other trust outcomes.

## What Is Missing

Top missing items:

1. Real Business/Supplier/Seller/Local profile data model.
2. Claim request and ownership workflow.
3. Identity, domain, business, local location, and role verification.
4. Business evidence submission and review queue.
5. Supplier-to-seller relationship model.
6. Hosted profile workflow.
7. Public profile pages backed by reviewed data.
8. Correction/dispute flow.
9. Admin review queue and audit logs.
10. Pilot-safe onboarding/copy for business users.

## Product Truth

Business/Local should eventually let a business, supplier, seller, or local store:

- create or claim a profile
- prove who they are
- submit source/evidence information
- connect products, brands, supplier roles, places to buy, and company information
- show what is reviewed, missing, disputed, stale, or pending
- participate without buying trust outcomes

But the current app does **not** yet provide that workflow.

## Guardrails

Preserve these hard rules:

- No fake scores.
- No fake evidence.
- No fake suppliers.
- No fake sellers.
- No fake manufacturers.
- No fake local inventory.
- No paid ranking.
- No paid verification.
- No paid credibility labels.
- No affiliate or commission ranking.
- No AI final trust outcomes.
- No AI supplier or seller approval.
- No payment influence on trust outcomes.
- Missing evidence must remain visible.

## Relationship to Shopping

Shopping is the proving ground. It already models:

- product
- brand
- retailer/place-to-buy
- seller type
- manufacturer
- supplier
- source URLs
- confidence
- evidence gaps
- no-paid-ranking/no-commission labels

Business/Local should turn those loose product-level concepts into profile-level ownership, evidence, and review workflows.

## Relationship to Government and Corporate

Government and Corporate will eventually need vendor/product review, public accountability, procurement support, audit trails, and exportable evidence. Business/Local should become the reviewed company/vendor/supplier identity layer that those surfaces can rely on later.

Do not add Government or Corporate features in the first Business/Local implementation slice.

## Tooling Status

Verification from the audit:

- `npm test`: passed, 176/176.
- Targeted guardrail tests: passed, 48/48.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `supabase migration list --linked`: passed and aligned.
- `npm run lint`: failed due local dependency resolution: `Cannot find module 'fast-glob'` from `@next/eslint-plugin-next`.

Clean up the lint dependency issue before a major Business/Local implementation pass if possible.

## Recommended First Focused Chat Task

**Plan Minimum Business/Supplier/Seller Profile and Claim Flow**

Why this first:

- It defines the safe foundation before adding features.
- It prevents profile, seller, supplier, and manufacturer concepts from being mixed together.
- It protects the no-paid-trust model.
- It gives small businesses a fair future path without allowing paid credibility.

## First Codex Prompt for the New Chat

```text
Plan Mishava Business / Local Minimum Profile and Claim Flow.

Use:
- docs/chat-handoffs/mishava-business-local-deep-current-state-audit.md
- docs/chat-handoffs/mishava-business-local-new-chat-brief.md
- docs/mishava-v2-full-build-roadmap-reset.md
- docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md
- docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md

Do not implement yet.

Goal:
Plan the smallest safe Business/Local/Supplier/Seller profile and claim flow that can support future pilot work without allowing payment, AI, or unreviewed claims to affect trust outcomes.

Scope:
- business profile
- supplier profile
- seller profile
- local business profile
- claim request states
- identity/source evidence requirements
- review workflow
- public display rules
- payment firewall guardrails
- admin/review needs
- tests

Do not build checkout, paid ranking, affiliate logic, local inventory, AI approval, final scores, Government/Corporate surfaces, or broad marketplace features.

Output:
- implementation plan
- data model proposal
- user flow
- admin review flow
- public profile rules
- guardrails
- tests
- non-goals
- acceptance criteria
```

## Ready for New Focused Chat?

Yes. This area is ready for a focused planning chat, but not for implementation without first defining the minimum profile and claim model.

