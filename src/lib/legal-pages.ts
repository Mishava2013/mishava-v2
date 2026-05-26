export type LegalPageSection = {
  title: string;
  body: string[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  statusNote: string;
  sections: LegalPageSection[];
};

export const legalPages = {
  terms: {
    eyebrow: "Legal baseline",
    title: "Terms of Service",
    intro:
      "These draft baseline terms describe how Mishava accounts, organizations, evidence workflows, reports, and shared access are intended to work before broad self-serve launch.",
    statusNote:
      "Draft baseline only. This page is not legal advice and remains subject to attorney review before broad production use.",
    sections: [
      {
        title: "Use of Mishava",
        body: [
          "Mishava provides trust infrastructure tools for organizing evidence, creating NGO reports, managing scoped sharing, and documenting transparent workflows.",
          "Users are responsible for using Mishava lawfully, maintaining accurate account information, and respecting the privacy and rights of people or organizations referenced in submitted evidence.",
        ],
      },
      {
        title: "No guaranteed outcomes",
        body: [
          "Mishava does not guarantee funding, donations, ratings, certifications, procurement decisions, verification outcomes, score outcomes, press coverage, or other business or institutional results.",
          "Reports and trust context may be provisional, incomplete, or limited by available evidence.",
        ],
      },
      {
        title: "Trust integrity",
        body: [
          "Payment, plan tier, setup purchases, sponsorship, or hosted-tool access must not change Mishava trust outcomes, scores, ranking, verification, evidence truth, or credibility labels.",
          "Mishava may preserve audit logs, correction history, and dispute history to protect transparency and trust integrity.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy baseline",
    title: "Privacy Policy",
    intro:
      "This draft baseline explains the main categories of information Mishava expects to handle for NGO accounts, evidence, reports, sharing, audit trails, and support.",
    statusNote:
      "Draft baseline only. This policy needs privacy and attorney review before broad production launch.",
    sections: [
      {
        title: "Information handled",
        body: [
          "Mishava may handle account data, NGO profile data, organization membership records, uploaded evidence files, evidence metadata, report data, share recipient information, billing-plan data, support requests, and audit logs.",
          "Uploaded evidence files and draft reports are private by default unless a user with permission creates an explicit scoped sharing action.",
        ],
      },
      {
        title: "How information is used",
        body: [
          "Information is used to authenticate users, scope organization access, operate evidence and report workflows, maintain auditability, support users, and preserve trust-system integrity.",
          "Mishava does not sell personal priority profiles. NGO billing plans gate feature capacity only and do not change trust outcomes.",
        ],
      },
      {
        title: "Retention and requests",
        body: [
          "Some records may need to be retained for auditability, security, legal compliance, dispute handling, fraud prevention, or transparency.",
          "Self-serve data export and deletion automation is not implemented yet. Requests should be sent through support for manual review.",
        ],
      },
      {
        title: "AI and subprocessors",
        body: [
          "Production NGO AI automation is not enabled in the current baseline. Mishava may prepare AI-assisted evidence suggestions, but those suggestions remain private draft assistance and require human review before becoming structured claim drafts.",
          "Raw evidence files are not sent to AI in the current baseline. Future AI provider/subprocessor use, raw-file processing, retention settings, and no-training-on-customer-data posture must be reviewed and disclosed before launch of those workflows.",
          "AI assistance must not create final trust outcomes, scores, rankings, verification labels, credibility labels, methodology outputs, or report trust conclusions by itself.",
        ],
      },
    ],
  },
  evidenceSubmission: {
    eyebrow: "Evidence terms",
    title: "Evidence Submission Terms",
    intro:
      "These draft baseline terms explain the responsibilities that come with submitting evidence, files, URLs, notes, and report-supporting information to Mishava.",
    statusNote:
      "Draft baseline only. Evidence submission rules remain subject to attorney review.",
    sections: [
      {
        title: "Lawful submission",
        body: [
          "Users should submit only evidence they are allowed to provide, store, and use in Mishava workflows.",
          "Evidence should not include information that violates confidentiality obligations, privacy rights, intellectual property rights, court orders, employment obligations, or other legal restrictions.",
        ],
      },
      {
        title: "Private by default",
        body: [
          "Raw evidence files are private to the organization by default. Shared reports expose selected summaries only unless a future explicit raw-file sharing control is added and used.",
          "Evidence may be draft, submitted, reviewed, accepted, rejected, or archived. Archived evidence remains traceable where already attached to reports, claims, or snapshots.",
        ],
      },
      {
        title: "Accuracy and review",
        body: [
          "Submitted evidence may be incomplete, outdated, disputed, or require review. Evidence-backed corrections may change future outputs without silently erasing the prior history.",
          "Mishava may reject, label, limit, or request clarification for evidence that cannot be verified, appears unsafe to share, or raises legal/privacy concerns.",
          "AI-assisted suggestions, if used, are not verified facts until a human reviewer accepts them into the structured evidence workflow.",
        ],
      },
    ],
  },
  reportSharing: {
    eyebrow: "Sharing terms",
    title: "Report Sharing Terms",
    intro:
      "These draft baseline terms explain how Mishava NGO report sharing is intended to work when an organization grants scoped access to a recipient.",
    statusNote:
      "Draft baseline only. Report sharing terms remain subject to attorney review.",
    sections: [
      {
        title: "Scoped access",
        body: [
          "A share grant is limited to the selected report summary. It does not expose the full organization workspace, unrelated reports, unrelated evidence, team data, or raw private evidence files by default.",
          "Share grants may be revoked or expire. Revoked or expired grants should not provide access.",
        ],
      },
      {
        title: "Limited context",
        body: [
          "Shared reports may be provisional and evidence may be incomplete. Shared content should not be treated as certification, legal advice, financial advice, or a guaranteed outcome.",
          "Recipients should review the shared report limits, evidence summaries, and status labels before relying on the information.",
        ],
      },
    ],
  },
  noPaidTrustOutcomes: {
    eyebrow: "Trust policy",
    title: "No Paid Trust Outcomes",
    intro:
      "Mishava monetizes trust infrastructure, not paid influence. Payment may unlock tools and capacity, but it must not buy a better trust result.",
    statusNote:
      "Baseline trust commitment. This is an internal product rule and public trust policy, not an external certification.",
    sections: [
      {
        title: "What payment can unlock",
        body: [
          "Payment may unlock feature capacity, setup services, hosted tools, report workflows, storage, team access, dashboards, or support.",
        ],
      },
      {
        title: "What payment cannot change",
        body: [
          "Payment, plan tier, sponsorship, setup purchases, hosted profile status, and billing status do not change Mishava scores, ranking, verification outcomes, evidence truth, credibility labels, or methodology outputs.",
          "Mishava tests payment firewall boundaries so paid fields do not enter score or ranking helpers.",
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility",
    title: "Accessibility Statement",
    intro:
      "Mishava is designed with accessibility as a product requirement from the foundation, not as a later cosmetic pass.",
    statusNote:
      "Mishava targets WCAG 2.2 AA where feasible, but this baseline has not completed an external accessibility audit, VPAT, or Accessibility Conformance Report.",
    sections: [
      {
        title: "Current accessibility goals",
        body: [
          "Mishava aims for semantic HTML, keyboard navigation, visible focus states, readable forms, screen-reader friendly labels, adequate contrast, mobile readability, and status labels that do not rely on color alone.",
          "Reports and shared report views should remain readable in normal and print-friendly contexts.",
        ],
      },
      {
        title: "Known work ahead",
        body: [
          "External WCAG review, VPAT/ACR preparation, full screen-reader testing, and full PDF/export accessibility review have not been completed yet.",
          "Accessibility issues can be reported through support so they can be prioritized before full-scale launch.",
        ],
      },
    ],
  },
  security: {
    eyebrow: "Security baseline",
    title: "Security Overview",
    intro:
      "This baseline describes the security posture Mishava is building for NGO workflows without claiming external certification.",
    statusNote:
      "Security overview only. Mishava is not SOC 2 certified, ISO 27001 certified, FedRAMP authorized, or externally penetration-tested in this baseline.",
    sections: [
      {
        title: "Current protections",
        body: [
          "Mishava V2 uses a clean Supabase V2 project, Supabase Auth foundation, organization-scoped access, RLS where implemented, role permissions, private evidence storage by default, and audit events for sensitive workflows.",
          "Service-role operations are intended to remain server-side only. Secrets must not be committed to the repo, and local secret files remain git-ignored.",
        ],
      },
      {
        title: "Known limitations",
        body: [
          "Broad-launch email and password-reset verification still needs retesting where Supabase rate limits affected earlier checks.",
          "MFA enforcement, SSO, malware scanning, formal monitoring/alerting, external security audit, SOC 2, ISO 27001, and FedRAMP are not implemented or certified in this baseline.",
        ],
      },
      {
        title: "Support and incidents",
        body: [
          "Security concerns, mistaken access, suspected data exposure, or report-sharing issues should be reported through support for review and audit-trail follow-up.",
        ],
      },
    ],
  },
  corrections: {
    eyebrow: "Corrections",
    title: "Corrections, Disputes, And Error Reporting",
    intro:
      "Mishava should make it possible to report inaccurate evidence, missing context, access issues, and disputed outputs without turning corrections into a paid influence channel.",
    statusNote:
      "Draft baseline only. The full correction/dispute workflow and legal review triggers are still future work.",
    sections: [
      {
        title: "What can be reported",
        body: [
          "Users may report inaccurate evidence, missing context, incorrect organization information, mistaken report sharing, access/security concerns, or a disputed interpretation of evidence.",
        ],
      },
      {
        title: "How corrections are reviewed",
        body: [
          "Correction requests do not guarantee removal, a favorable score change, or a more favorable trust outcome. Evidence-backed corrections are reviewed and may update future reports, claims, or snapshots.",
          "Where a correction changes a trust-relevant output, Mishava should preserve transparency about what changed and why.",
        ],
      },
    ],
  },
  support: {
    eyebrow: "Support",
    title: "Contact And Support",
    intro:
      "Use support for account access, organization access, evidence questions, sharing issues, billing-plan questions, accessibility issues, privacy requests, and corrections.",
    statusNote:
      "Support process baseline. Dedicated support tooling and automation are still future work.",
    sections: [
      {
        title: "Support categories",
        body: [
          "Account access, password reset issues, organization membership issues, evidence submission questions, report sharing or revocation issues, accessibility barriers, security concerns, correction/dispute requests, and data export/deletion requests can be routed through support.",
        ],
      },
      {
        title: "Manual request handling",
        body: [
          "Some workflows, including data export/deletion requests and correction reviews, are manual support paths until self-serve automation is built.",
          "For urgent access or security issues, include the organization name, affected report or evidence title if known, and a clear description of the issue.",
        ],
      },
    ],
  },
} satisfies Record<string, LegalPageContent>;
