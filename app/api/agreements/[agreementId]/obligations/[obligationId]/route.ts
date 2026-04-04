import { NextRequest, NextResponse } from "next/server";

import type { UpdateObligationPayload } from "@/features/agreements/types";
import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { AppError, handleRouteError } from "@/lib/http";
import { updateObligationStatus } from "@/services/agreement-service";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    agreementId: string;
    obligationId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuthenticatedUser();
    await ensureUserProfile(user);

    const payload = (await request.json()) as UpdateObligationPayload;

    if (payload.status !== "DONE" && payload.status !== "FAILED") {
      throw new AppError(400, "Obligations can only be marked done or failed.");
    }

    const agreement = await updateObligationStatus({
      agreementId: params.agreementId,
      obligationId: params.obligationId,
      actorUserId: user.id,
      nextStatus: payload.status,
    });

    return NextResponse.json({ agreement });
  } catch (error) {
    return handleRouteError(error);
  }
}
