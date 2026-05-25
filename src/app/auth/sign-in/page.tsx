import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="Account access" title="Sign in to Mishava.">
        Use your account to manage NGO evidence, reports, scoped sharing, and
        saved priorities. Payment never changes trust outcomes.
      </PageHeader>
      <section className="auth-grid">
        <form action="/auth/sign-in/submit" className="auth-card" method="post">
          <StatusMessage error={params.error} notice={params.notice} />
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input
              autoComplete="current-password"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button className="button primary" type="submit">
            Sign in
          </button>
          <div className="auth-links">
            <Link href="/auth/reset-password">Reset password</Link>
            <Link href="/auth/sign-up">Create account</Link>
          </div>
        </form>
      </section>
    </>
  );
}

function StatusMessage({ error, notice }: { error?: string; notice?: string }) {
  if (error) {
    return <p className="form-message error">{decodeURIComponent(error)}</p>;
  }

  if (notice === "check_email") {
    return (
      <p className="form-message">
        Check your email to confirm the account if confirmation is enabled.
      </p>
    );
  }

  if (notice === "reset_requested") {
    return <p className="form-message">Password reset instructions were sent.</p>;
  }

  if (notice === "signed_out") {
    return <p className="form-message">You have been signed out.</p>;
  }

  return null;
}
