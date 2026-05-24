# Mishava Planning V2.20260524a

## 1. Document Purpose

This document consolidates Mishava V2.0 planning discussions through May 24, 2026.

It is a planning source of truth for product architecture, scoring, trust infrastructure, pricing concepts, internal governance, reporting, insights, and future product surfaces.

This is not an implementation document unless a section explicitly says it is ready for implementation. Many areas require further review before code, database tables, routes, pricing logic, or UI screens are built.

Core principle:

> Mishava monetizes trust infrastructure, not attention manipulation.

Design mantra:

> Does this make trust clearer, or does it make attention louder?

If it makes attention louder, remove it.

## 2. Product Positioning

Mishava V2.0 should be a trust-guided discovery and commerce platform.

It should not be:

- A marketplace
- An ad platform
- A sponsored listing engine
- A reputation-management tool
- A pay-to-rank discovery system

Mishava helps people, businesses, NGOs, institutions, public agencies, and researchers compare evidence-backed trust signals across products, companies, suppliers, sellers, NGOs, and institutions.

The platform should feel like a calm civic/trust layer sitting above commerce, suppliers, sellers, NGOs, public institutions, and businesses.

## 3. Hard Product Constraints

Mishava must not allow:

- Paid ranking
- Sponsored placement
- Boosted listings
- Advertising advantages
- Artificial visibility advantage
- Score improvement unless supported by evidence
- Suppression of weak or negative evidence
- Paid trust treatment
- Pay-to-rank search visibility
- Pay-to-rank supplier or seller matching

Payment may unlock:

- Tools
- Hosting
- Workflows
- Verification services
- Evidence parsing
- Reporting
- Integrations
- Saved searches
- Catalogs
- Team features
- Public or paid report access
- Sponsored access for small organizations

Payment must never improve:

- Ranking
- Trust score
- Search position
- Match position
- Perceived credibility
- Verification status
- Public trust display

## 4. Core Product Surfaces

The long-term Mishava architecture includes:

- Mishava NGO
- Mishava Shopping
- Mishava Local
- Mishava Business
- Mishava Trade / Network
- Mishava Hosted Pages
- Mishava Audit / Verification
- Mishava Reports
- Mishava Insights & Reporting
- Mishava Corporate
- Mishava Gov
- Mishava Plus
- Mishava Team
- Mishava Admin / Governance

Suggested long-term architecture:

```txt
Mishava Core Trust Engine
  - NGO
  - Shopping
  - Local
  - Business
  - Trade / Network
  - Reports
  - Insights
  - Corporate
  - Gov
  - Plus
  - Team
  - Admin / Governance
```

Current planning sequence:

1. NGO
2. Shopping
3. Local
4. Business
5. Gov / Corporate
6. Plus

Gov and Corporate may eventually sit near each other because both involve institutional decision-making, but Gov is distinct because it involves public money, public accountability, procurement exception documentation, and transparency reporting.

## 5. Primary Public Navigation

Primary navigation should initially reflect the core public-facing system:

- Shopping
- Business
- Trade / Network
- NGO
- Audit / Verification
- About

Future navigation or product access may include:

- Reports
- Insights
- Corporate
- Gov
- Team
- Admin

Internal and institutional surfaces should not clutter early public navigation unless they are product-ready.

## 6. First Screens To Design And Build

Initial V2.0 design/build planning included:

1. Public home
2. Shopping discovery page
3. Business profile page
4. Supplier/seller network page
5. Business onboarding/profile setup
6. Admin pricing configuration
7. Small Business Trust Pathway flow
8. Evidence/trust profile view

After additional planning, the first architecture should also reserve space for:

- Team audit queue foundation
- Reports access foundation
- Claims/evidence model
- Entitlements model
- Payment firewall tests

## 7. Visual Design System

Overall feel:

- Calm
- Credible
- Evidence-forward
- Accessible
- Modern
- Warm enough for small businesses
- Serious enough for NGOs, auditors, institutions, enterprises, and public-sector users

Avoid:

- Amazon/Target/Walmart-style retail noise
- Ad-tech visuals
- Crypto/web3 aesthetics
- Heavy gradients
- Oversized generic SaaS heroes
- Generic startup purple/blue gradients
- Beige-only ethical-brand palettes
- Dark intimidating compliance dashboards
- Glossy luxury styling
- Gamified trust badges
- Card-inside-card layouts
- Floating glass panels
- Decorative blob backgrounds

Core design concept:

> Clear evidence, fair discovery.

### Color System

Primary colors:

- Mishava Ink: `#17201C`
- Trust Green: `#2F6F4E`
- Evidence Teal: `#2D7C83`
- Civic Blue: `#2F5F8F`
- Warm Gold: `#C99535`
- Soft Coral: `#D96B5F`

Backgrounds:

- Paper: `#F7F5EF`
- Soft Mist: `#EEF3F1`
- White: `#FFFFFF`
- Pale Blue: `#EAF1F6`
- Pale Green: `#EAF4ED`

Borders:

- Light Border: `#DDE3DE`
- Medium Border: `#BBC8C0`
- Strong Border: `#7F9087`

Text:

- Primary Text: `#17201C`
- Secondary Text: `#52635A`
- Muted Text: `#738178`
- Inverse Text: `#FFFFFF`

Status colors:

- Verified: `#2F6F4E`
- Public Record Checked: `#2D7C83`
- Self-Attested: `#C99535`
- Unverified: `#8A8F88`
- Needs Review: `#D96B5F`
- Audit Reviewed: `#2F5F8F`

Palette balance:

- 60% Paper / White / Soft Mist
- 20% Ink / neutral text
- 10% Teal / Blue
- 5% Green
- 5% Gold / Coral status accents

Do not overuse green. Green should signal trust, not decorate everything.

### Logo System

Current source logo:

```txt
/Users/caitlinferguson/Library/Mobile Documents/com~apple~CloudDocs/Move to iCloud 2026.3.25/Mishava/Docs for Build/MishavaLogo.png
```

Logo decisions:

- The logo should keep its current green/blue direction but be recolored to the Mishava V2.0 palette.
- Primary logo colors should use Trust Green (`#2F6F4E`) and Evidence Teal (`#2D7C83`).
- Logo conversion should be part of Milestone 1.
- The logo should be converted/traced into a master SVG if feasible.
- Mishava should have both symbol-only and wordmark + symbol versions.
- The wordmark should be created from the design system font direction unless a stronger dedicated wordmark is later designed.
- The favicon/app icon should use the symbol only.

Recommended logo asset variants:

- Primary two-tone logo: Trust Green + Evidence Teal
- Institutional version: Mishava Ink + Civic Blue
- One-color version: Mishava Ink
- Inverse version: White
- Symbol-only version
- Wordmark + symbol version
- Favicon/app icon
- PNG exports for common web sizes

### Typography

Use a highly readable modern sans-serif:

- Inter
- Source Sans 3
- IBM Plex Sans
- Avenir-style system stack
- Geist Sans if using Next.js

Tone:

- Clear
- Calm
- Direct
- Not playful
- Not corporate-jargony
- Not luxury editorial

Suggested type scale:

- Page title: 40-56px desktop, 32-40px mobile
- Section heading: 24-32px
- Card heading: 18-22px
- Body: 16px
- Small/meta: 13-14px
- Data labels: 12-13px

Rules:

- No huge marketing H1s unless truly needed.
- Dashboards and tools should use compact, scannable type.
- Evidence and scoring UI should prioritize legibility.
- Use sentence case for most labels.
- Avoid all-caps except tiny metadata/kickers.

### Layout

Use:

- Clear bands
- Restrained cards
- Dense but readable dashboards
- Comparison tables
- Evidence timelines
- Trust score panels
- Profile headers
- Filter sidebars
- Structured forms
- Admin configuration tables

Corners:

- 6-8px radius
- Avoid very pillowy rounded cards

Shadows:

- Prefer borders and background contrast.
- Use subtle shadows only when needed.
- Example: `0 1px 2px rgba(23, 32, 28, 0.06)`

Accessibility:

- Strong color contrast
- Keyboard navigation
- Visible focus states
- Readable font sizes
- Non-color-only status communication
- Plain-language explanations
- Mobile-friendly forms and tables

Focus ring:

- `#2F5F8F`
- 2px outline
- 2px offset

## 8. Scoring System

Mishava scores trust from evidence.

Mishava does not score:

- Popularity
- Payment status
- Marketing claims
- Sentiment
- Sponsorship
- Ad spend

The score should answer:

> What does the available evidence show about this organization or product, and how strong, current, and complete is that evidence?

The score must not answer:

- Who paid Mishava?
- Who is popular?
- Who has the best marketing?
- Who should Mishava promote?

### Canonical Scoring Chain

```txt
Evidence Sources
-> Evidence Items
-> Structured Facts
-> Indicators
-> Pillars
-> Overall Mishava Score
-> Coverage / Recency / Confidence
-> Snapshots
-> User Preference Overlay
-> Ranking / Matching
```

The base score is evidence-derived. The user overlay changes fit and ordering for that user. Payment never changes score or rank.

### SDG Scoring Foundation

The original Mishava scoring system was SDG-based across all 17 United Nations Sustainable Development Goals.

Canonical UN SDG list for alignment:

1. No Poverty
2. Zero Hunger
3. Good Health and Well-Being
4. Quality Education
5. Gender Equality
6. Clean Water and Sanitation
7. Affordable and Clean Energy
8. Decent Work and Economic Growth
9. Industry, Innovation and Infrastructure
10. Reduced Inequalities
11. Sustainable Cities and Communities
12. Responsible Consumption and Production
13. Climate Action
14. Life Below Water
15. Life On Land
16. Peace, Justice and Strong Institutions
17. Partnerships for the Goals

This list aligns with the official United Nations 17 Sustainable Development Goals.

Score scale:

- 0: No policy or evidence
- 25: Minimal or symbolic effort
- 50: Partial or inconsistent implementation
- 75: Strong, documented performance
- 100: Leading practice, independently verified

Evidence hierarchy:

1. Independent third-party verification
2. Public metrics with disclosed methodology
3. Internal policies plus evidence of enforcement
4. Self-attestation only, capped at 50

Certain failures may trigger automatic caps or zeros, such as wage theft, unsafe working conditions, union retaliation, forced labor, discrimination, corruption, or documented environmental harm.

A restoration process should exist.

Restoration should be evidence-led, not merely time-led. If a company fixes a problem and provides credible evidence that both the actual issue and relevant policy/practice have changed, Mishava should be able to recognize the repair without waiting an arbitrary amount of time.

Time may be required only where the issue itself requires monitoring, audit completion, recurrence checks, or proof that a change is durable.

This reflects Mishava's repair principle:

> Mishava documents harm, but rewards repair. Restoration requires evidence, not PR.

Restoration may require:

- Acknowledgment of harm
- Corrective action
- Remedy to affected people or communities where relevant
- Prevention going forward
- Evidence-backed verification

### Recommended Public Scoring Structure

Use the 17 SDGs as a deep internal indicator library, but present most public scoring through four public pillars:

- Labor
- Environment
- Governance
- Community

The SDGs should remain available as an advanced explanation layer.

Public user example:

```txt
Mishava Score: 84
Labor: Strong
Environment: Moderate
Governance: Strong
Community: Limited
Coverage: Medium
Recency: Fresh
Verification: Public record checked
```

Expanded SDG layer example:

```txt
SDG 1: Living wage evidence partial
SDG 3: Health and safety evidence strong
SDG 5: Gender pay evidence missing
SDG 8: Labor rights evidence strong
SDG 12: Supply-chain transparency incomplete
```

### SDG-To-Pillar Orientation

Labor may include:

- SDG 1 No Poverty
- SDG 2 Zero Hunger where worker food security applies
- SDG 3 Health and well-being
- SDG 4 Education
- SDG 5 Gender equality
- SDG 8 Decent work
- SDG 10 Reduced inequalities

Environment may include:

- SDG 6 Clean water and sanitation
- SDG 7 Affordable and clean energy
- SDG 12 Responsible consumption and production
- SDG 13 Climate action
- SDG 14 Life below water
- SDG 15 Life on land

Governance may include:

- SDG 9 Industry, innovation, and infrastructure where ethics/risk apply
- SDG 16 Peace, justice, and strong institutions
- Transparency
- Corruption
- Accountability
- Remediation

Community may include:

- SDG 11 Sustainable cities and communities
- SDG 17 Partnerships for the goals
- Local ownership
- Local employment
- Community benefit

Avoid double-counting. One SDG can contribute to multiple pillars only through specific indicators.

### Evidence Sources

Allowed fact-eligible sources:

- Government and regulatory records
- Court rulings and enforcement actions
- Verified NGO reporting
- Academic research
- Independent audits
- Certifications
- Public disclosures
- Public filings
- Documented operational practices
- Public business records
- Official licenses or registrations
- Supplier/customer references when corroborated
- Redacted invoices or sourcing proof where appropriate

Excluded or non-scoring sources:

- Advertising
- Marketing copy
- Unverified self-reported claims
- Opinion content
- Unsupported social media narratives
- Paid promotional material
- Sponsored content
- Reputation-management claims
- Press releases unless independently corroborated

Rule:

> Evidence that cannot be verified should not increase the score.

### Scores Need Context

Every score display should include:

```txt
Mishava Score: 84
Coverage: Medium
Recency: Fresh
Verification: Public record checked
Confidence: Medium
Why: Labor evidence and local registration verified; sourcing evidence incomplete.
```

Never show a naked score without context.

Good labels:

- Why this score?
- Evidence coverage
- Evidence recency
- Verification status
- What has been checked
- What is missing
- Source details
- Snapshot date

Avoid labels:

- Top pick
- Sponsored
- Premium result
- Best seller
- Preferred partner
- Boosted
- Trusted because paid

## 9. User SDG Questionnaire

The original questionnaire covers all 17 SDGs and includes:

- 1-5 value sliders
- willingness-to-pay questions
- brand-choice influence questions
- identity alignment questions
- red-line disqualification criteria

Important distinction:

The questionnaire does not score companies. It tells Mishava what the user personally cares about.

Company score:

> What does the evidence show?

User questionnaire:

> What does this user care about?

Ranking overlay:

> Given the search, evidence, trust score, user values, category fit, location, and availability, what should appear first?

Recommendation:

- Quick mode: 8-12 questions
- Standard mode: 20-30 questions
- Advanced mode: full SDG questionnaire

The full questionnaire should remain available for users who want detailed preference control.

The Universal Disqualification Rule should become a user-defined hard filter or warning rule, not a base-score change.

Free-text red lines must be translated into explicit evidence-based rule categories before enforcement.

## 10. Bible Verse / Faith-Rooted SDG Layer

Every SDG may have a related Bible verse and plain-language ethical explanation.

This layer can be meaningful, but it should not determine scores.

Potential placement:

- Founder philosophy
- Values origin
- Optional faith-based reflection mode
- SDG education content
- Non-scoring explanation layer

For broad institutional credibility, the scoring engine should remain evidence-based, secular-readable, and audit-ready.

This requires further discussion before any public UI decision.

## 11. Ranking And Matching

Ranking is not scoring.

Scoring:

> Evidence-derived trust score.

Ranking:

> Ordering of results for a specific search or user context.

Allowed shopping ranking factors:

```txt
result_rank =
  relevance_score
  + mishava_score
  + user_preference_match
  + evidence_coverage_score
  + evidence_recency_score
  + verification_confidence
  + category_fit
  + location_or_logistics_fit
  + availability_fit
```

Never include:

- payment_status
- subscription_tier
- hosted_profile_enabled
- ad_spend
- sponsorship
- paid_boost
- sales_commission

Supplier/seller matching factors:

- Category fit
- Product fit
- Values alignment
- Mishava score match
- Evidence requirement match
- Geography/shipping fit
- Capacity fit
- Price/business fit
- Verification status

Payment may unlock saved matches, tools, catalogs, workflows, and communication. Payment must never create priority placement.

## 12. Business Profile Types And Participation

Business profile types:

- `free_public_record`
- `minimum_supplier_seller`
- `hosted_profile`
- `growth_network`
- `pro_network`
- `enterprise`

Business participation modes:

- `external_link`
- `mishava_hosted`
- `both`

Market income tiers:

- `high_income`
- `upper_middle_income`
- `lower_middle_income`
- `low_income`
- `sponsored_access`

Core business fields:

- is_supplier
- is_seller
- is_local_business
- is_family_owned
- is_small_business
- external_url
- hosted_profile_enabled
- hosted_catalog_enabled
- supplier_matching_enabled
- seller_matching_enabled
- verification_status
- evidence_burden_level
- ranking_payment_boost_allowed: false

Verification statuses:

- `unverified`
- `self_attested`
- `public_record_checked`
- `document_checked`
- `verified`
- `audit_reviewed`

Evidence burden levels:

- `lightweight`
- `standard`
- `enhanced`
- `enterprise`

## 13. Small Business Trust Pathway

Small/local/family businesses should not need corporate ESG reports or expensive audits.

Flow:

1. Business fills out simple form/document.
2. Business uploads optional supporting evidence.
3. AI parses submission into structured claims.
4. Mishava checks identity/existence against public or official sources where possible.
5. Mishava assigns evidence coverage, recency, and confidence indicators.
6. Business profile becomes eligible for discovery, external linking, hosting, and supplier/seller matching.

Acceptable lightweight evidence:

- Business registration
- Local license
- Seller permit
- Professional license
- Website or social profile
- Photos of shop/products/workspace
- Owner attestation
- Supplier/customer references
- Redacted invoices or proof of sourcing
- Public records
- Optional EIN confirmation letter

Avoid private tax returns as normal verification.

Small businesses should not look less legitimate just because they have lighter evidence. The UI should clearly show:

- Evidence burden level
- Confidence indicators
- What has been checked
- What remains unverified

## 14. Mishava Team And Anti-Bribery Operations

Mishava needs an internal Team side as part of the core build.

It should prevent bribes, conflicts of interest, payment pressure, or employee authority from changing trust outcomes without evidence and a visible paper trail.

Core invariant:

> No trust outcome can be changed without evidence, role-appropriate review, and an immutable audit trail.

### Team App Areas

- Audit queue
- Evidence intake
- Field audit uploads
- AI extraction review
- Human review queue
- Score impact review
- Disputes and appeals
- Quality control
- Reviewer assignment
- Audit trail
- Employee permissions
- Risk flags
- Admin pricing/configuration

### Role Families

- Field audit
- Evidence review
- Scoring and methodology
- Quality control
- Disputes and appeals
- Business support
- Trust and safety
- Legal/compliance
- Technical operations
- Finance/pricing
- Executive oversight
- External observers

Example roles:

- field_auditor
- senior_field_auditor
- remote_verification_specialist
- evidence_intake_specialist
- evidence_reviewer
- senior_evidence_reviewer
- ai_extraction_reviewer
- audit_case_manager
- quality_control_reviewer
- quality_control_lead
- dispute_reviewer
- appeals_panel_member
- scoring_methodology_admin
- scoring_version_approver
- trust_policy_admin
- business_support_specialist
- business_account_manager
- pricing_admin
- billing_support
- legal_reviewer
- compliance_officer
- anti_bribery_officer
- data_protection_officer
- security_admin
- system_admin
- engineering_admin
- executive_read_only
- external_auditor
- ngo_observer
- institutional_observer
- read_only_auditor

### Separation Of Duties

Rules to enforce in code:

- Field auditor cannot review their own audit.
- Evidence reviewer cannot approve their own disputed decision.
- Business support cannot alter score outcomes.
- Pricing admin cannot alter ranking, score, verification, or evidence.
- Scoring admin cannot change one company's score directly.
- System admin cannot silently modify audit outcomes.
- Dispute reviewer cannot be the original reviewer.
- Final approval cannot be completed without required evidence links.
- High-risk cases require two-person approval.
- Enterprise audits require senior review.
- Random small-business cases go to quality sampling.

No one should directly set a final score. Outcomes change through evidence decisions:

```txt
Evidence uploaded
-> AI extracts claim
-> Reviewer accepts/rejects claim
-> Facts are created
-> Indicators recalculate
-> Pillar scores recalculate
-> Snapshot is generated
-> Approval policy runs
-> Final snapshot is published
```

### Employee Scale

Mishava may eventually need tens of thousands of employees with access.

The internal system should support:

- Organization hierarchy
- Region
- Country
- Language
- Category
- Audit type
- Risk level
- Business size
- Certification/training level
- Manager relationship
- MFA
- Access review
- Conflict disclosure

### Transparency Levels

- Public: score, coverage, verification status, explanation, source summaries
- Business-visible: submitted evidence, reviewer decisions, dispute status, missing evidence
- Mishava internal: full audit workflow, reviewer notes, AI outputs, assignment history
- Restricted internal: sensitive documents, employee HR/security info, legal notes
- Governance/audit visible: complete immutable logs, admin actions, conflict flags, override history

## 15. Audit And Verification

AI should assist, not decide final trust alone.

AI may:

- Read uploaded documents
- Extract claims
- Classify evidence type
- Detect missing fields
- Flag inconsistencies
- Suggest SDG indicators
- Suggest pillar impacts
- Identify stale evidence
- Compare claims against documents
- Generate reviewer summaries
- Flag possible fraud or mismatch
- Suggest confidence levels
- Draft explanation text

AI should not:

- Finalize high-risk audits alone
- Override human reviewers
- Suppress negative evidence
- Change score because of payment
- Decide disputes without review
- Apply undocumented logic

Human review is required when:

- AI confidence is low
- Documents are unreadable
- Photos do not match business/location
- Evidence conflicts with business claims
- Negative evidence is found
- Severe allegations appear
- Wage, safety, forced labor, discrimination, corruption, or union issues appear
- Company disputes the outcome
- Audit would materially lower the score
- Audit would materially raise the score based mostly on self-attestation
- Business is high-impact or enterprise-level
- Category is high-risk
- Reviewer overrides AI
- Staff member has conflict of interest
- Random quality-control sampling selects the case

Field audit uploads may include:

- Location photos
- Exterior business photo
- Interior/workspace photos
- Product/service photos
- Safety condition photos where relevant
- Water/sanitation photos where relevant
- Equipment or production area photos
- Licenses or permits
- Business registration
- Worker policy documents
- Pay/wage evidence where appropriate
- Supplier/source documents
- Certifications
- Interview notes
- Observation checklist
- GPS/location metadata
- Timestamped visit record
- Auditor attestation

## 16. Reports And Public Transparency

Mishava needs public-facing and paid reporting access so trust information can be shared transparently.

Reports monetize transparency and research access, not ranking or credibility.

Paid report access can unlock:

- Deeper reports
- Source summaries
- Score history
- Evidence timelines
- Product-level reviews
- Exports
- Watchlists
- Press/institutional briefings

Paid report access can never change:

- Mishava score
- Ranking
- Verification status
- Evidence interpretation
- Audit outcome
- Public credibility labels

Access types:

- individual_consumer
- press_researcher
- ngo_researcher
- institutional_reviewer
- enterprise_procurement
- foundation_or_funder
- academic_researcher
- regulator_read_only

Visibility levels:

- Public
- Registered
- Paid approved
- Restricted approved
- Internal only
- Governance/audit only

Consumer deep review concept:

- Potential annual plan around $99/year, subject to review
- Product-specific score explanations
- Evidence timelines
- Source summaries
- Saved products
- Watch alerts
- Side-by-side comparisons

Media/research access should include approval, terms, export controls, rate limits, watermarking, and revocation workflow.

## 17. Mishava Insights And Reporting

Mishava should be able to analyze aggregate data to help organizations understand where evidence-backed trust improvements may align with buyer demand and stronger business outcomes.

Example insight:

> If 90% of buyers using Mishava are willing to pay 5% more for equal pay evidence, Mishava can share aggregated data with organizations so they understand the business value of actually meeting that goal.

This must be framed as:

> What evidence-backed trust improvements do buyers value, and where can that help businesses make better, fairer decisions?

Not:

> How can businesses exploit buyer values?

Data layers:

1. Buyer preference data
2. Trust/evidence data
3. Commerce/engagement data

Signals may include:

- Questionnaire answers
- Search behavior
- Filter usage
- Saved products
- Comparison views
- Outbound clicks
- Inquiries
- Report views
- Watchlist adds
- Preference matches
- Price tolerance answers

Reports must be aggregated and privacy-safe.

Guardrails:

- No individual buyer data resale
- Minimum aggregation thresholds
- No sensitive microtargeting
- No sale of personal preference profiles
- User consent
- Opt-out controls
- Plain-language privacy explanation
- No ranking influence
- No score influence
- Clear methodology notes
- Export logging

Potential paid levels:

- Basic category insights
- Business-specific opportunity insights
- Category benchmark reports
- Market/region insights
- Custom research/media data package
- API/institutional data access

## 18. Pricing Architecture

Pricing should be admin-configurable.

Mishava should charge for:

- Supplier/Seller Profiles
- Hosted pages
- Hosted catalogs
- Product catalog management
- Evidence parsing
- Verification workflow
- Trust profile tools
- Audit/review services
- Saved supplier/seller matches
- Team access
- Reporting exports
- API/integrations
- Communication/contact workflows
- Foundation/network sponsored access
- Consumer deep reports
- Media/research data access
- Insights and benchmark reports

Mishava should not charge for:

- Top placement
- Sponsored search position
- Boosted listing
- Better ranking
- Artificial visibility
- Paid trust treatment
- Score improvement without evidence
- Suppression of negative or weak evidence

### Pricing Surfaces

Initial and planned pricing surfaces:

- NGO
- Free Public Business Record
- Minimum Supplier/Seller Profile
- Hosted Business Page Add-On
- Hosted Product Catalog Add-On
- Supplier-to-Seller Network Tools
- Evidence Parsing / Setup Services
- Business Verification
- Audit / Review Services
- Business Dashboard Plans
- Hosted Seller / Supplier Page Packages
- Local Business Pricing
- Shopping Revenue
- Network / Foundation / Sponsored Access
- Corporate / Institutional Pricing
- Mishava Plus Consumer Subscription
- Data / API Pricing
- Reports
- Insights & Reporting
- Media / Research Access
- Future Gov

Immediate locked/near-locked lines:

- NGO: $0 / $19 / $59 / $129 / custom
- Minimum Supplier/Seller Profile: $19 / $9 / $5 / $0-$2 by market tier
- Hosted Business Page: $19 / $9 / $5 / $0-$2 by market tier
- Catalog Starter: $29 high-income, multiplier-based elsewhere
- Network Basic: $29 high-income, multiplier-based elsewhere
- AI Parse + Basic Profile Draft: $29 high-income, discounted by market tier
- Assisted Setup: $99 high-income, discounted by market tier
- Guided Evidence Setup: $249 high-income, discounted by market tier
- Basic Audit / Evidence Review: $99-$299 small/local, higher for larger companies
- Business Dashboard Starter: $49 high-income, multiplier-based elsewhere

Later/scenario lines:

- Corporate
- Plus
- Data/API
- Enterprise audit
- Gov
- Advanced Insights

### Admin Pricing Records

Recommended fields:

- product_surface
- plan_code
- plan_name
- market_income_tier
- country_code
- currency
- billing_interval
- monthly_price_cents
- annual_price_cents
- one_time_price_cents
- custom_pricing_required
- sponsored_allowed
- active

## 19. Entitlements And Feature Gates

Mishava needs a central entitlement engine. Feature access should be separate from ranking.

Feature gates may include:

- external_link_allowed
- hosted_profile_allowed
- hosted_catalog_allowed
- supplier_matching_allowed
- seller_matching_allowed
- saved_search_limit
- product_limit
- evidence_record_limit
- team_member_limit
- report_export_allowed
- api_access_allowed
- audit_workflow_allowed

Plan checks should not appear inside ranking formulas. Ranking should only use trust, evidence, relevance, fit, availability, and logistics.

## 20. Account And Identity System

Mishava needs a full identity and login system for:

- Consumer accounts
- Consumer Plus accounts
- Business accounts
- Supplier accounts
- Seller accounts
- Local business accounts
- NGO accounts
- Foundation/network sponsor accounts
- Corporate/institutional accounts
- Press/research accounts
- Mishava employee accounts
- External auditor accounts
- Admin/governance accounts

Core concepts:

- Person
- Organization
- Workspace
- Team
- Role
- Permission
- Case assignment
- Billing account
- Approval status
- Entitlement
- Audit trail

Questions to review before implementation:

- Which account types launch first?
- Do consumers need accounts at launch?
- Do Business and NGO share one portal?
- What identity checks are required for press/research access?
- What MFA requirements apply by role?

## 21. Claims, Products, And Catalogs

Mishava needs formal claims management.

Example claims:

- Family-owned
- Local business
- Union-made
- Living wage
- Organic
- Low-carbon
- Woman-owned
- No forced labor
- Sustainably sourced
- Made in USA
- Fair trade certified

Each claim should have:

- Status
- Supporting evidence
- Confidence
- Review status
- Expiration/recency
- Public display rules

Product catalog foundation should include:

- Product records
- Product variants
- Product categories
- Availability
- External purchase links
- Hosted inquiry links
- Product images
- Product evidence
- Product-level claims
- Product-level scoring/report snapshots
- Supplier/product relationship
- Seller/product relationship

Open question:

Should products have independent scores, inherit business scores, or use a hybrid model?

## 22. Legal, Consent, Redaction, And Privacy

Mishava will handle sensitive documents, photos, audits, reports, and public evidence summaries.

Needed foundations:

- Consent records
- Evidence visibility level
- Sensitive document flags
- Redaction status
- Publication permission
- Report-sharing permission
- Raw document access restrictions
- Terms acceptance records
- Correction request workflow
- Privacy controls
- Data retention policies

Review before implementation:

- What businesses consent to publish
- Whether submitted documents can be summarized publicly
- Who can see raw evidence
- Redaction standards
- Data retention policy
- Legal review requirements

## 23. Public Transparency Ledger

Mishava should maintain public transparency about:

- Scoring methodology
- Ranking methodology
- Payment firewall
- No-commission shopping model
- Snapshot logic
- Corrections/disputes policy
- Methodology version history
- Audit process overview
- Evidence status definitions

This supports legitimacy without exposing sensitive documents.

## 24. No-Commission Shopping Governance

Mishava Shopping should not be commission-based.

Mishava is not the shopping location and should not earn affiliate/referral commissions from outbound shopping links.

Shopping revenue should come from trust infrastructure, such as:

- Consumer Deep Review
- Reports
- Business tools
- Hosted pages
- Catalogs
- Verification
- Insights
- Sponsored access
- Institutional access

Guardrails:

- No affiliate/referral commissions.
- No commission-based routing.
- No paid shopping influence.
- No paid placement in shopping results.
- No seller payment factor in ranking.
- Shopping result order must remain independent of business payment status.

Public disclosure should emphasize:

```txt
Mishava does not earn commissions from your shopping links. Payment does not affect score, ranking, or verification.
```

## 25. Foundation / Network Sponsored Access

Sponsored access is a major mission and revenue line.

Sponsors may include:

- Foundations
- Associations
- Denominations
- Church networks
- Chambers
- Community networks
- Corporate programs supporting small vendors
- Government or NGO programs

Sponsor dashboard should eventually include:

- Sponsored participant list
- Invite flow
- Setup progress
- Evidence progress
- Verification status
- Aggregate reporting
- Renewal and billing
- Unused seats
- Exportable summaries
- Optional custom program fields

Important review question:

How much individual participant data can sponsors see, and what requires participant consent?

## 26. Mishava Gov

Mishava Gov is a future institutional/public-sector surface.

Separate planning document:

`docs/mishava-gov-product-concept.md`

Short positioning:

> Mishava Gov helps public agencies make, document, and report evidence-backed purchasing decisions.

Longer positioning:

> Mishava Gov brings evidence-backed trust infrastructure to public purchasing, helping agencies evaluate vendors and products, document procurement reasoning, preserve audit-ready decision snapshots, and eventually provide clearer transparency for the public and media.

Readiness:

```txt
future / institutional surface / not ready for immediate implementation
```

Do not move Gov before NGO or Shopping.

Gov should include future concepts such as:

- Vendor Trust Profiles
- Product Purchasing Review
- Procurement Trust Snapshots
- Policy Alignment Engine
- Exception Justification System
- Public Transparency Portal
- Media/Public Reporting System

Gov revenue must come from tools, evidence workflows, reporting, transparency infrastructure, implementation, and institutional access, not paid vendor visibility.

## 27. Implementation Readiness

The user explicitly held implementation during most of this planning. This document is a consolidation of strategy and should not be treated as approval to build every component.

Potential first implementation milestone once approved:

- Account/organization foundation
- Roles and permissions foundation
- Pricing records and entitlements foundation
- Business/NGO/supplier/seller profile foundation
- Evidence and claims foundation
- Score snapshot foundation
- Payment firewall test structure
- Audit case and audit log foundation
- Reports access model foundation
- Public home
- Shopping discovery
- Business profile
- Business onboarding
- Evidence/trust profile view
- Admin pricing configuration

Items requiring further review before implementation:

- Exact SDG-to-pillar scoring math
- Indicator-to-pillar formula
- Cap and zero rules
- Restoration rules
- Public SDG visibility
- Bible verse / faith layer placement
- User questionnaire length and flow
- Report access approval rules
- Consumer deep review pricing
- Media/research pricing
- Insights privacy thresholds
- Initial staff role roster
- Employee visibility/audit rules
- Small business evidence requirements
- Product scoring model
- Claims taxonomy
- Legal/consent model
- Data retention
- Launch order

Current milestone direction:

- NGO should be one of the earliest built surfaces because NGO participation helps create trust for Shopping.
- Build NGO first, then move toward Shopping, with both coming online in similar timing so they can reinforce each other.
- This is not intended as a rushed "introduce tomorrow" product.
- The goal is a thoughtful, production-ready MVP path with room to enjoy the build and process, not the fastest cash-push product.
- Final scoring math is not required before Milestone 1, but scoring structures must be correct and scoring version should be labeled as draft where provisional.
- Pricing/tiers should be visible early, but full payments can be staged unless needed for Plus launch.
- Consumer Plus should have a functional foundation from the first production MVP path.
- AI should be included through architecture and initial controlled workflows, not uncontrolled full automation.
- Local business product catalog should be included at the model/foundation level.
- Admin pricing configuration should exist early, preferably as a simple admin UI.
- Logo recolor should be part of the first milestone.
- Planning docs should be committed before build begins.

Milestone 1 build scope:

Name:

```txt
Mishava V2.0 Foundation MVP
```

Primary goal:

```txt
Launch a production-ready foundation where NGO trust profiles and early Shopping can come online together, with evidence scoring architecture, user priorities, and no-paid-ranking guardrails built correctly from day one.
```

Milestone 1 surfaces:

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

Milestone 1 route scope:

Public:

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

App:

```txt
/app
/app/shopping-priorities
/app/saved
/app/watchlist
/app/billing
```

Organization:

```txt
/org
/org/profile
/org/evidence
/org/reports
/org/team
/org/billing
```

Admin:

```txt
/admin
/admin/pricing
/admin/categories
/admin/scoring
/admin/users
```

Milestone 1 decisions:

- Include both NGO and Shopping, with NGO slightly first but both online close together.
- Include `/local` as a simple page plus local filters.
- Use Stripe foundation but do not require live billing unless needed for beta.
- NGO report builder should be functional at a basic template/report level in Milestone 1.
- AI should be active in Milestone 1 for limited evidence/report/catalog workflows, tightly logged and controlled.
- Admin pricing config should be a simple editable UI.
- Product data should be seeded manually first.
- Business claim flow should be real, not only placeholder.
- SSO should be technically ready and enabled if the chosen auth provider supports it cleanly.
- Shopping and NGO pages must be mobile-friendly from day one.

Milestone 1 ticket groups:

Foundation:

- Create production app scaffold.
- Add design tokens/colors.
- Recolor/export logo assets.
- Build public layout/navigation.
- Build database schema foundation.
- Configure auth/MFA/SSO-ready setup.
- Set up role/permission model.
- Set up audit log model.
- Set up file storage foundation.

NGO:

- NGO landing page.
- NGO profile page.
- NGO onboarding/start flow.
- NGO evidence upload/manual entry.
- Basic NGO report template foundation.
- NGO scoped sharing foundation.
- NGO pricing display.

Shopping:

- Shopping search page.
- Product cards.
- Product detail page.
- Places-to-buy section.
- Evidence Score badge.
- Your Values Score badge after priorities.
- Score pop-up.
- Sort/filter controls.
- Seed diaper/wipe products.
- Local option placeholder.

Shopping Priorities:

- 25-question form.
- 12-question minimum personalization.
- Red-line Off / Warn / Hide.
- Save user priorities.
- Retake flow.
- Prompt to complete remaining questions.

Evidence / Scoring:

- Evidence item model.
- Source model.
- Claim model.
- Structured fact model.
- SDG score model.
- Pillar score model.
- Score snapshot model.
- Coverage/recency/confidence fields.
- Draft scoring version marker.
- Payment firewall tests.

Business / Local:

- Free public business profile.
- Real claim profile flow.
- Local profile fields.
- Product catalog foundation.
- Places-to-buy seller model.
- Business transparency explanation.

Consumer Plus:

- Plus pricing display.
- Deep Review feature gates.
- Saved products/businesses.
- Watchlist model.
- Trial-ready billing placeholder or Stripe foundation.

Admin:

- Admin dashboard.
- Editable pricing config.
- Category config.
- Scoring version display.
- Entitlement config.
- Basic user/org lookup.
- Audit log viewer foundation.

Tests / Guardrails:

- Payment does not affect ranking.
- Claimed profile does not boost ranking.
- Hosted profile does not boost ranking.
- Commission field does not exist or is ignored.
- Evidence Score and Your Values Score remain separate.
- Red-line hidden results behavior.
- Audit log records sensitive actions.

Milestone 1 POC data set:

- First POC should focus on diapers and baby wipes.
- Initial POC should include both national/online sellers and local example stores.
- POC size should be approximately 25-50 products.
- Initial brand count should be approximately 8-12 brands.
- Initial seller/place-to-buy types may include Target, Walmart, Amazon, Costco, brand websites, local stores, Mishava-hosted seller examples only if real, and independent online sellers.
- Product/evidence examples should include varied evidence quality where real evidence supports it.
- Include restoration/correction examples only when based on real evidence.
- Include red-line examples only when based on real evidence and appropriate review.
- Use real products only.
- Use real sellers/stores only.
- Use real local stores only.
- No fake/demo product data.
- No fake/demo local stores.
- No fake/demo evidence scenarios.
- No seeded or invented scores.
- Scores must be based on real data and real evidence.
- If final scoring is still under review, scores should be withheld or clearly produced through an approved draft scoring version using real evidence, not fabricated values.

Technical/build direction:

- Codex may choose the implementation stack, but it should optimize for production readiness, maintainability, permissions, evidence integrity, and long-term Mishava architecture.
- Preferred database direction is Supabase/Postgres.
- Auth provider decision may be finalized by Codex at build time, defaulting to Clerk with Supabase/Postgres unless a stronger reason appears.
- Multiple vendors are acceptable if they provide better security, user management, MFA, organizations, SSO, and production readiness.
- Enterprise/Gov SSO needs matter, but should not force unnecessary early complexity if the chosen auth provider supports the needed path.
- Auth should prioritize strongest fit within reason, not lowest cost alone.
- Stripe should be the payment system.
- Stripe should run in test mode in Milestone 1, with live billing later.
- Live billing should wait until legal docs, support process, refund/correction policies, and operational readiness are in place.
- First live billing should likely prioritize NGO/business onboarding if ready, with Consumer Plus going live once enough Deep Review value exists.
- Sponsored access billing should come later, with manual/custom handling first.
- Build as a modular monolith first, not microservices from day one.
- Search should start simple, likely Postgres full-text search plus filters, then move to a dedicated search engine later if needed.
- AI should be behind an internal job system from day one.
- Audit logs should be immutable from day one.
- SSO should be technically supported at launch.
- Build production-ready from day one rather than using prototype shortcuts.

