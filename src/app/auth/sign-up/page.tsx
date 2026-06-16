import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { signUpAction } from "../actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/app";

  return (
    <>
      <PageHeader eyebrow="Account access" title="Create your Mishava account.">
        Use one Mishava account for Shopping Priorities, NGO workspaces, and
        other saved tools. Shopping product evidence remains viewable without
        inventing scores, and payment never changes trust outcomes.
      </PageHeader>
      <section className="auth-grid">
        <form action={signUpAction} className="auth-card">
          {params.error ? (
            <p className="form-message error">{decodeURIComponent(params.error)}</p>
          ) : (
            <p className="form-message">
              Enter your email and choose a password with at least 6 characters.
              If Mishava asks you to confirm your email, open the email first,
              then come back to continue.
            </p>
          )}
          <input name="next" type="hidden" value={nextPath} />
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password, at least 6 characters
            <input
              autoComplete="new-password"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button className="button primary" type="submit">
            Create account
          </button>
          <div className="auth-links">
            <SignInModalButton className="link-button" nextPath={nextPath}>
              Already have an account?
            </SignInModalButton>
          </div>
        </form>
      </section>
    </>
  );
}
