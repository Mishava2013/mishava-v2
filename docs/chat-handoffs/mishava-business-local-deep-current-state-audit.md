# Mishava Business / Local / Supplier / Seller Deep Current-State Audit

Date: June 23, 2026

## 1. Executive Summary

Mishava Business / Local / Supplier / Seller is still an early foundation, not a pilot-ready product surface. The current repo has reserved public routes, clear no-paid-trust guardrails, Shopping seller/place-to-buy data, supplier/manufacturer transparency fields, AI-control guardrails, and strong payment firewall tests. Those pieces are useful, but they do not yet amount to a usable Business/Local product.

The strongest current asset is that Shopping now models product, retailer/place-to-buy, seller type, manufacturer, supplier, confidence, source URLs, evidence gaps, and research status without letting payment influence trust outcomes. That can become the backbone for Business/Local work. The missing pieces are the actual business/supplier/seller profile model, ownership claim flow, identity/verification workflow, evidence submission path, admin review queue, and public profile experience.

Current recommendation: treat Business/Local as **internal planning and architecture ready**, not user pilot ready. The next focused chat should plan the minimum Business/Supplier/Seller profile and claim flow before any code work.

## 2. Percent Estimates

| Area | Estimate | Reason |
| --- | ---: | --- |
| Overall Business / Local readiness | 17-22% | Reserved surfaces and core trust guardrails exist, but no real profile/claim workflow exists yet. |
| Business profile readiness | 12-18% | Placeholder profile route exists; no implemented business profile table or owner workflow. |
| Supplier profile readiness | 18-25% | Supplier/manufacturer transparency exists through Shopping products, but there is no standalone supplier profile. |
| Seller profile readiness | 14-20% | Places-to-buy seller fields exist; no seller account/profile/claim workflow. |
| Local business readiness | 10-16% | Local page and seller type concepts exist; no local location/profile/onboarding system. |
| Claim / ownership flow readiness | 8-14% | Planned in docs only; no claim request, proof, approval, or rejection process. |
| Business evidence submission readiness | 20-30% | Evidence and structured-claim concepts exist elsewhere; no Business-specific submission/review workflow. |
| Identity / verification readiness | 12-18% | Confidence labels and source review patterns exist; no business identity verification process. |
| Supplier-to-seller connection readiness | 8-14% | Product places-to-buy links products to sellers, but not supplier/seller relationships. |
| Hosted profile readiness | 12-18% | Placeholder profile route exists; no hosted business profile management. |
| External website link readiness | 25-35% | URL/source patterns exist in Shopping; not yet tied to claimed business profiles. |
| Payment firewall readiness | 85-92% | Strong scoring/payment guardrail code and tests exist. |
| AI guardrail readiness | 80-88% | Central AI control foundation exists; provider calls are not enabled. |
| Admin/review operations readiness | 18-25% | Admin/support foundations exist; no Business/Local review queues. |
| Public pilot readiness | 5-10% | Not ready for businesses, suppliers, sellers, or local merchants to self-serve. |

## 3. Intended User Groups

| User group | Intended use | Current support |
| --- | --- | --- |
| Small business owner | Claim a profile, explain business identity, submit evidence, manage catalog/profile. | Planned only. |
| Local store / seller | Show local availability, pickup/delivery context, place-to-buy details. | Product place-to-buy fields exist; no local seller profile. |
| Supplier / manufacturer | Provide verified source, manufacturing, supplier, sourcing, and product evidence. | Supplier fields exist on Shopping products; no supplier profile. |
| Brand / parent company | Connect products and claims to company-level evidence. | Partially modeled through Shopping fields; no profile/workflow. |
| Mishava reviewer | Review ownership, source evidence, supplier confidence, corrections, and disputes. | Review concepts exist; no dedicated queue. |
| Consumer / buyer | Understand who sells/makes a product and what evidence is missing. | Supported in Shopping POC, not Business/Local profiles. |
| Government / corporate buyer | Future vendor/product evidence review. | Planned only. |

## 4. Workflow Map

Expected future workflow:

1. Business, seller, or supplier finds or creates a Mishava profile.
2. User creates a Mishava account.
3. User claims a profile or requests a new profile.
4. Mishava collects ownership/identity evidence.
5. Reviewer checks identity, website/domain, registration, product/source relationship, and evidence quality.
6. Profile becomes claim-approved, claim-rejected, or needs-more-evidence.
7. Business may submit product/source evidence and catalog links.
8. Mishava reviewers approve, reject, or mark gaps.
9. Public profile displays only reviewed facts, clear gaps, and no paid trust outcomes.
10. Shopping can use reviewed business/supplier/seller relationships as context, without payment affecting ranking or score.

Current implemented workflow:

- Public Business route exists as a reserved coming-soon surface.
- Public Local route exists as an aspirational preview surface.
- Business profile route exists as a placeholder.
- Shopping products can contain seller, supplier, manufacturer, confidence, and evidence gap fields.
- No self-serve business claim workflow exists yet.

## 5. Supplier Profile Readiness

Current supplier work is strongest inside Shopping product transparency. Product records can distinguish manufacturer, supplier, supplier role, supplier region, source URLs, confidence labels, reviewed date, reviewer, and evidence gap notes.

What is missing:

- Standalone supplier profile model.
- Supplier claim/ownership flow.
- Supplier evidence upload/submission flow.
- Supplier public profile page.
- Supplier correction/dispute process.
- Supplier-to-product relationship admin UI.
- Supplier-to-seller relationship model.

Readiness: **not pilot ready**, but data concepts are well seeded.

## 6. Seller Profile Readiness

Shopping `places_to_buy` records support seller name, seller type, URL, price, availability, fulfillment, local pickup/delivery, and last checked date. Seller types include external retailer, brand direct, local store, and Mishava hosted.

What is missing:

- Seller profile table.
- Claimed seller account flow.
- Seller location, service area, pickup/delivery policy, and inventory proof.
- Seller review/approval workflow.
- Seller correction process.
- Public seller profile pages.

Readiness: **early foundation only**.

## 7. Local Business Readiness

The Local page frames a future experience around radius, availability, evidence, and local buying. It is not a real local discovery product yet.

Current risk: the Local page uses more future-facing language than the implemented product supports. It should remain clearly framed as future/preview until local profiles, locations, inventory, and seller proof exist.

Missing:

- Location model.
- Local business profile and claim flow.
- Local availability proof.
- Store hours/contact fields.
- Pickup/delivery relationship to products.
- Local search/radius logic.
- Review and correction workflow.

Readiness: **not pilot ready**.

## 8. Business Claim and Evidence Flow

No Business-specific claim/evidence flow is implemented. Existing evidence patterns from NGO and Shopping can inform it, but should not be treated as a completed Business flow.

Needed states:

- unclaimed
- claim_requested
- identity_review_needed
- evidence_needed
- approved
- rejected
- suspended
- correction_requested

Needed evidence types:

- domain/website ownership
- business registration or public directory evidence
- role/authorization proof
- product catalog ownership
- brand/manufacturer/supplier relationship proof
- physical location proof, if local
- correction/dispute documentation

## 9. Identity and Verification Readiness

Current confidence fields can label manufacturer/supplier evidence as verified, likely, unverified, or unknown. That is useful but narrower than business identity verification.

Missing:

- Claimant identity rules.
- Website/domain verification.
- Business registration review.
- Role/authority review.
- Conflict handling when multiple people claim the same profile.
- Suspension/revocation process.
- Audit trail of approval decisions.

Rule to preserve: verified claims require source URLs and human review.

## 10. Small Business Fairness

The payment firewall is one of the strongest parts of the foundation. Current scoring guardrails reject payment, subscription, sponsorship, commission, affiliate, ad spend, and sales commission fields as trust/ranking inputs.

Business/Local must preserve:

- No paid ranking.
- No paid verification.
- No paid credibility labels.
- No paid evidence truth.
- No paid supplier/seller approval.
- Hosted profile payment can unlock tools/capacity only.
- Small businesses must not be penalized for not paying, except for explicitly labeled tool capacity limits.

## 11. Hosted Profile vs External Website

Planned distinction:

- Hosted profile: Mishava-hosted public page for a business/supplier/seller.
- External website: Business-owned site linked as a source or contact point.

Current support:

- Business profile route placeholder exists.
- Shopping source URLs and seller URLs exist.
- `mishava_hosted` seller type exists in Shopping code.

Missing:

- Hosted profile product.
- Profile publishing workflow.
- Hosted profile edit permissions.
- External website verification.
- Clear public labels distinguishing Mishava-hosted profile from company-owned site.