Recommended production-ready stack shape:

```txt
Frontend/App: Next.js or equivalent production web framework
Language: TypeScript preferred if using Next.js
Database: Supabase/Postgres
Auth: to be chosen by Codex, with MFA, SSO, organizations, and enterprise readiness
Payments: Stripe
File storage: secure object storage, likely Supabase Storage or S3-compatible
Search: Postgres first, dedicated search later if needed
Background jobs: internal job/queue system
AI: internal AI job service/module with model, prompt, input, output, cost, and review logging
Analytics: product analytics first, warehouse later
```

Source-of-truth principles:

- Postgres should be the source of truth for evidence, profiles, claims, scores, reports, permissions, entitlements, and audit logs.
- Analytics should not become the trust source of truth.
- Evidence must connect to claims/facts.
- Scores must be snapshots, not overwritten history.
- Payment data must remain separate from scoring/ranking logic.
- Permissions must be first-class.
- AI outputs should be draft/candidate records until accepted where review is required.
- Reports must cite snapshots/evidence and not create a separate truth layer.

Initial core table concepts:

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

Soon-after table concepts:

- disputes
- corrections
- audit_cases
- file_assets
- product_availability
- places_to_buy
- watchlists
- notifications

## 28. Strategic Gaps To Resolve Before Build

This section tracks items that are either missing, partially defined, or important enough to require explicit review before implementation.

### Mishava Gov

Status:

Included.

Current coverage:

- Dedicated planning document exists at `docs/mishava-gov-product-concept.md`.
- Master planning document includes Mishava Gov as a future institutional/public-sector surface.
- Gov is explicitly marked future / institutional / not ready for immediate implementation.

What to add later:

- Agency onboarding model
- Procurement policy setup workflow
- Public record visibility rules
- Procurement Trust Snapshot schema
- Gov-specific legal and public records review
- Agency pricing model after financial review

Review before build:

- Which agencies are the first target users?
- Is Gov a paid agency tool first, or a public transparency/reporting wedge first?
- Which procurement decisions are in scope: products, vendors, contracts, or all three?
- What public transparency should be optional versus required?

### Evidence Operations And Review Cost Model

Status:

Partially included. The audit/review workflow exists conceptually, but the cost model is not yet detailed enough for pro forma planning.

Why it matters:

Mishava's trust work has real operating cost. Evidence parsing, human review, field audits, disputes, and quality control must be priced in a way that keeps small organizations included while protecting margins.

What to add:

- Review type catalog
- Estimated minutes per review type
- AI processing cost assumptions
- Human review cost assumptions
- Field audit cost assumptions
- Quality-control sampling cost
- Dispute/correction handling cost
- Gross margin assumptions by service
- Break-even volumes by plan
- Small-business subsidy assumptions
- Sponsored-access cost recovery model

Possible review categories:

- Self-serve intake
- AI parse only
- AI parse plus light human review
- Identity/public-record check
- Document check
- Product/category review
- Company trust review
- Supply-chain review
- Field audit
- Enterprise audit
- Annual refresh
- Dispute/correction review

Build implications:

- Every service should have an internal operation type.
- Every operation type should track expected effort, actual effort, reviewer role, cost band, and margin band.
- The pricing system should know what is being sold, but the audit system should know what work was actually performed.

Review before build:

- What is the target gross margin for each review/audit service?
- Which services can be mostly AI-assisted?
- Which services always require human review?
- What percentage of small-business cases should be quality sampled?
- Which costs are absorbed by Mishava, paid by business, or paid by sponsor/funder?

### Dispute And Correction Process

Status:

Partially included. Disputes and appeals are described, but the workflow needs formal states, timelines, visibility rules, and correction language.

Why it matters:

Mishava will publish trust-impacting information. Businesses and organizations need a fair way to challenge errors, submit new evidence, and request corrections without being able to buy favorable outcomes.

What to add:

- Dispute states
- Correction request states
- Appeal/escalation path
- Required counter-evidence rules
- Public correction labels
- Business-visible status
- Internal reviewer separation
- Response timelines
- Frivolous or abusive dispute policy
- Snapshot replacement versus snapshot update rules

Possible dispute states:

- submitted
- evidence_requested
- under_review
- escalated
- upheld
- partially_upheld
- rejected
- corrected
- closed

Correction principles:

- Old snapshots should remain preserved.
- New evidence should create a new snapshot.
- Clear errors should be corrected visibly.
- Disputes should be shown carefully so they do not become reputational weapons.
- Payment must not affect dispute priority except where a paid service contract includes defined response times that do not alter outcome.

Build implications:

- Disputes need separate reviewer assignment.
- Original reviewer should not be the dispute reviewer.
- Dispute decisions must link to evidence and audit logs.
- Public profiles need a correction/history display model.

Review before build:

- What is the standard response time?
- When does a dispute pause public display?
- When does it add a public "under review" note?
- What is the appeal limit?
- What is the legal review trigger?

### Scoring Governance

Status:

Partially included. Scoring versions and snapshots are described, but governance over scoring changes needs more structure.

Why it matters:

Mishava's credibility depends on stable, explainable scoring. Changes to formulas, weights, caps, and evidence rules must not appear arbitrary or commercially influenced.

What to add:

- Scoring governance board or approval group
- Methodology owner
- Change proposal workflow
- Version approval workflow
- Public methodology changelog
- Backtesting requirement
- Bias/fairness review
- Category-specific scoring profile approval
- Cap/zero rule approval
- Emergency scoring patch process
- Sunset/deprecation rules for old scoring versions

Build implications:

- Scoring versions must be immutable after activation.
- Draft scoring versions should be testable before release.
- Score snapshots must record scoring version.
- Formula changes should not silently rewrite history.
- Admins should not edit live scoring rules without approval.

Review before build:

- Who owns scoring methodology?
- Who can approve a new scoring version?
- What must be public versus internal?
- How often can scoring versions change?
- Should external advisors review major methodology changes?

### Legal And Risk Framework

Status:

Partially included. Legal, consent, redaction, and retention are noted, but the risk framework needs more detail.

Why it matters:

Mishava will handle sensitive evidence, public claims, scoring, reports, and potentially adverse findings. Legal and risk design must be part of the product, not an afterthought.

What to add:

- Defamation and adverse-claim review
- Evidence publication consent
- Public records use policy
- Private document handling
- Document retention schedule
- Redaction standards
- Report licensing terms
- Press/media terms
- Data/API licensing
- Audit service terms
- No-guaranteed-outcome language
- Conflict-of-interest policy
- Bribery reporting policy
- Security incident response
- Jurisdiction-specific privacy requirements

Build implications:

- Evidence needs visibility and sensitivity metadata.
- Reports need terms and export logs.
- Raw documents should not be broadly visible.
- Legal holds and deletion rules need data model support.
- Public explanations should distinguish fact, evidence summary, and Mishava interpretation.

Review before build:

- What legal counsel must review before launch?
- Which evidence types can be summarized publicly?
- What adverse findings require legal review?
- How does Mishava handle public records versus submitted private documents?
- What is the document retention policy?

### Pricing Philosophy Across All Surfaces

Status:

Included, but should be elevated into a sharper doctrine.

Pricing philosophy:

Mishava pricing should make trust infrastructure accessible to small NGOs, local businesses, family-owned companies, suppliers, and sellers while charging more for deeper tools, hosting, verification, audit, dashboards, reporting, institutional access, and enterprise use.

Pricing should adjust by market income tier so organizations in different markets are not treated as if they have the same resources.

Payment buys process, tools, access, workflow capacity, hosting, reporting, and support. Payment never buys trust advantage.

What to add:

- Pricing doctrine by product surface
- Subsidy strategy
- Sponsored access doctrine
- Refund and cancellation philosophy
- Outcome-neutral audit/service terms
- Market tier governance
- Discount approval process
- Financial accessibility principles

Build implications:

- Pricing records must be configurable.
- Entitlements must be separate from ranking.
- Sponsored access must track who pays and who participates.
- Billing and trust outcomes must remain firewalled.

Review before build:

- What gets subsidized?
- What must remain free?
- What is the minimum viable paid NGO/business path?
- How do discounts get approved?
- What happens when a customer pays for an audit and receives an unfavorable result?

### User-Specific Design Map

Status:

Missing/partial. Product surfaces are named, but user-specific journeys are not fully mapped.

Why it matters:

Mishava serves many user types. Each needs a clear first job, first screen, trust explanation, permission model, and upgrade path.

User maps to add:

- Consumer
- Consumer Plus subscriber
- Business owner
- Supplier
- Seller
- Local business
- NGO
- Sponsor/foundation/network admin
- Press/media user
- Researcher/academic user
- Corporate/procurement user
- Gov agency user
- Mishava employee
- Field auditor
- Evidence reviewer
- Dispute reviewer
- Admin/governance user

For each user map, define:

- Primary goal
- First screen
- Core workflow
- Trust information they need
- What they can edit
- What they can view
- What they can purchase
- What they can never influence
- Upgrade path
- Success metric

Build implications:

- Navigation should be role-aware.
- Dashboards should not be generic.
- Permissions and entitlements must support multi-role users.
- Public, business-visible, internal, and restricted views need different UX.

Review before build:

- Which users launch first?
- Which users can be combined under one portal?
- What is the first useful workflow for each launch user?
- How do we avoid overwhelming early users with the full long-term architecture?

### Trust Explanation UX

Status:

Partially included. Score context, evidence coverage, and "why this appears" are noted, but the UX system needs full design rules.

Why it matters:

Mishava's core value is not just scoring. It is explaining trust clearly enough that people can make decisions without being manipulated.

What to add:

- Score explanation component
- Evidence coverage component
- Recency/confidence labels
- "Why this appears" pattern
- "What has been checked" pattern
- "What is missing" pattern
- Source summary pattern
- Snapshot history view
- Dispute/correction notice pattern
- Lightweight evidence explanation for small businesses
- Procurement exception explanation pattern for Gov
- Report methodology box

UX rules:

- Never show a naked score.
- Always show score quality.
- Do not use vague "trusted," "best," "premium," or "preferred" labels.
- Do not make lightweight evidence look illegitimate.
- Explain negative evidence without sensational language.
- Explain corrections without hiding history.
- Show payment firewall language where relevant.

Build implications:

- Trust explanation should be a reusable design system, not one-off copy.
- Every score display should pull from structured explanation data.
- Ranking cards need "why this appears."
- Reports need methodology and snapshot context.

Review before build:

- What is the public explanation standard?
- How much evidence detail appears in free versus paid views?
- How should disputed findings appear?
- What language is too strong legally or too vague ethically?

### Go-To-Market Path By Surface

Status:

Missing.

Why it matters:

Mishava has many possible surfaces. The company needs a sequence that creates trust, revenue, data, and credibility without spreading too thin.

Recommended GTM frame:

1. NGO as mission-aligned early surface
2. Shopping as consumer trust/discovery surface
3. Local as small-business fairness wedge
4. Business as participation/evidence tooling
5. Reports/Insights as transparency and revenue layer
6. Corporate/Gov as later institutional expansion
7. Plus after consumer demand is proven

For each surface, define:

- Target early adopter
- Problem solved
- First paid product
- Trust data required
- Operational burden
- Sales motion
- Time to revenue
- Dependencies
- Proof point needed before scaling

Build implications:

- Do not build every product surface equally at launch.
- Shared trust engine should be built early.
- Screens should prioritize surfaces that prove trust and revenue fastest.
- Later surfaces should be documented but not overbuilt.

Review before build:

- What is Mishava's first wedge: NGO, Shopping, Local, or Business?
- Which surface produces the first credible data?
- Which surface produces the first revenue?
- Which surface creates the strongest trust story for investors/funders?

### Success Metrics Tied To The Pro Forma

Status:

Missing.

Why it matters:

The pro forma should not only estimate revenue. It should be tied to product behavior, operating cost, trust quality, and adoption.

Metrics to add by revenue line:

- NGO subscription conversion
- NGO setup attach rate
- Supplier/seller profile conversion
- Hosted page attach rate
- Catalog attach rate
- Network tool attach rate
- Evidence setup purchase rate
- Verification purchase rate
- Audit service gross margin
- Business dashboard conversion
- Local business conversion
- Shopping active users
- Outbound click rate
- Purchase conversion rate
- Consumer Deep Review conversion
- Sponsored participant count
- Corporate/institutional pipeline
- Plus conversion
- Data/API access conversion
- Reports purchase rate
- Media/research access conversion
- Insights report purchase rate

Trust quality metrics:

- Evidence coverage by category
- Recency distribution
- Percentage of profiles with verified/public-record status
- Dispute rate
- Correction rate
- Average review time
- Human review trigger rate
- AI extraction confidence distribution
- Quality-control fail rate
- Payment firewall test coverage

Operational metrics:

- Cost per evidence review
- Cost per small-business verification
- Cost per audit type
- Reviewer throughput
- Field audit completion time
- Dispute handling cost
- Gross margin by service line

