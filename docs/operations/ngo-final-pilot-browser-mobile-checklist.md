# NGO Final Pilot Browser And Mobile Checklist

Use this checklist before inviting NGO pilot users.

## Scope

This verifies the user-visible NGO workflow. It excludes Stripe/payment collection.

## Desktop Browser Pass

1. Open public `/ngo`.
2. Confirm CTA language is clear and does not overclaim.
3. Open sign-in popup.
4. Create account or use a verified test account.
5. Sign in.
6. Sign out.
7. Reset password if live email is configured.
8. Create an NGO organization.
9. Confirm current org selection.
10. Switch orgs if multiple memberships exist.
11. Confirm stale/wrong org access is blocked.
12. Open org profile and update allowed fields.
13. Create evidence.
14. Upload an allowed file type.
15. Confirm unsupported file type is rejected.
16. Confirm file scan/quarantine status language is visible.
17. Edit evidence.
18. Archive evidence.
19. Draft a structured claim.
20. Accept/review claim if the workflow allows it.
21. Create a report.
22. Edit report title/evidence/claim selections.
23. Preview report.
24. Open print-ready report route.
25. Export CSV evidence summary.
26. Confirm raw files and storage paths are excluded.
27. Create scoped share grant.
28. Confirm shared recipient can view only the granted report.
29. Revoke share grant.
30. Confirm revoked/expired grant is blocked.
31. Open billing/entitlements page and confirm test-mode/no-paid-trust language.
32. Open support/legal/security/accessibility pages.
33. Open admin/support only as admin/support role.
34. Confirm non-admin is blocked from admin/support.

## Mobile Pass

Repeat the critical path on a mobile viewport or real device:

1. Public `/ngo`.
2. Sign-in popup.
3. Org home/profile.
4. Evidence list/create form.
5. Report detail/preview.
6. Share controls.
7. Billing/entitlement status.
8. Support/legal links.

Mobile pass criteria:

- text is readable;
- buttons are large enough;
- forms are usable;
- tables/exports do not break layout;
- modals are dismissible;
- no important text is hidden behind nav or footer.

## Screenshots To Capture

- `/ngo` hero.
- Sign-in popup.
- Account/create flow or confirmed account state.
- Org profile.
- Evidence list.
- Evidence upload/scan-status area.
- Report detail.
- CSV export response or export confirmation.
- Share grant view.
- Shared recipient view.
- Billing/entitlements page.
- Support/legal page.
- Mobile `/ngo`.
- Mobile evidence/report screens.

Screenshots should remain ignored/uncommitted unless explicitly approved.

## Pass / Fail Rating

Use:

- `pass`
- `pass with pilot caveat`
- `blocked`

Document every blocker with:

- route;
- role;
- exact behavior;
- expected behavior;
- whether it is code, dashboard, data, or operational.
