# NGO Pilot Readiness Re-Audit

Date: 2026-05-24

Scope: NGO readiness only, plus shared trust/security items that directly affect NGO.

Source reviewed:

- `docs/release-2-5-live-verification-result.md`
- `docs/release-3-slice-3-result.md`
- `docs/ngo-pilot-readiness-slice-1-result.md`
- `docs/ngo-pilot-readiness-slice-2-result.md`

## Readiness Rating

Mishava NGO is **limited pilot-ready with constraints**.

This means Mishava NGO is ready for a small, supported pilot with carefully selected NGO users, manual evidence entry, guided onboarding, and clear expectation-setting. It is not ready for broad self-serve NGO launch, unsupervised funder/media sharing, production file uploads, AI workflows, or public report publication.

The current NGO workflow is now coherent enough for a supported pilot:

- create NGO org/profile
- add evidence
- view evidence library
- create structured claim drafts
- create private draft reports
- view and update report detail
- create and revoke scoped share grants
- allow a granted recipient to view only a report summary
- keep raw evidence private by default
- maintain audit events for sensitive actions

The largest caveat is that the auth layer is still the temporary cookie abstraction. That is acceptable only for a tightly controlled technical pilot, not for general public or institutional rollout.

## 1. NGO Onboarding

| Check | Status | Notes |
| --- | --- | --- |
| Can a user create an NGO org/profile? | Pass | Release 2.5 live verification confirmed `/ngo/onboarding` creates `organizations`, `organization_memberships`, and `ngo_profiles`. |
| Does it persist live? | Pass | Live rows were created in `mishava-v2-dev / snnscnodegbyqexnopvf`. |
| Are audit events written? | Pass | Onboarding audit event was created during live verification. |
| Are labels/guidance clear? | Partial | The onboarding direction is clear enough for a guided pilot, but final production copy and step-by-step onboarding support still need polish. |

Pilot view: usable with support.

Remaining concern: final auth provider and polished onboarding success/error states are still needed before self-serve pilot expansion.

## 2. NGO Evidence

| Check | Status | Notes |
| --- | --- | --- |
| Can a user create evidence? | Pass | `/org/evidence` creates `evidence_items`, optional `ngo_evidence_submissions`, and audit events. |
| Can they view their evidence library? | Pass | Evidence library displays real organization evidence. |
| Are review/status labels clear? | Pass | Slice 1 added draft/reviewed/accepted-style labels and "Evidence entered but not reviewed" language. |
| Are evidence records private to the org where appropriate? | Pass | Evidence is organization-scoped; RLS and helper tests cover private organization isolation. |
| Are claims linked clearly? | Pass | Evidence shows linked structured claims, accepted claim count, and report attachment status. |
| Are audit events written? | Pass | Evidence creation and structured claim draft creation write audit events. |

Pilot view: usable for manual evidence entry and evidence-to-claim preparation.

Remaining concern: file uploads/storage are not production-ready, so pilot evidence should be manual/source metadata first unless storage is separately approved.

## 3. NGO Reports

| Check | Status | Notes |
| --- | --- | --- |
| Can a user create a draft report? | Pass | `/org/reports` creates private draft reports from templates, selected evidence, and accepted claims. |
| Can they view report detail? | Pass | Slice 1 added `/org/reports/[reportId]`. |
| Can they update report title/evidence/claims? | Pass | Slice 1 added draft report update with organization-owned evidence and accepted-claim validation. |
| Are reports private by default? | Pass | Reports default to `visibility = private` and `approval_status = draft`. |
| Are rejected/draft claims excluded from trust summaries? | Pass | Tests verify draft/rejected claims cannot enter report trust summaries. |
| Are audit events written? | Pass | Report creation and update write audit events. |

Pilot view: coherent enough for a supported private draft-report pilot.

Remaining concern: report approval, export generation, public publication, and final scoring are not enabled.

## 4. NGO Scoped Sharing

| Check | Status | Notes |
| --- | --- | --- |
| Can a user create a report share grant? | Pass | Slice 2 added scoped grant creation on report detail. |
| Can a recipient view only the shared report summary? | Pass | `/shared/ngo-reports/[grantId]` requires an active grant and matching recipient email. |
| Are raw evidence and full workspace hidden by default? | Pass | Shared view exposes report summary, selected evidence summaries, and accepted claims only. |
| Can a grant be revoked? | Pass | Slice 2 added revocation and preserves the grant row. |
| Are revoked/expired grants blocked? | Pass | Tests verify revoked and expired grants block access. |
| Are audit events written? | Pass | Grant creation, revocation, and shared report viewing write audit events. |

Pilot view: usable for tightly scoped, authenticated recipient sharing.

Remaining concern: recipient sharing depends on the temporary auth model and matching signed-in email. Tokenized or production external sharing is not implemented.

## 5. Security / Privacy

| Check | Status | Notes |
| --- | --- | --- |
| Are org routes protected? | Pass | `/org/*` and admin route protection tests pass. |
| Is wrong-org access blocked? | Pass | Release 2.5 and later tests verify wrong-org access is blocked. |
| Is RLS still aligned? | Pass | Clean V2 migrations are aligned through `202605240011`. |
| Are audit logs immutable where relevant? | Pass | Release 2.5 verified append-only/immutable audit behavior for normal users; current flows append audit events. |
| Is old Supabase untouched? | Pass | Work remains scoped to `mishava-v2-dev / snnscnodegbyqexnopvf`; old `mishava / tghbfautnxblfxrtkdqb` was not modified. |
| Are secrets/ignored artifacts clean? | Pass | `.env.local`, `screenshots/`, and `supabase/.temp/` remain ignored; only `.env.example` is tracked among env-like files. |

