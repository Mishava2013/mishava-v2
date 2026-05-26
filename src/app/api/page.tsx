import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function ApiInfoPage() {
  return (
    <>
      <PageHeader eyebrow="API" title="Future Mishava integrations.">
        Mishava API access is reserved for future evidence, reporting,
        procurement, and partner integrations. Public API access is not live yet.
      </PageHeader>

      <div className="notice" role="status">
        Reserved surface: this page is informational only. Existing internal API
        routes remain protected by their own server-side checks.
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Evidence and reports</h3>
          <p>
            Future APIs should preserve organization isolation, audit logging,
            and raw-evidence privacy.
          </p>
        </div>
        <div className="card">
          <h3>Payment firewall</h3>
          <p>
            API access cannot buy better score, ranking, verification,
            methodology, or trust treatment.
          </p>
        </div>
        <div className="card">
          <h3>Security first</h3>
          <p>
            API access will need scoped credentials, rate limits, audit events,
            and clear data-use terms before launch.
          </p>
        </div>
      </div>

      <section className="section">
        <h2>Current resources</h2>
        <div className="actions-row">
          <Link className="button" href="/legal/security">
            Security overview
          </Link>
          <Link className="button" href="/legal/privacy">
            Privacy
          </Link>
          <Link className="button" href="/support">
            Support
          </Link>
        </div>
      </section>
    </>
  );
}
