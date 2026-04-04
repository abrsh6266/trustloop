"use client";

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { hasSupabaseEnv } from "@/lib/env";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  name: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (payload: SignInPayload) => Promise<{ error: string | null }>;
  signUp: (
    payload: SignUpPayload,
  ) => Promise<{ error: string | null; needsEmailVerification: boolean }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

async function syncProfile() {
  await fetch("/api/auth/profile", {
    method: "POST",
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !hasSupabaseEnv) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }: { data: { session: Session | null } }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);

      if (data.session) {
        await syncProfile();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);

      if (nextSession) {
        await syncProfile();
      }

      router.refresh();
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading,
      async signIn(payload) {
        if (!supabase) {
          return {
            error: "Supabase environment variables are not configured.",
          };
        }

        const { error } = await supabase.auth.signInWithPassword(payload);

        if (error) {
          return {
            error: error.message,
          };
        }

        await syncProfile();

        return {
          error: null,
        };
      },
      async signUp(payload) {
        if (!supabase) {
          return {
            error: "Supabase environment variables are not configured.",
            needsEmailVerification: false,
          };
        }

        const { data, error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              name: payload.name,
            },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined,
          },
        });

        if (error) {
          return {
            error: error.message,
            needsEmailVerification: false,
          };
        }

        if (data.session) {
          await syncProfile();
        }

        return {
          error: null,
          needsEmailVerification: !data.session,
        };
      },
      async signOut() {
        if (!supabase) {
          return;
        }

        await supabase.auth.signOut();
      },
    }),
    [isLoading, session, supabase, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
