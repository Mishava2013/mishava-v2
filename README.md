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

## Release 2.5 Functional Foundation Cleanup

Release 2.5 turns the static scaffold into the first database-backed product
slice:

- `/app`, `/org/*`, and `/admin/*` are protected by middleware and server layouts.
- Org routes require a current organization context and membership.
- Admin routes require Mishava admin, methodology owner, or support role.
- NGO onboarding can create an organization, initial membership, NGO profile,
  and audit event through a server action.
- Manual evidence entry can create an evidence item, optional NGO evidence
  submission, and audit event through a server action.
- Score snapshot public visibility now requires both publication and public
  visibility.

The current auth layer is an abstraction around a signed/session cookie shape so
we can wire the final auth provider without rewriting route permissions.

## Release 4 Shopping POC

Release 4 adds database-backed shopping foundations without fake product data:

- Public `/shopping` reads active product records from `shopping_products`.
- Product detail pages read `shopping_places_to_buy` for seller and fulfillment
  records.
- Products can only show an evidence score when linked to a published score
  snapshot.
- `/app/shopping-priorities` saves starter priority answers and the five
  automatic-zero Off / Warn me / Hide settings for authenticated users.
- Shopping remains non-commission based, and payment fields remain excluded from
  ranking.

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
