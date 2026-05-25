# NGO + Shopping Readiness Audit

Date: 2026-05-24

Scope: This audit reviews the current Mishava NGO and Mishava Shopping readiness after Release 2.5 live verification, Release 3 Slices 1-3, and Release 4 Slices 1-3. It does not add features, migrations, fake data, fake scores, or implementation changes.

## Readiness Summary

| Area | Rating | Reason |
| --- | --- | --- |
| Mishava NGO | Demo-ready | The core authenticated NGO slice is live-verified and database-backed for onboarding, evidence creation, evidence library viewing, draft structured claims, draft report creation, private defaults, and audit events. It is not pilot-ready because final auth, file uploads, sharing, exports, claim review operations, and production support workflows are incomplete. |
| Mishava Shopping | Demo-ready | Shopping is ready for a controlled real-data-only POC walkthrough with safe empty states, product/category/detail readiness, score-pending states, score popup explanations, Shopping Priorities persistence, and payment-firewall language. It is not pilot-ready because real product ingestion, source review, places-to-buy data, published product scoring, and Your Values Score calculation are not complete. |
| Shared trust/security | Functional foundation verified | The clean V2 Supabase project is aligned, core route/RLS protections have been verified, payment firewall tests pass, snapshots remain append-only, and ignored artifacts/secrets are not committed. Production readiness still depends on final auth, storage security, legal/privacy/accessibility work, and operational playbooks. |

## NGO Readiness

| Check | Status | Evidence / Notes | Risk |
| --- | --- | --- | --- |
| Onboarding creates real org/profile rows | Pass | Release 2.5 live verification confirms organizations, organization_memberships, ngo_profiles, and audit_events were created in `mishava-v2-dev`. | Low for demo; final auth still needed for pilot. |
| Org route protection works | Pass | `/org/*` requires authenticated user and organization membership in current temporary cookie abstraction. | Medium until final hosted auth is implemented. |
| Evidence creation works | Pass | Release 2.5 confirms `/org/evidence` creates evidence_items, optional ngo_evidence_submissions, and audit_events. | Low for manual evidence demos. |
| Evidence library displays created evidence | Pass | `/org/evidence` now lists organization evidence with title, type, source/URL/notes, visibility, verification status, created date, and linked structured claim count. | Low for demo. |
| Structured claim draft path exists | Pass | Release 3 Slice 3 added a minimal evidence-to-structured-claim path and guarded acceptance rules from Slice 2 remain in place. | Medium; full reviewer UI and operations workflow are not complete. |
| Report creation works | Pass | `/org/reports` supports private draft report creation from template, selected evidence, and selected accepted claims. | Medium; no export/share approval flow yet. |
| Reports are private by default | Pass | Release 3 Slice 3 keeps reports private and protected by organization membership. | Low. |
| Audit events are written | Pass | Audit events exist for onboarding, evidence creation/update, scoring-sensitive flows, structured claim review actions, and report creation where implemented. | Low; future admin viewer and sampling workflow needed. |
| Sharing/export limitations are clearly labeled | Partial | `/org/reports` labels exports and sharing as not enabled; `/ngo/sharing` remains more display-only/future-facing. | Medium; tighten labels before pilot. |
| Display-only pages are clearly not misleading | Partial | Several routes are intentionally scaffolded or display-only, including `/org/team`, `/org/billing`, and parts of `/ngo/sharing`. | Medium; could confuse pilot users. |
| Mobile/basic usability status | Partial | Core forms are usable, but no full mobile/accessibility QA pass has been completed for NGO workflows. | Medium for pilot. |

NGO rating: demo-ready, not pilot-ready.

## Shopping Readiness

| Check | Status | Evidence / Notes | Risk |
| --- | --- | --- | --- |
| Shopping page renders | Pass | Release 4 Slice 1 and Slice 3 confirmed `/shopping` renders with safe real-data-only states and score popup readiness. | Low for controlled demo. |
| Category pages render | Pass | Category readiness exists for the first POC area: baby products / diapers / wipes. | Low for demo; no real ingestion pipeline yet. |
| Product detail pages render | Pass | Product detail pages support product context, places-to-buy readiness, trust status, and safe score states. | Medium until real records are available. |
| Products require real-source metadata | Pass | Release 4 Slice 1 added real-data constraints and tests; production seed data is not used. | Low. |
| No fake products/stores/evidence/scores exist | Pass | Current implementation uses real-data-only empty states and avoids invented products, stores, evidence, or scores. | Low. |
| Score states are safe | Pass | Products without supported scoring data show pending/draft states rather than invented numbers. | Low. |
| Score popup works | Pass | Release 4 Slice 3 added accessible trust explanation popup states for shopping cards and product details. | Low for demo. |
| Shopping Priorities save/update live | Pass | Release 4 Slice 2 added live persistence for Shopping Priorities and red-line setting storage. | Medium; final auth/session model still temporary. |
| Your Values Score is withheld until valid | Pass | Tests verify Your Values Score does not appear without priorities and enough supported evidence/scoring data. | Low. |
| Places-to-buy does not use commission/affiliate/payment | Pass | Ranking/payment firewall tests verify paid and commission-like fields do not affect places-to-buy ordering. | Low. |
| No-commission/payment-firewall language is visible | Pass | Score popup and shopping trust copy state that payment does not affect score/ranking and Mishava does not earn shopping commissions from outbound links. | Low. |
| Mobile/basic usability status | Partial | Recent visual pass improved presentation, but a full mobile/accessibility QA pass across shopping cards, popups, and detail pages is still needed. | Medium. |

Shopping rating: demo-ready for a controlled POC shell and trust explanation walkthrough, not pilot-ready for real consumer shopping.

