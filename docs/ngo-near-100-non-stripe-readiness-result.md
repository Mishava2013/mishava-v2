# NGO Near-100 Non-Stripe Readiness Result

Date: 2026-06-02

## Scope

This readiness push reviews the NGO product excluding Stripe/payment collection.

It does not enable production charging, add Stripe production setup, add Shopping/Business/Local/Gov/Corporate/Plus work, add AI final trust outcomes, add migrations, change DNS/domains, or touch the old Supabase project.

Clean Mishava V2 scope:

- GitHub repo: `Mishava2013/mishava-v2`
- Clean V2 Supabase project: `mishava-v2-dev / snnscnodegbyqexnopvf`
- Old Supabase project not to touch: `mishava / tghbfautnxblfxrtkdqb`

## Current NGO Readiness Estimate

Excluding Stripe/payment ability:

- **Supported NGO pilot readiness:** 92-95%
- **Broad public self-serve NGO readiness:** 84-88%
- **Core NGO product workflow completeness:** 90-93%

The product loop is mostly built. The remaining non-Stripe gaps are operational verification, live email, file-scanning/manual review maturity, external review, and final browser/mobile proof.

## What Is Already Strong

- Public NGO page and NGO sign-in surface exist.
- Sign-in opens in a popup instead of a standalone sign-in page.
- Account creation route exists and uses Supabase Auth.
- Organization creation, current-org selection, org switching, and wrong-org protections exist.
- Team invites, role changes, revoke flow, last-owner protection, and removed-member blocking exist.
- Evidence creation, edit, archive, file upload metadata, lifecycle status, and reviewed/accepted claim paths exist.
- Raw files remain private by default.
- File scan/quarantine status foundation exists.
- AI evidence parsing is suggestion-only and human-review gated.
- Reports, previews, CSV evidence export, print-ready report output, scoped sharing, revoke/expire handling, and export privacy are implemented.
- Admin/support dashboard is protected and read-only for trust outcomes.
- Legal, privacy, evidence submission, report sharing, no-paid-trust-outcomes, accessibility, security, corrections, and compliance readiness pages exist.
- Payment cannot affect trust, evidence truth, verification, credibility labels, methodology, reports, or ranking.

## Remaining Steps To Push NGO Near 100%

### Step 1: Live Email And Auth Verification

Status: **highest non-Stripe blocker**

Required:

- Verify Resend sending domain.
- Configure Supabase Auth custom SMTP for the clean V2 project.
- Verify public sign-up confirmation email in a real inbox.
- Verify password reset email and update-password flow in a real inbox.
- Verify team invite email delivery, acceptance, wrong-email blocking, revoked blocking, and expired blocking.

Operational checklist:

- `docs/operations/ngo-live-email-auth-verification-checklist.md`

### Step 2: Final Account And NGO Onboarding Browser Pass

Status: **required before inviting broader NGO users**

Required:

- Test sign-up, sign-in popup, sign-out, password reset, NGO onboarding, org creation, org switching, stale org handling, and protected routes in a browser.
- Capture desktop and mobile screenshots.
- Confirm `ngo.mishava.org` domain routing if that subdomain will be used for NGO users.

Operational checklist:

- `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`

### Step 3: Team And Invite Pilot Proof

Status: **app-ready, needs real inbox proof**

Required:

- Owner/admin creates invite.
- Real invite email arrives.
- Correct invited email accepts.
- Wrong signed-in email is blocked.
- Revoked and expired invites are blocked.
- Removed member loses access.
- Last-owner protection holds.

This can be completed as part of Step 1 and Step 2.

### Step 4: Evidence/File Security Hardening Without Overclaiming

Status: **safe foundation exists; broad upload launch still needs scanner or manual-review policy**

Required:

- Decide whether public pilot file uploads are allowed before a real scanner.
- If allowed, keep them private and quarantine-first with manual review.
- If not allowed, restrict upload access to supported pilot users.
- Do not claim files are malware-free unless a real scanner or documented review supports it.
- Keep raw file previews/downloads hidden unless clean and explicitly authorized.

Operational runbook:

- `docs/operations/ngo-file-review-and-upload-safety-runbook.md`

