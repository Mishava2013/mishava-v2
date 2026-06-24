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
  const evidenceActions = read("src/app/org/evidence/actions.ts");
  const reports = read("src/app/org/reports/page.tsx");
  const reportDetail = read("src/app/org/reports/[reportId]/page.tsx");
  const team = read("src/app/org/team/page.tsx");
  const ngoPublic = read("src/app/ngo/page.tsx");
  const onboarding = read("src/app/ngo/onboarding/page.tsx");
  const ngoReportsInfo = read("src/app/ngo/reports/page.tsx");
  const ngoConstants = read("src/lib/ngo.ts");
  const signInModal = read("src/components/SignInModal.tsx");

  assert.match(evidence, /held for review/);
  assert.match(evidence, /Edit evidence details/);
  assert.match(evidence, /Use status/);
  assert.match(evidence, /Add what you have/);
  assert.match(evidence, /It is okay if you do not have every item/);
  assert.match(evidence, /Paystub, timecard, photo, message, or note/);
  assert.match(evidence, /What issue is this about/);
  assert.match(evidence, /What work is this about/);
  assert.match(evidence, /Can this be shared outside the NGO/);
  assert.match(evidence, /Is there a retaliation concern/);
  assert.match(evidence, /Should the worker's name stay private/);
  assert.match(evidence, /immigration-related threat or fear/);
  assert.match(evidence, /Safe contact method/);
  assert.match(evidence, /Not sure yet/);
  assert.match(evidenceActions, /Worker-rights safety notes/);
  assert.match(evidenceActions, /shareOutsideNgo/);
  assert.match(evidenceActions, /retaliationConcern/);
  assert.match(evidenceActions, /workerNamePrivate/);
  assert.match(evidenceActions, /immigrationConcern/);
  assert.match(evidenceActions, /safeContactMethod/);
  assert.doesNotMatch(evidence, /Edit evidence metadata/);
  assert.doesNotMatch(evidence, /Lifecycle status/);
  assert.doesNotMatch(evidence, /AI-assisted suggestions/);
  assert.doesNotMatch(evidence, /AI assistance/);

  assert.match(reports, /Build private NGO packets/);
  assert.match(reports, /case packet, evidence packet, pattern report/);
  assert.match(reports, /Draft score note/);
  assert.match(reportDetail, /Create share link/);
  assert.match(reportDetail, /Turn off link/);
  assert.match(reportDetail, /That link no longer works/);
  assert.doesNotMatch(reportDetail, /Create scoped share grant/);
  assert.doesNotMatch(reportDetail, /Share grant revoked and access blocked/);

  assert.match(team, /fallback link/);
  assert.match(team, /Email not configured/);
  assert.match(team, /Revoke/);

  assert.match(ngoPublic, /Keep NGO proof organized, private, and ready/);
  assert.match(ngoPublic, /unpaid wages, unsafe work, retaliation, harassment/);
  assert.match(ngoPublic, /You choose what stays private/);
  assert.match(ngoPublic, /Why worker-rights groups and NGOs need this/);
  assert.match(ngoPublic, /Start with one case, one worksite, or one issue/);
  assert.match(ngoPublic, /Create your account and NGO profile/);
  assert.match(ngoPublic, /What happens next/);
  assert.match(ngoPublic, /Add your NGO name/);
  assert.match(ngoPublic, /Create your account/);
  assert.match(ngoPublic, /Upload or list evidence/);
  assert.match(ngoPublic, /\/auth\/sign-up\?next=%2Fngo%2Fonboarding&surface=ngo/);
  assert.doesNotMatch(ngoPublic, /Start a free NGO profile/);
  assert.doesNotMatch(ngoPublic, /AI access/);
  assert.doesNotMatch(ngoPublic, /Payment unlocks/);
  assert.doesNotMatch(ngoPublic, /workflows/);

  assert.match(onboarding, /Create your NGO profile/);
  assert.match(onboarding, /Create your free account first/);
  assert.match(onboarding, /one case, one worksite, or one issue/);
  assert.match(onboarding, /This lets Mishava save your NGO profile privately/);
  assert.match(onboarding, /Create free account/);
  assert.match(onboarding, /Already have an account\? Sign in/);
  assert.match(onboarding, /Build a packet or report when ready/);
  assert.match(onboarding, /Worker rights/);
  assert.match(onboarding, /Worker-rights issues you can track/);
  assert.match(onboarding, /Worker names can stay private/);
  assert.match(onboarding, /nextPath="\/ngo\/onboarding"/);
  assert.match(onboarding, /surface="ngo"/);
  assert.match(onboarding, /getCurrentSession/);
  assert.match(onboarding, /Who can see this at first/);
  assert.doesNotMatch(onboarding, /Sign in is required before an NGO profile can be saved/);
  assert.doesNotMatch(onboarding, /AI parse request/);
  assert.doesNotMatch(onboarding, /paid setup/);

  assert.match(ngoReportsInfo, /Build a packet when your NGO is ready/);
  assert.match(ngoReportsInfo, /A packet\s+can stay private/);
  assert.match(ngoReportsInfo, /review a case, prepare a complaint, show a pattern/);
  assert.match(ngoReportsInfo, /Early NGO partners can use this flow/);
  assert.doesNotMatch(ngoReportsInfo, /AI-assisted rebuilding/);
  assert.doesNotMatch(ngoReportsInfo, /paid or credit-based workflow/);
  assert.doesNotMatch(ngoReportsInfo, /product revenue covers AI cost/);
  assert.doesNotMatch(ngoReportsInfo, /legal determination/);

  assert.match(ngoConstants, /Unpaid wages/);
  assert.match(ngoConstants, /Unsafe work/);
  assert.match(ngoConstants, /Immigration-related threat/);
  assert.match(ngoConstants, /Labor contractor problem/);
  assert.match(ngoConstants, /Staffing agency problem/);
  assert.match(ngoConstants, /Housing tied to work/);
  assert.match(ngoConstants, /Farm work/);
  assert.match(ngoConstants, /Domestic work/);
  assert.match(ngoConstants, /Food processing/);
  assert.match(ngoConstants, /Boss or supervisor/);
  assert.match(ngoConstants, /Legal aid partner/);

  assert.match(signInModal, /function createAccountNextPath/);
  assert.match(signInModal, /surface === "ngo" && nextPath === "\/ngo"/);
  assert.match(signInModal, /return "\/ngo\/onboarding"/);
});

test("Sign-up copy avoids internal auth-provider language", () => {
  const signUp = read("src/app/auth/sign-up/page.tsx");

  assert.match(signUp, /Create your free Mishava Shopping account/);
  assert.match(signUp, /Use this account to save your NGO profile and keep your evidence work private/);
  assert.match(signUp, /Already have an account\? Sign in/);
  assert.match(signUp, /confirmationMessage/);
  assert.match(signUp, /confirm your email if prompted/);
  assert.doesNotMatch(signUp, /Shopping product evidence remains separate/);
  assert.doesNotMatch(signUp, /Supabase Auth powers this foundation/);
});