Build implications:

- Event tracking must be planned early.
- Revenue reporting needs product-surface attribution.
- Evidence operations need time/cost tracking.
- Dashboards should separate growth, trust quality, and operations.

Review before build:

- What are the 12-month target metrics?
- Which metrics are required for investor/funder review?
- What are minimum trust-quality thresholds?
- Which pro forma assumptions need product instrumentation?

## 29. Additional Missing Planning Areas

The following areas were not fully discussed yet but should be reviewed before a full build.

### Data Architecture And Source Of Truth

Need to define:

- Which objects are canonical
- How evidence links to facts, claims, products, businesses, and reports
- Whether products inherit business trust scores
- Snapshot immutability rules
- Data warehouse/analytics path for Insights

### Security Architecture

Need to define:

- MFA requirements
- Role-based access control
- Attribute-based access control for sensitive evidence
- Session security
- Employee access reviews
- Security logging
- Incident response
- External auditor access controls

### AI Governance

Need to define:

- Which AI outputs require human confirmation
- Model/version tracking
- Prompt/version logging
- AI confidence thresholds
- Bias/error review
- AI hallucination safeguards
- Human override requirements

### Taxonomy Governance

Need to define:

- Category taxonomy
- Product taxonomy
- Claim taxonomy
- Evidence type taxonomy
- SDG-to-indicator taxonomy
- Country/market tier governance

### Internationalization And Market Localization

Need to define:

- Launch countries
- Language priorities
- Currency rules
- Market income tier assignment
- Local evidence source differences
- Region-specific legal/privacy requirements

### Data Import And Existing Evidence Migration

Need to define:

- Whether old Mishava data is imported
- What old data is reference-only
- How legacy scoring maps to V2.0
- What must be re-reviewed before public use

### Public Methodology And Communications

Need to define:

- Public methodology pages
- Plain-language trust glossary
- Payment firewall statement
- No-commission shopping disclosure
- Correction/dispute communications
- Public launch messaging

### Customer Support And Operations

Need to define:

- Support tiers
- Evidence setup support workflow
- Business onboarding help
- NGO onboarding help
- Press/research support
- Audit scheduling support
- Escalation policies

### Financial Controls And Revenue Recognition

Need to define:

- How setup/audit revenue is recognized
- How subscriptions are recognized
- Refund rules
- Sponsored access billing
- Multi-party billing
- Custom contract handling

### Ethical Review Framework

Need to define:

- What Mishava will not score
- How to avoid political misuse
- How to handle contested public claims
- How to prevent reports from becoming attack tools
- How to protect small businesses from unfair reputational harm

### Remaining Pre-Launch Governance And Commercial Review

Need to define before public launch or sensitive paid workflows:

- Launch gates
- Support/operations playbooks
- Refund/outcome-neutral paid service rules
- Source licensing/data rights
- Gov public-record boundaries
- High-risk category policy
- AI vendor/data-sharing policy
- Reviewer training/certification
- Abuse/manipulation prevention
- Methodology testing/backtesting
- Investor/funder narrative
- Competitive landscape

These areas are expanded in `docs/mishava-v2-milestone-1-build-backlog.md`.

## 30. Decisions From 10-Area Planning Review

This section records planning decisions made after the strategic gap list. These decisions should guide the next planning pass, but they do not replace detailed implementation specifications.

### 1. Evidence Operations Cost Model

Decisions:

- Cost posture should be mixed: accessible for small businesses and NGOs, with higher-margin pricing for larger organizations, enterprise users, and complex audits.
- Small-business review should use AI parse plus light human sampling, with human review when flagged.
- Low-risk small-business quality sampling should start at 10%.
- Human review is required for low AI confidence, negative evidence, serious allegations, disputes/corrections, material score decreases, material score increases based on weak evidence, enterprise audits, field audits, high-risk categories, reviewer overrides, staff conflicts, and random quality-control sampling.
- AI posture should be balanced: AI can complete low-risk workflows with sampling, but must be logged and reviewable.
- Field audits should be common for certain categories, partner/contractor-supported, and later-stage for broad rollout.
- Staffing should be hybrid: founder/manual review, small trained review team, contractors, and specialists.
- Review/audit service margins should use the working model: small-business setup/review 30-50%, standard verification 50-65%, audit/review services 55-75%, enterprise/custom 65-80%, sponsored access dependent on funder structure.
- Small-business affordability should be supported by enterprise pricing, foundation/network sponsorships, and lower margins on small businesses.
- Evidence operations planning should include a conceptual model, estimated cost table, and pro forma-ready assumptions.

First-pass cost assumptions:

```txt
AI cost includes OCR, extraction, summarization, classification, and report/product drafting where relevant.
Human review blended internal cost assumption: $35-$60/hour depending on role.
Specialist/senior review assumption: $75-$150/hour.
Field audit cost excludes travel unless noted.
Target margin is directional and should be refined in pro forma planning.
```

First-pass evidence operations cost table:

| Operation | Typical Human Time | AI Use | Internal Cost Range | Suggested Customer Price | Target Margin | Notes |
|---|---:|---|---:|---:|---:|---|
| Self-serve intake | 0-5 min | Very low | $0-$3 | Free | n/a | Form validation, limited upload, no heavy AI. |
| Free NGO/basic profile report | 0-10 min | Very low | $0-$5 | Free | n/a | Premade reports only, manual data entry, limited photo uploads. |
| AI Parse + Basic Profile Draft | 5-10 min sampled | Medium | $4-$12 | $29 high-income | 55-80% | Paid one-time service; discount by market tier. |
| Assisted Setup | 20-40 min | Low/medium | $18-$45 | $99 high-income | 55-75% | Light human help plus limited AI. |
| Guided Evidence Setup | 60-120 min | Medium | $60-$150 | $249 high-income | 40-70% | More hands-on, market-adjusted. |
| Full Trust Profile Buildout | 3-6 hrs | Medium/high | $180-$500 | $499+ | 25-65% | Should be higher for complex orgs. |
| Identity/Public Record Check | 10-20 min | Low/medium | $8-$25 | $25-$99 small/local | 40-75% | Official records, licenses, registrations. |
| Document Check | 20-45 min | Medium | $20-$65 | $99-$299 small/local | 50-80% | Use AI extraction, human confirmation where needed. |
| Small Business Trust Review | 30-90 min | Medium/high | $35-$125 | $99-$299 | 30-70% | Keep accessible; may be sponsor-subsidized. |
| Product/Category Review | 45-120 min | High | $60-$220 | $250-$750 small/local | 45-75% | Product claims, sourcing, safety, category rules. |
| Company Trust Review | 3-10 hrs | High | $250-$1,200 | $500-$1,500 small/local; higher mid/large | 30-75% | Price must scale with complexity. |
| Supply Chain Review | 6-40+ hrs | High | $700-$6,000+ | $750-$2,500 small/local; $5k-$25k+ larger | variable | Must scope carefully before quoting. |
| Annual Verification Refresh | 15-90 min | Medium | $20-$150 | $25-$199 small/local | 20-70% | Depends on changes since last review. |
| Dispute/Correction Review | 30 min-6 hrs | Medium | $35-$600+ | Free for simple correction; charged if audit-like | variable | Corrections free; repeated unsupported or complex audit-like reviews may cost. |
| Field Audit | 4-20+ hrs | Medium | $400-$3,000+ before travel | Custom / premium | 40-70% | Separate field auditor and reviewer required. |
| Enterprise Audit Program | 40-300+ hrs | High | $5k-$50k+ | $50k+ | 50-80% | Needs custom scoping. |
| NGO Report Rebuild | 30-180 min | High | $25-$250 | Included paid tier or $99-$499 | 50-85% | Free tier should not include heavy AI rebuilds. |
| AI Product Catalog Creation | 15-120 min | High | $10-$150 | Add-on or included paid catalog tier | 60-90% | Scope by product count. |
| Media/Research Report Package | 2-20 hrs | High | $200-$3,000+ | $499-$2,500+ | variable | Approved access only. |
| Insights Report | 1-10 hrs | High/analytics | $100-$1,500+ | $199-$5,000+ | 50-85% | Requires enough data and privacy thresholds. |

AI cost control rules:

- Free tiers should use only low-cost AI: basic upload classification, light OCR preview, simple form guidance, limited image/photo count, and manual entry preferred.
- Free tiers should not include full report rebuild, large catalog generation, or heavy evidence extraction.
- Paid setup can use more AI because service pricing covers AI parse, profile draft, claim extraction, evidence organization, and missing evidence suggestions.
- Paid reports can use AI for drafting/rebuilding when tied to a paid NGO tier, one-time report rebuild fee, sponsored access, or funder-paid package.
- Catalog creation AI should be charged by product count or included within catalog tiers.
- Audit/review AI extraction cost should be included in verification/audit pricing.

Internal AI cost monitoring should track:

- AI cost per organization
- AI cost per document
- AI cost per report
- AI cost per product
- AI cost per audit case
- AI cost per plan/tier
- AI cost per product surface

Suggested AI entitlement limits:

| Tier/Surface | AI Usage |
|---|---|
| Free NGO | Very limited: simple guidance, limited photo uploads, no report rebuild. |
| NGO Grassroots | Light report assistance, limited AI summaries. |
| NGO Growth | Report drafting/rebuild credits and evidence organization. |
| NGO Trust Pro | More report credits, evidence appendices, funder reporting. |
| Free Public Business Record | No meaningful AI beyond system-side public record matching. |
| Minimum Supplier/Seller | Limited evidence intake AI. |
| Hosted Profile | Basic profile copy/evidence organization. |
| Catalog Starter | AI help up to product limit or small batch. |
| Business Growth/Pro | More evidence parsing, reports, catalog tools. |
| Sponsored Access | Sponsor-funded credits. |
| Enterprise | Custom usage/pricing. |

Pro forma recommendation:

Model AI as cost of goods sold for:

- AI Parse + Basic Profile Draft
- Assisted Setup
- Guided Evidence Setup
- Full Trust Profile Buildout
- Document Check
- Verification
- Audit/Review Services
- NGO Report Rebuild
- Product Catalog Creation
- Reports
- Insights

Do not model heavy AI cost into free profiles except small onboarding allowances. Free should be useful, but not expensive to operate.

### 2. Disputes And Corrections

Decisions:

- All evidence is kept, even when counter-evidence changes the outcome.
- Anyone can flag an issue, but only authorized parties can formally dispute.
- Public profiles should show "under review" only for serious/material disputes.
- Public display may pause or soften only for identity mismatch, evidence assigned to the wrong company, exposed private/sensitive information, or plausible serious factual error.
- Appeal model should include initial dispute, one appeal, and senior/legal escalation.
- Full correction history should be visible for transparency, including when Mishava made the error.
- Dispute timelines should use the recommended model: simple correction 3-5 business days, standard dispute 10-15 business days, complex dispute around 30 business days, legal/escalated disputes custom.
- Disputes require evidence unless they involve Mishava typo/clerical error.
- Legal/senior review triggers include fraud allegation, criminal allegation, forced labor, child labor, wage theft, union retaliation, discrimination, unsafe working conditions, corruption/bribery, defamation threat, identity mismatch, private document exposure, regulator/court involvement, public safety risk, major environmental harm, high-profile company, and government procurement context.
- Businesses may publish a response after moderation/review.
- Corrections should be free. Repeated unsupported/abusive disputes may have limits or fees.

### 3. Scoring Governance

Decisions:

- Scoring methodology should be owned by Founder + advisory group now, then an internal scoring lead and governance committee later.
- Scoring version approval starts with Founder, then moves to Founder + legal/risk + scoring reviewer, and eventually governance committee approval.
- All scoring methodology changes should be publicly logged, including what changed, why it changed, and the version/date marker.
- Preferred version naming style: `Mishava_Scoring_V2.01_2026.24.05`.
- Scoring versions should use scheduled releases, with emergency fixes allowed.
- External advisors should be involved later when Mishava has traction and for major scoring changes.
- Category-specific scoring profiles are allowed only through approved scoring profiles.
- Category-specific scoring differences should be noted in reporting, not on the consumer buying page.
- Cap/zero rules should require scoring owner + legal/risk approval early, then governance committee approval later.
- Emergency scoring changes are allowed with public/internal documentation.
- Historical scores should be preserved through old snapshots, with optional new comparison snapshots.
- Anyone can suggest scoring changes, but only governance can approve.

Important note:

The previously listed cap/zero examples are not approved scoring rules. They are a proposed topic for later complete scoring-system review.

### 4. User-Specific Design Map

Decisions:

- Consumers should get a shopping experience as smooth and familiar as a major retail site, while Mishava's trust layer remains evidence-forward and non-advertising-driven.
- Consumers can browse and shop through Mishava without an account.
- Consumers who have not signed up or completed the preference questionnaire should not see personalized belief-based product scores.
- A popup should explain that signing up/completing preferences allows Mishava to score or order products according to the user's beliefs/preferences.
- Non-signed-in users may still see general evidence context, such as evidence coverage, verification status, public record status, recency, and general evidence profile where available.
- Users should be able to retake the preference questionnaire.
- Mishava should occasionally ask additional questions to tighten preference understanding over time. Timing and triggers require later discussion.
- Business and NGO should use separate portals.
- Supplier/seller should be both an account type and a participation mode.
- Local business should be both a local discovery surface and a business subtype.
- Press/media should have approved paid access plus custom report requests.
- Sponsors/foundations may see individual progress with participant consent, and details depend on sponsorship agreement. Raw evidence should not be exposed by default.
- Mishava staff first screen should be a role-specific queue.
- Admin first screen should depend on admin type.
- Gov/Corporate should have planning-only user journeys for now.

