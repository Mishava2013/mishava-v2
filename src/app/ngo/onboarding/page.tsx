import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { WorkflowList } from "@/components/WorkflowList";
import { getCurrentSession } from "@/lib/auth-server";
import {
  evidenceIntakeTypes,
  ngoOnboardingSteps,
  workerRightsIssueCategories,
} from "@/lib/ngo";
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
        Create your free account first. Then add your NGO name and basic
        details. You can start with one case, one worksite, or one issue.
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
              <h2>Create your free account</h2>
              <p className="form-message">
                This lets Mishava save your NGO profile privately.
              </p>
              <div className="hero-actions">
                <Link
                  className="button primary"
                  href="/auth/sign-up?next=%2Fngo%2Fonboarding&surface=ngo"
                >
                  Create free account
                </Link>
                <SignInModalButton
                  className="button"
                  nextPath="/ngo/onboarding"
                  surface="ngo"
                >
                  Already have an account? Sign in
                </SignInModalButton>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>What happens next</h2>
            <div className="simple-list">
              <div className="simple-list-item">
                <strong>1. Create your account.</strong>
                <p>Use your email and password so Mishava can save your work.</p>
              </div>
              <div className="simple-list-item">
                <strong>2. Add your NGO name and basic details.</strong>
                <p>Add your organization name, country, mission area, and privacy choice.</p>
              </div>
              <div className="simple-list-item">
                <strong>3. Upload or list evidence later.</strong>
                <p>Proof can stay private until your organization is ready.</p>
              </div>
              <div className="simple-list-item">
                <strong>4. Build a packet or report when ready.</strong>
                <p>Use reviewed proof to prepare a private packet or report later.</p>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {!session ? null : (
        <>
          <WorkflowList items={ngoOnboardingSteps} />

          <section className="section">
            <h2>Add your NGO name and basic details</h2>
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
                  <option>Worker rights</option>
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
                  <option value="private">Private until you share it</option>
                  <option value="approved_viewer">Only people you approve</option>
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
            <p className="section-intro">
              It is okay if you do not have every item. Add what you have. You
              can add more later.
            </p>
            <div className="card-grid">
              {evidenceIntakeTypes.map((type) => (
                <div className="card" key={type}>
                  <h3>{type}</h3>
                  <p>
                    Keep this private until your organization reviews what is
                    safe to share.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2>Worker-rights issues you can track</h2>
            <p className="section-intro">
              Mishava can help your NGO organize proof about workplace harm.
              Worker names can stay private.
            </p>
            <div className="tag-cloud" aria-label="Worker-rights issue examples">
              {workerRightsIssueCategories.map((category) => (
                <span className="tag" key={category}>
                  {category}
                </span>
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
