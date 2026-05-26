import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("admin support route is protected and linked from admin home", () => {
  const adminLayout = read("src/app/admin/layout.tsx");
  const middleware = read("middleware.ts");
  const adminHome = read("src/app/admin/page.tsx");
  const supportPage = read("src/app/admin/support/page.tsx");

  assert.match(adminLayout, /requireAdminSession/);
  assert.match(middleware, /"\/admin"/);
  assert.match(middleware, /admin_required/);
  assert.match(adminHome, /\/admin\/support/);
  assert.match(supportPage, /getNgoSupportSummaries/);
});

test("support dashboard renders NGO operational summaries without raw file access", () => {
  const supportPage = read("src/app/admin/support/page.tsx");
  const detailPage = read("src/app/admin/support/[organizationId]/page.tsx");
  const helper = read("src/lib/ngo-support.ts");

  for (const phrase of [
    "organizations",
    "NGO profile",
    "Members",
    "Evidence",
    "Reports",
    "Active share grants",
    "Billing",
    "Latest audit event",
    "Support status",
  ]) {
    assert.match(`${supportPage}\n${detailPage}`, new RegExp(phrase));
  }

  assert.match(detailPage, /raw evidence file contents/);
  assert.match(helper, /original_filename,mime_type,file_size_bytes,status,scan_status,quarantine_reason,visibility,uploaded_at/);
  assert.doesNotMatch(helper, /storage_path,/);
  assert.match(detailPage, /signed URLs, and storage paths are not shown by default/);
  assert.doesNotMatch(detailPage, /createSignedUrl|download raw/i);
});

test("admin support tooling is read-only and cannot silently alter trust outcomes", () => {
  const supportPage = read("src/app/admin/support/page.tsx");
  const detailPage = read("src/app/admin/support/[organizationId]/page.tsx");
  const helper = read("src/lib/ngo-support.ts");

  assert.match(supportPage, /Read-only support console/);
  assert.match(detailPage, /cannot directly edit\s+trust outcomes/);
  assert.match(helper, /cannot directly edit scores/);
  assert.match(helper, /evidence truth/);

  for (const forbidden of [
    "updateScore",
    "score_override",
    "direct_score_edit",
    "deleteEvidence",
    "deleteReport",
  ]) {
    assert.doesNotMatch(`${supportPage}\n${detailPage}\n${helper}`, new RegExp(forbidden));
  }
});

test("support detail connects support and corrections workflows without CRM or ticketing", () => {
  const detailPage = read("src/app/admin/support/[organizationId]/page.tsx");
  const result = read("docs/ngo-full-scale-slice-8-admin-support-result.md");

  assert.match(detailPage, /href="\/support"/);
  assert.match(detailPage, /href="\/legal\/corrections"/);
  assert.match(detailPage, /Correction\/dispute intake/);
  assert.match(detailPage, /not implemented in this read-only slice/);
  assert.match(result, /read-only/);
  assert.match(result, /No migration was needed/);
});

test("admin support result documents scope boundaries and remaining caveats", () => {
  const result = read("docs/ngo-full-scale-slice-8-admin-support-result.md");

  for (const phrase of [
    "Shopping",
    "Business",
    "Local",
    "Gov",
    "Corporate",
    "Plus",
    "AI scoring",
    "production Stripe",
    "final scoring math",
    "public report library",
    "broad analytics",
    "CRM",
    "ticketing",
    "AI support bot",
    "advanced admin scoring console",
    "public transparency dashboard",
  ]) {
    assert.match(result, new RegExp(phrase));
  }

  assert.match(result, /no trust outcomes can be silently manipulated/i);
});
