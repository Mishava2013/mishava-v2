import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const workspaceLinks = [
  { href: "/app/shopping-priorities", label: "Shopping priorities" },
  { href: "/app/saved", label: "Saved items" },
  { href: "/app/watchlist", label: "Watchlist" },
  { href: "/app/billing", label: "Billing" },
];

export default async function AppWorkspacePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const orgNotice = Array.isArray(params.org) ? params.org[0] : params.org;

  return (
    <>
      <PageHeader eyebrow="Signed-in workspace" title="Personal trust controls.">
        Consumers can shop without an account, but signing in unlocks saved
        priorities, saved products, watchlists, and Plus features without
        changing public ranking rules.
      </PageHeader>
      {orgNotice === "invalid" ? (
        <div className="notice" role="status">
          Your previous organization selection is no longer available for this
          account. Choose an active organization from the workspace selector.
        </div>
      ) : null}
      {orgNotice === "select" ? (
        <div className="notice" role="status">
          Choose an active organization before opening private organization
          records.
        </div>
      ) : null}
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
