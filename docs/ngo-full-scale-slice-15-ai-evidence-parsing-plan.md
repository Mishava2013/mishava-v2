# NGO Full-Scale Slice 15 Plan: AI Evidence Parsing Readiness

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-14-malware-file-security-result.md`
- `docs/ngo-full-scale-slice-11b-role-change-smoke-result.md`
- `docs/ngo-full-scale-slice-7-legal-trust-accessibility-security-result.md`
- `docs/release-3-slice-2-result.md`

## Goal

Plan AI evidence parsing readiness for NGO full-scale use without allowing AI to create final accepted claims, trust outcomes, scores, rankings, verification labels, credibility labels, methodology outputs, adverse findings, or report trust conclusions by itself.

Slice 15 should prepare the architecture, privacy posture, audit trail, and human-review workflow for AI-assisted evidence handling. It should not turn on production AI automation.

## Scope

In scope:

- AI evidence parsing architecture.
- Human review workflow.
- AI suggestion logging.
- Prompt/model/version governance.
- Privacy/vendor disclosure requirements.
- Cost/usage tracking plan.
- Access-control and audit guardrails.

Out of scope:

- Shopping.
- Business.
- Local.
- Gov.
- Corporate.
- Plus.
- Final scoring math.
- Production AI automation.
- OCR-heavy workflows.
- Public evidence library.
- Raw file sharing.
- SOC 2 / ISO / VPAT implementation.
- Automated trust outcomes.

## Hard Rules

- AI is suggestion-only.
- AI-generated facts are not accepted by default.
- AI suggestions cannot enter reports, scoring, trust labels, or methodology outputs until a human reviewer accepts them.
- Every accepted AI-assisted claim must reference an evidence item.
- Human reviewer identity and timestamp must be recorded.
- AI cannot alter scores, rankings, verification outcomes, credibility labels, evidence truth, or report trust conclusions.
- Sensitive/raw files must not be sent to an AI provider until vendor/privacy review and user-facing disclosure are ready.
- No claims should be made that Mishava has certified AI governance or external AI audit approval unless that review has actually happened.

## 1. AI Use Cases

### First Allowed Use Cases

- Suggest structured claims from evidence text, metadata, source URL, notes, or reviewer-provided excerpts.
- Summarize evidence for a reviewer.
- Suggest report language from already accepted claims.
- Flag missing evidence, weak context, stale sources, or unclear citations.
- Classify evidence type/category for reviewer confirmation.
- Suggest confidence/coverage notes for reviewer review.

### Explicitly Excluded Use Cases

- Final scoring decisions.
- Automatic accepted claims.
- Automatic verification.
- Automatic adverse findings.
- Automatic public trust labels.
- Automatic credibility labels.
- Automated score/ranking changes.
- AI-only report trust conclusions.
- AI-only methodology outputs.

## 2. Human Review Workflow

AI outputs should move through an explicit suggestion workflow:

1. Authorized user requests AI parsing for an evidence item.
2. System records an AI parse job with provider/model/prompt metadata.
3. AI returns one or more suggestions.
4. Suggestions are stored privately as `suggested`.
5. Reviewer reviews each suggestion.
6. Reviewer may mark a suggestion:
   - `reviewed`;
   - `accepted`;
   - `rejected`.
7. Only accepted suggestions may create or update structured claims.
8. Accepted claims must keep traceability to:
   - evidence item;
   - AI suggestion/job;
   - reviewer;
   - review timestamp;
   - prompt/model version.

Required behavior:

- Reviewer must accept before a claim enters reports or scoring.
- Evidence reference is mandatory.
- Reviewer identity is mandatory for accepted/rejected state.
- Review timestamp is mandatory for accepted/rejected state.
- Audit event is mandatory for parse request, parse completion/failure, suggestion acceptance, and suggestion rejection.
- Rejected suggestions remain traceable but excluded from reports/scoring.
- Draft/reviewed suggestions remain excluded from reports/scoring.

## 3. Data Model

Plan new tables or equivalent fields:

### `ai_evidence_parse_jobs`

Purpose: Track each request to parse evidence.

Suggested fields:

- `id`
- `organization_id`
- `evidence_item_id`
- `requested_by`
- `provider`
- `model`
- `model_version`
- `prompt_version`
- `input_reference`
- `input_summary`
- `status`: `queued`, `processing`, `completed`, `failed`, `canceled`
- `error_code`
- `error_message`
- `token_input_count`
- `token_output_count`
- `estimated_cost_cents`
- `created_at`
- `started_at`
- `completed_at`

### `ai_evidence_suggestions`

Purpose: Store AI-generated draft suggestions without treating them as facts.

Suggested fields:

- `id`
- `organization_id`
- `evidence_item_id`
- `parse_job_id`
- `suggestion_type`: `structured_claim`, `summary`, `category`, `missing_context`, `report_language`
- `suggested_text`
- `suggested_claim_type`
- `suggested_claim_value`
- `suggested_confidence`
- `source_excerpt`
- `source_reference`
- `status`: `suggested`, `reviewed`, `accepted`, `rejected`
- `reviewed_by`
- `reviewed_at`
- `review_note`
- `created_structured_claim_id`
- `created_at`
- `updated_at`

### Structured Claim Linkage

If an AI suggestion is accepted into `structured_claims`, the structured claim should record:

- `evidence_item_id` or existing evidence reference field.
- `source_ai_suggestion_id` if added.
- `reviewed_by`.
- `reviewed_at`.
- accepted status.

No evidence citation means no scoring fact.

## 4. Privacy And Vendor Disclosure

Before any production AI processing, Mishava needs a clear disclosure and vendor review path.

Plan disclosure for:

- What evidence metadata may be sent to an AI provider.
- Whether raw file contents may be sent.
- Whether source URLs or notes may be sent.
- Whether prompts/outputs are logged.
- Whether customer data is used for provider training.
- How long provider-side data is retained, if known.
- How sensitive evidence is handled.
- Whether an NGO can request no-AI processing.
- Whether AI is used only for suggestions and human review.

Recommended initial posture:

- Default to metadata/text excerpts only, not raw file upload.
- Do not send suspicious/rejected/not-scanned raw files to AI.
- Add a per-evidence or per-organization `do_not_process_with_ai` flag if needed.
- Use providers/settings that do not train on customer data where available.
- Keep AI outputs private to the organization.
- Do not publish AI-generated text as fact without human acceptance.

Policy/doc updates likely needed before implementation:

- AI Use Disclosure.
- Privacy Policy AI/vendor section.
- Subprocessor/vendor list.
- Evidence Submission Terms AI-processing note.
- Sensitive evidence handling policy.

## 5. Prompt And Model Governance

Plan requirements:

- Prompt templates are versioned.
- Model/provider/version are tracked per job.
- Prompt changes are reviewed and audited.
- Inputs and outputs are logged safely.
- Logs avoid secrets and unnecessary sensitive raw evidence.
- Prompt templates do not include secrets.
- File parsing does not accept unsupported file types.
- Raw file handling depends on scan status and privacy flags.
- Cost/token metadata is recorded where available.
- Failed outputs retain enough detail to troubleshoot without exposing sensitive content broadly.

Possible future table:

### `ai_prompt_versions`

- `id`
- `purpose`
- `version`
- `provider`
- `model`
- `prompt_template`
- `status`: `draft`, `active`, `archived`
- `created_by`
- `approved_by`
- `approved_at`
- `created_at`

Published/active prompt versions should not be silently overwritten.

## 6. Security And Access

Access rules:

- Only authorized org members can request parsing.
- Viewer role cannot request parsing unless explicitly granted later.
- Viewer role cannot accept/reject suggestions.
- Owner/admin/member review permissions should follow the central permission matrix, with reviewer capability separated if needed.
- Admin/support cannot silently create accepted claims or trust outcomes.
- AI jobs and suggestions are private to the organization by default.
- AI suggestions are not public.
- Current org cookie is not authoritative.
- RLS and server-side org membership checks must protect AI job/suggestion rows.
- Service-role usage must stay server-side.

File/security rules:

- Suspicious/rejected/failed files are not eligible for AI parsing.
- Pending/not-scanned raw files are not sent to AI.
- Clean file access still requires membership/permission and short-lived access if raw parsing is ever added.
- Storage paths must not be exposed to the AI workflow UI or exports.

## 7. UI Readiness

Planned UI should be narrow and honest:

- Evidence detail may show AI suggestions as `Suggested`.
- Reviewer sees evidence reference/source context.
- Reviewer can accept/reject suggestions.
- Accepted suggestion can create a structured claim only through a review action.
- Suggested report language should be clearly labeled as draft.
- UI should use language such as:
  - `AI-assisted suggestion`;
  - `Human review required`;
  - `Not accepted as fact`;
  - `Private to your organization`;
  - `Not used in scoring or reports until accepted`.

Do not add:

- Public AI badges.
- AI-generated public labels.
- AI chatbot.
- Automated adverse-finding UI.
- AI scoring UI.

## 8. Audit Events

Plan audit actions:

- `ai.evidence_parse_requested`
- `ai.evidence_parse_completed`
- `ai.evidence_parse_failed`
- `ai.suggestion_created`
- `ai.suggestion_accepted`
- `ai.suggestion_rejected`
- `structured_claim.ai_draft_created`
- `ai.prompt_version_created`
- `ai.prompt_version_activated`
- `ai.prompt_version_archived`

Audit event details should include:

- organization id;
- evidence item id;
- parse job id;
- suggestion id where applicable;
- provider/model/prompt version;
- actor user id;
- review status;
- no raw secret/provider key values.

## 9. Tests Required

Implementation must add or extend tests proving:

- AI suggestion cannot become accepted claim without reviewer action.
- AI suggestion requires an evidence reference.
- Rejected suggestions are excluded from reports/scoring.
- Suggested/reviewed-but-not-accepted suggestions are excluded from reports/scoring.
- Accepted suggestion writes an audit event.
- Accepted suggestion creates or links to an evidence-backed structured claim.
- Viewer cannot accept AI suggestions.
- Unauthorized/non-member user cannot read private AI suggestions.
- Suspicious/rejected/failed files cannot be parsed.
- Pending/not-scanned raw files are not sent to AI.
- AI provider/model/prompt version metadata is recorded.
- AI cannot affect score/ranking/payment firewall.
- Payment firewall tests still pass.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.

## 10. Non-Goals

Slice 15 implementation should not include:

- Full OCR pipeline.
- Automatic scoring.
- Public AI badges.
- AI chatbot.
- AI support bot.
- Batch processing at scale.
- Final adverse finding generation.
- AI certification claims.
- Final methodology automation.
- Public evidence library.
- Raw file sharing.
- Production AI automation without explicit approval.

## 11. Acceptance Criteria

Slice 15 implementation can begin only if:

- AI remains suggestion-only.
- Human review is mandatory.
- Evidence reference is mandatory.
- Accepted claims remain auditable.
- AI outputs are private by default.
- Privacy/vendor disclosure is clear.
- Prompt/model versioning is planned.
- Sensitive evidence handling is planned.
- No trust outcomes are automated.
- No score/ranking/verification/credibility labels can be changed by AI.
- No overclaims are made.

## Recommended Implementation Order

1. Add AI job/suggestion schema with RLS and private org isolation.
2. Add provider-agnostic AI parsing service interface with no live provider enabled by default.
3. Add prompt/model version metadata structure.
4. Add suggestion creation path from evidence metadata/text excerpts only.
5. Add reviewer accept/reject helper that writes audit events.
6. Link accepted suggestions to structured claims with evidence references.
7. Add evidence detail UI for private AI suggestions.
8. Add tests proving rejected/draft suggestions cannot enter reports/scoring.
9. Add privacy/legal disclosure updates before enabling a real provider.

## Launch Requirement

Can wait until after NGO full-scale launch unless AI evidence parsing is marketed, required for operational scale at launch, or needed to support a committed pilot workflow.

