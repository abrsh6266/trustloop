"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus, ShieldCheck, Target, TimerReset, TrendingUp } from "lucide-react";

import { useAgreements } from "@/features/agreements/api";
import { AgreementCard } from "@/features/agreements/components/agreement-card";
import { CreateAgreementModal } from "@/features/agreements/components/create-agreement-modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime";
import { AGREEMENT_FILTERS } from "@/lib/constants";
import { getTrustScoreFill, getTrustScoreTone } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

const statCards = [
  {
    key: "viewerTrustScore",
    label: "Trust score",
    icon: ShieldCheck,
  },
  {
    key: "activeCount",
    label: "Active loops",
    icon: TimerReset,
  },
  {
    key: "completedCount",
    label: "Completed",
    icon: Target,
  },
  {
    key: "completionRate",
    label: "Delivery rate",
    icon: TrendingUp,
  },
] as const;

export function DashboardView() {
  const {
    createAgreementOpen,
    closeCreateAgreement,
    dashboardFilter,
    openCreateAgreement,
    setDashboardFilter,
  } = useUiStore();
  const agreementsQuery = useAgreements(dashboardFilter);

  useDashboardRealtime();

  const stats = agreementsQuery.data?.stats;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] bg-slate-950 px-6 py-8 text-white sm:px-8">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Contract and agreement tracker
            </span>
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Make trust visible, measurable, and shared.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Create agreements, assign obligations, and let progress plus
                follow-through update your accountability loop in realtime.
              </p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={openCreateAgreement}
            className="bg-white text-slate-950 hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            New agreement
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const rawValue = stats?.[card.key] ?? 0;
          const displayValue =
            card.key === "completionRate"
              ? `${rawValue}%`
              : Number(rawValue).toFixed(card.key === "viewerTrustScore" ? 1 : 0);

          return (
            <div
              key={card.key}
              className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {card.label}
                </span>
              </div>
              <div className="mt-8">
                <p
                  className={`font-display text-4xl font-bold tracking-tight ${
                    card.key === "viewerTrustScore"
                      ? getTrustScoreTone(Number(rawValue))
                      : "text-slate-950"
                  }`}
                >
                  {displayValue}
                </p>
                {card.key === "viewerTrustScore" ? (
                  <div className="mt-4 space-y-2">
                    <Progress
                      value={Math.min(100, Number(rawValue))}
                      fillClassName={getTrustScoreFill(Number(rawValue))}
                    />
                    <p className="text-sm text-slate-500">
                      Trust shifts by +5 when obligations are completed and -10
                      when they fail.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">
              Your agreements
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Filter live, completed, or failed commitments across your network.
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2 rounded-full bg-white/80 p-2 ring-1 ring-slate-200">
            {AGREEMENT_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  dashboardFilter === filter
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                onClick={() => setDashboardFilter(filter)}
              >
                {filter === "ALL" ? "All" : filter.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {agreementsQuery.isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[280px] animate-pulse rounded-[28px] bg-white/70"
              />
            ))}
          </div>
        ) : agreementsQuery.data?.agreements.length ? (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 xl:grid-cols-2">
              {agreementsQuery.data.agreements.map((agreement) => (
                <AgreementCard key={agreement.id} agreement={agreement} />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center"
          >
            <h3 className="font-display text-2xl font-bold text-slate-950">
              No agreements in this view yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Start a new accountability loop, invite participants, and assign
              the obligations that will make the commitment real.
            </p>
            <Button onClick={openCreateAgreement} className="mt-6">
              <Plus className="h-4 w-4" />
              Create your first agreement
            </Button>
          </motion.div>
        )}
      </section>

      <button
        type="button"
        onClick={openCreateAgreement}
        className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-ambient transition hover:scale-105 xl:hidden"
      >
        <Plus className="h-5 w-5" />
      </button>

      <CreateAgreementModal
        open={createAgreementOpen}
        onClose={closeCreateAgreement}
      />
    </div>
  );
}
