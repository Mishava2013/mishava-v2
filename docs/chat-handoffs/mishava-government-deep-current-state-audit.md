# Mishava Government Deep Current-State Audit

Date: 2026-06-23

## 1. Executive Summary

Mishava Government is intended to become a public-sector trust and evidence layer for procurement, vendor review, public purchasing accountability, and public-facing transparency. The safest positioning is: Mishava Gov may eventually help agencies make, document, and explain evidence-backed purchasing decisions. It is not procurement certification software, not a government authorization package, and not a public-sector compliance claim.

Current readiness is very early. Government has a reserved route, a concept document, shared platform foundations, and guardrails. It does not have an actual government workflow, agency workspace, procurement model, vendor review packet, public reporting portal, correction/dispute flow, or final scoring methodology.

Current honest readiness:

- Government concept readiness: moderate.
- Government product readiness: very low.
- Agency-use readiness: not ready.
- Public-facing procurement accountability readiness: not ready.

What is genuinely done:

- Reserved `/gov` route exists.
- `gov.mishava.org` is supported by subdomain routing.
- `organization_type` includes `gov`.
- Sign-up copy can render a Government-specific account surface.
- High-level Government concept doc exists.
- Related foundations exist in Shopping supplier transparency, NGO evidence/reporting, scoring guardrails, AI guardrails, payment firewall, and admin/support/compliance docs.

What is not done:

- No government dashboard.
- No government-specific database model beyond generic `organization_type = gov`.
- No procurement projects, vendor lists, contracts, or agency review packets.
- No vendor correction/dispute workflow for government use.
- No government-specific methodology.
- No public transparency portal.
- No legal review for public-sector vendor review.

What is live:

- Reserved `/gov` page only. It says Government is coming soon and not live for government use.

What is built but not exposed:

- Shared evidence, claims, score snapshot, audit log, organization, membership, pricing, and feature gate foundations exist.
- Shopping has supplier/manufacturer transparency primitives.
- NGO has reporting and evidence flows.
- Admin has protected support/dashboard primitives.

What is only conceptual/planned:

- Public purchasing transparency.
- Vendor/product evidence review.
- Procurement Trust Snapshots.
- Policy alignment and exception justification.
- Public transparency portal.
- Media/public reporting layer.

What is blocked by other categories:

- Business/Local/Supplier/Seller claim and profile workflows.
- Research/evidence review queues.
- Scoring methodology and reviewed structured claims.
- Admin/Ops review/correction queues.
- Legal/compliance/security review.

Honest next step:

Create a Government concept brief and dependency map. Do not build Government product features yet.

Pilot posture:

- Ready for internal planning and careful exploratory conversations only.
- Not ready for agency pilots.
- Not ready for actual agency use.
- Not ready for public procurement pages.

Irresponsible to claim now:

- FedRAMP authorization.
- Government readiness.
- Procurement certification.
- Vendor approval/rejection.
- Public-sector compliance review.
- Final Mishava Scores for government purchasing.
- Any automated procurement recommendation.

## 2. Percent Estimates

