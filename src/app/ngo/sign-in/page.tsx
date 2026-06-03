import { redirect } from "next/navigation";

export default function NgoSignInPage() {
  redirect("/ngo?signIn=1&next=/ngo");
}
