import { PageHeader } from "@/components/PageHeader";
import { pricingPlans } from "@/lib/sample-data";

export default function PricingPage() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Pricing buys infrastructure, never credibility.">
        Mishava pricing is configurable by country, market income tier, currency,
        sponsorship, plan, add-on, and workflow depth. It cannot buy score,
        rank, placement, suppression, or perceived trust.
      </PageHeader>
      <table className="table">
        <thead>
          <tr>
            <th>Surface</th>
            <th>Plan</th>
            <th>Starting point</th>
          </tr>
        </thead>
        <tbody>
          {pricingPlans.map((plan) => (
            <tr key={`${plan.surface}-${plan.plan}`}>
              <td>{plan.surface}</td>
              <td>{plan.plan}</td>
              <td>{plan.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

