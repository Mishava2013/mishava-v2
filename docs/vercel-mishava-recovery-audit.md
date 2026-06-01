# Vercel Mishava Recovery Audit

Date: 2026-06-01

## Scope

This was a read-only recovery audit. No DNS records were changed, no Vercel domains were moved, no environment variables were added or removed, no deployment was triggered, no application code was changed, no Supabase migrations were touched, and the old Supabase project was not touched.

## Short Answer

The current local Mishava V2 app is inside the GitHub repository `Mishava2013/dsuupr-am`, and the local Vercel project is also linked to a Vercel project named `dsuupr-am`.

That name is the source of a lot of the confusion. The codebase itself is Mishava V2 (`package.json` name: `mishava-v2`), but the GitHub repo and Vercel project still carry the older/confusing `dsuupr-am` name.

`shopping.mishava.org` is currently attached to the Vercel project `dsuupr-am`, but live Shopping is failing at runtime because Supabase returns `401 Invalid API key`. That means the current live issue is most likely Production Supabase environment variable mismatch or incorrect Supabase credentials on the Vercel project, not missing DNS.

## Findings

### 1. Is the current local Mishava V2 code inside `Mishava2013/dsuupr-am`?

Yes.

Read-only checks found:

- Local Git remote: `https://github.com/Mishava2013/dsuupr-am.git`
- GitHub repo: `Mishava2013/dsuupr-am`
- Default branch: `main`
- Local app package name: `mishava-v2`
- Local HEAD at audit time: `a96a17a70c9c968fc846148c84299540261ac0de`

So the repository is named `dsuupr-am`, but the application inside it is Mishava V2.

### 2. Is `dsuupr-am` simply a badly named Vercel project/repo that now contains Mishava V2 work?

Most likely, yes.

The local `.vercel/project.json` points to:

- Vercel project name: `dsuupr-am`
- Vercel project id: `prj_nspqvEI8jNXP53DyG4urAzRWAXAr`
- Vercel owner/team id: `team_AQ4nC6Eu6llPwPfeMeeh7JNC`

`vercel project inspect dsuupr-am` confirms this is a Next.js project with root directory `.` and build command `npm run build` / `next build`.

The confusing part is naming, not necessarily code ownership. The repo and Vercel project name still say `dsuupr-am`, while the deployed app routes and package metadata are Mishava V2.

### 3. Why are Dsuupr items/deployment names still appearing?

They appear because the GitHub repo and Vercel project are still named `dsuupr-am`.

Vercel derives generated deployment URLs and project labels from the project slug. That is why deployment URLs such as `dsuupr-...vercel.app` still appear even though the app code is Mishava V2.

This does not by itself prove that Dsuupr code is deployed. It proves the project identity/name is still Dsuupr-labeled.

### 4. Which Vercel project currently owns `shopping.mishava.org`?

`shopping.mishava.org` is currently attached to:

- Vercel project: `mishava2013s-projects/dsuupr-am`
- Project id: `prj_nspqvEI8jNXP53DyG4urAzRWAXAr`
- Current deployment id: `dpl_HWhJA2bhcXzpDudX6rWC5f39Jukp`
- Current deployment URL: `https://dsuupr-jcjqnqkbc-mishava2013s-projects.vercel.app`
- Deployment target: `production`
- Deployment status: `Ready`
- Deployment created: 2026-06-01 07:08 PDT

The deployment aliases include `shopping.mishava.org`, `mishava.org`, `ngo.mishava.org`, `app.mishava.org`, `support.mishava.org`, `trust.mishava.org`, `admin.mishava.org`, `api.mishava.org`, `gov.mishava.org`, `research.mishava.org`, `media.mishava.org`, `business.mishava.org`, `corporate.mishava.org`, and `www.mishava.org`.

### 5. Which deployed commit is currently live on `shopping.mishava.org`?

The exact Git commit could not be conclusively identified from the read-only Vercel CLI output.

The live deployment was created from uploaded deployment files and the Vercel inspect/build logs did not expose a clear Git commit SHA. The build logs do confirm:

- Project name: `dsuupr-am`
- App package: `mishava-v2@0.1.0`
- Next.js version: `16.2.6`
- Build command: `npm run build`
- Build completed successfully
- Shopping routes exist in the deployed app:
  - `/shopping`
  - `/shopping/categories/[slug]`
  - `/shopping/products/[slug]`

Manual Vercel dashboard verification is still needed for the exact source commit if Jos needs a definitive SHA. In Vercel, check the deployment detail page for Source / Git metadata.

### 6. Does that deployed commit include the latest Mishava Shopping toilet paper work?

Partially verified, but not fully provable from the live page because runtime Supabase access is failing.

Evidence that the deployed bundle is a recent Mishava V2 build:

- The deployment includes current Mishava routes such as `/shopping`, `/shopping/categories/[slug]`, `/shopping/products/[slug]`, `/ngo/sign-in`, `/admin/support`, and report export routes.
- The live HTML includes the current sign-in modal components.
- Local history includes the relevant Shopping work:
  - `05b513b Implement toilet paper evidence preview`
  - `4cae3a9 Complete shopping supplier transparency result`
  - `8da1227 Implement Release 4 Slice 6 toilet paper shopping POC`

