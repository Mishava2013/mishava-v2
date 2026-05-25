import { PageHeader } from "@/components/PageHeader";
import { signOutAction } from "../actions";

export default function SignOutPage() {
  return (
    <>
      <PageHeader eyebrow="Account access" title="Sign out.">
        This clears the local Mishava auth session and current organization
        selection.
      </PageHeader>
      <section className="auth-grid">
        <form action={signOutAction} className="auth-card">
          <p className="form-message">
            Sign out when you are done managing NGO evidence, reports, or shared
            trust summaries on this device.
          </p>
          <button className="button primary" type="submit">
            Sign out
          </button>
        </form>
      </section>
    </>
  );
}
