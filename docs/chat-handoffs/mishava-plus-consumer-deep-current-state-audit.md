# Mishava Plus / Consumer Accounts Deep Current-State Audit

Date: June 23, 2026

## 1. Executive Summary

Mishava Plus / Consumer Accounts is meant to help normal shoppers use Mishava personally without corrupting the trust model. The future product should let a shopper browse publicly, create a free account, save Shopping Priorities, save products, follow products or companies, receive alerts, compare products by personal values, manage privacy, and later choose paid Plus features that never affect scores, ranking, evidence, credibility labels, verification, or trust outcomes.

Current readiness level: **22-28% overall**. The foundation is better than the older 18-22% estimate because Shopping account routing, product-line sign-up copy, Shopping Priorities, privacy acknowledgement, account prompts, and guardrail tests are now stronger. It is still not a complete Plus product.

Genuinely done:

- Shopping can be browsed without an account.
- Shopping sign-up/sign-in surfaces use Shopping-specific copy and return paths.
- Sign-in uses a shared popup pattern.
- Shopping Priorities exist behind authentication.
- Priorities are stored per user with RLS.
- Priorities explain they do not create final scores or medical suitability claims.
- Product detail pages can prompt signed-out shoppers to create/sign in to save priorities.
- Payment firewall and AI-control guardrails are strong.

Not done:

- Saved products are not real yet.
- Watchlist/following is not real yet.
- Alerts/notifications are not real yet.
- Consumer privacy dashboard/deletion/export is not real yet.
- Paid Plus is not built and should not be sold.
- Personal Values Match is guarded and mostly unavailable because final reviewed evidence/scoring is not ready.

Live:

- Shopping public preview at `https://shopping.mishava.org`.
- Shopping product/category pages.
- Sign-up/sign-in routes.
- Auth-protected `/app/shopping-priorities`.
- Placeholder `/app/saved`, `/app/watchlist`, and `/app/billing`.

Built but not exposed as complete:

- Signed-in app workspace shell.
- Saved/watchlist placeholders.
- Billing placeholder for future Plus/consumer tools.

Only planned:

- Real saved products.
- Product/company/category follows.
- Alerts.
- Household/family preference sets.
- Paid Plus.
- Privacy management beyond priorities consent.

Blocked:

- Values Match needs reviewed product evidence and approved methodology.
- Alerts need saved/follow data models and email/notification consent.
- Paid Plus should wait until free Shopping and privacy controls are stable.
- Care-sensitive preference features need medical-claim guardrails and plain language.

Honest next step: **Plan Saved Products / Watchlist and Consumer Account Privacy Flow**. This should happen before paid Plus or alerts because saved items are the first consumer account feature that gives obvious value without selling trust outcomes.

Consumer preview readiness: Shopping itself is ready for a guided preview; Plus/consumer accounts are **not** independently preview-ready beyond sign-up and Shopping Priorities.

Paid Plus readiness: **not ready**.

Irresponsible claims right now:

- Mishava Plus is launched.
- Mishava can personalize final scores.
- Mishava can recommend products for Crohn's or any medical condition.
- Paid Plus gives better trusted products.
- Alerts/watchlists are live.
- Consumer privacy controls are complete.

## 2. Percent Estimates

