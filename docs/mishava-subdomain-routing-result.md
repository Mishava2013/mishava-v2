# Mishava Subdomain Routing Result

## Status

Implemented as routing infrastructure.

## Routes

| Host | Destination |
| --- | --- |
| `mishava.org` | `/shopping` |
| `shopping.mishava.org` | `/shopping` |
| `ngo.mishava.org` | `/ngo` |
| `business.mishava.org` | `/business` |
| `corporate.mishava.org` | `/corporate` |
| `app.mishava.org` | `/app` |
| `support.mishava.org` | `/support` |
| `trust.mishava.org` | `/methodology` |
| `admin.mishava.org` | `/admin` |
| `api.mishava.org` | `/api` |
| `gov.mishava.org` | `/gov` |
| `research.mishava.org` | `/research` |
| `media.mishava.org` | `/research` |

## Behavior

- Root host `mishava.org` rewrites to Shopping.
- Shopping host maps friendly paths like `/products/...` to `/shopping/products/...`.
- NGO host maps friendly paths like `/onboarding` to `/ngo/onboarding`.
- Business, Corporate, App, Admin, API, Gov, and Research hosts map friendly paths to their matching app sections.
- Support and Trust hosts keep existing global legal/support paths available and only rewrite the root.
- Protected `/app`, `/org`, and `/admin` routes still use auth/admin checks.

## Reserved Surfaces Added

- `/corporate`
- `/gov`
- `/research`
- `/api`

These are honest reserved/readiness pages. They do not claim live government, research/media, public API, procurement, compliance, or enterprise certification readiness.

## DNS / Hosting Still Needed

This code does not create DNS records. The following hostnames still need DNS and hosting/platform configuration:

- `mishava.org`
- `shopping.mishava.org`
- `ngo.mishava.org`
- `business.mishava.org`
- `corporate.mishava.org`
- `app.mishava.org`
- `support.mishava.org`
- `trust.mishava.org`
- `admin.mishava.org`
- `api.mishava.org`
- `gov.mishava.org`
- `research.mishava.org`
- `media.mishava.org`

## Scope Confirmation

No new product workflows, scoring logic, billing behavior, Shopping data, NGO evidence/report changes, Business workflows, Gov workflows, Corporate workflows, API integrations, or research/media access controls were added.
