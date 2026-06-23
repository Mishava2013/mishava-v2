# Mishava Infrastructure / Deployment Deep Current-State Audit

Date: 2026-06-23

## 1. Executive Summary

Mishava V2 has a clean working deployment path, but the infrastructure layer is still better described as pilot-ready than public-launch-ready.

The clean production path is now:

- GitHub repo: `Mishava2013/mishava-v2`
- Vercel project: `mishava-v2`
- Local branch: `main`
- Local upstream: `mishava-v2-clean/main`
- Local Vercel project link: `mishava-v2`
- Clean Supabase project: `mishava-v2-dev / snnscnodegbyqexnopvf`
- Live Shopping domain: `https://shopping.mishava.org`

The historical `dsuupr-am` confusion is now documented and mostly contained. The old `origin` remote still points to `Mishava2013/dsuupr-am`, so future agents must avoid pushing or deploying through that path unless Jos explicitly approves it. The old Supabase project `mishava / tghbfautnxblfxrtkdqb` must not be touched.

Current infrastructure strength is good enough for controlled pilots and guided verification. It is not yet mature enough for broad public launch because the project still needs a complete domain ownership table, formal deployment/rollback runbook, production monitoring, backup/restore proof, Vercel environment dashboard audit, and a CI/check policy.

## 2. Percent Estimates

| Area | Estimate | Notes |
| --- | ---: | --- |
| Overall infrastructure/deployment readiness | 78-82% | Clean path exists and live routes work; operational runbooks and monitoring remain thin. |
| Clean GitHub readiness | 90-94% | Clean repo, `main`, upstream, and history are aligned. Old `origin` remains as a caution. |
| Clean Vercel readiness | 84-88% | Local project link points to `mishava-v2`; live Shopping and NGO respond. Full dashboard/env audit still needed. |
| Domain/DNS clarity | 62-70% | Shopping is live and root routing exists; full domain ownership table is still missing. |
| Supabase project readiness | 78-84% | Linked to clean V2 project and migrations are aligned. Real auth/email verification remains operational work. |
| Environment variable readiness | 62-70% | Required vars are documented; live app works, but Vercel dashboard SET/MISSING/target audit is still needed. |
| Local development safety | 84-88% | Local branch/upstream/Vercel link are clean; old `origin` remains. |
| Deployment workflow readiness | 62-68% | Git/Vercel path works, but formal release and rollback checklist is incomplete. |
| Rollback readiness | 40-50% | Vercel rollback is available in principle, but no Mishava-specific rollback drill/runbook is proven. |
| CI/tooling readiness | 48-56% | Tests/typecheck/build pass locally; no `.github` workflows found; lint currently fails due missing `fast-glob`. |
| Monitoring/logging readiness | 20-30% | Vercel/Supabase logs exist, but no formal alerts or on-call workflow are documented. |
| Backup/restore readiness | 20-30% | No restore drill proof found. |
| Public launch infrastructure readiness | 42-50% | Good pilot base; missing ops controls block public-scale confidence. |

## 3. GitHub / Repo Status

Current local path:

`/Users/caitlinferguson/Documents/Mishava V2.0`

Current observed state:

| Item | Status |
| --- | --- |
| Local branch | `main` |
| Current commit at audit | `d960635264ebe3fad85ef6efce9d1e8945065827` |
| Upstream | `mishava-v2-clean/main` |
| Clean remote | `mishava-v2-clean = https://github.com/Mishava2013/mishava-v2.git` |
| Old remote | `origin = https://github.com/Mishava2013/dsuupr-am.git` |
| Working tree before docs | Clean |

The repo is the active Mishava V2 codebase. It contains Mishava Shopping, NGO, subdomain routing, Supabase migrations, legal/trust pages, AI-control guardrails, and operational docs.

Risk:

- The old `origin` remote is still present.
- Future agents could accidentally push to `origin` if they do not inspect remotes.

Recommendation:

- Keep using `mishava-v2-clean/main`.
- Later, after explicit approval, rename remotes so the clean Mishava repo becomes `origin` and the old dsuupr-named remote becomes `dsuupr-am-legacy` or is removed.

## 4. Vercel Project Status

Local `.vercel/project.json` currently points to:

```json
{"projectId":"prj_nAA7eocEDLviT7sn6dZAc3BMbDQp","orgId":"team_AQ4nC6Eu6llPwPfeMeeh7JNC","projectName":"mishava-v2"}
```

