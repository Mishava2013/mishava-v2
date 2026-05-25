import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function SupportPage() {
  return <LegalPage content={legalPages.support} />;
}
