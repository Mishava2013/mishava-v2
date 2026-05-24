# Mishava V2.0 Milestone 1 Build Backlog

## 1. Purpose

This document translates the Mishava V2.0 planning baseline into an actionable Milestone 1 build backlog.

Milestone 1 is not a quick prototype. It is the first production-ready MVP path for Mishava V2.0.

Primary goal:

> Launch a production-ready foundation where NGO trust profiles and early Shopping can come online together, with evidence scoring architecture, user priorities, and no-paid-ranking guardrails built correctly from day one.

## 2. Milestone Name

```txt
Mishava V2.0 Foundation MVP
```

## 3. Milestone Principles

- NGO is an early trust surface because it helps create credibility for Shopping.
- Shopping should come online close behind NGO so both reinforce each other.
- Build production-ready from day one.
- Use real products, real stores, real evidence, and real scores only.
- No fake/demo product data.
- No fake/demo evidence scenarios.
- No invented seed scores.
- No paid ranking.
- No commission-based shopping.
- AI must be evidence-bound and logged.
- Final scoring math can remain draft, but all scoring structures must be correct.

## 4. In Scope

Milestone 1 includes:

- Public home
- NGO portal/profile foundation
- Shopping proof of concept
- Shopping Priorities
- Business/local profile foundation
- Evidence/score foundation
- Consumer Plus/Deep Review foundation
- Admin pricing/config foundation
- Auth/organization/roles foundation
- Design system and logo refresh
- Stripe test-mode foundation
- AI job foundation for limited workflows

## 5. Out Of Scope

Do not build full versions of:

- Mishava Gov
- Corporate dashboard
- Full supplier/seller network
- Full audit case management
- Full field audit workflow
- Full media/research access
- Full AI evidence automation
- Full public web crawler
- Full local delivery matching
- Full enterprise data/API
- Full scoring governance UI
- Live production billing

These should be architecturally anticipated, not fully implemented.

## 6. Route Scope

Public routes:

```txt
/
/shopping
/shopping/products/[slug]
/shopping/categories/[slug]
/ngo
/ngo/profiles/[slug]
/business
/business/profiles/[slug]
/local
/about
/about/founder
/methodology
/pricing
```

App routes:

```txt
/app
/app/shopping-priorities
/app/saved
/app/watchlist
/app/billing
```

Organization routes:

```txt
/org
/org/profile
/org/evidence
/org/reports
/org/team
/org/billing
```

Admin routes:

```txt
/admin
/admin/pricing
/admin/categories
/admin/scoring
/admin/users
```

## 7. Workstream A: Foundation

### A1. Create Production App Scaffold

Build a production-ready modular monolith app foundation.

Acceptance criteria:

- App runs locally.
- TypeScript or equivalent strong typing is configured if using a TypeScript stack.
- Routing structure supports public, app, org, and admin areas.
- Environment variable pattern is documented.
- Build/lint/test commands exist.

Dependencies:

- Technical stack decision at implementation time.

### A2. Add Design Tokens And Theme

Implement Mishava V2.0 design tokens.

Acceptance criteria:

- Colors are available as reusable tokens.
- Typography scale is defined.
- Border radius, border colors, focus ring, and status colors are defined.
- UI uses Paper/White/Soft Mist balance and avoids one-note green.

Required colors:

- Mishava Ink: `#17201C`
- Trust Green: `#2F6F4E`
- Evidence Teal: `#2D7C83`
- Civic Blue: `#2F5F8F`
- Warm Gold: `#C99535`
- Soft Coral: `#D96B5F`
- Paper: `#F7F5EF`
- Soft Mist: `#EEF3F1`

### A3. Recolor And Export Logo Assets

Convert the current logo into Mishava V2.0 assets.

Acceptance criteria:

- Master SVG exists if feasible.
- Primary two-tone logo exists.
- One-color Ink version exists.
- Inverse white version exists.
- Symbol-only version exists.
- Wordmark + symbol version exists.
- Favicon/app icon exists.
- PNG exports exist for common web sizes.

Source logo:

```txt
/Users/caitlinferguson/Library/Mobile Documents/com~apple~CloudDocs/Move to iCloud 2026.3.25/Mishava/Docs for Build/MishavaLogo.png
```

### A4. Build Public Layout And Navigation

Build the base public shell.

Acceptance criteria:

- Header navigation includes Shopping, Business, Trade / Network, NGO, Audit / Verification, About.
- Mobile navigation works.
- Active route state is visible.
- No marketplace/ad platform visual language.

