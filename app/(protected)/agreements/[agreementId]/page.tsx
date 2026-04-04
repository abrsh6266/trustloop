import { AgreementDetailView } from "@/features/agreements/components/agreement-detail-view";

interface AgreementPageProps {
  params: {
    agreementId: string;
  };
}

export default function AgreementPage({ params }: AgreementPageProps) {
  return <AgreementDetailView agreementId={params.agreementId} />;
}
