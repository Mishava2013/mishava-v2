import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("Shopping product pages expose a plain report-problem path without changing trust outcomes", () => {
  const page = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(page, /Report a problem with this product/);
  assert.match(page, /Wrong product details/);
  assert.match(page, /Missing company, manufacturer, or supplier information/);
  assert.match(page, /Broken source or retailer link/);
  assert.match(page, /Reporting a problem does not change scores or\s+ranking/);
  assert.match(page, /How corrections work/);
  assert.doesNotMatch(page, /affiliate|commission sorting/i);
});

test("Shopping product detail uses friendlier labels for low-reading pilot users", () => {
  const page = read("src/app/shopping/products/[slug]/page.tsx");

  assert.match(page, /Maker information/);
  assert.match(page, /Supplier information/);
  assert.match(page, /Not found yet/);
  assert.match(page, /These checks are early notes only/);
  assert.match(page, /What this means/);
  assert.doesNotMatch(page, /Manufacturer info/);
  assert.doesNotMatch(page, /Evidence context/);
});

test("NGO evidence and report flows prefer plain-language pilot wording", () => {
  const evidence = read("src/app/org/evidence/page.tsx");
  const reports = read("src/app/org/reports/page.tsx");
  const reportDetail = read("src/app/org/reports/[reportId]/page.tsx");
  const team = read("src/app/org/team/page.tsx");
  const onboarding = read("src/app/ngo/onboarding/page.tsx");

  assert.match(evidence, /held for review/);
  assert.match(evidence, /Edit evidence details/);
  assert.match(evidence, /Use status/);
  assert.doesNotMatch(evidence, /Edit evidence metadata/);
  assert.doesNotMatch(evidence, /Lifecycle status/);

  assert.match(reports, /Build private NGO reports/);
  assert.match(reports, /Draft score note/);
  assert.match(reportDetail, /Create share link/);
  assert.match(reportDetail, /Turn off link/);
  assert.match(reportDetail, /That link no longer works/);
  assert.doesNotMatch(reportDetail, /Create scoped share grant/);
  assert.doesNotMatch(reportDetail, /Share grant revoked and access blocked/);

  assert.match(team, /fallback link/);
  assert.match(team, /Email not configured/);
  assert.match(team, /Revoke/);

  assert.match(onboarding, /Create your NGO profile/);
  assert.match(onboarding, /Who can see this at first/);
});

test("Sign-up copy avoids internal auth-provider language", () => {
  const signUp = read("src/app/auth/sign-up/page.tsx");

  assert.match(signUp, /Create your free Mishava Shopping account/);
  assert.match(signUp, /confirmationMessage/);
  assert.match(signUp, /confirm your email if prompted/);
  assert.doesNotMatch(signUp, /Supabase Auth powers this foundation/);
});
