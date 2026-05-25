# NGO Full-Scale Slice 10: Email Provider and Invite Polish Plan

Status: planning only. Do not implement from this document directly.

## Source Of Truth

- `docs/ngo-full-scale-completion-roadmap.md`
- `docs/ngo-full-scale-slice-9-auth-email-invite-smoke-result.md`
- `docs/ngo-full-scale-slice-3-team-management-result.md`
- `docs/ngo-full-scale-slice-1b-browser-auth-retest-result.md`

## Goal

Make Mishava NGO self-serve auth and team onboarding launch-ready by resolving the remaining email-dependent blockers:

- public sign-up hit Supabase email rate limit `429`;
- real email-inbox password reset link was not verified;
- team invite delivery remains dev-link/manual instead of production-ready email.

This slice should choose and plan the launch email path, define auth/invite email templates, remove founder/manual copy-paste from normal team invites, and preserve the existing security rule that invite links alone do not grant access.

## Scope

In scope:

- email provider decision;
- Supabase Auth email delivery path;
- sign-up confirmation email path;
- password reset email path;
- team invite email path;
- invite resend/revoked/expired/wrong-email UX polish;
- email template copy requirements;
- dashboard/env requirements;
- tests and launch acceptance criteria.

Out of scope:

- production Stripe;
- report exports;
- malware scanning;
- AI evidence parsing;
- SOC 2, ISO, VPAT, FedRAMP, or external compliance implementation;
- Shopping;
- Business;
- Local;
- Gov;
- Corporate;
- Plus;
- marketing email, newsletters, CRM, or campaigns;
- advanced notification center;
- AI support bot;
- touching the old `mishava / tghbfautnxblfxrtkdqb` Supabase project.

## Current Context

Slice 9 proved that the authenticated app paths are strong enough to continue:

- signed-in users can access `/app`;
- signed-in users can create NGO org/profile/membership rows through `/ngo/onboarding`;
- invite acceptance works for the invited email;
- wrong-email acceptance is blocked;
- revoked and expired invites are blocked;
- removed members lose access;
- non-admin users are blocked from `/admin/support`;
- password update works for an authenticated user.

Slice 9 did not prove public launch readiness because Supabase returned `429` during public sign-up, and because real inbox-based reset/invite delivery remains unverified.

## Email Provider Decision

### Options Reviewed

| Option | Strengths | Risks / limits | Recommendation |
| --- | --- | --- | --- |
| Supabase built-in email only | No new provider setup; useful for early dashboard/template exploration | Supabase documents the default sender as non-production, best-effort, team-address-limited, and rate-limited; Slice 9 already hit `429` | Do not use for launch |
| Supabase Auth + custom SMTP | Keeps Supabase Auth as the source for signup/reset links while removing the default email bottleneck | Requires provider setup, verified sender domain, SMTP credentials, dashboard settings, and rate-limit tuning | Recommended architecture |
| Resend via Supabase integration/custom SMTP | Developer-simple, Supabase-supported integration path, delivery/bounce visibility, clean transactional API for later custom invites | Requires domain verification and DNS setup; deliverability still needs testing with real inboxes | Recommended near-term provider |
| Postmark custom SMTP/API | Strong transactional-email reputation, SMTP support, domain verification, good fit for account/invite/reset mail | Slightly more setup/process weight than Resend; may be better once volume/support expectations mature | Good fallback / later upgrade |
| SendGrid custom SMTP/API | Mature and broad platform, domain authentication support, enterprise familiarity | More product surface than Mishava needs now; can be heavier to configure and govern | Later/enterprise fallback |
| Another transactional provider | Could fit if a preferred provider already exists | Unknown setup, limits, deliverability, and support posture | Defer unless founder already has a provider preference |

### Recommendation

Use **Supabase Auth with custom SMTP through Resend** for the near-term launch path.

Reasoning:

- Supabase itself recommends custom SMTP for production Auth email and states the default email sender is not meant for production use.
- Resend has a guided Supabase integration path and can be used for both Supabase Auth SMTP and later custom transactional emails.
- This keeps the current Supabase Auth foundation intact while resolving the email rate-limit blocker.
- It avoids building a custom auth-email system before Mishava needs one.

Use **Postmark** as the best fallback if Resend deliverability, DNS setup, or operational preference becomes a concern.

Use **SendGrid** only if Mishava later needs a broader enterprise email platform or already has a SendGrid account/process.

Sources reviewed:

- Supabase Auth rate limits: `https://supabase.com/docs/guides/auth/rate-limits`
- Supabase custom SMTP: `https://supabase.com/docs/guides/auth/auth-smtp`
- Supabase Resend integration: `https://supabase.com/partners/integrations/resend`
- Resend Supabase guide: `https://resend.com/supabase`
- Postmark SMTP/domain docs: `https://postmarkapp.com/developer/user-guide/send-email-with-smtp`, `https://postmarkapp.com/developer/api/domains-api`
- SendGrid domain authentication docs: `https://support.sendgrid.com/hc/en-us/articles/21415314709147-SendGrid-Automated-Security-Domain-Authentication`

## Required Email Flows

### 1. Sign-Up Confirmation

Purpose:

- verify account ownership;
- prevent accidental or malicious account creation;
- keep Mishava credible for NGO and institutional users.

Plan:

- use Supabase Auth confirmation flow;
- configure custom SMTP in Supabase;
- use `/auth/callback` as the confirmation redirect;
- after confirmation, user should be able to sign in and reach `/app`;
- if already signed in after confirmation, user may continue to `/ngo/onboarding`;
- message must be clear and non-marketing.

### 2. Password Reset

Purpose:

- allow self-serve recovery without founder/support intervention.

Plan:

- use Supabase Auth recovery flow;
- configure password reset redirect to `/auth/update-password`;
- verify the email link opens the local/staging/prod app correctly;
- verify password update succeeds from the reset session;
- verify user can sign in with the new password.

### 3. Team Invite

Purpose:

- allow NGO owners/admins to invite teammates without manual dev-safe link sharing.

Plan:

- keep current `organization_invites` table as source of truth;
- owner/admin creates invite from `/org/team`;
- app sends transactional invite email;
- email contains safe invite link to `/app/team-invites/[inviteId]`;
- recipient must sign in or sign up;
- authenticated user email must match the invite email;
- invite remains pending until accepted;
- acceptance creates or reactivates organization membership;
- revoked/expired invites cannot be accepted.

Implementation choice for invite email:

- use Resend API directly from a server-only route/helper for Mishava-created organization invites;
- do not rely on Supabase Auth admin invite for organization membership invites because Mishava already has organization-scoped invite rules and audit events;
- keep Supabase Auth SMTP for account confirmation and password reset.

### 4. Invite Accepted Notification

Purpose:

- optional owner/admin awareness that the teammate joined.

Plan:

- defer sending this email until after first production invite sending works;
- if implemented, send only to inviter or org owner/admin;
- do not include private evidence/report data;
- audit `team.invite_accepted` already exists and remains source of truth.

### 5. Support / Correction Acknowledgment

Purpose:

- later acknowledge support/correction submissions.

Plan:

- not required for Slice 10 implementation unless support forms already exist;
- reserve sender/reply-to approach now;
- do not email sensitive evidence details;
- route support/correction replies to a support inbox.

## Invite Email Delivery Plan

### Happy Path

1. Owner/admin opens `/org/team`.
2. Owner/admin enters email, role, optional expiration, optional note.
3. Server creates `organization_invites` row with `pending` status.
4. Server writes `team.invite_created` audit event.
5. Server sends invite email through Resend.
6. Invite list shows delivery status and dev-safe link as fallback in non-production only.
7. Recipient opens `/app/team-invites/[inviteId]`.
8. Recipient signs in or signs up.
9. Page compares authenticated email with invite email.
10. Matching recipient accepts.
11. Server creates/activates membership.
12. Server writes `team.invite_accepted` audit event.
13. Recipient lands in `/org/team` or `/app` with current org selected.