### A5. Set Up Database Foundation

Create initial schema/migrations for source-of-truth objects.

Acceptance criteria:

- Database is Postgres/Supabase Postgres or equivalent approved direction.
- Core tables exist for organizations, memberships, products, categories, claims, evidence, scoring snapshots, reports, pricing, entitlements, audit logs, and AI jobs.
- Migrations are reproducible.

Initial table concepts:

- users
- organizations
- organization_memberships
- roles
- permissions
- organization_roles
- profiles
- business_profiles
- ngo_profiles
- products
- categories
- claims
- evidence_items
- evidence_sources
- structured_facts
- sdg_scores
- pillar_scores
- score_snapshots
- shopping_priorities
- red_line_rules
- reports
- report_shares
- pricing_records
- entitlements
- subscriptions
- audit_log_events
- ai_jobs
- review_decisions

### A6. Configure Auth, MFA, SSO-Ready Setup

Implement production-ready identity foundation.

Acceptance criteria:

- Auth provider is selected at build time, defaulting to Clerk + Supabase/Postgres unless better fit emerges.
- MFA is supported.
- SSO is technically supported at launch.
- Users can belong to organizations.
- Organization invites include role selection.
- Custom org roles are supported or structurally prepared.

### A7. Set Up Role, Permission, And Audit Log Foundation

Build access control and audit trail foundation.

Acceptance criteria:

- Role/permission checks exist for app/org/admin areas.
- Raw evidence access is off by default.
- Sensitive actions write audit log events.
- Pricing/billing roles cannot change trust outcomes.
- System/admin access does not imply silent scoring power.

### A8. Set Up Secure File Storage Foundation

Prepare storage for evidence and logos/assets.

Acceptance criteria:

- File storage supports private files.
- Signed URL pattern exists.
- Files can store visibility, sensitivity, and redaction metadata.
- Upload/download events can be logged.

## 8. Workstream B: NGO

### B1. Build NGO Landing Page

Create the public NGO entry point.

Acceptance criteria:

- Explains NGO profiles, evidence, reporting, and funder sharing.
- Shows free and paid NGO plan positioning.
- Uses Mishava visual system.

### B2. Build NGO Profile Page

Create public NGO profile display.

Acceptance criteria:

- Shows NGO identity, mission, evidence summary, verification status, and reports where visible.
- Distinguishes facts from NGO statements.
- Does not publish NGO findings without NGO approval.

### B3. Build NGO Onboarding / Start Flow

Allow NGOs to begin profile setup.

Acceptance criteria:

- NGO can create or start a profile.
- Basic organization details can be entered.
- Evidence submission terms are acknowledged before uploads.
- Manual data entry is supported.

### B4. Build NGO Evidence Upload / Manual Entry

Support early evidence intake.

Acceptance criteria:

- Users can manually enter evidence summaries.
- Users can upload limited files/photos according to plan.
- Evidence records include source type, visibility, status, and notes.
- AI assistance is limited according to plan/entitlement.

### B5. Build Basic NGO Report Template Foundation

Create basic reporting foundation.

Acceptance criteria:

- Includes premade report template foundation.
- Supports custom report title/sections.
- Supports private/internal and shareable report states.
- Trust claims must link to evidence or approved NGO-submitted findings.

### B6. Build NGO Scoped Sharing Foundation

Allow controlled sharing with funders/donors.

Acceptance criteria:

- NGO can share selected report/data view without granting full workspace access.
- Shared access can be time-limited or revoked.
- Views/exports are logged.

### B7. Build NGO Pricing Display

Show NGO plan options.

Acceptance criteria:

- Free, Grassroots, Growth, Trust Pro, and custom network concepts are visible.
- Pricing display does not imply ranking or trust advantage.

## 9. Workstream C: Shopping

### C1. Build Shopping Search Page

Create early Shopping experience.

Acceptance criteria:

- Product search page exists.
- Results are card-based and familiar like shopping/search.
- No sponsored/boosted/featured paid language.
- Sort includes Best Search Match, Evidence Score, price, distance/local, availability, newest.

### C2. Build Product Cards

Display product summaries.

Acceptance criteria:

- Product image, name, seller/provider, price if available, availability, destination, and score badge are shown.
- Score badge is Evidence Score or Your Values Score depending on user state.
- Card works on mobile.

### C3. Build Product Detail Page

Create product detail view.

Acceptance criteria:

- Shows product identity, brand/business, product evidence context, places to buy, and score detail access.
- Places-to-buy supports national and local sellers.
- No checkout.

