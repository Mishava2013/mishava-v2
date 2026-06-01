# Release 4 Slice 12: Shopping First User Account and Evidence Readiness Plan

Date: 2026-06-01

## Context

Mishava Shopping is live at:

`https://shopping.mishava.org`

Release 4 Slice 11 confirmed the toilet paper preview is controlled guided-preview ready, with a desktop-first caveat.

The next goal is to make the first real user experience stronger before sending it to the first user.

The first intended user wants to look up toilet paper. Ideally, she should be able to:

- visit Shopping;
- create an account or sign in;
- set up Shopping Priorities;
- open the toilet paper category;
- view Kirkland, Cashmere, Purex, and other toilet paper products;
- see real evidence and source information about products and companies;
- understand what Mishava knows, what is missing, and why final scores are pending.

## Goal

Plan the first-user Shopping account and evidence readiness work needed before inviting a real user into the live Shopping preview.

The target is not a full public Shopping launch. The target is a clearer, safer, more useful guided walkthrough for one real user looking up toilet paper.

## Scope

First-user Shopping account readiness and real evidence readiness for toilet paper only.

Do not build:

- checkout;
- Plus;
- Local inventory;
- Business, Gov, or Corporate surfaces;
- AI scoring;
- crawler or scraping systems;
- affiliate, referral, or commission logic.

Do not create:

- fake users;
- fake products;
- fake sellers;
- fake evidence;
- fake sources;
- fake images;
- fake suppliers;
- fake manufacturers;
- fake scores.

Do not copy outside scores as Mishava Scores.

Do not make medical claims.

Do not claim product safety or suitability for Crohn's or any medical condition.

Do not allow payment to affect score, ranking, visibility, verification, credibility labels, methodology outputs, evidence truth, or trust outcomes.

Do not touch `dsuupr-am`.

Do not touch the old Supabase project.

## 1. First-User Account Flow Audit

Implementation should review the live account flow starting from:

`https://shopping.mishava.org`

Check:

- sign-up route;
- sign-in route;
- sign-out behavior;
- account/session persistence;
- password reset if currently supported;
- Supabase Auth redirect URLs required for `shopping.mishava.org`;
- whether email confirmation is required;
- whether auth works on the clean `mishava-v2` Vercel project;
- whether auth links route back to Shopping or strand the user on an app/account page;
- whether all sign-in entry points use the intended popup/modal behavior if that is now the desired product direction.

Document:

- what works;
- what is blocked;
- what requires Supabase dashboard configuration;
- what requires Vercel environment configuration;
- what should be fixed before inviting the first user;
- whether the preview can be shown signed-out if auth is not fully ready.

Minimum readiness expectation:

- A first user can either view the Shopping preview without signing in, or sign in/sign up through a clear path that does not interrupt the guided walkthrough.

## 2. Shopping Priorities Setup

Review whether a first user can:

- create Shopping Priorities;
- update Shopping Priorities;
- understand why priorities matter;
- complete the minimum required answers if applicable;
- return to Shopping after completing priorities;
- understand that Shopping Priorities personalize interpretation but do not create fake scores;
- understand that Your Values Match Preview appears only when user priorities and reviewed evidence support it.

Plan copy/UI polish if needed:

- explain priorities in plain language;
- avoid implying medical suitability;
- make the return path back to toilet paper obvious;
- explain incomplete evidence clearly;
- show "not enough evidence yet" rather than a fake match number.

## 3. Guided Toilet Paper Path After Login

Plan the signed-in guided path:

1. Land on Shopping.
2. Open Toilet paper.
3. Open Kirkland.
4. Review retailer/private-label owner, manufacturer/supplier unknowns, evidence gaps, and score-pending state.
5. Open Cashmere.
6. Review Kruger Products context, product evidence gaps, and score-pending state.
7. Open Purex.
8. Review Kruger Products context, product evidence gaps, and score-pending state.
9. Compare what is known and missing across products.
10. Understand why final score is pending.

If login is not required for viewing:

- keep product/category pages public;
- prompt for Shopping Priorities only where personalization requires an account;
- do not block evidence/gap browsing behind account creation unless necessary.

Recommended approach for first preview:

- Allow signed-out browsing of the toilet paper category and product pages.
- Use account creation/sign-in primarily for Shopping Priorities and saved preference behavior.
- If auth has any live uncertainty, run the first guided preview as a public read-only walkthrough and defer account setup until auth is verified.

## 4. Real Online Evidence Readiness

