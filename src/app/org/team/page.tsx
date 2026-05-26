import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import { getNgoTeamWorkspace, teamRoleLabel } from "@/lib/ngo-team";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import {
  createTeamInviteAction,
  removeTeamMemberAction,
  resendTeamInviteAction,
  revokeTeamInviteAction,
  updateTeamMemberRoleAction,
} from "./actions";

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default async function OrgTeamPage({
  searchParams,
}: {
  searchParams?: Promise<{
    accepted?: string;
    created?: string;
    email?: string;
    error?: string;
    id?: string;
    updated?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const workspace = isSupabaseServerConfigured()
    ? await getNgoTeamWorkspace({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        organizationId,
        session,
      })
    : {
        organizationName: "Current organization",
        canManageTeam: false,
        members: [],
        invites: [],
      };

  return (
    <>
      <PageHeader eyebrow="Team" title="Team access and visible paper trails.">
        {workspace.organizationName} team access is scoped to this organization.
        Invites do not grant access until the invited email accepts.
      </PageHeader>

      {params.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(params.error)}
        </div>
      ) : null}
      {params.created === "invite" ? (
        <div className="notice" role="status">
          Invite created. {emailStatusMessage(params.email)}
        </div>
      ) : null}
      {params.updated ? (
        <div className="notice" role="status">
          {params.updated === "invite_resent"
            ? `Invite email retry finished. ${emailStatusMessage(params.email)}`
            : params.updated === "member_role_changed"
              ? "Member role changed and audit event recorded."
            : "Team update saved and audit event recorded."}
        </div>
      ) : null}
      {params.accepted === "invite" ? (
        <div className="notice" role="status">
          Invite accepted. This organization is now available in your workspace.
        </div>
      ) : null}

      <section className="section">
        <h2>Members</h2>
        <p className="section-intro">
          Active members are governed by a central permission matrix. Removed
          or suspended members lose access through server-side membership
          checks, and the current organization selector cannot restore access by
          itself.
        </p>

        {workspace.members.length === 0 ? (
          <EmptyState title="No members found">
            This organization does not have visible team members yet.
          </EmptyState>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Email / name</th>
                <th>Role and permissions</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workspace.members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.displayEmail ?? member.userId}</strong>
                    {member.displayName ? <p>{member.displayName}</p> : null}
                  </td>
                  <td>
                    <strong>{teamRoleLabel(member.role)}</strong>
                    <p>{member.permissionSummary}</p>
                  </td>
                  <td>
                    <span className="tag">{membershipStatusLabel(member.status)}</span>
                    {member.status !== "active" ? (
                      <p className="record-note">
                        Inactive memberships cannot access this workspace or be
                        selected in the organization switcher.
                      </p>
                    ) : null}
                  </td>
                  <td>
                    <p>Created: {formatDate(member.createdAt)}</p>
                    <p>Accepted: {formatDate(member.acceptedAt)}</p>
                    {member.removedAt ? (
                      <p>Removed: {formatDate(member.removedAt)}</p>
                    ) : null}
                  </td>
                  <td>
                    {workspace.canManageTeam && member.status === "active" ? (
                      <div className="toolbar">
                        <form action={updateTeamMemberRoleAction}>
                          <input
                            name="membershipId"
                            type="hidden"
                            value={member.id}
                          />
                          <label className="sr-only" htmlFor={`role-${member.id}`}>
                            Change role for {member.displayEmail ?? member.userId}
                          </label>
                          <select
                            id={`role-${member.id}`}
                            name="role"
                            defaultValue={member.role}
                            aria-describedby={`role-help-${member.id}`}
                          >
                            <option value="ngo_owner">Owner</option>
                            <option value="ngo_admin">Admin</option>
                            <option value="ngo_member">Member</option>
                            <option value="ngo_viewer">Viewer</option>
                          </select>
                          <p className="record-note" id={`role-help-${member.id}`}>
                            Role changes affect workspace permissions and are
                            recorded in the audit trail. The last owner cannot
                            be demoted.
                          </p>
                          <button className="button" type="submit">
                            Save role
                          </button>
                        </form>
                        <form action={removeTeamMemberAction}>
                          <input
                            name="membershipId"
                            type="hidden"
                            value={member.id}
                          />
                          <button className="button" type="submit">
                            Remove
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="muted-copy">No action available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <h2>Invite teammate</h2>
        {workspace.canManageTeam ? (
          <form action={createTeamInviteAction} className="form-grid">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue="ngo_member">
                <option value="ngo_owner">Owner</option>
                <option value="ngo_admin">Admin</option>
                <option value="ngo_member">Member</option>
                <option value="ngo_viewer">Viewer</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="expiresAt">Expires at</label>
              <input id="expiresAt" name="expiresAt" type="datetime-local" />
            </div>
            <div className="field full">
              <label htmlFor="note">Purpose / note</label>
              <textarea
                id="note"
                name="note"
                placeholder="Optional note for the team access record"
              />
            </div>
            <div className="field full">
              <button className="button primary" type="submit">
                Create invite
              </button>
            </div>
          </form>
        ) : (
          <EmptyState title="Team management requires owner or admin access">
            Your current role can view allowed workspace information, but cannot
            invite, revoke, remove, or change roles for team members.
          </EmptyState>
        )}
      </section>

      <section className="section">
        <h2>Invites</h2>
        {workspace.invites.length === 0 ? (
          <EmptyState title="No invites yet">
            Pending invites will appear here. Real email delivery is not enabled
            in this slice.
          </EmptyState>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Email delivery</th>
                <th>Invite link fallback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workspace.invites.map((invite) => (
                <tr key={invite.id}>
                  <td>{invite.email}</td>
                  <td>{teamRoleLabel(invite.role)}</td>
                  <td>
                    <span className="tag">{invite.status}</span>
                  </td>
                  <td>
                    <p>Invited: {formatDate(invite.invitedAt)}</p>
                    <p>Expires: {formatDate(invite.expiresAt)}</p>
                  </td>
                  <td>
                    <span className="tag">
                      {emailDeliveryLabel(invite.emailDeliveryStatus)}
                    </span>
                    <p>{emailDeliveryHelp(invite.emailDeliveryStatus)}</p>
                    {invite.emailLastAttemptAt ? (
                      <p>Last attempt: {formatDate(invite.emailLastAttemptAt)}</p>
                    ) : null}
                    {invite.emailSentCount > 0 ? (
                      <p>Sent count: {invite.emailSentCount}</p>
                    ) : null}
                    {invite.emailDeliveryError ? (
                      <p className="record-note">{invite.emailDeliveryError}</p>
                    ) : null}
                  </td>
                  <td>
                    <code>{`/app/team-invites/${invite.id}`}</code>
                  </td>
                  <td>
                    {workspace.canManageTeam && invite.status === "pending" ? (
                      <div className="toolbar">
                        <form action={resendTeamInviteAction}>
                          <input name="inviteId" type="hidden" value={invite.id} />
                          <button className="button" type="submit">
                            Resend email
                          </button>
                        </form>
                        <form action={revokeTeamInviteAction}>
                          <input name="inviteId" type="hidden" value={invite.id} />
                          <button className="button" type="submit">
                            Revoke
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="muted-copy">No action available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

function membershipStatusLabel(status: string) {
  switch (status) {
    case "removed":
      return "Removed";
    case "suspended":
      return "Suspended";
    default:
      return "Active";
  }
}

function emailStatusMessage(status?: string) {
  switch (status) {
    case "sent":
      return "Email sent to the invited address.";
    case "failed":
      return "Email delivery failed. The invite link fallback remains available.";
    default:
      return "Email is not configured yet; copy the invite link fallback below.";
  }
}

function emailDeliveryLabel(status: string) {
  switch (status) {
    case "sent":
      return "Email sent";
    case "failed":
      return "Email failed";
    default:
      return "Email not configured";
  }
}

function emailDeliveryHelp(status: string) {
  switch (status) {
    case "sent":
      return "The recipient was emailed and still must sign in with the invited address.";
    case "failed":
      return "The invite is still valid; use the fallback link or retry later.";
    default:
      return "Use the fallback link until Resend is configured for this environment.";
  }
}