### C4. Build Places-To-Buy Section

Show purchase destinations.

Acceptance criteria:

- Includes seller/store, price if available, availability state, shipping/pickup/delivery status, and destination link.
- Local stores can show pickup/same-day/next-day/local delivery states when real data exists.
- Uses cautious labels for inferred availability.

### C5. Build Score Pop-Up

Display score details on click.

Acceptance criteria:

- Shows Evidence Score.
- Shows Your Values Score if Shopping Priorities are completed.
- Includes coverage, recency, verification, confidence, why, checked, missing, and payment firewall note.

### C6. Seed Real Product Data

Add first real POC product dataset.

Acceptance criteria:

- 25-50 real diapers/baby wipes products.
- 8-12 real brands.
- Real sellers/stores only.
- No fake products.
- No fake stores.
- No fake evidence.
- No invented scores.
- Scores are withheld or generated only from real evidence through approved draft scoring.

### C7. Add Product Data Confidence/Freshness

Show source and freshness context.

Acceptance criteria:

- Product data includes source and timestamp where available.
- Availability can show confirmed/reported/likely/unknown states.
- Users can report incorrect product/availability data.

## 10. Workstream D: Shopping Priorities

### D1. Build 25-Question Shopping Priorities Form

Create user preference flow.

Acceptance criteria:

- Includes 20 preference questions and 5 red-line rules.
- Preference questions use 1-5 priority scale.
- Red-line choices are Off / Warn me / Hide.
- No free-text red-line field.

### D2. Support 12-Question Minimum

Allow early personalization.

Acceptance criteria:

- User can receive initial Your Values Score after 12 answered questions.
- UI indicates profile can be improved by answering more.

### D3. Save And Retake Priorities

Allow updates over time.

Acceptance criteria:

- User can save priorities.
- User can retake/update priorities.
- Priorities affect Your Values Score only, not Evidence Score.

### D4. Implement Red-Line Behavior

Apply personal red-line settings.

Acceptance criteria:

- Off has no effect.
- Warn keeps result visible with warning.
- Hide removes from default results and shows hidden count/view option.
- Hidden results can be viewed separately or at bottom.

## 11. Workstream E: Evidence / Scoring

### E1. Build Evidence And Source Models

Create evidence foundation.

Acceptance criteria:

- Evidence items link to source records.
- Evidence has subject, source type, verification status, visibility, confidence, and provenance.
- Public records and private submitted evidence are distinguishable.

### E2. Build Claims And Structured Facts

Support fact extraction and claims.

Acceptance criteria:

- Claims can link to evidence.
- Structured facts can link to evidence and SDG/pillar.
- AI-created facts are candidate/draft until accepted where review is required.

### E3. Build SDG / Pillar / Snapshot Models

Create score architecture.

Acceptance criteria:

- Supports 17 SDG scores.
- Supports four pillar scores.
- Supports Overall Evidence Score.
- Supports coverage, recency, confidence.
- Supports immutable score snapshots.
- Supports draft scoring version marker.

### E4. Implement Draft Scoring Version Display

Make provisional scoring transparent.

Acceptance criteria:

- Scoring version is visible in score details/report context.
- Draft scoring version is clearly marked when final scoring math is pending.

### E5. Implement Payment Firewall Tests

Build guardrail tests.

Acceptance criteria:

- Payment does not affect ranking.
- Claimed profile does not boost ranking.
- Hosted profile does not boost ranking.
- Commission fields do not exist or are ignored.
- Evidence Score and Your Values Score stay separate.

## 12. Workstream F: Business / Local

### F1. Build Free Public Business Profile

Create profile foundation.

Acceptance criteria:

- Business profile can show name, category, location, external link, evidence summary, verification status, and product/catalog references.
- Free record does not imply active supplier/seller profile.

### F2. Build Real Claim Flow

Allow businesses to claim profiles.

Acceptance criteria:

- Claim request can be submitted.
- Basic identity/contact proof can be provided.
- Claim status is tracked.
- Claiming does not boost rank or score.

### F3. Build Local Profile Fields

Support local discovery.

Acceptance criteria:

- Business can have service area, pickup/delivery/shipping fields, local status, and address visibility controls.
- Home-based/sensitive businesses can hide exact address where appropriate.

### F4. Build Product Catalog Foundation

Prepare local/business product listings.

Acceptance criteria:

- Business can have products.
- Products can have availability, external link, local pickup/delivery fields, and evidence references.
- AI catalog creation can be structurally supported, even if limited.