This means local Vercel commands from this folder should target `mishava-v2`, not `dsuupr-am`, assuming the local ignored `.vercel/` folder remains intact.

Confirmed from prior docs and current checks:

- Clean Vercel project exists: `mishava-v2`.
- Shopping is live on the clean path.
- `https://shopping.mishava.org` returns `HTTP 200` and matches `/shopping`.
- `https://shopping.mishava.org/shopping` returns `HTTP 200`.
- `https://shopping.mishava.org/shopping/categories/toilet-paper` returns `HTTP 200`.
- `https://ngo.mishava.org` returns `HTTP 200` and matches `/ngo`.

Remaining need:

- Vercel dashboard audit for connected Git repo, production branch, current production deployment commit, env variable presence, and all attached domains.

## 5. Dsuupr Separation

The earlier confusing setup placed Mishava V2 work inside dsuupr-named GitHub/Vercel surfaces. That has been corrected for the clean path, but old references still exist.

Current separation status:

| Surface | Current status |
| --- | --- |
| Clean Mishava GitHub | `Mishava2013/mishava-v2` |
| Clean Mishava Vercel | `mishava-v2` |
| Old local `origin` | Still points to `Mishava2013/dsuupr-am` |
| Old `dsuupr-am` Vercel | Must not be touched unless explicitly approved |
| Dsuupr production | Out of scope; do not change from this repo |

Risk level:

- Confusing-but-contained.
- Safe for controlled Mishava work if agents check branch, upstream, and Vercel link before pushing/deploying.
- Unsafe for rushed domain/env work without dashboard confirmation.

## 6. Domain / DNS Inventory

Current known working routes:

| Domain / route | Status | Notes |
| --- | --- | --- |
| `https://shopping.mishava.org` | Pass, `HTTP 200` | `x-matched-path: /shopping` |
| `https://shopping.mishava.org/shopping` | Pass, `HTTP 200` | Shopping route |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | Pass, `HTTP 200` | Toilet paper category |
| `https://ngo.mishava.org` | Pass, `HTTP 200` | `x-matched-path: /ngo` |

Routing code supports:

- `mishava.org` and `www.mishava.org` to `/shopping`
- `shopping.mishava.org` to `/shopping`
- `ngo.mishava.org` to `/ngo`
- `business.mishava.org` to `/business`
- `corporate.mishava.org` to `/corporate`
- `app.mishava.org` to `/app`
- `support.mishava.org` to `/support`
- `trust.mishava.org` to `/methodology`
- `admin.mishava.org` to `/admin`
- `api.mishava.org` to `/api`
- `gov.mishava.org` to `/gov`
- `research.mishava.org` to `/research`
- `media.mishava.org` to `/media`

Missing:

- A single current domain ownership table that shows each domain, DNS provider status, Vercel project ownership, intended route, live HTTP status, and whether it is pilot-ready.

## 7. Supabase Status

Clean project:

- Project name: `mishava-v2-dev`
- Project ref: `snnscnodegbyqexnopvf`

Old project:

- Project name: `mishava`
- Project ref: `tghbfautnxblfxrtkdqb`
- Status: do not touch.

Current verification:

- `supabase migration list --linked` passed.
- Local and remote migrations are aligned through `202605260009`.
- `supabase/.temp/` exists locally and remains ignored.

Remaining operational work:

- Real auth/email inbox tests.
- Backup and restore drill.
- RLS/security advisor review for the clean project.
- Do not act on old-project warnings from `tghbfautnxblfxrtkdqb` except to document that it is legacy/avoid-touch.

## 8. Environment Variable Readiness

Required Vercel variables are documented across the repo. Values were not printed or inspected in this audit.

Core app/Supabase:

| Variable | Public/secret | Expected target |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Clean V2 Supabase URL for `snnscnodegbyqexnopvf` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Clean V2 anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Clean V2 service role key |
| `NEXT_PUBLIC_SITE_URL` | Public | Current canonical product domain for the deployed flow |

NGO email:

| Variable | Public/secret | Expected target |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | Verified Mishava sending domain |
| `RESEND_FROM_EMAIL` | Operational/secret-ish | Verified sender address |
| `RESEND_REPLY_TO_EMAIL` | Operational/secret-ish | Monitored inbox |

Stripe/payment:

- Stripe variables exist in code/docs.
- Payment is not part of the current non-Stripe NGO pilot.
- Stripe remains test/foundation-oriented and must not affect trust outcomes.

Missing:

- Vercel dashboard environment audit reporting `SET`, `MISSING`, and target classification for Production, Preview, and Development without printing values.

## 9. Deployment Workflow

Known safe path:

1. Work locally in `/Users/caitlinferguson/Documents/Mishava V2.0`.
2. Confirm branch is `main`.
3. Confirm upstream is `mishava-v2-clean/main`.
4. Run checks.
5. Commit.
6. Push to `mishava-v2-clean/main`.
7. Let the clean Vercel project `mishava-v2` deploy from GitHub.
8. Verify live routes.

Do not:

- Push to old `origin` unless explicitly approved.
- Deploy with local Vercel CLI without confirming `.vercel/project.json`.
- Change domains/DNS during product work.
- Touch `dsuupr-am`.

## 10. Rollback

Rollback is not formally proven.

Expected available mechanisms:

- Vercel dashboard rollback to a prior production deployment.
- Git revert and push to `mishava-v2-clean/main`.

Missing:

- Mishava-specific rollback runbook.
- List of known-good deployment commits.
- Post-rollback route checklist.
- Auth/email/Supabase smoke checklist after rollback.

## 11. Local Development Safety

Confirmed:

- `.env.local` is ignored.
- `.vercel/` is ignored.
- `screenshots/` is ignored.
- `.next/` is ignored.
- Local Vercel linkage points to `mishava-v2`.
- Local branch is `main`.
- Upstream is `mishava-v2-clean/main`.

Remaining risk:

- Old `origin` remote still points to `Mishava2013/dsuupr-am`.

## 12. Tooling / CI

Current checks run during this audit:

| Command | Result |
| --- | --- |
| `npm test` | Pass, `176/176` |
| `npm run typecheck` | Pass |
| `npm run lint` | Fail: missing `fast-glob` required by `@next/eslint-plugin-next` |
| `npm run build` | Pass |
| `supabase migration list --linked` | Pass |

No `.github` workflow directory was found, so CI is not currently proven from the repo.

The lint failure appears dependency/tooling-related:

```text
Error: Cannot find module 'fast-glob'
Require stack:
- node_modules/@next/eslint-plugin-next/dist/utils/get-root-dirs.js
```

Recommendation:

- Handle this in a tooling-only follow-up. Do not mix it with product work.
- Likely next step is to inspect Next 16 ESLint dependency expectations and either refresh lockfile/dependencies or add the missing dev dependency only if confirmed appropriate.

## 13. Monitoring / Logs

Current status:

- Vercel runtime logs are available by platform.
- Supabase logs are available by platform.
- No dedicated Mishava monitoring/alerting runbook was found.

Missing:

- Production error alerting.
- Uptime checks for live domains.
- Auth/email failure alerts.
- Supabase DB/storage warning review cadence.
- Incident response owner and escalation process.

## 14. Backup / Restore

Current status:

- Supabase project exists and migrations are aligned.
- No backup/restore drill proof was found.

Missing:

- Backup schedule confirmation.
- Restore drill.
- Recovery point/recovery time expectations.
- Evidence file/storage restore path.
- Written incident/restore checklist.

## 15. Auth / Email Infrastructure

Repo-side closure is documented and implemented:

- Supabase Auth helpers exist.
- Signup/sign-in/password reset routes exist.
- NGO invite email helper uses Resend when env is configured and fails soft when not configured.
- Email/Auth verification checklist exists.

Still required:

- External Vercel env setup verification.
- Supabase redirect URL verification for live domains.
- Resend domain verification.
- Real inbox test for signup confirmation.
- Real inbox password reset test.
- Real inbox NGO invite delivery/acceptance test.

## 16. Stripe / Payment

Current status:

- Stripe foundation exists for NGO billing and webhooks.
- Payment firewall tests exist.
- Payment cannot affect trust outcomes.
- Production payment is not a current pilot requirement.

Missing before paid rollout:

- Production Stripe dashboard verification.
- Real webhook endpoint verification.
- Live-mode policy and test plan.
- Full payment support process.

## 17. AI / Provider Infrastructure

Current status:

- AI-minimize architecture is documented.
- Central AI control wrapper exists.
- Default-deny AI controls exist.
- Provider import guard test exists.
- No real AI provider calls are enabled.
- AI outputs are suggestion-only and cannot affect scores, rankings, verification, approvals, payment/access decisions, legal/compliance conclusions, or trust outcomes.

