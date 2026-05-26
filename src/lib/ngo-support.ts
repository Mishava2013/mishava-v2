import { getNgoBillingWorkspace, type NgoBillingWorkspace } from "./ngo-billing";
import type { SupabaseServerClient } from "./supabase/server";

type Row = Record<string, unknown> & { id: string };

type OrganizationRow = Row & {
  name: string;
  country_code: string | null;
  public_summary: string | null;
  created_at: string;
};

type NgoProfileRow = Row & {
  organization_id: string;
  tier: string;
  public_name: string;
  mission_area: string | null;
  website_url: string | null;
  profile_status: string;
  updated_at: string;
};

type MembershipRow = Row & {
  organization_id: string;
  user_id: string;
  role: string;
  status?: string | null;
  display_email?: string | null;
  display_name?: string | null;
  created_at: string;
};

type InviteRow = Row & {
  organization_id: string;
  email: string;
  role: string;
  status: string;
  invited_at: string;
  expires_at?: string | null;
};

type EvidenceRow = Row & {
  organization_id: string;
  title: string;
  lifecycle_status?: string | null;
  verification_status: string;
  visibility: string;
  created_at: string;
  updated_at?: string | null;
};

type EvidenceFileRow = Row & {
  organization_id: string;
  evidence_item_id: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  status: string;
  scan_status?: string | null;
  quarantine_reason?: string | null;
  visibility: string;
  uploaded_at: string;
};

type ReportRow = Row & {
  organization_id: string;
  title: string;
  approval_status: string;
  visibility: string;
  created_at: string;
  updated_at: string;
};

type ShareGrantRow = Row & {
  organization_id: string;
  report_id: string;
  granted_to_email: string;
  status: string;
  expires_at?: string | null;
  revoked_at?: string | null;
  created_at: string;
};

type AuditEventRow = Row & {
  organization_id: string | null;
  action: string;
  subject_table: string | null;
  subject_id: string | null;
  reason: string;
  visibility: string;
  created_at: string;
};

export type NgoSupportSummary = {
  organizationId: string;
  organizationName: string;
  countryCode: string | null;
  profileName: string;
  profileStatus: string;
  tier: string;
  supportStatus: "not_tracked_yet";
  memberCount: number;
  activeMemberCount: number;
  pendingInviteCount: number;
  evidenceCount: number;
  privateFileCount: number;
  scanStatusCounts: Record<string, number>;
  reportCount: number;
  activeShareGrantCount: number;
  billingStatus: string;
  planName: string;
  latestAuditAction: string | null;
  latestAuditAt: string | null;
};

export type NgoSupportDetail = NgoSupportSummary & {
  publicSummary: string | null;
  profile: NgoProfileRow | null;
  billing: NgoBillingWorkspace | null;
  members: Array<{
    id: string;
    email: string | null;
    name: string | null;
    role: string;
    status: string;
    createdAt: string;
  }>;
  invites: Array<{
    id: string;
    email: string;
    role: string;
    status: string;
    invitedAt: string;
    expiresAt: string | null;
  }>;
  evidenceStatusCounts: Record<string, number>;
  fileScanStatusCounts: Record<string, number>;
  evidenceItems: Array<{
    id: string;
    title: string;
    lifecycleStatus: string;
    verificationStatus: string;
    visibility: string;
    createdAt: string;
    privateFileCount: number;
  }>;
  reportStatusCounts: Record<string, number>;
  reports: Array<{
    id: string;
    title: string;
    status: string;
    visibility: string;
    updatedAt: string;
  }>;
  shareGrants: Array<{
    id: string;
    reportId: string;
    recipientEmail: string;
    status: string;
    expiresAt: string | null;
    createdAt: string;
  }>;
  recentAuditEvents: Array<{
    id: string;
    action: string;
    subjectTable: string | null;
    subjectId: string | null;
    reason: string;
    visibility: string;
    createdAt: string;
  }>;
  rawFileAccessPolicy: string;
  trustOutcomePolicy: string;
};