## 13. Workstream G: Consumer Plus

### G1. Build Plus Pricing Display

Show consumer tiers.

Acceptance criteria:

- Free Consumer, Mishava Plus, Mishava Plus Family, and Mishava Plus Pro are visible.
- Pricing matches planning doc.
- Copy makes clear paid users buy deeper understanding/tools, not influence.

### G2. Build Deep Review Gates

Create feature-gate foundation.

Acceptance criteria:

- Deep Review content can be gated by entitlement.
- Free users can see basic evidence summary.
- Plus users can see deeper summaries/timelines where available.

### G3. Build Saved / Watchlist Foundation

Allow saved products/businesses.

Acceptance criteria:

- Users can save products/businesses.
- Watchlist model exists.
- Alert foundation exists, even if notification delivery is limited.

### G4. Add Stripe Test-Mode Foundation

Prepare payments without live billing.

Acceptance criteria:

- Stripe test mode is configured.
- Plans can map to entitlements.
- No live billing is required for Milestone 1.

## 14. Workstream H: Admin

### H1. Build Admin Dashboard

Create restricted admin entry.

Acceptance criteria:

- Admin area requires appropriate role.
- Basic dashboard links to pricing, categories, scoring, users/orgs, and audit logs.

### H2. Build Editable Pricing Config

Support pricing administration.

Acceptance criteria:

- Pricing records can be viewed/edited.
- Product surface, plan, market tier, currency, billing interval, price, active status are supported.
- Pricing config does not include ranking boost fields.

### H3. Build Category Config

Support category administration.

Acceptance criteria:

- Categories can be viewed/edited.
- Risk level, type, local relevance, and applicable SDGs can be configured.

### H4. Build Scoring Version Display

Show scoring version records.

Acceptance criteria:

- Current scoring version is visible.
- Draft/final status is visible.
- No casual live score formula editing is required in Milestone 1.

### H5. Build Audit Log Viewer Foundation

Expose audit log basics.

Acceptance criteria:

- Admin can view audit log entries by actor, entity, action, and date.
- Sensitive action logs are visible to authorized roles.

## 15. Workstream I: AI

### I1. Build AI Job Model

Create internal AI job foundation.

Acceptance criteria:

- AI jobs track owner, product surface, input evidence IDs, model/prompt version, output, status, cost estimate, confidence, and review status.

### I2. Build Limited AI Evidence Workflow

Support controlled early AI.

Acceptance criteria:

- Uploaded evidence can be queued for OCR/extraction where enabled.
- AI outputs are stored as candidate records.
- No evidence citation means no scoring fact.
- Human review can accept/reject where required.

### I3. Build Limited AI Report/Catalog Support

Support early paid/foundation AI workflows.

Acceptance criteria:

- NGO report drafting/rebuild foundation exists.
- Product catalog AI support is structurally prepared.
- Free tiers are limited.
- AI usage can be tracked by organization/surface.

## 16. Workstream J: Legal / Policy Pages

### J1. Add First-Launch Legal Page Shells

Create public/legal policy routes.

Acceptance criteria:

- Terms of Service page shell.
- Privacy Policy page shell.
- Evidence Submission Terms page shell.
- Report/Data Use License page shell.
- Correction / Dispute Policy page shell.
- No Paid Ranking / No Commission Disclosure page shell.
- AI Use Disclosure page shell.
- Redaction / Sensitive Evidence Policy page shell.
- Community / User Conduct Policy page shell.
- Accessibility Statement page shell.
- Trust Commitments page shell.

## 17. Milestone 1 Acceptance Criteria

Milestone 1 is acceptable when:

- Public app runs production-style.
- NGO profile/onboarding/report foundation works.
- Shopping POC works with real products/stores/evidence only.
- Evidence Score and Your Values Score are separate.
- Shopping Priorities can be completed, saved, and retaken.
- Payment/claim/hosted status cannot boost ranking.
- Admin pricing config exists.
- Auth/MFA/SSO-ready org model exists.
- Audit logs record sensitive actions.
- Stripe test-mode foundation exists.
- Logo assets are recolored/exported.
- Mobile experience is usable for Shopping and NGO.

## 18. Recommended Build Order

Milestone 1 should be delivered through six release slices:

1. **Release 1: Foundation**
   - Foundation
   - Design system
   - Auth
   - Database
   - Roles
   - Audit logs

2. **Release 2: NGO**
   - NGO profiles
   - NGO onboarding
   - Evidence intake
   - Basic reports

