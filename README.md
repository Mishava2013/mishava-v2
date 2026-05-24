# Mishava V2.0

Mishava V2.0 is a trust infrastructure product. It turns evidence into
auditable decision signals for NGO reporting, shopping discovery, business and
local profiles, supplier/seller matching, audit workflows, and future
institutional surfaces.

Core invariant: payment may unlock tools, hosting, reports, team workflows, AI
assistance, verification, and exports. Payment must never improve rank, score,
visibility, or perceived credibility.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current Release 1 Scope

- Foundation routes for Shopping, NGO, Business, Local, Trade / Network, Audit
  / Verification, About, Pricing, Methodology, app workspace, org workspace,
  and admin.
- Mishava V2.0 design system using the approved trust palette.
- Real-data-only shopping states. No seeded products, fake scores, or fake places
  to buy.
- Initial Supabase/Postgres migration for organizations, roles, evidence,
  claims, scoring versions, snapshots, pricing records, feature gates, and
  append-only audit logs.

## Verification

```bash
npm run lint
npm run build
```

## Planning Source

Primary planning lives in:

- `docs/MishavaPlanning_V2.20260524a.md`
- `docs/mishava-v2-milestone-1-build-backlog.md`
- `docs/mishava-gov-product-concept.md`

## Guardrails

- No paid ranking.
- No sponsored placement.
- No commission-based shopping ranking.
- No score improvement without evidence.
- No suppression of weak or negative evidence.
- No fake data or seeded scores.
