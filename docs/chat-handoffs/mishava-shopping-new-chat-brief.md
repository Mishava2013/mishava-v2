# Mishava Shopping New-Chat Brief

Date: June 23, 2026

Use this brief to start a focused new chat for Mishava Shopping.

## Current Status

Mishava Shopping is live at:
- `https://shopping.mishava.org`

Clean setup:
- GitHub repo: `Mishava2013/mishava-v2`
- Vercel project: `mishava-v2`
- Supabase project: `mishava-v2-dev / snnscnodegbyqexnopvf`

Do not touch:
- `dsuupr-am`
- Old Supabase project `mishava / tghbfautnxblfxrtkdqb`
- DNS/domains unless explicitly asked

Shopping is ready for a first older-user guided preview, desktop-first. It is not ready for broad public beta.

## Percent Estimates

- Guided preview readiness: 84-87%.
- Broad public beta readiness: 43-49%.
- Product lookup/search readiness: 45-52%.
- Account/priorities readiness: 70-78%.
- Evidence/source card readiness: 76-83%.
- Preliminary evidence match readiness: 35-45%.
- Final Mishava scoring readiness: 18-25%.
- Research/data operations readiness: 38-48%.
- Senior-friendly usability readiness: 78-85%.
- Category/product coverage readiness: 30-38%.

## What Is Built

- Live Shopping landing.
- Search over existing Mishava product records.
- Baby diapers/wipes category with 8 real source-backed products.
- Toilet paper category with 12 real source-backed products.
- Kirkland, Cashmere, and Purex product detail pages.
- Supplier/manufacturer transparency.
- Costco private-label handling without guessing manufacturer/supplier.
- Kruger/Cashmere/Purex separation.
- Product detail source/evidence cards.
- Non-photo image fallback strategy.
- Places-to-buy source rows where available.
- Shopping Priorities route and save action.
- Free Shopping account/sign-in popup context protections.
- Score pending and evidence gap language.
- Research task table/status model.
- No-paid-ranking/no-commission/payment firewall guardrails.
- No-medical-claims guardrails.
- AI provider guardrails and no AI final outcomes.

## What Is Not Built

- Product-not-found research request.
- User-facing research request flow.
- Admin research/source review queue.
- Autonomous web/source research.
- AI provider calls.
- Final Mishava Scores.
- Final Your Values Scores.
- Numeric preliminary match.
- Broad product/category coverage.
- Real product images with cleared rights.
- Checkout, Plus, Local inventory, Business/Gov/Corporate expansion.

## What The New Chat Should Focus On

The next focused Shopping chat should focus on:
1. Release 4 Slice 14: Product Lookup/Search and Research-Request Flow.
2. Live account/priorities proof on `shopping.mishava.org`.
3. First older-user guided preview preparation.

The new chat should not focus on:
- Final scoring.
- AI research/provider adapters.
- Checkout.
- Plus.
- Affiliate/commission logic.
- Broad category expansion before request/research flow works.
- DNS/Vercel/domain work.
- NGO work.

## Key Guardrails

Keep these true:
- No fake scores.
- No fake evidence.
- No fake products.
- No fake suppliers.
- No fake manufacturers.
- No fake images.
- No medical claims.
- No paid ranking.
- No affiliate/commission-driven ranking.
- No AI final trust outcomes.
- No outside score copied as a Mishava Score.
- No final score before reviewed evidence and approved scoring logic.
- Missing evidence remains visible.
- Mishava is not the store.

## Key Docs

- `docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md`
- `docs/chat-handoffs/mishava-shopping-chat-handoff.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md`
- `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/mishava-ai-minimize-architecture-direction.md`
- `docs/mishava-ai-control-enforcement-result.md`

## Suggested Opening Message For New Chat

