# Shopping Free Account Priorities Flow Result

Date: 2026-06-03

## Summary

Mishava Shopping remains a free preview service. Product browsing stays public, but the user-facing account path now makes clear that shoppers should create a free Shopping account when they want Mishava to remember their Shopping Priorities for personal match previews.

## What Changed

- Updated the Shopping landing CTA from a generic priorities link to `Create a free Shopping account`.
- Routed new Shopping account creation directly to `/auth/sign-up?next=%2Fapp%2Fshopping-priorities&surface=shopping`.
- Kept signed-in users able to go directly to Shopping Priorities.
- Updated the toilet paper category callout with separate signed-in and new-user language.
- Updated Shopping sign-up copy to say the account is free during preview and returns users to Shopping Priorities.
- Updated the Shopping Priorities page to explain that priorities are the free profile Mishava uses to remember what matters to the shopper.

## Guardrails

- No checkout was added.
- No Plus billing was added.
- No paid ranking, affiliate, commission, or payment influence was added.
- No final scores were created.
- No medical claims were added.
- Product browsing remains public.
- Shopping Priorities still do not create or change a final Evidence Score.

## Verification

- `npm test` should cover the free Shopping account copy, Shopping surface routing, and no-medical-claim guardrails.
- Local typecheck/lint/build have had intermittent worker stalls in this repo; production Vercel build should remain the deployment compile gate when local workers stall.

## Remaining Work

- Verify the live signup flow after deployment:
  - Shopping landing -> `Create a free Shopping account`
  - Sign-up page says `Create your free Mishava Shopping account`
  - Successful sign-up or confirmation flow returns to Shopping Priorities
  - Existing account sign-in opens the popup and returns to Shopping Priorities
- Later, add a lightweight support/admin view for Shopping signup support only, not approval.
