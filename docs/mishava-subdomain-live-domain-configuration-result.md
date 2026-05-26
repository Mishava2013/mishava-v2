# Mishava Subdomain Live Domain Configuration Result

## Status

The app-side subdomain routing was already implemented, but the live domains were not working because the DNS/hosting side had not been completed.

This pass attached the requested Mishava hostnames to the Vercel project:

- Project: `dsuupr-am`
- Vercel account/team: `mishava2013s-projects`
- Current live Vercel URL: `https://dsuupr-am.vercel.app`

No product features were added. No Supabase migrations were touched. The old Supabase project was not touched.

## Vercel Domains Added

Added to the Vercel project:

- `mishava.org`
- `www.mishava.org`
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

## App Routing Already Present

The app-side host routing maps:

| Host | App destination |
| --- | --- |
| `mishava.org` | `/shopping` |
| `www.mishava.org` | `/shopping` |
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

Protected routes still rely on auth/admin checks. `admin.mishava.org` routes to `/admin`, but non-admin users remain blocked.

## DNS Status

Current authoritative nameservers:

```text
dion.ns.cloudflare.com
saanvi.ns.cloudflare.com
```

That means DNS must be changed in Cloudflare, not in Vercel DNS.

Current DNS check:

- `mishava.org` currently resolves to Cloudflare proxy IPs:
  - `104.21.33.81`
  - `172.67.160.125`
- `shopping.mishava.org` currently has no A or CNAME record.

This is why the live Mishava domains do not work yet even though Vercel has the domains attached.

## Required Cloudflare DNS Records

Vercel CLI requested the following DNS target for each host:

```text
76.76.21.21
```

Add or update these records in Cloudflare:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| A | `www` | `76.76.21.21` |
| A | `shopping` | `76.76.21.21` |
| A | `ngo` | `76.76.21.21` |
| A | `business` | `76.76.21.21` |
| A | `corporate` | `76.76.21.21` |
| A | `app` | `76.76.21.21` |
| A | `support` | `76.76.21.21` |
| A | `trust` | `76.76.21.21` |
| A | `admin` | `76.76.21.21` |
| A | `api` | `76.76.21.21` |
| A | `gov` | `76.76.21.21` |
| A | `research` | `76.76.21.21` |
| A | `media` | `76.76.21.21` |

Recommendation:

- Use DNS-only mode for these Cloudflare records until Vercel verifies the domains and certificates.
- After verification, Cloudflare proxy mode can be reviewed carefully if desired.

## Verification Needed After DNS

After Cloudflare DNS records are updated and propagation completes, verify:

```bash
dig +short A mishava.org
dig +short A shopping.mishava.org
dig +short A ngo.mishava.org
dig +short A app.mishava.org
```

Expected:

```text
76.76.21.21
```

Then verify browser/live behavior:

- `https://mishava.org` opens Shopping.
- `https://shopping.mishava.org` opens Shopping.
- `https://ngo.mishava.org` opens NGO.
- `https://business.mishava.org` opens Business/local.
- `https://corporate.mishava.org` opens Corporate reserved page.
- `https://app.mishava.org` opens the logged-in app route or sign-in gate.
- `https://support.mishava.org` opens Support.
- `https://trust.mishava.org` opens methodology/trust transparency.
- `https://admin.mishava.org` requires admin access.
- `https://api.mishava.org` opens the future API placeholder.
- `https://gov.mishava.org` opens the reserved Gov placeholder.
- `https://research.mishava.org` opens Research.
- `https://media.mishava.org` opens Research/media.

## Known Limitation

Codex could attach the domains to Vercel, but could not update Cloudflare DNS records from this environment because no Cloudflare DNS API access or dashboard session was available.

The remaining blocker is manual Cloudflare DNS configuration.
