import {
  ActivityAction,
  AgreementStatus,
  ObligationStatus,
  ParticipantRole,
} from "@prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import type {
  AgreementDetailDto,
  AgreementSummaryDto,
  AgreementsResponseDto,
  CreateAgreementPayload,
  DashboardFilter,
  UserSnippet,
} from "@/features/agreements/types";
import { ensureUserProfile } from "@/lib/auth";
import { TRUST_SCORE_DELTA } from "@/lib/constants";
import { AppError } from "@/lib/http";
import prisma from "@/lib/prisma";
import { getDisplayName } from "@/lib/utils";

function serializeUser(user: {
  id: string;
  email: string;
  name: string | null;
  trustScore: number;
}): UserSnippet {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
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
      email: string;
      name: string | null;
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

function computeAgreementStatus(statuses: ObligationStatus[]): AgreementStatus {
  if (statuses.some((status) => status === "FAILED")) {
    return "FAILED";
  }

  if (statuses.length > 0 && statuses.every((status) => status === "DONE")) {
    return "COMPLETED";
  }

  return "PENDING";
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

export async function listAgreementsForUser(
  userId: string,
  filter: DashboardFilter = "ALL",
): Promise<AgreementsResponseDto> {
  const [viewer, agreements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { trustScore: true },
    }),
    prisma.agreement.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
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
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const summaries = agreements.map(serializeAgreementSummary);
  const filteredAgreements =
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
    (total, agreement) => total + agreement.obligationsCount,
    0,
  );
  const completedObligations = summaries.reduce(
    (total, agreement) => total + agreement.completedObligationsCount,
    0,
  );

  return {
    agreements: filteredAgreements,
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
    throw new AppError(404, "Agreement not found.");
  }

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: {
      createdBy: {
        select: {
          id: true,
          email: true,
          name: true,
          trustScore: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
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
              email: true,
              name: true,
              trustScore: true,
            },
          },
        },
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      },
      activityLogs: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
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
    throw new AppError(404, "Agreement not found.");
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

export async function createAgreement(
  authUser: SupabaseUser,
  payload: CreateAgreementPayload,
) {
  await ensureUserProfile(authUser);

  const title = payload.title.trim();
  const description = payload.description.trim();
  const obligations = payload.obligations
    .map((obligation) => ({
      assignedToId: obligation.assignedToId,
      description: obligation.description.trim(),
    }))
    .filter((obligation) => obligation.description);
  const dueDate = new Date(payload.dueDate);

  if (!title || !description) {
    throw new AppError(400, "Title and description are required.");
  }

  if (Number.isNaN(dueDate.getTime())) {
    throw new AppError(400, "A valid due date is required.");
  }

  if (!obligations.length) {
    throw new AppError(
      400,
      "Add at least one obligation to create an agreement.",
    );
  }

  const participantIds = uniqueValues([authUser.id, ...payload.participantIds]);

  if (
    obligations.some(
      (obligation) => !participantIds.includes(obligation.assignedToId),
    )
  ) {
    throw new AppError(
      400,
      "Every obligation must be assigned to someone participating in the agreement.",
    );
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: participantIds,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      trustScore: true,
    },
  });

  if (users.length !== participantIds.length) {
    throw new AppError(
      400,
      "One or more selected participants do not have a TrustLoop account yet.",
    );
  }

  const agreementId = await prisma.$transaction(async (tx) => {
    const agreement = await tx.agreement.create({
      data: {
        title,
        description,
        dueDate,
        createdById: authUser.id,
      },
    });

    await tx.agreementParticipant.createMany({
      data: participantIds.map((participantId) => ({
        agreementId: agreement.id,
        userId: participantId,
        role:
          participantId === authUser.id
            ? ParticipantRole.CREATOR
            : ParticipantRole.PARTICIPANT,
      })),
    });

    await tx.obligation.createMany({
      data: obligations.map((obligation) => ({
        agreementId: agreement.id,
        assignedToId: obligation.assignedToId,
        description: obligation.description,
      })),
    });

    await tx.activityLog.createMany({
      data: [
        {
          agreementId: agreement.id,
          action: ActivityAction.CREATED,
          userId: authUser.id,
          details: `Created "${title}" with ${obligations.length} obligation${obligations.length === 1 ? "" : "s"}.`,
          timestamp: new Date(),
        },
        {
          agreementId: agreement.id,
          action: ActivityAction.UPDATED,
          userId: authUser.id,
          details: `Added ${participantIds.length} participant${participantIds.length === 1 ? "" : "s"} to the agreement.`,
          timestamp: new Date(),
        },
      ],
    });

    return agreement.id;
  });

  return getAgreementById(agreementId, authUser.id);
}

