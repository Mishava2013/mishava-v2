import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function TermsPage() {
  return <LegalPage content={legalPages.terms} />;
}
