# Mishava V2 Shopping Domain Cutover Result

Date: 2026-06-01

## Summary

The clean Mishava V2 GitHub repo and clean Vercel project are now the working path for Mishava Shopping.

Clean GitHub repo:

`Mishava2013/mishava-v2`

Clean Vercel project:

`mishava-v2`

The Shopping domain cutover was completed manually outside Codex. Codex did not change DNS, move domains, add products, add migrations, touch `dsuupr-am`, or touch either Supabase project during this documentation pass.

## What Was Changed Manually

Manual operations completed outside this task:

- Created/used the clean GitHub repo `Mishava2013/mishava-v2`.
- Created/used the clean Vercel project `mishava-v2`.
- Added the clean Mishava V2 Supabase environment variables to the clean Vercel project.
- Pointed `shopping.mishava.org` to the clean Mishava V2 Vercel project.
- Confirmed the clean temporary Vercel deployment worked before domain cutover.

No additional domain, DNS, or Vercel changes were made by Codex in this task.

## Final Working Live URLs

Verified live on 2026-06-01:

| URL | Status | Notes |
| --- | --- | --- |
| `https://shopping.mishava.org` | Pass, `HTTP 200` | Matches `/shopping`. |
| `https://shopping.mishava.org/shopping` | Pass, `HTTP 200` | Shopping landing route. |
| `https://shopping.mishava.org/shopping/categories/toilet-paper` | Pass, `HTTP 200` | Toilet paper category route. |
| `https://shopping.mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls` | Pass, `HTTP 200` | Kirkland detail route. |
| `https://shopping.mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Cashmere detail route. |
| `https://shopping.mishava.org/shopping/products/purex-bathroom-tissue-kruger-products` | Pass, `HTTP 200` | Purex detail route. |

## Clean Project Confirmation

`shopping.mishava.org` now points to the clean Mishava V2 Vercel project path rather than the confusing older `dsuupr-am` Mishava deployment path.

The live response for `https://shopping.mishava.org` returns `x-matched-path: /shopping`, which is the intended Shopping surface.

## Dsuupr / Old Project Confirmation

- Dsuupr was left alone.
- The old `dsuupr-am` Vercel project was not modified in this task.
- Historical note: `dsuupr-am` had prior Mishava environment/domain attempts during earlier troubleshooting, but no additional changes were made after the clean Shopping cutover documentation pass.
- The old Supabase project was untouched.
- No Supabase migrations were added or applied.

## Screenshots Requested / Needed

Screenshots should be captured or retained for:

- `shopping.mishava.org` homepage
- `https://shopping.mishava.org/shopping`
- `https://shopping.mishava.org/shopping/categories/toilet-paper`
- Kirkland detail page
- Cashmere detail page
- Purex detail page

Existing clean Vercel screenshots from the temporary deployment are available in the ignored `screenshots/` folder from the prior verification pass:

- `screenshots/mishava-v2-clean-vercel-homepage.png`
- `screenshots/mishava-v2-clean-vercel-shopping.png`
- `screenshots/mishava-v2-clean-vercel-toilet-paper-category.png`
- `screenshots/mishava-v2-clean-vercel-kirkland-detail.png`
- `screenshots/mishava-v2-clean-vercel-cashmere-detail.png`
- `screenshots/mishava-v2-clean-vercel-purex-detail.png`

Recommended follow-up: capture matching screenshots from the final `shopping.mishava.org` domain if Jos wants domain-specific screenshot evidence.

## Remaining Cleanup Recommendations

1. Later decide whether to move additional Mishava domains to the clean `mishava-v2` Vercel project:
   - `ngo.mishava.org`
   - `app.mishava.org`
   - `business.mishava.org`
   - `corporate.mishava.org`
   - `support.mishava.org`
   - `trust.mishava.org`
   - `admin.mishava.org`
   - `api.mishava.org`
   - `gov.mishava.org`
   - `research.mishava.org`
   - `media.mishava.org`

2. Later decide whether to rename, retire, or leave untouched the old `dsuupr-am` Mishava deployment.

3. Later document a clean domain ownership table that clearly separates:
   - Dsuupr domains and Vercel projects.
   - Mishava domains and Vercel projects.
   - Old/legacy deployments.
   - Supabase project refs.

4. Before moving more domains, rerun the clean deployment verification checklist for each domain after cutover.

## Recommended Next Build Slice

Recommended next build slice:

**Release 4 Slice 11: Shopping Domain Polish and Guided Preview QA**

Purpose:

- Verify the final `shopping.mishava.org` domain with screenshots.
- Run a short guided user-preview QA checklist for the toilet paper flow.
- Confirm mobile readability on the final domain.
- Tighten any small copy issues that make the controlled preview clearer.

Non-goals:

- No checkout.
- No Plus.
- No Local inventory.
- No Business/Gov/Corporate work.
- No AI scoring.
- No affiliate or commission logic.
- No fake scores, evidence, suppliers, manufacturers, products, or images.

## Confirmations

- No code was changed.
- No DNS was changed by Codex.
- No additional domains were moved by Codex.
- No products were added.
- No migrations were added or applied.
- `dsuupr-am` was not touched in this task.
- The old Supabase project was untouched.
