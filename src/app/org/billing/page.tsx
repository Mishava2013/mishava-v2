import { PageHeader } from "@/components/PageHeader";
import { ngoTiers } from "@/lib/ngo";

export default function OrgBillingPage() {
  return (
    <>
      <PageHeader eyebrow="Organization billing" title="Plans and feature gates.">
        Organization payments unlock workflow capacity, reporting, hosting,
        verification, and support. They do not unlock ranking or trust advantages.
      </PageHeader>
      <table className="table">
        <thead>
          <tr>
            <th>NGO tier</th>
            <th>Price</th>
            <th>AI access</th>
            <th>Reporting</th>
          </tr>
        </thead>
        <tbody>
          {ngoTiers.map((tier) => (
            <tr key={tier.code}>
              <td>{tier.name}</td>
              <td>{tier.price}</td>
              <td>{tier.aiAccess}</td>
              <td>{tier.reportAccess}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
