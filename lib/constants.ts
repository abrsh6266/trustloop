import type {
  AgreementStatus,
  DashboardFilter,
  ObligationStatus,
} from "@/features/agreements/types";

export const APP_NAME = "TrustLoop";

export const AGREEMENT_FILTERS: DashboardFilter[] = [
  "ALL",
  "PENDING",
  "COMPLETED",
  "FAILED",
];

export const TRUST_SCORE_DELTA: Record<ObligationStatus, number> = {
  PENDING: 0,
  DONE: 5,
  FAILED: -10,
};

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export const OBLIGATION_STATUS_LABELS: Record<ObligationStatus, string> = {
  PENDING: "Pending",
  DONE: "Done",
  FAILED: "Failed",
};