Missing:

- Persistent AI usage log store.
- Persistent cache backend.
- Provider adapter, if ever approved.
- Budget dashboard/ops review process.

## 18. Category Infrastructure Readiness

Strongest ready categories:

- NGO: supported/private pilot path.
- Shopping: guided toilet paper preview on live domain.

Reserved or early categories:

- Business/Local: planned/reserved, not ready for pilot.
- Corporate: planned/reserved.
- Government: reserved.
- Plus/consumer account value: early account/priorities foundation only.
- Admin/Ops: support dashboard foundation, not full ops console.

## 19. Tests / Verification Summary

Verified during this audit:

- Local branch/upstream clean.
- Local Vercel link points to `mishava-v2`.
- Ignored local artifacts remain ignored.
- `npm test`: pass, `176/176`.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- `npm run lint`: fails due missing `fast-glob` dependency resolution.
- `supabase migration list --linked`: pass.
- Live `shopping.mishava.org`: `HTTP 200`.
- Live `shopping.mishava.org/shopping`: `HTTP 200`.
- Live toilet paper category: `HTTP 200`.
- Live `ngo.mishava.org`: `HTTP 200`.

## 20. Infrastructure Guardrails

Hard rules for future chats:

- Do not touch `dsuupr-am` unless explicitly approved.
- Do not touch old Supabase `tghbfautnxblfxrtkdqb`.
- Do not print secrets.
- Report env values only as `SET`, `MISSING`, `POINTS TO CLEAN V2`, `POINTS TO OLD MISHAVA`, `POINTS TO DSUUPR`, or `UNKNOWN`.
- Do not change DNS/domains unless explicitly asked.
- Do not deploy from local CLI unless `.vercel/project.json` is verified first.
- Push Mishava work to `mishava-v2-clean/main`.
- Keep payment isolated from trust outcomes.
- Keep AI provider calls disabled unless a future approved slice explicitly enables them.

## 21. Missing Items

Top missing infrastructure/deployment items:

1. Full domain ownership and route verification table for every Mishava domain/subdomain.
2. Vercel env var dashboard audit for Production, Preview, and Development.
3. Deployment and rollback runbook.
4. Monitoring/alerting setup and incident runbook.
5. Backup/restore drill proof.
6. CI/GitHub Actions or an equivalent repeatable check policy.
7. Lint dependency/tooling fix.
8. Real NGO auth/email inbox verification.
9. Supabase security advisor/RLS review for clean V2 project.
10. Old remote cleanup decision.

## 22. Done List

Completed infrastructure/deployment work:

1. Clean GitHub repo created and used: `Mishava2013/mishava-v2`.
2. Clean Vercel project created and used: `mishava-v2`.
3. Local branch aligned to `main`.
4. Local upstream aligned to `mishava-v2-clean/main`.
5. Local Vercel link aligned to `mishava-v2`.
6. Shopping domain cut over to clean project.
7. Shopping live route returns `HTTP 200`.
8. NGO live route returns `HTTP 200`.
9. Supabase migrations aligned with clean V2 project.
10. Old Supabase and `dsuupr-am` avoid-touch guardrails are documented.

## 23. Recommended Next Infrastructure Tasks

1. Create a clean domain ownership and live route verification matrix.
2. Create deployment and rollback runbook for Mishava V2.
3. Run Vercel environment variable audit without printing secrets.
4. Fix lint dependency/tooling issue in a tooling-only pass.
5. Run NGO live auth/email inbox verification.
6. Create monitoring/incident/backup operational readiness checklist.
7. Decide what to do with old `origin` remote.

## 24. New Chat Setup

Start a new infrastructure/deployment chat with these source docs:

- `docs/chat-handoffs/mishava-infrastructure-deployment-deep-current-state-audit.md`
- `docs/chat-handoffs/mishava-infrastructure-deployment-new-chat-brief.md`
- `docs/mishava-v2-local-repo-vercel-alignment-cleanup-result.md`
- `docs/mishava-v2-shopping-domain-cutover-result.md`
- `docs/mishava-v2-current-state-category-review.md`

The next chat should stay focused on infrastructure/deployment only. It should not add product features, products, migrations, AI provider calls, payment behavior, DNS changes, or domain moves unless explicitly requested.

## 25. First Codex Prompt For Next Chat

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
