# NGO Full-Scale Slice 10B: Invite Email Sending with Resend Result

## Purpose

Move NGO team invites from manual/dev-link only toward production-ready server-side invite email sending using Resend.

This slice implements organization invite email readiness and UX polish only. It does not configure Supabase Auth SMTP in code and does not implement production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, newsletters, bulk email, CRM, notification center, marketing email, or production billing emails.

## What Was Implemented

### Server-Side Resend Helper

Added `src/lib/email.ts` with:

- Resend configuration detection;
- safe public site URL helper;
- support email fallback;
- invite URL builder;
- plain/trustworthy NGO invite email template;
- server-side `sendResendEmail` helper;
- fail-soft behavior when Resend is not configured.

Required env vars:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=
SUPPORT_EMAIL=
```

`RESEND_API_KEY` is referenced only in server/domain code and is not exposed in app route UI code.

### Invite Email Template

The template includes:

- invited organization name;
- inviter email;
- role;
- invite link;
- expiration text when available;
- support email;
- security note that the recipient should only accept if they recognize the organization;
- security note that the invite link alone does not expose private workspace data and the recipient must sign in with the invited email address.

The subject is:

```text
You've been invited to join a Mishava NGO workspace
```

### Invite Creation Behavior

Invite creation still creates the invite record first and writes the existing `team.invite_created` audit event.

After invite creation, Mishava now attempts to send the invite email:

- `sent` when Resend is configured and the request succeeds;
- `failed` when Resend is configured but the request fails;
- `not_configured` when required Resend env vars are missing.

Missing Resend configuration does **not** crash invite creation. The UI shows that email is not configured and keeps the fallback invite link visible.

### Invite Delivery Metadata

Added migration:

```text
202605240018_ngo_invite_email_delivery.sql
```

It adds operational-only delivery fields to `organization_invites`:

- `email_delivery_status`;
- `email_delivery_error`;
- `email_sent_at`;
- `email_last_attempt_at`;
- `email_sent_count`;
- `email_provider_message_id`.

These fields are explicitly operational delivery metadata only. They do not grant access and must never affect trust outcomes.

### Resend / Retry Invite

Added an owner/admin-only resend flow for pending invites:

- `resendTeamInvite`;
- `resendTeamInviteAction`;
- `/org/team` “Resend email” action for pending invites.

Resend is blocked if:

- the user cannot manage the NGO team;
- the invite does not belong to the current organization;
- the invite is not pending;
- the invite is expired.

### Invite UX Polish

Improved `/org/team` to show:

- email delivery status;
- last attempt date;
- sent count;
- delivery error message when present;
- fallback invite link;
- resend action;
- clearer created/resent notices.

Improved `/app/team-invites/[inviteId]` messaging for:

- wrong email;
- accepted invite;
- revoked invite;
- expired invite;
- generic non-pending invite.

## Audit Events

Existing audit events remain:

- `team.invite_created`;
- `team.invite_accepted`;
- `team.invite_revoked`;
- `team.member_removed`.

New audit events:

- `team.invite_email_sent`;
- `team.invite_email_failed`;
- `team.invite_resent`.

No provider secrets, full email body, private evidence, or private report data should be written into audit events.

## Migration Status

Migration applied to the clean V2 Supabase project only:

```text
Project: mishava-v2-dev
Ref: snnscnodegbyqexnopvf
```

Command used:

```bash
supabase db push --linked
```

Remote migration list confirmed local and remote are aligned through:

```text
202605240018
```

The old Supabase project was not modified:

```text
mishava / tghbfautnxblfxrtkdqb
```

## Tests Run

```bash
npm test
npm run lint
npm run build
supabase migration list --linked
```

Results:

- `npm test`: passed, 101/101 tests.
- `npm run lint`: passed.
- `npm run build`: passed.
- `supabase migration list --linked`: clean V2 local/remote migrations aligned through `202605240018`.

## Known Limitations

- Invite email is **app-ready**, not production-ready, until real Resend env vars and verified sender/domain are configured.
- Supabase Auth custom SMTP dashboard configuration is still manual and was not implemented in code.
- Public sign-up confirmation and password reset still need real inbox retesting after Supabase Auth SMTP is configured.
- No live Resend send was performed because this environment does not include real Resend secrets.
- Email delivery failures are recorded, but advanced bounce handling is not implemented.
- This does not add a full notification center or CRM/ticketing workflow.

## Manual Work Still Needed

Before production invite email can be called production-ready:

1. Verify Mishava sending domain in Resend.
2. Set `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL`.
4. Set `RESEND_REPLY_TO_EMAIL`.
5. Set `NEXT_PUBLIC_SITE_URL`.
6. Set `SUPPORT_EMAIL`.
7. Send a real invite to a real inbox.
8. Confirm the email link opens `/app/team-invites/[inviteId]`.
9. Confirm wrong-email, revoked, expired, accepted, and removed-member states still behave correctly.
10. Configure Supabase Auth custom SMTP separately for sign-up and password reset.

## Final Status

Slice 10B is **app-ready pending Resend/domain env setup**.

Invite creation no longer depends on manual links as the only planned path. Once Resend is configured, Mishava will attempt real server-side invite email delivery while keeping the safe fallback link for support and non-production environments.

## Scope Confirmation

No Supabase Auth SMTP dashboard configuration was implemented in code.

No production Stripe, report exports, malware scanning, AI evidence parsing, SOC 2/ISO/VPAT implementation, Shopping, Business, Local, Gov, Corporate, Plus, newsletters, marketing email, bulk email, CRM, notification center, or production billing emails were added.

The old Supabase project `mishava / tghbfautnxblfxrtkdqb` was not modified.