## Shared Trust / Security / Readiness

| Check | Status | Evidence / Notes | Risk |
| --- | --- | --- | --- |
| Migrations aligned on `mishava-v2-dev` | Pass | Clean V2 Supabase migration list is aligned through `202605240010`. | Low. |
| Old `mishava` project untouched | Pass | Release docs and current workflow preserve the old project boundary: `mishava / tghbfautnxblfxrtkdqb` was not modified. | Low. |
| Route protection still works | Pass | Automated route-protection tests pass for protected org/admin paths. | Medium until final auth provider replaces temporary cookie abstraction. |
| RLS checks still pass where relevant | Pass | Release 2.5 and Release 3 checks verify org/evidence/snapshot privacy and wrong-org blocking. | Medium; retest after final auth/storage. |
| Audit logs exist for sensitive flows | Pass | Audit events are written for onboarding, evidence, reports, scoring versions, and score snapshot actions where implemented. | Low. |
| Payment firewall tests pass | Pass | Tests verify payment, subscription, hosted profile, claimed profile, sponsorship, commission, affiliate, and referral-like fields cannot affect score or ranking helpers. | Low. |
| Snapshot immutability still works | Pass | Release 3 Slice 1 verified append-only score snapshots and visibility safeguards. | Low. |
| No secrets or ignored artifacts committed | Pass | `.env.local`, `screenshots/`, and `supabase/.temp/` remain ignored; `.env.example` is committed and safe. | Low. |

## Top 10 Blockers Before Pilot Use

1. Replace the temporary cookie auth abstraction with the final hosted auth provider, including secure sessions, MFA-ready admin access, and role hardening.
2. Add production-safe file upload/storage with organization isolation, malware scanning, visibility controls, redaction support, and retention rules.
3. Implement scoped NGO sharing grants and protected shared views before exposing reports to funders, donors, press, or partners.
4. Build accessible report export workflows for PDF, Word, and Excel with privacy controls and audit logs.
5. Complete structured claim review operations with reviewer permissions, status transitions, disagreement handling, and audit trail visibility.
6. Build the Shopping product ingestion and admin review path for real baby products, places-to-buy, sources, and source freshness.
7. Establish source/data rights rules for product records, retailer links, images, source metadata, and public evidence references.
8. Attach real published score snapshots to products before showing Evidence Score numbers.
9. Implement Your Values Score calculation only from supported evidence-backed score inputs, plus visible hidden-count behavior for red-line Hide mode.
10. Complete legal, privacy, accessibility, and security launch documents before involving external pilot users.

## Top 10 Polish Items

1. Tighten display-only labeling on `/ngo/sharing`, `/org/team`, `/org/billing`, and admin pages.
2. Run mobile QA for NGO forms, evidence tables, report creation, shopping grids, product detail pages, and score popups.
3. Improve empty states so users can distinguish what is available now from what is intentionally future functionality.
4. Add consistent beta/private/draft labels across evidence, claims, reports, snapshots, and shopping score states.
5. Add stronger form validation, error summaries, and field-level help for onboarding, evidence, reports, and priorities.
6. Run manual keyboard and screen-reader checks for the shopping score popup and NGO evidence/report forms.
7. Add clearer loading, success, and error states for evidence creation, report creation, and Shopping Priorities updates.
8. Add an audit-event indicator or read-only audit trail view for NGO evidence and report actions.
9. Keep no-paid-trust-advantage language visible wherever score, rank, places-to-buy, or trust status is shown.
10. Prepare a controlled demo script that uses the verified NGO live rows and explicitly explains Shopping's real-data-only empty state.

## Recommended Next 3 Slices

1. Release 4 Slice 4: Shopping Product Ingestion / Admin Review Path
   - Add a narrow, admin-protected workflow for entering real baby product records, places-to-buy records, source URLs, source freshness, and review status.
   - Require audit events and real-source metadata.
   - Keep fake seed data and invented scores prohibited.

2. NGO Slice 4: Scoped Sharing and Export Readiness
   - Implement minimal share grants for private NGO reports.
   - Add protected read-only shared views with raw-evidence safety rules.
   - Prepare export status and export permissions before building full PDF/Word/Excel generation.

3. Release 4 Slice 5: Product Score Snapshot Attachment and Explanation Hardening
   - Connect products to published public score snapshots only when real scoring data exists.
   - Show Evidence Score only from published snapshots.
   - Keep Score Pending / More Evidence Needed states for everything else.

## Tests / Checks Run

| Check | Result |
| --- | --- |
| `npm test` | Pass: 39 tests passed. |
| `npm run lint` | Pass. |
| `npm run build` | Pass. |
| Supabase linked migration list | Pass: clean V2 project aligned through `202605240010`. |
| Ignored artifacts check | Pass: `.env.local`, `screenshots/`, and `supabase/.temp/` remain ignored/uncommitted. |
| Tracked secret/artifact check | Pass: only `.env.example` is tracked among env-like files, and it contains safe placeholders. |
| Static source review | Pass: `/org/evidence`, `/org/reports`, and `/ngo/sharing` reviewed for current readiness and labeling. |

## Final Recommendation

Mishava NGO and Mishava Shopping are ready for controlled stakeholder demos, with clear framing that the system is still in foundation and real-data-readiness mode. They should not be treated as pilot-ready for external NGOs, public consumers, businesses, funders, or press until final auth, storage, sharing, export, product ingestion, source review, score snapshot publication, legal/privacy/accessibility checks, and operational support flows are completed.

The safest next move is to keep the build narrow: finish real product ingestion and NGO sharing/export readiness before adding broader Shopping, Local, Business, Plus, Gov, Corporate, or AI features.
