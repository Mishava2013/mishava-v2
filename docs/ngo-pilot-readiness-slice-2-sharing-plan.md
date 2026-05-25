# NGO Pilot Readiness Slice 2 Sharing Plan

Status: planning only. Do not implement in this slice plan.

Source of truth:

- `docs/ngo-pilot-readiness-slice-1-result.md`
- `docs/ngo-shopping-readiness-audit.md`
- `docs/release-3-slice-3-result.md`
- `docs/release-2-5-live-verification-result.md`

## Goal

Plan the smallest safe scoped sharing flow that moves Mishava NGO closer to pilot-ready.

This slice focuses only on NGO report sharing. It must not build Shopping, Business, Local, Gov, Corporate, Plus, AI, Stripe, public report library, or exports.

## Core Principle

Reports remain private by default. A share grant gives a specific approved recipient access to a specific report summary only. It must not expose the NGO workspace, raw evidence records, unrelated reports, unrelated evidence, team data, billing, or private organization settings.

## 1. Private Reports By Default

Default state:

- `ngo_reports.visibility = private`
- no public report route
- no public report library
- no anonymous browsing of NGO reports
- raw evidence remains private unless a future explicit evidence-sharing policy allows otherwise

Report list/detail labels should continue to show:

- Private to your organization
- Draft report
- Not shared
- Exports not enabled yet
- No public score has been created

When a valid share grant exists, the report detail should show:

- Shared
- recipient email or name, if available
- purpose
- expiration date, if available
- revoke action

## 2. Share Grant Creation

Plan a protected NGO member action to create a share grant for one selected report.

Recommended route placement:

- create form on `/org/reports/[reportId]`
- future list/management view can remain `/ngo/sharing` or `/org/reports/[reportId]/sharing`

Minimum create fields:

- report_id
- recipient email
- recipient name, if schema supports it or a small migration is acceptable
- purpose
- viewer type
- expiration date, if simple

Current schema already includes:

- `ngo_share_grants.id`
- `ngo_share_grants.ngo_profile_id`
- `ngo_share_grants.report_id`
- `ngo_share_grants.granted_to_email`
- `ngo_share_grants.viewer_type`
- `ngo_share_grants.visibility`
- `ngo_share_grants.purpose`
- `ngo_share_grants.starts_at`
- `ngo_share_grants.expires_at`
- `ngo_share_grants.granted_by`
- `ngo_share_grants.revoked_at`
- `ngo_share_grants.revoked_by`
- `ngo_share_grants.created_at`

Potential small migration to review before implementation:

- add `granted_to_name text`
- add `access_token_hash text` or another safe token reference if public/tokenized access is implemented
- add `last_accessed_at timestamptz`, later only

Do not store raw bearer tokens in the database if tokenized sharing is used.

Creation rules:

- authenticated user required
- current organization membership required
- report must belong to current organization
- report must remain private unless a future explicit visibility model changes it
- share grant must write an audit event
- share grant must not include raw evidence by default
- share grant must not expose private workspace links

Recommended audit event:

```txt
ngo_report.share_grant_created
```

Suggested audit metadata:

- report_id
- share_grant_id
- recipient email
- recipient name, if available
- viewer_type
- purpose
- expires_at
- raw_evidence_exposed: false

## 3. Share Grant Revocation

Plan a protected NGO member action to revoke an existing grant.

Revocation should:

- set `revoked_at`
- set `revoked_by`
- preserve the historical grant row
- write an audit event
- immediately block shared access

Recommended audit event:

```txt
ngo_report.share_grant_revoked
```

Suggested audit metadata:

- report_id
- share_grant_id
- revoked_by
- revoked_at
- original_recipient_email
- purpose

Do not delete share grant records in the normal revoke path. Keeping the row supports transparency and auditability.

## 4. Expiration

If simple expiration is implemented in this slice, use `expires_at`.

Rules:

- grant is active only when `revoked_at is null`
- grant is active only when `starts_at <= now()`
- grant is active only when `expires_at is null or expires_at > now()`

Labels:

- Expires
- Expired
- Revoked
- Shared
- Not shared

If expiration UI adds too much complexity, store `expires_at` only when provided and still enforce it in shared-view lookup.

## 5. Shared View

Plan one minimal protected shared report view.

Possible route:

```txt
/shared/ngo-reports/[grantId]
```

or, if tokenized sharing is implemented later:

```txt
/shared/ngo-reports/[token]
```

For this slice, the shared view should expose only:

- report title
- report template/type
- report status label
- shared purpose
- recipient context
- selected evidence summaries
- selected accepted claims
- draft/provisional trust context
- created/updated date
- clear raw-evidence limitation label
- clear no-export label if exports remain disabled
- clear no-public-score label when applicable

