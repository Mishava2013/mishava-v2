import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import {
  getSafeIntakeLinkByToken,
  safeIntakeActorOptions,
  safeIntakeIndustryOptions,
  safeIntakeIssueOptions,
} from "@/lib/ngo-safe-intake";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import { submitSafeIntakeAction } from "./actions";

export default async function SafeIntakePublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const link = isSupabaseServerConfigured()
    ? await getSafeIntakeLinkByToken({
        client: createSupabaseServerClient(),
        token,
      })
    : null;

  if (!link) {
    return (
      <>
        <PageHeader eyebrow="Safe intake" title="This intake link is not open.">
          The organization may have paused, revoked, or finished using this
          link. Please contact the organization directly if you need help.
        </PageHeader>
        <section className="section">
          <EmptyState title="Link unavailable">
            No public report or complaint was created. This page only works when
            an organization shares an active safe intake link.
          </EmptyState>
        </section>
      </>
    );
  }

  if (query.submitted) {
    return (
      <>
        <PageHeader eyebrow="Safe intake" title="Your intake was sent.">
          The organization can review what you sent. Nothing becomes public from
          this form, and Mishava does not decide legal outcomes.
        </PageHeader>
        <section className="section">
          <EmptyState title="Sent to the organization">
            Thank you. If you added contact details, the organization can use
            your safe-contact choice. If you did not, they can still review the
            information you shared.
          </EmptyState>
        </section>
      </>
    );
  }

  const submit = submitSafeIntakeAction.bind(null, token);

  return (
    <>
      <PageHeader eyebrow="Start your intake" title={link.title}>
        Tell the organization what happened in your own words. You can skip
        questions you do not know. You do not need a Mishava account.
      </PageHeader>

      {query.error ? (
        <div className="notice" role="status">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}

      <section className="section">
        <h2>Before you start</h2>
        <div className="simple-list">
          <div className="simple-list-item">
            <strong>This goes to the organization.</strong>
            <p>It is not posted publicly.</p>
          </div>
          <div className="simple-list-item">
            <strong>You can skip what you do not know.</strong>
            <p>Start with the details you remember.</p>
          </div>
          <div className="simple-list-item">
            <strong>This is not legal advice.</strong>
            <p>The organization reviews what you send before using it.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Tell us what happened</h2>
        <form action={submit} className="form-grid" encType="multipart/form-data">
          <div className="field">
            <label htmlFor="submitter-label">Your name or initials (optional)</label>
            <input
              id="submitter-label"
              name="submitterLabel"
              placeholder="You can leave this blank"
            />
          </div>

          <div className="field">
            <label htmlFor="issue-category">What kind of issue is this?</label>
            <select id="issue-category" name="issueCategory" defaultValue="Not sure yet">
              <option>Not sure yet</option>
              {safeIntakeIssueOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="industry-tag">What kind of work was involved?</label>
            <select id="industry-tag" name="industryTag" defaultValue="Not sure yet">
              <option>Not sure yet</option>
              {safeIntakeIndustryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="actor-type">Who was involved?</label>
            <select id="actor-type" name="actorType" defaultValue="Not sure yet">
              <option>Not sure yet</option>
              {safeIntakeActorOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="worksite">Employer, worksite, or place (optional)</label>
            <input
              id="worksite"
              name="worksiteOrEmployer"
              placeholder="Employer, farm, store, warehouse, restaurant, or location"
            />
          </div>

          <div className="field">
            <label htmlFor="happened-at">When did this happen? (optional)</label>
            <input id="happened-at" name="happenedAt" placeholder="Date or rough time" />
          </div>

          <div className="field full">
            <label htmlFor="narrative">Tell us what happened</label>
            <textarea
              id="narrative"
              name="narrative"
              placeholder="Use your own words. A few sentences is okay."
              required
            />
          </div>

          <div className="field">
            <label htmlFor="share-outside">
              Can this be shared outside the organization?
            </label>
            <select id="share-outside" name="shareOutsideNgo" defaultValue="No">
              <option>No</option>
              <option>Only without my name</option>
              <option>Yes</option>
              <option>Not sure yet</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="retaliation">Are you worried about retaliation?</label>
            <select id="retaliation" name="retaliationConcern" defaultValue="Not sure yet">
              <option>Not sure yet</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="worker-name-private">Should your name stay private?</label>
            <select id="worker-name-private" name="workerNamePrivate" defaultValue="Yes">
              <option>Yes</option>
              <option>No</option>
              <option>Not sure yet</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="immigration-concern">
              Is there an immigration-related threat or fear?
            </label>
            <select
              id="immigration-concern"
              name="immigrationConcern"
              defaultValue="Not sure yet"
            >
              <option>Not sure yet</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="safe-contact">Safest way to contact you</label>
            <select id="safe-contact" name="safeContactMethod" defaultValue="Through the NGO only">
              <option>Through the NGO only</option>
              <option>Text</option>
              <option>Phone</option>
              <option>Email</option>
              <option>Not safe to contact yet</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="contact-detail">Contact detail (optional)</label>
            <input
              id="contact-detail"
              name="contactDetail"
              placeholder="Phone, email, or note about safe contact"
            />
          </div>

          <div className="field full">
            <label htmlFor="evidence-file">Add a photo or file (optional)</label>
            <input
              id="evidence-file"
              name="evidenceFile"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.doc,.docx,application/pdf,image/png,image/jpeg,image/webp,text/plain,text/csv"
            />
            <p className="form-message">
              Files stay private for organization review. Do not upload anything
              you do not want the organization to see.
            </p>
          </div>

          <div className="field full">
            <button className="button primary" type="submit">
              Send to the organization
            </button>
            <p className="form-message">
              Nothing becomes public automatically. This form does not create a
              public accusation, public report, legal conclusion, score, or AI
              decision.
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
