import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("invite email delivery migration adds safe operational status fields", () => {
  const migration = read("supabase/migrations/202605240018_ngo_invite_email_delivery.sql");

  assert.match(migration, /create type invite_email_delivery_status/);
  assert.match(migration, /'not_configured'/);
  assert.match(migration, /'sent'/);
  assert.match(migration, /'failed'/);
  assert.match(migration, /email_delivery_status/);
  assert.match(migration, /email_provider_message_id/);
  assert.match(migration, /must never grant access or affect trust outcomes/);
});

test("server-only Resend helper fails soft when provider env is missing", () => {
  const helper = read("src/lib/email.ts");

  assert.match(helper, /RESEND_API_KEY/);
  assert.match(helper, /RESEND_FROM_EMAIL/);
  assert.match(helper, /RESEND_REPLY_TO_EMAIL/);
  assert.match(helper, /NEXT_PUBLIC_SITE_URL/);
  assert.match(helper, /SUPPORT_EMAIL/);
  assert.match(helper, /status: "not_configured"/);
  assert.match(helper, /sendResendEmail/);
  assert.match(helper, /authorization: `Bearer \$\{apiKey\}`/);
  assert.doesNotMatch(read("src/app/org/team/page.tsx"), /RESEND_API_KEY/);
  assert.doesNotMatch(read("src/app/org/team/actions.ts"), /RESEND_API_KEY/);
});

test("invite email template includes org, role, link, expiration, support, and security note", () => {
  const helper = read("src/lib/email.ts");

  assert.match(helper, /You've been invited to join a Mishava NGO workspace/);
  assert.match(helper, /organizationName/);
  assert.match(helper, /roleLabel/);
  assert.match(helper, /inviteUrl/);
  assert.match(helper, /expiresAt/);
  assert.match(helper, /getSupportEmail/);
  assert.match(helper, /only accept this invitation if you recognize this organization/);
  assert.match(helper, /must sign in with the invited email address/);
});

test("team invite creation records email status and supports resend action", () => {
  const team = read("src/lib/ngo-team.ts");
  const actions = read("src/app/org/team/actions.ts");
  const page = read("src/app/org/team/page.tsx");

  assert.match(team, /sendTeamInviteEmail/);
  assert.match(team, /team\.invite_email_sent/);
  assert.match(team, /team\.invite_email_failed/);
  assert.match(team, /team\.invite_resent/);
  assert.match(team, /email_delivery_status: result\.status/);
  assert.match(team, /email_sent_count/);
  assert.match(actions, /resendTeamInviteAction/);
  assert.match(actions, /email=\$\{result\.emailDeliveryStatus/);
  assert.match(page, /emailStatusMessage/);
  assert.match(page, /Resend email/);
  assert.match(page, /Email not configured/);
  assert.match(page, /fallback link/);
  assert.match(page, /Email failed/);
});

test("invite acceptance page explains wrong-email, revoked, expired, and accepted states", () => {
  const page = read("src/app/app/team-invites/[inviteId]/page.tsx");

  assert.match(page, /belongs to a different email address/);
  assert.match(page, /already been accepted/);
  assert.match(page, /has been revoked/);
  assert.match(page, /has expired/);
  assert.match(page, /Sign in with the\s+invited email/);
});