3. **Release 3: Scoring And Guardrails**
   - Scoring foundation
   - Score snapshots
   - Admin guardrails
   - Payment firewall tests

4. **Release 4: Shopping**
   - Shopping POC
   - Product pages
   - Places to buy
   - Shopping Priorities

5. **Release 5: Business / Local**
   - Business/local profiles
   - Claim flow
   - Catalog foundation

6. **Release 6: Plus / Launch Readiness**
   - Plus foundation
   - Stripe test mode
   - Legal/trust pages
   - Mobile/accessibility QA

Release sequencing principle:

Build NGO early to establish trust credibility, then bring Shopping online close behind so the evidence system and consumer discovery grow together.

## 19. Remaining Pre-Launch Planning Gates

These items do not block creation of the backlog, but they should be reviewed before public launch and before any sensitive paid reporting/audit workflow is live.

### Launch Gates

Define the checklist that must be true before Mishava opens to users.

Needs:

- Legal docs published
- Support process ready
- Data/evidence review process ready
- Payment mode decision
- Security review
- Accessibility pass
- No-paid-ranking tests passing
- Real-data-only POC verified

### Support / Operations Playbooks

Define how support handles users, businesses, NGOs, funders, press, and internal escalations.

Needs:

- Support intake categories
- Evidence upload help
- Billing support
- Correction/dispute support
- Press/research access support
- Abuse reports
- Escalation path

### Refund / Outcome-Neutral Paid Service Rules

Define how paid setup, verification, audit, reports, and subscriptions are handled when users dislike outcomes.

Needs:

- Payment buys process/tools/access, not favorable results.
- Refund rules for incomplete work.
- No refund guarantee for unfavorable trust outcomes.
- Correction and dispute rights preserved.
- Audit-like correction work may be charged.

### Source Licensing / Data Rights

Define what Mishava can collect, store, summarize, cite, and display.

Needs:

- Public web data policy
- Product page/source citation policy
- Submitted document permissions
- Report quote/reuse terms
- Dataset export rights
- Source attribution rules

### Gov Public-Record Boundaries

Define what Mishava Gov can expose publicly and what must remain internal/restricted.

Needs:

- Procurement record visibility
- Sensitive procurement details
- Security-sensitive information
- Public summary vs full record
- Agency consent/configuration
- Public records law review

### High-Risk Category Policy

Define categories that require deeper evidence, stronger review, or more cautious display.

Needs:

- Baby/children's products
- Automotive
- Food/supplements
- Health/medical
- Chemicals/cleaning
- Electronics/batteries
- Apparel/textiles
- Construction materials
- High-risk supplier chains

### AI Vendor / Data-Sharing Policy

Define what data can be sent to AI vendors and under what terms.

Needs:

- Vendor list
- Data processing terms
- No-training commitments where needed
- Sensitive document handling
- Redaction-before-AI rules
- Retention rules
- Model/prompt logging

### Reviewer Training / Certification

Define who can review which evidence and how they become qualified.

Needs:

- Training modules
- Certification levels
- Category-specific review permissions
- Conflict-of-interest training
- Legal/risk escalation training
- Recertification schedule

### Abuse / Manipulation Prevention

Define how Mishava prevents misuse by companies, users, press, funders, employees, and bad-faith actors.

Needs:

- Fake evidence detection
- Coordinated reporting abuse
- Review manipulation attempts
- Bribery/conflict reporting
- Press/report misuse
- User harassment prevention
- Rate limits and suspicious behavior alerts

### Methodology Testing / Backtesting

Define how scoring/ranking methodology is tested before release.

Needs:

- Sample profile tests
- Category tests
- Small-business fairness tests
- Payment firewall tests
- Red-line behavior tests
- Historical comparison snapshots
- Bias/fairness review

### Investor / Funder Narrative

Define the narrative for funders, investors, foundations, and strategic partners.

Needs:

- Why Mishava exists
- Trust infrastructure thesis
- Revenue without manipulation
- NGO and small-business fairness story
- Consumer Deep Review value
- Evidence operations model
- Pro forma metrics

### Competitive Landscape

Define what Mishava is and is not compared with adjacent tools.

Needs:

- Not a marketplace
- Not ad-tech
- Not reputation management
- Not ESG consulting only
- Not procurement software only
- Not charity rating only
- Difference from Google Shopping, Amazon, Target, B Lab, Charity Navigator, ESG ratings, procurement tools, and review platforms
