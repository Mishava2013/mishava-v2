import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { WorkflowList } from "@/components/WorkflowList";
import { getCurrentSession } from "@/lib/auth-server";
import { evidenceIntakeTypes, ngoOnboardingSteps } from "@/lib/ngo";
import { createNgoOnboardingAction } from "./actions";

export default async function NgoOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const session = await getCurrentSession();

  return (
    <>
      <PageHeader eyebrow="NGO setup" title="Create your NGO profile.">
        First sign in or create a free Mishava account. Then save your
        organization name, mission area, and privacy setting.
      </PageHeader>

      {params.error ? (
        <div className="notice" role="status">
          {params.error === "auth_required"
            ? "Please sign in or create an account before saving an NGO profile."
            : decodeURIComponent(params.error)}
        </div>
      ) : null}

      {!session ? (
        <>
          <section className="section">
            <div className="auth-card">
              <p className="eyebrow">Step 1</p>
              <h2>Create or sign in to your account</h2>
              <p className="form-message">
                Mishava needs an account before it can save your NGO profile.
                This keeps your organization details private until you decide
                what to share.
              </p>
              <div className="hero-actions">
                <Link
                  className="button primary"
                  href="/auth/sign-up?next=%2Fngo%2Fonboarding&surface=ngo"
                >
                  Create free NGO account
                </Link>
                <SignInModalButton
                  className="button"
                  nextPath="/ngo/onboarding"
                  surface="ngo"
                >
                  Sign in
                </SignInModalButton>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>What happens next</h2>
            <div className="simple-list">
              <div className="simple-list-item">
                <strong>1. Create or sign in.</strong>
                <p>Use your email and password so Mishava can save your work.</p>
              </div>
              <div className="simple-list-item">
                <strong>2. Save your NGO profile.</strong>
                <p>Add your organization name, country, mission area, and privacy choice.</p>
              </div>
              <div className="simple-list-item">
                <strong>3. Add evidence later.</strong>
                <p>Reports and evidence stay private unless your organization shares them.</p>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {!session ? null : (
        <>
          <WorkflowList items={ngoOnboardingSteps} />

          <section className="section">
            <h2>Basic profile</h2>
            <form action={createNgoOnboardingAction} className="form-grid">
              <div className="field">
                <label htmlFor="public-name">Public organization name</label>
                <input
                  id="public-name"
                  name="publicName"
                  placeholder="Organization name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="legal-name">Legal organization name</label>
                <input
                  id="legal-name"
                  name="legalName"
                  placeholder="Legal name, if different"
                />
              </div>
              <div className="field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  placeholder="Country or market"
                  required
                />
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
                <input
                  id="website-url"
                  name="websiteUrl"
                  placeholder="https://example.org"
                />
              </div>
              <div className="field">
                <label htmlFor="registration-id">Registration ID, if you have one</label>
                <input
                  id="registration-id"
                  name="registrationIdentifier"
                  placeholder="Optional public registration ID"
                />
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
                <textarea
                  id="summary"
                  name="summary"
                  placeholder="Plain-language organization summary"
                />
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
                    These records need a source, a review state, and clear
                    privacy settings before they can support a shared report.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <EmptyState title="No NGO records loaded yet">
            This build is ready for real NGO onboarding data, but it does not
            seed fake organizations, fake reports, or fake evidence.
          </EmptyState>

          <section className="section">
            <Link className="button primary" href="/org/profile">
              Open organization workspace
            </Link>
          </section>
        </>
      )}
    </>
  );
}
