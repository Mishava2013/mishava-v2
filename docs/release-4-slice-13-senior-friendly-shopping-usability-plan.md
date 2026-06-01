# Release 4 Slice 13: Senior-Friendly Shopping Usability Pass Plan

Date: 2026-06-01

## Goal

Make Mishava Shopping easier for a normal non-technical user to understand, especially on the toilet paper guided preview path.

The first likely preview user is over 74, has a high school diploma, and is comfortable with mainstream sites such as Facebook and Target.com. Mishava should feel clear, trustworthy, and practical without needing a technical explanation.

This is not a feature-expansion slice. It is a usability, copy, navigation, readability, and guided-preview polish slice.

## Source Context

- Mishava Shopping is live at `https://shopping.mishava.org`.
- Slice 11 found the live Shopping preview controlled guided-preview ready, desktop-first.
- Slice 12 improved account return paths, Shopping Priorities copy, and product evidence source display.
- Toilet paper is the first real guided-preview category.
- Final scores remain pending unless reviewed evidence and scoring logic support them.
- Shopping still must avoid fake scores, fake evidence, fake products, fake suppliers, fake images, fake claims, medical claims, paid ranking, affiliate ranking, and commission-driven ordering.

## Scope

In scope:

- Shopping homepage usability.
- Toilet paper category clarity.
- Toilet paper product detail hierarchy.
- Plain-language score/evidence explanations.
- Account and Shopping Priorities invitation timing.
- Senior-friendly font, spacing, contrast, button, and tap-target review.
- Guided preview script for the first user.
- Desktop and mobile screenshot review.
- Tests and live route checks.

Out of scope:

- Checkout.
- Plus.
- Local inventory.
- Business, Gov, or Corporate surfaces.
- AI scoring.
- Crawler or scraping.
- Affiliate, referral, or commission logic.
- New products.
- Fake evidence, fake scores, fake claims, fake suppliers, or fake images.
- Medical claims.
- DNS/domain changes.
- `dsuupr-am`.
- Old Supabase.

## Plain-Language Goal

A first-time user should understand these ideas within the first few seconds:

- Mishava helps compare products by evidence, not ads.
- Mishava is not the store.
- Mishava does not sell the product.
- Mishava does not rank products because someone paid.
- Some scores are not ready because evidence is still missing.
- Missing evidence is part of the point, not a broken page.

Recommended plain-language framing:

> Mishava shows what we found, what we still need, and why a score is not ready yet.

Avoid technical-first framing such as:

- evidence readiness state;
- research task status;
- source confidence taxonomy;
- scoring version prerequisites;
- supplier/manufacturer confidence;
- structured claims.

These details can remain available lower on the page, but they should not be the first thing a normal user has to decode.

## 10-Second Homepage Test

Implementation should review `https://shopping.mishava.org` and `/shopping` against these questions:

1. Is the main headline obvious?
2. Does it explain why a shopper should care?
3. Is "Toilet Paper" easy to find without scrolling too much?
4. Is there one clear next action?
5. Is there too much text before the user gets to products/categories?
6. Does the page quickly say Mishava compares evidence, not ads?
7. Does the page make clear Mishava is not the store?

Recommended homepage direction:

- Lead with a shopper-centered headline.
- Put the toilet paper preview path near the top.
- Reduce explanatory density before product/category cards.
- Keep no-paid-ranking/no-commission visible, but in plain language.
- Use a primary action such as `Browse toilet paper`.

Possible copy:

> Compare products by what Mishava can verify.

Supporting copy:

> Start with toilet paper. Mishava shows what we found, what is missing, and why scores may still be pending.

## Toilet Paper Category Clarity

The category page should clearly answer:

- What am I looking at?
- Why are these products shown?
- Are these products for sale here?
- Why do some products not have scores?
- What should I click first?

Recommended structure:

1. Short heading: `Toilet paper preview`.
2. One-sentence explanation: `These are real products Mishava is reviewing. Scores stay pending when evidence is incomplete.`
3. Clear store disclaimer: `Mishava is not the store; links go to source or retailer pages.`
4. Product cards with simpler status labels.
5. Suggested first products: Kirkland, Cashmere, Purex.

Product cards should make `Score not ready yet` feel intentional. The card should not look empty or broken when no final score exists.

## Product Detail Clarity

Plan a simpler hierarchy for toilet paper product pages:

1. Product name.
2. Short brand/retailer context.
3. Primary status: `Score not ready yet` or `Mishava is still reviewing this`.
4. Where to buy/source area.
5. `What Mishava found`.
6. `What Mishava still needs`.
7. `Why the score is pending`.
8. Company/source information.
9. Deeper supplier/manufacturer details.
10. Technical evidence source cards.

Current supplier/manufacturer transparency should remain, but it should move behind friendlier headings or lower-page sections so it does not overwhelm the first impression.

Recommended product detail headings:

- `What Mishava found`
- `What Mishava still needs`
- `Why there is no final score yet`
- `Company and source information`
- `Evidence sources`

Avoid making these the first visible labels:

- `Research task status`
- `Supplier confidence`
- `Evidence dimensions`
- `External evidence available`

## Replace Technical Labels With User-Friendly Labels

Review current labels and simplify where practical:

| Current / Technical Label | Friendlier Label |
| --- | --- |
| `Evidence Score Preview` | `Score preview` or `Evidence review preview` |
| `Your Values Match Preview unavailable` | `Personal match is not ready yet` |
| `Research task status` | `Mishava is still reviewing this` |
| `External evidence available` | `Outside source found` |
| `Supplier confidence` | `How sure we are about the supplier` |
| `Manufacturer confidence` | `How sure we are about the manufacturer` |
| `Evidence profile pending` | `Evidence profile is not complete yet` |
| `Score pending` | `Score not ready yet` |
| `Source approved` | `Source reviewed` |

