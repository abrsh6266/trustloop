"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { agreementQueryKeys } from "@/features/agreements/api";
import { useAuth } from "@/hooks/use-auth";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function useDashboardRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    const refresh = () => {
      void queryClient.invalidateQueries({
        queryKey: agreementQueryKeys.all,
      });
    };

    const channel = supabase
      .channel(`dashboard-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agreements" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "obligations" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agreement_participants" },
        refresh,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, user]);
}