export async function getNgoSupportSummaries({
  client,
}: {
  client: SupabaseServerClient;
}): Promise<NgoSupportSummary[]> {
  const [
    organizations,
    profiles,
    memberships,
    invites,
    evidence,
    evidenceFiles,
    reports,
    shareGrants,
    auditEvents,
  ] = await Promise.all([
    client.selectMany<OrganizationRow>(
      "organizations",
      undefined,
      "id,name,country_code,public_summary,created_at",
    ),
    client.selectMany<NgoProfileRow>(
      "ngo_profiles",
      undefined,
      "id,organization_id,tier,public_name,mission_area,website_url,profile_status,updated_at",
    ),
    client.selectMany<MembershipRow>(
      "organization_memberships",
      undefined,
      "id,organization_id,user_id,role,status,display_email,display_name,created_at",
    ),
    client.selectMany<InviteRow>(
      "organization_invites",
      undefined,
      "id,organization_id,email,role,status,invited_at,expires_at",
    ),
    client.selectMany<EvidenceRow>(
      "evidence_items",
      undefined,
      "id,organization_id,title,lifecycle_status,verification_status,visibility,created_at,updated_at",
    ),
    client.selectMany<EvidenceFileRow>(
      "evidence_files",
      undefined,
      "id,organization_id,evidence_item_id,original_filename,mime_type,file_size_bytes,status,scan_status,quarantine_reason,visibility,uploaded_at",
    ),
    client.selectMany<ReportRow>(
      "ngo_reports",
      undefined,
      "id,organization_id,title,approval_status,visibility,created_at,updated_at",
    ),
    client.selectMany<ShareGrantRow>(
      "ngo_share_grants",
      undefined,
      "id,organization_id,report_id,granted_to_email,status,expires_at,revoked_at,created_at",
    ),
    client.selectMany<AuditEventRow>(
      "audit_events",
      undefined,
      "id,organization_id,action,subject_table,subject_id,reason,visibility,created_at",
    ),
  ]);

  return organizations
    .map((organization) =>
      buildSupportSummary({
        organization,
        profile:
          profiles.find((profile) => profile.organization_id === organization.id) ??
          null,
        memberships: memberships.filter(
          (membership) => membership.organization_id === organization.id,
        ),
        invites: invites.filter((invite) => invite.organization_id === organization.id),
        evidence: evidence.filter((item) => item.organization_id === organization.id),
        evidenceFiles: evidenceFiles.filter(
          (file) => file.organization_id === organization.id,
        ),
        reports: reports.filter((report) => report.organization_id === organization.id),
        shareGrants: shareGrants.filter(
          (grant) => grant.organization_id === organization.id,
        ),
        auditEvents: auditEvents.filter(
          (event) => event.organization_id === organization.id,
        ),
        billing: null,
      }),
    )
    .filter((summary) => summary.profileName !== "No NGO profile")
    .sort((left, right) => left.organizationName.localeCompare(right.organizationName));
}

export async function getNgoSupportDetail({
  client,
  organizationId,
}: {
  client: SupabaseServerClient;
  organizationId: string;
}): Promise<NgoSupportDetail | null> {
  const [
    organization,
    profile,
    memberships,
    invites,
    evidence,
    evidenceFiles,
    reports,
    shareGrants,
    auditEvents,
    billing,
  ] = await Promise.all([
    client.selectOne<OrganizationRow>(
      "organizations",
      { id: organizationId },
      "id,name,country_code,public_summary,created_at",
    ),
    client.selectOne<NgoProfileRow>(
      "ngo_profiles",
      { organization_id: organizationId },
      "id,organization_id,tier,public_name,mission_area,website_url,profile_status,updated_at",
    ),
    client.selectMany<MembershipRow>(
      "organization_memberships",
      { organization_id: organizationId },
      "id,organization_id,user_id,role,status,display_email,display_name,created_at",
    ),
    client.selectMany<InviteRow>(
      "organization_invites",
      { organization_id: organizationId },
      "id,organization_id,email,role,status,invited_at,expires_at",
    ),
    client.selectMany<EvidenceRow>(
      "evidence_items",
      { organization_id: organizationId },
      "id,organization_id,title,lifecycle_status,verification_status,visibility,created_at,updated_at",
    ),
    client.selectMany<EvidenceFileRow>(
      "evidence_files",
      { organization_id: organizationId },
      "id,organization_id,evidence_item_id,original_filename,mime_type,file_size_bytes,status,scan_status,quarantine_reason,visibility,uploaded_at",
    ),
    client.selectMany<ReportRow>(
      "ngo_reports",
      { organization_id: organizationId },
      "id,organization_id,title,approval_status,visibility,created_at,updated_at",
    ),
    client.selectMany<ShareGrantRow>(
      "ngo_share_grants",
      { organization_id: organizationId },
      "id,organization_id,report_id,granted_to_email,status,expires_at,revoked_at,created_at",
    ),
    client.selectMany<AuditEventRow>(
      "audit_events",
      { organization_id: organizationId },
      "id,organization_id,action,subject_table,subject_id,reason,visibility,created_at",
    ),
    getNgoBillingWorkspace({ client, organizationId }).catch(() => null),
  ]);

  if (!organization || !profile) return null;

  const summary = buildSupportSummary({
    organization,
    profile,
    memberships,
    invites,
    evidence,
    evidenceFiles,
    reports,
    shareGrants,
    auditEvents,
    billing,
  });

  return {
    ...summary,
    publicSummary: organization.public_summary,
    profile,
    billing,
    members: memberships.sort(sortByCreatedAtDesc).map((member) => ({
      id: member.id,
      email: member.display_email ?? null,
      name: member.display_name ?? null,
      role: member.role,
      status: normalizeMembershipStatus(member.status),
      createdAt: member.created_at,
    })),
    invites: invites.sort(sortByCreatedAtDesc).map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      status: invite.status,
      invitedAt: invite.invited_at,
      expiresAt: invite.expires_at ?? null,
    })),
    evidenceStatusCounts: countBy(
      evidence,
      (item) => item.lifecycle_status ?? "draft",
    ),
    fileScanStatusCounts: countBy(
      evidenceFiles,
      (file) => file.scan_status ?? "not_scanned",
    ),
    evidenceItems: evidence.sort(sortByCreatedAtDesc).slice(0, 12).map((item) => ({
      id: item.id,
      title: item.title,
      lifecycleStatus: item.lifecycle_status ?? "draft",
      verificationStatus: item.verification_status,
      visibility: item.visibility,
      createdAt: item.created_at,
      privateFileCount: evidenceFiles.filter(
        (file) => file.evidence_item_id === item.id && file.status === "active",
      ).length,
    })),
    reportStatusCounts: countBy(reports, (report) => report.approval_status),
    reports: reports.sort(sortByUpdatedAtDesc).slice(0, 12).map((report) => ({
      id: report.id,
      title: report.title,
      status: report.approval_status,
      visibility: report.visibility,
      updatedAt: report.updated_at,
    })),
    shareGrants: shareGrants.sort(sortByCreatedAtDesc).slice(0, 12).map((grant) => ({
      id: grant.id,
      reportId: grant.report_id,
      recipientEmail: grant.granted_to_email,
      status: grant.status,
      expiresAt: grant.expires_at ?? null,
      createdAt: grant.created_at,
    })),
    recentAuditEvents: auditEvents.sort(sortByCreatedAtDesc).slice(0, 12).map(
      (event) => ({
        id: event.id,
        action: event.action,
        subjectTable: event.subject_table,
        subjectId: event.subject_id,
        reason: event.reason,
        visibility: event.visibility,
        createdAt: event.created_at,
      }),
    ),
    rawFileAccessPolicy:
      "Raw evidence file contents, signed URLs, and storage paths are not exposed in this support view by default. Scan status is visible for support-safe triage.",
    trustOutcomePolicy:
      "This support view is read-only and cannot directly edit scores, evidence truth, verification outcomes, rankings, or credibility labels.",
  };
}