| Area | Estimate | Why reasonable | Moves higher if | Moves lower if | Biggest uncertainty |
| --- | ---: | --- | --- | --- | --- |
| Overall Government readiness | 6-9% | Reserved surface and concept exist; product is not built. | Concept brief, dependency map, and first data model plan are completed. | Gov is treated as live before dependencies mature. | Whether Gov begins as agency tool or transparency portal. |
| Government concept readiness | 35-45% | `mishava-gov-product-concept.md` defines strong direction. | User groups, first use case, and non-goals are narrowed. | Concept expands too broadly. | First target agency/user type. |
| Public procurement support readiness | 5-8% | Procurement concept exists; no workflow exists. | Vendor list/review packet model is planned. | Scoring is overused before methodology. | Scope: products, vendors, contracts, or all. |
| Vendor review readiness | 10-15% | Supplier transparency and evidence primitives exist from Shopping. | Business/Supplier profile claim flow is built. | Vendors can self-claim truth without review. | Identity and correction workflow complexity. |
| Public accountability/reporting readiness | 4-8% | NGO reports and public transparency concept exist. | Public/private visibility model is designed. | Public pages launch without legal/correction process. | Legal risk around public red flags. |
| Business/Supplier dependency readiness | 15-20% | Reserved surfaces and supplier primitives exist. | Claim flow and evidence submission are built. | Business profile work stays placeholder-only. | Supplier identity verification depth. |
| Scoring/Trust dependency readiness | 48-53% | Snapshot, claim, and payment guardrails exist. | Category methodology and correction process mature. | Government tries to use final scores early. | Government-specific scoring labels. |
| Research/Evidence dependency readiness | 50-55% | Source tasks, evidence cards, and supplier confidence fields exist. | Source review queue and stale-data cadence are built. | Research tasks become facts. | Operational review cost. |
| Admin/Ops/Compliance dependency readiness | 48-53% | Protected admin/support and compliance docs exist. | Review queues, incidents, backups, monitoring are proven. | Public red flags launch without review ops. | Staffing and legal escalation process. |
| Legal/compliance readiness | 20-28% | Conservative compliance posture exists. | External legal/accessibility/security review occurs. | Gov pages imply authorization/certification. | Public-sector procurement liability. |
| Security/privacy readiness | 35-45% | Auth/RLS/file guardrails exist; ops proof is incomplete. | Monitoring, backup, incident, real inbox tests complete. | Sensitive procurement data is made public too early. | Public/private visibility rules. |
| Public launch readiness | 2-5% | Only reserved page is safe publicly. | Full workflow, legal review, correction process, and ops are ready. | Any public procurement claims are made now. | Government legal exposure. |

## 3. Intended Government Users

| User group | Need | Mishava could help with | Mishava should not promise | Evidence required | Risks |
| --- | --- | --- | --- | --- | --- |
| City/county/state procurement staff | Compare vendors/products and document reasoning. | Evidence status, gaps, review packets, exception notes. | Approval, legal compliance, or best-vendor conclusion. | Vendor identity, source docs, policies, contracts, price/availability context. | Overreliance on preliminary evidence. |
| Public agency department heads | Understand procurement choices and tradeoffs. | Plain summaries and decision snapshots. | Automatic decision-making. | Procurement context, alternatives, constraints. | Misreading incomplete evidence as disqualification. |
| Elected officials/staff | Oversight and public explanation. | Public summaries and exception context. | Political cover or legal certainty. | Reviewed public records and agency notes. | Partisan misuse. |
| Public housing/affordable housing agencies | Review vendors with public-money constraints. | Evidence packets and compliance-adjacent documentation. | Housing compliance certification. | Vendor records, certifications, contract history. | Sensitive resident/vendor context. |
| School districts | Review vendors/products for budget and community values. | Product/vendor evidence and policy alignment. | Safety or legal approval. | Product specs, vendor docs, public records. | Student/privacy and public controversy risk. |
| Public works/facilities teams | Evaluate suppliers, materials, and maintenance vendors. | Supplier evidence, lifecycle notes, source freshness. | Engineering approval. | Product/vendor certifications, sourcing, maintenance requirements. | Technical/safety claims. |
| Grants/compliance teams | Preserve evidence for grant-funded purchases. | Audit-ready packets and evidence trails. | Grant compliance determination. | Grant terms, procurement records, vendor documents. | Compliance overclaims. |
| Watchdog/community groups | Understand public spending. | Public summaries and evidence gaps. | Accusations or wrongdoing conclusions. | Public records, agency-published reports, vendor responses. | Defamation and incomplete context. |
| Vendors responding to requirements | Submit/correct evidence. | Evidence submission and correction path. | Paid credibility or guaranteed agency preference. | Identity docs, certifications, source records. | Paid influence perception. |
| Citizens/public viewers | See why decisions were made. | Clear public summaries. | Full private procurement file access. | Public records and reviewed summaries. | Misinterpretation of limits. |
| Mishava reviewers/admins | Review evidence, corrections, and disputes. | Queues, audit logs, source checklists. | Silent trust manipulation. | Source URLs, review notes, role history. | Review burden and escalation risk. |

