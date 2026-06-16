import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("legal, trust, accessibility, security, corrections, and support pages render from baseline content", () => {
  const legalContent = read("src/lib/legal-pages.ts");
  const legalPage = read("src/components/LegalPage.tsx");

  for (const phrase of [
    "Terms of Service",
    "Privacy Policy",
    "Evidence Submission Terms",
    "Report Sharing Terms",
    "No Paid Trust Outcomes",
    "Accessibility Statement",
    "Security Overview",
    "Corrections, Disputes, And Error Reporting",
    "Contact And Support",
    "Draft baseline only",
    "subject to attorney review",
  ]) {
    assert.match(legalContent, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const route of [
    "src/app/legal/terms/page.tsx",
    "src/app/legal/privacy/page.tsx",
    "src/app/legal/evidence-submission/page.tsx",
    "src/app/legal/report-sharing/page.tsx",
    "src/app/legal/no-paid-trust-outcomes/page.tsx",
    "src/app/legal/accessibility/page.tsx",
    "src/app/legal/security/page.tsx",
    "src/app/legal/corrections/page.tsx",
    "src/app/support/page.tsx",
  ]) {
    assert.match(read(route), /LegalPage/);
  }

  assert.match(legalPage, /role="status"/);
});

test("footer exposes legal and support links without cluttering primary navigation", () => {
  const shell = read("src/components/SiteShell.tsx");

  for (const href of [
    "/legal/terms",
    "/legal/privacy",
    "/legal/accessibility",
    "/legal/security",
    "/legal/corrections",
    "/support",
    "/legal/no-paid-trust-outcomes",
  ]) {
    assert.match(shell, new RegExp(`href="${href}"`));
  }

  assert.match(shell, /aria-label="Footer legal and support links"/);
  assert.match(shell, /Skip to main content/);
  const primaryNavBlock = shell.match(/const navItems = \[[\s\S]*?\];/)?.[0] ?? "";
  assert.doesNotMatch(primaryNavBlock, /\/legal\/terms/);
});

test("baseline language avoids premature certification and compliance overclaims", () => {
  const legalContent = read("src/lib/legal-pages.ts");

  assert.match(legalContent, /not SOC 2 certified/);
  assert.match(legalContent, /not.*ISO 27001 certified/);
  assert.match(legalContent, /not.*FedRAMP authorized/);
  assert.match(legalContent, /has not completed an external accessibility audit/);
  assert.doesNotMatch(legalContent, /ADA certified/i);
  assert.doesNotMatch(legalContent, /SOC 2 Type II certified/i);
  assert.doesNotMatch(legalContent, /FedRAMP certified/i);
  assert.doesNotMatch(legalContent, /VPAT\/ACR complete/i);
});

test("NGO evidence, report, shared report, and billing disclaimers render", () => {
  const evidence = read("src/app/org/evidence/page.tsx");
  const report = read("src/app/org/reports/[reportId]/page.tsx");
  const shared = read("src/app/shared/ngo-reports/[grantId]/page.tsx");
  const billing = read("src/app/org/billing/page.tsx");

  assert.match(evidence, /legally allowed to provide/);
  assert.match(evidence, /Mishava does\s+not guarantee funding/);
  assert.match(evidence, /Raw files are private to your organization/);
  assert.match(evidence, /selected summaries/);

  assert.match(report, /This report is based on selected evidence and may not represent a\s+complete record/);
  assert.match(report, /does not\s+guarantee funding/);
  assert.match(report, /raw files by default/);
  assert.match(report, /Raw files are private by default/);

  assert.match(shared, /does not provide\s+full workspace access/);
  assert.match(shared, /does not\s+guarantee funding/);

  assert.match(billing, /Payment and\s+plan tier do not change trust outcomes/);
  assert.match(billing, /noPaidTrustOutcomeMessage/);
});

test("accessibility baseline includes skip link, focus states, footer nav labels, and print/report structure", () => {
  const css = read("src/app/globals.css");
  const shell = read("src/components/SiteShell.tsx");
  const report = read("src/app/org/reports/[reportId]/page.tsx");
  const shared = read("src/app/shared/ngo-reports/[grantId]/page.tsx");

  assert.match(css, /:focus-visible/);
  assert.match(css, /\.skip-link/);
  assert.match(css, /@media print/);
  assert.match(shell, /id="main-content"/);
  assert.match(shell, /aria-label="Footer legal and support links"/);
  assert.match(report, /aria-labelledby="report-preview-title"/);
  assert.match(shared, /aria-labelledby="shared-report-title"/);
  assert.match(report, /role="status"/);
});

test("protected routes remain protected by middleware", () => {
  const proxy = read("middleware.ts");

  assert.match(proxy, /protectedPrefixes = \["\/app", "\/org", "\/admin"\]/);
  assert.match(proxy, /resolveMishavaSubdomainRoute/);
  assert.match(proxy, /pathname\.startsWith\("\/admin"\)/);
  assert.match(proxy, /admin_required/);
  assert.match(proxy, /NextResponse\.rewrite/);
});
