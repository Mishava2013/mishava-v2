import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { signUpAction } from "../actions";

function getSignUpContext(nextPath: string) {
  if (nextPath.startsWith("/ngo") || nextPath.startsWith("/org")) {
    return {
      eyebrow: "NGO account access",
      title: "Create your Mishava NGO account.",
      body:
        "Use this account for NGO workspace access, evidence files, reports, and scoped sharing. Shopping product evidence remains separate, and payment never changes trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to the NGO workspace after confirming your email.",
      button: "Create NGO account",
      signInLabel: "Already approved? Sign in",
    };
  }

  if (
    nextPath === "/" ||
    nextPath.startsWith("/shopping") ||
    nextPath.startsWith("/app/shopping-priorities")
  ) {
    return {
      eyebrow: "Shopping account access",
      title: "Create your Mishava Shopping account.",
      body:
        "Use this account to save Shopping Priorities and return to product evidence previews. You can browse Shopping without an account, and payment never changes scores, ranking, or trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Shopping after confirming your email.",
      button: "Create Shopping account",
      signInLabel: "Already have a Shopping account?",
    };
  }

  return {
    eyebrow: "Account access",
    title: "Create your Mishava account.",
    body:
      "Use one Mishava account for Shopping Priorities, NGO workspaces, and other saved tools. Shopping product evidence remains viewable without inventing scores, and payment never changes trust outcomes.",
    message:
      "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Mishava after confirming your email.",
    button: "Create account",
    signInLabel: "Already have an account?",
  };
}

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
  const signUpContext = getSignUpContext(nextPath);

  return (
    <>
      <PageHeader eyebrow={signUpContext.eyebrow} title={signUpContext.title}>
        {signUpContext.body}
      </PageHeader>
      <section className="auth-grid">
        <form action={signUpAction} className="auth-card">
          {params.error ? (
            <p className="form-message error">{decodeURIComponent(params.error)}</p>
          ) : (
            <p className="form-message">
              {signUpContext.message}
            </p>
          )}
          <input name="next" type="hidden" value={nextPath} />
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
            {signUpContext.button}
          </button>
          <div className="auth-links">
            <SignInModalButton className="link-button" nextPath={nextPath}>
              {signUpContext.signInLabel}
            </SignInModalButton>
          </div>
        </form>
      </section>
    </>
  );
}
