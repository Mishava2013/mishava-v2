# Dsuupr / Mishava Project Separation Audit

Date: 2026-06-01

## Scope

This was a read-only separation audit. No code was changed, no DNS records were changed, no domains were moved, no Vercel environment variables were added or removed, no deployment was triggered, no Supabase migrations were touched, and neither Supabase project was touched.

## Executive Summary

Dsuupr and Mishava are partly separated, but the setup is confusing and not clean enough.

The strongest finding is:

- `dsuupr.com` is serving a Dsuupr app through Cloudflare/OpenNext.
- Mishava custom domains are attached to a Vercel project named `dsuupr-am`.
- The local repo is Mishava V2 app code, but the GitHub repository and linked Vercel project are still named `dsuupr-am`.
- The Mishava Vercel project currently has Supabase Production env vars set, but live Shopping fails with Supabase `401 Invalid API key`, which strongly suggests the Vercel Production Supabase values are wrong, mismatched, truncated, or copied from the wrong project.

Risk rating: **confusing and operationally unsafe until env/project naming is cleaned up**.

This does not look like Dsuupr and Mishava are intentionally sharing the same production app. It looks like Mishava V2 work was built inside a confusingly named GitHub/Vercel project (`dsuupr-am`), while the real Dsuupr custom domain remains separate.

## 1. Local Repo Identity

| Item | Finding |
| --- | --- |
| Current folder | `/Users/caitlinferguson/Documents/Mishava V2.0` |
| Git remote | `https://github.com/Mishava2013/dsuupr-am.git` |
| Current branch | `master` |
| Latest commit at audit start | `06d989a Document Vercel Mishava recovery audit` |
| Package name | `mishava-v2` |
| Code identity | Mishava V2 app code |
| Repo naming | Confusing: GitHub repo is named `dsuupr-am` |

Plain-English finding:

The local folder is a Mishava V2 codebase. It contains Mishava Shopping, NGO, legal, support, subdomain routing, Supabase V2 docs, and Mishava-specific app code. However, it is connected to a GitHub repo named `Mishava2013/dsuupr-am`, which makes it look like a Dsuupr repo from the outside.

This is a naming and project-identity problem, not evidence that the local folder is currently Dsuupr product code.

## 2. Vercel Project Identity

Local `.vercel/project.json` points to:

| Field | Value |
| --- | --- |
| Vercel project name | `dsuupr-am` |
| Vercel project id | `prj_nspqvEI8jNXP53DyG4urAzRWAXAr` |
| Vercel team/org id | `team_AQ4nC6Eu6llPwPfeMeeh7JNC` |

Read-only Vercel project inspection found:

| Project | ID | Latest production URL | Node | Appears to be |
| --- | --- | --- | --- | --- |
| `dsuupr-am` | `prj_nspqvEI8jNXP53DyG4urAzRWAXAr` | `https://mishava.org` | 24.x | Mishava V2 app in confusingly named project |
| `dsuupr` | `prj_aQeWNu8l9xh6KBMQUantPDAxd5Ok` | `https://dsuupr.vercel.app` | 20.x | Dsuupr Vercel project, likely legacy/stale relative to `dsuupr.com` |

The Vercel CLI did not expose connected GitHub repo metadata or exact production commit SHA in read-only output. The deployment aliases and local linkage strongly indicate `dsuupr-am` is the Mishava V2 Vercel project, but Jos should verify the connected Git repository in the Vercel dashboard before renaming or moving anything.

## 3. Vercel Project Separation

