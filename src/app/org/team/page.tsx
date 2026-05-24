import { PageHeader } from "@/components/PageHeader";

export default function OrgTeamPage() {
  return (
    <>
      <PageHeader eyebrow="Team" title="Roles, approvals, and visible paper trails.">
        Mishava team access is built for scale: no role can overwrite trust outcomes
        without an audit event, reason, reviewer, timestamp, and visible history.
      </PageHeader>
      <table className="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Purpose</th>
            <th>Cannot do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NGO owner</td>
            <td>Manage profile, team, billing, reports, and sharing</td>
            <td>Silently alter approved evidence history</td>
          </tr>
          <tr>
            <td>NGO member</td>
            <td>Add evidence, draft reports, request reviews</td>
            <td>Publish without approval</td>
          </tr>
          <tr>
            <td>Approved viewer</td>
            <td>View selected shared reports or evidence summaries</td>
            <td>Access full workspace</td>
          </tr>
          <tr>
            <td>Mishava reviewer</td>
            <td>Review flagged evidence or AI extraction issues</td>
            <td>Complete field audit and final review alone</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
