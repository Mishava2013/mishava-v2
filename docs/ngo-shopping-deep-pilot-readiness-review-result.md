# NGO + Shopping deep pilot-readiness review result

Date: 2026-06-16

## 1. Executive summary

This run reviewed and repaired pilot-readiness issues across Mishava NGO and Mishava Shopping for users with low reading confidence, low computer confidence, and possible mobile use.

NGO status: ready after small operational fixes for a supported pilot. The core repo-side flows are present and guarded: account access, organization setup, team invites, roles, evidence, file status, AI suggestion-only behavior, report drafts, private report sharing, shared recipient view, and support/legal pages. The biggest remaining operational blocker is live email/auth completion: production email delivery, confirmation, invite delivery, password reset, and inbox handling still need a live provider/domain verification pass.

Shopping status: ready for a guided early preview. The toilet paper flow has real products, score-pending language, source/evidence cards, visible missing-evidence states, no final scores, no medical claims, no paid ranking, and a new visible product feedback path. It is not public-beta ready because evidence coverage is still incomplete and the first-user account/priorities flow still deserves live browser testing with a non-technical user.

Major blockers:
- NGO broad self-serve is blocked by live email/auth operations and hands-on browser/mobile verification.
- Shopping broad public beta is blocked by more complete evidence coverage, more user testing, and a stronger correction/review workflow.
- Local `npm run typecheck`, `npm run lint`, and `npm run build` stalled in this environment with no diagnostic output after several minutes. `npm test` passed and live HTTP route checks passed.

## 2. Changes made

### Shopping product feedback and clarity

Files changed:
- `src/app/shopping/products/[slug]/page.tsx`
- `scripts/ngo-shopping-deep-pilot-readiness.test.mjs`
- `scripts/release-4-shopping.test.mjs`

What changed:
- Added a visible "Help us fix mistakes" section to product detail pages.
- Added a mailto-based "Report a problem" path for wrong product details, missing company/manufacturer/supplier information, broken source links, outdated sources, confusing evidence, or bad images.
- Clarified that reporting a problem does not change ranking, score, visibility, or trust outcomes.
- Replaced technical labels with friendlier wording:
  - "Maker information"
  - "Supplier information"
  - "What Mishava found"
  - "What Mishava still needs"
  - "Not found yet" for unknown confidence
- Simplified source/evidence explanation so a normal user can understand that a source may prove one thing while leaving other questions unanswered.

Why it matters:
- A pilot user can now recover when product information looks wrong instead of abandoning the flow or assuming Mishava is broken.
- Missing evidence is framed as a normal part of Mishava's work, not as a hidden failure.

How to test:
1. Open `https://shopping.mishava.org/shopping/categories/toilet-paper`.
2. Open Kirkland, Cashmere, or Purex.
3. Confirm product page shows score pending / evidence gap language.
4. Scroll to "Help us fix mistakes."
5. Click "Report a problem" and confirm it opens an email draft to support with product/page context.

### NGO evidence, file safety, reports, and sharing copy

Files changed:
- `src/app/org/evidence/page.tsx`
- `src/app/org/reports/page.tsx`
- `src/app/org/reports/[reportId]/page.tsx`
- `src/app/shared/ngo-reports/[grantId]/page.tsx`
- `scripts/ngo-shopping-deep-pilot-readiness.test.mjs`
- `scripts/ngo-full-scale-slice-14-malware-file-security.test.mjs`
- `scripts/release-3-slice-3.test.mjs`
- `scripts/ngo-full-scale-slice-7-legal-trust-accessibility-security.test.mjs`
- `scripts/ngo-pilot-readiness-slice-2.test.mjs`

What changed:
- Reworded evidence page copy around private files, held-for-review files, AI suggestions, and accepted evidence.
- Changed technical terms such as "metadata," "lifecycle," and "quarantine" toward "details," "use status," and "held for review."
- Reworded report pages so users see reports as private drafts and understand raw files stay private by default.
- Reworded share grants as "share links" and "turn off link."
- Reworded recipient labels from "Lifecycle" to "Use status."

Why it matters:
- NGO pilot users are less likely to misunderstand whether files are public, whether an AI suggestion is final, or whether a share link opens the whole workspace.

How to test:
1. Sign into an NGO account.
2. Visit `/org/evidence`.
3. Add or review an evidence item and confirm file safety language says "held for review" where appropriate.
4. Visit `/org/reports`.
5. Open a report and confirm private draft, raw file privacy, share link, and turn-off-link language.

