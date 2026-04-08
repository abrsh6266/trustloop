"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAgreementDetail } from "../api";

export function AgreeementDetailView({ agreementId }: { agreementId: string }) {
  const { user } = useAuth();
  const agreementQuery = useAgreementDetail(agreementId);
}