| Vercel project | Connected Git repo | Production branch | Domains / aliases seen | Production deployment status | Classification |
| --- | --- | --- | --- | --- | --- |
| `dsuupr-am` | Needs dashboard confirmation; local repo remote is `Mishava2013/dsuupr-am` | Needs dashboard confirmation; aliases include `git-main` and feature/tag branch deployments | `mishava.org`, `www.mishava.org`, `shopping.mishava.org`, `ngo.mishava.org`, `app.mishava.org`, `business.mishava.org`, `corporate.mishava.org`, `support.mishava.org`, `trust.mishava.org`, `admin.mishava.org`, `api.mishava.org`, `gov.mishava.org`, `research.mishava.org`, `media.mishava.org`, `dsuupr-am.vercel.app` | Ready, but live Shopping routes return 500 due Supabase `401 Invalid API key` | Mishava V2 project with bad/confusing name |
| `dsuupr` | Needs dashboard confirmation | Appears to have `git-main` alias | `dsuupr.vercel.app`, `dsuupr-mishava2013s-projects.vercel.app`, `dsuupr-git-main-mishava2013s-projects.vercel.app` | Ready | Dsuupr Vercel project, but not serving `dsuupr.com` based on current checks |
| `mishava-ngo` | Not found in Vercel project list | Not found | Not found | Not found | Not present in current Vercel team list |
| `Mishava-Platform` or similar | Not found in Vercel project list | Not found | Not found | Not found | Not present in current Vercel team list |

## 4. Domain Separation

### Dsuupr Domains

| Domain | Observed DNS / host behavior | Vercel project ownership observed | Status |
| --- | --- | --- | --- |
| `dsuupr.com` | Resolves to Cloudflare IPs and serves a Dsuupr-branded Next/OpenNext app (`Dsuupr | Choose Your Workspace`) | Not shown in Vercel aliases for this team | Appears separate from Mishava Vercel project |
| `www.dsuupr.com` | No DNS answer during audit; `curl` could not resolve/connect | Not shown in Vercel aliases | Needs DNS/dashboard review if `www` should work |
| Dsuupr subdomains | None discovered in Vercel alias list during this audit | Unknown | Needs manual inventory if more Dsuupr subdomains exist |
| `dsuupr.vercel.app` | Serves Vercel deployment for project `dsuupr` | `dsuupr` | Vercel-generated Dsuupr app URL |

### Mishava Domains

