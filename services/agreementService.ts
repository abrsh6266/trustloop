import {
  AgreementStatus,
  AgreementSummaryDto,
  ObligationStatus,
  ParticipantRole,
  UserSnippet,
} from "@/features/agreements/types";
import prisma from "@/lib/prisma";

function serialNumber(user: {
  id: string;
  name: string;
  email: string;
  trustScore: number;
}): UserSnippet {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    trustScore: Number(user.trustScore.toFixed(1)),
  };
}

function serializeAgreementSummary(agreement: {
  id: string;
  title: string;
  description: string;
  status: AgreementStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  participants: Array<{
    id: string;
    role: ParticipantRole;
    user: {
      id: string;
      name: string;
      email: string;
      trustScore: number;
    };
  }>;
  obligations: Array<{
    status: ObligationStatus;
  }>;
}): AgreementSummaryDto {
  const completedObligationsCount = agreement.obligations.filter(
    (item) => item.status === "DONE",
  ).length;
  const failedObligationsCount = agreement.obligations.filter(
    (item) => item.status === "FAILED",
  ).length;
  return {
    id: agreement.id,
    title: agreement.title,
    description: agreement.description,
    status: agreement.status,
    dueDate: agreement.dueDate.toISOString(),
    createdAt: agreement.createdAt.toISOString(),
    updatedAt: agreement.updatedAt.toISOString(),
    participants: agreement.participants.map((participant) => ({
      id: participant.id,
      role: participant.role,
      user: serialNumber(participant.user),
    })),
    obligationsCount: agreement.obligations.length,
    completedObligationsCount,
    failedObligationsCount,
  };
}

export function computeAgreementStatus(
  statuses: ObligationStatus[],
): AgreementStatus {
  if (statuses.some((status) => status == "FAILED")) {
    return "FAILED";
  }

  if (statuses.length > 0 && statuses.every((status) => status === "DONE")) {
    return "COMPLETED";
  }

  return "PENDING";
}

function unqueValues(values: string[]) {
  return Array.from(new Set(values));
}