| Area | Estimate | Why reasonable | Moves higher | Moves lower | Biggest uncertainty |
| --- | ---: | --- | --- | --- | --- |
| Overall Plus/Consumer readiness | 22-28% | Account/priorities path exists, but most Plus features are placeholders. | Real saved products, privacy flow, follows, alerts. | Auth/live inbox issues or privacy gaps. | Whether account creation works smoothly with real users. |
| Consumer account readiness | 45-55% | Supabase auth routes, popup sign-in, product-line copy, return paths, reset pages exist. | Real inbox verification and browser QA. | Misrouted auth or email confirmation failures. | Live auth/email setup. |
| Shopping Priorities readiness | 58-68% | Real page, form, RLS table, 12-answer minimum, privacy acknowledgement. | Plain-language pass and values preview connection. | Confusing wording for older users. | Whether first users complete it without help. |
| Saved products/watchlist readiness | 8-14% | Routes exist as placeholders only. | Add user-product saved table and UI. | Treating placeholder as live. | Exact first saved-item scope. |
| Product/company following readiness | 4-10% | Concept appears in docs only. | Add follow model after saved products. | Mixing follows with scores/alerts too early. | Whether follows should start product-only. |
| Alerts/notifications readiness | 3-8% | Watchlist page names alerts, but no alert system. | Add consented alert preferences and event types. | Email/Auth/provider gaps. | Operational email reliability. |
| Personal Values Match readiness | 18-28% | Eligibility guardrails exist; no fake scores. | Reviewed evidence and preview rubric. | Pressure to show unsupported numbers. | Timing of scoring methodology. |
| Family/household preference readiness | 0-5% | Planned only. | Saved preference sets after basics. | Medical/care claims creep. | Privacy and data model shape. |
| Privacy controls readiness | 18-25% | Priorities are private via RLS and consent fields exist. | Delete/export/update/email opt-out controls. | Sensitive preference expansion without controls. | Consumer deletion/export expectations. |
| Paid Plus readiness | 3-8% | Placeholder billing route and payment firewall exist; no consumer Plus product. | Define paid/free boundaries after saved products. | Monetizing before privacy/value. | What should be paid without harming trust. |
| Payment firewall readiness | 85-92% | Strong tests and scoring helper guardrails. | Extend tests to Plus entitlements. | New Plus fields added without tests. | Future product pressure. |
| Public launch readiness | 10-16% | Public Shopping works; Plus is not public-ready. | Browser QA, privacy, saved items, support flow. | Auth/email confusion or incomplete privacy. | Real-user usability. |

## 3. Intended Consumer User Groups

| User group | Needs | Mishava should show | Must not promise | Privacy concerns | Risks |
| --- | --- | --- | --- | --- | --- |
| Signed-out shopper | Browse and understand value before sign-up. | Products, evidence gaps, score pending, not-store language. | Personal saved experience. | Minimal tracking. | Sign-up pressure too early. |
| Signed-in free shopper | Save priorities and later saved products. | Private priorities, clear return paths, no fake values score. | Final personal score. | Priorities tied to user. | Confusing account surfaces. |
| Older/non-technical shopper | Plain path and fewer technical terms. | "What Mishava found" and "What is still missing." | Technical certainty. | Needs simple controls. | Too much verbiage. |
| Parent/family shopper | Compare products for household needs. | Future preference sets and saved items. | Medical or safety guarantees. | Household data sensitivity. | Over-personalization. |
| Care-sensitive shopper | Source-backed sensitivity/comfort claims only. | Medical disclaimer and evidence limits. | Safe for Crohn's or medical condition. | Sensitive preference data. | Medical overclaim. |
| Values-driven shopper | Environmental/labor/source transparency. | Reviewed evidence and missing evidence. | Final match without evidence. | Values profile privacy. | Treating preferences as truth. |
| Future paid Plus subscriber | More convenience/capacity, not better trust. | Clear free vs paid tool boundaries. | Better ranking, score, or credibility. | Billing plus profile data. | Paid trust contamination. |
| Admin/support helper | Help troubleshoot accounts safely. | Account state, support logs, no raw private overexposure. | Silent data/trust edits. | Need least-privilege support. | Support seeing too much. |

## 4. Consumer Account Workflow Map

| Step | Status | Live | Tested | User-facing quality | Internal quality | Main risks |
| --- | --- | --- | --- | --- | --- | --- |
| Land on Shopping | Built | Yes | Yes | Strong for guided preview. | Good. | Root/domain stale pages historically caused confusion. |
| Browse without account | Built | Yes | Yes | Good. | Good. | Users may expect checkout. |
| See value before sign-up | Partially built | Yes | Partly | Better after Slice 13. | Good copy guardrails. | Still no saved product payoff. |
| Create account | Partially built | Yes | Source-tested | Shopping-specific copy exists. | Supabase auth foundation. | Needs real inbox/live QA. |
| Sign in | Partially built | Yes | Source-tested | Popup pattern exists. | Surface-routing guard tests. | Needs manual browser/live proof after each deployment. |
| Return to Shopping | Partially built | Yes | Source-tested | `next` paths preserve Shopping context. | Good. | Misconfigured host/surface can confuse. |
| Take priorities questionnaire | Built | Yes, auth required | Yes | Useful but still a bit dense. | RLS/user-scoped. | Older user may need help. |
| Save/follow product | Not built | No | No | Placeholder only. | No table. | Placeholder may imply feature is live. |
| Save/follow company/brand | Not built | No | No | Not exposed. | No table. | Needs privacy planning. |
| See evidence and pending score | Built | Yes | Yes | Good. | Good. | Final score expectations. |
| See values match safely | Partial/guarded | Mostly unavailable | Yes | Honest pending state. | Guardrails exist. | Pressure to show fake number. |
| Receive alerts | Not built | No | No | Watchlist placeholder only. | No alert model. | Email/consent risk. |
| Manage privacy/preferences | Partial | Priorities update only | Partial | Limited. | RLS for priorities. | No delete/export/opt-out. |
| Sign out and return later | Built | Yes | General auth tests | Basic. | Cookie clearing exists. | Needs manual live verification. |

