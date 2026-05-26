import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

const complianceDocs = [
  "docs/compliance/README.md",
  "docs/compliance/soc-2-readiness.md",
  "docs/compliance/iso-27001-readiness.md",
  "docs/compliance/accessibility-vpat-readiness.md",
  "docs/compliance/privacy-data-governance.md",
  "docs/compliance/security-control-gaps.md",
  "docs/compliance/audit-evidence-index.md",
];

test("Slice 16 creates the required compliance readiness documentation set", () => {
  for (const doc of complianceDocs) {
    assert.doesNotThrow(() => read(doc), `${doc} should exist`);
  }

  const readme = read("docs/compliance/README.md");
  assert.match(readme, /future compliance reviews/);
  assert.match(readme, /not SOC 2 certified/);
  assert.match(readme, /not ISO 27001 certified/);
  assert.match(readme, /not FedRAMP authorized/);
  assert.match(readme, /has not completed a formal VPAT\/ACR/);
  assert.match(readme, /targets WCAG 2\.2 AA/);
});

test("SOC 2 and ISO readiness docs map controls without claiming certification", () => {
  const soc2 = read("docs/compliance/soc-2-readiness.md");
  const iso = read("docs/compliance/iso-27001-readiness.md");

  for (const phrase of [
    "Access Controls",
    "Authentication",
    "Role Permissions",
    "Audit Logging",
    "Change Management",
    "Incident Response",
    "Vendor Management",
    "Data Retention And Deletion",
    "Backup And Recovery",
    "Security Monitoring",
  ]) {
    assert.match(soc2, new RegExp(phrase));
  }

  for (const phrase of [
    "Information Security Policy",
    "Risk Register",
    "Asset Inventory",
    "Access Control Policy",
    "Supplier And Subprocessor List",
    "Incident Management",
    "Business Continuity",
    "Secure Development Policy",
    "Internal Audit Preparation",
  ]) {
    assert.match(iso, new RegExp(phrase));
  }

  assert.match(soc2, /not SOC 2 certified/);
  assert.match(iso, /not ISO 27001 certified/);
});

test("accessibility and privacy readiness docs cover VPAT/WCAG, Section 508, and data governance", () => {
  const accessibility = read("docs/compliance/accessibility-vpat-readiness.md");
  const privacy = read("docs/compliance/privacy-data-governance.md");

  for (const phrase of [
    "WCAG 2.2 AA",
    "Section 508",
    "VPAT/ACR",
    "Keyboard Navigation",
    "Screen Reader Labels",
    "Form Error Handling",
    "Contrast",
    "Report And Export Accessibility",
    "Mobile Usability",
  ]) {
    assert.match(accessibility, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const phrase of [
    "User Account Data",
    "NGO Profile Data",
    "Uploaded Evidence Files",
    "AI Suggestion Data",
    "Billing Metadata",
    "Audit Logs",
    "Shared Report Recipient Data",
    "Vendor / Subprocessor Placeholder",
    "Retention And Deletion Request Process",
  ]) {
    assert.match(privacy, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("security gaps and audit evidence index track future readiness work", () => {
  const gaps = read("docs/compliance/security-control-gaps.md");
  const evidence = read("docs/compliance/audit-evidence-index.md");

  for (const phrase of [
    "Resend/domain plus Supabase custom SMTP inbox verification",
    "Production Stripe dashboard",
    "Real malware scanner integration is not implemented",
    "AI provider is not selected",
    "External penetration test has not been performed",
    "Backup/restore drill has not been performed",
    "Formal access review process is not implemented",
    "Production monitoring/logging/alerting is not complete",
    "Formal vendor/subprocessor review",
  ]) {
    assert.match(gaps, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const phrase of [
    "policies/",
    "architecture/",
    "access-control/",
    "audit-logs/",
    "change-management/",
    "vendors/",
    "security-reviews/",
    "accessibility/",
    "incidents/",
  ]) {
    assert.match(evidence, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("legal pages reference readiness posture without overclaiming", () => {
  const legal = read("src/lib/legal-pages.ts");

  assert.match(legal, /not SOC 2 certified/);
  assert.match(legal, /not.*ISO 27001 certified/);
  assert.match(legal, /not.*FedRAMP authorized/);
  assert.match(legal, /has not completed an external accessibility audit/);
  assert.match(legal, /Internal compliance readiness documentation tracks SOC 2, ISO 27001/);
  assert.match(legal, /Internal accessibility readiness documentation tracks WCAG/);
});

test("forbidden compliance claims are absent unless clearly negated or readiness-framed", () => {
  const files = [
    "src/lib/legal-pages.ts",
    ...complianceDocs,
    "docs/ngo-full-scale-slice-16-compliance-readiness-result.md",
  ];
  const forbidden = [
    "SOC 2 certified",
    "SOC 2 compliant",
    "ISO 27001 certified",
    "FedRAMP authorized",
    "ADA certified",
    "VPAT complete",
    "ACR complete",
    "bank-grade compliant",
  ];
  const allowedContext = /(not|not yet|has not|have not|without claiming|does not claim|must not claim|do not claim|readiness|targeting|future|formal .*not complete)/i;

  for (const file of files) {
    const lines = read(file).split("\n");
    lines.forEach((line, index) => {
      for (const phrase of forbidden) {
        if (line.toLowerCase().includes(phrase.toLowerCase())) {
          assert.match(
            line,
            allowedContext,
            `${file}:${index + 1} uses "${phrase}" without clear negation/readiness framing`,
          );
        }
      }
    });
  }
});
