import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function CorrectionsPage() {
  return <LegalPage content={legalPages.corrections} />;
}
