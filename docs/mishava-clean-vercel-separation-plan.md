# Mishava Clean Vercel Separation Plan

Date: 2026-06-01

## Scope

This is a planning document only. No DNS records should be changed, no domains should be moved, no Vercel environment variables should be added or removed, no deployment should be triggered, no Supabase settings should be changed, and the current `dsuupr-am` Vercel project should not be deleted or modified as part of this plan.

## Goal

Create a clean Mishava V2 deployment path that removes Dsuupr-named project confusion without breaking the current Mishava or Dsuupr surfaces.

The goal is not speed. The goal is a controlled separation where Mishava V2 can prove itself on a temporary Vercel URL before any Mishava domains are moved.

## Current Starting Point

Recent audits found:

- The local app is Mishava V2 code.
- The local Git remote is `https://github.com/Mishava2013/dsuupr-am.git`.
- The linked Vercel project is named `dsuupr-am`.
- Mishava custom domains are currently attached to the Vercel project `dsuupr-am`.
- `dsuupr.com` appears to be served separately through Cloudflare/OpenNext and is not listed as a Mishava Vercel alias.
- Live Mishava Shopping currently reaches Vercel but fails with Supabase `401 Invalid API key`.
- The clean Mishava V2 Supabase project should be `mishava-v2-dev / snnscnodegbyqexnopvf`.
- The old Mishava Supabase project is `mishava / tghbfautnxblfxrtkdqb` and must not be used for Mishava V2.

## Recommended Path

Recommended path: **create a clean Mishava V2 GitHub/Vercel path in parallel, verify it fully on a temporary Vercel URL, then move Mishava domains only after proof.**

Do not rename or delete `dsuupr-am` first. Keep it as the current reference project until the clean Mishava project is proven.

Recommended sequence:

1. Create a clean GitHub repository for Mishava V2.
2. Copy or migrate the current Mishava V2 code into that repository.
3. Create a new Vercel project named `mishava-v2`.
4. Connect that Vercel project to the clean Mishava V2 repo.
5. Add clean Mishava V2 Supabase env vars only to the new Vercel project.
6. Deploy to the new project's temporary Vercel URL.
7. Verify Shopping, toilet paper, NGO, auth gates, support/legal pages, and protected routes on the temporary URL.
8. Only after verification, move `shopping.mishava.org` to the new project as the first domain.
9. Verify `shopping.mishava.org`.
10. Move remaining Mishava domains one at a time.
11. Leave Dsuupr domains and Dsuupr infrastructure untouched.

## Why This Path Is Safest

This avoids the two riskiest moves:

- It does not modify the existing `dsuupr-am` Vercel project before the clean replacement is proven.
- It does not move live Mishava domains until a temporary URL proves the new project has correct code, env vars, and runtime behavior.

It also gives Jos a clean rollback:

- If the new project fails, leave domains on `dsuupr-am` and fix the new project privately.
- If a domain move causes trouble, move only the one test domain back before touching the rest.

## Path Options Evaluated

| Option | Recommendation | Reason |
| --- | --- | --- |
| Keep current repo but create new Vercel project named `mishava-v2` | Acceptable short-term, but not clean enough long-term | Vercel name improves, but GitHub repo remains `dsuupr-am`, so confusion continues |
| Rename or duplicate GitHub repo to a clean Mishava V2 repo | Recommended | Removes source-control confusion and makes future deployment ownership obvious |
| Create a new Vercel project connected to the clean Mishava repo | Recommended | Clean project identity with no Dsuupr labels |
| Add clean V2 Supabase env vars after project exists | Required | Prevents accidental env edits on current `dsuupr-am` project |
| Deploy first to temporary Vercel URL | Required | Proves the app before domain movement |
| Verify Shopping/toilet paper before moving domains | Required | Protects early preview readiness |
| Move `shopping.mishava.org` only after proof | Required | Smallest safe live-domain cutover |

## Risks

