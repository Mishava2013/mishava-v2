import { PageHeader } from "@/components/PageHeader";
import { SignInModalButton } from "@/components/SignInModal";
import { signUpAction } from "../actions";

const signUpSurfaces = new Set([
  "shopping",
  "ngo",
  "business",
  "local",
  "corporate",
  "admin",
  "support",
  "trust",
  "gov",
  "app",
]);

function safeSignUpSurface(value: string | undefined) {
  return value && signUpSurfaces.has(value) ? value : null;
}

function getSignUpContext(nextPath: string, surface: string | null) {
  if (surface === "shopping") {
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

  if (surface === "ngo") {
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

  if (surface === "business") {
    return {
      eyebrow: "Business account access",
      title: "Create your Mishava Business account.",
      body:
        "Use this account for business profile tools and future catalog workflows. Payment never changes trust outcomes, ranking, verification, or credibility labels.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Business after confirming your email.",
      button: "Create Business account",
      signInLabel: "Already have a Business account?",
    };
  }

  if (surface === "local") {
    return {
      eyebrow: "Local account access",
      title: "Create your Mishava Local account.",
      body:
        "Use this account for local profile tools when they become available. Mishava does not sell ranking, visibility, or trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Local after confirming your email.",
      button: "Create Local account",
      signInLabel: "Already have a Local account?",
    };
  }

  if (surface === "corporate") {
    return {
      eyebrow: "Corporate account access",
      title: "Create your Mishava Corporate account.",
      body:
        "Use this account for institutional review tools when available. Evidence, supplier transparency, and audit context stay separate from payment.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Corporate after confirming your email.",
      button: "Create Corporate account",
      signInLabel: "Already have a Corporate account?",
    };
  }

  if (surface === "admin") {
    return {
      eyebrow: "Internal account access",
      title: "Create your Mishava internal account.",
      body:
        "Use this account only for approved Mishava internal tools. Admin access still requires separate authorization.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to your internal Mishava tools after confirming your email.",
      button: "Create internal account",
      signInLabel: "Already approved? Sign in",
    };
  }

  if (surface === "support") {
    return {
      eyebrow: "Support account access",
      title: "Create your Mishava Support account.",
      body:
        "Use this account for support-related workflows when account access is needed. Support access does not change trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Support after confirming your email.",
      button: "Create Support account",
      signInLabel: "Already have a Support account?",
    };
  }

  if (surface === "trust") {
    return {
      eyebrow: "Trust account access",
      title: "Create your Mishava Trust account.",
      body:
        "Use this account for saved Mishava tools while trust, methodology, legal, and transparency pages remain publicly readable.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Mishava Trust after confirming your email.",
      button: "Create Trust account",
      signInLabel: "Already have a Mishava account?",
    };
  }

  if (surface === "gov") {
    return {
      eyebrow: "Government account access",
      title: "Create your Mishava Government account.",
      body:
        "Use this account only for future public-sector workflows when they are ready. Mishava does not claim government authorization or compliance certification.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Government after confirming your email.",
      button: "Create Government account",
      signInLabel: "Already have a Government account?",
    };
  }

  if (nextPath.startsWith("/admin")) {
    return {
      eyebrow: "Internal account access",
      title: "Create your Mishava internal account.",
      body:
        "Use this account only for approved Mishava internal tools. Admin access still requires separate authorization.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to your internal Mishava tools after confirming your email.",
      button: "Create internal account",
      signInLabel: "Already approved? Sign in",
    };
  }

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

  if (nextPath.startsWith("/business")) {
    return {
      eyebrow: "Business account access",
      title: "Create your Mishava Business account.",
      body:
        "Use this account for business profile tools and future catalog workflows. Payment never changes trust outcomes, ranking, verification, or credibility labels.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Business after confirming your email.",
      button: "Create Business account",
      signInLabel: "Already have a Business account?",
    };
  }

  if (nextPath.startsWith("/local")) {
    return {
      eyebrow: "Local account access",
      title: "Create your Mishava Local account.",
      body:
        "Use this account for local profile tools when they become available. Mishava does not sell ranking, visibility, or trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Local after confirming your email.",
      button: "Create Local account",
      signInLabel: "Already have a Local account?",
    };
  }

  if (nextPath.startsWith("/corporate")) {
    return {
      eyebrow: "Corporate account access",
      title: "Create your Mishava Corporate account.",
      body:
        "Use this account for institutional review tools when available. Evidence, supplier transparency, and audit context stay separate from payment.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Corporate after confirming your email.",
      button: "Create Corporate account",
      signInLabel: "Already have a Corporate account?",
    };
  }

  if (nextPath.startsWith("/gov")) {
    return {
      eyebrow: "Government account access",
      title: "Create your Mishava Government account.",
      body:
        "Use this account only for future public-sector workflows when they are ready. Mishava does not claim government authorization or compliance certification.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Government after confirming your email.",
      button: "Create Government account",
      signInLabel: "Already have a Government account?",
    };
  }

  if (nextPath.startsWith("/support")) {
    return {
      eyebrow: "Support account access",
      title: "Create your Mishava Support account.",
      body:
        "Use this account for support-related workflows when account access is needed. Support access does not change trust outcomes.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Support after confirming your email.",
      button: "Create Support account",
      signInLabel: "Already have a Support account?",
    };
  }

  if (nextPath.startsWith("/methodology") || nextPath.startsWith("/legal")) {
    return {
      eyebrow: "Trust account access",
      title: "Create your Mishava Trust account.",
      body:
        "Use this account for saved Mishava tools while trust, methodology, legal, and transparency pages remain publicly readable.",
      message:
        "Supabase Auth powers this foundation. Email confirmation behavior depends on the project dashboard settings. If confirmation is required, return to Mishava Trust after confirming your email.",
      button: "Create Trust account",
      signInLabel: "Already have a Mishava account?",
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
  searchParams: Promise<{ error?: string; next?: string; surface?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/shopping";
  const signUpSurface =
    safeSignUpSurface(params.surface) ??
    (nextPath === "/" ||
    nextPath.startsWith("/shopping") ||
    nextPath.startsWith("/app/shopping-priorities")
      ? "shopping"
      : null);
  const signUpContext = getSignUpContext(nextPath, signUpSurface);

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
          {signUpSurface ? (
            <input name="surface" type="hidden" value={signUpSurface} />
          ) : null}
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
            <SignInModalButton
              className="link-button"
              nextPath={nextPath}
              surface={signUpSurface ?? undefined}
            >
              {signUpContext.signInLabel}
            </SignInModalButton>
          </div>
        </form>
      </section>
    </>
  );
}