## 5. Account/Auth Status

Consumers can create an account from Shopping through `/auth/sign-up` with Shopping surface/context. Consumers can sign in from Shopping through the shared popup. Password reset routes exist. Return-to-Shopping paths are preserved by `next` and `surface` handling.

Shopping-friendly sign-up copy exists:

- `Create your free Mishava Shopping account.`
- `Create free Shopping account`.
- Copy says users can browse Shopping without an account.
- Copy says payment never changes scores, ranking, or trust outcomes.

Remaining concerns:

- Real inbox verification is still required for sign-up confirmation and password reset.
- Manual browser QA is still needed on the live domain after deploys.
- Some auth routes are shared across all Mishava surfaces, so surface inference must keep being tested.
- Sign-up is likely understandable for a normal shopper, but account value is not yet strong until saved products exist.

Tests:

- `scripts/auth-surface-routing.test.mjs`.
- `scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs`.
- Shopping Slice 12/13 tests in `scripts/release-4-shopping.test.mjs`.

## 6. Shopping Priorities Status

The questionnaire exists at `/app/shopping-priorities` and requires authentication. It captures 12 starter priority answers and 5 automatic-zero/red-line modes. The form requires privacy acknowledgement and stores consent fields.

Question areas include values around environmental, labor, governance, community, local, and red-line preferences as defined in `src/lib/shopping.ts`.

Status:

- Required starter questions: 12.
- Personalization enabled only when at least 12 answers are provided.
- Wording is clearer than before but still moderately dense.
- Mobile likely usable, but should be manually rechecked.
- Priorities explicitly do not create final scores or medical suitability claims.
- Stored in `shopping_priority_profiles` with `user_id`, JSON answers, automatic-zero rules, version code, consent version, consent timestamp, privacy acknowledgement, and last reviewed date.
- Used today mainly to gate future personal match; not yet generating real values-match output.

Missing before priorities feel valuable:

- Saved products.
- Product comparison using priorities.
- Values Match preview only after reviewed evidence exists.
- Simpler first-user completion flow.
- Privacy management beyond acknowledgement/update.

## 7. Saved Products / Watchlist

Saved products are not implemented today. `/app/saved` exists as a placeholder page. There is no saved-products table found in migrations, no save/unsave product action, and no product-detail save button.

Current answers:

- Save product: no.
- Unsave product: no.
- View saved products: placeholder only.
- Saved score-pending products: not yet.
- Evidence-change linkage: not yet.
- Alert linkage: not yet.
- Data model: missing.
- UI: placeholder route only.

Build first:

- `consumer_saved_products` or similarly named table with `user_id`, `product_id`, `saved_at`, optional note, alert opt-in, and RLS.
- Save/unsave button on product detail.
- `/app/saved` list using public product records plus private save rows.
- Tests proving saving does not affect rank/score/visibility.

Defer:

- Folders/lists.
- Household sharing.
- Alerts.
- Paid limits.

## 8. Product/Company Following

Following is not implemented.

Current answers:

- Follow product: no.
- Follow brand/company: no.
- Follow category: no.
- Trigger alerts: no.
- Manage followed items: no.
- Unfollow: no.
- Data model: missing.

Build first after saved products:

- Product follow can be represented as saved product plus alert preference.
- Company/brand follow should wait until company/supplier/business profiles are better defined.
- Category follow should wait until category taxonomy and alert types are stable.

## 9. Alerts/Notifications