| Risk | Mitigation |
| --- | --- |
| Copying wrong Supabase keys | Jos should copy keys only from `mishava-v2-dev / snnscnodegbyqexnopvf` and verify URL/key pair belongs together |
| Accidentally using old Mishava Supabase | Explicitly avoid `tghbfautnxblfxrtkdqb` in all Mishava V2 env vars |
| Breaking Dsuupr | Do not touch `dsuupr.com`, Dsuupr Cloudflare setup, or the `dsuupr` Vercel project |
| Breaking current Mishava domains | Do not move any domain until temporary Vercel URL is verified |
| Deploying stale code | Verify the clean repo includes the latest Mishava V2 commit and docs before Vercel import |
| Losing deployment history | Keep `dsuupr-am` intact until the clean project is live and verified |
| Confusing production branch | Set and document the clean repo production branch explicitly before deployment |
| Missing env vars | Use a checklist and verify all required vars are SET before testing |
| Premature domain migration | Move only `shopping.mishava.org` first, verify, then proceed one domain at a time |

## Exact Manual Steps For Jos

### Phase 1: Prepare Clean GitHub Repo

1. Create a new GitHub repository named one of:
   - `Mishava2013/mishava-v2`
   - `Mishava2013/mishava-platform`
2. Keep it private until deployment is verified.
3. Copy the current Mishava V2 code into the clean repo or transfer/rename the existing repo only if Jos is comfortable with GitHub redirect behavior.
4. Confirm the clean repo default branch, preferably `main`.
5. Confirm the latest Mishava V2 work is present:
   - Shopping toilet paper preview
   - supplier transparency
   - sign-in modal work
   - NGO public page polish
   - audit docs

### Phase 2: Create Clean Vercel Project

1. In Vercel, create a new project named `mishava-v2`.
2. Import/connect the clean GitHub repo.
3. Set framework to Next.js.
4. Use default build command unless the dashboard requires explicit:
   - `npm run build`
5. Do not attach custom domains yet.
6. Do not modify `dsuupr-am`.

### Phase 3: Add Env Vars To New Project Only

Add Production env vars only to the new `mishava-v2` Vercel project:

| Env var | Required value source |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Clean V2 Supabase project `mishava-v2-dev / snnscnodegbyqexnopvf` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same clean V2 project |
| `SUPABASE_SERVICE_ROLE_KEY` | Same clean V2 project |
| `NEXT_PUBLIC_SITE_URL` | Temporary Vercel URL first, then final Mishava domain after cutover |

Do not use values from:

```text
old mishava / tghbfautnxblfxrtkdqb
```

Add other env vars only if required by current app runtime, and only to the new `mishava-v2` project.

### Phase 4: Temporary URL Deployment Verification

Deploy the new project to its generated Vercel URL, such as:

```text
https://mishava-v2-*.vercel.app
```

Verify before adding domains:

- `/shopping`
- `/shopping/categories/toilet-paper`
- Kirkland product detail
- Cashmere product detail
- Purex product detail
- `/ngo`
- `/support`
- `/legal/security`
- `/legal/accessibility`
- `/auth/sign-in` or sign-in modal state
- Protected app/admin routes block correctly

Required pass conditions:

- Shopping does not return Supabase `401 Invalid API key`.
- Toilet paper products load.
- No final Mishava Scores are invented.
- No medical claims appear.
- No paid ranking/no commission language remains visible.
- NGO public page renders.
- Protected routes remain protected.
- Build logs complete successfully.

### Phase 5: Move First Domain Only

After the temporary URL is verified:

1. Move only `shopping.mishava.org` from `dsuupr-am` to the new `mishava-v2` Vercel project.
2. Do not move root `mishava.org` yet.
3. Wait for Vercel domain verification/SSL.
4. Test:
   - `https://shopping.mishava.org`
   - toilet paper category
   - Kirkland detail
   - Cashmere detail
   - Purex detail
5. If it fails, move only `shopping.mishava.org` back or fix the new project before touching other domains.

### Phase 6: Move Remaining Mishava Domains One At A Time

Move remaining Mishava domains only after `shopping.mishava.org` is healthy:

1. `ngo.mishava.org`
2. `support.mishava.org`
3. `trust.mishava.org`
4. `app.mishava.org`
5. `business.mishava.org`
6. `corporate.mishava.org`
7. `admin.mishava.org`
8. `api.mishava.org`
9. `gov.mishava.org`
10. `research.mishava.org`
11. `media.mishava.org`
12. `mishava.org`
13. `www.mishava.org`

For each domain:

- Move only one domain.
- Wait for verification/SSL.
- Test the mapped page.
- Stop if any issue appears.

## What Codex Can Do

Codex can safely help with:

