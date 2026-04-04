"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AgreementDetailDto,
  AgreementsResponseDto,
  CreateAgreementPayload,
} from "@/features/agreements/types";
import { apiClient } from "@/services/api-client";
import type { DashboardFilter, UpdateObligationPayload, UserSnippet } from "@/features/agreements/types";

export const agreementQueryKeys = {
  all: ["agreements"] as const,
  list: (filter: DashboardFilter) => ["agreements", filter] as const,
  detail: (agreementId: string) => ["agreements", "detail", agreementId] as const,
  searchUsers: (query: string) => ["users", "search", query] as const,
};

export function useAgreements(filter: DashboardFilter) {
  return useQuery({
    queryKey: agreementQueryKeys.list(filter),
    queryFn: async () => {
      const { data } = await apiClient.get<AgreementsResponseDto>("/agreements", {
        params: {
          status: filter,
        },
      });

      return data;
    },
  });
}

export function useAgreementDetail(agreementId: string) {
  return useQuery({
    queryKey: agreementQueryKeys.detail(agreementId),
    queryFn: async () => {
      const { data } = await apiClient.get<{ agreement: AgreementDetailDto }>(
        `/agreements/${agreementId}`,
      );

      return data.agreement;
    },
    enabled: Boolean(agreementId),
  });
}

export function useCreateAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAgreementPayload) => {
      const { data } = await apiClient.post<{ agreement: AgreementDetailDto }>(
        "/agreements",
        payload,
      );

      return data.agreement;
    },
    onSuccess: async (agreement) => {
      await queryClient.invalidateQueries({
        queryKey: agreementQueryKeys.all,
      });

      queryClient.setQueryData(
        agreementQueryKeys.detail(agreement.id),
        agreement,
      );
    },
  });
}

export function useUpdateObligation(agreementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { obligationId: string; payload: UpdateObligationPayload }) => {
      const { data } = await apiClient.patch<{ agreement: AgreementDetailDto }>(
        `/agreements/${agreementId}/obligations/${input.obligationId}`,
        input.payload,
      );

      return data.agreement;
    },
    onSuccess: async (agreement) => {
      queryClient.setQueryData(agreementQueryKeys.detail(agreementId), agreement);
      await queryClient.invalidateQueries({
        queryKey: agreementQueryKeys.all,
      });
    },
  });
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: agreementQueryKeys.searchUsers(query),
    queryFn: async () => {
      const { data } = await apiClient.get<{ users: UserSnippet[] }>("/users/search", {
        params: { q: query },
      });

      return data.users;
    },
    enabled: query.trim().length > 1,
    staleTime: 45_000,
  });
}