```text
We are starting a focused Mishava Shopping chat. Use docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md and docs/chat-handoffs/mishava-shopping-new-chat-brief.md as the source of truth.

Shopping is live at https://shopping.mishava.org and is ready for a first older-user guided preview, desktop-first. It is not broad public beta. The next likely task is Release 4 Slice 14: Product Lookup/Search and Research-Request Flow.

Do not add final scores, checkout, Plus, affiliate/commission logic, medical claims, fake products, fake evidence, fake suppliers, fake images, AI provider calls, crawler/scraping, DNS changes, dsuupr-am work, old Supabase work, or NGO work unless specifically scoped.
```

## Suggested First Codex Prompt

```text
Implement Release 4 Slice 14: Shopping Product Lookup/Search and Research-Request Flow.

Source of truth:
- docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md
- docs/chat-handoffs/mishava-shopping-new-chat-brief.md
- docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md
- docs/release-4-slice-13-senior-friendly-shopping-usability-result.md
- docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md
- docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md

Scope:
Shopping product lookup/search and product-not-found research request only.

Do not build checkout.
Do not build Plus.
Do not build Local inventory.
Do not build Business/Gov/Corporate.
Do not build AI scoring.
Do not enable AI provider calls.
Do not build crawler/scraping.
Do not add affiliate/referral/commission logic.
Do not create fake products, fake sellers, fake evidence, fake sources, fake suppliers, fake manufacturers, fake images, or fake scores.
Do not copy outside scores as Mishava Scores.
Do not make medical claims.
Do not allow payment to affect score, ranking, visibility, verification, credibility labels, evidence truth, or trust outcomes.
Do not change DNS/domains.
Do not touch dsuupr-am.
Do not touch old Supabase.

Implement:
1. Improve existing-record search so users can search by product name, brand, category, retailer/source, parent company, private-label owner, manufacturer, and supplier.
2. Add a clearer product-not-found state:
   - "Mishava has not reviewed this product yet."
   - "You can request Mishava research."
   - "A score will not appear until sources and claims are reviewed."
3. Add a minimal research-request flow for signed-in Shopping users, or a clear sign-in/create-account prompt before request submission.
4. Store request data safely if a migration is needed:
   - submitted search text
   - optional product name
   - optional brand
   - optional retailer URL
   - optional product URL
   - optional notes
   - requested_by
   - status
   - created_at
   - updated_at
5. Connect requests to the existing research-task model only if safe and minimal.
6. Show user-facing request status without implying reviewed evidence or a score.
7. Keep existing toilet paper and baby category behavior intact.
8. Keep Shopping Priorities from creating fake scores.

Tests:
- existing product search finds known records.
- not-found search does not create a fake product.
- research request requires enough user/input context.
- research request does not create a score, evidence claim, supplier, manufacturer, image, or place-to-buy.
- outside scorecards remain evidence references only.
- payment/affiliate/commission fields remain excluded from ranking.
- no medical claims.
- npm test.
- node --test scripts/release-4-shopping.test.mjs scripts/auth-surface-routing.test.mjs scripts/payment-firewall.test.mjs scripts/ai-provider-import-guard.test.mjs.
- npm run typecheck.
- npm run lint, or document any existing local dependency issue separately.
- npm run build.
- supabase migration list --linked if a migration is added.
- live route checks if deployed.

Create:
docs/release-4-slice-14-shopping-product-lookup-research-request-result.md

Include:
- what was implemented
- whether a migration was added
- request/search behavior
- screenshots if browser-tested
- tests/checks run
- known limitations
- whether Shopping is more ready for first guided preview
- confirmation no final scores/fake data/medical claims/AI provider calls/checkout/Plus/affiliate/commission/payment influence were added
- confirmation dsuupr-am and old Supabase were untouched

Commit code, tests, migration if any, and result doc together.
```

## Immediate Recommendation

Start the new chat now. The first task should be Slice 14 implementation unless Jos wants one more planning-only pass. The existing Slice 14 plan is already strong enough to implement carefully.