## 4. Government Use-Case Map

| Use case | Status | Live? | Dependency | Likely data needed | Risk | Build first? |
| --- | --- | --- | --- | --- | --- | --- |
| Vendor/supplier review | Not built | No | Business/Supplier, Research, Scoring | Vendor identity, ownership, evidence, correction path | High | Plan after Business/Supplier claim flow |
| Procurement transparency | Conceptual | No | Gov, Admin/Ops, Legal | Procurement decision, evidence, alternatives, visibility rules | High | Later |
| Ethical sourcing checks | Partial dependency only | No | Shopping/Research/Scoring | Supplier, sourcing docs, claims, confidence | Medium-high | After reviewed claims |
| Public purchasing accountability | Conceptual | No | Gov, Legal, Reporting | Public summaries, decisions, exceptions | High | Later |
| Grant/vendor documentation | Partial via NGO evidence/reporting primitives | No Gov workflow | NGO evidence/reporting | Files, claims, audit events | Medium | Could inform design |
| Public report pages | Partial via NGO shared reports | No Gov pages | Reporting, Legal | Visibility rules, redaction, citations | High | Later |
| Contract/vendor evidence files | Partial primitives | No | Evidence/file storage | Contracts, vendor docs, review state | High | Data model first |
| Red-flag tracking | Not built | No | Research/Admin/Legal | Source, severity, review, correction | Very high | Do not build first |
| Vendor correction/dispute workflow | Not built | No | Admin/Ops/Legal | Vendor identity, disputed claim, evidence, audit trail | Very high | Required before public pages |
| Local/small-business visibility | Not built | No | Business/Local | Local profile, ownership, categories, evidence | Medium | Business/Local first |
| Supplier diversity support | Conceptual | No | Business/Local/Legal | Certification source, identity, review state | High | Later with legal review |
| Agency dashboard | Not built | No | Gov/Auth/Admin | Agency, department, projects, users | Medium-high | After concept brief |
| Public transparency view | Reserved only | No | Gov/Legal/Ops | Public summaries, visibility flags, corrections | Very high | Later |
| Export/reporting tools | Partial via NGO exports | No Gov workflow | Reports/Admin | Review packet, CSV/PDF, audit trail | Medium | Later |

## 5. Current Route / Product Status

- Government route: `src/app/gov/page.tsx`.
- Route type: public reserved/coming-soon page.
- Subdomain routing: `gov.mishava.org` maps to `/gov`.
- Page status: explicitly says Gov is not live for government use.
- Government dashboards: absent.
- Government-specific data models: absent, except generic `organization_type = 'gov'`.
- Government-specific tests: limited to reserved-page and auth surface copy tests.
- Government-specific docs: `docs/mishava-gov-product-concept.md` and the earlier handoff.
- Live product: no.
- Should not be exposed yet: any procurement dashboard, vendor ranking, public red flags, agency onboarding, or procurement conclusions.

## 6. Relationship To Business / Local / Supplier / Seller

Government depends heavily on Business/Local/Supplier/Seller work.

Needed before serious Government work:

- Business/vendor profile identity.
- Profile claim flow.
- Supplier/seller relationship model.
- Catalog/product ownership.
- Evidence submission and review states.
- Correction/dispute path.
- Clear separation of retailer, seller, brand owner, manufacturer, supplier, parent company, and private-label owner.

Small/local businesses should be treated fairly:

- Do not penalize small businesses merely for lacking polished documentation.
- Show evidence gaps without implying wrongdoing.
- Allow correction/evidence submission.
- Separate evidence coverage from moral/trust conclusions.

Business/Local work that must happen first:

1. Claim flow plan.
2. Profile ownership state.
3. Evidence submission workflow.
4. Admin/source review queue.
5. Correction/dispute workflow.

