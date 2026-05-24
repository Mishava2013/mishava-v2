import { PageHeader } from "@/components/PageHeader";

export default function LocalPage() {
  return (
    <>
      <PageHeader eyebrow="Local" title="Local buying by radius, availability, and evidence.">
        Local means a user can set a radius from a shipping address, ZIP code,
        or other location signal to find nearby stores, locally made products,
        same-day options, and businesses that fit their values.
      </PageHeader>
      <div className="surface-list">
        <div className="card">
          <h3>Consumer controls</h3>
          <p>
            Users can sort by Evidence Score, Your Values Score, price,
            distance, availability, and local production when that matters to them.
          </p>
        </div>
        <div className="card">
          <h3>Local store tools</h3>
          <p>
            Store owners can list products, show local pickup or delivery, and
            eventually connect to fair local delivery services.
          </p>
        </div>
      </div>
    </>
  );
}

