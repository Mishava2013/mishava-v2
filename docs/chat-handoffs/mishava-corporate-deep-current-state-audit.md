# Mishava Corporate / Institutional Deep Current-State Audit

Date: 2026-06-23

## 1. Executive Summary

Mishava Corporate / Institutional is intended to become a private institutional evidence and procurement-support surface for organizations that need evidence-backed vendor, supplier, product, and category review. Possible future users include companies, foundations, universities, healthcare systems, large nonprofits, churches/denominations, affordable housing organizations, and other large buyers.

Current readiness is early. Corporate has a reserved route, shared platform foundations, and strong guardrails, but no real institutional dashboard, vendor review workspace, procurement project model, private review packet, enterprise roles, vendor correction/dispute workflow, or Corporate-specific scoring methodology.

What is genuinely done:

- Reserved `/corporate` page exists.
- `corporate.mishava.org` is supported by subdomain routing.
- `organization_type` includes `corporate`.
- Sign-up copy can render a Corporate-specific account surface.
- NGO has evidence/reporting primitives that could inform institutional review packets.
- Shopping has product, source, supplier/manufacturer transparency primitives.
- Scoring/Trust has snapshots, structured claims, no-paid-ranking, and no-fake-score guardrails.
- AI control and payment firewall guardrails exist.

What is not done:

- No Corporate dashboard.
- No institutional workspace.
- No Corporate roles or permission model beyond generic org primitives.
- No vendor list or product list workflow.
- No procurement project or internal review packet workflow.
- No Corporate-specific data model.
- No correction/dispute workflow for institutional vendor review.
- No paid enterprise readiness.

What is live:

- Reserved Corporate page only. It explicitly says Corporate is not a live portal.

What is built but not exposed:

- Shared organization, membership, evidence, structured claim, audit event, scoring version, score snapshot, pricing, and feature gate foundations.
- NGO private evidence/reporting/export concepts.
- Shopping product/source/supplier transparency concepts.
- Admin protected support concepts.

What is only conceptual/planned:

- Institutional dashboards.
- Vendor/product review workspaces.
- Procurement support.
- Supplier comparison.
- Evidence/reporting tools.
- Audit trails.
- Export/reporting.
- Compliance-readiness support.

What is blocked by other categories:

- Business/Local/Supplier/Seller claim and profile flows.
- Shopping product lookup/research requests.
- Research/source review queues.
- Reviewed structured claims and methodology.
- Admin/Ops correction, evidence, and source queues.
- Legal/security/privacy/accessibility review.

Honest next step:

Create a Corporate / Institutional concept brief and dependency map. Do not build Corporate product features yet.

Pilot posture:

- Ready for internal planning and exploratory buyer/problem conversations.
- Not ready for actual institutional use.
- Not ready for paid enterprise use.
- Not ready for procurement conclusions.

Irresponsible to claim now:

- Corporate procurement readiness.
- Vendor approval or certification.
- Compliance certification.
- Enterprise security readiness.
- Final Mishava Scores for vendors/products.
- Automated procurement recommendations.
- Any paid buyer advantage in trust outcomes.

## 2. Percent Estimates