function buildSupportSummary({
  organization,
  profile,
  memberships,
  invites,
  evidence,
  evidenceFiles,
  reports,
  shareGrants,
  auditEvents,
  billing,
}: {
  organization: OrganizationRow;
  profile: NgoProfileRow | null;
  memberships: MembershipRow[];
  invites: InviteRow[];
  evidence: EvidenceRow[];
  evidenceFiles: EvidenceFileRow[];
  reports: ReportRow[];
  shareGrants: ShareGrantRow[];
  auditEvents: AuditEventRow[];
  billing: NgoBillingWorkspace | null;
}): NgoSupportSummary {
  const latestAudit = [...auditEvents].sort(sortByCreatedAtDesc)[0] ?? null;
  const activeShareGrants = shareGrants.filter(
    (grant) =>
      grant.status === "active" &&
      !grant.revoked_at &&
      (!grant.expires_at || Date.parse(grant.expires_at) > Date.now()),
  );

  return {
    organizationId: organization.id,
    organizationName: organization.name,
    countryCode: organization.country_code,
    profileName: profile?.public_name ?? "No NGO profile",
    profileStatus: profile?.profile_status ?? "missing",
    tier: profile?.tier ?? "unknown",
    supportStatus: "not_tracked_yet",
    memberCount: memberships.length,
    activeMemberCount: memberships.filter(
      (membership) => normalizeMembershipStatus(membership.status) === "active",
    ).length,
    pendingInviteCount: invites.filter((invite) => invite.status === "pending").length,
    evidenceCount: evidence.length,
    privateFileCount: evidenceFiles.filter((file) => file.status === "active").length,
    scanStatusCounts: countBy(
      evidenceFiles,
      (file) => file.scan_status ?? "not_scanned",
    ),
    reportCount: reports.length,
    activeShareGrantCount: activeShareGrants.length,
    billingStatus: billing?.billingStatus ?? "not_loaded",
    planName: billing?.plan.name ?? profile?.tier ?? "unknown",
    latestAuditAction: latestAudit?.action ?? null,
    latestAuditAt: latestAudit?.created_at ?? null,
  };
}

function normalizeMembershipStatus(value?: string | null) {
  if (value === "removed" || value === "suspended") return value;
  return "active";
}

function countBy<T>(items: T[], keyFn: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function sortByCreatedAtDesc(
  left: { created_at?: string; invited_at?: string },
  right: { created_at?: string; invited_at?: string },
) {
  return (
    Date.parse(right.created_at ?? right.invited_at ?? "") -
    Date.parse(left.created_at ?? left.invited_at ?? "")
  );
}

function sortByUpdatedAtDesc(left: { updated_at: string }, right: { updated_at: string }) {
  return Date.parse(right.updated_at) - Date.parse(left.updated_at);
}
