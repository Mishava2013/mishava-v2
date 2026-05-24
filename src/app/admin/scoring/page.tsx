import { PageHeader } from "@/components/PageHeader";
import { paymentFirewall } from "@/lib/foundation";
import { defaultScoringVersion } from "@/lib/scoring";

export default function AdminScoringPage() {
  return (
    <>
      <PageHeader eyebrow="Admin scoring" title="Versioned scoring governance.">
        Scoring versions are approved, dated, explained, tested, and published.
        Changes create snapshots and public methodology notes.
      </PageHeader>

      <div className="surface-list">
        <div className="card">
          <h3>Current draft version</h3>
          <p>{defaultScoringVersion.code}</p>
          <div className="status-row">
            <span className="tag">Not active until approved</span>
            <span className="tag">Snapshot required</span>
            <span className="tag">Public change note required</span>
          </div>
        </div>
        <div className="card">
          <h3>Payment firewall</h3>
          <p>
            ranking_payment_boost_allowed is false. Feature gates include a
            database check constraint that prevents paid ranking from being enabled.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>Pillar weights</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Pillar</th>
              <th>Default weight</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(defaultScoringVersion.pillarWeights).map(
              ([pillar, weight]) => (
                <tr key={pillar}>
                  <td>{pillar}</td>
                  <td>{weight}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Forbidden ranking inputs</h2>
        <div className="card-grid">
          {paymentFirewall.forbiddenRankingInputs.map((input) => (
            <div className="card" key={input}>
              <h3>{input}</h3>
              <p>
                This input cannot be used in result ranking, matching order, or
                perceived credibility treatment.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
