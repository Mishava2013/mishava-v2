# Mishava V2 Local Repo/Vercel Alignment Cleanup Plan

Date: June 2, 2026

## Context

The clean Mishava V2 production setup is working:

- GitHub repo: `Mishava2013/mishava-v2`
- Vercel project: `mishava-v2`
- Production branch: `main`
- Live domain: `shopping.mishava.org`
- Live commit confirmed in the prior alignment check: `6cf726e`
- No remote `main`/`master` split exists in the clean GitHub repo.

The local repo is still confusing and should be cleaned up carefully:

- Local branch is named `master`.
- Local `.vercel/project.json` still points to `dsuupr-am`.
- Local `vercel deploy` from this folder should be avoided until the local Vercel link is corrected.

## Goal

Plan a safe cleanup so local development, pushes, and future deploy commands align with the clean Mishava V2 GitHub/Vercel setup.

This is a plan only. Do not implement the cleanup until explicitly requested.

## Hard Guardrails

- Do not change application code.
- Do not add features.
- Do not add products.
- Do not add migrations.
- Do not change DNS or domains.
- Do not change Supabase.
- Do not touch old Supabase.
- Do not delete or modify the existing `dsuupr-am` Vercel project.
- Do not remove existing git remotes unless explicitly approved.
- Do not deploy during cleanup unless explicitly approved.

## 1. Git Branch Alignment

Implementation should first inspect:

- current local branch;
- current local commit;
- local working tree state;
- clean remote `mishava-v2-clean/main`;
- whether local `master` and clean remote `main` point to the same commit;
- whether local-only commits exist that are not on clean remote `main`.

Recommended safe branch cleanup:

1. Confirm local working tree is clean or only contains the intended result doc.
2. Confirm current local commit is on, or intentionally ahead of, `mishava-v2-clean/main`.
3. Fetch the clean remote:
   - `git fetch mishava-v2-clean`
4. Compare local branch to clean remote:
   - local `HEAD`
   - `mishava-v2-clean/main`
5. If local `master` is simply the Mishava V2 line of work, rename it locally:
   - `git branch -m master main`
6. Set upstream to the clean remote:
   - `git branch --set-upstream-to=mishava-v2-clean/main main`
7. Verify:
   - current branch is `main`;
   - upstream is `mishava-v2-clean/main`;
   - no commit history was lost.

If local `master` contains commits ahead of clean remote `main`, implementation should push them to `mishava-v2-clean/main` only if those commits are intended Mishava V2 work and the user approves.

Do not delete any branch during the first cleanup pass.

## 2. Git Remotes

Current known remotes from the previous audit:

- `origin`: `https://github.com/Mishava2013/dsuupr-am.git`
- `mishava-v2-clean`: `https://github.com/Mishava2013/mishava-v2.git`

Recommended remote handling:

- Preserve `origin` for safety during the first cleanup pass.
- Keep `mishava-v2-clean` as the clean Mishava V2 remote.
- Make local `main` track `mishava-v2-clean/main`.
- Do not remove `origin` yet.
- Do not rename remotes yet unless explicitly approved.

Future optional cleanup, after confidence:

- Rename `mishava-v2-clean` to `origin`.
- Rename old `origin` to `dsuupr-am-legacy`.
- Or remove old `origin` if Jos explicitly approves and the old repo is no longer needed.

That optional cleanup should be a separate, explicit task.

## 3. Vercel Local Project Linkage

Current risk:

- `.vercel/project.json` points to `dsuupr-am`.
- Running local Vercel commands from this folder may target the wrong project.

Implementation should inspect:

- `.vercel/project.json`;
- local Vercel project id;
- local Vercel project name;
- Vercel project `mishava-v2` id;
- Vercel org/team id.

Recommended relink process:

1. Confirm no deployment is being requested.
2. Confirm current local branch/remotes are aligned first.
3. Back up or inspect `.vercel/project.json` in read-only mode.
4. Unlink the stale local Vercel project association using the safest Vercel CLI flow, or remove/relink `.vercel` only with explicit approval.
5. Link the local folder to Vercel project `mishava-v2`.
6. Verify `.vercel/project.json` now points to:
   - project name: `mishava-v2`;
   - expected Vercel project id for `mishava-v2`;
   - expected org/team id.
7. Do not deploy during the relink.

Recommended verification command after relink:

- `vercel project inspect mishava-v2`
- inspect `.vercel/project.json`
- optionally `vercel env ls` only if reporting `SET`/`MISSING`, never values

Do not change domains, DNS, aliases, or environment variables.

## 4. Safety Checks

Before cleanup:

- Confirm current branch.
- Confirm current commit.
- Confirm clean remote branch tip.
- Confirm local working tree state.
- Confirm no `.env.local` or secret file is staged.
- Confirm `.env.local` remains ignored.
- Confirm screenshots and generated artifacts remain ignored.
- Confirm `.vercel/project.json` currently points to `dsuupr-am`.

After cleanup:

- Confirm current branch is `main`.
- Confirm local `main` tracks `mishava-v2-clean/main`.
- Confirm current commit is unchanged unless an explicit result doc commit was made.
- Confirm existing `origin` remote was not removed.
- Confirm `mishava-v2-clean` remote remains intact.
- Confirm `.vercel/project.json` points to `mishava-v2`.
- Confirm no application code changed.
- Confirm no migrations changed.
- Confirm no product data changed.
- Confirm no domains/DNS changed.
- Confirm no Supabase changes occurred.
- Confirm old Supabase was untouched.
- Confirm `dsuupr-am` was not touched.

If `git status` stalls locally, use safe alternatives:

- `git diff --name-only`
- `git diff --cached --name-only`
- `git ls-files --others --exclude-standard`
- `git rev-parse --abbrev-ref HEAD`
- `git rev-parse HEAD`

Do not skip cleanliness checks just because one command stalls.

## 5. Implementation Result Document

Implementation should create:

`docs/mishava-v2-local-repo-vercel-alignment-cleanup-result.md`

The result document should include:

- branch before cleanup;
- branch after cleanup;
- current commit before and after;
- remote configuration before and after;
- upstream/tracking branch after cleanup;
- `.vercel/project.json` project before cleanup;
- `.vercel/project.json` project after cleanup;
- confirmation no deploy occurred;
- confirmation no code/features/products/migrations changed;
- confirmation no domains/DNS changed;
- confirmation `dsuupr-am` was not touched;
- confirmation old Supabase was untouched;
- remaining caveats;
- recommended next step.

## 6. Acceptance Criteria

Cleanup is safe only if:

- local branch is `main`;
- clean remote `main` is the default push target;
- local `main` tracks `mishava-v2-clean/main`;
- Vercel local link points to `mishava-v2`;
- `dsuupr-am` Vercel project is not touched;
- existing old `origin` remote is preserved unless separately approved;
- no code changes are made;
- no product/features are added;
- no migrations are added or changed;
- no DNS/domains are changed;
- old Supabase is untouched;
- future local deploy commands would target `mishava-v2`, not `dsuupr-am`.

## Recommended Next Action

Implement this cleanup as a tooling-only slice after Jos approves:

1. Rename local `master` to `main`.
2. Set upstream to `mishava-v2-clean/main`.
3. Relink local Vercel project to `mishava-v2` without deploying.
4. Commit only the cleanup result doc.

This cleanup should happen before any future local Vercel deploy command is run from this folder.
