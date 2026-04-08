"use client";

import { create } from "zustand";

import { DashboardFilter } from "@/features/agreements/types";

interface UiState {
  createAgreementOpen: boolean;
  dashboardFilter: DashboardFilter;
  openCreateAgreement: () => void;
  closeCreateAgreemnt: () => void;
  setDashboardFilter: (filter: DashboardFilter) => void;
}

export const useUiStore = create<UiState>((set) => ({
  createAgreementOpen: false,
  dashboardFilter: "ALL",
  openCreateAgreement: () => set({ createAgreementOpen: true }),
  closeCreateAgreemnt: () => set({ createAgreementOpen: false }),
  setDashboardFilter: (dashboardFilter) => set({ dashboardFilter }),
}));
