# Release 4 Slice 12: Shopping First User Account and Evidence Readiness Result

Date: 2026-06-01

## Summary

Implemented first-user Shopping account and toilet paper evidence-readiness polish for the guided preview path.

This slice did not add products, migrations, checkout, Plus, Local inventory, Business/Gov/Corporate surfaces, AI scoring, crawler/scraping, affiliate/referral/commission logic, fake evidence, fake scores, fake sources, fake images, fake suppliers, fake manufacturers, or payment influence.

## What Changed

- Improved the Shopping account path so sign-up copy is no longer NGO-only.
- Preserved `next` return paths through sign-up and sign-in flows so a shopper can return to Shopping Priorities or Shopping after auth.
- Kept sign-in as a popup pattern through `SignInModal`, including the create-account path.
- Added clearer Shopping Priorities language:
  - priorities are a personal fit overlay;
  - priorities do not create a final score;
  - priorities do not change the base Evidence Score;
  - priorities do not make medical suitability claims;
  - shoppers can return to the toilet paper preview.
- Added product-detail evidence source cards for toilet paper records, using existing source-backed product, company, external reference, and place-to-buy data.
- Added source display fields:
  - source title;
  - source type;
  - source URL;
  - reviewed status;
  - last reviewed/freshness;
  - claim summary;
  - confidence/context;
  - what the source supports;
  - what the source does not prove;
  - missing evidence gaps.
- Strengthened care-sensitive language:
  - "This is not medical advice."
  - "Mishava does not guarantee that a product is safe or suitable for any medical condition."
  - "Comfort, fragrance-free, or sensitivity-related claims are shown only when source-supported."
  - "Ask a medical professional for medical suitability."

## Auth / Account Flow Status

| Area | Status | Notes |
| --- | --- | --- |
| Sign-up route | Ready in repo | `/auth/sign-up?next=/app/shopping-priorities` renders and preserves `next`. |
| Sign-in route | Ready in repo | `/auth/sign-in?signIn=1&next=/app/shopping-priorities` opens the popup pattern. |
| Sign-out route | Existing | No sign-out logic changes were needed. |
| Session persistence | Existing | Existing Supabase cookie/session logic remains in place. |
| Shopping -> auth -> return path | Improved | Sign-up and sign-in preserve safe relative `next` paths. |
| Password reset | Existing | No new password reset work was added. |
| Email confirmation messaging | Improved | Sign-up explains that email confirmation depends on Supabase Auth settings and asks users to return to Shopping afterward if required. |

Manual caveat: a real first-user auth pass should still be tested after deployment with an actual inbox and the `shopping.mishava.org` Supabase Auth redirect configuration.

## Shopping Priorities Status

Shopping Priorities remain behind authentication. Unauthenticated users are redirected to the sign-in popup route with a `next=/app/shopping-priorities` return path.

The priorities page now explains that priorities help with later personal fit, not base trust scoring. It also links back to the toilet paper preview and includes a Back to Shopping action.

## Public vs Signed-In Behavior

- Public:
  - Shopping landing.
  - Toilet paper category.
  - Product detail pages.
  - Basic product evidence, source, gap, score-pending, no-paid-ranking, and no-commission context.
- Signed-in:
  - Shopping Priorities setup/update.
  - Future values-match behavior once priorities and reviewed evidence support it.
- Not implemented:
  - A fake Your Values Score.
  - A final score from incomplete evidence.
  - Account-only gating for basic product evidence browsing.

## Evidence / Source Display Status

Product detail pages now build a simple `EvidenceSourceCard` list from existing source-backed product fields and place-to-buy records. Evidence cards intentionally distinguish what a source supports from what it does not prove.

The display keeps relationships clear across:

- product;
- brand;
- parent company;
- private-label owner;
- manufacturer;
- supplier;
- retailer/place-to-buy.

Costco/Kirkland remains framed as retailer/private-label owner context, not verified manufacturer/supplier identity. Kruger/Cashmere/Purex remain framed with Kruger Products relationship where source-supported while product-level tissue claims still need reviewed evidence.

## Live Route Checks

Checked current live deployment at `shopping.mishava.org`:

| Route | Status | Notes |
| --- | --- | --- |
| `https://shopping.mishava.org` | Pass, `HTTP 200` | Shopping landing route served. |
| `https://shopping.mishava.org/shopping` | Pass, `HTTP 200` | Shopping route served. |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | Pass, `HTTP 200` | Toilet paper category served. |
| `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls` | Pass, `HTTP 200` | Kirkland detail served. |
| `https://shopping.mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Cashmere detail served. |
| `https://shopping.mishava.org/shopping/products/purex-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Purex detail served. |
| `https://shopping.mishava.org/auth/sign-up?next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-up route served. |
| `https://shopping.mishava.org/auth/sign-in?signIn=1&next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-in popup route served. |
| `https://shopping.mishava.org/app/shopping-priorities` | Pass, `HTTP 307` | Redirects unauthenticated users to sign-in with return path. |

Live deployment caveat: the live route checks and screenshots reflect the currently deployed site before this Slice 12 commit is deployed. The newly committed evidence-source cards require deployment before appearing on the live domain.

## Screenshots Captured

Screenshots are ignored/uncommitted artifacts:

- `screenshots/release-4-slice-12/release-4-slice-12-shopping-signed-out.png`
- `screenshots/release-4-slice-12/release-4-slice-12-shopping-route.png`
- `screenshots/release-4-slice-12/release-4-slice-12-auth-sign-up.png`
- `screenshots/release-4-slice-12/release-4-slice-12-auth-sign-in-popup.png`
- `screenshots/release-4-slice-12/release-4-slice-12-shopping-priorities-auth-prompt.png`
- `screenshots/release-4-slice-12/release-4-slice-12-toilet-paper-category.png`
- `screenshots/release-4-slice-12/release-4-slice-12-kirkland-detail.png`
- `screenshots/release-4-slice-12/release-4-slice-12-cashmere-detail.png`
- `screenshots/release-4-slice-12/release-4-slice-12-purex-detail.png`

Mobile viewport-specific screenshots were not recaptured in this run because the browser runtime did not expose viewport resizing through the available tab wrapper. Slice 11 remains the latest mobile/readability smoke reference.

## Tests / Checks Run

- `npm test` - Pass, `154/154`.
- `npm run typecheck` - Stalled locally after `tsc --noEmit` with no errors printed; stopped after roughly 90 seconds.
- `npm run lint` - Stalled locally after `eslint` with no errors printed; stopped after roughly 60 seconds.
- `npm run build` - Stalled locally after `next build` before compile output; stopped after roughly 90 seconds.
- `npm run dev` - Stalled locally after `next dev` before a ready/listening banner; stopped after roughly 60 seconds.
- `supabase migration list --linked` - Pass/aligned through `202605260009`.
- Live route checks - Pass for public Shopping, auth routes, product details, and unauthenticated priorities redirect.

Tooling caveat: the Node/Next/ESLint local worker stall appears to be the same local tooling/runtime issue observed in prior slices. No type, lint, or build errors were emitted before the stalls.

## First-User Readiness Rating

Controlled guided-preview ready after deployment of this Slice 12 commit, with caveats.

The user can browse toilet paper publicly and see score-pending/evidence-gap language. After deployment, the product detail pages will be stronger for a first user because they explain source-backed evidence more directly.

Account and priorities flow is clearer, but real sign-up/email confirmation should be smoke-tested with an inbox before asking the user to create an account independently.

## Remaining Caveats

- Deploy this commit before expecting the live site to show the new evidence-source cards.
- Run a real-inbox sign-up/confirmation test for `shopping.mishava.org` before sending a non-guided account creation request.
- Mobile-specific screenshots were not newly captured in this run.
- Local standalone typecheck/lint/build/dev commands stalled without errors and should be revisited as a tooling reliability item.
- Final scoring remains pending until reviewed evidence and scoring methodology support it.
- Your Values Match remains unavailable until priorities plus reviewed evidence support a real preview.

## Confirmations

- No checkout was added.
- No Plus was added.
- No Local inventory was added.
- No Business, Gov, or Corporate product surfaces were added.
- No AI scoring was added.
- No crawler or scraping system was added.
- No affiliate/referral/commission logic was added.
- No payment influence was added.
- No fake evidence, fake sources, fake suppliers, fake manufacturers, fake products, fake images, or fake scores were added.
- No medical claims were added.
- No product safety or Crohn's suitability claims were added.
- No migrations were added or modified.
- `dsuupr-am` was untouched.
- The old Supabase project was untouched.
