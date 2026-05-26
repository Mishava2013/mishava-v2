import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export function ComingSoonSurface({
  eyebrow,
  title,
  description,
  status,
  links = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  links?: Array<{ href: string; label: string }>;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}>
        {description}
      </PageHeader>

      <div className="notice" role="status">
        Coming soon: {status}
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>What works now</h3>
          <p>
            Mishava shows this page so the URL resolves cleanly while the full
            workflow is still being built. It should not imply a live product
            surface, certification, public API, or production portal.
          </p>
        </div>
        <div className="card">
          <h3>Trust boundary</h3>
          <p>
            Payment, hosting, setup, access, sponsorship, or support cannot buy
            better scores, rankings, verification labels, evidence treatment, or
            methodology outputs.
          </p>
        </div>
        <div className="card">
          <h3>Next step</h3>
          <p>
            Use the current Shopping, NGO, Support, and Trust pages while this
            dedicated surface is prepared.
          </p>
        </div>
      </div>

      {links.length > 0 ? (
        <section className="section">
          <h2>Available now</h2>
          <div className="actions-row">
            {links.map((link) => (
              <Link className="button" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