| Area | Estimate | Why reasonable | Moves higher if | Moves lower if | Biggest uncertainty |
| --- | ---: | --- | --- | --- | --- |
| Overall Corporate/Institutional readiness | 9-13% | Reserved page and shared foundations exist; product is not built. | Concept brief and first workspace/data model plan are completed. | Corporate is treated as live before dependencies mature. | First target institutional buyer type. |
| Corporate concept readiness | 28-38% | Roadmap and handoff define direction, but no dedicated concept brief exists. | User groups, first workflow, and non-goals are narrowed. | Scope sprawls across every institution type. | Whether Corporate starts with vendor review, product comparison, or reporting. |
| Institutional dashboard readiness | 5-8% | Admin/NGO dashboard ideas exist; no Corporate dashboard exists. | Dashboard IA and access model are planned. | Dashboard is built without review queues. | Role model complexity. |
| Vendor review readiness | 10-16% | Supplier transparency foundations exist from Shopping. | Business/Supplier profiles and claim flow are built. | Vendors can self-certify truth. | Vendor identity verification. |
| Procurement support readiness | 6-10% | Procurement direction exists; no workflow exists. | Vendor list/review packet model is planned. | Procurement recommendations appear without methodology. | Buyer-specific policy needs. |
| Product/category comparison readiness | 18-24% | Shopping has two POC categories and source cards. | Search, research requests, and reviewed claims mature. | Product data remains shallow/manual. | Category expansion and evidence depth. |
| Business/Supplier dependency readiness | 15-20% | Reserved surfaces and supplier primitives exist. | Claim and evidence submission flows exist. | Profile work remains placeholder. | Ownership verification effort. |
| Scoring/Trust dependency readiness | 48-53% | Snapshot and payment guardrails exist. | Reviewed claims and methodology mature. | Corporate starts using final labels too early. | Institutional scoring language. |
| Research/Evidence dependency readiness | 50-55% | Evidence/source foundations exist. | Review queues and stale-data cadence are built. | Research tasks become facts. | Ops review cost. |
| Admin/Ops/Compliance dependency readiness | 48-53% | Protected admin/support and readiness docs exist. | Correction/evidence/source queues and ops drills are proven. | Silent trust edits or weak ops. | Staffing/review process. |
| Legal/compliance readiness | 22-30% | Conservative legal/compliance language exists. | External legal/security/accessibility review occurs. | Enterprise/procurement claims are made. | Contract/legal expectations. |
| Security/privacy readiness | 35-45% | Auth/RLS/file foundations exist; ops proof incomplete. | Private workspace security, monitoring, backup, and incident drills are proven. | Internal notes/documents leak publicly. | Enterprise data boundaries. |
| Paid enterprise readiness | 8-14% | Payment firewall thinking exists; enterprise billing not designed. | Enterprise plan, contracts, support, and firewall checks are planned. | Paid access influences trust. | Pricing/support/legal model. |
| Public launch readiness | 3-6% | Reserved page is safe; product absent. | Full private workflow and legal review are complete. | Corporate claims go public early. | Institutional liability. |

## 3. Intended Corporate / Institutional Users

| User group | Need | Mishava could help with | Mishava should not promise | Evidence required | Risks |
| --- | --- | --- | --- | --- | --- |
| Corporate procurement teams | Compare vendors/products and document decisions. | Evidence packets, gaps, source freshness, private notes. | Procurement approval or best-vendor decision. | Vendor identity, product/source docs, certifications, pricing context. | Overreliance on incomplete evidence. |
| Vendor management teams | Track vendor evidence and review status. | Vendor profiles, review queue, correction states. | Vendor certification. | Contracts, public records, submitted docs, review notes. | Incorrect or stale vendor data. |
| ESG/sustainability teams | Review environmental/social claims. | Source-backed claims and evidence gaps. | ESG rating or certification. | Sustainability reports, certifications, audits, public records. | Greenwashing or unsupported claims. |
| Compliance/legal teams | Preserve review trails and avoid risky claims. | Audit logs, visibility controls, disclaimers. | Legal compliance determination. | Policies, evidence, review history. | Legal exposure from public/internal labels. |
| Operations/facilities teams | Compare practical product/vendor options. | Product/category comparisons and availability context. | Safety or engineering approval. | Specs, certifications, supplier data. | Technical claim risk. |
| Foundations/grantmaking institutions | Review vendors, grantees, or partners. | Evidence packets and reporting structure. | Funding approval or charity rating. | Applicant evidence, public records, reports. | Mixing NGO credibility with vendor review. |
| Universities/schools | Review suppliers and purchases. | Procurement evidence and accessibility/security context. | FERPA/security compliance approval. | Vendor docs, contracts, public records. | Sensitive institutional data. |
| Hospitals/healthcare systems | Review vendors/products carefully. | Evidence structure and review status. | Medical suitability or healthcare compliance. | Vendor certifications, safety docs, regulatory records. | High legal/safety risk. |
| Churches/denominations | Review vendors/partners across networks. | Portfolio-style evidence review. | Moral certification. | Vendor/partner docs, policies, public records. | Reputation and fairness risk. |
| Affordable housing organizations | Review vendors/contractors. | Evidence packets and issue tracking. | Housing compliance determination. | Contractor docs, registrations, enforcement records. | Legal/public funding sensitivity. |
| Large nonprofits | Procurement and reporting support. | Vendor/product review and board-ready packets. | Funding, legal, or vendor approval. | Evidence docs, reports, review status. | Confusion with NGO trust profiles. |
| Institutional buyers | Make repeatable purchasing choices. | Saved products/vendors and criteria. | Automatic purchasing recommendation. | Product/vendor evidence, criteria, alternatives. | Mistaking match for final score. |
| Suppliers/vendors | Submit/correct evidence. | Evidence submission and response workflow. | Paid credibility. | Identity docs, certifications, source links. | Conflict-of-interest perception. |
| Mishava reviewers/admins | Review sources, disputes, and packets. | Queues, audit logs, role controls. | Silent trust manipulation. | Review notes, evidence, action logs. | Operational burden. |

