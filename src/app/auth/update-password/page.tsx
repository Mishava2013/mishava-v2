import { AuthHashSessionBridge } from "@/components/AuthHashSessionBridge";
import { PageHeader } from "@/components/PageHeader";
import { updatePasswordAction } from "../actions";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="Account recovery" title="Choose a new password.">
        If you opened this from your email, Mishava will check the link first.
        Then choose a new password with at least 6 characters.
      </PageHeader>
      <section className="auth-grid">
        <form action={updatePasswordAction} className="auth-card">
          <AuthHashSessionBridge readyMessage="Your reset link is ready. Choose a new password." />
          {params.error ? (
            <p className="form-message error">{decodeURIComponent(params.error)}</p>
          ) : null}
          <label>
            New password
            <input
              autoComplete="new-password"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button className="button primary" type="submit">
            Update password
          </button>
        </form>
      </section>
    </>
  );
}
