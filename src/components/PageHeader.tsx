import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="page-title">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}
