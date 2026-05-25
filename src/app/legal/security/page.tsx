import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function SecurityPage() {
  return <LegalPage content={legalPages.security} />;
}
