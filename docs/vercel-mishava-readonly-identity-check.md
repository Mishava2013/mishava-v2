# Vercel / Mishava Read-Only Deployment Identity Check

Date: 2026-06-01

## Scope

This was a read-only deployment identity check.

- No domains were changed.
- No DNS was changed.
- No environment variables were added, removed, pulled, or printed.
- No deployment was triggered.
- No product features were added.
- No Supabase migrations were touched.
- The old Supabase project was not touched.

## Local Repository Identity

The local repository is the Mishava V2 app.

Evidence:

- `package.json` name: `mishava-v2`
- Framework: Next.js `16.2.6`
- Scripts present: `dev`, `build`, `start`, `lint`, `typecheck`, `test`
- Recent commits include Release 4 Shopping and sign-in popup work:
  - `eda6466` - protected sign-in popup host fix
  - `4a467aa` - sign-in popup implementation
  - `16ef52b` - Slice 10C live Shopping verification
  - `05b513b` - toilet paper evidence preview
  - `4cae3a9` - supplier transparency completion

The Release 4 Shopping toilet paper work is present in this repo. The result docs confirm:

- Costco/Kirkland, Cashmere, and Purex were added as real Shopping product records in the V2 data/migration path.
- Supplier/manufacturer transparency fields were added.
- Toilet paper evidence-to-score preview language and evidence dimensions were added.
- Final Mishava Scores remain pending unless reviewed evidence and scoring logic support them.

## Local Vercel Linkage

Local `.vercel/project.json` is present and links this repo to:

| Field | Status |
| --- | --- |
| Vercel project name | `dsuupr-am` |
| Vercel project id | `prj_nspqvEI8jNXP53DyG4urAzRWAXAr` |
| Vercel org/team id | `team_AQ4nC6Eu6llPwPfeMeeh7JNC` |

Conclusion: the local Mishava V2 repo is linked to `dsuupr-am`, not `dsuupr`.

## Vercel Account / Project Checks

Read-only Vercel CLI checks were run.

| Check | Result |
| --- | --- |
| `vercel whoami` | Authenticated as `mishava2013` |
| `vercel project ls` | Projects found: `dsuupr-am` and `dsuupr` |
| `vercel project inspect dsuupr-am` | Project exists, owner `mishava2013's projects`, Next.js, Node `24.x` |
| `vercel project inspect dsuupr` | Project exists, owner `mishava2013's projects`, Next.js, Node `20.x` |

Project comparison:

| Project | Latest production URL | Notes |
| --- | --- | --- |
| `dsuupr-am` | `https://mishava.org` | This is the project linked from the local Mishava V2 repo. |
| `dsuupr` | `https://dsuupr.vercel.app` | Separate project; local Mishava V2 repo is not linked here. |

## Domain / Alias Checks

Read-only checks show `shopping.mishava.org` is attached to the `dsuupr-am` production deployment.

`vercel inspect https://shopping.mishava.org` reports:

- Deployment name: `dsuupr-am`
- Deployment target: production
- Deployment status: ready
- Production deployment URL: `https://dsuupr-e4filappm-mishava2013s-projects.vercel.app`
- Alias includes `https://shopping.mishava.org`

`vercel inspect https://mishava.org` reports the same `dsuupr-am` deployment and aliases.

`vercel domains ls` only lists the apex domain `mishava.org` at the account-domain level. The subdomains appear as deployment aliases under the `dsuupr-am` project.

DNS / response observations:

| Host | Observation |
| --- | --- |
| `shopping.mishava.org` | Resolves through Vercel DNS and returns a Vercel response with `x-matched-path: /shopping`. |
| `mishava.org` | Resolves through Cloudflare and returns an OpenNext/Cloudflare response, not the fresh Vercel response. |

Conclusion: `shopping.mishava.org` is not attached to the wrong Vercel project. It is attached to `dsuupr-am`, which is the same project linked from the local Mishava V2 repo.

## Production Environment Variable Status

Read-only `vercel env ls production` for the linked `dsuupr-am` project reported:

> No Environment Variables found for `mishava2013s-projects/dsuupr-am`.

No values were printed or pulled.

Required production env var status:

| Env var | Production status on linked `dsuupr-am` |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | MISSING |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | MISSING |
| `SUPABASE_SERVICE_ROLE_KEY` | MISSING |
| `NEXT_PUBLIC_SITE_URL` | MISSING |

## Findings

1. Local Mishava V2 is linked to `dsuupr-am`.
2. `shopping.mishava.org` is attached to the `dsuupr-am` Vercel production deployment.
3. `dsuupr-am` appears to be the project that should serve `shopping.mishava.org`.
4. The live Shopping shell can load from `shopping.mishava.org`, but Vercel production env vars for Supabase are missing on `dsuupr-am`.
5. Missing Supabase env vars are the likely reason live Shopping cannot read toilet paper product records, even though the code and migrations exist.
6. `mishava.org` and `www.mishava.org` still appear to be served through a Cloudflare/OpenNext path based on response headers, while `shopping.mishava.org` is served by Vercel.

## Suspected Root Cause

Primary suspected root cause:

`dsuupr-am` is the correct Vercel project for `shopping.mishava.org`, but the production environment for `dsuupr-am` has no Supabase configuration. The app therefore renders the Shopping shell but cannot connect to the live V2 Supabase product data.

Secondary routing/domain note:

The apex/root `mishava.org` still appears to be served by Cloudflare/OpenNext rather than the fresh Vercel deployment. That is separate from the `shopping.mishava.org` product-data issue, because `shopping.mishava.org` is already hitting Vercel.

## Exact Next Manual Step For Jos

In the Vercel dashboard:

1. Open team/project: `mishava2013's projects` -> `dsuupr-am`.
2. Go to Project Settings -> Environment Variables.
3. Add the required Production environment variables without exposing values in chat:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Use values for the clean V2 Supabase project only:
   - `mishava-v2-dev / snnscnodegbyqexnopvf`
5. Redeploy the latest `dsuupr-am` production deployment after env vars are set.
6. Recheck:
   - `https://shopping.mishava.org`
   - `https://shopping.mishava.org/categories/toilet-paper`
   - Kirkland product detail
   - Cashmere product detail
   - Purex product detail

Do not use the old Supabase project `mishava / tghbfautnxblfxrtkdqb` for these env vars.

## Can Codex Safely Fix The Next Step?

Codex can safely do the next step only if Jos explicitly authorizes one of the following:

- Add production env vars to Vercel via CLI using values provided through a secure local mechanism, without printing them.
- Redeploy after Jos has manually added the env vars.
- Run a read-only live verification after Jos has updated the dashboard.

Jos should handle the Vercel dashboard step manually if the secret values are not already safely available in the local environment. Codex should not guess or print Supabase keys.

## Summary Status

| Question | Answer |
| --- | --- |
| Is local Mishava V2 linked to `dsuupr-am`? | Yes |
| Is local Mishava V2 linked to `dsuupr`? | No |
| Does a correct Vercel project exist? | Yes, likely `dsuupr-am` |
| Is `shopping.mishava.org` attached to the wrong project? | No, not based on Vercel inspect |
| Are production Supabase env vars missing from the live project? | Yes, all required checked vars are MISSING |
| Does Jos need a manual dashboard step? | Yes, unless secure CLI env setup is explicitly authorized |
