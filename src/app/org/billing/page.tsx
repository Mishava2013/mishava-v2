import { PageHeader } from "@/components/PageHeader";
import { canManageNgoBilling } from "@/lib/auth";
import { requireCurrentOrganizationMembership } from "@/lib/auth-server";
import {
  formatBytes,
  formatLimit,
  getNgoBillingWorkspace,
  ngoPlanDefinitions,
  ngoSetupOptions,
  noPaidTrustOutcomeMessage,
  type NgoBillingWorkspace,
} from "@/lib/ngo-billing";
import { startNgoPlanCheckout, startNgoSetupCheckout } from "./actions";
import {
  createSupabaseAuthenticatedServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

function usageRows(workspace: NgoBillingWorkspace) {
  const { entitlements } = workspace.plan;
  return [
    {
      label: "Evidence items",
      limit: formatLimit(entitlements.evidenceItems),
      used: workspace.usage.evidenceItems.toLocaleString(),
    },
    {
      label: "Private files",
      limit: formatLimit(entitlements.activePrivateFiles),
      used: workspace.usage.activePrivateFiles.toLocaleString(),
    },
    {
      label: "Storage",
      limit: formatBytes(entitlements.storageBytes),
      used: formatBytes(workspace.usage.storageBytes),
    },
    {
      label: "Reports",
      limit: formatLimit(entitlements.reports),
      used: workspace.usage.reports.toLocaleString(),
    },
    {
      label: "Active share grants",
      limit: formatLimit(entitlements.activeShareGrants),
      used: workspace.usage.activeShareGrants.toLocaleString(),
    },
    {
      label: "Team members",
      limit: formatLimit(entitlements.teamMembers),
      used: workspace.usage.teamMembers.toLocaleString(),
    },
  ];
}

export default async function OrgBillingPage() {
  const { session, organizationId } = await requireCurrentOrganizationMembership();
  const canManageBilling = canManageNgoBilling(session, organizationId);
  const workspace = isSupabaseServerConfigured()
    ? await getNgoBillingWorkspace({
        client: createSupabaseAuthenticatedServerClient(session.accessToken),
        organizationId,
      })
    : null;
  const stripeReady = workspace?.stripeStatus === "test_mode_configured";

  return (
    <>
      <PageHeader eyebrow="Organization billing" title="NGO plans and capacity.">
        NGO payments unlock workflow capacity, support, setup services, and
        reporting tools. They do not unlock score, ranking, verification, or
        trust-display advantages.
      </PageHeader>

      <div className="notice" role="status">
        Billing is test-mode only. Stripe production charging is disabled in
        this slice; the Free NGO self-serve path works without Stripe. Payment and
        plan tier do not change trust outcomes, evidence truth,
        verification, credibility labels, score, or ranking.
      </div>

      <section className="section">
        <div className="record-header">
          <div>
            <span className="tag">Current plan</span>
            <h2>{workspace?.plan.name ?? "Free NGO Profile"}</h2>
            <p className="section-intro">
              {workspace?.plan.displayCopy ??
                "Basic self-serve NGO profile with limited capacity."}
            </p>
          </div>
          <div className="status-row">
            <span className="tag">
              Billing status: {workspace?.billingStatus ?? "free"}
            </span>
            <span className="tag">
              Stripe: {workspace?.stripeStatus ?? "none"}
            </span>
            <span className="tag">Test mode / billing not live yet</span>
            {workspace?.billingInterval &&
            workspace.billingInterval !== "none" ? (
              <span className="tag">
                Interval: {workspace.billingInterval}
              </span>
            ) : null}
          </div>
        </div>

        <div className="evidence-panel">
          <h3>No paid trust advantage</h3>
          <p>{workspace?.noPaidTrustOutcomeMessage ?? noPaidTrustOutcomeMessage}</p>
        </div>
      </section>

      <section className="section">
        <h2>Usage and limits</h2>
        {workspace ? (
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Used</th>
                <th>Current limit</th>
              </tr>
            </thead>
            <tbody>
              {usageRows(workspace).map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.used}</td>
                  <td>{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="section-intro">
            Supabase is not configured, so live usage cannot be calculated in
            this environment.
          </p>
        )}
      </section>

      <section className="section">
        <h2>Available NGO plans</h2>
        <p className="section-intro">
          Owners and admins can start Stripe-hosted Checkout in test mode when
          Stripe test keys and price ids are configured. Custom network plans
          remain contact-only. The success redirect is not trusted by itself;
          verified webhooks update billing status.
        </p>
        <div className="evidence-library">
          {ngoPlanDefinitions.map((plan) => (
            <article className="evidence-record" key={plan.key}>
              <div className="record-header">
                <div>
                  <span className="tag">
                    {plan.recommended ? "Main paid NGO plan" : "NGO plan"}
                  </span>
                  <h3>{plan.name}</h3>
                  <p>{plan.displayCopy}</p>
                </div>
                <span className="score-pill">{plan.priceLabel}</span>
              </div>
              <div className="metric-grid">
                <div className="metric">
                  <span>Monthly</span>
                  <strong>
                    {plan.monthlyPriceCents === null
                      ? "Custom"
                      : `$${plan.monthlyPriceCents / 100}`}
                  </strong>
                </div>
                <div className="metric">
                  <span>Annual</span>
                  <strong>
                    {plan.annualPriceCents === null
                      ? "Custom"
                      : `$${plan.annualPriceCents / 100}`}
                  </strong>
                </div>
                <div className="metric">
                  <span>Evidence</span>
                  <strong>{formatLimit(plan.entitlements.evidenceItems)}</strong>
                </div>
                <div className="metric">
                  <span>Reports</span>
                  <strong>{formatLimit(plan.entitlements.reports)}</strong>
                </div>
              </div>
              <p className="record-note">
                {plan.setupRecommendation}. Existing evidence and reports
                remain readable if a plan changes.
              </p>
              {plan.key === "free" ? (
                <p className="record-note">
                  Free NGO access does not require Stripe or a card.
                </p>
              ) : plan.customPricing ? (
                <p className="record-note">
                  Contact Mishava for network, foundation, association, or
                  sponsored multi-organization billing.
                </p>
              ) : (
                <div className="actions-row" aria-label={`${plan.name} checkout options`}>
                  <form action={startNgoPlanCheckout}>
                    <input type="hidden" name="planKey" value={plan.key} />
                    <input type="hidden" name="billingInterval" value="monthly" />
                    <button
                      className="secondary-button"
                      disabled={!canManageBilling || !stripeReady}
                      type="submit"
                    >
                      Monthly test Checkout
                    </button>
                  </form>
                  <form action={startNgoPlanCheckout}>
                    <input type="hidden" name="planKey" value={plan.key} />
                    <input type="hidden" name="billingInterval" value="annual" />
                    <button
                      className="secondary-button"
                      disabled={!canManageBilling || !stripeReady}
                      type="submit"
                    >
                      Annual test Checkout
                    </button>
                  </form>
                </div>
              )}
              {!stripeReady && !plan.customPricing && plan.key !== "free" ? (
                <p className="record-note">
                  Billing setup pending: Stripe test keys and price ids are not
                  configured in this environment.
                </p>
              ) : null}
              {!canManageBilling && plan.selfServeAllowed && plan.key !== "free" ? (
                <p className="record-note">
                  Billing changes require owner or admin access.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Setup services</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Setup option</th>
              <th>Price</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ngoSetupOptions.map((option) => (
              <tr key={option.key}>
                <td>{option.name}</td>
                <td>{option.priceLabel}</td>
                <td>
                  <p>{option.notes}</p>
                  {!option.customPricing && option.priceCents ? (
                    <form action={startNgoSetupCheckout}>
                      <input type="hidden" name="setupKey" value={option.key} />
                      <button
                        className="secondary-button"
                        disabled={!canManageBilling || !stripeReady}
                        type="submit"
                      >
                        Start test Checkout
                      </button>
                    </form>
                  ) : option.priceCents === 0 ? (
                    <span className="tag">No Checkout needed</span>
                  ) : (
                    <span className="tag">Contact-only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section-intro">
          Setup services are planned as paid support options. They do not affect
          trust scores, ranking, verification outcomes, evidence truth, or
          credibility labels.
        </p>
      </section>
    </>
  );
}
