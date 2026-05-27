# Release 4 Slice 10: Shopping Live Preview Readiness and Screenshot Review

## Scope

This slice checked whether Mishava Shopping is ready to show a real early user through a guided live preview. It covered live URL readiness, local preview screenshots, copy clarity, desktop/readability smoke, and preview-sharing language.

No major features, product records, migrations, checkout, Plus, Local inventory, Business/Gov/Corporate surfaces, AI scoring, crawler/scraping, affiliate/referral/commission logic, fake products, fake evidence, fake suppliers, fake images, fake scores, or medical claims were added.

Old Supabase project status: not touched.

## Source of Truth

- `docs/release-4-slice-9-shopping-controlled-preview-smoke-test.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`

## Readiness Rating

Rating: **local controlled-preview ready, live link not ready**.

The current local Shopping POC is ready for a guided walkthrough of the toilet paper evidence/gap experience. The deployed public site is not ready to send to the early user yet because the live root domain is serving an older Shopping surface and the current toilet paper/category/product routes return 404.

Recommended preview mode right now:

- Use a local/staged preview or screenshare.
- Do not send the live `mishava.org` Shopping link to the toilet paper user until the current build is deployed and verified.

## Live URL Status

Checked:

- `https://mishava.org/shopping`
- `https://shopping.mishava.org`
- `https://mishava.org/shopping/categories/toilet-paper`
- `https://mishava.org/shopping/products/kirkland-signature-bath-tissue-2-ply-380-sheets-30-rolls`
- `https://mishava.org/shopping/products/cashmere-bathroom-tissue-kruger-products`
- `https://mishava.org/shopping/products/purex-bathroom-tissue-kruger-products`
- `https://mishava.org/app/shopping-priorities`

Findings:

- `https://mishava.org/shopping` returns HTTP 200, but it serves an older Shopping coming-soon/storefront preview. It does not show the current baby/toilet-paper POC data.
- `shopping.mishava.org` has no DNS answer and is not reachable yet.
- Live toilet paper category route returns the app 404 page.
- Live Kirkland/Cashmere/Purex product routes return the app 404 page.
- Live Shopping Priorities route returns the app 404 page.
- The live trust popup could not be verified because the live product page is not present.

Live screenshot evidence:

- `screenshots/release-4-slice-10/live-shopping-landing.png`
- `screenshots/release-4-slice-10/live-toilet-paper-category-404.png`
- `screenshots/release-4-slice-10/live-kirkland-detail-404.png`

Live readiness decision:

- **Not ready to send as a live link.**
- Deploy/routing/DNS must be fixed first, then re-run the live portion of this smoke test.

## Local Preview Status

Local preview URL:

- `http://127.0.0.1:3000`

Local desktop status: **pass**.

Verified locally:

- Shopping landing opens.
- Toilet paper category opens.
- Kirkland detail opens.
- Cashmere detail opens.
- Purex detail opens.
- Trust popup opens on the Kirkland detail page.
- Shopping Priorities route is protected and redirects unauthenticated users, which is expected.

Local screenshot evidence:

- `screenshots/release-4-slice-10/local-shopping-landing.png`
- `screenshots/release-4-slice-10/local-toilet-paper-category.png`
- `screenshots/release-4-slice-10/local-kirkland-detail.png`
- `screenshots/release-4-slice-10/local-cashmere-detail.png`
- `screenshots/release-4-slice-10/local-purex-detail.png`
- `screenshots/release-4-slice-10/local-trust-popup.png`

Screenshots remain ignored/uncommitted.

## Copy Clarity Status

Status: **pass locally after one tiny copy fix**.

Tiny copy fix made:

- Updated `src/app/shopping/page.tsx` so the Shopping landing now explicitly says `Mishava is not the store` in the masthead and no-paid-ranking note.

Verified local copy clearly communicates:

- This is an early preview.
- Final scores are pending.
- Mishava is not the store.
- No paid ranking.
- No commission.
- Outside evidence is not a Mishava Score.
- Unknown supplier/manufacturer is an evidence gap.
- No medical advice / no Crohn's suitability claim.

The local toilet paper category and product detail pages remain conservative and do not make medical suitability claims.

## Mobile / Readability Status

Status: **usable with caveats**.