Pilot view: safe enough for a controlled pilot, but not yet institutional-production-ready.

Key caveat: server workflows still use the service-role-backed server client after app-level route/session guards. This needs final auth and policy hardening before broader external use.

## 6. Pilot Usability

What may confuse a real NGO user:

1. Temporary auth/session behavior will not feel like a normal login system.
2. Evidence can be entered, but file uploads are not ready.
3. Claim acceptance exists mostly as a guarded/backend path; the full reviewer workflow is not a polished UI.
4. Reports are private drafts, but there is no approval workflow or export flow.
5. Scoped sharing exists, but recipient access requires matching authenticated email rather than a polished invitation/token flow.

Pages that still feel display-only or future-facing:

- `/ngo/sharing`
- `/org/team`
- `/org/billing`
- public NGO profile pages
- parts of admin outside scoring/foundation guardrails

Clearly labeled as not enabled yet:

- exports
- public report library
- raw evidence sharing
- AI report writing/rebuild
- public score creation
- final scoring math

Workflow coherence:

The workflow is coherent enough for a supported pilot:

1. onboard NGO
2. enter manual evidence
3. create claim drafts
4. create private draft report
5. inspect/update report detail
6. create/revoke scoped share grant
7. recipient views limited summary

The pilot should be supported and scripted. It should not be positioned as full self-serve production.

## 7. Known Blockers

### Must Fix Before Limited Pilot

1. Pilot access protocol
   - Decide exactly who gets access, how temporary auth cookies are issued, and who supports users during the pilot.
2. Pilot privacy/consent language
   - Add clear pilot terms explaining private drafts, limited sharing, no exports, no raw evidence sharing, and no public scoring.
3. Manual evidence-only pilot rule
   - Since file upload/storage is not production-ready, pilot users should use manual evidence/source metadata only.
4. Reviewer/admin operating procedure
   - Document who can accept/reject claims and how review actions are tracked during pilot.
5. Support and rollback playbook
   - Define who handles access issues, mistaken share grants, revoked grants, and correction requests.

### Can Fix During Pilot

1. Polish onboarding copy and success/error states.
2. Add audit trail viewer for NGO evidence/report/share actions.
3. Improve mobile layouts for evidence, report detail, and sharing forms.
4. Add better empty states for first-time users with no claims or reports.
5. Add clearer in-app prompts that exports, public scoring, and file uploads are not enabled.

### Later Enhancements

1. Final hosted auth provider with MFA-ready admin access.
2. Production file storage, scanning, redaction, and retention controls.
3. Full structured claim review UI.
4. Report approval workflow.
5. Export generation for PDF/Word/Excel.
6. Tokenized external sharing or polished recipient invitations.
7. Funder dashboard.
8. AI-assisted report writing/rebuild after AI governance and cost controls.

## Top 5 Must-Fix Items Before Limited Pilot

1. Define and document the pilot access protocol for temporary auth.
2. Add pilot-specific privacy/consent language for NGO users and shared recipients.
3. Restrict pilot evidence to manual/source metadata entry until storage is production-ready.
4. Define the human review operating procedure for claim acceptance/rejection.
5. Create a support/runbook for share revocation, user access, correction requests, and audit-event review.

## Top 5 Can-Fix-During-Pilot Items

1. Improve first-run onboarding guidance.
2. Add read-only audit trail visibility for NGO actions.
3. Tighten mobile usability across `/org/evidence`, `/org/reports`, `/org/reports/[reportId]`, and `/shared/ngo-reports/[grantId]`.
4. Add clearer empty states for no accepted claims and no selected evidence.
5. Improve labels on display-only pages so pilot users know what is real versus planned.

## Recommended Next 3 NGO Slices

1. NGO Pilot Slice 3: Pilot Access, Consent, and Support Readiness
   - Add pilot terms/consent text, access guidance, support states, and clear limitations without changing the product surface.

2. NGO Pilot Slice 4: Claim Review Console
   - Build the minimal authorized review UI for accepting/rejecting structured claims with audit events and no fake scoring.

3. NGO Pilot Slice 5: Audit Trail Visibility
   - Add read-only audit trail views for evidence, reports, and share grants so NGO users can see the transparency record.

## Tests / Checks Run

| Check | Result |
| --- | --- |
| `npm test` | Pass: 51 tests. |
| `npm run lint` | Pass. |
| `npm run build` | Pass. |
| Supabase migration list | Pass: clean V2 project aligned through `202605240011`. |
| Tracked env/artifact check | Pass: only `.env.example` is tracked among env-like files. |
| Ignored artifact check | Pass: `.env.local`, `.next/`, `node_modules/`, `screenshots/`, and `supabase/.temp/` remain ignored. |

## Final Recommendation

Proceed toward a **small, supported NGO pilot** only after the five must-fix operational items above are documented. The product workflow itself is now coherent enough for limited pilot use, but the pilot must be controlled, manual-evidence-first, and transparent about what is not enabled.

Do not open NGO to broad self-serve use yet. The next major readiness leap should be final auth, claim review UI, and audit trail visibility, followed later by production-safe uploads, approvals, exports, and tokenized sharing.
