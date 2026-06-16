import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("NGO near-100 readiness result excludes Stripe and names remaining non-Stripe gates", () => {
  const result = read("docs/ngo-near-100-non-stripe-readiness-result.md");

  assert.match(result, /Excluding Stripe\/payment ability/);
  assert.match(result, /Supported NGO pilot readiness/);
  assert.match(result, /Broad public self-serve NGO readiness/);
  assert.match(result, /2026-06-16/);
  assert.match(result, /repo-side live email\/Auth closure has been completed/);
  assert.match(result, /docs\/ngo-live-email-auth-closure-result\.md/);
  assert.match(result, /161\/161/);
  assert.match(result, /Live Email And Auth Verification/);
  assert.match(result, /Evidence\/File Security Hardening Without Overclaiming/);
  assert.match(result, /Operational Readiness/);
  assert.match(result, /External Review And Launch Decision/);
  assert.match(result, /No production charging was enabled/);
  assert.match(result, /Old Supabase project `mishava \/ tghbfautnxblfxrtkdqb` was not touched/);
});

test("NGO operational checklists cover email, file safety, browser/mobile, and incident readiness", () => {
  const email = read("docs/operations/ngo-live-email-auth-verification-checklist.md");
  const files = read("docs/operations/ngo-file-review-and-upload-safety-runbook.md");
  const browser = read("docs/operations/ngo-final-pilot-browser-mobile-checklist.md");
  const ops = read("docs/operations/ngo-backup-monitoring-incident-readiness-checklist.md");

  for (const phrase of [
    "RESEND_API_KEY",
    "docs/ngo-live-email-auth-closure-result.md",
    "Supabase Auth Custom SMTP",
    "Public Sign-Up Test",
    "Password Reset Test",
    "Team Invite Test",
  ]) {
    assert.match(email, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const phrase of [
    "quarantine-first/manual-review",
    "not_scanned",
    "pending",
    "clean",
    "Never mark `clean` just because upload succeeded",
    "Avoid:",
    "Malware-free",
  ]) {
    assert.match(files, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const phrase of [
    "Open public `/ngo`",
    "Sign-in popup",
    "Create an NGO organization",
    "Export CSV evidence summary",
    "Mobile Pass",
    "pass with pilot caveat",
  ]) {
    assert.match(browser, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const phrase of [
    "Backup / Restore Drill",
    "Monitoring And Logging",
    "Incident Response Rehearsal",
    "Access Review",
    "For broad self-serve public NGO launch",
  ]) {
    assert.match(ops, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