## 4. Corporate Use-Case Map

| Use case | Status | Live? | Dependency | Likely data needed | Risk | Build first? |
| --- | --- | --- | --- | --- | --- | --- |
| Vendor/supplier review | Not built | No | Business/Supplier, Research, Admin | Vendor identity, ownership, evidence, correction | High | Plan after Business/Supplier |
| Procurement transparency | Conceptual/private | No | Corporate, Reporting | Decision packet, alternatives, notes | Medium-high | Later |
| Ethical sourcing checks | Partial dependency | No Corporate workflow | Shopping/Research/Scoring | Supplier docs, certifications, claims | Medium-high | After reviewed claims |
| ESG/vendor documentation | Not built | No | Evidence/Research | Reports, certifications, audits | High | Plan early |
| Product/category comparison | Partial via Shopping | Shopping only | Shopping/Scoring | Product records, sources, category claims | Medium | After Shopping search |
| Supplier risk review | Not built | No | Business/Supplier/Legal | Public records, certifications, disputes | High | Later |
| Internal evidence packets | Partial primitives | No Corporate UI | NGO reports/evidence | Evidence, notes, export, visibility | Medium | Good early target |
| Board/committee reporting | Partial via NGO reports | No Corporate UI | Reporting/Exports | Packet summaries, evidence status | Medium | Later |
| Vendor correction/dispute | Not built | No | Admin/Ops/Legal | Correction, evidence, audit trail | Very high | Required before serious use |
| Preferred supplier list support | Not built | No | Business/Supplier/Scoring | Approved internal list, criteria, notes | High | Later |
| Institutional dashboard | Not built | No | Corporate/Auth/Admin | Workspace, saved vendors/products, roles | Medium-high | Plan first |
| Export/reporting tools | Partial via NGO exports | No Corporate export | Reporting | Review packet, CSV/PDF | Medium | Later |
| Policy-aligned purchasing | Conceptual | No | Scoring/Methodology | Criteria, weights, exceptions | High | Later |
| Procurement audit trail | Partial generic | No Corporate workflow | Audit events | Actions, reviewers, changes | Medium | Core requirement |
| Product alternatives | Partial Shopping | No Corporate workflow | Shopping/Search | Comparable products, evidence states | Medium | After Shopping search |

## 5. Current Route / Product Status

- Corporate route: `src/app/corporate/page.tsx`.
- Route type: public reserved/coming-soon page.
- Subdomain routing: `corporate.mishava.org` maps to `/corporate`.
- Corporate dashboards: absent.
- Institutional workspaces: absent.
- Corporate-specific data models: absent, except generic `organization_type = 'corporate'`.
- Corporate-specific tests: limited to reserved route/copy and auth surface checks.
- Corporate-specific docs: current handoff plus roadmap section; no dedicated concept brief yet.
- Live product: no.
- Should not be exposed yet: procurement dashboards, vendor ranking, preferred supplier lists, paid enterprise claims, or final scores.

## 6. Relationship To Shopping

Corporate can eventually reuse Shopping product/category evidence:

- Product records.
- Category pages.
- Evidence cards.
- Supplier/manufacturer transparency.
- Places-to-buy/source freshness.
- Score-pending/evidence-gap language.

Institutional product categories could include toilet paper, diapers/wipes, cleaning supplies, office supplies, food, uniforms, paper products, facilities supplies, and technology products, but only after source coverage and review methods mature.

Reusable now:

- Early product/source model.
- Product detail evidence cards.
- Supplier/manufacturer confidence labels.
- No paid ranking/no commission guardrails.

Not mature enough:

- Final scores.
- Broad search.
- Product-not-found research requests.
- Source review/admin workflow.
- Product image rights strategy.
- Category-specific methods beyond early POCs.

