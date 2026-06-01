# Release 4 Slice 13: Senior-Friendly Shopping Usability Result

Date: 2026-06-01

## Summary

Release 4 Slice 13 simplifies the live Shopping preview path for a normal non-technical older user. The pass keeps the experience adult, plain, and evidence-first: users can browse without signing in, see toilet paper quickly, understand that Mishava is not the store, and see why scores are not ready yet.

## What Changed

- Reworked the Shopping homepage hero around the 10-second message: compare products by evidence, not ads.
- Made toilet paper easier to find from the department rail and homepage result heading.
- Reframed the score callout as `Score not ready yet` instead of leading with technical preview labels.
- Updated product-card score buttons to say `Why this score is pending` when no score snapshot exists.
- Simplified the toilet paper category intro so it answers what the user is looking at, why products are shown, and what to click first.
- Reordered product detail content so a user sees product/source basics and where-to-buy context before deeper evidence and supplier details.
- Added an early `Where to buy` summary card that explains retailer links are source records and Mishava does not sell products.
- Renamed product detail sections to plain headings:
  - `What Mishava found`
  - `What Mishava still needs`
  - `Company/source information`
  - `What Mishava is checking`
  - `Source details`
- Simplified Shopping Priorities copy to: `Tell Mishava what matters to you.`
- Removed the leftover `NGO evidence` phrase from the sign-in page.
- Updated the score explainer popup to use plainer labels while keeping payment firewall and priority guardrails.

## Before/After Copy Strategy

Before:

- The UI led with terms such as `Evidence Score Preview`, `Your Values Match Preview unavailable`, `Research task status`, and `External evidence available`.
- Product details surfaced supplier/manufacturer transparency early, which was accurate but harder for a first user to decode.

After:

- The UI leads with plain questions a shopper naturally has:
  - What is this?
  - Where can I look/buy?
  - What did Mishava find?
  - What is missing?
  - Why is the score not ready?
- Deeper evidence and supplier details remain visible for transparency, but they no longer have to be decoded first.

## Homepage Clarity Status

Status: improved.

The homepage now says:

- `Compare products by evidence, not ads.`
- Mishava helps show what has been found and what is still missing.
- Users can browse toilet paper and baby products without signing in.
- Mishava is not the store and does not sell the products.
- No paid ranking and no commission sorting.

## Toilet Paper Path Status

Status: improved and still guided-preview ready.

The category page now:

- Uses `Toilet paper preview`.
- Tells the user these are real product records, not products sold by Mishava.
- Explains that users should click a product to see what Mishava found, what is still missing, and why no final score is shown yet.
- Keeps no-medical-claims and score-pending posture.

## Product Detail Clarity Status

Status: improved.

Product details now prioritize:

1. Product name and brand.
2. Score status in plain language.
3. Source age and basic evidence status.
4. Where-to-buy/source links.
5. Product summary.
6. What Mishava found.
7. What Mishava still needs.
8. Evidence/source details.
9. Company, supplier, and manufacturer transparency.

Supplier/manufacturer details remain available and evidence gaps remain visible.

## Account and Priorities Flow Status

Status: improved.

- Users can still browse Shopping and toilet paper without logging in.
- Sign-in copy now focuses on saving Shopping Priorities and keeping Mishava tools connected.
- Shopping Priorities explains that priorities help Mishava remember what matters to the user.
- Priorities still do not create a final score, do not change the base evidence review, and do not create medical suitability claims.

## Screenshots

Screenshots were captured from the live `shopping.mishava.org` deployment and remain ignored/uncommitted under `screenshots/`:

- `screenshots/release-4-slice-13/shopping-home-desktop.png`
- `screenshots/release-4-slice-13/shopping-home-mobile.png`
- `screenshots/release-4-slice-13/toilet-paper-category-desktop.png`
- `screenshots/release-4-slice-13/toilet-paper-category-mobile.png`
- `screenshots/release-4-slice-13/kirkland-detail-desktop.png`
- `screenshots/release-4-slice-13/kirkland-detail-mobile.png`
- `screenshots/release-4-slice-13/cashmere-detail-desktop.png`
- `screenshots/release-4-slice-13/purex-detail-desktop.png`
- `screenshots/release-4-slice-13/sign-up-desktop.png`

## Tests and Checks Run

Passed:

- `node --test scripts/release-4-shopping.test.mjs` - Pass, `31/31`.
- `npm test` - Pass, `155/155`.
- `supabase migration list --linked` - Pass; migrations aligned through `202605260009`.

Attempted but stalled locally:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run dev -- -p 3007`

Tooling caveat:

- `.next` was cleared and the commands were retried sequentially.
- Each command printed its banner, then the underlying Node process became idle and did not complete.
- No TypeScript, ESLint, or build error output was produced before the stalled processes were stopped.
- This matches the known local tooling stall pattern and should be rechecked after pushing to the clean repo and/or in Vercel.

## Live Deployment Status

Status: deployed and verified.

- Clean GitHub remote: `Mishava2013/mishava-v2`
- Pushed: local `master` to clean remote `mishava-v2-clean` as `main`
- Vercel project: `mishava-v2`
- Live alias: `https://shopping.mishava.org`
- Deployment status: latest clean `main` production deployment verified Ready on Vercel

Live route checks:

- `https://shopping.mishava.org` - Pass, `HTTP 200`.
- `https://shopping.mishava.org/shopping/categories/toilet-paper` - Pass, `HTTP 200`.
- `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls` - Pass, `HTTP 200`.
- Cashmere and Kirkland detail content markers showed `What Mishava found`, `What Mishava still needs`, `Where to buy`, `Company/source information`, no-paid-ranking/no-commission language, and `Mishava is not the store`.
- Sign-in live copy no longer contains the older `NGO evidence` phrase.

## First Older-User Readiness

Status: ready for a desktop-first guided preview.

The content is live and ready for the first older-user guided preview. The guided path should be:

1. Start at Shopping.
2. Click Toilet paper.
3. Open Kirkland.
4. Look at `What Mishava found`.
5. Look at `What Mishava still needs`.
6. Notice why the score is not final yet.
7. Explain that Mishava is not the store and this is not medical advice.
8. Invite Shopping Priorities only after the user understands the value.

## Remaining Caveats

- Local typecheck/lint/build/dev server stalled and need a clean follow-up verification.
- Mobile screenshots were captured and reviewed as usable for a guided preview, but desktop should remain the recommended first walkthrough format.
- Final Mishava Scores remain intentionally pending.

## Scope Confirmation

- No fake scores were added.
- No fake evidence was added.
- No fake products, suppliers, images, or claims were added.
- No medical claims were added.
- No checkout, Plus, Local inventory, Business/Gov/Corporate, AI scoring, crawler/scraping, affiliate/referral/commission logic, or payment influence was added.
- No DNS or domain changes were made.
- No Supabase migrations were added or applied.
- `dsuupr-am` was not touched.
- The old Supabase project was not touched.
