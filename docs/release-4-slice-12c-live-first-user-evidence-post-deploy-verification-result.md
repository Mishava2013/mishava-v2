# Release 4 Slice 12C: Live First-User Evidence Post-Deploy Verification Result

Date: 2026-06-01

## Summary

Release 4 Slice 12 is now deployed live on the clean `mishava-v2` Vercel project.

Result: `https://shopping.mishava.org` is ready for a guided first-user preview of the toilet paper evidence-readiness experience, with one small auth-copy caveat noted below.

## Deployment Status

Clean project:

- GitHub repo: `Mishava2013/mishava-v2`
- Vercel project: `mishava-v2`
- Live domain: `https://shopping.mishava.org`

Deployed source commit:

- `0d28b191ad9292860a938fcbd87567ec5fd5c7a2`
- Includes Slice 12 implementation commit `62d096bc449afd462e8b69d26c930ec5839014db`
- Includes Slice 12B verification documentation commit `fd89d30`

Vercel deployment:

- Deployment id: `dpl_DpL6M6EkZ4v1dHA5LY6YCBaD6m7y`
- Deployment URL: `https://mishava-v2-awx4e6tuf-mishava2013s-projects.vercel.app`
- Target: production
- Status: Ready
- Alias confirmed: `https://shopping.mishava.org`

The deploy was triggered by pushing local `master` to the clean GitHub remote `mishava-v2-clean` as remote `main`.

## Live Route Status

| Route | Status | Notes |
| --- | --- | --- |
| `https://shopping.mishava.org` | Pass, `HTTP 200` | Loads the Shopping landing surface. |
| `https://shopping.mishava.org/shopping` | Pass, `HTTP 200` | Loads Shopping. |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | Pass, `HTTP 200` | Toilet paper category loads. |
| `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls` | Pass, `HTTP 200` | Kirkland detail loads with Slice 12 evidence cards. |
| `https://shopping.mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Cashmere detail loads with Slice 12 evidence cards. |
| `https://shopping.mishava.org/shopping/products/purex-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Purex detail loads with Slice 12 evidence cards. |
| `https://shopping.mishava.org/auth/sign-up?next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-up route loads with Shopping-friendly copy. |
| `https://shopping.mishava.org/auth/sign-in?signIn=1&next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-in popup route loads with Shopping Priorities copy. |
| `https://shopping.mishava.org/app/shopping-priorities` | Pass, `HTTP 307` | Signed-out users redirect to sign-in with the priorities return path preserved. |

## Evidence Card Visibility

Status: pass.

The live Kirkland, Cashmere, and Purex detail pages now include Slice 12 evidence-source card markers:

- `Evidence sources`
- `Claim summary`
- `What this source supports`
- `What this source does not prove`
- `This source does not create a final score`
- `Missing evidence gaps`
- `Open evidence source`

The live pages also continue to show safety and commerce guardrails:

- `No paid ranking`
- `No commission ranking`
- `Mishava is not the store`
- Medical-advice limitation language

## Auth and Account Flow Status

Status: pass with one copy caveat.

The sign-up page now includes Shopping-friendly first-user copy:

- `Create your Mishava account`
- `Shopping product evidence remains viewable`
- `return to Shopping`
- Copy explaining that account setup does not create product scores.

The sign-in popup route loads and includes Shopping Priorities copy:

- `Sign in to Mishava`
- `Use your account for Shopping Priorities`
- `Payment never changes trust outcomes`
- `Sign-in now opens as a popup`

Caveat: the sign-in popup still contains one older `NGO evidence` phrase. It is not blocking the guided preview because the popup also clearly references Shopping Priorities, but it should be cleaned up in the next usability/copy pass.

## Shopping Priorities Status

Status: pass for signed-out prompt/return-path verification.

Signed-out users visiting `/app/shopping-priorities` are redirected to:

- `/auth/sign-in?auth=required&signIn=1&next=%2Fapp%2Fshopping-priorities`

The live auth copy explains that priorities are used for preferences and do not create final product scores or medical suitability claims.

## Score, Medical, and Payment Guardrails

Status: pass.

Live checks did not find final Mishava Score claims or prohibited medical positioning. The toilet paper category and product detail pages continue to use preview/pending language, including:

- `Evidence Score Preview`
- `Score pending`
- Evidence gaps
- Medical-advice limitation language

No checkout, paid ranking, commission sorting, affiliate logic, fake scores, or fake evidence was observed.

## Screenshots

Screenshots were captured and remain ignored/uncommitted under `screenshots/`:

- `screenshots/release-4-slice-12c/live-shopping-signed-out.png`
- `screenshots/release-4-slice-12c/live-sign-up.png`
- `screenshots/release-4-slice-12c/live-sign-in-popup.png`
- `screenshots/release-4-slice-12c/live-shopping-priorities-prompt.png`
- `screenshots/release-4-slice-12c/live-toilet-paper-category.png`
- `screenshots/release-4-slice-12c/live-kirkland-detail-evidence.png`
- `screenshots/release-4-slice-12c/live-cashmere-detail-evidence.png`
- `screenshots/release-4-slice-12c/live-purex-detail-evidence.png`

## Checks Run

- `git merge-base --is-ancestor 62d096bc449afd462e8b69d26c930ec5839014db HEAD` - Pass.
- `git push mishava-v2-clean master:main` - Pass; pushed `494e771..0d28b19`.
- `vercel inspect https://mishava-v2-awx4e6tuf-mishava2013s-projects.vercel.app` - Pass; deployment Ready.
- Live route checks - Pass for Shopping, toilet paper, Kirkland, Cashmere, Purex, sign-up, sign-in, and priorities redirect.
- `npm test` - Pass, `154/154`.
- `supabase migration list --linked` - Pass; local and remote migrations aligned through `202605260009`.

Typecheck/lint/build were not requested for this Slice 12C verification. No local tooling stall was introduced or investigated in this pass.

## First-User Readiness

The first guided user can be invited to view the Shopping toilet paper evidence-readiness preview.

Recommended invite framing remains:

> This is an early Mishava Shopping preview. It does not provide final scores yet. It shows what Mishava knows, what it does not know, and what evidence gaps still need review. Mishava is not the store, and this is not medical advice.

## Remaining Caveats

- Desktop-first guided preview is the safest path.
- The sign-in popup has one leftover `NGO evidence` phrase that should be cleaned up in the next senior-friendly usability pass.
- Shopping Priorities can be reached through the auth return path, but a complete signed-in live account walkthrough was not performed in this verification pass.
- Final Mishava Scores remain intentionally pending.

## Scope Confirmation

- No product features were added.
- No products were added.
- No migrations were added or applied.
- No DNS or domain settings were changed.
- No checkout, Plus, Local inventory, Business/Gov/Corporate, AI scoring, crawler/scraping, affiliate/commission logic, or payment influence was added.
- No fake evidence, fake scores, fake suppliers, fake manufacturers, fake images, or medical claims were added.
- `dsuupr-am` was not touched.
- The old Supabase project was not touched.
