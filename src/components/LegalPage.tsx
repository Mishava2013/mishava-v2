import { PageHeader } from "@/components/PageHeader";
import type { LegalPageContent } from "@/lib/legal-pages";

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.title}>
        {content.intro}
      </PageHeader>

      <section className="section legal-page" aria-labelledby="baseline-status">
        <div className="notice" id="baseline-status" role="status">
          {content.statusNote}
        </div>

        <div className="legal-section-list">
          {content.sections.map((section) => (
            <article className="evidence-panel legal-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
