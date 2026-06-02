import { redirect } from "next/navigation";

function safeQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const nextPath = safeQueryValue(params.next);
  const error = safeQueryValue(params.error);
  const notice = safeQueryValue(params.notice);
  const auth = safeQueryValue(params.auth);
  const target = new URLSearchParams({ signIn: "1" });

  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    target.set("next", nextPath);
  }

  if (error) {
    target.set("error", error);
  }

  if (notice) {
    target.set("notice", notice);
  }

  if (auth) {
    target.set("auth", auth);
  }

  redirect(`/?${target.toString()}`);
}