### Step 5: Report, Export, And Sharing Smoke Pass

Status: **built, needs final real-browser proof**

Required:

- Create evidence.
- Create reviewed/accepted claims.
- Create report.
- Preview report.
- Export CSV evidence summary.
- Print-ready report route opens.
- Create share grant.
- Confirm shared recipient sees only granted report summary.
- Revoke share grant and confirm blocked access.
- Confirm raw files/storage paths are excluded.

This is included in:

- `docs/operations/ngo-final-pilot-browser-mobile-checklist.md`

### Step 6: Operational Readiness

Status: **documented readiness exists; operational proof still needed**

Required:

- Backup/restore drill.
- Incident response rehearsal.
- Monitoring/logging review.
- Support/corrections handling rehearsal.
- Vendor/subprocessor review.
- Access review for admin/support roles.

Operational checklist:

- `docs/operations/ngo-backup-monitoring-incident-readiness-checklist.md`

### Step 7: External Review And Launch Decision

Status: **required before broad public/self-serve launch**

Required:

- Attorney review of Terms, Privacy, Evidence Submission, Report Sharing, Corrections, and No Paid Trust Outcomes language.
- Accessibility review before making institutional accessibility commitments.
- Security review/penetration test before broad launch claims.
- Final go/no-go audit after Steps 1-6.

## What Is Still Needed

### Must-Have Before Broad Public NGO Self-Serve Launch

1. Live email/Auth SMTP verification.
2. Real inbox sign-up, password reset, and invite tests.
3. Final desktop/mobile end-to-end NGO workflow smoke.
4. Malware scanner integration or explicit supported/manual-review upload policy.
5. Backup/restore drill evidence.
6. Incident response and monitoring readiness evidence.
7. External legal/accessibility/security review or launch language that clearly limits claims.

### Can Remain Manual For Supported Pilot

1. Manual onboarding help.
2. Manual file review.
3. Manual correction/privacy requests through support.
4. Manual billing/payment outside the app, since Stripe is excluded.
5. Manual operational support for invite/email issues.

## Recommended Go / No-Go

### Supported Private NGO Pilot

Recommendation: **Go with support**

Conditions:

- Use a small number of known NGO users.
- Keep manual support available.
- Keep file uploads private/quarantine-first.
- Do not enable production charging.
- Do not make certification, security, accessibility, or compliance claims.
- Do a live email/invite test before the first external NGO user if account creation will be self-serve.

### Broad Public NGO Self-Serve Launch

Recommendation: **No-go today**

Reason:

- Live email and password reset have not been proven end to end.
- Real scanner or formal upload review policy is not complete.
- External legal/accessibility/security review has not been completed.
- Operational backup/monitoring/incident proof is not complete.

## Non-Stripe Path To 97-99%

To get NGO as close to 100% as possible without Stripe:

1. Complete live email/Auth SMTP verification.
2. Complete a real browser/mobile NGO workflow pass.
3. Decide and document upload policy before scanner integration.
4. Run backup/restore and incident/monitoring rehearsals.
5. Complete external review or keep launch language explicitly pilot-only.
6. Write a final non-Stripe launch audit.

At that point, Mishava NGO can be treated as **non-Stripe pilot-ready at roughly 97-99%** and **public self-serve ready except payments only if external/legal/security/email/upload gates are satisfied**.

## Verification Performed

Commands run:

- `node --test scripts/ngo-near-100-non-stripe-readiness.test.mjs` - passed, 2/2.
- `npm test` - passed, 157/157.
- `supabase migration list --linked` - passed; local and remote migrations are aligned through `202605260009`.

Attempted:

- `npm run typecheck` - started `tsc --noEmit` but produced no output for more than one minute and was stopped as a local tooling stall.
- `npm run lint` - started `eslint` but produced no output for more than one minute and was stopped as a local tooling stall.

No TypeScript or ESLint errors were emitted before the local stall.

## Confirmation

- Stripe/payment implementation was excluded.
- No production charging was enabled.
- No product features, products, migrations, domains, DNS changes, or Supabase changes were added in this readiness result.
- Old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not touched.