| Domain | Observed DNS / host behavior | Vercel project ownership observed | Status |
| --- | --- | --- | --- |
| `mishava.org` | Resolves through Cloudflare proxy; Vercel also shows it aliased to `dsuupr-am` deployment | `dsuupr-am` alias | Works at HTTP level, but project naming is confusing |
| `www.mishava.org` | Resolves through Cloudflare proxy; Vercel shows alias to `dsuupr-am` | `dsuupr-am` alias | Works at HTTP level |
| `shopping.mishava.org` | Resolves to Vercel DNS; returns HTTP 500 from Mishava Shopping due Supabase `401 Invalid API key` | `dsuupr-am` alias | Domain reaches app, runtime env is wrong |
| `ngo.mishava.org` | Resolves to Vercel DNS; `/ngo` responds 200 | `dsuupr-am` alias | Reaches Mishava app |
| `app.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Needs auth/live route verification after env fix |
| `business.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `corporate.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `support.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `trust.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `admin.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list; admin route must stay protected |
| `api.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `gov.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `research.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |
| `media.mishava.org` | Vercel alias to `dsuupr-am` | `dsuupr-am` alias | Reaches Mishava project per alias list |

Domain finding:

Mishava domains are attached to the confusingly named `dsuupr-am` Vercel project. Dsuupr custom domain `dsuupr.com` does not appear attached to that Vercel project and appears to be served separately by Cloudflare/OpenNext.

## 5. Supabase Separation

Expected Mishava V2 Supabase project:

| Purpose | Project name | Ref |
| --- | --- | --- |
| Mishava V2 | `mishava-v2-dev` | `snnscnodegbyqexnopvf` |
| Old Mishava project | `mishava` | `tghbfautnxblfxrtkdqb` |

Local Supabase linkage:

| Check | Finding |
| --- | --- |
| `supabase/.temp/project-ref` | `snnscnodegbyqexnopvf` |
| `supabase status` | Could not inspect local Docker status because Docker was not running; no remote project was modified |
| Repo docs | Consistently reference `mishava-v2-dev / snnscnodegbyqexnopvf` as the clean V2 project and old `mishava / tghbfautnxblfxrtkdqb` as not to be touched |

### Vercel Env Separation Table

Values were not printed. This table reports only presence and inferred target status.

| Vercel project | Env var | Status | Target classification |
| --- | --- | --- | --- |
| `dsuupr-am` | `NEXT_PUBLIC_SUPABASE_URL` | SET | UNKNOWN; live runtime suggests wrong or mismatched |
| `dsuupr-am` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SET | UNKNOWN; live runtime suggests wrong or mismatched |
| `dsuupr-am` | `SUPABASE_SERVICE_ROLE_KEY` | SET | UNKNOWN; live runtime suggests wrong or mismatched |
| `dsuupr-am` | `NEXT_PUBLIC_SITE_URL` | SET | UNKNOWN; should be manually verified |
| `dsuupr` | `NEXT_PUBLIC_SUPABASE_URL` | MISSING | Not configured in Vercel Production |
| `dsuupr` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | MISSING | Not configured in Vercel Production |
| `dsuupr` | `SUPABASE_SERVICE_ROLE_KEY` | MISSING | Not configured in Vercel Production |
| `dsuupr` | `NEXT_PUBLIC_SITE_URL` | MISSING | Not configured in Vercel Production |

Runtime evidence:

`shopping.mishava.org` and related Shopping routes return HTTP 500. Vercel logs show:

```text
Error: Supabase shopping_products request failed: 401 {"message":"Invalid API key","hint":"Double check your Supabase `anon` or `service_role` API key."}
```

That means `dsuupr-am` has Supabase env vars present, but at least one of the Supabase URL/key values is invalid for the target project. The audit cannot say whether it points to Mishava V2, old Mishava, or a different project without seeing values, which this audit intentionally did not print.

## 6. Risk Assessment

### Can a Dsuupr deploy affect Mishava?

Possibly, if someone deploys Mishava code through the confusing `dsuupr-am` project or pushes to the repo/branch connected to Mishava domains. The custom Dsuupr domain `dsuupr.com` appears separate, but the project naming makes mistakes easier.

### Can a Mishava deploy affect Dsuupr?

It should not affect `dsuupr.com` based on this audit, because `dsuupr.com` appears to be served separately through Cloudflare/OpenNext and is not listed as a Vercel alias on `dsuupr-am`.

However, a Mishava deploy can affect Vercel URLs that still contain `dsuupr-am` in their generated names. That is confusing but not the same as affecting the real `dsuupr.com` site.

### Are Mishava domains attached to a Dsuupr project?

They are attached to a Vercel project named `dsuupr-am`.

Functionally, that project appears to be the Mishava V2 app. Operationally, the name is dangerous because it looks like a Dsuupr project.

### Are Dsuupr domains attached to a Mishava project?

No custom Dsuupr domain was observed on the Mishava-linked Vercel project.

`dsuupr.com` resolves through Cloudflare and serves a Dsuupr-branded app. `dsuupr.vercel.app` belongs to the separate Vercel project `dsuupr`.

### Are both using the same Supabase project?

No evidence shows that both are using the same Supabase project.

Observed:

- Mishava local repo is linked to `snnscnodegbyqexnopvf`.
- `dsuupr-am` has Supabase Production env vars set, but their target is UNKNOWN and currently invalid/mismatched at runtime.
- `dsuupr` Vercel project has no Production env vars.
- `dsuupr.com` is not served by the audited Vercel projects, so its runtime env cannot be verified from this audit.

### Are any production env vars mixed?

Likely yes or at least misconfigured for `dsuupr-am`.

The strongest evidence is the live Supabase `401 Invalid API key` from Mishava Shopping. That usually means the Supabase URL and key do not belong together, the key was copied incorrectly, or the wrong project's key was used.

### Overall setup status

Status: **confusing and operationally unsafe**.

Not because Dsuupr and Mishava are definitely sharing the same production data, but because:

- Mishava is inside a GitHub repo named `dsuupr-am`.
- Mishava domains are on a Vercel project named `dsuupr-am`.
- Exact Vercel Git source/commit could not be confirmed from CLI output.
- Production Supabase env values are set but currently invalid/mismatched.
- Dsuupr has a separate live Cloudflare/OpenNext app, which makes the Vercel `dsuupr` and `dsuupr-am` naming even more confusing.

## 7. Recommended Recovery Path

Do not move domains first.

The safest path is one step at a time:

1. **Freeze Vercel/DNS/domain moves until env identity is corrected.**
2. In Vercel dashboard, open `dsuupr-am` and manually verify:
   - connected GitHub repo,
   - production branch,
   - latest deployment source commit,
   - Production `NEXT_PUBLIC_SUPABASE_URL`,
   - Production `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   - Production `SUPABASE_SERVICE_ROLE_KEY`,
   - Production `NEXT_PUBLIC_SITE_URL`.
