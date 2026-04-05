import { NextRequest, NextResponse } from "next/server";

import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";
import { searchUsers } from "@/services/user-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    await ensureUserProfile(user);
    const query = request.nextUrl.searchParams.get("q") ?? "";
    const users = await searchUsers(query, user.id);

    return NextResponse.json({ users });
  } catch (error) {
    return handleRouteError(error);
  }
}
