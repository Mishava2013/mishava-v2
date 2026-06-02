# NGO Backup, Monitoring, And Incident Readiness Checklist

Use this checklist before broad NGO public launch.

## Backup / Restore Drill

1. Confirm Supabase backup settings for the clean V2 project.
2. Identify restore point process.
3. Run a non-destructive restore drill in an approved environment.
4. Confirm key NGO tables can be restored or inspected.
5. Confirm evidence file storage recovery process.
6. Record drill date, scope, owner, and outcome.

Do not run any restore operation against production without explicit approval.

## Monitoring And Logging

Confirm monitoring exists for:

- app deployment health;
- Supabase auth/database errors;
- email delivery failures;
- invite failures;
- evidence upload failures;
- report/share/export failures;
- admin/support access;
- suspicious file scan statuses;
- auth rate limits;
- webhook/payment errors if Stripe is later enabled.

For the non-Stripe NGO launch path, payment monitoring can remain deferred.

## Incident Response Rehearsal

Run a tabletop rehearsal for:

- mistaken report share;
- wrong-org access report;
- lost account/password reset issue;
- suspicious evidence upload;
- exposed private file concern;
- invite sent to wrong email;
- support/admin account concern.

Record:

- incident owner;
- communication path;
- containment step;
- audit-log review step;
- correction/support response;
- postmortem notes.

## Access Review

Before pilot:

- list admin/support users;
- confirm each still needs access;
- confirm removed staff have no access;
- confirm support/admin roles cannot silently manipulate trust outcomes.

Before broad launch:

- define recurring access review cadence.

## Evidence To Capture

- backup/restore drill note;
- monitoring checklist with owners;
- incident tabletop notes;
- admin/support access review;
- support/corrections response path;
- vendor/subprocessor review status.

## Launch Rule

For supported NGO pilots, these can be manual and documented.

For broad self-serve public NGO launch, these need owners, repeatable procedures, and recorded evidence.