Alerts are not built. `/app/watchlist` says watchlists will notify users, but there is no alert/notification table, no email preferences table, no in-app notification UI, and no event processing.

First alert types to plan:

- Saved product evidence updated.
- Saved product score status changed.
- Product source reviewed.
- Product added after research request.
- Followed company has new reviewed evidence or issue.

Should not trigger yet:

- Medical/care suitability alerts.
- Paid/promotional alerts.
- Unreviewed AI suggestion alerts.
- Unsupported final-score alerts.

Needed:

- Explicit email opt-in.
- Unsubscribe/opt-out.
- Notification preferences.
- Real email provider/Auth verification.
- Support path for notification issues.

## 10. Personal Values Match

Values Match does not produce a real final number today. The code has eligibility states and labels such as personal match pending/unavailable, but final values match is withheld unless user priorities and reviewed evidence support it.

Safe first label:

- `Personal match is not ready yet`
- `Your Values Match Preview unavailable`
- `Not enough reviewed evidence`

Unsafe labels:

- Final Your Values Score.
- Best for you.
- Medical-safe match.
- Guaranteed non-irritating.

Recommended first approach: keep values match non-numeric or pending until reviewed evidence and a methodology version exist. Missing evidence should be shown as a reason the match is incomplete.

Required rule: **Personal values match is not a final Mishava Score.**

## 11. Family/Household Needs

Household profiles are planned only. They may be valuable later for parents and families, especially for different preference sets.

Potential future support:

- Separate saved preference sets.
- Parent/household labels.
- Care-sensitive preference set.
- Budget/price preference set.

Avoid:

- Medical suitability claims.
- "Safe for Crohn's."
- "Best for medical condition."
- Sharing family preferences publicly by default.

Defer until saved products and individual privacy controls work.

## 12. Privacy Controls

Consumer data currently stored:

- Supabase auth user/account.
- Shopping Priority profile.
- Priority answers and automatic-zero rules.
- Consent/privacy acknowledgement fields.

Not yet stored:

- Saved products.
- Follows.
- Alerts.
- Email notification preferences.
- Household profiles.
- Paid Plus subscription data for consumers.

Privacy status:

- Priorities are private through RLS: users can read/create/update their own priority profile.
- Priorities can be changed by re-saving the form.
- There is no consumer privacy dashboard.
- There is no user-facing delete/export workflow.
- There is no email opt-out because alerts are not built.
- Legal/privacy pages exist generally, but consumer-specific saved/follow/alert disclosures need more detail before public beta.

Before public launch:

- Delete saved items.
- Delete/update priorities.
- Export or explain consumer data.
- Notification opt-out.
- Support privacy request workflow.
- RLS tests for each new consumer table.

## 13. Paid Plus Concept

Planned Plus concepts:

- Consumer saved products.
- Saved values/priorities.
- Alerts/following.
- Comparisons.
- Family/household needs.
- Privacy controls.
- Possibly higher convenience/capacity features later.

Plus features existing today: none as a paid product. `/app/billing` exists, but consumer Plus billing is not launched.

Free should include:

- Public product browsing.
- Evidence/gap viewing.
- Score-pending context.
- Basic Shopping account.
- Basic Shopping Priorities.

Paid later may include:

- More saved lists.
- More comparison tools.
- More alert capacity.
- Household preference sets.
- Convenience tooling.

Must remain free or independent:

- Product evidence.
- Base ranking fairness.
- Score methodology.
- Corrections.
- Trust labels.
- Verification.
- Evidence truth.

Do not sell:

- Better product ranking.
- Better scores.
- Credibility labels.
- Verification.
- Evidence suppression.
- Medical claims.

Paid Plus should wait until after Shopping beta basics are stable.

## 14. Payment Firewall

Stripe/payment is not built for Plus. NGO Stripe foundations exist separately, and `/app/billing` is a signed-in placeholder route. Payment/entitlement fields are represented in scoring firewall tests as forbidden ranking inputs.

Could payment affect visibility/ranking/scoring/trust labels today? Current tests say it must not, and no Plus payment workflow exists.

Affiliate/commission fields:

- Guarded against in tests.
- Places-to-buy sorting excludes commission, affiliate, sponsorship, and paid placement.

Before paid Plus:

- Extend payment firewall tests to every consumer entitlement.
- Define paid/free boundaries.
- Make clear paid Plus unlocks tools, not trust.
- Keep paid fields out of ranking/scoring functions.

