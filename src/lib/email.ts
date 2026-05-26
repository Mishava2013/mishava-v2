export type EmailDeliveryStatus = "not_configured" | "sent" | "failed";

export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailDeliveryResult = {
  status: EmailDeliveryStatus;
  message: string;
  providerMessageId?: string | null;
};

export type NgoInviteEmailInput = {
  organizationName: string;
  inviterEmail: string;
  inviterName?: string | null;
  roleLabel: string;
  inviteUrl: string;
  expiresAt?: string | null;
  supportEmail?: string | null;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
  name?: string;
  error?: string;
};

const resendEndpoint = "https://api.resend.com/emails";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function getSupportEmail() {
  return (
    process.env.SUPPORT_EMAIL ??
    process.env.RESEND_REPLY_TO_EMAIL ??
    "support@mishava.org"
  );
}

export function getPublicSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function buildInviteUrl(inviteId: string) {
  return `${getPublicSiteUrl()}/app/team-invites/${inviteId}`;
}

export function renderNgoInviteEmail(input: NgoInviteEmailInput): TransactionalEmail {
  const supportEmail = input.supportEmail ?? getSupportEmail();
  const inviter = input.inviterName
    ? `${input.inviterName} (${input.inviterEmail})`
    : input.inviterEmail;
  const expiration = input.expiresAt
    ? `This invitation expires on ${new Date(input.expiresAt).toLocaleString("en", {
        dateStyle: "medium",
        timeStyle: "short",
      })}.`
    : "This invitation does not have a set expiration date.";

  const subject = "You've been invited to join a Mishava NGO workspace";
  const text = [
    `You have been invited to join ${input.organizationName} on Mishava.`,
    "",
    `Invited by: ${inviter}`,
    `Role: ${input.roleLabel}`,
    expiration,
    "",
    "Open your invitation:",
    input.inviteUrl,
    "",
    "Security note: only accept this invitation if you recognize this organization. The invite link does not expose private workspace data by itself; you must sign in with the invited email address before access is granted.",
    "",
    `Need help? Contact ${supportEmail}.`,
    "",
    "Mishava",
  ].join("\n");

  const html = [
    "<p>You have been invited to join <strong>",
    escapeHtml(input.organizationName),
    "</strong> on Mishava.</p>",
    "<p><strong>Invited by:</strong> ",
    escapeHtml(inviter),
    "<br><strong>Role:</strong> ",
    escapeHtml(input.roleLabel),
    "<br>",
    escapeHtml(expiration),
    "</p>",
    '<p><a href="',
    escapeHtml(input.inviteUrl),
    '">Open your invitation</a></p>',
    "<p><strong>Security note:</strong> only accept this invitation if you recognize this organization. The invite link does not expose private workspace data by itself; you must sign in with the invited email address before access is granted.</p>",
    "<p>Need help? Contact ",
    escapeHtml(supportEmail),
    ".</p>",
    "<p>Mishava</p>",
  ].join("");

  return { subject, text, html, to: "" };
}

export async function sendResendEmail(
  email: TransactionalEmail,
  fetcher: typeof fetch = fetch,
): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      status: "not_configured",
      message: "Resend is not configured. Use the invite link fallback.",
    };
  }

  const response = await fetcher(resendEndpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      reply_to: process.env.RESEND_REPLY_TO_EMAIL || undefined,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as ResendEmailResponse;

  if (!response.ok) {
    return {
      status: "failed",
      message:
        body.message ??
        body.error ??
        body.name ??
        `Resend email request failed with status ${response.status}.`,
    };
  }

  return {
    status: "sent",
    message: "Invite email sent.",
    providerMessageId: body.id ?? null,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
