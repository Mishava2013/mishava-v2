# NGO Full-Scale Slice 15 Result: AI Evidence Parsing Readiness

## Status

Implemented as an AI evidence parsing readiness foundation.

AI remains suggestion-only. Human review is mandatory before an AI-assisted suggestion can become a structured claim draft.

## What Was Implemented

- Added migration `202605260003_ngo_ai_evidence_parsing_readiness.sql`.
- Added private organization-scoped AI parse job table:
  - `ai_evidence_parse_jobs`
  - provider/model/prompt metadata
  - status tracking
  - error state
  - token/cost metadata placeholders
- Added private organization-scoped AI suggestion table:
  - `ai_evidence_suggestions`
  - evidence reference
  - parse job reference
  - suggested text/type/confidence fields
  - suggested/reviewed/accepted/rejected status
  - reviewer identity and timestamp
  - created structured claim linkage
- Added `structured_claims.source_ai_suggestion_id` for traceability.
- Added backend helpers for:
  - creating a parse job;
  - creating a test-safe AI suggestion record;
  - listing private org suggestions;
  - marking a parse job failed;
  - human accepting/rejecting a suggestion.
- Added audit events for:
  - `ai.evidence_parse_requested`;
  - `ai.evidence_parse_failed`;
  - `ai.suggestion_created`;
  - `ai.suggestion_accepted`;
  - `ai.suggestion_rejected`.
- Updated `/org/evidence` to show private AI-assisted suggestions when present.
- Added minimal accept/reject actions for authorized NGO members.
- Updated privacy/evidence legal language with AI suggestion-only posture.
- Added AI-related fields to the payment/trust firewall forbidden influence list.

## Migration Applied

Migration added:

- `supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql`

Applied to the clean V2 Supabase project:

- Project: `mishava-v2-dev`
- Ref: `snnscnodegbyqexnopvf`

The old Supabase project was not touched:

- `mishava / tghbfautnxblfxrtkdqb`

## AI Provider Status

No real AI provider integration was added.

No OpenAI, Anthropic, or other AI API is called in this slice.

The backend foundation records `provider = not_configured` and `model = none` for readiness workflows. Provider selection, API keys, prompt templates, model versions, vendor privacy review, and production AI enablement remain future work.

## Trust And Review Guardrails

AI remains suggestion-only.

Human review is mandatory.

Accepted AI suggestions create reviewed structured claim drafts, not accepted trust facts. They do not enter report trust summaries or scoring until the existing human review/scoring workflow explicitly accepts the resulting structured claim.

No trust outcomes are automated.

No raw files are sent to AI.

AI fields must not affect score, ranking, verification, credibility labels, methodology outputs, report trust conclusions, or payment firewall behavior.

## Tests Run

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm test` - passed.
- `npm run build` - passed.

## Live Checks Performed

- Confirmed the repo was linked to the clean V2 project before migration application.
- Applied migration `202605260003_ngo_ai_evidence_parsing_readiness.sql` to `mishava-v2-dev`.
- Confirmed local and remote migrations are aligned through `202605260003`.

No live AI provider or inbox/API workflow was tested because production AI integration is intentionally deferred.

## Known Limitations

- No real AI provider is configured.
- No production AI automation is enabled.
- No OCR-heavy workflow was implemented.
- No raw file parsing was implemented.
- Prompt template/version management is represented through metadata, not a full prompt admin workflow.
- AI suggestion creation is backend/test-safe foundation only; a production parser queue/provider path is future work.
- Reviewer UI is intentionally minimal.
- AI suggestions accepted in this slice create reviewed structured claim drafts only; final accepted claims still require the existing human trust workflow.

## Remaining AI Work

- Choose provider and vendor/privacy posture.
- Add real prompt template registry/versioning if AI is enabled.
- Add provider-side no-training/data-retention documentation.
- Add parse queue/background job or Edge Function if needed.
- Add richer evidence detail UI for suggestions.
- Add AI cost controls and usage ledger wiring.
- Add sensitive evidence opt-out/do-not-process controls.
- Add live provider tests after legal/privacy approval.

## Scope Confirmation

This slice did not add:

- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- final scoring math;
- production AI automation;
- OCR-heavy workflows;
- public evidence library;
- raw file sharing;
- SOC 2 / ISO / VPAT implementation;
- AI chatbot;
- AI support bot;
- batch processing at scale;
- public AI badges;
- automated trust outcomes.

The old Supabase project was not touched.
