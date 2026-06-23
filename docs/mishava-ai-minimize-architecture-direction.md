# Mishava AI-Minimize Architecture Direction

Date: June 17, 2026

## Purpose

Mishava should use AI only where it creates clear value. AI must not become the default backend engine for normal product behavior, trust outcomes, scoring, ranking, verification, certification, publication, or access decisions.

Operating rule:

> AI may suggest, summarize, classify, and flag gaps. AI may not independently verify, score, rank, approve, certify, or publish trust outcomes.

Mishava should remain useful when AI is unavailable, disabled, over budget, or restricted for a specific organization. The core trust layer must come from structured data, transparent rules, source records, review status, human approval, and auditable workflows.

## Internal-First AI Principle

AI may be used more heavily inside private review workflows than on public-facing pages.

For example, an internal reviewer may use AI help to summarize a long report, spot contradictions, draft a checklist, or prepare reviewer notes. Public-facing Mishava pages should stay calmer and more structured: source links, review status, evidence dates, known limits, and human-approved summaries should do the trust work.

This protects Mishava from becoming sloppy, expensive, or legally exposed. It also keeps Mishava from looking like an "AI trust platform." Mishava is an evidence, verification, and accountability platform that uses AI carefully where it saves time.

## Current Repo Audit

Initial code search found one existing AI-specific implementation area:

- `src/lib/ai-evidence-parsing.ts`
- `supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql`
- `scripts/ngo-full-scale-slice-15-ai-evidence-parsing.test.mjs`
- `docs/ngo-full-scale-slice-15-ai-evidence-parsing-result.md`

The current posture appears aligned with the direction at a high level: AI evidence parsing is framed as suggestion-only, provider-deferred, and human-review-required. No broad autonomous AI scoring, ranking, supplier approval, trust badge approval, or publication workflow should be added without the controls below.

## Allowed AI Uses

AI may assist with:

- Evidence summaries
- Suggested claim extraction
- Suggested category or pillar classification
- Gap detection
- Duplicate or contradiction flagging
- Internal reviewer assistance
- Draft report language
- Focused uploaded-document parsing
- Suggested next review steps
- Suggested supplier/profile field extraction

These outputs must remain suggestions until reviewed by a human or accepted through an approved structured workflow.

## Prohibited AI Uses

AI must not:

- Finalize verification
- Create final scores
- Decide ranking order
- Approve trust badges
- Publish public trust outcomes
- Certify compliance
- Make legal or compliance conclusions
- Determine company, employer, supplier, or seller wrongdoing
- Automatically escalate reports to NGOs or third parties
- Contact third parties without human approval
- Approve suppliers or sellers
- Decide payment, eligibility, or account access
- Run on every page load, every keystroke, or uncapped background loops

## Rules-First Architecture

Use non-AI logic for:

- Required field checks
- Missing source URL checks
- Missing date checks
- Missing evidence checks
- Pending review status
- File size/type validation
- Supplier unknown status
- Duplicate submitted URL checks
- Whether a report is incomplete
- Whether a claim lacks supporting evidence
- Whether a record is ready for human review

AI calls should happen only after intentional user action, such as:

- `Review this evidence`
- `Suggest summary`
- `Find gaps`
- `Classify this report`
- `Draft reviewer notes`
- `Parse this document`

## Required AI Control Layer

Before production AI provider usage expands, Mishava should add a central AI service wrapper with:

- Feature-level AI permissions
- Organization-level monthly budgets
- User-level limits by account type
- Environment-level caps, with very low development/staging caps
- Hard cutoffs when budget is reached
- Warning thresholds at 50%, 75%, 90%, and 100%
- Usage logging for every AI attempt
- Cache checks before provider calls
- Graceful fallback when AI is unavailable or over budget

Implementation foundation:

- `src/lib/ai-control.ts` is the central AI control module for future AI requests.
- Feature flags default to denied.
- No real provider integration is enabled in the foundation layer.
- Future AI provider integrations must go through this wrapper, after feature permission, budget checks, cache checks, forbidden-outcome checks, and usage logging.
- The wrapper returns suggestion-only envelopes that require human review and explicitly cannot affect scores, rankings, trust outcomes, or access decisions.

## Approved AI Integration Path

Direct AI provider imports are not allowed in product pages, route handlers, server actions, UI components, Shopping helpers, NGO helpers, scoring helpers, support helpers, or ad hoc scripts.

Approved paths:

- `src/lib/ai-control.ts`
- `src/lib/ai-provider-adapters/` for a future provider adapter layer only

Any future provider adapter must still be called through `src/lib/ai-control.ts`. The adapter path is reserved for low-level provider plumbing, not product decisions. Product code should request suggestion-only help from the control layer and should never import OpenAI, Anthropic, Gemini, or similar SDKs directly.

The repository guard test `scripts/ai-provider-import-guard.test.mjs` should fail if provider SDK imports or direct provider API URLs appear outside those approved paths.

Every AI call should log:

- Organization ID, where applicable
- User ID, where applicable
- Feature
- Action type
- Provider/model
- Estimated tokens and estimated cost
- Cache hit or miss
- Input hash
- Output status
- Error state, if any
- Created timestamp

