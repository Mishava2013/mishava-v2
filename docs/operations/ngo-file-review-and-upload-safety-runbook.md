# NGO File Review And Upload Safety Runbook

Use this runbook until a real malware scanner is connected.

Current status as of 2026-06-16: this remains an operational/manual-review runbook. It does not replace a real malware scanner and does not change product behavior.

## Current Posture

Mishava NGO uses a quarantine-first/manual-review foundation.

New uploaded files are not automatically treated as clean. Mishava must not claim uploaded files are malware-free unless a real scanner or documented review supports that claim.

## Allowed Pilot Policy

For supported NGO pilots, file uploads may be allowed only if:

- raw files remain private;
- uploaded files show `pending` or `not_scanned` unless cleared;
- suspicious, rejected, failed, quarantined, and unreviewed files are blocked from new report/share/export use where implemented;
- support/admin views show metadata and scan status only;
- no raw file URLs or storage paths are exposed in public/shared exports.

## Manual Review Statuses

Use conservative statuses:

- `not_scanned`: scanner is not configured; file remains limited.
- `pending`: scanner/review is expected but not complete.
- `clean`: documented scanner result or explicit authorized manual review cleared the file.
- `suspicious`: possible risk; keep quarantined.
- `rejected`: do not use.
- `failed`: scanner/review failed; do not use until resolved.

## Manual Review Rules

1. Confirm the reviewer has admin/support authorization.
2. Review metadata first; do not open raw file content unless necessary and authorized.
3. If the file type is unexpected, mark suspicious/rejected.
4. If the file is from an unknown or high-risk source, mark pending or suspicious.
5. If manually cleared, record a short reason and reviewer identity through the supported helper/workflow.
6. Never mark `clean` just because upload succeeded.

## Launch Decision

Before broad public uploads:

- either integrate a real malware scanning provider/worker;
- or restrict file uploads to supported/manual-review cohorts and document the limitation publicly.

## User-Facing Language

Allowed:

- "Files remain private by default."
- "Uploaded files may be unavailable until reviewed."
- "Mishava does not treat uploads as clean until review or scanning supports that status."

Avoid:

- "Malware-free."
- "Virus-free."
- "Certified safe."
- "Secure file clearing."

## Evidence To Capture

For launch readiness:

- sample uploaded file with `not_scanned` or `pending`;
- sample quarantined/rejected file excluded from reports/exports;
- sample support summary showing counts without raw file access;
- audit event for scan status change;
- documentation of scanner choice or manual-review policy.
