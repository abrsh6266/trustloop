import { AppError } from "./http";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabase/server";
import prisma from "./prisma";

export async function requestAuthenticatedUser() {
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
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
