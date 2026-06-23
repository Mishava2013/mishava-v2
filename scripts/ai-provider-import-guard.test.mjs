import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootPath = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const codeRoots = ["src", "scripts"];
const rootFiles = ["middleware.ts", "next.config.ts", "eslint.config.mjs"];

const approvedAiProviderPaths = [
  "src/lib/ai-control.ts",
  "src/lib/ai-provider-adapters/",
];

const ignoredPaths = new Set(["scripts/ai-provider-import-guard.test.mjs"]);

const providerImportPatterns = [
  /\bimport\s+(?:type\s+)?[^;]*\s+from\s+["'](?:openai|@anthropic-ai\/sdk|@google\/generative-ai|ai|@ai-sdk\/[^"']+)["']/i,
  /\bimport\s*\(\s*["'](?:openai|@anthropic-ai\/sdk|@google\/generative-ai|ai|@ai-sdk\/[^"']+)["']\s*\)/i,
  /\brequire\s*\(\s*["'](?:openai|@anthropic-ai\/sdk|@google\/generative-ai|ai|@ai-sdk\/[^"']+)["']\s*\)/i,
];

const directProviderUrlPatterns = [
  /https:\/\/api\.openai\.com/i,
  /https:\/\/api\.anthropic\.com/i,
  /https:\/\/generativelanguage\.googleapis\.com/i,
];

test("AI provider imports and direct API calls stay inside approved AI control paths", () => {
  const violations = [];

  for (const filePath of listCodeFiles()) {
    const repoPath = relative(rootPath, filePath);
    if (ignoredPaths.has(repoPath) || isApprovedAiPath(repoPath)) continue;

    const source = readFileSync(filePath, "utf8");
    const matchedImport = providerImportPatterns.find((pattern) => pattern.test(source));
    const matchedUrl = directProviderUrlPatterns.find((pattern) => pattern.test(source));

    if (matchedImport || matchedUrl) {
      violations.push(repoPath);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `AI provider bypass paths must use src/lib/ai-control.ts or src/lib/ai-provider-adapters/: ${violations.join(", ")}`,
  );
});

test("approved AI integration path is documented", () => {
  const direction = readFileSync(
    new URL("../docs/mishava-ai-minimize-architecture-direction.md", import.meta.url),
    "utf8",
  );
  const enforcement = readFileSync(
    new URL("../docs/mishava-ai-control-enforcement-result.md", import.meta.url),
    "utf8",
  );

  assert.match(direction, /Approved AI integration path/i);
  assert.match(direction, /src\/lib\/ai-control\.ts/);
  assert.match(direction, /src\/lib\/ai-provider-adapters\//);
  assert.match(enforcement, /direct provider import guard/i);
  assert.match(enforcement, /No real AI provider calls were enabled/i);
});

function listCodeFiles() {
  const files = [];

  for (const root of codeRoots) {
    walk(join(rootPath, root), files);
  }

  for (const file of rootFiles) {
    files.push(join(rootPath, file));
  }

  return files.filter((file) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file));
}

function walk(dir, files) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;

    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }

    files.push(path);
  }
}

function isApprovedAiPath(repoPath) {
  return approvedAiProviderPaths.some((approvedPath) =>
    approvedPath.endsWith("/")
      ? repoPath.startsWith(approvedPath)
      : repoPath === approvedPath,
  );
}