## 15. Medical/Care-Sensitive Guardrails

Current status is conservative:

- Product pages say Mishava does not make medical suitability claims.
- Shopping Priorities say they do not create medical suitability claims.
- Toilet paper sensitive-use language is limited to source-supported claims and missing evidence.

Avoided:

- Best for Crohn's.
- Safe for Crohn's.
- Medically recommended.
- Guaranteed safe.
- Non-irritating as an unsupported claim.

Before care-sensitive preference features:

- Add a care-sensitive language test.
- Add copy that says product suitability for medical conditions requires medical advice.
- Only show fragrance/free-from/comfort claims if source-supported.
- Keep sensitive preferences private.

## 16. Consumer Relationship to Shopping

Plus/Consumer supports Shopping by letting users save preferences, later save products, and eventually receive alerts or compare products.

Should stay signed-out:

- Shopping landing.
- Product categories.
- Product detail evidence/gap views.
- Not-store/no-paid-ranking explanation.

Should require sign-in:

- Saved priorities.
- Saved products.
- Follows.
- Alerts.
- Household preference sets.
- Any private notes.

First consumer feature after priorities: **saved products/watchlist with privacy controls**.

Product lookup/research requests should eventually connect to accounts, but public product lookup should still work without sign-in.

Do not mix consumer accounts with NGO or Business workspaces in a way that confuses roles. One login may later access multiple surfaces, but each surface needs clear context and switching.

## 17. Consumer Relationship to NGO/Business/Gov/Corporate

One login can eventually support multiple surfaces, but consumer profile data should be separate from organization/workspace data.

Risks if confused:

- Shopper lands in NGO onboarding.
- NGO user sees Shopping as organization workspace.
- Consumer preferences leak into Business/Gov/Corporate decisions.
- Payment/access concepts cross into trust outcomes.

Centralized:

- Auth.
- Session.
- Basic account.
- Sign-in popup.

Category-specific:

- Shopping Priorities.
- NGO organization membership.
- Business claims.
- Government/corporate workflows.
- Admin access.

Avoid now:

- Complex profile switching for consumers.
- Paid Plus mixed with NGO billing.
- Consumer values affecting institutional scores.

## 18. Data Model and Migrations

| Data area | Status | Migration/file | Purpose | Risk | Tests |
| --- | --- | --- | --- | --- | --- |
| Auth users | Exists via Supabase | Supabase Auth plus auth helpers | Account/session. | Real inbox setup required. | Auth foundation/routing tests. |
| User profile table | Not found as consumer profile | N/A | Future consumer profile. | Need privacy planning. | None. |
| Shopping priorities | Exists | `202605240005`, `202605240010` | Private user priority profile. | Dense UX; no deletion/export. | Shopping tests. |
| Saved products | Missing | N/A | Save/unsave/list. | Users expect it from account value. | None. |
| Followed products/companies/categories | Missing | N/A | Future alerts and tracking. | Privacy/consent. | None. |
| Alerts/notifications | Missing | N/A | Notify users. | Email consent/ops. | None. |
| Email preferences | Missing | N/A | Opt-in/out alerts. | Compliance/privacy. | None. |
| Privacy/deletion fields | Partial | Priority consent fields only | Acknowledgement/update. | No delete/export UI. | Partial. |
| Payment/entitlement fields | Partial elsewhere | NGO billing, scoring firewall | Future paid tools. | Cross-surface confusion. | Payment firewall tests. |
| Product/research request relationship | Planned | Shopping research tasks exist for internal product review | Future user requests. | Could imply crawler. | Shopping research tests. |

## 19. Admin/Support Needs

Support can help generally through existing support/admin foundations, but consumer-specific support is not mature.

Missing:

- Consumer account support view.
- Priority troubleshooting view.
- Saved/follow/alert troubleshooting.
- Deletion/export request workflow.
- Notification opt-out support.
- Audit logs for support changes to consumer preferences.

Before public beta:

- Add least-privilege consumer support tools.
- Keep private preferences private by default.
- Log any support actions.

## 20. Public Display and Readability

Account prompts are much better after recent Shopping auth cleanup. Browsing is not gated too early. Sign-up is invited when a clear benefit exists: saving Shopping Priorities.

