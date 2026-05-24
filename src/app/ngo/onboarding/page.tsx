import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { WorkflowList } from "@/components/WorkflowList";
import { evidenceIntakeTypes, ngoOnboardingSteps } from "@/lib/ngo";

export default function NgoOnboardingPage() {
  return (
    <>
      <PageHeader eyebrow="NGO onboarding" title="Set up an NGO trust profile.">
        Release 2 starts the NGO setup path with identity, evidence, AI-cost
        controls, approval gates, and scoped sharing. Nothing becomes public
        without the organization approval flow.
      </PageHeader>

      <WorkflowList items={ngoOnboardingSteps} />

      <section className="section">
        <h2>Profile setup draft</h2>
        <form className="form-grid">
          <div className="field">
            <label htmlFor="public-name">Public organization name</label>
            <input id="public-name" placeholder="Organization name" />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input id="country" placeholder="Country or market" />
          </div>
          <div className="field">
            <label htmlFor="mission-area">Mission area</label>
            <select id="mission-area" defaultValue="">
              <option value="" disabled>
                Select a mission area
              </option>
              <option>Food security</option>
              <option>Education</option>
              <option>Community support</option>
              <option>Environmental protection</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="visibility">Default visibility</label>
            <select id="visibility" defaultValue="private">
              <option value="private">Private until approved</option>
              <option value="approved_viewer">Approved viewers only</option>
              <option value="public_summary">Public summary</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="summary">Mission summary</label>
            <textarea id="summary" placeholder="Plain-language organization summary" />
          </div>
        </form>
      </section>

      <section className="section">
        <h2>Evidence accepted first</h2>
        <div className="card-grid">
          {evidenceIntakeTypes.map((type) => (
            <div className="card" key={type}>
              <h3>{type}</h3>
              <p>
                Intake records require source type, visibility, submitter, and
                approval status before they support any public report.
              </p>
            </div>
          ))}
        </div>
      </section>

      <EmptyState title="No NGO records loaded yet">
        This build is ready for real NGO onboarding data, but it does not seed
        fake organizations, fake reports, or fake evidence.
      </EmptyState>

      <section className="section">
        <Link className="button primary" href="/org/profile">
          Open organization workspace
        </Link>
      </section>
    </>
  );
}

