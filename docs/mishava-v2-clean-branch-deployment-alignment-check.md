# Mishava V2 Clean Branch/Deployment Alignment Check

Date: June 2, 2026

## Purpose

Confirm that the clean Mishava V2 GitHub repo and Vercel deployment are not split between `main` and `master`, and identify any safe cleanup needed before future deployments.

## Scope Confirmation

This was a read-only alignment check. No code, products, migrations, DNS records, domains, Supabase projects, or Vercel settings were changed. The `dsuupr-am` Vercel project and the old Supabase project were not touched.

## Current Local Branch

- Local folder: `/Users/caitlinferguson/Documents/Mishava V2.0`
- Current local branch: `master`
- Current local commit: `6cf726ee85a495da704917d7095ea93d7c5eb6ef`
- Working tree before this result doc: clean

The local branch is named `master`, but it was pushed to the clean GitHub repo as remote `main`.

## Git Remotes

- `mishava-v2-clean`: `https://github.com/Mishava2013/mishava-v2.git`
- `origin`: `https://github.com/Mishava2013/dsuupr-am.git`

The existing `origin` remote still points to the older/confusing `dsuupr-am` repo. The clean Mishava V2 repo is available through the `mishava-v2-clean` remote.

## GitHub Branch Status

Remote branch check for `Mishava2013/mishava-v2`:

- `refs/heads/main`: `6cf726ee85a495da704917d7095ea93d7c5eb6ef`
- Remote default branch: `main`
- Remote `master`: not present

Conclusion: the clean GitHub repo is standardized on `main`. There is no remote `master` branch in `Mishava2013/mishava-v2`, so the clean repo is not split between `main` and `master`.

## Vercel Project Status

Vercel project list shows:

- `mishava-v2`: latest production URL `https://shopping.mishava.org`
- `dsuupr-am`: latest production URL `https://mishava.org`
- `dsuupr`: latest production URL `https://dsuupr.vercel.app`

Vercel project inspect for `mishava-v2`:

- Project name: `mishava-v2`
- Project id: `prj_nAA7eocEDLviT7sn6dZAc3BMbDQp`
- Root directory: `.`
- Framework: Next.js
- Node version: 24.x

Latest live deployment for `shopping.mishava.org`:

- Deployment URL: `https://mishava-v2-dld04fn7f-mishava2013s-projects.vercel.app`
- Vercel deployment id: `dpl_4d3FQmHywnRqPeANC5PyC9AKAxYL`
- Status: Ready
- Alias: `https://shopping.mishava.org`
- Project: `mishava-v2`

The Vercel build log shows:

```text
Cloning github.com/Mishava2013/mishava-v2 (Branch: main, Commit: 6cf726e)
```

Conclusion: Vercel production for `mishava-v2` is deploying from the clean GitHub repo on branch `main`.

## Live Deployed Commit

- Live commit on `shopping.mishava.org`: `6cf726e`
- Full local/remote commit: `6cf726ee85a495da704917d7095ea93d7c5eb6ef`
- Commit `6cf726e` is present on the clean GitHub repo's `main` branch.

Conclusion: the live Shopping deployment includes Release 4 Slice 13 and is aligned with clean GitHub `main`.

## Main/Master Alignment

Current state:

- Clean GitHub repo has `main` only.
- Local repo is currently on `master`.
- Local `master` commit equals clean remote `main` commit.
- There is no clean remote `master` branch to diverge.

Conclusion: there is no remote branch split today, but the local branch name `master` is confusing and could cause future mistakes.

## Local Vercel Linkage Finding

The local `.vercel/project.json` currently contains:

```json
{"projectId":"prj_nspqvEI8jNXP53DyG4urAzRWAXAr","orgId":"team_AQ4nC6Eu6llPwPfeMeeh7JNC","projectName":"dsuupr-am"}
```

This means the local folder is still linked to the old/confusing `dsuupr-am` Vercel project even though the live Shopping deployment is correctly served by the clean `mishava-v2` project.

This did not affect the latest clean production deployment because the deployment was triggered from the clean GitHub repo and Vercel project. However, it is a future manual deploy risk: running `vercel deploy` from this local folder could target `dsuupr-am` unless the local Vercel link is fixed first.

## Recommended Safe Cleanup

Recommended standard:

- Use `main` as the single deployment branch for Mishava V2.
- Keep `Mishava2013/mishava-v2` as the clean GitHub repo.
- Keep Vercel project `mishava-v2` deploying from `main`.

Recommended cleanup steps, not performed in this audit:

1. Rename the local branch from `master` to `main`, or create/switch to a local `main` branch at commit `6cf726e`.
2. Set local `main` to track `mishava-v2-clean/main`.
3. Relink the local Vercel project to `mishava-v2`, or remove the stale local `.vercel` linkage and relink carefully.
4. Avoid running local Vercel deploy commands until the `.vercel/project.json` link is corrected.
5. Keep the old `origin` remote only if it is still needed for history; otherwise plan a future remote cleanup after Jos approves it.

## Answer

Future Mishava V2 deployments are currently safe if they come from the clean GitHub repo's `main` branch into the clean Vercel project `mishava-v2`.

The active risk is not a remote `main`/`master` split. The active risk is local naming/linkage confusion:

- local branch is still `master`
- clean deployment branch is `main`
- local Vercel linkage still points to `dsuupr-am`

## Final Confirmation

- No code changed.
- No product data changed.
- No migrations changed.
- No DNS or domains changed.
- No Vercel settings changed.
- `dsuupr-am` was not touched.
- The old Supabase project was not touched.
