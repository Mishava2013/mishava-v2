import Link from "next/link";
import { AuthHashSessionBridge } from "@/components/AuthHashSessionBridge";
import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";

export default function AuthCallbackPage() {
  return (
    <>
      <PageHeader eyebrow="Email verification" title="Account link received.">
        Mishava received your email link. If you were confirming a new account,
        you can sign in and continue. If you were resetting a password, choose a
        new password next.
      </PageHeader>
      <section className="auth-grid">
        <div className="auth-card">
          <AuthHashSessionBridge readyMessage="Your email link was accepted. You can continue." />
          <p className="form-message">
            If the link opened from your email, this page will finish checking
            it automatically. If nothing changes, sign in or request a new email
            link.
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