Still needs simplification:

- Priorities page has many concepts at once.
- Saved/watchlist placeholders can imply features exist.
- Mobile completion of 12 questions needs manual review.
- "Automatic-zero" language may be too technical for normal shoppers.

Recommended copy direction:

- "Tell Mishava what matters most to you."
- "Save this product."
- "See it later in Saved Products."
- "Mishava does not sell products."
- "This score is not ready yet."

## 21. Tests and Verification

Relevant tests/scripts:

- `scripts/auth-surface-routing.test.mjs`: sign-in popup, product-line surface routing, Shopping auth poison prevention.
- `scripts/release-4-shopping.test.mjs`: Shopping products, priorities, values score guardrails, evidence cards, no fake scores, payment/commission exclusion.
- `scripts/payment-firewall.test.mjs`: payment/affiliate/commission fields rejected as ranking inputs.
- `scripts/ai-control-foundation.test.mjs`: AI suggestion-only control and forbidden outcomes.
- `scripts/ai-provider-import-guard.test.mjs`: no direct provider imports outside approved path.
- `scripts/ngo-full-scale-slice-1a-auth-foundation.test.mjs`: shared auth foundation.

Still untested:

- Real browser sign-up/sign-in with inbox.
- Live password reset.
- Actual priority save with a real account.
- Mobile priority completion.
- Saved products/follows/alerts because they do not exist.
- Consumer data deletion/export because it does not exist.

Commands run:

- `npm test`: passed, 176/176.
- Targeted consumer/auth/shopping/payment/AI tests: passed, 49/49.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `supabase migration list --linked`: passed and aligned through `202605260009`.
- `npm run lint`: failed due local dependency resolution: `Cannot find module 'fast-glob'` from `@next/eslint-plugin-next`.

## 22. Guardrails

Confirmed:

- No paid ranking.
- No paid trust outcomes.
- No fake scores.
- No fake evidence.
- No final values match without reviewed evidence and approved methodology.
- No medical claims.
- No AI final trust outcomes.
- No affiliate/commission-driven ranking.
- Consumer preferences remain private through current priorities RLS.
- Missing evidence remains visible.
- Mishava is not the store.
- Dsuupr remains separate.
- `dsuupr-am` was not touched.
- Old Supabase was not touched.

Needs future guardrails:

- RLS for saved products/follows/alerts.
- Email consent tests.
- Paid Plus entitlement firewall tests.
- Privacy deletion/export tests.

## 23. What Is Missing

### Must Fix Before First Consumer Guided Preview

- Real inbox sign-up/sign-in/password reset proof. Risk if skipped: account flow may fail in front of user. Effort: medium; browser test + ops config.
- Actual priority save test with live account. Risk if skipped: priorities may look ready but fail in live auth. Effort: medium; browser test.

### Must Fix Before Broader Shopping Preview

- Saved products MVP. Risk: account has little obvious value. Effort: medium; code + data model + tests.
- Plain-language priority cleanup. Risk: older users may abandon. Effort: small/medium; copy + browser test.
- Report issue/correction path connected to support. Risk: users cannot flag wrong product data. Effort: medium.

### Must Fix Before Public Beta

- Privacy dashboard or clear data controls. Risk: consumer trust/privacy gap. Effort: medium/large.
- Consumer support workflow. Risk: account issues require developer help. Effort: medium.
- Mobile priorities QA. Risk: poor accessibility/usability. Effort: small/medium.
- RLS/security tests for saved/follow/alert tables. Risk: privacy leakage. Effort: medium.

### Must Fix Before Paid Plus

- Paid/free boundary document. Risk: paid trust contamination. Effort: small.
- Plus entitlement model and tests. Risk: payment fields leak into ranking/scoring. Effort: medium.
- Billing UX separate from NGO billing. Risk: cross-surface confusion. Effort: medium.

### Must Fix Before Alerts/Notifications

- Saved/follow model.
- Alert preference model.
- Email opt-in/out.
- Real email provider reliability.
- Notification event rules.

### Should Fix Soon

- Replace placeholder Saved/Watchlist copy with honest "coming next" or hide until built.
- Add consumer privacy plan.
- Add first-user account walkthrough doc.

### Nice To Have

- Multiple saved lists.
- Household profile labels.
- Comparison view.

