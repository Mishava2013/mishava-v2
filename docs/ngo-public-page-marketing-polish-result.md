# NGO Public Page Marketing Polish Result

Date: 2026-05-27

## What changed

- Reworked the public `/ngo` page so it leads with the NGO problem and outcome instead of opening with workflow cards and pricing.
- Updated the hero headline to focus on turning scattered evidence into funder-ready trust reports.
- Added clearer hero CTAs:
  - Start a free NGO profile
  - See how reports work
- Added a visible trust line: no paid trust outcomes, evidence stays reviewable, and reports stay private until shared.
- Added a new "Why NGOs need this" section before pricing.
- Added a new "How Mishava works for NGOs" flow:
  1. Create your NGO profile
  2. Add evidence and documents
  3. Build a report from reviewed evidence
  4. Share a scoped report
- Added a trust guardrails section covering evidence-based reports, payment firewall language, and human review.
- Moved the NGO access model lower on the page and reframed it as "Choose your starting point."
- Added short plan guidance beside the existing plan/pricing data.
- Improved mobile wrapping for the hero headline, intro copy, and CTA buttons.

## Before / after strategy

Before, `/ngo` read like an accurate but transactional product/pricing sheet. It introduced evidence intake, reports, scoped sharing, and pricing before building much motivation.

After, the page now follows a clearer public marketing path:

1. Name the NGO reporting pain.
2. Explain the outcome.
3. Show why the workflow matters.
4. Explain how Mishava works.
5. Reinforce trust guardrails.
6. Show access tiers as starting points.
7. End with focused CTAs.

## Pricing unchanged

Pricing values were not changed. The page still uses the existing NGO plan source of truth:

- Free NGO Profile: $0/month
- Grassroots: $19/month or $190/year
- Growth: $59/month or $590/year
- Trust Pro: $129/month or $1,290/year
- Network / Foundation / Association: Custom

## Screenshots captured

Screenshots are ignored/uncommitted and stored at:

- `/Users/caitlinferguson/Documents/Mishava V2.0/screenshots/ngo-public-marketing-polish/ngo-hero.png`
- `/Users/caitlinferguson/Documents/Mishava V2.0/screenshots/ngo-public-marketing-polish/ngo-value-workflow.png`
- `/Users/caitlinferguson/Documents/Mishava V2.0/screenshots/ngo-public-marketing-polish/ngo-pricing-access.png`
- `/Users/caitlinferguson/Documents/Mishava V2.0/screenshots/ngo-public-marketing-polish/ngo-footer-cta.png`
- `/Users/caitlinferguson/Documents/Mishava V2.0/screenshots/ngo-public-marketing-polish/ngo-mobile.png`

Screenshot notes:

- Vercel preview URLs are protected by SSO, so screenshots were captured from the production deployment after Vercel build verification.
- Mobile screenshot initially exposed hero/CTA horizontal clipping; CSS was tightened and recaptured.

## Tests run

- `npm run typecheck`: passed.
- `npm test`: passed, 150/150.
- `npm run build`: passed locally.
- Vercel production build/deploy: passed after the final mobile wrapping fix.
- `npm run lint`: stalled with no errors emitted after 3 minutes; the idle ESLint process was stopped. This matches the recurring local ESLint stall behavior seen in earlier tooling checks and was not caused by an emitted lint failure.

## Known limitations

- This was a public-page copy/layout polish only; it does not add new NGO product functionality.
- The page still depends on the existing global header/navigation.
- The NGO access table remains a table, though it is now lower on the page and wrapped for horizontal overflow.

## Confirmations

- Backend logic was not changed.
- Pricing values were not changed.
- No Supabase migrations were added or touched.
- No old Supabase project work was performed.
- No fake testimonials, fake customers, fake certifications, fake metrics, or unsupported claims were added.
- No new product features were added.
