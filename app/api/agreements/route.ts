import { DashboardFilter } from "@/features/agreements/types";
import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";
import { isDashboardFilter } from "@/lib/utils";
import { listAgreementsForUser } from "@/services/agreement-service";
import { NextRequest, NextResponse } from "next/server";

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
