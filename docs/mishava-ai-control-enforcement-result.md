# Mishava AI Control Enforcement Result

Date: June 23, 2026

Source of truth:

- `docs/mishava-ai-minimize-architecture-direction.md`
- `docs/mishava-ai-minimize-conflict-audit.md`
- `docs/mishava-ai-control-foundation-result.md`

## What Changed

Added a lightweight direct provider import guard so future code cannot quietly bypass the AI control foundation.

New test:

- `scripts/ai-provider-import-guard.test.mjs`

Updated documentation:

- `docs/mishava-ai-minimize-architecture-direction.md`

## Approved AI Integration Path

Provider SDKs and direct provider API URLs are only allowed in approved AI infrastructure paths:

- `src/lib/ai-control.ts`
- `src/lib/ai-provider-adapters/`

The adapter path is reserved for a future provider adapter layer. It is not active yet. Product code must still call the central control wrapper, not the provider adapter directly.

## Guarded Provider Surfaces

The import guard scans code-bearing repo areas for direct provider imports or direct provider API URLs, including:

- `src/`
- `scripts/`
- `middleware.ts`
- `next.config.ts`
- `eslint.config.mjs`

The guard currently checks for direct usage of:

- OpenAI SDK/imports or API URL
- Anthropic SDK/imports or API URL
- Google Gemini SDK/imports or API URL
- Vercel AI SDK style imports

## Tooling Stall Investigation

Commands that completed:

- `node -v`: `v20.20.0`
- `npm -v`: `10.8.2`
- `node ./node_modules/typescript/bin/tsc --version`: `Version 5.9.3`
- `node -e "require('./node_modules/next/package.json').version"`: `16.2.6`
- `node -e "require('./node_modules/eslint/package.json').version"`: `9.39.4`
- `npx tsc --showConfig`: completed and showed the expected project file list
- `.next` cache inspection: `.next` was not present
- `npm test`: passed

Commands that stalled silently without diagnostics:

- `npm run typecheck`
- `npx tsc --noEmit --incremental false --pretty false`
- `npx tsc --noEmit --skipLibCheck --module esnext --target es2017 --moduleResolution bundler --strict src/lib/ai-control.ts`
- `npx tsc --noEmit --listFilesOnly`
- `npm run lint`
- `npx eslint src/lib/ai-control.ts scripts/ai-control-foundation.test.mjs scripts/ngo-shopping-deep-pilot-readiness.test.mjs`
- `npx eslint --print-config src/lib/ai-control.ts`
- `npm run build`
- `npm ls typescript eslint next @typescript-eslint/parser @next/eslint-plugin-next`
- `node ./node_modules/eslint/bin/eslint.js --version`

Commands that were unusually slow:

- Reading `@typescript-eslint/parser/package.json` and `@next/eslint-plugin-next/package.json` through Node's resolver took long enough to look stalled, then returned after interruption with versions `8.59.4` and `16.2.6`.

Findings:

- The stall is not caused by `.next` cache scanning because `.next` was absent.
- The stall is unlikely to be a single TypeScript source error because `tsc --showConfig` completed, but even `tsc --listFilesOnly` and single-file checks stalled without diagnostics.
- The stall is unlikely to be caused by the new AI control source alone because the focused Node guardrail tests pass and the full Node test suite passes.
- The stall appears local tooling/dependency-resolution related because TypeScript checking, ESLint commands, and `npm ls` hang before producing useful output.
- ESLint-specific startup is especially suspicious: direct package metadata for `eslint` returns immediately, but the ESLint CLI itself hangs before printing `--version`.

Safest next step:

- Do not change product code to work around the stall.
- In a separate tooling-only pass, inspect/reinstall local dependencies or run the same checks in a clean clone/CI environment to determine whether this is local `node_modules` corruption, package-manager metadata churn, or a Next/ESLint/TypeScript tooling issue.
- If the clean environment passes, refresh local dependencies. If the clean environment also stalls, narrow next around ESLint flat config, `@typescript-eslint/parser`, and the Next ESLint plugin.

## Confirmation

- No real AI provider calls were enabled.
- No product UI AI calls were added.
- No scoring, ranking, verification, publishing, supplier approval, seller approval, NGO escalation, payment/access, or legal/compliance workflows were changed.
- No direct AI bypass paths were found by the new guard test.
