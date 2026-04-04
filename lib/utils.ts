import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict, isPast } from "date-fns";

import {
  AGREEMENT_STATUS_LABELS,
  OBLIGATION_STATUS_LABELS,
} from "@/lib/constants";
import type {
  AgreementStatus,
  DashboardFilter,
  ObligationStatus,
} from "@/features/agreements/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDateLabel(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatDateTimeLabel(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(value: string | Date) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function getStatusLabel(status: AgreementStatus | ObligationStatus) {
  return (
    AGREEMENT_STATUS_LABELS[status as AgreementStatus] ??
    OBLIGATION_STATUS_LABELS[status as ObligationStatus] ??
    status
  );
}

export function getAgreementStatusTone(status: AgreementStatus) {
  if (status === "COMPLETED") {
    return "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20";
  }

  if (status === "FAILED") {
    return "bg-rose-500/15 text-rose-700 ring-rose-500/20";
  }

  return "bg-amber-500/15 text-amber-700 ring-amber-500/20";
}

export function getObligationStatusTone(status: ObligationStatus) {
  if (status === "DONE") {
    return "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20";
  }

  if (status === "FAILED") {
    return "bg-rose-500/15 text-rose-700 ring-rose-500/20";
  }

  return "bg-amber-500/15 text-amber-700 ring-amber-500/20";
}

export function getTrustScoreTone(score: number) {
  if (score >= 110) {
    return "text-emerald-700";
  }

  if (score >= 85) {
    return "text-slate-700";
  }

  return "text-rose-700";
}

export function getTrustScoreFill(score: number) {
  if (score >= 110) {
    return "bg-emerald-500";
  }

  if (score >= 85) {
    return "bg-sky-500";
  }

  return "bg-rose-500";
}

export function getInitials(name?: string | null, fallback?: string | null) {
  const value = name || fallback || "TL";
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((piece) => piece[0]?.toUpperCase() ?? "")
    .join("");
}

export function getProgressValue(completed: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export function getDueDateAccent(date: string) {
  if (isPast(new Date(date))) {
    return "text-rose-600";
  }

  return "text-slate-500";
}

export function isDashboardFilter(value?: string): value is DashboardFilter {
  return (
    value === "ALL" ||
    value === "PENDING" ||
    value === "COMPLETED" ||
    value === "FAILED"
  );
}

export function getDisplayName(name?: string | null, email?: string | null) {
  return name?.trim() || email?.split("@")[0] || "Unknown user";
}