Do not build Corporate product comparison until Shopping search/research and reviewed claim workflows are stronger.

## 7. Relationship To Business / Local / Supplier / Seller

Corporate depends heavily on Business/Local/Supplier/Seller:

- Vendor identity.
- Supplier/manufacturer relationships.
- Seller/retailer distinction.
- Business profile ownership.
- Catalog ownership.
- Evidence submission.
- Correction/dispute workflow.

Small/local businesses should be treated fairly:

- Do not penalize lack of enterprise-grade documentation as wrongdoing.
- Show evidence coverage separately from trust conclusions.
- Let businesses submit/correct evidence.
- Keep missing evidence visible.

Business/Local work that must happen first:

1. Claim flow.
2. Profile ownership states.
3. Supplier/seller relationship model.
4. Evidence submission review state.
5. Correction/dispute queue.

## 8. Relationship To Scoring / Trust

Corporate should not use final Mishava Scores until reviewed evidence and approved methodology exist.

Initial Corporate should use evidence/readiness states:

- Evidence available.
- Evidence missing.
- Review needed.
- Source stale.
- Vendor response pending.
- Internal review packet incomplete.
- Mishava review not finalized.

Reviewed vs unreviewed evidence must be clear. Confidence, coverage, and recency should display as context, not procurement decisions.

Unsafe labels:

- Approved supplier.
- Certified vendor.
- Procurement-safe.
- Compliant.
- Preferred by Mishava.
- High-risk vendor, unless internally/private and backed by legal review.
- Best vendor.

Potentially safe later:

- Evidence profile complete.
- Evidence profile incomplete.
- Reviewed evidence available.
- Source coverage low/medium/high.
- Internal review packet ready.
- Methodology version applied.

Internal procurement notes should remain private institution-owned context, not public Mishava trust labels.

## 9. Relationship To Research / Evidence

Corporate would need source types including:

- Official vendor documents.
- Company sustainability reports.
- Supplier certifications.
- Product specifications.
- Certification databases.
- Regulatory/government records.
- NGO reports.
- Credible journalism.
- Audit/compliance documents.
- Public enforcement records.
- Internal institution-uploaded documents.

Already partly supported:

- Generic evidence items.
- URLs and document paths.
- Review status, confidence, visibility.
- Structured claims tied to evidence.
- Shopping evidence cards.
- Supplier transparency fields.

Missing:

- Corporate source taxonomy.
- Private/internal evidence handling UX.
- Source review queue.
- Conflict/stale source policy.
- Internal note redaction/publication controls.
- Institution-uploaded document review workflow.

Before Corporate can work, Research/Evidence needs source review queues, stale-data cadence, private evidence visibility, and correction/dispute support.

## 10. Institutional Dashboard Concept

A safe first institutional dashboard should show:

- Saved vendors/products.
- Evidence status.
- Missing evidence.
- Review status.
- Internal notes count.
- Product/category comparison state.
- Export/review packet status.
- No final scores unless methodology supports them.

Possible later:

- Policy alignment.
- Saved purchasing criteria.
- Review packet export.
- Team assignments.

Human review required:

- Source verification.
- Vendor correction/dispute.
- Publishing or sharing review packets.
- Any score/methodology output.

Never automate:

- Vendor approval.
- Procurement recommendation.
- Final risk/trust labels.
- Legal/compliance conclusion.
- Supplier approval.

Build only after Business/Local and Research/Evidence mature:

- Vendor lists.
- Supplier profiles.
- Correction/dispute.
- Procurement review packets.
- Export workflow.

## 11. Procurement Workflow Concept

Safe first workflow:

1. Institution creates a private review workspace.
2. User saves vendors/products/categories for review.
3. Mishava shows current evidence status and gaps.
4. User adds internal criteria/notes.
5. Reviewer prepares a private evidence packet.
6. Institution exports or shares internally.
7. Missing evidence remains visible.

Could eventually:

- Upload a vendor list.
- Show evidence status by vendor.
- Show missing evidence.
- Flag public-source concerns for human review.
- Export review packets.
- Save internal notes.
- Create purchasing criteria.

Should require human review:

- Source claims.
- Public-source concerns.
- Vendor corrections.
- Scoring labels.
- Shared reports.

Should be deferred:

- Final procurement recommendations.
- Preferred supplier automation.
- Public red flags.
- AI-generated recommendations.

## 12. Vendor Correction / Dispute Workflow

Current status: not built.

Needed before serious Corporate use:

- Vendor can correct inaccurate info.
- Vendor can submit evidence.
- Vendor can dispute claims.
- Institution can add private internal notes.
- Mishava keeps audit history.
- Internal/private notes stay private.
- Correction status is visible to reviewers.

Legal risks if missing:

- Incorrect vendor data may affect purchasing.
- Vendors may lack fair response path.
- Institutions may rely on stale/unsupported claims.
- Internal notes could create liability if leaked.

## 13. Institutional Privacy And Permissions

Corporate needs a stronger role/permission model:

- Institution admin.
- Procurement member.
- Reviewer.
- Viewer.
- External/vendor respondent.
- Mishava reviewer/support.

Needs:

- Private workspace boundaries.
- Private notes.
- Private uploaded documents.
- Shared internal reports.
- Optional external share controls.
- Clear public vs internal evidence boundary.

Reusable from NGO/org work:

- Organizations.
- Memberships.
- Current org checks.
- Protected `/org` and `/admin` route patterns.
- Evidence item visibility.
- Shared report concepts.
- Audit events.

Must not mix:

- Consumer preferences with institutional notes.
- NGO credibility reports with vendor review labels.
- Public evidence with private procurement notes.
- Vendor-submitted evidence with verified facts.

## 14. Data Model Needs

| Model | Status | Likely source/current table | Risk | Dependency | Tests needed |
| --- | --- | --- | --- | --- | --- |
| Institutions/accounts | Partial generic | `organizations` with `corporate` | Medium | Org/auth | Corporate org creation/access tests |
| Institutional workspaces | Missing | New table or org extension | Medium | Org model | Workspace isolation tests |
| Departments/teams | Missing | New table likely | Medium | Role model | Department access tests |
| Institutional users/roles | Partial generic | `organization_memberships`, roles | Medium | Auth/permissions | Corporate permission matrix tests |
| Vendor lists | Missing | New table likely | High | Business/Supplier | Vendor list access tests |
| Product lists | Missing | New table likely | Medium | Shopping | Saved product list tests |
| Procurement projects | Missing | New table likely | High | Corporate model | Project CRUD/access tests |
| Internal review packets | Missing | Could adapt report model | High | Evidence/reporting | Packet export/access tests |
| Public/private notes | Partial generic | `audit_events`, evidence notes | High | Visibility model | Redaction/privacy tests |
| Evidence records | Partial generic | `evidence_items` | Medium | Evidence | Corporate source taxonomy tests |
| Uploaded documents | Partial via NGO files | Evidence file metadata | High | File safety | Private storage/access tests |
| Correction/dispute records | Missing | New table likely | Very high | Admin/Ops/Legal | Dispute lifecycle tests |
| Exports | Partial NGO | NGO report exports | Medium | Reporting | Corporate packet export tests |
| Audit logs | Partial generic | `audit_events` | Medium | Admin/Ops | Append-only/action tests |
| Business/supplier relationships | Partial Shopping | Shopping supplier fields | High | Business/Supplier | Identity separation tests |
| Billing/entitlements | Partial NGO | pricing/feature gates | Medium | Stripe/payment | Paid firewall tests |

## 15. Admin / Ops Needs

Corporate would need:

- Vendor/source review queue.
- Product/source review queue.
- Correction/dispute queue.
- Evidence review queue.
- Institutional support workflow.
- Role permission review.
- Audit logs for trust-sensitive actions.
- Monitoring for export/share/publication failures.
- Incident path for private data exposure.
- Legal escalation for high-risk vendor notes.

Before any pilot:

- Define role matrix.
- Define correction/dispute process.
- Define private evidence visibility.
- Define review states.

## 16. Legal / Compliance / Security Risks

Legal risks:

- Vendor reviews can affect business relationships.
- Red-flagging vendors may imply wrongdoing.
- Third-party sources can be stale or wrong.
- Incomplete evidence can be misread.
- Internal notes may be discoverable or sensitive.
- Paid enterprise use can create conflict-of-interest concerns.

Claims to avoid:

- Compliance certified.
- Vendor approved.
- Procurement safe.
- Legally compliant.
- Enterprise security certified.
- Guaranteed ESG compliance.

