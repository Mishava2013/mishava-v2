# Mishava Infrastructure / Deployment Chat Handoff

Date: 2026-06-23

## Current Status

Mishava V2 now has a clean GitHub/Vercel path. The historical `dsuupr-am` confusion is documented and should be avoided. Future infrastructure work should preserve separation from Dsuupr and old Supabase.

## Percent Estimate

- Infrastructure/deployment alignment: **75-80%**.

## What Is Built

- Clean GitHub repo: `Mishava2013/mishava-v2`.
- Clean Vercel project: `mishava-v2`.
- Local branch aligned to `main`.
- Local Vercel linkage documented as `mishava-v2`.
- Shopping domain cut over to clean project.

## What Is Live

- `https://shopping.mishava.org`
- `https://ngo.mishava.org` reflects recent NGO deployment.

## What Is Planned Only

- Full clean domain ownership table for every Mishava subdomain.
- Retirement/rename decision for old `dsuupr-am`.
- Remote cleanup decision for old `origin`.

## What Is Blocked

- Do not move domains unless explicitly asked.
- Need manual owner confirmation before removing/renaming remotes/projects.

## What Must Not Be Touched

- DNS/domains unless explicitly asked.
- `dsuupr-am` unless explicitly approved.
- Old Supabase `tghbfautnxblfxrtkdqb`.
- Dsuupr production.

## Key Guardrails

- Push to `mishava-v2-clean/main`.
- Deploy only clean Vercel project `mishava-v2`.
- Do not print secrets.
- Report env values only as set/missing/target classification.

## Recommended First 3 Tasks

1. Create clean domain ownership table.
2. Decide whether old `origin` should be renamed to `dsuupr-am-legacy`.
3. Document live deployment verification process for NGO and Shopping.

## Key Source Docs

- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-shopping-domain-cutover-result.md`
- `docs/mishava-v2-local-repo-vercel-alignment-cleanup-result.md`
- `docs/mishava-v2-clean-branch-deployment-alignment-check.md`
- `docs/dsuupr-mishava-project-separation-audit.md`

## Suggested Opening Message

```text
We are starting the Mishava Infrastructure/Deployment focused chat. Use docs/mishava-v2-current-state-category-review.md and docs/chat-handoffs/mishava-infrastructure-deployment-chat-handoff.md as source of truth. Focus on clean GitHub/Vercel/domain/Supabase separation and verification. Do not change DNS, domains, env vars, dsuupr-am, old Supabase, or product code unless explicitly requested.
```

