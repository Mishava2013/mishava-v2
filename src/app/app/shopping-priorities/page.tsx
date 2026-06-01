import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { requireAuthenticatedSession } from "@/lib/auth-server";
import {
  automaticZeroQuestions,
  getShoppingPriorityProfile,
  shoppingPriorityQuestions,
} from "@/lib/shopping";
import { saveShoppingPrioritiesAction } from "./actions";

const priorityGroups = [
  "12-question minimum to start",
  "25 total questions when complete",
  "20 preference questions",
  "5 automatic-zero rules with Off, Warn me, or Hide",
  "Category-specific willingness to pay",
];

export default async function ShoppingPrioritiesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; personalized?: string; error?: string }>;
}) {
  const session = await requireAuthenticatedSession();
  const params = await searchParams;
  const priorityProfile = await getShoppingPriorityProfile(session.user.id);
  const answers = priorityProfile?.answers ?? {};
  const zeroRules = priorityProfile?.automatic_zero_rules ?? {};

  return (
    <>
      <PageHeader eyebrow="Shopping priorities" title="Your Values Score setup.">
        Mishava will personalize fit only after a user answers enough priority
        questions. Users can retake the questionnaire and tighten preferences
        over time through occasional prompts.
      </PageHeader>

      <div className="notice" role="note">
        Shopping Priorities help Mishava explain personal fit later. They do not
        create a final score, do not change the base Evidence Score, and do not
        make medical suitability claims.{" "}
        <Link href="/shopping/categories/toilet-paper">
          Return to the toilet paper preview
        </Link>
        .
      </div>

      {params.saved ? (
        <div className="notice" role="status">
          Shopping priorities saved.{" "}
          {params.personalized === "1"
            ? "Your Values Score can be calculated when product scores exist."
            : "Answer all 12 starter questions and enable personalization to use Your Values Score."}
        </div>
      ) : null}
      {params.error === "privacy_required" ? (
        <div className="notice warning" role="alert">
          Please acknowledge the Shopping Priorities privacy note before saving.
        </div>
      ) : null}

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

      <section className="section compact-section">
        <h2>How this works</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Evidence Score</h3>
            <p>
              Evidence Score is the base trust score supported by reviewed
              evidence. Your answers do not change it.
            </p>
          </div>
          <div className="card">
            <h3>Your Values Score</h3>
            <p>
              Your Values Score is a personal fit overlay. It can appear only
              after priorities are saved and enough evidence-backed scoring data
              exists.
            </p>
          </div>
          <div className="card">
            <h3>Privacy</h3>
            <p>
              Mishava does not sell personal priority profiles. Payment does not
              affect score, ranking, or trust treatment.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Starter questions</h2>
        <p className="section-intro">
          These 12 questions let a user begin personalization. They adjust the
          personal fit overlay only; they do not rewrite the base Evidence Score.
        </p>
        <form action={saveShoppingPrioritiesAction} className="form-grid">
          {shoppingPriorityQuestions.map((question) => (
            <div className="field" key={question.id}>
              <label htmlFor={question.id}>{question.label}</label>
              <select
                id={question.id}
                name={question.id}
                defaultValue={answers[question.id]?.toString() ?? ""}
              >
                <option value="" disabled>
                  Choose importance
                </option>
                <option value="1">1 - Not important</option>
                <option value="2">2 - Slightly important</option>
                <option value="3">3 - Moderately important</option>
                <option value="4">4 - Very important</option>
                <option value="5">5 - Extremely important</option>
              </select>
            </div>
          ))}

          <div className="field full">
            <label htmlFor="personalizationEnabled">
              Enable Your Values Score after 12 answers
            </label>
            <select
              id="personalizationEnabled"
              name="personalizationEnabled"
              defaultValue={priorityProfile?.personalization_enabled === false ? "off" : "on"}
            >
              <option value="on">On when complete</option>
              <option value="off">Keep off for now</option>
            </select>
          </div>

          <div className="field full">
            <h3>Automatic-zero preferences</h3>
            <p className="section-intro">
              Each rule can be off, warning-only, or hidden from results. Company
              restoration is evidence-led when correction is proven.
            </p>
          </div>

          {automaticZeroQuestions.map((question, index) => (
            <div className="field" key={question}>
              <label htmlFor={`zero-rule-${index + 1}`}>{question}</label>
              <select
                id={`zero-rule-${index + 1}`}
                name={`zero_rule_${index + 1}`}
                defaultValue={zeroRules[`zero_rule_${index + 1}`] ?? "off"}
              >
                <option value="off">Off</option>
                <option value="warn">Warn me</option>
                <option value="hide">Hide</option>
              </select>
            </div>
          ))}

          <div className="field full">
            <label className="check-row" htmlFor="privacyAcknowledged">
              <input
                id="privacyAcknowledged"
                name="privacyAcknowledged"
                type="checkbox"
                defaultChecked={Boolean(priorityProfile?.privacy_acknowledged_at)}
                required
              />
              <span>
                I understand that Shopping Priorities personalize my experience,
                do not change any company or product Evidence Score, and are not
                sold as a personal profile.
              </span>
            </label>
          </div>

          <div className="field full">
            <button className="button primary" type="submit">
              {priorityProfile ? "Update priorities" : "Save priorities"}
            </button>
            <Link className="button" href="/shopping">
              Back to Shopping
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