Privacy/security concerns:

- Private uploaded documents.
- Internal procurement notes.
- Vendor contracts.
- Legal/compliance files.
- Shared reports.
- Role boundaries.

External review needed:

- Legal.
- Security/privacy.
- Accessibility.
- Enterprise procurement/domain advisor.

## 17. Payment And Conflict-Of-Interest Guardrails

Corporate could become a paid product later.

Possible paid surfaces:

- Institutional dashboards.
- Team seats.
- Review packet workflow.
- Export/reporting tools.
- Implementation/support.
- Private source review operations.

Vendors could later pay for profile tools or evidence submission support, but not credibility.

Must be separated from trust outcomes:

- Scores.
- Ranking.
- Verification labels.
- Evidence truth.
- Credibility labels.
- Review status.
- Supplier approval.

Never sell:

- Paid supplier preference.
- Hidden evidence gaps.
- Better scores.
- Suppression of weak evidence.
- Preferred ranking.
- Procurement approval.

Needed disclosures later:

- Who pays Mishava.
- Whether vendor submitted evidence.
- Whether institution pays for dashboard access.
- Payment has no effect on evidence review or trust outputs.

## 18. AI Guardrails For Corporate

AI may later assist with:

- Source discovery suggestions.
- Document summarization.
- Gap detection.
- Draft reviewer notes.
- Claim extraction suggestions.

Human review must remain required for:

- Source verification.
- Vendor claims.
- Corrections/disputes.
- Internal review packet approval.
- Scoring labels.
- Shared reports.

AI must never decide:

- Procurement recommendation.
- Vendor approval.
- Final risk/trust labels.
- Institutional report conclusions.
- Supplier approval.
- Legal/compliance conclusions.
- Payment/access decisions.

Governance needed:

- Central AI control wrapper.
- Persistent budget/cache/logging.
- Human review queue.
- Forbidden-outcome tests.
- Clear UI labels for suggestions.

Rule: AI can suggest; humans decide.

## 19. Relationship To Government

Overlap:

- Procurement/vendor review.
- Evidence packets.
- Dashboards.
- Supplier comparison.
- Audit trails.
- Correction/dispute.

Shared:

- Evidence model.
- Supplier/business identity.
- Scoring/methodology engine.
- Admin review queues.
- Audit logs.

Different:

- Corporate is private/institutional; Government involves public money and public accountability.
- Corporate can start with private workspaces before public transparency.
- Government needs stronger public-record, public-correction, and public-page controls.

Corporate should likely develop before Government because it can mature private procurement/review primitives with lower public-sector exposure.

## 20. Relationship To NGO

Large NGOs, foundations, and networks may eventually use Corporate/Institutional features for procurement, vendor review, or portfolio-level evidence review.

Overlap:

- Evidence library.
- Reports.
- Team roles.
- Shared/private reports.
- Audit logs.

Keep separate:

- NGO public credibility/reporting.
- Institutional vendor review.
- Funder/grant review.
- Procurement notes.
- Consumer/shopping preferences.

Needed boundary:

- Account/organization type and role-aware product surfaces.
- Clear labels for NGO reports vs vendor/procurement review packets.

## 21. Tests And Verification

Corporate-specific tests/scripts found:

- `scripts/subdomain-routing.test.mjs`
  - Confirms Corporate route/subdomain mapping and reserved-page guardrails.
- `scripts/auth-surface-routing.test.mjs`
  - Confirms Corporate sign-up surface copy and next-path normalization.

Related tests:

- Shopping supplier transparency and source tests.
- Scoring/Trust tests.
- Payment firewall tests.
- AI-control/provider guard tests.
- NGO evidence/report/export/access tests.
- Admin/support protection tests.

Untested:

- Corporate dashboard.
- Corporate workspace.
- Corporate roles.
- Vendor lists.
- Procurement projects.
- Internal notes.
- Review packet exports.
- Correction/dispute.
- Paid enterprise entitlements.

Manual/browser testing needed later:

- Dashboard navigation.
- Workspace privacy.
- Vendor list upload.
- Internal notes.
- Export/share flows.

External review needed later:

- Legal.
- Security/privacy.
- Accessibility.
- Enterprise procurement/domain review.
- Methodology approval.

Checks run:

| Command | Result |
| --- | --- |
| `npm test` | Pass, `176/176` |
| `supabase migration list --linked` | Pass; migrations aligned through `202605260009` |
| `npm run typecheck` | Pass |
| `npm run lint` | Fails due missing `fast-glob` required by `@next/eslint-plugin-next` |
| `npm run build` | Pass |

Lint caveat:

```text
Error: Cannot find module 'fast-glob'
Require stack:
- node_modules/@next/eslint-plugin-next/dist/utils/get-root-dirs.js
```

This appears tooling/dependency-related, not Corporate product behavior.

## 22. Guardrails

Confirmed:

- No premature corporate product claims.
- No fake vendor profiles.
- No fake supplier profiles.
- No fake evidence.
- No fake scores.
- No procurement conclusions.
- No paid ranking.
- No paid trust outcomes.
- No AI final trust outcomes.
- No internal/private data exposed publicly.
- No vendor red flags.
- Missing evidence remains visible in shared dependencies.
- Payment cannot influence trust outcomes.
- Dsuupr remains separate.
- `dsuupr-am` was not touched.
- Old Supabase was not touched.

## 23. What Is Missing

### Must Fix Before Corporate Concept Demo

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Corporate concept brief and dependency map | Narrows the product story. | Demo sounds vague or overbuilt. | Small | Documentation |
| First user group/use-case selection | Prevents scope sprawl. | Too many buyers/workflows. | Small | Documentation |
| Safe language/non-claims guide | Prevents overclaiming. | Procurement/compliance confusion. | Small | Documentation |

### Must Fix Before Institutional Pilot Conversation

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Institutional dashboard concept | Shows concrete value. | Conversation stays abstract. | Medium | UX/data plan |
| Vendor/product review packet model | Core Corporate output. | No useful pilot story. | Medium | Methodology/data model |
| Privacy/role model plan | Institutions need private workspaces. | Data boundary confusion. | Medium | Data model/security |

### Must Fix Before Real Institutional Pilot

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Corporate workspace model | Core product. | No real institutional use. | Large | Code/data model |
| Corporate role matrix | Access control. | Private data leakage. | Medium | Code/data model |
| Vendor/product saved lists | Core workflow. | No review workspace. | Medium-large | Code/data model |
| Evidence/source review queue | Trust control. | Unreviewed claims leak. | Large | Code/admin |
| Monitoring/backup/incident proof | Institutional data risk. | Ops/security risk. | Medium | Ops |

### Must Fix Before Private Institutional Workspaces

- Private workspace RLS.
- Private notes.
- Uploaded document access.
- Shared report permissions.
- Role-specific access.
- Audit events.

### Must Fix Before Vendor Correction/Dispute Handling

- Vendor identity verification.
- Evidence submission.
- Dispute lifecycle.
- Audit trail.
- Internal/public visibility separation.
- Legal escalation.

### Must Fix Before Paid Corporate Product

- Enterprise pricing/contract model.
- Payment firewall tests specific to Corporate.
- Support/SLA plan.
- Conflict-of-interest disclosure.
- Legal review.

### Should Fix Soon

- Dedicated Corporate concept brief.
- Corporate domain/live route verification.
- Corporate glossary and forbidden claims list.

### Nice To Have

- Conceptual dashboard wireframe in docs.
- First buyer interview questions.

### Later / Not Now

- Full enterprise dashboard.
- Automated policy alignment.
- Preferred supplier automation.
- Public vendor red flags.
- AI-assisted procurement review.

## 24. What Is Done

Conceptual foundation done:

- Corporate roadmap section.
- Corporate handoff.
- Reserved route copy.

Dependency docs done:

- Shopping handoff.
- Business/Local handoff.
- Scoring/Trust handoff.
- Research/Evidence handoff.
- Admin/Ops/Compliance handoff.
- Government handoff.

Shopping foundations done:

- Product/source records.
- Evidence cards.
- Supplier/manufacturer transparency.
- Score pending guardrails.

Business/Local foundations done:

- Reserved surfaces.
- Supplier/seller relationship direction.
- No-paid-ranking principles.

Research/Evidence foundations done:

- Evidence items.
- Structured claims.
- Research tasks.
- Source/review confidence concepts.

Scoring/Trust guardrails done:

- Score snapshots.
- Draft/rejected exclusion.
- Payment firewall.
- No fake final scores.

