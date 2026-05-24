import { PageHeader } from "@/components/PageHeader";
import { ScoreExplainer } from "@/components/ScoreExplainer";

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <PageHeader eyebrow="Business profile" title={slug.replaceAll("-", " ")}>
        Business profiles will show identity, participation mode, small or local
        indicators, verification status, evidence burden level, catalog presence,
        links, inquiry options, and trust pathway progress.
      </PageHeader>
      <ScoreExplainer />
    </>
  );
}