- Preparing a migration checklist.
- Verifying the clean repo contents.
- Running local tooling checks.
- Creating a clean branch/tag for the handoff.
- Comparing clean repo commit to current local commit.
- Verifying the temporary Vercel URL after Jos creates the new project.
- Running read-only Vercel checks after setup.
- Capturing screenshots after the temporary URL and live domain work.
- Writing result docs for each verification step.

Codex should not do without explicit approval:

- Create or delete Vercel projects.
- Add, remove, or edit Vercel env vars.
- Move domains.
- Change DNS.
- Trigger production deploys.
- Change Supabase settings.
- Touch the old Supabase project.

## What Jos Must Do Manually

Jos should manually handle:

- Creating the clean GitHub repo or deciding to rename/duplicate the current repo.
- Creating the new Vercel `mishava-v2` project.
- Connecting the Vercel project to the clean GitHub repo.
- Adding Production env vars from the clean Mishava V2 Supabase project.
- Triggering the first deployment.
- Moving domains only after temporary URL verification.
- Confirming Cloudflare/Vercel domain state.
- Confirming the old Supabase project is not used.

## How To Avoid Breaking Dsuupr

- Do not touch `dsuupr.com`.
- Do not change Cloudflare records for Dsuupr.
- Do not modify the `dsuupr` Vercel project unless the task is explicitly about Dsuupr.
- Do not remove generated Vercel aliases from the `dsuupr` project.
- Do not copy Dsuupr env vars into Mishava.
- Do not copy Mishava env vars into Dsuupr.
- Keep `dsuupr-am` intact until the clean Mishava project is proven.

## How To Avoid Touching Old Supabase

Use only:

```text
mishava-v2-dev / snnscnodegbyqexnopvf
```

Avoid:

```text
old mishava / tghbfautnxblfxrtkdqb
```

Before entering env vars in Vercel:

1. Open the Supabase dashboard for `mishava-v2-dev`.
2. Confirm project ref is `snnscnodegbyqexnopvf`.
3. Copy URL and keys from that project only.
4. Verify the Vercel `NEXT_PUBLIC_SUPABASE_URL` contains `snnscnodegbyqexnopvf`.
5. Never paste or print secret values into docs, chat, screenshots, or commits.

## Verification Before Moving Domains

Temporary Vercel URL must pass:

| Area | Required check |
| --- | --- |
| Build | Vercel build succeeds |
| Env | Shopping does not fail with Supabase `401 Invalid API key` |
| Shopping landing | Loads product/category preview |
| Toilet paper category | Loads Costco/Kirkland, Cashmere, Purex where expected |
| Product detail | Shows supplier/manufacturer evidence gaps honestly |
| Scores | No final scores are invented |
| Medical language | No Crohn's or medical suitability claims |
| Payment firewall | No paid ranking/no commission remains visible |
| NGO | `/ngo` renders |
| Support/legal | Support and legal pages render |
| Auth/protection | Protected routes remain protected |
| Mobile | Shopping category and product detail are usable |

Only after this passes should `shopping.mishava.org` move.

## Suggested Handoff Checklist

Before Jos creates the new Vercel project:

- [ ] Current local repo has a clean commit to use as source.
- [ ] Clean GitHub repo name selected.
- [ ] Clean repo contains latest Mishava V2 work.
- [ ] New Vercel project name selected: `mishava-v2`.
- [ ] Clean V2 Supabase project confirmed: `snnscnodegbyqexnopvf`.
- [ ] Old Supabase project explicitly excluded: `tghbfautnxblfxrtkdqb`.
- [ ] No custom domains attached to new Vercel project yet.

Before moving `shopping.mishava.org`:

- [ ] Temporary Vercel URL works.
- [ ] Shopping/toilet paper works.
- [ ] Product details work.
- [ ] Supabase envs are correct.
- [ ] Screenshots captured.
- [ ] Rollback path understood.

## Final Recommendation

Use a clean parallel setup:

1. Create clean GitHub repo.
2. Create clean Vercel project `mishava-v2`.
3. Add clean V2 Supabase env vars to the new project only.
4. Verify temporary Vercel URL.
5. Move `shopping.mishava.org` first.
6. Move remaining Mishava domains only after `shopping.mishava.org` is healthy.

Do not modify or delete `dsuupr-am` during this process. Treat it as the current fallback until the clean Mishava V2 project is proven.
