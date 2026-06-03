import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("all public sign-in entry points use the shared popup and preserve page context", () => {
  const shell = read("src/components/SiteShell.tsx");
  const modal = read("src/components/SignInModal.tsx");
  const signInPage = read("src/app/auth/sign-in/page.tsx");
  const ngoSignIn = read("src/app/ngo/sign-in/page.tsx");
  const middleware = read("middleware.ts");

  assert.match(shell, /<SignInModalButton \/>/);
  assert.doesNotMatch(shell, /href="\/auth\/sign-in"|href='\/auth\/sign-in'/);
  assert.match(modal, /signInEventName = "mishava:open-sign-in"/);
  assert.match(modal, /stripAuthParams/);
  assert.match(modal, /getCurrentSurfaceRoot/);
  assert.match(modal, /safeAuthSurface/);
  assert.match(modal, /inferAuthSurface/);
  assert.match(modal, /currentSurface \?\?/);
  assert.match(modal, /shopping: "\/shopping"/);
  assert.match(modal, /ngo: "\/ngo"/);
  assert.match(modal, /business: "\/business"/);
  assert.match(modal, /local: "\/local"/);
  assert.match(modal, /corporate: "\/corporate"/);
  assert.match(modal, /gov: "\/gov"/);
  assert.match(modal, /target\.set\("surface", safeSurface\)/);
  assert.match(modal, /target\.set\("surface", authSurface\)/);
  assert.doesNotMatch(modal, /queryWantsSignIn \? "\/app"/);
  assert.match(signInPage, /redirect\(`\/\?\$\{target\.toString\(\)\}`\)/);
  assert.doesNotMatch(signInPage, /<form|PageHeader|auth-card|NGO/);
  assert.match(ngoSignIn, /redirect\("\/ngo\?signIn=1&next=\/ngo"\)/);
  assert.doesNotMatch(ngoSignIn, /Mishava for NGOs|Approved access|Create NGO account/);
  assert.match(middleware, /url\.pathname = "\/"/);
  assert.match(middleware, /url\.searchParams\.set\("next"/);
});

test("sign-up page chooses product-line copy from page path before host or query surface", () => {
  const signUp = read("src/app/auth/sign-up/page.tsx");
  const actions = read("src/app/auth/actions.ts");

  assert.match(signUp, /function getSignUpContext/);
  assert.match(signUp, /safeSignUpSurface/);
  assert.match(signUp, /surfaceFromHost/);
  assert.match(signUp, /defaultNextPathForHost/);
  assert.match(signUp, /surfaceFromNextPath/);
  assert.match(signUp, /headers\(\)/);
  assert.match(signUp, /const host = headerStore\.get\("host"\)/);
  assert.match(signUp, /const defaultNextPath = defaultNextPathForHost\(host\)/);
  assert.match(
    signUp,
    /surfaceFromNextPath\(nextPath\) \?\?\s+surfaceFromHost\(host\) \?\?\s+safeSignUpSurface\(params\.surface\)/,
  );
  assert.match(signUp, /surface === "shopping"/);
  assert.match(signUp, /surface === "ngo"/);
  assert.match(signUp, /Create your free Mishava Shopping account/);
  assert.match(signUp, /Create your Mishava NGO account/);
  assert.match(signUp, /Create your Mishava Business account/);
  assert.match(signUp, /Create your Mishava Local account/);
  assert.match(signUp, /Create your Mishava Corporate account/);
  assert.match(signUp, /Create your Mishava Government account/);
  assert.match(signUp, /Create your Mishava Support account/);
  assert.match(signUp, /Create your Mishava Trust account/);
  assert.match(signUp, /Create your Mishava internal account/);
  assert.match(signUp, /nextPath\.startsWith\("\/ngo"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/business"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/local"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/corporate"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/gov"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/support"\)/);
  assert.match(signUp, /nextPath\.startsWith\("\/methodology"\)/);
  assert.match(signUp, /name="surface"/);
  assert.match(actions, /safeAuthSurface/);
  assert.match(actions, /surfaceQuery/);
  assert.match(actions, /redirect\(nextPath \?\? "\/app"\)/);
  assert.doesNotMatch(actions, /nextPath \?\? "\/ngo\/onboarding/);
});

test("shopping auth routes cannot be poisoned by stale NGO surface context", () => {
  const modal = read("src/components/SignInModal.tsx");
  const signUp = read("src/app/auth/sign-up/page.tsx");
  const authActions = read("src/app/auth/actions.ts");
  const middleware = read("middleware.ts");
  const submitRoute = read("src/app/auth/sign-in/submit/route.ts");
  const shoppingPage = read("src/app/shopping/page.tsx");
  const categoryPage = read("src/app/shopping/categories/[slug]/page.tsx");

  assert.match(modal, /currentSurface \?\?\s+querySurface/);
  assert.match(
    signUp,
    /surfaceFromNextPath\(nextPath\) \?\?\s+surfaceFromHost\(host\) \?\?\s+safeSignUpSurface\(params\.surface\)/,
  );
  assert.match(signUp, /nextPath\.startsWith\("\/app\/shopping-priorities"\)/);
  assert.match(middleware, /surfaceForNextPath/);
  assert.match(middleware, /url\.searchParams\.set\("surface", surface\)/);
  assert.match(submitRoute, /safeAuthSurface/);
  assert.match(submitRoute, /redirectUrl\.searchParams\.set\("surface", surface\)/);
  assert.match(authActions, /const surface = safeAuthSurface\(formData\.get\("surface"\)\)/);
  assert.match(authActions, /surfaceQuery/);
  assert.doesNotMatch(
    shoppingPage + categoryPage,
    /href="\/app\/shopping-priorities"/,
  );
  assert.match(
    shoppingPage + categoryPage,
    /signIn=1&next=%2Fapp%2Fshopping-priorities&surface=shopping/,
  );
});

test("password reset sign-in links preserve the same page context", () => {
  const modal = read("src/components/SignInModal.tsx");
  const reset = read("src/app/auth/reset-password/page.tsx");

  assert.match(modal, /\/auth\/reset-password\?\$\{new URLSearchParams/);
  assert.match(modal, /surface: authSurface/);
  assert.match(reset, /searchParams: Promise<\{ error\?: string; next\?: string \}>/);
  assert.match(reset, /const nextPath =/);
  assert.match(reset, /nextPath=\{nextPath\}/);
  assert.doesNotMatch(reset, /nextPath="\/app"/);
});
