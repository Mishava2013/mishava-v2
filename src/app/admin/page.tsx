import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const adminLinks = [
  { href: "/admin/research", label: "Research and source review" },
  { href: "/admin/support", label: "NGO support operations" },
  { href: "/admin/pricing", label: "Pricing configuration" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/scoring", label: "Scoring governance" },
  { href: "/admin/users", label: "Users and roles" },
];

export default function AdminPage() {
  return (
    <>
      <PageHeader eyebrow="Admin" title="Internal controls for a transparent system.">
        Admin work is separated by role, logged by default, and designed to
        prevent bribery, silent overrides, and methodology changes without records.
      </PageHeader>
      <div className="card-grid">
        {adminLinks.map((link) => (
          <Link className="card" href={link.href} key={link.href}>
            <h3>{link.label}</h3>
            <p>Release 1 admin route foundation.</p>
          </Link>
        ))}
      </div>
    </>
  );
}