Admin/Ops guardrails done:

- Protected admin/support foundation.
- Operational readiness docs.

AI-control guardrails done:

- Central wrapper.
- Default-deny.
- Provider import guard.
- Suggestion-only rule.

Payment firewall thinking done:

- Payment cannot affect trust outputs.

Tests done:

- Reserved Corporate route.
- Corporate auth surface copy.
- Payment firewall.
- AI guard.
- Scoring guardrails.
- Shopping supplier transparency.

Docs done:

- Corporate handoff.
- Full roadmap reset.
- Current-state category review.
- Compliance readiness docs.

## 25. Recommended Next Tasks

### Next 3

1. **Create Mishava Corporate / Institutional Concept Brief and Dependency Map**
   - Purpose: focus the first Corporate story.
   - Scope: target users, first workflow, dependencies, non-goals.
   - Output: `docs/mishava-corporate-institutional-concept-brief-dependency-map.md`.
   - Checks: docs review only.
   - Type: documentation/methodology.
   - Before pilot conversations: yes.
   - Dependencies: Business/Local, Shopping, Research/Evidence, Scoring/Trust, Admin/Ops.

2. **Plan Corporate Vendor/Product Review Packet Model**
   - Purpose: define first useful private institutional output.
   - Output: plan doc.
   - Type: methodology/data model.
   - Before pilot conversations: helpful.
   - Dependencies: Research/Evidence, Scoring/Trust.

3. **Plan Corporate Workspace Privacy And Role Model**
   - Purpose: protect institutional/private data.
   - Output: plan doc.
   - Type: security/data model.
   - Before pilot conversations: yes as a known requirement.
   - Dependencies: Auth/org, Admin/Ops.

### Next 7

4. Plan vendor correction/dispute workflow.
5. Plan institutional dashboard information architecture.
6. Plan saved vendor/product list model.
7. Plan Corporate payment/conflict-of-interest firewall.
8. Plan private notes and uploaded document visibility.
9. Plan Corporate source taxonomy.
10. Plan export/report packet requirements.

### Next 14

11. Plan institutional monitoring/incident/privacy runbook.
12. Plan policy-aligned purchasing support without final scores.
13. Plan supplier/vendor profile dependency from Business/Local.
14. Plan Corporate/Government shared primitives.
15. Plan Corporate legal/accessibility/security review checklist.
16. Plan first internal demo script using no real institutional data.
17. Plan Corporate methodology labels and forbidden labels.

## 26. New Chat Setup

Use the companion brief:

- `docs/chat-handoffs/mishava-corporate-new-chat-brief.md`

Key docs:

- `docs/chat-handoffs/mishava-corporate-deep-current-state-audit.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/chat-handoffs/mishava-shopping-chat-handoff.md`
- `docs/chat-handoffs/mishava-business-local-chat-handoff.md`
- `docs/chat-handoffs/mishava-scoring-trust-chat-handoff.md`
- `docs/chat-handoffs/mishava-research-evidence-chat-handoff.md`
- `docs/chat-handoffs/mishava-admin-ops-compliance-chat-handoff.md`

The new Corporate chat should stay planning-first.

## 27. Suggested First Codex Prompt

```text
Create Mishava Corporate / Institutional Concept Brief and Dependency Map.

Do not implement product features.
Do not add routes, tables, migrations, products, scores, vendor profiles, procurement workflows, payment, AI provider calls, or corporate readiness claims.
Do not touch DNS, Vercel, Supabase, dsuupr-am, or old Supabase.

Use:
- docs/chat-handoffs/mishava-corporate-deep-current-state-audit.md
- docs/chat-handoffs/mishava-corporate-new-chat-brief.md
- docs/mishava-v2-current-state-category-review.md
- docs/mishava-v2-full-build-roadmap-reset.md

Create:
docs/mishava-corporate-institutional-concept-brief-dependency-map.md

Include:
- one-page Corporate/Institutional concept summary;
- intended user groups;
- first safe private institutional workflow;
- dependency map across Shopping, Business/Local, Research/Evidence, Scoring/Trust, Admin/Ops, Compliance, and Infrastructure;
- what can be discussed in exploratory institutional conversations;
- what must not be claimed;
- first three future implementation slices, planning only;
- acceptance criteria for when Corporate can move from concept to design.

Commit only the planning document.
```
