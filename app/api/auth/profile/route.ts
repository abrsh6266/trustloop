import { NextResponse } from "next/server";

import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireAuthenticatedUser();
    const profile = await ensureUserProfile(user);

    return NextResponse.json({
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        trustScore: profile.trustScore,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
