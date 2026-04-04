"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, CheckCircle2, ShieldCheck, Users } from "lucide-react";

import { useAgreementDetail } from "@/features/agreements/api";
import { ActivityTimeline } from "@/features/activity/components/activity-timeline";
import { ObligationList } from "@/features/obligations/components/obligation-list";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAgreementRealtime } from "@/hooks/use-agreement-realtime";
import { useAuth } from "@/hooks/use-auth";
import {
  formatDateLabel,
  getAgreementStatusTone,
  getProgressValue,
  getStatusLabel,
  getTrustScoreFill,
  getTrustScoreTone,
} from "@/lib/utils";

export function AgreementDetailView({ agreementId }: { agreementId: string }) {
  const { user } = useAuth();
  const agreementQuery = useAgreementDetail(agreementId);

  useAgreementRealtime(agreementId);

  if (agreementQuery.isLoading) {
    return <div className="h-[400px] animate-pulse rounded-[32px] bg-white/70" />;
  }

  if (!agreementQuery.data) {
    return (
      <div className="rounded-[32px] bg-white p-8 text-center">
        <h1 className="font-display text-3xl font-bold text-slate-950">
          Agreement not found
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          This agreement might not exist or you may not have access to it.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const agreement = agreementQuery.data;
  const progress = getProgressValue(
    agreement.completedObligationsCount,
    agreement.obligationsCount,
  );

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="rounded-[36px] bg-slate-950 px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <Badge className={getAgreementStatusTone(agreement.status)}>
              {getStatusLabel(agreement.status)}
            </Badge>
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {agreement.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/70">
                {agreement.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <CalendarClock className="h-4 w-4 text-sky-300" />
                Due date
              </div>
              <p className="mt-3 font-display text-3xl font-bold">
                {formatDateLabel(agreement.dueDate)}
              </p>
            </div>
            <div className="rounded-[28px] bg-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Completion
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{progress}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/90 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950">
                  Obligations
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Update responsibilities as people deliver or miss their commitments.
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <ObligationList
              agreementId={agreement.id}
              obligations={agreement.obligations}
              creatorId={agreement.creator.id}
              currentUserId={user?.id}
            />
          </div>

          <div className="rounded-[32px] bg-white/90 p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-display text-2xl font-bold text-slate-950">
                Activity timeline
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Every meaningful agreement event is captured here in realtime.
              </p>
            </div>
            <ActivityTimeline activity={agreement.activity} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/90 p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              <Users className="h-4 w-4" />
              Participants
            </div>
            <div className="space-y-4">
              {agreement.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={participant.user.name}
                      email={participant.user.email}
                      className="h-11 w-11 rounded-2xl"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {participant.user.name || participant.user.email}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {participant.role === "CREATOR" ? "Creator" : "Participant"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Trust</span>
                      <span
                        className={`font-semibold ${getTrustScoreTone(participant.user.trustScore)}`}
                      >
                        {participant.user.trustScore.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, participant.user.trustScore)}
                      fillClassName={getTrustScoreFill(participant.user.trustScore)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Trust system
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Completing an obligation adds 5 trust points. Failing an obligation
              removes 10. The score updates immediately and is visible across every
              agreement where that person participates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
