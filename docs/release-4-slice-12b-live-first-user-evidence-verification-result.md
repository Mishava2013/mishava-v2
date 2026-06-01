# Release 4 Slice 12B: Live First-User Evidence Verification Result

Date: 2026-06-01

## Summary

Live route availability is healthy, but Release 4 Slice 12 commit `62d096bc449afd462e8b69d26c930ec5839014db` is not currently visible on `https://shopping.mishava.org`.

Result: not ready to invite the first user for the Slice 12 evidence-source-card experience until the clean `mishava-v2` Vercel project deploys commit `62d096b` or newer.

## Deployed Commit Status

Target Slice 12 commit:

- `62d096bc449afd462e8b69d26c930ec5839014db`
- Commit time: 2026-06-01 16:01:02 PDT
- Subject: `Implement Shopping first-user evidence readiness`

Live Vercel inspection:

- Project: `mishava-v2`
- Target: production
- Deployment id: `dpl_E4xteEDdP5MCDid3919BZUiEHQFq`
- Deployment URL: `https://mishava-v2-8ncd5qk60-mishava2013s-projects.vercel.app`
- Deployment created: 2026-06-01 14:45:37 PDT
- Status: Ready

The live deployment timestamp is earlier than commit `62d096b`, and the live pages still show pre-Slice-12 content. Content verification therefore indicates commit `62d096b` is not deployed live yet.

Current local HEAD at verification time:

- `80861c525b04c0ba6276a89202b5aba75dfacb0d`
- Subject: `Plan senior-friendly Shopping usability pass`

## Live Route Status

| Route | Status | Notes |
| --- | --- | --- |
| `https://shopping.mishava.org` | Pass, `HTTP 200` | Shopping domain resolves to clean `mishava-v2` project and serves Shopping. |
| `https://shopping.mishava.org/shopping` | Pass, `HTTP 200` | Shopping route serves. |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | Pass, `HTTP 200` | Toilet paper category serves. |
| `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls` | Pass, `HTTP 200` | Kirkland detail serves. |
| `https://shopping.mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Cashmere detail serves. |
| `https://shopping.mishava.org/shopping/products/purex-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Purex detail serves. |
| `https://shopping.mishava.org/auth/sign-up?next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-up route serves, but live copy is pre-Slice-12. |
| `https://shopping.mishava.org/auth/sign-in?signIn=1&next=/app/shopping-priorities` | Pass, `HTTP 200` | Sign-in popup route serves, but live copy is pre-Slice-12. |
| `https://shopping.mishava.org/app/shopping-priorities` | Pass, `HTTP 307` | Redirects unauthenticated user to sign-in with `next=/app/shopping-priorities`. |

## Evidence Card Visibility

Status: fail for Slice 12 live verification.

Expected Slice 12 phrases were not found on live toilet paper product detail pages:

- `Evidence sources`
- `Claim summary`
- `What this source supports`
- `What this source does not prove`
- `Missing evidence gaps`
- `Open evidence source`

Kirkland detail still shows the older product-detail experience with existing no-paid-ranking and store disclaimers, but not the new source-backed evidence cards from commit `62d096b`.

## Auth / Account Flow Status

Status: live route works, but Slice 12 account copy is not deployed.

Live sign-up page still includes pre-Slice-12 NGO-oriented copy:

- `NGO account`
- `Start with a real account`

Expected Slice 12 Shopping-friendly copy was not visible:

- `Shopping Priorities`
- `Shopping product evidence remains viewable without inventing scores`
- `return to Shopping after confirming your email`

Live sign-in page still includes pre-Slice-12 copy mentioning NGO evidence first. The route/popup pattern is reachable, but the first-user Shopping language from Slice 12 is not live yet.

## Shopping Priorities Status

Unauthenticated `/app/shopping-priorities` redirects correctly to:

`/auth/sign-in?auth=required&signIn=1&next=%2Fapp%2Fshopping-priorities`

This confirms the route protection/return path is functioning at the route level. However, because Slice 12 is not deployed, the improved priorities copy could not be verified live.

## Trust / Safety Content Checks

Live pages still pass key safety checks:

- No final Mishava Scores were observed.
- No `best for Crohn`, `safe for Crohn`, `medical-safe`, `guaranteed non-irritating`, or similar medical suitability claims were observed.
- No fake scores were observed.
- No fake evidence was observed.
- `No paid ranking` language remains visible.
- `No commission ranking` language remains visible.
- `Mishava is not the store` language remains visible.

## Screenshots

Screenshots were captured and remain ignored/uncommitted under `screenshots/`:

- `screenshots/release-4-slice-12b/release-4-slice-12b-shopping-signed-out.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-auth-sign-up.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-auth-sign-in-popup.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-shopping-priorities-auth-prompt.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-toilet-paper-category.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-kirkland-detail.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-cashmere-detail.png`
- `screenshots/release-4-slice-12b/release-4-slice-12b-purex-detail.png`

The screenshots show the current live deployed state, not the Slice 12 evidence-card implementation.

## Checks Run

- `npm test` - Pass, `154/154`.
- `supabase migration list --linked` - Pass; local and remote migrations aligned through `202605260009`.
- Live route checks - Pass for Shopping, toilet paper, Kirkland, Cashmere, Purex, sign-up, sign-in, and priorities redirect.
- `vercel inspect https://shopping.mishava.org` - Pass/read-only; confirmed live alias is on `mishava-v2` production deployment.

Typecheck/lint/build were not requested for this Slice 12B run. No local tooling stall was introduced or investigated in this verification pass.

## Can The First User Be Invited?

Not yet for the Slice 12 first-user evidence readiness experience.

The first user can still be shown the existing controlled Shopping preview, but the specific Slice 12 improvements are not live yet:

- first-user friendly sign-up/sign-in copy is not live;
- Shopping Priorities copy improvements are not verified live;
- evidence-source cards are not visible live.

Recommendation:

1. Deploy commit `62d096b` or newer to the clean `mishava-v2` Vercel production project.
2. Rerun this verification.
3. Invite the first user only after evidence cards and Shopping-friendly auth copy are visible live.

## Remaining Caveats

- Vercel inspect did not print a Git commit hash, so deployed-commit status is based on deployment timestamp plus live content verification.
- The current live deployment is healthy as a route/deployment surface but stale relative to Slice 12.
- No real-inbox auth flow was tested in this pass.

## Confirmations

- No features were added.
- No products were added.
- No migrations were added or changed.
- No DNS or domains were changed.
- `dsuupr-am` was untouched.
- Old Supabase was untouched.