### Failure / Edge States

- Wrong email: show a clear message and do not accept invite.
- Revoked invite: show “This invitation has been revoked.”
- Expired invite: show “This invitation has expired. Ask the organization admin for a new invite.”
- Already accepted invite: show “This invitation has already been accepted.”
- Removed user: access remains blocked even if old invite link is reopened.
- Email send failed: invite remains pending, UI shows delivery failed, owner/admin can resend.
- Invite resent: preserve same invite if still pending, or create a new invite if old one expired/revoked, depending on implementation choice.

## Email Template Content

Tone rules:

- clear;
- trustworthy;
- calm;
- no marketing-heavy language;
- no inflated claims;
- no private evidence/report details;
- no promise of funding, certification, score improvement, or outcomes;
- visible support contact.

### Confirm Your Mishava Account

Subject:

```text
Confirm your Mishava account
```

Required content:

- “You created a Mishava account.”
- Confirm button/link.
- Link expiration if Supabase exposes/controls it.
- “If you did not create this account, you can ignore this email.”
- Support contact.

### Reset Your Mishava Password

Subject:

```text
Reset your Mishava password
```

Required content:

- “We received a request to reset your Mishava password.”
- Reset button/link.
- Security note: ignore if not requested.
- Link expiration if available.
- Support contact.

### NGO Workspace Invitation

Subject:

```text
You have been invited to join [Organization Name] on Mishava
```

Required content:

- organization name;
- invited role;
- inviter name/email if available;
- invite button/link to `/app/team-invites/[inviteId]`;
- expiration date if set;
- security note: must sign in with the invited email address;
- support contact;
- statement that the link does not expose private workspace data by itself.

### Revoked / Expired Invite Message

This is primarily an in-app message, not necessarily an email.

Required content:

- revoked: “This invitation has been revoked. Ask the organization admin if you still need access.”
- expired: “This invitation has expired. Ask the organization admin to send a new invite.”
- wrong email: “This invite belongs to a different email address. Sign in with the invited email before accepting.”

## Required Environment Variables

For recommended Resend path:

```bash
RESEND_API_KEY=
EMAIL_FROM_ADDRESS=
EMAIL_FROM_NAME=
EMAIL_REPLY_TO=
NEXT_PUBLIC_APP_URL=
```

For Supabase custom SMTP dashboard configuration:

```text
SMTP host
SMTP port
SMTP username
SMTP password
SMTP sender name
SMTP admin/from email
```

Rules:

- no provider secrets committed;
- `.env.local` remains ignored;
- production secrets live only in deployment/Supabase/provider secret storage;
- browser/client code must never receive provider API keys or SMTP passwords.

## Required Supabase Dashboard Settings

Confirm/set only on clean V2 project:

```text
mishava-v2-dev / snnscnodegbyqexnopvf
```

Settings:

- Site URL:
  - local: `http://localhost:3000`
  - staging: set when staging domain exists
  - production: set when production domain exists
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/update-password`
  - staging callback/update-password URLs when staging exists
  - production callback/update-password URLs when production exists
- Email confirmation:
  - recommended: enabled before public launch;
  - local/dev may temporarily disable only for controlled testing if necessary.
- Password reset redirect:
  - `/auth/update-password`.
- Custom SMTP:
  - enable for production-like testing;
  - use verified sender domain;
  - tune email rate limits after custom SMTP is active.
- Email templates:
  - confirm signup;
  - password reset;
  - email change if used later.
- MFA:
  - not forced in Slice 10;
  - document future requirement for Mishava admin/support and NGO owner/admin roles.

## Data Model / Backend Implications

Existing invite model remains valid:

- `organization_invites`
- `organization_memberships`
- `audit_events`

Possible small additions for implementation:

- `email_delivery_status` on `organization_invites`;
- `last_sent_at`;
- `sent_count`;
- `last_send_error`;
- `last_resent_by`;
- `last_resent_at`;
- optional `email_provider_message_id`.

If added, these fields must not grant access. They are operational delivery metadata only.

## Audit Logging Requirements

Already implemented:

- `team.invite_created`;
- `team.invite_accepted`;
- `team.invite_revoked`;
- `team.member_removed`.

Plan to add:

- `team.invite_email_sent`;
- `team.invite_email_failed`;
- `team.invite_resent`;

Do not log provider secrets, full email bodies, or private evidence/report data.

## Security And Privacy Requirements

- Invite link alone does not grant access.
- Invite acceptance requires authenticated email match.
- Revoked/expired invites cannot be accepted.
- Removed/suspended membership blocks workspace access.
- Email links must not expose private org workspace data.
- Email templates may include org name, role, inviter identity, and invite link, but not evidence/report contents.
- Provider keys live only in server env/secret storage.
- Email delivery failures should not leak internal stack traces to users.
- Support/correction emails should avoid sensitive raw evidence details.
- The old Supabase project must not be modified.

## Tests / Checks Required Before Slice 10 Acceptance

Provider/config checks:

- custom SMTP configured on clean V2 project only;
- provider domain verified;
- sender address verified;
- local/staging redirect URLs confirmed;
- no email provider secrets committed.

Auth flow tests:

- public sign-up sends confirmation email;
- confirmation link routes to `/auth/callback`;
- confirmed user can sign in;
- signed-in user can access `/app`;
- password reset email sends;
- reset link routes to `/auth/update-password`;
- password update succeeds from email reset session;
- user can sign in with updated password.

Invite tests:

- owner/admin creates invite and email is sent;
- invite email contains correct organization name and safe invite link;
- recipient can sign in/sign up and accept;
- wrong email cannot accept;
- revoked invite cannot accept;
- expired invite cannot accept;
- removed user remains blocked;
- resend invite works if implemented;
- non-admin cannot resend;
- invite send/resend writes audit events;
- invite send failure is shown safely.

Regression checks:

- `npm test`;
- `npm run lint`;
- `npm run build`;
- migration list aligned on `mishava-v2-dev`;
- existing onboarding/evidence/report/share/team tests still pass.

## Implementation Steps For Future Slice

1. Choose/confirm provider account.
2. Verify sending domain and sender identity.
3. Configure Supabase custom SMTP on clean V2 project.
4. Add provider env vars for app-side invite email sending.
5. Add server-only email helper.
6. Add invite email template renderer.
7. Send invite email after invite creation.
8. Add resend invite action and UI.
9. Add delivery status/error display in `/org/team`.
10. Polish revoked/expired/wrong-email invite messages.
11. Add audit events for send/resend/failure.
12. Run real inbox tests for confirmation, reset, and invite.
13. Record result doc with pass/fail and provider caveats.

## Risks

- DNS/domain verification can delay launch.
- Email deliverability may differ across Gmail, Outlook, iCloud, and organizational inboxes.
- Supabase dashboard redirect misconfiguration can make valid links fail.
- Email confirmation settings can block dev users if not documented.
- Provider rate limits can still apply, though they should be launch-appropriate.
- Invite resend can accidentally create duplicate invites if not carefully scoped.
- Emails can leak too much context if templates include report/evidence details.

## Acceptance Criteria

Slice 10 implementation can be accepted only when:

- the provider path is chosen and configured for the clean V2 project;
- public sign-up no longer fails from Supabase default email rate limits;
- confirmation email path is verified with a real inbox;
- password reset email path is verified with a real inbox;
- team invite email delivery works without founder/manual copy-paste;
- invite resend/revoked/expired/wrong-email states are clear;
- provider secrets are not committed or exposed to browser code;
- invite email delivery metadata does not affect trust outcomes;
- tests are passing;
- the old Supabase project is untouched.

## Recommended Next Step

Proceed with implementation of Slice 10 using:

```text
Supabase Auth custom SMTP + Resend for auth email
Resend server-side API for Mishava organization invite emails
```

Postmark should remain the first fallback if Resend deliverability or operational setup does not meet launch needs.
