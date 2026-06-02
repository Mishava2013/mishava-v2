# Mishava V2 Local Repo/Vercel Alignment Cleanup Result

Date: June 2, 2026

## Summary

Completed the local Mishava V2 repo/Vercel alignment cleanup. The local repo now uses `main`, tracks the clean Mishava V2 GitHub remote, and the local Vercel project link now points to `mishava-v2` instead of `dsuupr-am`.

This was a tooling-only cleanup. No product code, features, products, migrations, domains, DNS, Supabase configuration, or production data were changed.

## Before State

- Local folder: `/Users/caitlinferguson/Documents/Mishava V2.0`
- Local branch: `master`
- Local commit: `eb9ea76eb9efff713a9b2d26fcc2fc1a5d65a9c3`
- Clean remote present: `mishava-v2-clean = https://github.com/Mishava2013/mishava-v2.git`
- Old origin preserved: `origin = https://github.com/Mishava2013/dsuupr-am.git`
- Clean GitHub `main` before push: `6cf726ee85a495da704917d7095ea93d7c5eb6ef`
- Local `.vercel/project.json` before relink:

```json
{"projectId":"prj_nspqvEI8jNXP53DyG4urAzRWAXAr","orgId":"team_AQ4nC6Eu6llPwPfeMeeh7JNC","projectName":"dsuupr-am"}
```

- `.env.local` ignored by `.gitignore`.
- `.vercel/` ignored and not tracked.
- No staged secrets.
- Working tree was clean before cleanup.

## Actions Taken

1. Renamed local branch from `master` to `main`.
2. Set local `main` upstream to `mishava-v2-clean/main`.
3. Pushed local `main` to clean GitHub remote `mishava-v2-clean/main`.
4. Relinked local Vercel project to `mishava-v2` using Vercel CLI.
5. Verified `.vercel/project.json` now points to `mishava-v2`.
6. Ran safe checks:
   - `npm test`
   - `supabase migration list --linked`

No manual Vercel deployment command was run. No DNS, domain, or environment variable changes were made.

## Branch Result

- Local branch after cleanup: `main`
- Current commit before this result doc commit: `eb9ea76eb9efff713a9b2d26fcc2fc1a5d65a9c3`
- Local upstream after cleanup: `mishava-v2-clean/main`

## Remote / Upstream Result

Remotes after cleanup:

```text
mishava-v2-clean https://github.com/Mishava2013/mishava-v2.git
origin           https://github.com/Mishava2013/dsuupr-am.git
```

Clean GitHub `main` after push:

```text
eb9ea76eb9efff713a9b2d26fcc2fc1a5d65a9c3 refs/heads/main
```

The old `origin` remote was preserved and not modified.

## Vercel Local Linkage Result

Local `.vercel/project.json` after relink:

```json
{"projectId":"prj_nAA7eocEDLviT7sn6dZAc3BMbDQp","orgId":"team_AQ4nC6Eu6llPwPfeMeeh7JNC","projectName":"mishava-v2"}
```

Result:

- Local Vercel project link now points to `mishava-v2`.
- Local Vercel project link no longer points to `dsuupr-am`.
- `.vercel/` remains ignored/uncommitted.
- Future local Vercel deploy commands from this folder should target `mishava-v2`, assuming the local `.vercel/` link remains intact.

## Commands / Checks Run

Pre-checks:

- `pwd`
- `git branch --show-current`
- `git rev-parse HEAD`
- `git remote -v`
- `git status --short`
- `git ls-remote --heads mishava-v2-clean main`
- `git check-ignore -v .env.local`
- `git diff --cached --name-only`
- `cat .vercel/project.json`
- `git ls-files .vercel/project.json`

Cleanup:

- `git branch -m master main`
- `git branch --set-upstream-to=mishava-v2-clean/main main`
- `git push mishava-v2-clean main:main`
- `vercel link --yes --project mishava-v2`

Verification:

- `cat .vercel/project.json`
- `git branch --show-current`
- `git rev-parse --abbrev-ref --symbolic-full-name @{u}`
- `git ls-remote --heads mishava-v2-clean main`
- `git status --short --ignored .vercel .env.local`
- `npm test`
- `supabase migration list --linked`

## Test / Migration Status

- `npm test` - Pass, `155/155`.
- `supabase migration list --linked` - Pass; local and remote migrations aligned through `202605260009`.

## Deployment Status

No manual Vercel deployment command was run during the relink.

The branch alignment push updated the clean GitHub `main` branch. If Vercel GitHub auto-deploy is active for `mishava-v2`, that push may trigger a normal Git-based deployment. No deployment was manually started from the local Vercel CLI, and no deploy was sent to `dsuupr-am`.

## Remaining Caveats

- The old `origin` remote still points to `Mishava2013/dsuupr-am`. It was intentionally preserved for safety.
- A future cleanup could rename remotes, for example:
  - rename `mishava-v2-clean` to `origin`;
  - rename old `origin` to `dsuupr-am-legacy`;
  - or remove the old `origin` after explicit approval.
- `.vercel/` is ignored, so the corrected local Vercel linkage is local-machine state and is documented here rather than committed.

## Confirmations

- No product code was changed.
- No features were added.
- No products were added.
- No migrations were added or changed.
- No DNS or domains were changed.
- No Supabase configuration was changed.
- Old Supabase was untouched.
- Old `origin` was preserved.
- `dsuupr-am` was not deployed to.
- `dsuupr-am` Vercel project settings were not changed.
- `.env.local` remains ignored.
- No secrets were staged or committed.

## Alignment Status

Status: aligned.

Local development is now aligned with the clean Mishava V2 setup:

- local branch: `main`
- local upstream: `mishava-v2-clean/main`
- clean GitHub repo: `Mishava2013/mishava-v2`
- local Vercel project link: `mishava-v2`

Future local deploys from this folder should now target `mishava-v2`, not `dsuupr-am`.
