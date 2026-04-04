import { NextRequest, NextResponse } from "next/server";

import type { CreateAgreementPayload, DashboardFilter } from "@/features/agreements/types";
import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";
import { isDashboardFilter } from "@/lib/utils";
import {
  createAgreement,
  listAgreementsForUser,
} from "@/services/agreement-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    await ensureUserProfile(user);

    const filterParam = request.nextUrl.searchParams.get("status");
    const filter: DashboardFilter =
      filterParam && isDashboardFilter(filterParam) ? filterParam : "ALL";
    const data = await listAgreementsForUser(user.id, filter);

    return NextResponse.json(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    const payload = (await request.json()) as CreateAgreementPayload;
    const agreement = await createAgreement(user, payload);

    return NextResponse.json({ agreement }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