### 4A. Shopping Trust Explanation UX

Decisions:

- Mishava Shopping should feel seamless and familiar, closer to Google Shopping search ability with Target/Amazon-style product browsing ease.
- Mishava is not the store. Mishava is the shopping score and trust layer that connects users to external sellers, hosted business pages, product pages, retailers, local businesses, suppliers, or brand sites.
- Mishava is not and will not be commission-based.
- Shopping revenue should not come from affiliate/referral commissions.
- Product cards should feel like familiar shopping cards and may include product image, product name, seller/provider, price if available, availability/shipping/location, external destination, and a score badge.
- The shopping page does not need to show full score detail.
- Score details should open in a pop-up/modal when the user clicks the score badge.

Score names:

- Users without Shopping Priorities completed should see **Evidence Score**.
- Users with Shopping Priorities completed should see **Your Values Score**.

Meaning:

```txt
Evidence Score = what the available evidence shows.
Your Values Score = how well this product/business matches the user's Shopping Priorities, based on Mishava evidence.
```

When Shopping Priorities are completed, the score pop-up should show both:

```txt
Your Values Score: 87
Based on your Shopping Priorities.

Evidence Score: 82
What the available evidence shows.
```

When Shopping Priorities are not completed, the score pop-up may show:

```txt
Evidence Score: 82
What the available evidence shows.

Create Shopping Priorities to see Your Values Score.
```

Score pop-up should include, where available:

- Your Values Score
- Evidence Score
- Coverage
- Recency
- Verification status
- Confidence
- Why this score
- What has been checked
- What is missing
- Restoration/correction notes, if any
- Payment firewall note

Payment firewall note for pop-up:

```txt
Payment does not affect this score, ranking, or verification.
```

User-facing sort language:

- Avoid the word "relevance" because users may confuse it with trust/scoring.
- Use **Best Search Match** instead.

Suggested sort options before Shopping Priorities:

- Best Search Match
- Evidence Score
- Price: Low to High
- Price: High to Low
- Customer Rating
- Distance / Local
- Availability
- Newest

Suggested sort options after Shopping Priorities:

- Best Search Match
- Your Values Score
- Evidence Score
- Price: Low to High
- Price: High to Low
- Customer Rating
- Distance / Local
- Availability
- Newest

Best Search Match means how closely the product/business matches the user's search words, category, and filters. It should be clearly separate from Evidence Score and Your Values Score.

Red-line / personal zero result handling:

- Red-line rules should use Off / Warn me / Hide.
- Hidden results should not be mixed into normal results by default.
- The UI should show a hidden-results count or equivalent notice.
- Users should have the option to view hidden results.
- If viewed, hidden/red-line results should appear at the bottom or in a clearly separated view with a warning.

Example:

```txt
3 results hidden by your Shopping Priorities.
View hidden results
```

The default shopping experience should remain smooth and familiar while keeping deeper trust explanations one click away.

### 4A.1 Internet-Wide Shopping And Product Data Strategy

Decisions:

- Mishava Shopping should feel like Google Shopping search ability with Target/Amazon-style browsing ease, while remaining a trust score and connection layer rather than a store.
- Mishava is not the shopping location.
- Mishava is not commission-based.
- Mishava should index and connect users to shopping options, not manipulate or own the transaction by default.
- Mishava should not sell placement, boost paid sellers, hide unpaid sellers, or use commission/payment status in ranking.

Staged product data approach:

1. **Curated seed data**
   - Start with diapers and baby wipes first, then expand into toys and adjacent children's products.
   - Use controlled seed records, public product pages, brand websites, retailer pages, business-submitted catalogs, and local store-submitted products.

2. **Business/seller submitted catalogs**
   - Businesses can add products, prices, availability, external links, pickup/delivery options, local service area, photos, descriptions, and product evidence.
   - AI can help build catalogs from photos, spreadsheets, PDFs, websites, existing product lists, and later POS/export files.

3. **Public web product discovery**
   - Mishava can discover products from public web pages, structured data, indexed product information, Schema.org Product markup, retailer/brand/local store pages, business websites, sitemaps, and public product feeds where allowed.
   - This requires legal/technical review.

4. **Approved product feeds and APIs**
   - Later expansion may include merchant feeds, retailer feeds, inventory APIs, local POS integrations, Shopify/WooCommerce integrations, and other permitted product feed sources.

Product page model:

```txt
User searches product/category
-> Mishava shows products
-> user opens product page
-> page shows product, brand/business, Evidence Score or Your Values Score
-> page shows product-specific evidence and brand/business/seller context
-> page lists places to buy, including local stores and external sellers
```

Places-to-buy ranking may use:

- Best Search Match
- Your Values Score / Evidence Score
- Price
- Distance/local fit
- Availability
- Shipping speed
- Seller verification
- Evidence coverage
- User local preference

Places-to-buy ranking must not use:

- Commission
- Payment status
- Sponsored placement
- Paid boost

Local store pull-in:

- Mishava should be able to notify businesses that people are searching for or viewing products they may sell.
- This creates a pull-in path for businesses to claim their free public record, update product availability, add evidence, and show local pickup/delivery options.
- Outreach should be factual and useful, not spammy or manipulative.

Example:

```txt
People are searching for products you may sell on Mishava.
Claim your free public business record to update product availability, add evidence, and show local pickup or delivery options.
```

Local availability states:

- Confirmed in stock
- Reported by business
- Likely sold here
- Call/check before visiting
- Out of stock
- Unknown

For unclaimed businesses, Mishava should use cautious labels:

- May carry this product
- Check with store

For claimed businesses, Mishava may show:

- In stock
- Pickup available
- Local delivery available
- Same-day delivery
- Next-day delivery
- Ships locally

Product data confidence:

- Confirmed by business
- Confirmed by public product page
- AI-inferred from website
- User-submitted
- Unknown/stale

Product data should include freshness labels, timestamps, and source references where possible.

Users should be able to report incorrect product, price, availability, or local listing information.

Claimed/transparent companies:

- Claiming a profile must not create a ranking boost.
- Transparency can improve data confidence, evidence coverage, availability confidence, and user understanding.
- Companies with truthful, current, transparent data may have an earned advantage because users can see better evidence and confidence, not because the company paid or claimed the profile.
- The UI should explain this distinction clearly.

Suggested user-facing explanation:

```txt
Claimed and transparent profiles may show fresher product and availability information. Claiming does not improve ranking or score; evidence and accuracy do.
```

Checkout:

- Mishava should not process checkout early.
- Later checkout or local transaction support may be considered only if it does not create marketplace incentives or paid ranking pressure.
- If checkout is ever explored, it should be designed around local-store empowerment, transparent fees, and worker-respecting delivery/fulfillment.

### 4B. Local Buyer Discovery

Decisions:

- Local should mean the user can set a radius for how far they are willing to travel to buy something, or how local they want a product/service to be made, sold, sourced, or fulfilled.
- Local discovery should be based on a shipping address, entered location, or location identifier such as ZIP code in the United States.
- Local should function as both a dedicated discovery surface and a shopping filter.

Possible access patterns:

```txt
/local
Shopping -> Local near me
Shopping -> Made near me
Shopping -> Available near me
```

Users should eventually be able to search:

- Products
- Businesses
- Services
- Restaurants or food businesses where relevant
- Suppliers
- Local makers
- Local sellers
- NGOs or community organizations where relevant

Launch/proof-of-concept should focus on a small number of products or categories first, then expand.

Local result cards should show, where available:

- Product/business/service name
- Business or provider
- Price if available
- Distance or service area
- Pickup/delivery/shipping availability
- External link or Mishava-hosted page
- Evidence Score or Your Values Score depending on user state
- Evidence coverage
- Verification status
- Local, small-business, family-owned, or independent indicators where evidenced

Scores:

- Users without Shopping Priorities see Evidence Score.
- Users with Shopping Priorities see Your Values Score.
- Score details open in the same score pop-up pattern used across Shopping.

Favoritism guardrails:

- No chamber-of-commerce dependency.
- No paid local boost.
- No featured local placement based on payment.
- No paid visibility advantage.
- Local ranking should use search match, distance/local fit, availability, evidence quality, score, verification, recency, and user priorities when available.

Local business evidence pathway may include:

- Business registration
- Local license
- Seller permit
- Professional license where relevant
- Website/social profile
- Storefront/workspace/product photos
- Owner attestation
- Supplier/customer references
- Redacted invoices or sourcing proof
- Public records
- Optional EIN confirmation letter where appropriate

Local stores need a way to list products they sell so consumers can find them through Mishava.

This should become part of small/local business packaging:

- Product listing tools
- Hosted product catalog option
- External product links where available
- Basic availability status
- Pickup/delivery/shipping fields
- AI-assisted product setup
- AI-assisted catalog creation from photos, documents, spreadsheets, websites, or store-provided lists

AI-assisted catalog support should help small local store owners build and add products without requiring enterprise e-commerce infrastructure.

Important guardrail:

AI may draft product listings, categories, descriptions, and evidence fields, but business owners should review/approve published product information.

Privacy and safety:

- Support service-area-only listings for home-based or sensitive businesses.
- Allow businesses to hide exact address where appropriate.
- Show pickup/delivery/service area clearly.
- Do not force sole proprietors or home-based businesses to expose private addresses.

### 4C. Product And Category Taxonomy

Decisions:

- The first taxonomy should be broad and simple, then deepen over time as Mishava gains evidence, search behavior, and product coverage.
- The proof-of-concept categories should include both baby items and toys.
- Initial POC may include diapers, baby wipes, baby care products, toys, and adjacent children's products.
- Baby/children's products should be treated as higher-risk by default because safety, materials, sourcing, product claims, and trust matter strongly for parents/caregivers.
- Automotive and complicated-build products should be treated as high-risk or complex categories because they often include many components, suppliers, safety concerns, environmental issues, and traceability challenges.

High-risk/complex category examples:

- Automotive
- Electronics
- Appliances
- Furniture
- Children's products
- Food and supplements
- Cosmetics/personal care
- Medical/health products
- Construction materials
- Textiles/apparel
- Batteries
- Cleaning chemicals
- Industrial equipment

Products, businesses, and services:

- Products should be handled in relation to the business/brand/seller that offers them.
- A product can have product-specific evidence and score context, while also showing the business/brand/seller score context.
- Services should be discoverable through the same category/search system as products and businesses.
- A business can belong to multiple categories. Example: a barber shop may be a local service provider and also sell hair products.

Product shopping flow:

```txt
User searches product/category
-> Mishava shows product options
-> user opens product/brand page
-> page shows Evidence Score or Your Values Score
-> page shows product-specific evidence and business/seller context
-> page lists places to buy, including local stores and external sellers
```

Places-to-buy should eventually show:

- Local stores the user can visit
- Local stores that can deliver
- Local stores that can ship same day or next day
- External sellers/retailers
- Mishava-hosted seller pages
- Evidence Score or Your Values Score for seller/store where available
- Availability, pickup, delivery, or shipping options

Long-term local fulfillment goal:

- Give local stores the opportunity to offer delivery themselves.
- Help local stores bypass large marketplaces taking the relationship and margin.
- Eventually support discovery of local delivery companies/people.
- Long-term delivery matching should avoid exploitative gig-economy dynamics.
- Delivery should be treated as local commerce infrastructure, not a way to take advantage of workers.

Local categories:

- Local categories should work like other categories.
- Local preference is based on whether a user prefers products/services made, sold, sourced, fulfilled, or available nearby.
- Local preference can reflect environmental reasons, community care, and local economic support.
- Local affects Your Values Score and local fit, not the base Evidence Score.

Category-to-SDG meaning:

- Categories help Mishava determine which SDGs are most applicable, which evidence should be requested, which missing evidence matters, which recency thresholds apply, and which risks require review.
- This mapping is primarily internal and report-facing, not something that should clutter normal shopping pages.

Examples:

```txt
Diapers:
SDG 3 health/safety
SDG 6 water/sanitation
SDG 8 labor
SDG 12 responsible production
SDG 13 climate
SDG 15 land/material sourcing

Software:
SDG 8 labor
SDG 9 technology/data ethics
SDG 10 accessibility/inclusion
SDG 13 data center energy
SDG 16 governance/privacy

Barber shop:
SDG 1 wages
SDG 3 health/safety
SDG 5/10 fair treatment
SDG 8 decent work
SDG 11 local community
SDG 12 product/waste practices
```

Evidence burden by category:

- Categories affect what evidence is reasonable and necessary.
- Harm standards stay firm.
- Evidence burden changes by category, risk, company size, and market context.

Example:

```txt
Local barber shop:
lightweight pathway: license, photos, owner attestation, product list, health/sanitation practices, local registration

Automotive manufacturer:
enterprise pathway: supplier traceability, safety certifications, emissions/materials evidence, labor practices, regulatory history, component sourcing
```

Supplier/seller category selection:

- AI should help suppliers/sellers choose categories through normal search-engine-like and product-detection patterns.
- A business/seller can add or change categories.
- AI should suggest primary and secondary categories based on name, website, product/service descriptions, photos, spreadsheets, product feeds, or uploaded lists.
- AI-suggested categories should not require business approval before publishing when Mishava is using public or indexed product discovery to build depth.
- Businesses should later be notified that people are looking at their products on Mishava, creating a pull-in path for them to claim, improve, and manage their profiles/products.
- Once a business claims its profile, it should be able to review, add, correct, or remove product/category details subject to Mishava's evidence and correction rules.
- Mishava may override misleading categories with an audit trail.

Category governance:

- AI can suggest categories.
- Businesses can edit categories.
- Mishava can correct misleading categories.
- All Mishava overrides should be logged.
- Material category corrections should preserve history where relevant.

Potential category data model concept:

```ts
type Category = {
  id: string;
  name: string;
  parent_category_id?: string;
  type: "product" | "service" | "business" | "ngo" | "supplier" | "seller" | "local";
  risk_level: "low" | "medium" | "high" | "complex";
  applicable_sdgs: string[];
  required_evidence: string[];
  optional_evidence: string[];
  recency_thresholds: Record<string, unknown>;
  local_relevance: boolean;
};
```

### 5. Go-To-Market By Surface

Decisions:

- First public surface should be a combined trust platform homepage.
- First serious revenue targets should be NGO subscriptions/setup and business profiles/setup.
- First meaningful trust-data surfaces should be NGOs and local businesses.
- Local buyer discovery needs dedicated discussion: users should be able to look up local businesses to buy from if desired.
- Shopping should launch with curated categories first.
- NGO launch should include profile creation, evidence setup, and sponsored network pilots.
- Local should launch city-by-city.
- Mishava should avoid chamber of commerce dependency because of concern that chambers may hide or protect bad actors.
- Business should launch with free public records and claim flow.
- Reports should launch soon after enough evidence exists.
- Insights should launch after preference/shopping data exists and after paid reports.
- Corporate/Gov should remain private planning only and be built after proof of the trust engine.

### 6. Success Metrics Tied To Pro Forma

Decisions:

- Early success is trust first, specifically evidence quality, then balanced revenue and adoption.
- Pro forma should include 12-month and 36-month views.
- NGO metrics should prioritize evidence completeness, with paid Growth conversion and sponsored network participants as upside.
- NGOs need funder reporting.
- NGOs should be able to create custom reports.
- AI should help NGOs rebuild or create reports, including scanning/importing existing reports and turning them into structured Mishava-ready reports.
- Business metrics should prioritize claimed profiles and evidence completion first, while still tracking paid profile, hosted page, catalog, verification, and setup conversion.
- Local metrics should include profiles created, local searches, outbound clicks/inquiries, local evidence coverage, and city-by-city activation.
- Shopping metrics should include monthly active users, outbound click rate, and preference questionnaire completion.
- Trust-quality thresholds should be required before launching paid reports, especially category-by-category.
- Operational metrics should include review cost, reviewer minutes, AI cost, dispute handling time, backlog, and audit margin.
- Investor/funder reporting must include mission/trust metrics alongside revenue.
- North star metric: evidence-backed decisions across surfaces.

Suggested north-star definition:

```txt
Evidence-backed decisions =
searches, purchases, inquiries, reports, procurement reviews, supplier matches,
donations, or funding decisions where Mishava evidence was viewed or used.
```

### 6A. NGO Report Builder And Scoped Sharing

Decisions:

- NGOs need reporting as a core product need, especially for funders, donors, sponsors, grantmakers, and internal governance.
- NGO reporting should include premade report templates and the ability for NGOs to create their own report types or modify Mishava-provided templates.

Initial report types should include:

- Funder report
- Donor report
- Annual impact report
- Grant progress report
- Program report
- Evidence/trust profile report
- Board/internal governance report
- Public-facing summary report
- Custom NGO-created report

Report visibility should be controlled by the NGO.

Possible visibility options:

- Private/internal only
- Manager approval required
- Shared with selected funder/donor
- Shared with selected sponsor/network
- Public summary
- Public full report
- Time-limited shared access
- Revoked access

NGOs should be able to decide what report recipients can see and when they can see it.

Scoped access needs:

- Share data with funders/donors without granting full account access.
- Select specific reports, evidence summaries, dashboards, or metrics to share.
- Set access windows or expiration dates.
- Revoke access.
- Track who viewed or exported shared reports.
- Avoid exposing raw sensitive documents unless explicitly permitted.
- Support recipient-specific views so a funder can see the report intended for them, not the NGO's full workspace.

Supported import inputs should eventually include:

- PDF
- Word
- Pages
- Images/scans
- Spreadsheets
- Google Docs later
- Existing reports
- Notes or manually entered text
- Photos or field documentation

Supported exports should eventually include:

- PDF
- Word
- Excel
- Web page
- Share link
- Spreadsheet appendix
- Evidence appendix

AI-assisted report capabilities may include:

- Rebuild formatting from imported reports
- Extract facts from uploaded files
- Summarize source material
- Turn notes into report sections
- Suggest missing evidence
- Create charts/tables
- Map claims to Mishava evidence
- Draft report language
- Build evidence appendices
- Help convert scanned/imported reports into editable Mishava reports

Approval workflow:

- Information pulled by AI or input by someone else should support manager approval before the report is approved/published.
- NGOs should be able to configure approval protocols based on their needs.
- AI-generated or AI-assisted content must be reviewable before publication.
- Trust claims in reports must trace back to evidence, snapshots, or approved NGO-submitted findings.

Free NGO tier:

- Limited premade reports
- Limited photo uploads
- Manual data entry
- Very limited AI usage
- Basic evidence/profile reporting

Paid NGO tiers:

- More report templates
- Custom report builder
- More uploads
- AI-assisted report rebuilding
- AI-assisted drafting/summarization
- Export options
- Scoped funder/donor sharing
- Approval workflows
- Evidence appendices
- Report history
- More team access depending on plan

Important guardrails:

- AI may help draft and rebuild reports, but it should not invent facts.
- NGO-submitted findings require NGO approval before Mishava relies on or publishes them.
- Reports can include custom edited text, but trust claims must trace back to evidence or approved sources.
- Sharing a report should not automatically expose the NGO's full account, raw evidence, or internal notes.

### 6B. Reports, Media, And Public Transparency

Decisions:

- Reports monetize transparency and research access, not ranking, credibility, or influence.
- Reports must never change score, ranking, verification status, audit outcome, evidence interpretation, or public credibility labels.
- Consumer Deep Review should be available from launch as a reason for buyers to subscribe, similar to the recurring value people expect from shopping memberships, but at a lower cost and without marketplace/commission incentives.
- Consumer Deep Review should help buyers understand products/businesses before purchase through deeper evidence, saved/watchlist tools, score explanations, and alerts where available.
- Press/media access should require approval.
- Press/media access should generally be paid, with public-interest waiver options.
- Custom media/research report requests should be allowed when approved and paid, with guardrails.

Report types:

- Free public trust summary
- Consumer deep review
- Press/media report access
- Research/academic access
- Sponsor/funder reports
- Business/NGO reports
- Future Gov/public reports

Free public trust summary may include:

- Evidence Score
- Coverage
- Recency
- Verification status
- Basic why
- Snapshot date
- Payment firewall note

Consumer Deep Review may include:

- Product/business score explanation
- Places to buy
- Evidence timeline
- What has been checked
- What is missing
- Restoration/correction notes
- Saved products/businesses
- Watchlist alerts
- Deeper score pop-up/report detail
- Category/product comparisons where enough evidence exists

Press/media access may include:

- Report packets
- Category summaries
- Methodology notes
- Public source summaries
- Historical snapshots where allowed
- Downloadable charts/tables
- Citation language
- Correction history

Visibility tiers:

- Public
- Registered
- Paid approved
- Restricted approved
- Internal only
- Governance/audit only

Raw document visibility:

- Depends on visibility level, consent, document type, and legal/privacy status.
- Private raw documents should not be exposed by default.
- Public-source documents may be linked or summarized where appropriate.
- Private submitted documents require explicit consent and redaction review before broader sharing.

Approved access flow:

```txt
User creates account
-> selects access type
-> states purpose
-> accepts report/data terms
-> Mishava verifies/approves or auto-approves based on risk
-> payment activates access if required
-> views/exports are logged
-> misuse can revoke access
```

AI-assisted access verification:

- AI may help reduce team workload by reviewing submitted access applications, checking email domain, publication/research affiliation, website presence, organizational identity, prior public work, and consistency of purpose.
- AI may classify access requests as low-risk, medium-risk, or needs human review.
- AI may suggest approval, denial, or more information requested, but higher-risk press/media/research access should remain reviewable.
- Suspicious, high-impact, politically sensitive, or unclear requests should be routed to human review.
- Approval decisions should be logged with reason codes.

Export formats may include:

- PDF
- Word
- Excel
- CSV
- Share link
- Web page
- Evidence appendix
- Charts/tables

Export controls:

- Watermark exports where appropriate.
- Log downloads and report views.
- Include methodology context.
- Include snapshot date.
- Include citation language.
- Restrict resale, misleading excerpts, removal of context, and publication without methodology.

Dataset exports:

- Paid users may export datasets when allowed by their access level.
- Default dataset exports should be aggregated and de-identified.
- Non-aggregated or sensitive data requires special approval, consent/legal review, and stricter licensing.

Media use:

- Media may quote Mishava scores if they include score context: coverage, recency, confidence, and snapshot date.
- Media must distinguish evidence summary from opinion or interpretation.
- Media must not imply paid access changes results.
- Media must not remove score context in a misleading way.
- Media must not frame Mishava as endorsing a political attack.

Public transparency:

- Mishava should publish a public correction log.
- Basic transparency pages should launch early, including methodology, scoring/ranking/payment firewall principles, and correction/dispute policy.
- Public report library can launch later after enough evidence and governance maturity exist.

### 6C. Consumer Subscription And Deep Review Plan

Decisions:

- Consumers can use Mishava Shopping for free.
- Consumer paid access should create recurring value through deeper trust tools, not marketplace perks, commissions, ad removal, or paid ranking.
- Product tier should be **Mishava Plus**.
- Main consumer paid feature should be **Deep Review**.
- Shopping Priorities should be free with an account.
- Consumer Plus should not include unlimited expensive AI.
- Product deep reviews should not be unlimited; use reasonable limits, precomputed reports, saved views, or tiered access.

Launch consumer tiers:

| Tier | Monthly | Annual |
|---|---:|---:|
| Free Consumer | $0 | $0 |
| Mishava Plus | $4.99/month | $49/year |
| Mishava Plus Family | $8.99/month | $89/year |
| Mishava Plus Pro | $14.99/month | $149/year |

Free Consumer may include:

- Search products/businesses
- View product cards
- See Evidence Score
- Click score pop-up
- See basic evidence summary
- Use basic filters
- Open external shopping links
- See local options where available
- Create Shopping Priorities with a free account

Mishava Plus / Deep Review should include:

- Saved products/businesses
- Watchlist alerts
- Deeper score detail
- Evidence timeline
- Side-by-side comparison
- Red-line alerts
- Local availability alerts where available
- Restoration/correction alerts
- More detailed places-to-buy view
- Product/business deep review summaries where enough evidence exists

Mishava Plus Family:

- Family/household profiles should launch as part of the consumer subscription plan.
- Household profiles should allow more than one preference profile, while preserving individual choice and privacy where needed.

Mishava Plus Pro:

- May include higher limits, more comparisons, more alerts, additional saved lists, more report access, and limited AI credits.
- Custom AI research should be limited by credits, not unlimited.

AI usage:

- Plus may include limited AI credits.
- AI credits may support custom product questions, limited comparison help, or guided Deep Review.
- Large category analysis, custom research, or heavy report generation should require higher tier, add-on, or separate report purchase.

Exports:

- Plus users may receive light PDF/share exports.
- Full exports, bulk downloads, and datasets should remain for approved report/research tiers.

Evidence visibility:

- Plus users may see deeper summaries, timelines, source summaries, and public-source links.
- Plus users should not automatically see raw private documents.
- Raw private documents require visibility level, consent, redaction, and legal/privacy controls.

Free trial:

- Mishava Plus should support a 7-day or 14-day free trial.

Guardrails:

- Consumer subscription does not affect company score, product score, ranking, verification, or credibility.
- Paid consumers buy deeper understanding and tools, not better results for any company.

### 7. Legal And Risk Framework

Decisions:

- Legal posture should be balanced with a leaning toward strong transparency.
- Raw evidence visibility depends on document type and consent.
- Public records should be treated differently from private submitted documents.
- Serious adverse findings require human/senior/legal review as recommended, with business response when appropriate.
- Consent must be separate by visibility level.
- Redaction must be core to the evidence workflow.
- Redactions should be visible as redactions and should note why the content was redacted.
- Score snapshots and audit logs should be permanent or very long-term where legally allowed.
- Raw sensitive documents may have limited retention based on legal/privacy rules.
- Evidence summaries should be retained long-term where legally allowed.
- Paid reports should restrict resale, misleading excerpting, removal of context, and publication without methodology.
- Legal/risk review trigger list is approved for legal/risk purposes, not scoring rules.
- Every organization has a right to correction, even if unpaid.
- Corrections that require an audit-like process may be charged.

First-launch legal/policy document set:

Mishava should include all of the following for first launch, even if some are short and plain-language initially:

