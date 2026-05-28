import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";

export default function AuthCallbackPage() {
  return (
    <>
      <PageHeader eyebrow="Email verification" title="Account link received.">
        If this was an email confirmation link, your account can now sign in.
        If this was a password reset link, continue to the password update page.
      </PageHeader>
      <section className="auth-grid">
        <div className="auth-card">
          <p className="form-message">
            Slice 1A uses Supabase Auth as the account foundation. Full magic
            link and invite acceptance handling will be completed in later auth
            account slices.
          </p>
          <div className="hero-actions">
            <SignInModalButton className="button primary" nextPath="/app" />
            <Link className="button" href="/auth/update-password">
              Update password
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
