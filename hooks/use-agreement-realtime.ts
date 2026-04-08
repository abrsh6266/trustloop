"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { agreementQueryKeys } from "@/features/agreements/api";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function useAgreementRealtime(agreementId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!agreementId) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      return;
    }

    const refresh = () => {
      void queryClient.invalidateQueries({
        queryKey: agreementQueryKeys.detail(agreementId),
      });
      void queryClient.invalidateQueries({
        queryKey: agreementQueryKeys.all,
      });
    };

    const channel = supabase
      .channel(`agreement-${agreementId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agreements",
          filter: `id=eq.${agreementId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "obligations",
          filter: `agreement_id=eq.${agreementId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activity_logs",
          filter: `agreement_id=eq.${agreementId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "agreement_participants",
          filter: `agreement_id=eq.${agreementId}`,
        },
        refresh,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [agreementId, queryClient]);
}