What blocks full verification:

- `https://shopping.mishava.org`
- `https://shopping.mishava.org/categories/toilet-paper`
- `https://shopping.mishava.org/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls`

all return HTTP 500.

The Vercel runtime logs show the cause:

```text
Error: Supabase shopping_products request failed: 401 {"message":"Invalid API key","hint":"Double check your Supabase `anon` or `service_role` API key."}
```

So the app is reaching the deployed Mishava code path, but it cannot read Shopping data because Supabase rejects the configured key.

### 7. Did adding Production env vars change anything besides future deployment runtime configuration?

Adding Production environment variables does not rename the Vercel project, move domains, change DNS, change code, change GitHub repository ownership, or run Supabase migrations.

It can change live runtime behavior after a deployment because server-side code reads those values when it contacts Supabase.

Current Vercel Production env vars are present on `dsuupr-am`:

- `NEXT_PUBLIC_SITE_URL`: SET
- `NEXT_PUBLIC_SUPABASE_URL`: SET
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: SET
- `SUPABASE_SERVICE_ROLE_KEY`: SET

Values were not printed or inspected directly. The live `401 Invalid API key` strongly suggests at least one of the Supabase Production values is wrong, mismatched, copied from the wrong project, truncated, or not the expected key for the Supabase URL.

This is the most important practical finding.

## Recovery Options

### Option A: Rename the Vercel project only

This is likely safe after the live env issue is corrected and verified.

Pros:

- Removes the confusing `dsuupr-am` label.
- Keeps existing domains and deployment history together.
- Lowest disruption if the project is otherwise the correct Mishava app.

Cons:

- Should not be done before verifying env values and live routes, because it could make troubleshooting harder.

### Option B: Keep the current project and fix env/deploy

This is the safest immediate recovery path.

Pros:

- No domain moves.
- No repo moves.
- No DNS risk.
- Directly addresses the current live failure: Supabase `401 Invalid API key`.

Cons:

- The project name remains confusing until renamed later.

### Option C: Create a clean Mishava V2 Vercel project

This may be useful later if Jos wants a clean separation.

Pros:

- Clean project identity.
- Easier mental model: Mishava repo, Mishava Vercel project, Mishava domains.

Cons:

- Higher risk right now.
- Requires carefully recreating env vars, domains, build settings, and deployment setup.
- Domains would need to be moved, which is exactly what should be avoided during recovery unless clearly necessary.

### Option D: Move domains to a different project

Not recommended as the next step.

Pros:

- Could be correct if the current project is proven wrong.

Cons:

- Highest risk.
- Could break live routing further.
- Current evidence says the domain is attached to a Mishava V2 build, but Supabase env configuration is wrong.

## Safest One-Step Recommendation for Jos

Do not move domains yet.

The safest next step is:

1. In Vercel dashboard, open project `dsuupr-am`.
2. Confirm the project source/repo is intended to be `Mishava2013/dsuupr-am`.
3. Verify Production env values without exposing them:
   - `NEXT_PUBLIC_SUPABASE_URL` must point to the clean Mishava V2 Supabase project.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be the anon key from that same clean Mishava V2 project.
   - `SUPABASE_SERVICE_ROLE_KEY` must be the service-role key from that same clean Mishava V2 project.
   - `NEXT_PUBLIC_SITE_URL` should match the intended canonical live URL.
4. Redeploy only after those env values are corrected.
5. Then re-test `https://shopping.mishava.org`.

Once live Shopping works and the clean V2 Supabase values are confirmed, the next cleanup should be a Vercel project rename from `dsuupr-am` to a Mishava-specific name. Do that before creating a brand-new project or moving domains.

## Current Root Cause Hypothesis

The current live failure is not DNS and not missing Shopping routes.

The most likely root cause is:

```text
shopping.mishava.org is attached to the dsuupr-am Vercel project, but that project currently has mismatched or invalid Supabase Production env values.
```

This explains why:

- Vercel serves the app.
- The deployment is `Ready`.
- The Shopping routes exist.
- The page returns HTTP 500.
- Runtime logs show Supabase `401 Invalid API key`.

## What Codex Can Safely Do Next

Codex can safely:

- Re-run read-only Vercel checks.
- Re-run live route checks after Jos updates env values.
- Document the verified state.
- Rename nothing and move nothing unless explicitly instructed.

Jos should do manually in dashboard:

- Verify or replace Production Supabase env values.
- Trigger a production redeploy after env values are corrected.
- Optionally rename the Vercel project after the live app is verified.

## Confirmations

- No DNS changes were made.
- No Vercel domains were moved.
- No Vercel env vars were added, removed, or changed.
- No deployment was triggered.
- No product features were added.
- No code was changed.
- No Supabase migrations were touched.
- The old Supabase project was not touched.