Keep deeper evidence details available, but prioritize user comprehension.

## Account And Priorities Flow

The first user should not be forced to create an account before understanding the value.

Plan:

- Product browsing remains public.
- Toilet paper category remains public.
- Product detail evidence/gaps remain public.
- Login is introduced only when there is a clear benefit.
- Shopping Priorities language becomes simple:
  - `Tell Mishava what matters most to you.`
  - `Your priorities help explain personal fit later. They do not change product scores.`
- If the user is not signed in, show a light prompt rather than a hard interruption unless they try to save priorities.

Recommended account invitation:

> Want Mishava to remember what matters to you? Create an account to save Shopping Priorities.

Avoid:

- implying account creation is required to view toilet paper;
- implying priorities create a real score;
- asking for account setup too early in the guided preview.

## Font, Spacing, And Button Clarity

Implementation should review:

- Body text size: avoid tiny explanatory text.
- Line height: paragraphs should feel easy to read.
- Contrast: important labels should not be faint gray.
- Buttons: primary actions should be visually obvious.
- Tap targets: mobile buttons/links should be large enough.
- Paragraph density: avoid long stacked explanations.
- Cards: avoid dense badge clusters that require decoding.
- Status labels: use fewer, clearer badges per card.

Suggested readability targets:

- Favor short paragraphs of 1-3 sentences.
- Use section headings that read like normal questions.
- Use status text that explains the consequence, not just the state.
- Keep critical disclaimers visible but concise.

## Guided Preview Script

Implementation result should include a short walkthrough script for Jos to use with the first user.

Draft script:

1. "Start here: open `https://shopping.mishava.org`."
2. "Click Toilet Paper."
3. "These are real products Mishava is reviewing."
4. "Open Kirkland."
5. "Look at `What Mishava found`."
6. "Now look at `What Mishava still needs`."
7. "This is why the score is not final yet."
8. "Mishava is not selling this product. It is showing sources and evidence gaps."
9. "Now compare Cashmere and Purex."
10. "If you want Mishava to remember what matters to you, we can set up Shopping Priorities."

The script should avoid medical advice. If the user asks about Crohn's or product suitability, use:

> Mishava does not decide whether a product is safe for a medical condition. It can show source-supported comfort, fragrance, or material claims when they exist.

## Screenshots Required For Implementation

Capture screenshots for:

- Shopping homepage desktop.
- Shopping homepage mobile.
- Toilet paper category desktop.
- Toilet paper category mobile.
- Kirkland product detail desktop.
- Kirkland product detail mobile.
- Cashmere detail if changed.
- Purex detail if changed.
- Sign-up/priorities page if touched.

Screenshots should remain ignored/uncommitted unless repo policy changes. Reference paths in the result doc.

If local browser viewport tooling is unavailable, document the limitation and capture what is possible from the live domain.

## Tests And Checks Required

Add or extend tests for:

- Shopping page renders the simplified senior-friendly entry copy.
- Toilet paper category renders clear "what this is" and "Mishava is not the store" language.
- Product detail renders known/missing evidence sections.
- Product detail explains why score is pending.
- Account/priorities copy does not force login before browsing.
- No final scores are invented.
- No medical claims are added.
- No paid ranking or commission logic is added.
- No fake evidence is added.

Run:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- live route checks

Known tooling caveat:

Recent local `typecheck`, `lint`, `build`, and `dev` commands have stalled in this Codex/local shell without printing errors. Implementation should rerun them and document exact behavior. Do not disable checks or bypass the issue with config changes unless the slice explicitly becomes a tooling-fix task.

## Non-Goals

- Checkout.
- Plus.
- Local inventory.
- Business/Gov/Corporate.
- AI scoring.
- Crawler/scraping.
- Affiliate/referral/commission logic.
- Fake scores.
- Fake evidence.
- Fake products.
- Fake suppliers/manufacturers.
- Fake images.
- Medical claims.
- DNS/domain changes.
- `dsuupr-am` changes.
- Old Supabase changes.

## Acceptance Criteria

Slice 13 is complete when:

- A non-technical user can understand the Shopping homepage quickly.
- Toilet paper is easy to find from the homepage.
- Product pages explain known/missing evidence plainly.
- Score pending feels intentional, not broken.
- Account/priorities flow is not forced too early.
- Desktop is ready for a guided older-user preview.
- Mobile is at least usable with documented caveats.
- No fake scores, fake evidence, fake claims, medical claims, paid ranking, affiliate ranking, commission influence, or payment influence are added.
- Tests and live route checks are run or accurately documented if local tooling stalls.

## Recommended Implementation Order

1. Review current Shopping homepage and toilet paper path visually.
2. Simplify homepage headline, intro, and category call-to-action.
3. Simplify toilet paper category intro and product-card status labels.
4. Reorder product detail sections into `found`, `still need`, and `score pending` language.
5. Simplify Shopping Priorities/account prompts without changing auth logic.
6. Add regression tests for copy and guardrails.
7. Capture desktop/mobile screenshots.
8. Run checks and live route smoke.
9. Create `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`.

## Recommendation For Codex Next

Implement Slice 13 as a narrow copy/layout usability pass. Do not add data depth or new product infrastructure. The main success measure is whether Jos can sit beside the first user, open the Shopping preview, and have the page itself explain the idea without a technical preface.
