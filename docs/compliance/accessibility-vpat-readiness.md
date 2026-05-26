# Accessibility, VPAT, WCAG, And Section 508 Readiness

Status: readiness documentation only. Mishava has not completed a formal VPAT/ACR or external accessibility audit.

## Goal

Prepare Mishava NGO for accessibility review and future procurement artifacts without claiming external completion.

## Current Target

- Target WCAG 2.2 AA where feasible.
- Maintain awareness of WCAG 2.1 AA for public-sector contexts.
- Prepare for future Section 508 and VPAT/ACR review.

## Current Foundations

- Semantic page structure in core routes.
- Skip link and main content target.
- Footer legal/support navigation with accessible label.
- Focus states.
- Form labels in NGO flows.
- Status labels that do not rely only on color in key NGO flows.
- Report and shared report views with readable structure.
- Print-friendly report output.

## Readiness Checklist

### Keyboard Navigation

- Verify all forms and actions can be reached with keyboard.
- Verify focus order is logical.
- Verify skip link works.
- Verify modal/popup components if introduced later.

### Screen Reader Labels

- Ensure form fields have labels.
- Ensure icon-only controls have accessible names if introduced.
- Ensure status regions are announced where appropriate.
- Ensure tables/lists have clear headings.

### Form Error Handling

- Provide clear error text.
- Associate errors with fields where feasible.
- Keep status messages readable and non-color-only.

### Contrast And Visual State

- Review text/background contrast.
- Review focus-visible state contrast.
- Avoid using color alone for status.

### Report And Export Accessibility

- Preserve heading hierarchy.
- Include generated/exported date.
- Keep disclaimers readable.
- Exclude raw files by default.
- Review PDF/print output structure before external sharing claims.

### Mobile Usability

- Review evidence, report, sharing, billing, and team flows on mobile.
- Ensure controls do not overlap.
- Ensure long labels wrap safely.

## Future VPAT / ACR Preparation

Needed before procurement claims:

- Accessibility issue inventory.
- Manual keyboard test results.
- Screen-reader smoke results.
- Mobile viewport review.
- Color contrast review.
- Report/export accessibility review.
- External accessibility review.
- Draft VPAT/ACR prepared by qualified reviewer.

## Known Gaps

- No external accessibility audit completed.
- A formal VPAT/ACR has not been completed.
- PDF/export accessibility is not externally reviewed.
- Full screen-reader QA is not completed.
- Mobile/accessibility regression suite is not complete.
