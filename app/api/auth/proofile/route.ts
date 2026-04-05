import { ensureUserProfile, requireAuthenticatedUser } from "@/lib/auth";
import { handleRouteError } from "@/lib/http";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireAuthenticatedUser();
    const profile = await ensureUserProfile(user);
    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        trustScore: profile.trustScore,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
