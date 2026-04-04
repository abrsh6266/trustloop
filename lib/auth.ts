import type { User as SupabaseUser } from "@supabase/supabase-js";

import prisma from "@/lib/prisma";
import { AppError } from "@/lib/http";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError(401, "You need to be signed in to continue.");
  }

  return user;
}

export async function ensureUserProfile(user: SupabaseUser) {
  return prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email ?? "",
      name:
        (typeof user.user_metadata?.name === "string" &&
          user.user_metadata.name.trim()) ||
        null,
    },
    create: {
      id: user.id,
      email: user.email ?? "",
      name:
        (typeof user.user_metadata?.name === "string" &&
          user.user_metadata.name.trim()) ||
        null,
    },
  });
}
