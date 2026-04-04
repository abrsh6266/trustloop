import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server components can be read-only for cookies.
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Server components can be read-only for cookies.
        }
      },
    },
  });
}
