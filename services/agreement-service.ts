import {
  AgreementDetailDto,
  AgreementsResponseDto,
  AgreementStatus,
  AgreementSummaryDto,
  DashboardFilter,
  ObligationStatus,
  ParticipantRole,
  UserSnippet,
} from "@/features/agreements/types";
import prisma from "@/lib/prisma";

function serializeUser(user: {
  id: string;
  name: string | null;
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
      name: string | null;
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
      user: serializeUser(participant.user),
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

export async function listAgreementsForUser(
  userId: string,
  filter: DashboardFilter = "ALL",
): Promise<AgreementsResponseDto> {
  const [viewer, agreements] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        trustScore: true,
      },
    }),
    prisma.agreement.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                trustScore: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        obligations: {
          select: {
            status: true,
          },
        },
      },
      orderBy: [
        { dueDate: "asc" },
        {
          createdAt: "desc",
        },
      ],
    }),
  ]);

  const summaries = agreements.map(serializeAgreementSummary);
  const filteredAgreemnts =
    filter === "ALL"
      ? summaries
      : summaries.filter((agreement) => agreement.status === filter);
  const completedCount = summaries.filter(
    (agreement) => agreement.status === "COMPLETED",
  ).length;
  const failedCount = summaries.filter(
    (agreement) => agreement.status === "FAILED",
  ).length;
  const activeCount = summaries.filter(
    (agreement) => agreement.status === "PENDING",
  ).length;

  const totalObligations = summaries.reduce(
    (acc, agreement) => acc + agreement.obligationsCount,
    0,
  );

  const completedObligations = summaries.reduce(
    (acc, agreement) => acc + agreement.completedObligationsCount,
    0,
  );

  return {
    agreements: filteredAgreemnts,
    stats: {
      activeCount,
      completedCount,
      failedCount,
      totalCount: summaries.length,
      completionRate: totalObligations
        ? Math.round((completedObligations / totalObligations) * 100)
        : 0,
      viewerTrustScore: Number((viewer?.trustScore ?? 100).toFixed(1)),
    },
  };
}

export async function getAgreementById(
  agreementId: string,
  userId: string,
): Promise<AgreementDetailDto> {
  const membership = await prisma.agreementParticipant.findUnique({
    where: {
      agreementId_userId: {
        agreementId,
        userId,
      },
    },
  });
  if (!membership) {
    throw new Error("Agreement not found");
  }

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          trustScore: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              trustScore: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      obligations: {
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              trustScore: true,
            },
          },
        },
        orderBy: [
          {
            status: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
      activityLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              trustScore: true,
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
      },
    },
  });

  if (!agreement) {
    throw new Error("Agreement not found");
  }

  const summary = serializeAgreementSummary(agreement);

  return {
    ...summary,
    creator: serializeUser(agreement.createdBy),
    obligations: agreement.obligations.map((obligation) => ({
      id: obligation.id,
      description: obligation.description,
      status: obligation.status,
      createdAt: obligation.createdAt.toISOString(),
      updatedAt: obligation.updatedAt.toISOString(),
      assignedTo: serializeUser(obligation.assignedTo),
    })),
    activity: agreement.activityLogs.map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp.toISOString(),
      user: serializeUser(log.user),
    })),
  };
}