### Later / Not Now

- Paid Plus.
- Family sharing.
- Personalized medical/care recommendations.
- AI-driven personalized shopping.

## 24. What Is Done

Account/auth foundations done:

- Shared sign-in popup.
- Shopping sign-up copy.
- Safe `next` return paths.
- Surface-aware auth routing.
- Password reset pages.

Shopping Priorities done:

- Auth-protected route.
- 12 starter questions.
- Automatic-zero settings.
- Privacy acknowledgement.
- RLS user ownership.

Account copy done:

- Shopping-specific copy exists.
- NGO-only copy removed from Shopping flows.
- Payment/no-trust influence language visible.

Privacy/RLS foundations done:

- Priority profile RLS.
- Consent/privacy fields for priorities.

Shopping integration done:

- Account prompts on Shopping pages.
- Product detail evidence cards.
- Score-pending and missing-evidence language.

Tests done:

- Auth routing.
- Priorities save constraints.
- Values score eligibility.
- Payment firewall.
- AI guardrails.

Docs done:

- Plus chat handoff.
- Shopping first-user evidence readiness result.
- Senior-friendly Shopping result.
- AI-minimize docs.

Deployment/live protections done:

- Clean Mishava V2 project/domain separation documented.
- Shopping live on clean domain.

Guardrails done:

- No fake scores.
- No medical claims.
- No paid ranking.
- No AI final outcomes.

## 25. Recommended Next Tasks

### Next 3

1. **Plan Saved Products / Watchlist and Consumer Account Privacy Flow**  
   Purpose: define first real consumer account value after priorities. Scope: saved product table, save/unsave UI, `/app/saved`, privacy and RLS. Output: plan doc. Checks: tests planned. Type: data model + code plan. Before Slice 14: yes if consumer account is priority; otherwise can run parallel. Before public beta: yes. Before paid Plus: yes.

2. **Run Consumer Auth and Priorities Live Inbox QA**  
   Purpose: verify real sign-up/sign-in/password reset and priority save. Scope: live Shopping domain only. Output: result doc/screenshots. Checks: browser + inbox. Type: browser test + ops. Before Slice 14: recommended. Before public beta: required. Before paid Plus: required.

3. **Plan Consumer Privacy Controls**  
   Purpose: define delete/update/export/opt-out for priorities and future saved items. Scope: consumer data only. Output: plan doc. Checks: RLS/privacy tests planned. Type: data model + policy plan. Before public beta: yes. Before paid Plus: yes.

### Next 7

4. Implement Saved Products MVP.
5. Add saved products tests and RLS policies.
6. Simplify Shopping Priorities wording for older users.
7. Plan product/company following after saved products.

### Next 14

8. Plan alert preference model.
9. Plan real email notification opt-in/out.
10. Add support workflow for consumer account issues.
11. Add product issue/research request connection to accounts.
12. Plan family/household preference sets.
13. Draft paid/free Plus boundary policy.
14. Add Plus payment firewall tests before any billing implementation.

## 26. New Chat Setup

Use the companion file:

- `docs/chat-handoffs/mishava-plus-consumer-new-chat-brief.md`

The new chat should focus on saved products/watchlist and consumer privacy, not paid Plus.

## 27. Suggested First Codex Prompt

```text
Plan Saved Products / Watchlist and Consumer Account Privacy Flow.

Use:
- docs/chat-handoffs/mishava-plus-consumer-deep-current-state-audit.md
- docs/chat-handoffs/mishava-plus-consumer-new-chat-brief.md
- docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md
- docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md
- docs/mishava-v2-current-state-category-review.md

Do not implement yet.

Goal:
Plan the first real Mishava Plus / Consumer account value after Shopping Priorities: saved products/watchlist with privacy controls.

Scope:
- save product
- unsave product
- view saved products
- allow score-pending products to be saved
- keep saved products private
- define RLS policies
- show evidence/score status changes safely
- prepare for future alerts without implementing alerts
- ensure payment/Plus cannot affect ranking, scores, evidence, or trust labels

Do not build paid Plus, checkout, alerts, family profiles, medical claims, AI personalization, final Values Match, affiliate logic, or scoring changes.

Output:
- implementation plan
- data model proposal
- UI flow
- privacy/RLS rules
- tests
- non-goals
- acceptance criteria
```