## 7. Relationship To Scoring / Trust

Government should not use final Mishava Scores until reviewed evidence and approved methodology exist.

Near-term Government should use evidence/readiness states, not final scores:

- Evidence available.
- Evidence missing.
- Review needed.
- Source stale.
- Vendor response pending.
- Public record checked.
- Mishava review not finalized.

Reviewed vs unreviewed evidence must be visibly separate. Confidence, coverage, and recency should display as support context, not as procurement recommendations.

Unsafe scoring labels:

- Approved vendor.
- Certified vendor.
- Government-ready.
- Procurement-safe.
- Compliant.
- High-risk vendor, if public and unsupported by legal/review/correction process.
- Best vendor.

Potentially safer later labels:

- Evidence profile complete.
- Evidence profile incomplete.
- Reviewed evidence available.
- Source coverage: low/medium/high.
- Review status: pending/reviewed/stale.
- Procurement review packet ready, only if defined by method and not an approval.

## 8. Relationship To Research / Evidence

Government would need source types including:

- Official vendor documents.
- Business registration records.
- Certification databases.
- Procurement records.
- Enforcement records.
- NGO reports.
- Credible journalism.
- Public complaints/disputes.
- Audit/compliance documents.
- Government/public datasets.

Already partly supported:

- Generic evidence items with source type, URL/path, reviewed status, confidence, visibility.
- Structured claims tied to evidence.
- Shopping evidence/source cards.
- Supplier/manufacturer transparency and source confidence.
- Research task status model.

Missing:

- Government/public-record source taxonomy.
- Public records citation policy.
- Conflict/staleness handling.
- Source review queue.
- Vendor response/correction evidence.
- Legal escalation workflow.

Before Government can work, Research/Evidence needs human-reviewed source workflows, stale data cadence, clear public/private visibility rules, and correction/dispute support.

## 9. Public Accountability / Reporting

Mishava Government may eventually produce public-facing pages, but not yet.

Public pages should eventually show:

- Agency/department summary where appropriate.
- Vendor/product reviewed.
- Evidence coverage.
- Public source links.
- What is known.
- What is missing.
- Agency exception notes where approved for public display.
- Vendor response/correction status.

Should remain private/internal:

- Sensitive procurement strategy.
- Private vendor documents.
- Security-sensitive materials.
- Draft reviewer notes.
- Legal advice.
- Internal deliberation.
- Non-public complaints unless approved.

Legal risk:

- Defamation.
- Procurement challenge.
- False implication of wrongdoing.
- Disclosure of sensitive documents.
- Misuse of incomplete evidence.
- Apparent pay-to-play influence.

Required disclaimers:

- Evidence may be incomplete.
- Mishava does not make legal procurement decisions.
- Agency decisions remain agency responsibility.
- Vendor responses/corrections may be pending.
- Scores, if any, are methodology-specific and not certification.

## 10. Procurement Workflow Concept

A safe first procurement-support workflow should be internal and evidence-status-oriented:

1. Agency creates a private procurement review project.
2. Agency uploads or lists vendors/products under consideration.
3. Mishava shows whether each vendor/product has an evidence profile.
4. Missing evidence is listed plainly.
5. Public-source concerns can be flagged for human review only.
6. Reviewer creates a private evidence packet.
7. Agency can export a review packet.
8. Final agency decision and exception notes remain agency-owned.

Human review required:

- Source verification.
- Public red flags.
- Corrections/disputes.
- Final public summaries.
- Any scoring/methodology output.

Never automate:

- Vendor approval/rejection.
- Legal compliance conclusion.
- Procurement recommendation.
- Public accusation.
- Supplier approval.
- Publishing public red flags.

Build only after Business/Local and Research/Evidence mature:

- Agency onboarding.
- Vendor lists.
- Vendor correction/dispute.
- Procurement snapshots.
- Public transparency portal.

## 11. Vendor Correction / Dispute Workflow

Current status: not built.

Needed:

- Vendor can submit correction.
- Vendor can submit evidence.
- Vendor can dispute public claim.
- Agency can add internal notes.
- Mishava can preserve audit history.
- Mishava can show correction pending/resolved/rejected states.

Required before public government use:

- Identity verification for correcting party.
- Source/evidence review.
- Audit trail.
- Public correction status.
- Legal escalation path.
- Takedown/redaction policy for sensitive or disputed material.

Risk if missing:

- Public pages could unfairly harm vendors.
- Agencies could rely on outdated or incorrect data.
- Legal exposure increases sharply.

## 12. Data Model Needs

| Model | Status | Likely source/current table | Risk | Dependency | Tests needed |
| --- | --- | --- | --- | --- | --- |
| Government agencies | Partial generic | `organizations` with `organization_type = gov` | Medium | Auth/org model | Agency creation and membership tests |
| Departments | Missing | New table likely | Medium | Agency model | Department access/visibility tests |
| Agency users | Partial generic | `organization_memberships`, roles | Medium | Role model | Gov role permission tests |
| Public procurement projects | Missing | New table likely | High | Agency model | Project CRUD/access tests |
| Vendor lists | Missing | New table or relationship model | High | Business/Supplier | Vendor list isolation tests |
| Vendor review packets | Missing | New table likely | High | Evidence/Scoring/Admin | Packet export/access tests |
| Contracts | Missing | New table likely | High | Procurement model | Contract visibility tests |
| Public reports | Partial primitives | NGO report/shared report concepts | High | Legal/Ops | Public/private report tests |
| Evidence records | Partial generic | `evidence_items` | Medium | Evidence workflow | Gov source taxonomy tests |
| Public/private notes | Partial generic | `audit_events`, evidence notes | High | Visibility model | Redaction/access tests |
| Correction/dispute records | Missing | New table likely | Very high | Admin/Ops/Legal | Dispute lifecycle tests |
| Audit logs | Partial generic | `audit_events` | Medium | Admin/Ops | Append-only/access tests |
| Exports | Partial via NGO | NGO CSV/print routes | Medium | Reporting | Gov packet export tests |
| Business/supplier relationships | Partial Shopping-specific | `shopping_products`, places-to-buy | Medium-high | Business/Local | Identity separation tests |

## 13. Admin / Ops Needs

Government would need:

- Vendor/source review queue.
- Public red-flag review queue.
- Correction/dispute queue.
- Agency support workflow.
- Evidence visibility/redaction controls.
- Role permissions for agency users, Mishava reviewers, legal reviewers, and support.
- Append-only audit events.
- Monitoring for failed evidence/publication workflows.
- Incident response path for public data errors.
- Legal escalation triggers before publication.

Before any pilot:

- At minimum, define roles, review states, and correction/dispute process.
- Do not expose public red flags.

## 14. Legal / Compliance / Security Risks

Legal risks:

- Public-sector vendor reviews can affect contracts and reputation.
- Public red flags can imply wrongdoing.
- Third-party sources can be wrong, stale, or incomplete.
- Procurement decisions may be challenged.
- Public records may include privacy/security limits.

Claims to avoid:

- FedRAMP authorized.
- Government certified.
- Procurement approved.
- Legally compliant vendor.
- Vendor verified for government use.
- Required purchasing recommendation.

Security/privacy concerns:

- Sensitive procurement documents.
- Vendor confidential information.
- Agency internal notes.
- Public/private visibility boundaries.
- Role-based access.
- Audit log integrity.

Accessibility:

- Public-sector use likely requires stronger accessibility review than current baseline.
- WCAG/Section 508 readiness should be externally reviewed before agency use.

External review needed:

- Legal.
- Accessibility.
- Security/privacy.
- Procurement domain advisor.

## 15. Payment And Conflict-Of-Interest Guardrails

Government could be a paid product later, but payment must pay for tools and support, not trust outcomes.

Potential paid surfaces:

- Agency dashboards.
- Implementation/setup.
- Review packet workflows.
- Public transparency portal hosting.
- Export/reporting tools.

Vendor payment risks:

- Vendors may eventually pay for profile tools or evidence submission support, but cannot buy favorable treatment.

Must remain separated:

- Trust outcomes.
- Vendor ranking.
- Verification labels.
- Evidence truth.
- Public credibility labels.
- Methodology outputs.
- Public red flags.

Never sell:

- Paid vendor preference.
- Suppression of weak evidence.
- Better scoring.
- Public-sector credibility label.
- Procurement approval.

Conflict disclosures needed later:

- Who pays Mishava.
- Whether vendor submitted evidence.
- Whether agency or vendor paid for tools.
- Clear statement that payment does not affect evidence review or public trust outputs.

## 16. AI Guardrails For Government

AI may eventually assist with:

- Source discovery suggestions.
- Document summarization.
- Gap detection.
- Draft reviewer notes.
- Evidence categorization.

Human review must remain required for:

- Source verification.
- Vendor claims.
- Public red flags.
- Correction/dispute outcomes.
- Procurement packet publication.
- Any scoring or confidence status.

AI must never decide:

- Procurement recommendation.
- Vendor approval/rejection.
- Final risk/trust labels.
- Public report publication.
- Legal/compliance conclusion.
- Supplier/seller approval.
- Payment/access decision.

Governance needed before AI in Gov workflows:

- Central AI control wrapper remains required.
- Budget/cache/logging hooks must be persistent.
- Public AI output policy.
- Human review queue.
- Legal escalation for high-risk outputs.

Rule: AI can suggest; humans decide.

## 17. Relationship To Corporate / Institutional

Overlap with Corporate:

- Vendor review.
- Procurement support.
- Evidence packets.
- Dashboards.
- Exports.
- Audit trails.
- Supplier comparison.

Shared primitives:

- Organization/membership/access model.
- Evidence items.
- Structured claims.
- Score snapshots.
- Supplier/business profiles.
- Correction/dispute workflow.
- Admin review queues.

Different for Government:

- Public money.
- Public accountability.
- Public records.
- Public transparency.
- Higher legal/procurement scrutiny.
- Public-facing summaries.
- More conservative publication and correction requirements.

Centralize:

- Evidence/research model.
- Supplier identity.
- Scoring methodology engine.
- Admin review queues.
- Audit logs.

Category-specific:

- Agency procurement policy.
- Public/private visibility.
- Exception justification.
- Public reporting.
- Procurement legal disclaimers.

## 18. Tests And Verification

Government-specific tests/scripts found:

- `scripts/subdomain-routing.test.mjs`
  - Covers `gov` subdomain routing and reserved page guardrail language.
- `scripts/auth-surface-routing.test.mjs`
  - Covers Government-specific sign-up surface copy and routing normalization.

Related dependency tests:

- Shopping supplier transparency tests in `scripts/release-4-shopping.test.mjs`.
- Scoring/payment firewall tests across `scripts/payment-firewall.test.mjs` and scoring-related tests.
- AI-control tests in `scripts/ai-control-foundation.test.mjs` and `scripts/ai-provider-import-guard.test.mjs`.
- Admin/support and compliance readiness tests in NGO/admin scripts.

Untested:

- Government agency dashboard.
- Government roles.
- Vendor review packets.
- Procurement projects.
- Public transparency pages.
- Correction/dispute workflow.
- Government export/reporting.
- Government public/private visibility.

Manual/browser testing needed later:

- Agency onboarding.
- Agency dashboard.
- Vendor packet review.
- Public transparency page.
- Correction/dispute flow.

External review needed later:

- Legal.
- Procurement domain expert.
- Security/privacy.
- Accessibility/Section 508.
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

This appears to be tooling/dependency resolution, not Government product behavior.

## 19. Guardrails

Confirmed:

- No premature government product claims.
- No fake vendor profiles.
- No fake supplier profiles.
- No fake evidence.
- No fake scores.
- No public procurement conclusions.
- No paid ranking.
- No paid trust outcomes.
- No AI final trust outcomes.
- No public red flags.
- Missing evidence remains visible in shared dependencies.
- Payment cannot influence trust outcomes.
- Dsuupr remains separate.
- `dsuupr-am` was not touched.
- Old Supabase was not touched.

