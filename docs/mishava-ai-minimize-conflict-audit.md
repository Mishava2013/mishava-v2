# Mishava AI-Minimize Conflict Audit

Date: June 23, 2026

Source of truth:

- `docs/mishava-ai-minimize-architecture-direction.md`

Scope:

This audit reviewed current and planned Mishava V2 AI-adjacent behavior for conflicts with the AI-minimize architecture rule:

> AI may suggest, summarize, classify, and flag gaps. AI may not independently verify, score, rank, approve, certify, or publish trust outcomes.

No product code was changed.

## Files Reviewed

Current implementation and UI:

- `src/lib/ai-evidence-parsing.ts`
- `src/app/org/evidence/actions.ts`
- `src/app/org/evidence/page.tsx`
- `src/lib/ngo-evidence-reports.ts`
- `src/app/org/reports/page.tsx`
- `src/app/org/reports/[reportId]/page.tsx`
- `src/app/shared/ngo-reports/[grantId]/page.tsx`
- `src/lib/shopping.ts`
- `src/app/shopping/page.tsx`
- `src/app/shopping/categories/[slug]/page.tsx`
- `src/app/shopping/products/[slug]/page.tsx`
- `src/components/ShoppingScoreExplainer.tsx`
- `src/components/ScoreExplainer.tsx`

Tests and migrations:

- `scripts/ngo-full-scale-slice-15-ai-evidence-parsing.test.mjs`
- `scripts/ngo-full-scale-slice-13-report-exports.test.mjs`
- `scripts/ngo-full-scale-slice-5-report-output.test.mjs`
- `scripts/ngo-pilot-readiness-slice-1.test.mjs`
- `scripts/release-3-slice-1.test.mjs`
- `supabase/migrations/202605240002_ngo_foundation.sql`
- `supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql`
- `supabase/migrations/202605240003_scoring_guardrails.sql`
- `supabase/migrations/202605240004_release_2_5_cleanup.sql`
- `supabase/migrations/202605260007_release_4_slice_6_toilet_paper_evidence_readiness.sql`
- `supabase/migrations/202605260008_release_4_slice_7_shopping_research_pipeline_supplier_transparency.sql`

Planning/result docs reviewed for planned AI-dependent behavior:

- `docs/ngo-full-scale-slice-15-ai-evidence-parsing-plan.md`
- `docs/ngo-full-scale-slice-15-ai-evidence-parsing-result.md`
- `docs/ngo-full-scale-slice-17-final-launch-audit.md`
- `docs/mishava-v2-full-build-roadmap-reset.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-plan.md`
- `docs/release-4-slice-7-shopping-research-pipeline-supplier-transparency-result.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-plan.md`
- `docs/release-4-slice-8-toilet-paper-evidence-score-preview-result.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-plan.md`
- `docs/release-4-slice-12-shopping-first-user-account-evidence-readiness-result.md`
- `docs/release-4-slice-13-senior-friendly-shopping-usability-result.md`
- `docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md`

## Findings

### 1. No current production AI provider call found

Severity: Low

Type: Not present / current code aligned

Evidence:

- `src/lib/ai-evidence-parsing.ts` records parse jobs with `provider: "not_configured"` and `model: "none"`.
- `scripts/ngo-full-scale-slice-15-ai-evidence-parsing.test.mjs` explicitly asserts the helper is suggestion-only and does not call a provider.
- `supabase/migrations/202605260003_ngo_ai_evidence_parsing_readiness.sql` describes the feature as "Suggestion-only foundation; no production AI provider, no automated trust outcomes."

Assessment:

No current code path appears to call OpenAI, Anthropic, or another AI provider. The current implementation is a readiness/suggestion scaffold, not live AI automation.

Recommended fix:

No immediate product fix required. Before any provider integration is added, route all calls through a central AI service wrapper with budgets, logging, cache checks, and feature permissions.

### 2. No AI call found on page load, while typing, or in a background loop

Severity: Low

Type: Not present

Evidence:

- Searches for AI-related calls only found `reviewAiEvidenceSuggestionAction` wired to explicit form submission.
- Searches for `useEffect`, `onChange`, `onInput`, `setInterval`, `cron`, `schedule`, and background/queue patterns did not reveal AI provider execution on render, typing, or loops.
- `createAiEvidenceParseJob` and `createAiEvidenceSuggestion` exist as helpers, but no UI page-load or typing trigger was found.

Assessment:

Current UI does not appear to spend AI on page loads, keystrokes, or background loops.

Recommended fix:

Add a future test that scans for direct AI wrapper usage in client components and background jobs, and require intentional server action names such as `requestAiReviewAction`.

### 3. Current AI suggestion acceptance creates a reviewed draft claim through human action

Severity: Low to Medium

Type: Current code; mostly aligned, with terminology risk

Evidence:

- `reviewAiEvidenceSuggestion` requires member evidence edit permission.
- Accepted AI suggestions create a structured claim with `status: "reviewed"` and `source_ai_suggestion_id`.
- The action message says: "AI suggestion accepted as a reviewed draft claim. It is not an accepted trust fact yet."
- Report helpers include only structured claims with `status: "accepted"` in report trust summaries.

Assessment:

This does not appear to let AI independently approve, publish, score, or verify anything. The acceptance is a human action. However, the word `accepted` on `ai_evidence_suggestions.status` may confuse future developers because it sounds close to an accepted trust fact, even though the created structured claim is only `reviewed`.

Recommended fix:

Future cleanup should consider renaming AI suggestion statuses or documenting them more sharply:

- `suggested`
- `human_reviewed_for_draft`
- `human_rejected`

If renaming is too disruptive, add explicit helper comments/tests that `ai_evidence_suggestions.status = accepted` never means public verification, final approval, scoring, or publication.

### 4. Missing central AI service wrapper

Severity: Medium before provider launch

Type: Planned placeholder / missing control

Evidence:

- No central AI service wrapper was found.
- Existing helper is feature-specific: `src/lib/ai-evidence-parsing.ts`.
- No direct provider calls exist yet, so the risk is not active today.

Assessment:

This is not a current cost/security issue because AI providers are not enabled. It becomes a blocker before adding any real provider, Shopping AI research, supplier document parsing, or NGO report triage automation.

Recommended fix:

Add a server-only AI wrapper before any provider integration. The wrapper should enforce:

- feature permission
- environment cap
- organization budget
- user limit
- cache lookup
- usage logging
- provider call
- fallback response

Direct provider imports should be disallowed outside the wrapper.

### 5. Missing budget enforcement for active AI calls

Severity: Medium before provider launch

Type: Planned placeholder / missing control

Evidence:

- `supabase/migrations/202605240002_ngo_foundation.sql` includes `ai_usage_ledger`.
- `docs/release-2-5-live-readiness-checklist.md` says the AI usage ledger is schema-only.
- `src/lib/ai-evidence-parsing.ts` stores token/cost fields on parse jobs, but no hard budget cutoff or threshold checks were found.

Assessment:

The database has an early usage ledger foundation, but current code does not enforce budgets. Because no provider call exists, this is not yet spending money. It is a required gate before production AI.

Recommended fix:

Implement budget checks in the central AI wrapper:

- dev/staging hard cap
- per-feature monthly cap
- per-organization monthly cap
- per-user monthly cap
- warning thresholds at 50%, 75%, 90%, 100%
- graceful "AI unavailable, manual review still works" fallback

### 6. Missing AI cache checks before calls

Severity: Medium before provider launch

Type: Missing control

Evidence:

- No AI cache table/helper was found for content hashes.
- `ai_evidence_parse_jobs` has `input_reference` and `input_summary`, but no stable input hash or cache hit/miss field was found.
- The AI-minimize direction requires cache checks before provider calls.

Assessment:

No active provider means no duplicate spend today. But caching must be added before real AI summaries, product research, supplier parsing, or document parsing are enabled.

Recommended fix:

Add an AI cache model keyed by stable content hash:

- content hash
- feature
- action type
- source reference
- provider/model/prompt version
- structured output
- created/reviewed timestamps
- cache status

The wrapper should check cache first and log cache hit/miss.

### 7. AI usage logging is partial, not centralized

Severity: Medium before provider launch

Type: Current code partial / planned placeholder

Evidence:

- `ai_evidence_parse_jobs` records provider/model/token/cost fields.
- `audit_events` are written for parse request, suggestion creation, acceptance, and rejection.
- `ai_usage_ledger` exists in foundation migration, but no active wrapper writes were found.

Assessment:

For the current provider-disabled suggestion scaffold, logging is adequate. For real provider usage, logging is fragmented and should be centralized.

Recommended fix:

Centralize usage logging through the future AI wrapper and require fields from the AI-minimize doc:

- organization ID
- user ID
- feature
- action type
- provider/model
- estimated tokens/cost
- cache hit/miss
- created timestamp
- input hash
- output status
- error state

### 8. Public UI does not currently look like an "AI trust platform"

Severity: Low

Type: Not present / current code aligned

