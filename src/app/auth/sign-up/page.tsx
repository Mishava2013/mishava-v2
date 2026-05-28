import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { signUpAction } from "../actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="NGO account" title="Create your Mishava account.">
        Start with a real account, then create or join an NGO workspace. Your
        organization data remains private unless you choose scoped sharing.
      </PageHeader>
      <section className="auth-grid">
        <form action={signUpAction} className="auth-card">
          {params.error ? (
            <p className="form-message error">{decodeURIComponent(params.error)}</p>
          ) : (
            <p className="form-message">
              Supabase Auth powers this foundation. Email confirmation behavior
              depends on the project dashboard settings.
            </p>
          )}
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
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
            <SignInModalButton className="link-button" nextPath="/app">
              Already have an account?
            </SignInModalButton>
          </div>
        </form>
      </section>
    </>
  );
}