3. Correct `dsuupr-am` Production Supabase env values so they all belong to `mishava-v2-dev / snnscnodegbyqexnopvf`.
4. Redeploy only after env values are corrected.
5. Re-test `shopping.mishava.org`.
6. After Mishava live routes work, rename the Vercel project from `dsuupr-am` to a Mishava-specific name.
7. After the Vercel project is cleanly named, decide whether to rename or migrate the GitHub repository. Do not do that during the env fix.

### Options Assessment

| Option | Recommendation | Why |
| --- | --- | --- |
| Rename confusing Vercel project only | Good after env/live verification | Low-risk cleanup once app works |
| Create a clean Mishava V2 Vercel project | Wait | Safer later, but too disruptive during current failure |
| Move Mishava domains to a clean Mishava V2 project | Wait | Higher DNS/domain risk; unnecessary until current project is proven wrong |
| Leave current project but fix env separation | Best immediate step | Directly addresses live 500 / Supabase 401 |
| Remove Mishava domains from Dsuupr project | Not yet | Current project is only Dsuupr-named; it appears to serve Mishava V2 |
| Remove Dsuupr domains from Mishava project | Not applicable based on current evidence | `dsuupr.com` was not observed on Mishava Vercel project |

## Safest Next Manual Step for Jos

Open Vercel dashboard for project `dsuupr-am` and verify/correct only the Production Supabase env values.

The values must all come from:

```text
mishava-v2-dev / snnscnodegbyqexnopvf
```

Do not use:

```text
old mishava / tghbfautnxblfxrtkdqb
```

Do not move domains until `shopping.mishava.org` stops returning Supabase `401 Invalid API key`.

## What Codex Can Safely Do Next

Codex can safely:

- Re-run read-only Vercel project/domain/log checks.
- Re-run live route checks after Jos updates env values.
- Re-run local tooling checks.
- Document whether `shopping.mishava.org` is healthy after the env fix.
- Prepare a careful rename/migration plan for the GitHub/Vercel naming cleanup.

Codex should not:

- Change DNS.
- Move domains.
- Add/remove Vercel env vars.
- Redeploy.
- Touch Supabase migrations.
- Touch either Supabase project.

## What Jos Must Do Manually

In Vercel:

- Verify the connected GitHub repo and production branch for `dsuupr-am`.
- Verify the latest deployment source commit for `shopping.mishava.org`.
- Verify/correct Production Supabase env values for `dsuupr-am`.
- Trigger a redeploy only after env values are corrected.

In Cloudflare:

- Do not move Mishava domains during this recovery step.
- Later, verify that Mishava DNS intentionally points to Vercel and Dsuupr DNS intentionally points to the Dsuupr Cloudflare/OpenNext deployment.

In Supabase:

- Confirm the clean V2 project keys for `mishava-v2-dev / snnscnodegbyqexnopvf`.
- Do not use old project `tghbfautnxblfxrtkdqb` for Mishava V2 Vercel env vars.
- Review the old project security warning separately; do not mix that remediation with this Vercel separation cleanup.

## Confirmations

- No code was changed.
- No DNS records were changed.
- No domains were moved.
- No Vercel environment variables were added, removed, or changed.
- No deployment was triggered.
- No Supabase migrations were touched.
- Neither Supabase project was touched.