### NGO team and onboarding copy

Files changed:
- `src/app/org/team/page.tsx`
- `src/app/ngo/onboarding/page.tsx`
- `scripts/ngo-full-scale-slice-10b-invite-email.test.mjs`
- `scripts/ngo-shopping-deep-pilot-readiness.test.mjs`

What changed:
- Simplified team invite and role language.
- Replaced "Invite link fallback" with "Backup invite link."
- Made failed/missing email delivery clearer.
- Simplified NGO onboarding into "Create your NGO profile" and "Basic profile."
- Reworded visibility and evidence guidance for less technical users.

Why it matters:
- A supported NGO pilot user can understand what the invite link is for, what to do if email does not arrive, and how to start a profile without needing platform vocabulary.

How to test:
1. Visit `/org/team`.
2. Create an invite.
3. Confirm copy explains email status and backup invite link.
4. Visit `/ngo/onboarding`.
5. Confirm profile setup language is plain and non-public-by-default.

### Account copy

Files changed:
- `src/app/auth/sign-up/page.tsx`
- `scripts/ngo-shopping-deep-pilot-readiness.test.mjs`

What changed:
- Removed internal provider wording from sign-up copy.
- Added plain email-confirmation guidance: if Mishava asks for confirmation, open the email first and return.
- Labeled password as "at least 6 characters."

Why it matters:
- This avoids exposing "Supabase Auth" language to a first-time user and reduces confusion during account creation.

How to test:
1. Visit `/auth/sign-up`.
2. Confirm the page explains email/password in normal user language.

## 3. Bugs/issues found but not fixed

| Product area | Severity | User impact | Recommended fix | Blocks pilot? |
|---|---:|---|---|---|
| NGO live email/auth | High | Users may not receive confirmation, password reset, or invite emails without live provider/domain verification. | Complete Resend/domain and Supabase custom SMTP verification, then run inbox tests. | Blocks broad self-serve; supported pilot can proceed with manual monitoring. |
| Local tooling | Medium | `typecheck`, `lint`, and `build` can stall locally, slowing safe release work. | Diagnose file watcher/cache/tooling issue separately; avoid adding features until reliable. | Does not block supported pilot because tests passed and live routes responded, but should be cleaned up. |
| NGO mobile browser walkthrough | Medium | Some dense NGO workspace surfaces may still be hard for low-confidence mobile users. | Run the final NGO mobile checklist with a real phone and simplify any crowded cards/forms. | Blocks broad self-serve; not supported pilot. |
| Shopping evidence completeness | Medium | Users may see many "still needs evidence" states and wonder whether Mishava is incomplete. | Add more reviewed evidence sources and clearer review cadence for top toilet paper products. | Does not block guided preview; blocks public beta. |
| Shopping account/priorities live user test | Medium | A real older user may still need handholding to understand why account/priorities matter. | Run one guided session and record friction points before broad invite. | Does not block guided preview. |
| Business/support/trust subdomain product surfaces | Low | Some domains route to reserved or limited pages rather than complete products. | Keep reserved-page language honest until those products are built. | No. |

## 4. Plain-language/usability findings

Fixed:
- Shopping now has a visible correction path and friendlier evidence labels.
- NGO evidence language now says "held for review" instead of relying on quarantine-style wording.
- NGO reports now use "share link" and "turn off link" instead of access-grant language.
- NGO team pages now use "backup invite link" and clearer email-status language.
- Sign-up copy no longer exposes internal auth-provider wording.

Still needs attention:
- NGO workspace still has some naturally complex workflows: roles, reports, accepted claims, uploads, and sharing. A supported pilot should include a short live walkthrough.
- Shopping should keep the first guided preview focused: open Shopping, choose Toilet Paper, open three products, read "what Mishava found" and "what Mishava still needs."
- Error states should be reviewed in the browser after live auth/email is fully configured, especially email confirmation, reset, invite acceptance, and expired/revoked invite states.

## 5. Accessibility findings

Fixed or preserved:
- Existing tests confirm skip link, focus states, footer navigation labels, and print/report structure.
- Shopping product detail feedback controls use normal links/buttons and visible text.
- Copy changes avoid color-only status meaning by adding plain labels like "held for review," "private," and "score not ready yet."

Remaining:
- A full keyboard/screen-reader browser pass was not completed in this run.
- Mobile visual screenshots were not captured in this run.
- Some form-heavy NGO pages should still be checked for focus order, field-specific error association, and tap target size during the supported-pilot browser checklist.

