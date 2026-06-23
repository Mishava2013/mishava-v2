# Mishava Infrastructure / Deployment New-Chat Brief

Date: 2026-06-23

## Purpose

Use this brief to start a focused Mishava Infrastructure / Deployment chat without dragging in product work. Mishava V2 has a clean deployment path now, but needs operational hardening before broad public launch.

## Current Clean Path

- Local repo: `/Users/caitlinferguson/Documents/Mishava V2.0`
- GitHub repo: `Mishava2013/mishava-v2`
- Local branch: `main`
- Local upstream: `mishava-v2-clean/main`
- Old remote still present: `origin = https://github.com/Mishava2013/dsuupr-am.git`
- Vercel project: `mishava-v2`
- Local `.vercel/project.json`: points to `mishava-v2`
- Clean Supabase: `mishava-v2-dev / snnscnodegbyqexnopvf`
- Old Supabase: `mishava / tghbfautnxblfxrtkdqb` - do not touch

## Current Live Status

Verified during the infrastructure audit:

| Route | Status |
| --- | --- |
| `https://shopping.mishava.org` | `HTTP 200`, matched to `/shopping` |
| `https://shopping.mishava.org/shopping` | `HTTP 200` |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | `HTTP 200` |
| `https://ngo.mishava.org` | `HTTP 200`, matched to `/ngo` |

## Current Percent Estimates

| Area | Estimate |
| --- | ---: |
| Overall infrastructure/deployment readiness | 78-82% |
| Clean GitHub readiness | 90-94% |
| Clean Vercel readiness | 84-88% |
| Domain/DNS clarity | 62-70% |
| Supabase project readiness | 78-84% |
| Environment variable readiness | 62-70% |
| Local development safety | 84-88% |
| Deployment workflow readiness | 62-68% |
| Rollback readiness | 40-50% |
| CI/tooling readiness | 48-56% |
| Monitoring/logging readiness | 20-30% |
| Backup/restore readiness | 20-30% |
| Public launch infrastructure readiness | 42-50% |

## What Is Done

1. Clean GitHub repo exists and is the correct target.
2. Clean Vercel project exists and local project linkage points to it.
3. Local branch is `main` with upstream `mishava-v2-clean/main`.
4. Shopping is live on `shopping.mishava.org`.
5. NGO route is live on `ngo.mishava.org`.
6. Supabase migrations are linked and aligned with the clean V2 project.
7. `.env.local`, `.vercel/`, `.next/`, and `screenshots/` are ignored.
8. Dsuupr/old Supabase separation has been documented.

## What Is Still Missing

1. Full domain ownership and live route matrix for every Mishava domain/subdomain.
2. Vercel environment variable audit without printing secrets.
3. Formal deployment and rollback runbook.
4. Production monitoring/alerting setup.
5. Backup/restore drill proof.
6. CI or repeatable check policy.
7. Tooling-only lint dependency fix for missing `fast-glob`.
8. Real NGO email/Auth inbox verification.
9. Clean Supabase security advisor/RLS review.
10. Old `origin` remote cleanup decision.

## Verification Snapshot

Latest audit checks:

- `npm test`: pass, `176/176`
- `npm run typecheck`: pass
- `npm run build`: pass
- `supabase migration list --linked`: pass
- `npm run lint`: fail due missing `fast-glob` required by `@next/eslint-plugin-next`

Lint failure text:

```text
Error: Cannot find module 'fast-glob'
Require stack:
- node_modules/@next/eslint-plugin-next/dist/utils/get-root-dirs.js
```

Treat the lint issue as tooling-only. Do not mix it with product work.

## Guardrails For The Next Chat

Do not:

- change DNS;
- move domains;
- deploy unless explicitly asked;
- touch `dsuupr-am`;
- touch old Supabase `tghbfautnxblfxrtkdqb`;
- print secrets;
- add products;
- add migrations;
- add product features;
- enable AI provider calls;
- change payment/Stripe behavior.

Always:

- confirm branch/upstream before pushing;
- use `mishava-v2-clean/main`;
- verify `.vercel/project.json` before any local Vercel command;
- report env values only as `SET`, `MISSING`, `POINTS TO CLEAN V2`, `POINTS TO OLD MISHAVA`, `POINTS TO DSUUPR`, or `UNKNOWN`.

## Recommended First Task

Run a read-only clean domain ownership and live route verification matrix.

Why this first:

- Shopping and NGO work, but the complete domain map is still not formally current.
- The app has routing support for many subdomains, but DNS/Vercel ownership and live status need a single source of truth.
- This reduces the chance of another `dsuupr-am` or stale-domain confusion before more pilots.

## First Prompt To Use

```text
Run Mishava V2 clean domain ownership and live route verification matrix.

Do not change DNS.
Do not move domains.
Do not deploy.
Do not add features.
Do not add products.
Do not add migrations.
Do not touch dsuupr-am.
Do not touch old Supabase.
Do not print secrets.

Use:
- docs/chat-handoffs/mishava-infrastructure-deployment-deep-current-state-audit.md
- docs/chat-handoffs/mishava-infrastructure-deployment-new-chat-brief.md
- docs/mishava-v2-local-repo-vercel-alignment-cleanup-result.md
- docs/mishava-v2-shopping-domain-cutover-result.md

Goal:
Create a current domain ownership table for every Mishava domain and subdomain, showing DNS/live HTTP status, intended route, Vercel project ownership if safely inspectable, whether it should be served by mishava-v2, and whether it is ready, reserved, stale, or needs manual dashboard review.

Run read-only checks only and create:
docs/mishava-v2-clean-domain-ownership-live-route-matrix.md

Commit only that document.
```

## Ready For New Focused Chat?

Yes. Infrastructure/deployment is ready for a focused follow-up chat, as long as the next chat stays read-only unless Jos explicitly authorizes DNS, Vercel, env, or deployment changes.
