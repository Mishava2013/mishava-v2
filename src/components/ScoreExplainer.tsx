export function ScoreExplainer({
  label = "Evidence Score",
}: {
  label?: "Evidence Score" | "Your Values Score";
}) {
  return (
    <aside className="evidence-panel">
      <h2 className="panel-title">{label}</h2>
      <div className="score-row">
        <div className="score-badge">--</div>
        <p className="score-caption">
          No score appears until Mishava has real evidence, a scoring version,
          and a snapshot. Paid plans can add tools or review depth, but cannot
          change score treatment or ranking.
        </p>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>Coverage</span>
          <strong>Pending evidence</strong>
        </div>
        <div className="metric">
          <span>Recency</span>
          <strong>Pending snapshot</strong>
        </div>
        <div className="metric">
          <span>Verification</span>
          <strong>Not yet checked</strong>
        </div>
        <div className="metric">
          <span>Confidence</span>
          <strong>Not yet assigned</strong>
        </div>
      </div>
    </aside>
  );
}

