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
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
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
            <Link className="button" href="/auth/sign-in">
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="main" id="main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>Clear evidence, fair discovery, no paid trust advantage.</strong>
            <p>Payment unlocks tools and capacity, never trust outcomes.</p>
          </div>
          <nav aria-label="Footer legal and support links" className="footer-links">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/accessibility">Accessibility</Link>
            <Link href="/legal/security">Security</Link>
            <Link href="/legal/corrections">Corrections</Link>
            <Link href="/support">Support</Link>
            <Link href="/legal/no-paid-trust-outcomes">
              No Paid Trust Outcomes
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
