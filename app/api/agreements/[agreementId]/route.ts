import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";
import { getAgreementById } from "@/services/agreement-service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    agreementId: string;
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const user = await requireAuthenticatedUser();
    await ensureUserProfile(user);
    const agreement = await getAgreementById(params.agreementId, user.id);

    return NextResponse.json(agreement);
  } catch (error) {
    return handleRouteError(error);
  }
}