Plan how Mishava should show actual evidence for toilet paper products and companies.

Evidence categories:

- official product page;
- brand/manufacturer page;
- retailer/place-to-buy page;
- sourcing or sustainability page;
- certification page or certifier database if available;
- packaging/product claim source if available;
- third-party reference if credible;
- NGO/report/scorecard as evidence context only, not a Mishava Score.

For toilet paper, focus evidence on:

- recycled content;
- post-consumer recycled content;
- bamboo/tree-free/FSC claims;
- virgin fiber reliance;
- bleaching/process claims;
- fragrance/free-from/comfort claims only if source-supported;
- packaging claims;
- supplier/manufacturer transparency;
- price/value where safely verified;
- source freshness.

Rules:

- Do not build autonomous web scraping in this slice.
- Do not invent evidence.
- Do not add unsourced claims.
- If a source cannot be verified, show it as an evidence gap.
- If a claim is visible on a retailer page but not verified from the brand/manufacturer/certifier, label it as source-recorded but not Mishava-reviewed.
- Outside scorecards can be evidence references only.

## 5. Evidence Display UX

Product pages should show evidence in a simple, normal-user-readable way.

Recommended evidence section fields:

- evidence source title;
- source type;
- source URL;
- reviewed status;
- last reviewed date;
- claim summary;
- confidence;
- what this source supports;
- what this source does not prove;
- missing evidence gaps.

Recommended display pattern:

- "What Mishava has a source for"
- "What this source supports"
- "What this source does not prove"
- "What is still missing"

Keep language plain:

- "Source recorded"
- "Reviewed by Mishava"
- "Not reviewed yet"
- "Manufacturer not verified"
- "Supplier not verified"
- "This claim needs stronger evidence"

Avoid:

- dense research jargon;
- score-like numbers before scoring is ready;
- long evidence tables as the only explanation.

## 6. Company/Product Evidence Relationship

Evidence should be tied to the right entity type:

- product;
- brand;
- parent company;
- private-label owner;
- manufacturer;
- supplier;
- retailer/place-to-buy.

This matters because product evidence, company evidence, and retailer evidence are not interchangeable.

### Costco/Kirkland

Model:

- Costco may be retailer where supported.
- Costco may be private-label owner where supported.
- Kirkland Signature is the consumer-facing brand.
- Manufacturer should remain unknown unless verified.
- Supplier should remain unknown unless verified.
- Sourcing claims require specific evidence.

Rules:

- Do not give Costco manufacturing credit or blame unless the evidence supports it.
- If supplier may vary by region/time, say so plainly.
- If manufacturer/supplier is unknown, show that as an evidence gap.

### Kruger/Cashmere/Purex

Model:

- Cashmere and Purex are consumer-facing product brands where source data supports them.
- Kruger Products may be manufacturer/brand owner where verified.
- Product-level sourcing/recycled/FSC/bleaching/packaging claims still need product-specific evidence.

Rules:

- Do not infer recycled content, sourcing, FSC, bleaching, packaging, or comfort claims from company identity alone.
- Do not create a Mishava Score from Kruger ownership.
- Show product evidence gaps separately from company/manufacturer evidence.

## 7. Score And Match Behavior

Clear rules:

- Final Mishava Score remains pending unless reviewed evidence and an approved scoring method support it.
- Evidence Score Preview may summarize evidence readiness, not final score.
- Your Values Match Preview appears only if user priorities and reviewed evidence support it.
- Incomplete evidence should show "not enough evidence" or "evidence profile incomplete" rather than fake numbers.
- Outside scorecards are references only.
- Unreviewed research tasks cannot create score facts.
- Payment, affiliate, commission, sponsorship, and placement fields remain excluded from ranking and trust outcomes.

Recommended labels:

- `Score pending`
- `Evidence profile incomplete`
- `Evidence Score Preview`
- `Your Values Match Preview unavailable`
- `Mishava review not finalized`
- `Not enough reviewed evidence yet`

Avoid:

- `Final Mishava Score`
- `certified score`
- `best`
- `recommended for Crohn's`
- score-like grades unsupported by Mishava-reviewed evidence.

## 8. Medical/Care-Sensitive Language

Because the first user has Crohn's, language must be careful, useful, and non-medical.

Allowed language:

- "This is not medical advice."
- "Mishava does not determine whether a product is safe for a medical condition."
- "Comfort, fragrance-free, or sensitivity-related claims are shown only when source-supported."
- "Ask a medical professional for medical suitability."
- "Mishava can show source-backed product claims and evidence gaps."