## 6. Security/privacy/trust findings

Confirmed by tests and review:
- No final Mishava Scores are invented.
- Missing evidence remains visible as an evidence gap.
- Draft/rejected claims do not enter report trust summaries.
- Payment and plan tier do not change trust outcomes.
- Shopping places-to-buy sorting excludes commission, affiliate, sponsorship, and paid placement.
- AI evidence parsing remains suggestion-only and requires human review.
- Outside scorecards remain evidence references only, not Mishava Scores.
- Shopping priorities do not create a fake values score without evidence.
- Raw NGO files remain private by default and are not exposed in shared report views.
- Shared report views are limited to the selected report and allowed evidence summaries.
- Revoked and expired share links are blocked.
- Org routes are protected by middleware and server-side membership checks; the current-org cookie is not treated as authority.
- Admin/support tooling is read-only and cannot silently alter trust outcomes.

Remaining:
- Live email/auth must be verified in production.
- Admin/support dashboard privacy should be rechecked with real pilot data before broad self-serve.
- Client/browser-only visual checks do not replace server-side access checks; current tests cover server-side route and helper boundaries, but manual real-account tests should still be run.

## 7. Domain/routing findings

| Domain | Current detected destination/config | Intended destination if known | Risk/confusion | Recommended action |
|---|---|---|---|---|
| `mishava.org` | Cloudflare IPs `104.21.33.81`, `172.67.160.125` | Main Mishava public entry / multiproduct site | Root may not always mirror the clean Shopping-specific deployment. | Keep as managed root; verify current homepage before public sharing. |
| `shopping.mishava.org` | CNAME to Vercel DNS `92162bc12b42416d.vercel-dns-017.com`, resolves to Vercel IPs `64.29.17.1`, `216.198.79.1`; HTTP 200 for `/` and toilet-paper category | Clean Shopping preview on `mishava-v2` | Low. This is the clean guided-preview URL. | Use `https://shopping.mishava.org` for Shopping pilot. |
| `ngo.mishava.org` | CNAME to same Vercel DNS, resolves to Vercel IPs `216.198.79.65`, `64.29.17.65`; HTTP 200 | NGO public/supported-pilot surface | Medium if users expect fully self-serve auth/email before email setup is complete. | Keep for supported pilot only until live email/auth is verified. |
| `app.mishava.org` | CNAME to same Vercel DNS, resolves to Vercel IPs `64.29.17.1`, `216.198.79.1` | Logged-in app router | Medium: users may land in shared app surface before product-specific onboarding. | Verify product-specific sign-in/sign-up behavior before broad sharing. |
| `business.mishava.org` | CNAME to same Vercel DNS, resolves to Vercel IPs `64.29.17.65`, `216.198.79.65` | Future Business/Local surface | Medium: product is not built. | Keep as reserved/coming-soon; do not market as live product. |
| `support.mishava.org` | CNAME to same Vercel DNS, resolves to Vercel IPs `216.198.79.65`, `64.29.17.65` | Support / correction guidance | Low to medium depending on content completeness. | Verify support and corrections routes render useful contact paths. |
| `trust.mishava.org` | CNAME to same Vercel DNS, resolves to Vercel IPs `216.198.79.65`, `64.29.17.65` | Trust/methodology/legal transparency | Low if conservative language is preserved. | Keep no-certification/no-final-score language visible. |

Live HTTP checks run:
- `https://shopping.mishava.org` returned HTTP 200.
- `https://shopping.mishava.org/shopping/categories/toilet-paper` returned HTTP 200.
- `https://ngo.mishava.org` returned HTTP 200.

## 8. Pilot-readiness checklist

### Mishava NGO supported pilot

Status: ready after small operational fixes.

Ready:
- Public NGO surface exists.
- Signup/signin/reset routes exist.
- Organization creation/onboarding exists.
- Current organization switching and stale/wrong-org protections exist.
- Team invite, role changes, revoke/remove, and last-owner protections exist.
- Evidence creation/edit/archive and file safety status exist.
- AI suggestions remain suggestion-only.
- Private reports, print-ready views, CSV/download controls, and share links exist.
- Shared report view is scoped and revoked/expired links are blocked.
- Legal/privacy/accessibility/security/corrections/support pages exist.

Need before pilot:
- Verify production email confirmation, invite email, and password reset inbox behavior.
- Run one real account through NGO onboarding, evidence, report, share, and revoke.
- Keep pilot supported by a person who can help if email or invite steps confuse the user.