Desktop/default browser screenshots are readable. Product cards, fallback visuals, score-pending labels, supplier/manufacturer gaps, and evidence dimensions are understandable.

Caveat:

- The in-app browser tool did not expose a working mobile viewport resize. A true mobile-device or responsive-browser pass remains required before public beta and is strongly recommended before sending a live link to a mobile-first user.

## Trust Popup Status

Local status: **pass**.

Verified on Kirkland detail:

- `Why this score?` opens.
- Popup explains score-pending state.
- Popup explains missing/known evidence.
- Popup includes no-paid-ranking/no-commission boundaries.
- Popup keeps outside evidence as reference context only.

Live status: **not verifiable** because the live product route returns 404.

## Early User Decision

Can the toilet paper user be invited now?

**Not with the live public link.**

They can be invited to:

- a guided screenshare,
- a local/staged preview,
- or a live preview only after the current Shopping POC routes are deployed and verified.

Exact recommended sharing language after live deploy is fixed:

> This is an early Mishava Shopping preview. It does not provide final scores yet. It shows what Mishava knows, what it does not know, and what evidence gaps still need review. For toilet paper, Mishava is looking at product identity, retailer/source, brand, private-label owner, manufacturer/supplier transparency, recycled/bamboo/FSC and other sourcing signals where evidence exists, and missing evidence where it does not. This is not medical advice and does not claim any product is safe or suitable for Crohn's or any medical condition. Mishava is not the store, does not offer checkout, and does not rank products by commission or paid placement.

Shorter live-preview framing:

> This is an early Mishava Shopping preview. It does not provide final scores yet. It shows what Mishava knows, what it does not know, and what evidence gaps still need review.

## Blockers Before Sharing

Must fix before sending a public live URL:

- Deploy the current Shopping POC build to the live site.
- Verify `https://mishava.org/shopping/categories/toilet-paper` opens and shows the current toilet paper products.
- Verify live Kirkland/Cashmere/Purex product detail pages open.
- Verify live trust popup opens.
- Verify the live Shopping landing no longer serves the older coming-soon/storefront copy for this preview path.
- Confirm `shopping.mishava.org` DNS if that domain will be used for sharing.

## Polish Items After Sharing

- Add a lightweight feedback/report issue flow for product data, stale source links, supplier uncertainty, or confusing evidence language.
- Add a true mobile QA pass and fix any mobile table/card density issues.
- Make the Shopping Priorities unauthenticated prompt more direct for early preview users.
- Consider a small `Early preview` banner on product detail pages.
- Continue adding reviewed structured claims before any score preview becomes more than pending/contextual.

## Technical Checks

Commands/checks run:

- `curl -sI https://mishava.org/shopping` - HTTP 200.
- `curl -sI https://shopping.mishava.org` - failed because DNS does not resolve.
- `dig +short mishava.org` - resolves through Cloudflare.
- `dig +short shopping.mishava.org` - no answer.
- Browser live checks - root Shopping loads older surface; toilet paper/product routes return 404.
- Browser local checks - current Shopping POC routes and trust popup verified.
- `npm run typecheck` - passed after stopping stale local TypeScript workers and clearing ignored `.next` / `tsconfig.tsbuildinfo` cache artifacts.
- `npm run lint` - stalled twice with an idle ESLint process and no reported lint errors.
- `npm test` - passed, 150/150.
- `npm run build` - stalled before Next build output after the local cache/process churn; no build error was emitted.
- `supabase migration list --linked` - passed/aligned through `202605260009`.

Tooling note:

- The local standalone typecheck recovered cleanly after clearing ignored caches and stale workers.
- Lint/build still need a follow-up tooling sanity pass before the next implementation slice or before deployment.
- The live route failure is a deployment/routing issue, not a product-data/schema issue in the local preview.

## Confirmations

- No major features were added.
- No products were added.
- No migrations were added.
- No checkout was built.
- No Plus surface was built.
- No Local inventory was built.
- No Business/Gov/Corporate work was added.
- No AI scoring was added.
- No crawler or scraping system was added.
- No affiliate/referral/commission logic was added.
- No fake products, fake evidence, fake suppliers, fake images, or fake scores were added.
- No medical claims were added.
- Payment still cannot affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or trust outcomes.
- Old Supabase project was not touched.

