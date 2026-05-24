import { PageHeader } from "@/components/PageHeader";

export default function TradePage() {
  return (
    <>
      <PageHeader eyebrow="Trade / Network" title="Supplier and seller matching without priority placement.">
        Suppliers can find sellers and sellers can find suppliers through fit,
        evidence, logistics, capacity, verification, and values alignment. Paid
        plans unlock saved searches and workflows, not placement.
      </PageHeader>
      <div className="card-grid">
        {[
          "Category and product fit",
          "Values and evidence requirement match",
          "Geography, shipping, capacity, and price fit",
        ].map((title) => (
          <div className="card" key={title}>
            <h3>{title}</h3>
            <p>
              Matching logic will show why an organization appears and exclude
              payment status from the ranking formula.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

