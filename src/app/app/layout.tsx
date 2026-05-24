import type { ReactNode } from "react";
import { requireAuthenticatedSession } from "@/lib/auth-server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedSession();
  return children;
}

