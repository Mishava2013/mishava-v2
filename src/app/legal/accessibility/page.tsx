import { LegalPage } from "@/components/LegalPage";
import { legalPages } from "@/lib/legal-pages";

export default function AccessibilityPage() {
  return <LegalPage content={legalPages.accessibility} />;
}
