import { PageHeader } from "@/components/PageHeader";
import { paymentFirewall } from "@/lib/foundation";
import { sdgNames } from "@/lib/sample-data";
import { defaultScoringVersion } from "@/lib/scoring";

export default function MethodologyPage() {
  return (
    <>
      <PageHeader eyebrow="Methodology" title="Evidence first, user priorities second, payment never.">
        Mishava scores facts from evidence, snapshots the reasoning, then lets
        users apply their own shopping priorities. Missing evidence lowers
        coverage and confidence; it does not create fake certainty.
      </PageHeader>
      <div className="surface-list">
        <div className="card">
          <h3>Canonical chain</h3>
          <p>
            Evidence sources become evidence items, structured facts, indicators,
            SDG or pillar scores, snapshots, preference overlays, and then rankings.
          </p>
        </div>
        <div className="card">
          <h3>Payment firewall</h3>
          <p>
            ranking_payment_boost_allowed is always false. Forbidden inputs
            include {paymentFirewall.forbiddenRankingInputs.join(", ")}.
          </p>
        </div>
      </div>
      <section className="section">
        <h2>Scoring version foundation</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Status</th>
              <th>Default pillar model</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{defaultScoringVersion.code}</td>
              <td>Draft, not active until governance approval</td>
              <td>Labor, environment, governance, and community start equal</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="section">
        <h2>SDG inspection list</h2>
        <div className="card-grid">
          {sdgNames.map((name, index) => (
            <div className="card" key={name}>
              <h3>SDG {index + 1}</h3>
              <p>{name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
