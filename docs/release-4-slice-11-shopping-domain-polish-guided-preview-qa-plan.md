# Release 4 Slice 11: Shopping Domain Polish and Guided Preview QA Plan

Date: 2026-06-01

## Context

Mishava Shopping is now live on the clean Mishava V2 project path.

Clean GitHub repo:

`Mishava2013/mishava-v2`

Clean Vercel project:

`mishava-v2`

Live working routes:

- `https://shopping.mishava.org`
- `https://shopping.mishava.org/shopping`
- `https://shopping.mishava.org/shopping/categories/toilet-paper`
- Kirkland detail page
- Cashmere detail page
- Purex detail page

Slice 11 should polish and QA the live Shopping preview before inviting the first guided preview user.

## Goal

Confirm the live Shopping preview is clear, safe, and useful enough for a guided early-user walkthrough, especially for the toilet paper use case.

This is not a public beta launch. This is a controlled preview QA pass.

## Scope

Shopping live-domain polish and guided preview QA only.

Do not build:

- checkout;
- Plus;
- Local inventory;
- Business, Gov, or Corporate surfaces;
- AI scoring;
- crawler or scraping systems;
- affiliate, referral, or commission logic.

Do not add:

- fake products;
- fake sellers;
- fake evidence;
- fake images;
- fake suppliers;
- fake manufacturers;
- fake scores;
- copied outside scores presented as Mishava Scores;
- medical claims.

Do not change DNS or domains.

Do not touch `dsuupr-am`.

Do not touch the old Supabase project.

## 1. Live URL Behavior

Both URLs should remain supported if routing already works:

- `https://shopping.mishava.org`
- `https://shopping.mishava.org/shopping`

Recommended user-facing preview URL:

`https://shopping.mishava.org`

Reason:

- It is cleaner and easier to share.
- It already maps to the Shopping surface.
- It avoids making the user think there is a separate nested site path they must remember.

Implementation QA should still verify `/shopping` remains functional because links, redirects, and existing docs may still point there.

## 2. Guided Preview Path

The first guided preview user should follow this path:

1. Open `https://shopping.mishava.org`.
2. Notice the preview framing and real-data-only guardrails.
3. Open the toilet paper category.
4. Review the category page and product cards.
5. Open Kirkland.
6. Review private-label owner, retailer, manufacturer/supplier unknowns, evidence gaps, and score-pending state.
7. Return to the toilet paper category.
8. Open Cashmere.
9. Review Kruger Products context, evidence gaps, and score-pending state.
10. Return to the toilet paper category.
11. Open Purex.
12. Review Kruger Products context, evidence gaps, and score-pending state.
13. Open or trigger the trust/score explanation where available.
14. Confirm the user understands:
    - Mishava is showing evidence and gaps, not final scores;
    - Score pending means Mishava does not have enough reviewed evidence/scoring support yet;
    - Mishava is not the store;
    - Mishava does not earn shopping commissions;
    - the preview is not medical advice.

## 3. Page And Copy Polish

Review the live pages for clear, scan-friendly copy.

Required copy signals:

- `Early preview` or equivalent framing.
- `Score pending`.
- `Evidence Score Preview`, where used.
- `Evidence profile incomplete`, where appropriate.
- `Mishava review not finalized`, where appropriate.
- `No paid ranking`.
- `No commission` or `No commission ranking`.
- `Mishava is not the store`.
- `Outside scorecards may be evidence references, but they are not Mishava Scores`.
- `Manufacturer/supplier not verified` or equivalent gap language.
- `This is not medical advice`, where sensitive-use context appears.

Forbidden copy:

- final Mishava Score language;
- certified score;
- medical-safe score;
- best for Crohn's;
- safe for Crohn's;
- guaranteed non-irritating;
- any claim that a product is medically suitable;
- any claim that payment improves score, rank, trust, verification, or visibility.

Small copy fixes are acceptable during implementation only if they clarify the existing preview and do not add new product features.

## 4. Mobile And Desktop QA

Implementation should verify both desktop and mobile.

Desktop checks:

- Shopping landing loads cleanly.
- Toilet paper category loads cleanly.
- Product cards fit without awkward wrapping.
- Badges are readable.
- Product detail pages are scannable.
- Places-to-buy table is readable.
- Trust popup or inline score explainer is usable.

Mobile checks:

- Shopping landing is readable.
- Toilet paper category is readable.
- Product cards do not overflow.
- Badges wrap cleanly.
- Product detail content remains understandable.
- Places-to-buy content does not become unusable.
- Trust popup or score explanation is reachable and readable.

If mobile is usable but not polished, document a desktop-first caveat for the first guided preview.

## 5. Screenshot Requirement

Implementation should capture screenshots for:

- `https://shopping.mishava.org`
- `https://shopping.mishava.org/shopping`
- `https://shopping.mishava.org/shopping/categories/toilet-paper`
- Kirkland detail page
- Cashmere detail page
- Purex detail page
- mobile Shopping landing
- mobile toilet paper category
- any trust popup or score-preview state that can be captured safely

Screenshots should remain ignored and uncommitted unless a future screenshot policy says otherwise.

The result document should reference screenshot paths.

## 6. User Invite Readiness

Before inviting the first guided preview user, all of the following should be true:

- `https://shopping.mishava.org` works.
- `/shopping` still works.
- Toilet paper category works.
- Kirkland, Cashmere, and Purex detail pages work.
- No database configuration errors appear.
- No invalid API key errors appear.
- No final Mishava Scores are shown.
- No medical claims are shown.
- Evidence gaps are visible and understandable.
- Supplier/manufacturer uncertainty is visible and not guessed.
- `Mishava is not the store` language is visible.
- No paid ranking / no commission language is visible.
- Mobile is usable or a desktop-first caveat is documented.
- A short guided-preview invite message is drafted.

Suggested user-facing framing to refine during implementation:

`This is an early Mishava Shopping preview. It does not provide final scores yet. It shows what Mishava knows, what it does not know, and what evidence gaps still need review. It is not medical advice, and Mishava is not the store.`

## 7. Tests And Checks

Implementation should run:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `supabase migration list --linked`
- live route checks for all preview URLs

If local tooling stalls again, the result doc should:

- capture the last output line;
- identify whether the process appeared alive or idle;
- distinguish the local tooling caveat from live route readiness;
- avoid claiming full tooling pass unless the commands actually complete.

## 8. Result Document

Implementation should create:

`docs/release-4-slice-11-shopping-domain-polish-guided-preview-qa-result.md`

The result document should include:

- live URL status;
- preferred URL to send to users;
- route verification;
- desktop QA status;
- mobile QA status;
- screenshot paths;
- copy clarity status;
- trust/score language status;
- no-medical-claim confirmation;
- no-paid-ranking/no-commission confirmation;
- whether the first guided preview user can be invited;
- recommended invite language;
- blockers if any;
- polish items if any;
- tests/checks run;
- confirmation no forbidden features or data were added;
- confirmation no DNS/domain changes were made;
- confirmation `dsuupr-am` and old Supabase were untouched.

## 9. Acceptance Criteria

Slice 11 is complete only when:

- live Shopping preview is polished enough for a guided early-user walkthrough;
- `https://shopping.mishava.org` is confirmed as the preferred user URL or another URL is justified;
- live routes pass;
- screenshots are captured;
- desktop and mobile status are documented;
- evidence gaps and score-pending language are understandable;
- no final scores are invented;
- no medical claims are made;
- no fake products, evidence, suppliers, manufacturers, images, or scores are added;
- no paid ranking, affiliate, or commission logic is added;
- caveats are documented honestly;
- the next action is either send a guided preview invite or fix specific polish blockers.

## Recommended Next Action After This Plan

Implement Slice 11 as a QA and polish pass, not as a feature-building slice.

If Slice 11 passes, send the first guided preview invite using the clean URL:

`https://shopping.mishava.org`

If Slice 11 finds blockers, fix only the smallest copy/layout issues needed for the guided preview before inviting the user.