## AI Caching

Before making an AI call, check whether the same source, evidence, document section, product page, report, supplier submission, or claim has already been reviewed.

Cache AI results by stable content hash. Cacheable outputs include:

- Evidence URL summary
- Uploaded-document section summary
- Suggested claim
- Suggested evidence category
- Evidence gap list
- Contradiction flags
- Source summary
- Reviewer-assist notes

If source content changes, create a new cache key. Do not repeatedly pay AI to review unchanged content unless an admin intentionally requests re-review.

## Structured AI Outputs

AI responses should be stored as structured data, not only prose.

Recommended shape:

```json
{
  "suggested_claim": "",
  "suggested_pillar": "",
  "source_summary": "",
  "evidence_gaps": [],
  "possible_contradictions": [],
  "confidence_reason": "",
  "requires_human_review": true,
  "ai_review_status": "suggestion_only",
  "last_ai_reviewed_at": ""
}
```

AI outputs must be labeled as suggestions and must not be treated as verified facts.

## Review Status Boundaries

Use statuses that separate AI assistance from human approval:

- `draft`
- `submitted`
- `rule_checked`
- `ai_suggested`
- `human_review_needed`
- `human_approved`
- `human_rejected`
- `published`
- `archived`

AI may move a record into `ai_suggested` or `human_review_needed`. AI must not move records into `human_approved` or `published`.

## Public Display Rule

Public-facing Mishava pages should not present AI output as final truth. Public trust displays should favor:

- Source links
- Review status
- Evidence dates
- Evidence type
- Human-approved summaries
- Clear limits of what is known and missing

If an AI-assisted summary is shown publicly later, it must be based on approved evidence and clearly subordinate to source-backed structured data.

## Product-Specific Guardrails

### NGO and Reporting

AI may help classify report topics, summarize uploaded evidence, identify missing information, suggest possible recipient organization types, prepare internal review packets, and detect urgent categories for human triage.

AI must not decide that a report is true, determine that an organization violated the law, automatically escalate to an NGO, publish allegations, contact third parties, or create legal conclusions.

### Shopping

AI may help summarize company/product evidence, suggest pillar relevance, detect unsupported product claims, identify missing supplier documentation, and compare supplier documents to required profile fields.

AI must not create final company scores, final product scores, ranking order, supplier verification, trust badge approval, or ethical/anti-ethical determinations.

### Supplier and Seller Workflows

AI may help parse documents and suggest profile fields. AI must not verify supplier identity, approve suppliers, publish trust claims, certify compliance, or replace admin/source-backed verification.

## Fallback Behavior

When AI is unavailable, disabled, restricted, or over budget:

- Save the user's work
- Keep manual review available
- Show a clear fallback message
- Do not block the entire workflow
- Do not silently fail
- Do not retry repeatedly in the background

Example:

> AI suggestions are unavailable right now, but you can continue using Mishava's structured review workflow. Your evidence has been saved and can still be reviewed manually.

## Testing Requirements

Add or extend tests proving AI cannot:

- Publish trust outcomes
- Approve verification
- Alter final scores directly
- Change ranking directly
- Approve suppliers or sellers
- Send NGO reports automatically
- Make legal or compliance conclusions
- Bypass budget limits
- Run uncapped background jobs
- Execute on every keystroke
- Execute on every page load

Also test:

- Cache hits prevent duplicate AI calls
- Budget limits stop AI calls gracefully
- Development/staging caps are enforced
- AI output is stored as suggestion-only
- Human approval is required before publication

## Recommended Implementation Slices

1. **AI Usage Audit and Wrapper**
   - Inventory all AI-adjacent code.
   - Add a central server-side AI service wrapper.
   - Block direct provider calls outside the wrapper.

2. **AI Budget and Logging Foundation**
   - Add usage log model and budget checks.
   - Include environment, feature, organization, user, action, estimate, cache state, and status.

3. **AI Cache and Content Hashing**
   - Add stable input hashes for evidence, documents, products, reports, and supplier submissions.
   - Reuse cached suggestion outputs for unchanged content.

4. **Suggestion-Only Review Status Enforcement**
   - Ensure AI can only set suggestion/review-needed states.
   - Add tests blocking AI from human approval, publication, scores, ranking, supplier approval, or trust badges.

5. **Admin AI Usage View**
   - Show usage by organization, user, feature, environment, and time period.
   - Include warning thresholds and over-budget state.

6. **Product-Specific AI Guardrail Tests**
   - NGO/reporting: no automatic escalation, publication, or legal conclusions.
   - Shopping: no final score, ranking, supplier verification, or trust badge approval.
   - Supplier/seller: no supplier approval or compliance certification.

## Acceptance Criteria

Mishava's AI architecture is acceptable only if:

- Core workflows continue without AI.
- AI calls are intentional, capped, logged, and cache-aware.
- AI outputs are suggestion-only.
- Human approval is required for verification, publication, trust outcomes, and score readiness.
- Payment, ranking, visibility, eligibility, verification, credibility labels, and trust outcomes cannot be affected by AI.
- Public-facing trust content remains source-backed and conservative.
