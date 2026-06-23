# Mishava Corporate / Institutional Chat Handoff

Date: 2026-06-23

## Current Status

Corporate/institutional is mostly planned. It should eventually reuse product, supplier, evidence, scoring, and reporting primitives for procurement and vendor review.

## Percent Estimate

- Corporate/institutional foundation: **8-12%**.

## What Is Built

- Reserved surface.
- Evidence/reporting primitives from NGO.
- Product/supplier transparency primitives from Shopping.
- Payment firewall principles.

## What Is Live

- Basic Corporate reserved page/surface only.

## What Is Planned Only

- Institutional dashboards.
- Vendor review.
- Procurement support.
- Audit trails.
- Export/reporting tools.
- Compliance-readiness support.

## What Is Blocked

- Business/Local claim flow not built.
- Product/source review admin not built.
- Final scoring methodology not ready.

## What Must Not Be Touched

- Government authorization/compliance claims.
- Paid trust outcomes.
- Old Supabase and `dsuupr-am`.

## Key Guardrails

- No vendor self-certification as truth.
- No hiding evidence gaps for paying customers.
- Audit trails required for trust-sensitive actions.

## Recommended First 3 Tasks

1. Plan corporate procurement review workspace.
2. Define vendor/product comparison data needs.
3. Plan export and audit-trail requirements.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/compliance/`

## Suggested Opening Message

```text
We are starting the Mishava Corporate/Institutional focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-corporate-chat-handoff.md as source of truth. Focus on procurement/vendor review, dashboards, evidence gaps, audit trails, and exports. Do not add compliance certification claims, paid trust outcomes, or final scores.
```

