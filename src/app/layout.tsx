import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mishava V2.0",
  description:
    "Evidence-backed trust infrastructure for discovery, NGO reporting, business profiles, and transparent shopping decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
