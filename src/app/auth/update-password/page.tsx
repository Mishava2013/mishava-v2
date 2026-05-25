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
        This page uses the current verified Supabase Auth session. If your reset
        link did not create a session, sign in again and request a new link.
      </PageHeader>
      <section className="auth-grid">
        <form action={updatePasswordAction} className="auth-card">
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
