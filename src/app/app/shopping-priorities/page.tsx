import { PageHeader } from "@/components/PageHeader";

const priorityGroups = [
  "12-question minimum to start",
  "25 total questions when complete",
  "20 preference questions",
  "5 automatic-zero rules with Off, Warn me, or Hide",
  "Category-specific willingness to pay",
];

export default function ShoppingPrioritiesPage() {
  return (
    <>
      <PageHeader eyebrow="Shopping priorities" title="Your Values Score setup.">
        Mishava will personalize fit only after a user answers enough priority
        questions. Users can retake the questionnaire and tighten preferences
        over time through occasional prompts.
      </PageHeader>
      <div className="card-grid">
        {priorityGroups.map((group) => (
          <div className="card" key={group}>
            <h3>{group}</h3>
            <p>
              This will become a preference module, not a scoring override. It
              changes personal fit, not the base Evidence Score.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