### Mishava NGO broad self-serve

Status: not ready yet.

Needed:
- Production email/auth fully verified.
- Browser/mobile checklist completed.
- Support escalation path tested.
- Backup/incident/file review runbooks exercised.
- More user-facing help around evidence/reports/roles.
- Stripe/payment intentionally remains out of scope for this review.

### Mishava Shopping guided preview

Status: ready for a guided early preview.

Ready:
- Shopping live domain responds.
- Toilet paper category is available.
- Product pages show no final scores.
- Evidence/gaps are visible.
- No medical claims are shown.
- No paid ranking/no commission language remains visible.
- Mishava-is-not-the-store language remains visible.
- Product reporting/correction path now exists.

Need before sharing with a first user:
- Use a desktop-first guided walkthrough.
- Tell the user this is an early preview that shows what Mishava found and what is still missing.
- Confirm account/priorities popup behavior once more in the live browser.

### Mishava Shopping broader public beta

Status: not ready yet.

Needed:
- More complete evidence coverage.
- More source review and stale-source handling.
- More senior-friendly testing with non-technical users.
- Stronger product correction workflow than mailto.
- More polished mobile walkthrough.
- No final scores until methodology and reviewed evidence support them.

## 9. Manual test script

### Shopping guided preview script

1. Open `https://shopping.mishava.org`.
2. Confirm you can explain the page in one sentence: Mishava compares products by evidence, not ads.
3. Click Toilet Paper.
4. Confirm products load and no final score numbers appear.
5. Open Kirkland.
6. Read "What Mishava found."
7. Read "What Mishava still needs."
8. Confirm Costco/private-label owner is not treated as manufacturer unless evidence supports it.
9. Confirm missing manufacturer/supplier evidence is shown as missing.
10. Confirm "Mishava is not the store" is visible near places to buy.
11. Confirm no paid ranking/no commission language is visible.
12. Confirm no medical suitability claim appears.
13. Click "Report a problem" and confirm an email draft opens with product/page context.
14. Repeat product checks for Cashmere and Purex.
15. Try creating an account from Shopping and confirm sign-up/sign-in language stays Shopping-friendly and returns to Shopping/Priorities.

### NGO supported-pilot script

1. Open `https://ngo.mishava.org`.
2. Start signup/request access.
3. Confirm the confirmation email arrives, if email confirmation is enabled.
4. Sign in.
5. Create an NGO profile.
6. Open the organization switcher and confirm only active organizations appear.
7. Invite a teammate.
8. Confirm email status is clear.
9. Use the backup invite link only if email does not arrive.
10. Accept invite as the correct user.
11. Change role and confirm role language is understandable.
12. Try removing/revoking a member or invite.
13. Confirm last-owner protection blocks unsafe removal.
14. Add evidence.
15. Upload a file and confirm file safety language is understandable.
16. Edit and archive evidence.
17. Confirm archived evidence is not selected for new report work by mistake.
18. Create a report draft.
19. Confirm no public score is invented.
20. Preview/print the report.
21. Create a share link.
22. Open shared report in another browser/session.
23. Confirm raw files and unrelated reports are not exposed.
24. Turn off the share link.
25. Confirm the old link no longer works.
26. Visit legal, privacy, accessibility, security, corrections, and support pages.

## 10. Final recommendation

Mishava NGO: ready after small fixes for a supported pilot. Do not launch as broad self-serve until live email/auth is verified and one full real-account browser/mobile pilot run passes.

Mishava Shopping: ready now for a guided early preview, preferably desktop-first. Do not call it public beta yet. Keep score-pending and missing-evidence language visible.

## Verification

Passed:
- `npm test` passed: 161/161.
- `supabase migration list --linked` passed and local/remote migrations are aligned through `202605260009`.
- Live HTTP route checks returned 200 for Shopping root, Shopping toilet paper category, and NGO root.

Stalled / documented:
- `npm run typecheck` started but produced no output after several minutes; stopped the process.
- `npm run lint` started but produced no output after several minutes; stopped the process.
- `npm run build` started but produced no output after several minutes; stopped the process.

Scope confirmations:
- No Stripe/payment implementation was added.
- No Business/Local/Gov/Corporate/Plus product surface was built.
- No final scoring methodology or final Mishava Scores were added.
- No fake evidence, fake suppliers, fake manufacturers, fake products, fake images, or fake scores were added.
- No affiliate, commission, paid ranking, or payment influence was added.
- No Supabase migrations were added or changed.
- The old Supabase project was not touched.