Avoid:

- "best for Crohn's";
- "safe for Crohn's";
- "non-irritating";
- "medically recommended";
- "guaranteed safe";
- any suggestion that Mishava has medically evaluated toilet paper.

Recommended first-user explanation:

`Mishava can help you see what a product claims, what sources support those claims, and what is still missing. It does not decide whether a product is medically safe or suitable for Crohn's or any other condition.`

## 9. Screenshots Requirement

Implementation should capture screenshots of:

- Shopping landing signed out;
- sign-up entry/page/modal;
- sign-in entry/page/modal;
- Shopping Priorities page;
- Shopping landing signed in if applicable;
- toilet paper category;
- Kirkland detail;
- Cashmere detail;
- Purex detail;
- evidence section on product detail;
- mobile Shopping landing if possible;
- mobile toilet paper category if possible;
- mobile product detail if possible.

Screenshots should remain ignored/uncommitted unless repository policy changes.

The result doc should reference screenshot paths.

## 10. Tests And Checks

Plan tests for:

- sign-up/sign-in routes render;
- Shopping Priorities route works;
- unauthenticated user gets a clear prompt where needed;
- authenticated user can access priorities;
- product pages show evidence/gap states without final scores;
- evidence sources require source URL and review status;
- unreviewed evidence does not create scores;
- medical claim guardrails;
- payment/affiliate/commission fields remain excluded;
- no fake evidence or fake scores;
- no outside score copied as Mishava Score.

Run:

- `npm test`;
- `npm run typecheck`;
- `npm run lint`;
- `npm run build`;
- `supabase migration list --linked`;
- live route checks.

If local tooling stalls:

- document the last output line;
- inspect whether the process is alive or idle;
- stop lingering processes if needed;
- distinguish local tooling caveat from live route readiness;
- do not disable checks as a workaround.

## 11. Non-Goals

Exclude:

- full scoring engine;
- final tissue methodology;
- autonomous web crawler;
- AI research automation;
- checkout;
- Plus;
- broad category expansion;
- public claims of medical suitability;
- public claims of final scoring;
- production affiliate or commission features;
- fake or synthetic evidence.

## 12. Acceptance Criteria

Slice 12 can be implemented only if:

- first user can access Shopping clearly;
- account/priorities flow is understood;
- toilet paper evidence/gap walkthrough is stronger;
- actual source-backed evidence can be displayed;
- evidence is attached to the correct product/company/retailer/manufacturer/supplier relationship;
- final scores remain pending unless justified;
- Your Values Match remains unavailable unless priorities and reviewed evidence support it;
- no medical claims are made;
- no fake evidence or scores are introduced;
- user-facing language is simple enough for a non-technical person;
- payment/affiliate/commission influence remains excluded.

## Output For Implementation

Implementation should create:

`docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`

Include:

- account readiness result;
- Shopping Priorities readiness result;
- public vs signed-in browsing behavior;
- evidence display changes, if any;
- product/company evidence relationship status;
- medical/care-sensitive language status;
- screenshots captured;
- tests/checks run;
- known limitations;
- whether the first user can be invited after Slice 12;
- confirmation no checkout/Plus/Local/Business/Gov/Corporate/AI/crawler/scraping/affiliate/commission features were added;
- confirmation no fake data, fake evidence, fake sources, fake scores, fake suppliers, fake manufacturers, or medical claims were added;
- confirmation `dsuupr-am` and old Supabase were untouched.

## Recommended Implementation Order

1. Audit live auth/account routes on `shopping.mishava.org`.
2. Audit Shopping Priorities route and return path.
3. Decide whether first preview should be signed-out, signed-in, or hybrid.
4. Review current toilet paper evidence display.
5. Add only source-backed evidence display polish if needed.
6. Add or update tests for evidence/source/medical/payment guardrails.
7. Capture screenshots.
8. Run checks.
9. Write result doc.

## Recommended First-User Path

If auth is fully ready:

1. Open `https://shopping.mishava.org`.
2. Sign in or create account.
3. Complete Shopping Priorities.
4. Return to Shopping.
5. Open Toilet paper.
6. Open Kirkland, Cashmere, and Purex.
7. Review evidence gaps and pending score explanations.

If auth is not fully ready:

1. Open `https://shopping.mishava.org`.
2. Browse signed out.
3. Open Toilet paper.
4. Open Kirkland, Cashmere, and Purex.
5. Treat Shopping Priorities as a follow-up once account flow is fully verified.