## 12. Supplier-to-Seller Connections

Current Shopping product places-to-buy connect products to sellers/retailers, but there is no formal supplier-to-seller relationship model.

Future model should support:

- supplier
- manufacturer
- brand owner
- seller/retailer
- relationship type
- region
- source URL
- confidence
- active/stale status
- reviewed date
- evidence gaps

No supplier/seller connection should be treated as verified without source review.

## 13. Payment Firewall

Payment firewall status: **strong foundation**.

Reviewed coverage:

- `src/lib/scoring.ts` blocks payment-related fields from trust inputs.
- `scripts/payment-firewall.test.mjs` checks forbidden payment/commission/affiliate fields.
- Shopping tests verify places-to-buy sorting is not commission or affiliate driven.
- Coming-soon surfaces state payment cannot buy trust outcomes.

Business/Local must extend tests before adding paid profile tools, hosted profile tiers, catalog capacity, or business subscriptions.

## 14. AI-Assisted Document Parsing

AI is controlled by the AI-minimize foundation. Provider calls are disabled. Future supplier/business document parsing must go through `src/lib/ai-control.ts`.

Allowed future role:

- Suggest source summaries.
- Suggest claims.
- Suggest evidence gaps.
- Suggest category-specific questions.

Forbidden role:

- Final score.
- Ranking.
- Verification.
- Supplier approval.
- Seller approval.
- Profile publishing.
- NGO escalation.
- Legal/compliance conclusion.
- Payment/access decision.

Current readiness: guardrails exist, but no Business/Local AI workflow should be enabled yet.

## 15. Relationship to Shopping

Shopping is the best current testbed for Business/Local concepts. It already has:

- products
- places to buy
- seller names and seller types
- manufacturer/supplier transparency
- confidence labels
- evidence gaps
- no final score unless supported
- no paid ranking/no commission guardrails

Business/Local should not duplicate this loosely. It should formalize the profile and claim layer that Shopping can later reference.

## 16. Relationship to Government and Corporate

Government and Corporate surfaces will eventually need trusted vendor/product evidence, audit trails, exportable review history, and procurement support. Business/Local should become the source of claimed company/vendor/supplier information that Government and Corporate can consume later.

Do not make government, procurement, compliance, or institutional readiness claims yet.

## 17. Data Model and Migrations

Implemented or partially implemented:

- `organizations` with business/supplier/seller/local-business organization types.
- role concepts including business owner/member.
- `shopping_products`.
- `shopping_places_to_buy`.
- supplier/manufacturer fields on Shopping products.
- research task/status concepts for Shopping.
- evidence/structured claim foundations used elsewhere.

Not found as implemented standalone tables:

- `business_profiles`.
- `supplier_profiles`.
- `seller_profiles`.
- `local_business_profiles`.
- `business_claim_requests`.
- `business_evidence_submissions`.
- `business_profile_reviews`.
- `supplier_seller_relationships`.
- `hosted_profile_pages`.

Migration recommendation: do not add broad tables casually. First plan the minimum profile/claim flow and states.

## 18. Admin and Review Needs

Business/Local needs a lightweight review system before pilot:

- claim requests
- identity evidence
- source evidence
- supplier/manufacturer proof
- local location proof
- correction/dispute queue
- approval/rejection reasons
- reviewer identity
- audit logs
- stale evidence reminders

Critical guardrail: no silent trust manipulation. Reviewer actions must be auditable.

## 19. Public Display and Readability

Business page is conservative and safe. Local page is visually/publicly present but more aspirational. Product and profile pages should use plain labels:

- What Mishava knows.
- What Mishava still needs.
- Who sells this.
- Who makes this, if known.
- Supplier not verified.
- Source reviewed / source missing.
- Score not ready yet.
- Payment does not affect this.

Avoid technical-first labels such as raw research task state, confidence taxonomy, or verification jargon before the user understands the page.

## 20. Legal, Compliance, and Security Risks

Risks:

- Implying verification before review.
- Collapsing retailer, brand owner, manufacturer, and supplier into one field.
- Letting paid hosted profiles look more trustworthy.
- Publishing unreviewed evidence as fact.
- Overstating local availability or product inventory.
- Accepting fake business claims.
- Treating AI suggestions as verified facts.
- Creating defamation risk through unsupported supplier/environmental claims.
- Creating compliance overclaims for Government/Corporate surfaces.

