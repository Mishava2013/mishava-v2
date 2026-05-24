import { PageHeader } from "@/components/PageHeader";

export default function NgoSharingPage() {
  return (
    <>
      <PageHeader eyebrow="NGO sharing" title="Funder and donor access without full account exposure.">
        NGOs decide who can see which reports, for what purpose, during which
        date range, and at what visibility level. Shared access is logged and
        revocable.
      </PageHeader>
      <table className="table">
        <thead>
          <tr>
            <th>Viewer</th>
            <th>Possible access</th>
            <th>Approval</th>
            <th>Audit trail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Funder</td>
            <td>Selected reports, evidence summaries, exports</td>
            <td>NGO manager approval</td>
            <td>Grant, view, export, revoke</td>
          </tr>
          <tr>
            <td>Donor</td>
            <td>Public summary or donor-specific packet</td>
            <td>NGO manager approval</td>
            <td>Grant and revoke</td>
          </tr>
          <tr>
            <td>Press reviewer</td>
            <td>Approved media reporting view</td>
            <td>Mishava and NGO approval</td>
            <td>View and export logs</td>
          </tr>
          <tr>
            <td>Partner</td>
            <td>Program-specific report or evidence subset</td>
            <td>NGO manager approval</td>
            <td>Grant, view, comment, revoke</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