## 20. What Is Missing

### Must Fix Before Government Concept Demo

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Government concept brief and dependency map | Narrows the first story. | Demo sounds like vapor or overclaim. | Small | Documentation |
| User group/use-case prioritization | Prevents sprawling product. | Too many workflows at once. | Small | Documentation |
| Safe language/non-claims guide | Avoids public-sector overclaiming. | Legal/compliance confusion. | Small | Documentation |

### Must Fix Before Agency Pilot Conversation

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Procurement evidence packet plan | Shows practical value. | Conversation stays abstract. | Medium | Methodology/data plan |
| Business/Supplier dependency plan | Vendor identity is core. | Agencies cannot trust records. | Medium | Data model |
| Legal risk review checklist | Public sector is sensitive. | Overclaims and exposure. | Medium | External/manual |

### Must Fix Before Real Agency Pilot

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Agency/org roles | Controls access. | Private data leakage. | Medium | Code/data model |
| Procurement project model | Core workflow. | No actual agency use. | Large | Code/data model |
| Vendor list/review packet model | Core workflow. | No usable review. | Large | Code/data model |
| Review queue | Human review required. | Unreviewed claims leak. | Large | Code/admin |
| Real monitoring/backups | Agency data requires ops proof. | Reliability/security risk. | Medium | Ops |

### Must Fix Before Public-Facing Government Pages

| Item | Why it matters | Risk if skipped | Effort | Type |
| --- | --- | --- | --- | --- |
| Correction/dispute workflow | Fairness/legal requirement. | Vendor harm/legal exposure. | Large | Code/legal |
| Public/private visibility model | Prevents oversharing. | Sensitive disclosure. | Large | Code/legal |
| External legal review | Public vendor claims are high risk. | Defamation/procurement risk. | Medium | External review |
| Public records citation rules | Sources need clarity. | Misleading reports. | Medium | Methodology |

### Must Fix Before Vendor Correction/Dispute Handling

- Vendor identity verification.
- Evidence submission.
- Dispute lifecycle.
- Audit trail.
- Public correction status.
- Legal escalation.

### Must Fix Before Paid Government Product

- Conflict-of-interest disclosure.
- Payment firewall tests specific to Gov.
- Agency billing separated from trust outcomes.
- Vendor payment policy.
- Legal/financial review.

### Should Fix Soon

- Domain/live route table for `gov.mishava.org`.
- Reserved-page screenshot and wording review.
- Government glossary.

### Nice To Have

- Example fictional workflow diagrams in docs only, clearly labeled conceptual.
- Public-sector advisor interview notes.

### Later / Not Now

- Public transparency portal.
- Media reporting system.
- Policy alignment engine.
- Exception justification UI.
- AI-assisted public records summarization.

## 21. What Is Done

Conceptual foundation done:

- `docs/mishava-gov-product-concept.md`.
- Roadmap Government section.
- Government handoff.

Dependency docs done:

- Business/Local handoff.
- Corporate handoff.
- Scoring/Trust handoff.
- Research/Evidence handoff.
- Admin/Ops/Compliance handoff.

Business/Local foundations done:

- Reserved surfaces.
- Supplier/manufacturer transparency direction.
- Payment/no-paid-ranking principles.

Research/Evidence foundations done:

- Evidence items.
- Structured claims.
- Research task statuses.
- Source/evidence cards in Shopping.
- Confidence labels.

Scoring/Trust guardrails done:

- Score snapshots.
- Draft/rejected claim exclusions.
- Payment firewall.
- No fake final scores.

Admin/Ops guardrails done:

- Protected admin/support foundation.
- Compliance readiness docs.
- Operational checklists.

AI-control guardrails done:

- Central AI wrapper.
- Default-deny controls.
- Provider import guard.
- Suggestion-only rule.

Payment firewall thinking done:

- Payment cannot affect ranking, score, verification, or trust outcomes.

Tests done:

- Reserved Gov route guardrail.
- Gov sign-up surface copy.
- Subdomain routing.
- Payment firewall.
- AI provider guard.
- Scoring guardrails.

Docs done:

- Government concept.
- Full roadmap.
- Current-state category review.
- Related handoffs.

## 22. Recommended Next Tasks

### Next 3

1. **Create Mishava Government Concept Brief and Dependency Map**
   - Purpose: turn the high-level concept into a focused planning artifact.
   - Scope: users, use cases, dependencies, non-goals, first demo story.
   - Output: `docs/mishava-government-concept-brief-dependency-map.md`.
   - Checks: docs review only.
   - Type: documentation/methodology.
   - Before pilot conversations: yes.
   - Dependencies: Business/Local, Research/Evidence, Scoring/Trust.

2. **Plan Government Procurement Evidence Packet Model**
   - Purpose: define a safe first review packet without final scores.
   - Output: plan doc.
   - Checks: guardrail text checks if implemented later.
   - Type: data model/methodology.
   - Before pilot conversations: helpful.
   - Dependencies: Research/Evidence, Scoring/Trust.

3. **Plan Government Vendor Correction/Dispute Workflow**
   - Purpose: protect fairness before public pages.
   - Output: plan doc.
   - Type: legal/ops/data model.
   - Before pilot conversations: yes as a stated requirement.
   - Dependencies: Admin/Ops, Business/Supplier.

### Next 7

4. Plan agency roles and access model.
5. Plan public/private procurement visibility model.
6. Plan conflict-of-interest/payment firewall for Gov.
7. Plan legal/accessibility/security review checklist for Gov.
8. Plan Gov-specific source taxonomy.
9. Plan agency dashboard information architecture.
10. Plan procurement exception justification model.

### Next 14

11. Plan public transparency portal boundaries.
12. Plan vendor evidence submission from Business/Supplier profiles.
13. Plan procurement packet exports.
14. Plan Gov monitoring/incident/privacy runbook.
15. Plan government-specific methodology labels and forbidden labels.
16. Plan public records citation/staleness policy.
17. Plan first internal demo script with no real agency data.

## 23. New Chat Setup

Use the companion brief:

- `docs/chat-handoffs/mishava-government-new-chat-brief.md`

Key docs:

- `docs/chat-handoffs/mishava-government-deep-current-state-audit.md`
- `docs/mishava-gov-product-concept.md`
- `docs/mishava-v2-current-state-category-review.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/chat-handoffs/mishava-business-local-chat-handoff.md`
- `docs/chat-handoffs/mishava-scoring-trust-chat-handoff.md`
- `docs/chat-handoffs/mishava-research-evidence-chat-handoff.md`
- `docs/chat-handoffs/mishava-admin-ops-compliance-chat-handoff.md`

The new Government chat should remain planning-first.

## 24. Suggested First Codex Prompt

```text
Create Mishava Government Concept Brief and Dependency Map.

Do not implement product features.
Do not add routes, tables, migrations, products, scores, vendor profiles, procurement workflows, payment, AI provider calls, or public government claims.
Do not touch DNS, Vercel, Supabase, dsuupr-am, or old Supabase.

Use:
- docs/chat-handoffs/mishava-government-deep-current-state-audit.md
- docs/chat-handoffs/mishava-government-new-chat-brief.md
- docs/mishava-gov-product-concept.md
- docs/mishava-v2-current-state-category-review.md

Create:
docs/mishava-government-concept-brief-dependency-map.md

Include:
- one-page Government concept summary;
- intended user groups;
- first safe use-case sequence;
- dependency map across Business/Local, Research/Evidence, Scoring/Trust, Admin/Ops, Compliance, and Infrastructure;
- what can be discussed in exploratory agency conversations;
- what must not be claimed;
- first three future implementation slices, planning only;
- acceptance criteria for when Government can move from concept to design.

Commit only the planning document.
```