Mitigation:

- Human review.
- Clear confidence labels.
- Evidence gap display.
- Source URLs and dates.
- Audit logs.
- Correction/dispute path.
- Payment firewall tests.

## 21. Tests and Verification Run

Commands run during this audit:

- `npm test`: passed, 176/176.
- `node --test scripts/release-4-shopping.test.mjs scripts/payment-firewall.test.mjs scripts/ai-control-foundation.test.mjs scripts/ai-provider-import-guard.test.mjs scripts/subdomain-routing.test.mjs`: passed, 48/48.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `supabase migration list --linked`: passed and aligned through `202605260009`.
- `npm run lint`: failed due local dependency resolution: `Cannot find module 'fast-glob'` from `@next/eslint-plugin-next`.

The lint failure appears tooling/dependency-related, not caused by Business/Local product code. It should be cleaned up before major implementation work.

## 22. Guardrails to Preserve

- No fake scores.
- No fake evidence.
- No fake suppliers.
- No fake sellers.
- No fake manufacturers.
- No fake local inventory.
- No paid ranking.
- No paid verification.
- No paid credibility labels.
- No affiliate or commission ranking.
- No AI final trust outcomes.
- No supplier/seller approval by AI.
- Missing evidence remains visible.
- Payment cannot affect trust outcomes.

## 23. Missing Items

Top missing items:

1. Business/supplier/seller/local profile data model.
2. Claim and ownership workflow.
3. Identity/domain/location verification process.
4. Business evidence submission and review queue.
5. Supplier-to-seller relationship model.
6. Hosted profile publishing workflow.
7. Public profile display pages backed by real data.
8. Admin review tools and audit logs.
9. Correction/dispute process.
10. Pilot-safe copy and onboarding for small business users.

## 24. Done List

Most valuable completed foundations:

1. Reserved Business and Local public routes.
2. Business profile placeholder route.
3. Subdomain routing tests for Business/Local reserved surfaces.
4. Shopping seller/place-to-buy model.
5. Shopping supplier/manufacturer transparency fields.
6. Confidence and evidence gap patterns.
7. No-paid-ranking/no-commission Shopping tests.
8. Payment firewall scoring tests.
9. AI control foundation and provider import guard.
10. Current docs clearly identify Business/Local as planned, not launched.

## 25. Recommended Next Tasks

1. Plan Minimum Business/Supplier/Seller Profile and Claim Flow.
2. Implement minimal profile and claim request data model.
3. Add public profile display for reviewed/placeholder-safe facts.
4. Add internal review queue for claim/evidence review.
5. Connect Shopping product supplier/seller data to profile references.
6. Add correction/dispute path.
7. Add small-business fairness/payment firewall tests for paid profile tools.
8. Run Business/Local pilot readiness audit.

## 26. New Chat Setup

Recommended new focused chat:

**Mishava Business / Local Minimum Profile and Claim Flow**

The chat should start from the two Business/Local handoff docs and should not implement broad marketplace, checkout, local inventory, or scoring work. It should define the smallest safe data model and flow for a business, supplier, seller, or local store to claim a profile without creating trust or payment conflicts.

## 27. First Codex Prompt

```text
Plan Mishava Business / Local Minimum Profile and Claim Flow.

Use:
- docs/chat-handoffs/mishava-business-local-deep-current-state-audit.md
- docs/chat-handoffs/mishava-business-local-new-chat-brief.md
- docs/mishava-v2-full-build-roadmap-reset.md
- docs/chat-handoffs/mishava-shopping-deep-current-state-audit.md
- docs/chat-handoffs/mishava-scoring-trust-deep-current-state-audit.md

Do not implement yet.

Goal:
Plan the smallest safe Business/Local/Supplier/Seller profile and claim flow that can support future pilot work without allowing payment, AI, or unreviewed claims to affect trust outcomes.

Scope:
- business profile
- supplier profile
- seller profile
- local business profile
- claim request states
- identity/source evidence requirements
- review workflow
- public display rules
- payment firewall guardrails
- admin/review needs
- tests

Do not build checkout, paid ranking, affiliate logic, local inventory, AI approval, final scores, Government/Corporate surfaces, or broad marketplace features.

Output:
- implementation plan
- data model proposal
- user flow
- admin review flow
- public profile rules
- guardrails
- tests
- non-goals
- acceptance criteria
```