Evidence:

- Public Shopping pages lead with evidence gaps, score-pending language, source links, "Mishava is still reviewing this product," no-paid-ranking, and "Mishava is not the store."
- Shared NGO report pages state "No public score has been created" unless a published score snapshot exists.
- AI suggestion UI appears in the private org evidence area, not public Shopping pages or public shared reports.
- Search for "AI-powered", "AI trust", "AI verified", and similar phrases did not find problematic public claims.

Assessment:

Public copy is generally source-backed and conservative. It does not appear to market Mishava as an AI trust product.

Recommended fix:

Keep future public pages focused on sources, dates, review state, evidence gaps, and human-approved summaries. Avoid "AI-powered trust", "AI verified", or similar language.

### 9. Planned Shopping web research slice is directionally aligned but needs explicit AI-minimize gates

Severity: Medium

Type: Planned placeholder

Evidence:

- `docs/release-4-slice-14-shopping-web-research-preliminary-evidence-match-plan.md` plans web research/preliminary evidence match.
- The plan says no final AI scoring, no autonomous crawler, no unreviewed claims as scores, outside scorecards are references only, and human review is required.
- It does not yet explicitly reference the central AI wrapper, budget controls, cache checks, or usage logging.

Assessment:

The planned slice is mostly aligned in trust posture, but it could become expensive or too automated if implemented without the AI-minimize control layer first.

Recommended fix:

Before implementing Slice 14 or any AI-assisted research:

1. Add central AI wrapper.
2. Add budget/logging/cache foundation.
3. Require source collection and rule checks before AI.
4. Keep AI-generated research private/internal until reviewed.
5. Add tests blocking AI from final scores, ranking, supplier verification, and public claims.

### 10. Workflows appear to function without AI today

Severity: Low

Type: Current code aligned

Evidence:

- NGO evidence records, reports, structured claims, exports, shared reports, Shopping pages, product pages, and score-pending states all exist without live AI.
- `src/app/org/evidence/page.tsx` says AI suggestions, when present, are private draft help only.
- Shopping product pages use structured data and source/gap fields, not AI output, for product detail states.

Assessment:

Mishava currently remains usable without AI. This is aligned with the architecture direction.

Recommended fix:

Maintain this rule: every new AI-assisted feature must have a manual/rules-first fallback state.

## Summary Table

| Area | Status | Severity | Type | Recommended Action |
| --- | --- | --- | --- | --- |
| Automatic AI on page load | Not found | Low | Not present | Add future regression test |
| AI while typing | Not found | Low | Not present | Add future regression test |
| Background AI loops | Not found | Low | Not present | Keep blocked unless explicitly approved |
| AI affects scores/ranking/trust | Not found | Low | Current code aligned | Preserve tests |
| AI suggestion status terminology | Mostly aligned, wording risk | Low/Medium | Current code | Clarify accepted AI suggestion != accepted trust fact |
| Central AI wrapper | Missing | Medium | Planned placeholder | Implement before provider launch |
| Budget enforcement | Missing | Medium | Planned placeholder | Implement before provider launch |
| Cache checks | Missing | Medium | Planned placeholder | Implement before provider launch |
| Usage logging | Partial | Medium | Current partial | Centralize in wrapper |
| Public "AI trust" language | Not found | Low | Not present | Keep public pages source-backed |
| AI unavailable fallback | Current app works without AI | Low | Current code aligned | Preserve manual fallback |
| Planned Shopping web research | Mostly aligned, needs gates | Medium | Planned placeholder | Add wrapper/budget/cache first |

## Recommended Next Fix Order

1. Add a server-only central AI wrapper with no live provider enabled by default.
2. Add AI feature registry and permissions.
3. Add AI budget checks and usage logging.
4. Add content-hash cache lookup before provider calls.
5. Add tests proving AI cannot affect scores, rankings, verification, trust badges, publication, supplier/seller approval, NGO escalation, legal/compliance conclusions, page-load behavior, keystroke behavior, or background loops.
6. Update planned Shopping web research implementation requirements to depend on the wrapper and cache/budget layer.

## Audit Conclusion

No active high-severity AI-minimize conflict was found in current code. The current implementation appears intentionally provider-disabled and suggestion-only.

The main risk is future work: Mishava has schema/planning placeholders for AI usage, research, and evidence assistance, but it does not yet have the central budgeted/cache-aware AI wrapper required by the new architecture direction. That wrapper should be the next AI-related implementation slice before any live AI provider, Shopping web research, supplier parsing, or NGO report triage automation is enabled.

