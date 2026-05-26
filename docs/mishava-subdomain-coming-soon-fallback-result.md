# Mishava Subdomain Coming Soon Fallback Result

## What Changed

The app already had host/subdomain routing, but several requested hosts pointed to product areas that are not fully live yet. This pass keeps working surfaces routed normally and gives not-ready surfaces honest Coming Soon pages instead of overclaiming.

## Working / Protected Surfaces Kept

- `mishava.org` -> Shopping
- `www.mishava.org` -> Shopping
- `shopping.mishava.org` -> Shopping
- `ngo.mishava.org` -> NGO
- `app.mishava.org` -> logged-in app / sign-in gate
- `support.mishava.org` -> Support
- `trust.mishava.org` -> methodology / trust transparency
- `admin.mishava.org` -> internal admin route with admin protection

## Coming Soon / Reserved Surfaces

- `business.mishava.org` -> Business/local Coming Soon
- `corporate.mishava.org` -> Corporate Coming Soon
- `api.mishava.org` -> Public API Coming Soon
- `gov.mishava.org` -> Government/public-sector Coming Soon
- `research.mishava.org` -> Research Coming Soon
- `media.mishava.org` -> Media Coming Soon

## Guardrails

- Coming Soon pages do not claim live product readiness.
- Coming Soon pages do not claim SOC 2, ISO, FedRAMP, ADA, VPAT, or public API readiness.
- Payment, hosting, setup, support, access, sponsorship, or workflow tools cannot buy better scores, rankings, verification labels, evidence treatment, or methodology outputs.
- No DNS, Vercel, Supabase, migration, or old Supabase project changes were made in this pass.

## Remaining Live-Domain Blocker

Cloudflare DNS still needs to point the requested hostnames to Vercel before the public domains work online.

Use DNS-only records initially:

```text
@          76.76.21.21
www        76.76.21.21
shopping   76.76.21.21
ngo        76.76.21.21
business   76.76.21.21
corporate  76.76.21.21
app        76.76.21.21
support    76.76.21.21
trust      76.76.21.21
admin      76.76.21.21
api        76.76.21.21
gov        76.76.21.21
research   76.76.21.21
media      76.76.21.21
```

## Tests Run

- `npm run typecheck` - passed
- `npm run lint` - passed
- `npm test` - passed, 141/141
- `npm run build` - passed

## Scope Confirmation

- No product features were added.
- No migrations were touched.
- Old Supabase project was not touched.
