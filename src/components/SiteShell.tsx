import Link from "next/link";
import type { ReactNode } from "react";
import { MishavaMark } from "./MishavaMark";

const navItems = [
  { href: "/shopping", label: "Shopping" },
  { href: "/ngo", label: "NGO" },
  { href: "/business", label: "Business" },
  { href: "/local", label: "Local" },
  { href: "/trade", label: "Trade / Network" },
  { href: "/audit", label: "Audit / Verification" },
  { href: "/about", label: "About" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/">
            <MishavaMark />
            <span className="brand-word">Mishava</span>
          </Link>
          <nav aria-label="Primary navigation" className="nav">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="button" href="/app">
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <span>Clear evidence, fair discovery, no paid trust advantage.</span>
          <span>
            <Link href="/ngo">NGO access</Link> ·{" "}
            <Link href="/business">Business access</Link> · Payment unlocks
            tools, never trust advantage.
          </span>
        </div>
      </footer>
    </div>
  );
}
