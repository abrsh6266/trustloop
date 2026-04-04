"use client";

import { create } from "zustand";

import type { DashboardFilter } from "@/features/agreements/types";

interface UiState {
  createAgreementOpen: boolean;
  dashboardFilter: DashboardFilter;
  openCreateAgreement: () => void;
  closeCreateAgreement: () => void;
  setDashboardFilter: (filter: DashboardFilter) => void;
}

export const useUiStore = create<UiState>((set) => ({
  createAgreementOpen: false,
  dashboardFilter: "ALL",
  openCreateAgreement: () => set({ createAgreementOpen: true }),
  closeCreateAgreement: () => set({ createAgreementOpen: false }),
  setDashboardFilter: (dashboardFilter) => set({ dashboardFilter }),
}));