Selected evidence summaries should include only safe summary fields:

- evidence title
- source type
- source name, if safe
- verification/review status
- visibility summary
- created date

Do not expose by default:

- raw evidence notes if they may contain sensitive information
- internal evidence URLs unless explicitly allowed later
- full source documents
- file attachments
- organization workspace navigation
- team/member data
- billing data
- unrelated reports
- unrelated evidence
- internal audit events

The shared view should include honest labels:

- Shared by the NGO
- Raw evidence is not exposed in this shared view
- Trust context is provisional
- No public score has been created
- Exports not enabled yet

## 6. Access Model

Plan the smallest safe access model.

Minimum checks:

- grant exists
- grant references the requested report
- grant is not revoked
- grant is not expired
- report exists
- report belongs to the same NGO profile as the grant

Recipient identity options to review before implementation:

1. authenticated recipient email must match `granted_to_email`
2. tokenized link with secure random token and stored hash
3. temporary pilot-only code flow

Recommendation for pilot readiness:

- Use authenticated recipient email matching if final hosted auth is ready.
- If final auth is not ready, avoid real external sharing and implement only internal protected preview or token architecture with strong caveats.

This slice may implement scoped sharing management before enabling external recipient access if auth/token safety is not ready.

## 7. UI Labels

Use clear labels across report detail, grant list, and shared view:

- Shared
- Not shared
- Revoked
- Expires
- Expired
- Private to your organization
- Shared report summary
- Raw evidence not exposed
- Trust context is provisional
- No public score has been created
- Exports not enabled yet

Avoid labels that imply public publication:

- Public report
- Published
- Verified report
- Certified report

unless future publication and review rules explicitly support those states.

## 8. Database / Backend Implications

Review existing tables before implementation:

- `ngo_share_grants`
- `ngo_reports`
- `ngo_profiles`
- `evidence_items`
- `structured_claims`
- `audit_events`

Likely backend helpers:

- `createNgoReportShareGrant`
- `revokeNgoReportShareGrant`
- `getNgoReportShareGrantsForReport`
- `getSharedNgoReportByGrant`

Guardrails:

- share grants must be scoped to one report
- grant creation must validate report organization ownership
- shared lookup must not return full organization workspace
- revoked grants must return no report
- expired grants must return no report
- raw evidence must not be returned by default
- audit events are append-only

## 9. Tests To Plan

Required tests:

- report owner can create share grant
- non-member cannot create share grant
- share grant is scoped to selected report
- share grant does not expose full org workspace
- shared view exposes report summary and allowed evidence summaries only
- raw evidence is not exposed by default
- revoked grant blocks access
- expired grant blocks access if expiration is implemented
- share action writes audit event
- revoke action writes audit event
- private reports remain private unless grant exists
- non-granted users cannot access shared report
- no public report library route is added
- build/lint/test pass

If tokenized sharing is implemented:

- raw token is not stored
- invalid token blocks access
- token for one report cannot access another report

## 10. Non-Goals

Exclude from this slice:

- Shopping
- Business
- Local
- Gov
- Corporate
- Plus
- AI workflows
- Stripe
- public report library
- PDF/Word/Excel exports
- full sharing portal
- funder dashboard
- raw evidence sharing
- public score publication
- final scoring math
- file uploads/storage

## 11. Acceptance Criteria

Slice 2 is accepted only if:

- sharing is scoped to one selected report
- reports remain private by default
- share grants can be created by authorized NGO members only
- share grants can be revoked
- expiration is enforced if implemented
- sharing and revocation write audit events
- shared view exposes only selected report summary and allowed evidence summaries
- raw evidence is not exposed by default
- private org workspace is not exposed
- non-granted users cannot access shared reports
- expired/revoked grants cannot access shared reports
- labels are honest: Shared, Not shared, Revoked, Expires
- no public report library is added

## Recommended Build Order For Future Implementation

1. Decide whether Slice 2 uses authenticated-recipient access, tokenized access, or internal protected preview only.
2. Add any minimal migration needed for recipient name or token hash, if approved.
3. Add backend share-grant create/revoke helpers with report ownership checks.
4. Add audit events for create/revoke.
5. Add report detail sharing panel showing current grants and revoke actions.
6. Add minimal shared report view that returns only allowed report/evidence summaries.
7. Add tests for scope, revocation, expiration, privacy, and audit logging.

## Final Scope Note

NGO Pilot Readiness Slice 2 should make sharing safer and clearer without making Mishava look like it has a public report library or full funder portal. The goal is a small, revocable, audit-logged sharing step that preserves Mishava's private-by-default trust posture.
