import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const workspaceLinks = [
  { href: "/app/shopping-priorities", label: "Shopping priorities" },
  { href: "/app/saved", label: "Saved items" },
  { href: "/app/watchlist", label: "Watchlist" },
  { href: "/app/billing", label: "Billing" },
];

export default function AppWorkspacePage() {
  return (
    <>
      <PageHeader eyebrow="Signed-in workspace" title="Personal trust controls.">
        Consumers can shop without an account, but signing in unlocks saved
        priorities, saved products, watchlists, and Plus features without
        changing public ranking rules.
      </PageHeader>
      <div className="card-grid">
        {workspaceLinks.map((link) => (
          <Link className="card" href={link.href} key={link.href}>
            <h3>{link.label}</h3>
            <p>Release 1 route foundation for this workspace area.</p>
          </Link>
        ))}
      </div>
    </>
  );
}

