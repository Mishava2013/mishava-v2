import { PageHeader } from "@/components/PageHeader";

export default function SignInPage() {
  return (
    <>
      <PageHeader eyebrow="Account access" title="Sign in to Mishava.">
        Use your account for Shopping Priorities, saved tools, NGO evidence,
        reports, and scoped sharing. Payment never changes trust outcomes.
      </PageHeader>
      <section className="auth-grid">
        <div className="auth-card">
          <p className="form-message">
            Sign-in now opens as a popup so you can keep your place. The popup
            should open automatically; use the header sign-in button if it does
            not.
          </p>
        </div>
      </section>
    </>
  );
}