export async function updateObligationStatus(input: {
  agreementId: string;
  obligationId: string;
  nextStatus: Exclude<ObligationStatus, "PENDING">;
  actorUserId: string;
}) {
  const { agreementId, obligationId, nextStatus, actorUserId } = input;

  await prisma.$transaction(async (tx) => {
    const [membership, obligation, actor] = await Promise.all([
      tx.agreementParticipant.findUnique({
        where: {
          agreementId_userId: {
            agreementId,
            userId: actorUserId,
          },
        },
      }),
      tx.obligation.findFirst({
        where: {
          id: obligationId,
          agreementId,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              email: true,
              name: true,
              trustScore: true,
            },
          },
          agreement: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      tx.user.findUnique({
        where: { id: actorUserId },
        select: {
          id: true,
          email: true,
          name: true,
          trustScore: true,
        },
      }),
    ]);

    if (!membership || !obligation || !actor) {
      throw new AppError(404, "The obligation could not be found.");
    }

    if (
      obligation.assignedToId !== actorUserId &&
      membership.role !== ParticipantRole.CREATOR
    ) {
      throw new AppError(
        403,
        "Only the assignee or the agreement creator can update this obligation.",
      );
    }

    const previousStatus = obligation.status;
    const trustDelta =
      TRUST_SCORE_DELTA[nextStatus] - TRUST_SCORE_DELTA[previousStatus];

    await tx.obligation.update({
      where: {
        id: obligationId,
      },
      data: {
        status: nextStatus,
      },
    });

    if (trustDelta !== 0) {
      await tx.user.update({
        where: {
          id: obligation.assignedToId,
        },
        data: {
          trustScore: Math.max(
            0,
            obligation.assignedTo.trustScore + trustDelta,
          ),
        },
      });
    }

    const obligationStatuses = await tx.obligation.findMany({
      where: { agreementId },
      select: {
        status: true,
      },
    });

    const nextAgreementStatus = computeAgreementStatus(
      obligationStatuses.map((item) => item.status),
    );

    if (nextAgreementStatus !== obligation.agreement.status) {
      await tx.agreement.update({
        where: {
          id: agreementId,
        },
        data: {
          status: nextAgreementStatus,
        },
      });
    }

    const actorName = getDisplayName(actor.name, actor.email);

    await tx.activityLog.create({
      data: {
        agreementId,
        userId: actorUserId,
        action:
          nextStatus === "DONE"
            ? ActivityAction.COMPLETED
            : ActivityAction.FAILED,
        details: `${actorName} marked "${obligation.description}" as ${nextStatus === "DONE" ? "done" : "failed"}.`,
      },
    });

    if (nextAgreementStatus !== obligation.agreement.status) {
      await tx.activityLog.create({
        data: {
          agreementId,
          userId: actorUserId,
          action:
            nextAgreementStatus === "FAILED"
              ? ActivityAction.FAILED
              : nextAgreementStatus === "COMPLETED"
                ? ActivityAction.COMPLETED
                : ActivityAction.UPDATED,
          details: `Agreement status changed to ${nextAgreementStatus.toLowerCase()}.`,
        },
      });
    }
  });

  return getAgreementById(agreementId, actorUserId);
}
