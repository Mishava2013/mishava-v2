import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
