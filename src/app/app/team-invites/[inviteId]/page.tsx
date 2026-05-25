import { PageHeader } from "@/components/PageHeader";
import { requireAuthenticatedSession } from "@/lib/auth-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { acceptTeamInviteAction } from "./actions";

type InviteRow = {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  status: string;
  expires_at?: string | null;
};

export default async function TeamInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ inviteId: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await requireAuthenticatedSession();
  const { inviteId } = await params;
  const query = (await searchParams) ?? {};
  const invite = await createSupabaseServerClient().selectOne<InviteRow>(
    "organization_invites",
    { id: inviteId },
    "id,organization_id,email,role,status,expires_at",
  );
  const emailMatches =
    invite?.email.trim().toLowerCase() === session.user.email.trim().toLowerCase();

  return (
    <>
      <PageHeader eyebrow="Team invite" title="Review organization access.">
        Team invites are scoped to one organization and do not grant access until
        the signed-in user accepts with the invited email address.
      </PageHeader>

      {query.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}

      {!invite ? (
        <div className="empty-state">
          <h2>Invite not found</h2>
          <p>This invite may have been revoked, expired, or entered incorrectly.</p>
        </div>
      ) : (
        <section className="evidence-panel">
          <h2 className="panel-title">Invite details</h2>
          <dl className="detail-list">
            <div>
              <dt>Invited email</dt>
              <dd>{invite.email}</dd>
            </div>
            <div>
              <dt>Signed-in email</dt>
              <dd>{session.user.email}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{invite.status}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{invite.role}</dd>
            </div>
          </dl>

          {!emailMatches ? (
            <p className="notice" role="status">
              This invite belongs to a different email address. Sign in with the
              invited email before accepting.
            </p>
          ) : null}

          {invite.status !== "pending" ? (
            <p className="notice" role="status">
              This invite is not pending and cannot be accepted.
            </p>
          ) : null}

          <form action={acceptTeamInviteAction} className="toolbar">
            <input name="inviteId" type="hidden" value={invite.id} />
            <button
              className="button primary"
              type="submit"
              disabled={!emailMatches || invite.status !== "pending"}
            >
              Accept invite
            </button>
          </form>
        </section>
      )}
    </>
  );
}
