import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { requestPasswordResetAction } from "../actions";

export default async function ResetPasswordPage({
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
      <PageHeader eyebrow="Account recovery" title="Reset your password.">
        Enter the email for your Mishava account. If the account exists, Mishava
        will send password reset instructions.
      </PageHeader>
      <section className="auth-grid">
        <form action={requestPasswordResetAction} className="auth-card">
          {params.error ? (
            <p className="form-message error">{decodeURIComponent(params.error)}</p>
          ) : null}
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <button className="button primary" type="submit">
            Send reset link
          </button>
          <div className="auth-links">
            <SignInModalButton
              aria-label="Back to sign in"
              className="link-button"
              nextPath={nextPath}
            >
              Back to sign in
            </SignInModalButton>
          </div>
        </form>
      </section>
    </>
  );
}