1. Terms of Service
2. Privacy Policy
3. Evidence Submission Terms
4. Report/Data Use License
5. Correction / Dispute Policy
6. No Paid Ranking / No Commission Disclosure
7. AI Use Disclosure
8. Redaction / Sensitive Evidence Policy
9. Community / User Conduct Policy
10. Accessibility Statement

Legal docs should be drafted in plain language first, then reviewed by counsel.

Mishava should also have a public **Trust Commitments** page separate from legal terms.

Report/media users should accept a separate agreement before downloading or exporting reports/data.

Businesses and NGOs should accept separate evidence submission terms before uploading documents, photos, attestations, reports, or other evidence.

Document purposes:

- Terms of Service: platform use, accounts, prohibited misuse, no guarantee of favorable outcomes.
- Privacy Policy: consumer accounts, Shopping Priorities, evidence data, payments, analytics, and AI processing.
- Evidence Submission Terms: consent, ownership/permission, visibility, review, publication summaries, and prohibited falsification.
- Report/Data Use License: report exports, citation, no misleading excerpts, no resale without permission, methodology context.
- Correction / Dispute Policy: correction rights, evidence requirements, timelines, appeals, public correction history.
- No Paid Ranking / No Commission Disclosure: payment does not affect score/ranking/verification; Mishava does not take shopping commissions.
- AI Use Disclosure: AI assistance, citation requirement, human review, no opinion-based scoring.
- Redaction / Sensitive Evidence Policy: private docs, raw evidence access, redaction labels, retention, sharing controls.
- Community / User Conduct Policy: no abusive reports, harassment, misuse of reports, or bad-faith manipulation.
- Accessibility Statement: accessible trust infrastructure commitment.

### 8. AI Governance

Decisions:

- AI can complete low-risk workflows with sampling.
- Every AI-extracted scoring fact requires citation to a specific evidence item and, where possible, page/section/location.
- Photo evidence counts as evidence. If AI identifies a possible issue in a photo, it must cite the photo and the specific region/observation.
- Opinions, reviews, social posts, and narrative accusations never score directly.
- Opinion/narrative material may only become a lead for finding factual evidence.
- Human review is mandatory for low AI confidence, serious adverse findings, disputes/corrections, material score impact, high-risk categories, enterprise audits, field audits, and new source types.
- AI logs must include model, model version, prompt/template version, input evidence IDs, output, confidence, review status, and human decision.
- AI may draft NGO/business/funder reports from confirmed evidence and user-provided content, with review before publication.
- AI may gather public/web evidence only if the source is stored and classified.
- Reviewer decisions can improve AI extraction only after privacy/legal controls are in place.
- Public methodology must disclose Mishava uses AI assistance.
- AI confidence is internal. Public displays should show reviewed evidence confidence/reviewer confidence, not raw AI confidence.

### 8A. AI Evidence System

Decisions:

- Mishava's AI evidence workflow should start with uploaded evidence plus limited public-record lookup, then expand carefully.
- Initial AI scope should prioritize evidence uploaded by businesses, NGOs, suppliers, sellers, auditors, and Mishava reviewers.
- Limited public-record lookup may be included early for identity/existence checks, licenses, registrations, public filings, sanctions/debarment where relevant, and other official or highly reliable sources.
- Broader public web gathering should come later after source reliability, legal, review, and cost controls are mature.

Core workflow:

```txt
Evidence uploaded or selected
-> raw source stored
-> OCR/text extraction where needed
-> AI extracts candidate facts/claims
-> AI cites evidence item and location
-> AI classifies fact type and suggested SDG/pillar/indicator
-> AI assigns confidence and review flags
-> human review confirms/rejects where required
-> confirmed facts can enter scoring/reporting
```

Fact rule:

```txt
No evidence citation, no scoring fact.
```

Opinion rule:

```txt
Opinions, reviews, social posts, and narrative accusations do not score directly.
They may only become leads for finding factual evidence.
```

Photo evidence:

- AI may flag possible issues in photos, such as unsafe work conditions, missing signage, sanitation concerns, visible product/source evidence, or facility conditions.
- Photo-derived findings must cite the photo and specific region/observation.
- Material or adverse photo findings require human review.

Public-record lookup:

- Use for identity confirmation, registration/license checks, sanctions/debarment checks, official filings, court/regulatory records, and other high-reliability public sources.
- Store source URL/reference, retrieval date, source type, and confidence.
- Public-record findings should remain distinct from private submitted evidence.

AI cost control:

- AI usage should be mostly covered through products sold, plan entitlements, setup services, verification services, audits, reports, or sponsored access.
- Free tiers should have limited AI usage.
- Paid tiers may unlock more AI-assisted setup, report rebuilding, evidence parsing, catalog creation, and report drafting.
- AI usage should be metered internally by organization, product surface, feature, document count, token/compute cost, and workflow type.
- Runaway AI cost should be prevented through usage limits, queues, plan limits, manual approval for large jobs, and cost alerts.

Examples of paid or metered AI features:

- AI Parse + Basic Profile Draft
- Assisted evidence setup
- Guided evidence setup
- NGO report rebuilding
- Business report drafting
- Product catalog creation
- Product evidence extraction
- Audit evidence extraction
- Media/research report generation
- Insights report generation

Learning loop:

- Reviewer decisions can improve AI extraction and routing after privacy/legal controls are in place.
- AI learning should improve extraction quality, classification, confidence calibration, and workflow routing.
- AI learning must not silently change scoring formulas, score weights, caps, or public methodology.
- Scoring changes remain controlled by scoring governance.

Build implications:

- AI jobs need status, owner, cost, source references, model/prompt version, confidence, review requirement, and reviewer outcome.
- AI outputs should be stored as draft/candidate records until accepted where human review is required.
- AI-generated report text should be editable and approval-based.
- AI-generated trust claims must trace back to evidence/snapshots.

### 9. Data Architecture And Source Of Truth

Decisions:

- All evidence records should be kept where legally allowed.
- Raw sensitive documents may have limited retention, but evidence summaries and snapshots should remain.
- Product scoring should use a hybrid model: business score plus product-specific evidence/claims.
- NGO scoring should use the same core engine with NGO-specific indicators and profile fields.
- NGOs may provide credibility and evidence, but Mishava must extract only facts, not opinions.
- NGO findings are not taken or published without NGO submission/approval.
- User preferences should be stored with consent and user control.
- Analytics should have a separate analytics warehouse/layer.
- Mishava should maintain an evidence source registry.
- Snapshot visibility depends on visibility, consent, and legal status.
- If a business deletes its account, the public claimed profile may be removed, but public-record/evidence snapshots may remain where legally or publicly justified.
- Plan/payment data must be separated from scoring/ranking services.
- Reports can use current data, score snapshots/evidence summaries, and custom edited report text, but trust claims must trace back to evidence/snapshots.
- Users may custom-edit reports and use AI to help build them.

### 9A. Security, Auth, And Account Access Model

Decisions:

- Mishava should use a shared identity and access model across consumers, families/households, businesses, local businesses, suppliers, sellers, NGOs, funders/sponsors, press/media, researchers, corporate users, future Gov users, Mishava employees, auditors, reviewers, and admins.
- No user should have more access than needed.
- No user should be able to change trust outcomes without permission, evidence, reason, audit trail, and required approval.

Core account model:

```txt
Person
Organization
Workspace
Membership
Role
Permission
Entitlement
AuditLog
```

A person may belong to multiple organizations/workspaces.

MFA:

- Consumers should use MFA because accounts may hold payment information, saved preferences, red-line settings, family profiles, or sensitive account data.
- Business and NGO admins require MFA.
- Mishava employees require MFA with no exceptions.
- Funders/sponsors, press/media, researchers, corporate users, Gov users, auditors, and admins should require MFA.

Funders/sponsors:

- Funders and sponsors should only see data explicitly shared with them.
- They should not receive full NGO/business workspace access by default.
- Participant-level visibility requires participant consent or a clear sponsorship agreement.

Press/research access:

- Press and research access requires identity and purpose approval.
- AI may help verify access requests by checking submitted proof, email domain, publication/research affiliation, website presence, organization identity, prior public work, and consistency of stated purpose.
- AI may classify requests as low-risk, medium-risk, or needs human review.
- AI may recommend approval, denial, or more information requested, but higher-risk requests remain human-reviewable.
- Proof and approval reasoning should be logged.

Organization invites:

- Invites should require role selection at invite time.
- Invited users should see what access they are accepting.
- Invite acceptance should be logged.

Roles:

- Businesses and NGOs should be able to create custom internal roles at launch.
- Mishava should still provide safe default roles to reduce setup friction.
- Custom roles should be permission-based and should not allow bypassing Mishava trust controls.

Raw evidence access:

- Raw evidence access should be off by default for everyone except required roles.
- Raw evidence access must be permissioned by visibility level, consent, sensitivity, and role.

Every export/download should be logged.

Required security features:

- MFA
- Role-based access control
- Attribute-based access control for sensitive evidence
- Session logging
- Audit logs
- Access reviews
- Suspicious activity alerts
- Export/download logs
- Invite-based organization membership
- Domain verification where useful
- SSO support at launch

SSO:

- Mishava should support SSO at launch rather than waiting, especially for NGOs, corporate, institutional, Gov, enterprise, and larger teams.

Example permissions:

- view_profile
- edit_profile
- submit_evidence
- view_evidence_summary
- view_raw_evidence
- approve_evidence
- review_ai_extraction
- generate_report
- approve_report
- share_report
- manage_billing
- manage_team
- configure_pricing
- configure_scoring_version
- approve_scoring_version
- view_audit_log
- export_report

Sensitive evidence visibility levels:

- public
- registered
- paid_approved
- business_visible
- shared_with_specific_user
- internal
- restricted_internal
- governance_audit_only

Guardrails:

- System/admin access should not mean silent scoring power.
- Pricing/billing roles should not be able to change score, ranking, evidence, or verification.
- Support roles should not see raw sensitive documents unless required.
- Custom organization roles cannot grant access beyond the organization's entitlements or Mishava-level safety rules.

### 10. Ethical Review Framework

Decisions:

- Public tone around negative evidence should be neutral/documentary.
- Mishava should explicitly say it is not a blacklist.
- Political behavior should only be scored when tied to documented governance risk, legal issue, public accountability evidence, or relevant policy/evidence context.
- The Bible verse / Christian-values layer should be part of an optional values/founder philosophy layer, not default scoring math.
- Mishava should publicly explain that it was created from the founder's Christian values while still preserving user choice.
- Founder framing to refine later: God gave people choice; Mishava gives people information to make choices according to their values. God values transparency. The founder's family verse is "Love God, Love Others." Mishava expresses love of others by helping people understand whether their purchases align with values that care for workers, communities, creation, and truth.
- Mishava needs explicit small-business fairness rules.
- Mishava should have an internal ethical review trigger before publishing findings that could seriously damage a small/local business.
- User red lines should affect personalized filtering/ranking only, not the public company score.
- Mishava should ban use of Insights for manipulative targeting.
- Mishava should explicitly refuse revenue from ads, sponsored placement, paid ranking, reputation cleanup, negative evidence suppression, pay-to-remove reports, political attack packages, and personal buyer data resale.
- Ethical review group/advisory board should be created after early traction and before reports/insights scale.

### 10A. Founder Faith Language And Company About Placement

Decisions:

- Founder faith language should live on `/about/founder`.
- The main `/about` section should be about Mishava as a company: mission, values, trust commitments, transparency principles, and the people who make Mishava happen now and in the future.
- The founder story should not take over the company About page.
- This placement reflects a servant posture: being Christ-like means serving the mission and others, not seeking the spotlight.
- Mishava can publicly acknowledge that it was created from the founder's Christian values without making the main product experience exclusionary or doctrinal.
- The founder page should be written so non-Christians can read it respectfully, conservative and liberal Christians can recognize the faith behind it, and the founder does not deny her love for Christ/God.

Founder framing to refine for `/about/founder`:

```txt
Mishava grew out of my Christian faith and my belief that loving God should shape how we love other people.

In my family, we often return to a simple verse: Love God, Love Others.

I believe God gives people choice. Mishava was created to help protect that choice by making evidence clearer.

Mishava does not ask users, businesses, NGOs, or institutions to share my faith. It is here to make evidence visible so people can decide with more honesty, clarity, and care.

My faith also shapes Mishava's belief in repair. Harm should not be hidden, but people and organizations should have a real path to acknowledge wrong, correct it, and rebuild trust through evidence.
```

Main `/about` should focus on:

- Clear evidence
- Fair discovery
- No paid trust advantage
- Transparency
- Repair/restoration
- Small-business fairness
- NGO and public-interest credibility
- The team and contributors who make the work possible
- Mishava's role as trust infrastructure, not a marketplace or ad platform.

## 31. Final North Star

Mishava should make trust visible without selling attention.

Mishava should help:

- Consumers discover products and businesses based on evidence.
- Small/local/family businesses participate fairly without corporate ESG burdens.
- NGOs organize and share trust evidence affordably.
- Suppliers and sellers find each other based on fit and evidence.
- Businesses understand where verified trust improvements align with buyer demand.
- Press, researchers, and institutions access deeper transparency responsibly.
- Mishava employees perform audits with separation of duties and visible paper trails.
- Future public agencies document evidence-backed purchasing decisions.

The core promise:

> Clear evidence, fair discovery, transparent decisions, and no paid trust advantage.
