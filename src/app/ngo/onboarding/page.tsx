import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { WorkflowList } from "@/components/WorkflowList";
import { evidenceIntakeTypes, ngoOnboardingSteps } from "@/lib/ngo";
import { createNgoOnboardingAction } from "./actions";

export default async function NgoOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="NGO setup" title="Create your NGO profile.">
        Start with basic organization details. Nothing becomes public unless
        your organization chooses to share or approve it later.
      </PageHeader>

      {params.error ? (
        <div className="notice" role="status">
          {params.error === "auth_required"
            ? "Sign in is required before an NGO profile can be saved."
            : decodeURIComponent(params.error)}
        </div>
      ) : null}

      <WorkflowList items={ngoOnboardingSteps} />

      <section className="section">
        <h2>Basic profile</h2>
        <form action={createNgoOnboardingAction} className="form-grid">
          <div className="field">
            <label htmlFor="public-name">Public organization name</label>
            <input id="public-name" name="publicName" placeholder="Organization name" required />
          </div>
          <div className="field">
            <label htmlFor="legal-name">Legal organization name</label>
            <input id="legal-name" name="legalName" placeholder="Legal name, if different" />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" placeholder="Country or market" required />
          </div>
          <div className="field">
            <label htmlFor="mission-area">Mission area</label>
            <select id="mission-area" name="missionArea" defaultValue="" required>
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
            <label htmlFor="website-url">Website URL</label>
            <input id="website-url" name="websiteUrl" placeholder="https://example.org" />
          </div>
          <div className="field">
            <label htmlFor="registration-id">Registration ID, if you have one</label>
            <input id="registration-id" name="registrationIdentifier" placeholder="Optional public registration ID" />
          </div>
          <div className="field">
            <label htmlFor="visibility">Who can see this at first?</label>
            <select id="visibility" name="defaultVisibility" defaultValue="private">
              <option value="private">Private until approved</option>
              <option value="approved_viewer">Only approved viewers</option>
              <option value="public_summary">Public summary</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="summary">Mission summary</label>
            <textarea id="summary" name="summary" placeholder="Plain-language organization summary" />
          </div>
          <div className="field full">
            <button className="button primary" type="submit">
              Save NGO profile
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <h2>What you can add later</h2>
        <div className="card-grid">
          {evidenceIntakeTypes.map((type) => (
            <div className="card" key={type}>
              <h3>{type}</h3>
              <p>
                These records need a source, a review state, and clear privacy
                settings before they can support a shared report.
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
