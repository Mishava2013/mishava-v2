import Link from "next/link";
import { switchCurrentOrganizationAction } from "@/app/app/organization-actions";
import type { OrganizationSwitcherState } from "@/lib/organization-context";

export function OrganizationSwitcher({
  returnTo,
  state,
}: {
  returnTo: string;
  state: OrganizationSwitcherState;
}) {
  const current = state.currentOrganization;

  return (
    <section className="org-switcher" aria-label="Current organization">
      <div className="org-switcher-header">
        <div>
          <span className="eyebrow">Workspace</span>
          <h2>{current?.name ?? "Choose an organization"}</h2>
          <p>
            {current
              ? `Current organization. Roles: ${current.roles.join(", ")}.`
              : "Select an active organization before working with private NGO records."}
          </p>
        </div>
        {state.organizations.length === 0 ? (
          <Link className="button primary" href="/ngo/onboarding">
            Create NGO profile
          </Link>
        ) : null}
      </div>

      {state.hasStaleSelection ? (
        <p className="org-switcher-warning" role="status">
          The previous organization selection is no longer available for this
          account. Choose an active organization to continue.
        </p>
      ) : null}

      {state.organizations.length > 1 ? (
        <form action={switchCurrentOrganizationAction} className="org-switcher-form">
          <input name="returnTo" type="hidden" value={returnTo} />
          <label htmlFor="organizationId">Active organization</label>
          <select
            id="organizationId"
            name="organizationId"
            required
            defaultValue={current?.id ?? ""}
          >
            {!current ? <option value="">Select an organization</option> : null}
            {state.organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <button className="button" type="submit">
            Switch
          </button>
        </form>
      ) : null}

      {state.organizations.length === 1 && current ? (
        <p className="org-switcher-note">
          This is the only active organization linked to your account.
        </p>
      ) : null}

      {state.organizations.length === 0 ? (
        <p className="org-switcher-note">
          No organization membership is linked to this account yet. Start with
          NGO onboarding to create a private workspace.
        </p>
      ) : null}
    </section>
  );
}
