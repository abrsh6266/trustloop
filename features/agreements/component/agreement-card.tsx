"use client";
import { motion } from "framer-motion";

import {
  formatDateLabel,
  getAgreementStatusTone,
  getDueDateAccent,
  getProgressValue,
  getStatusLabel,
} from "@/lib/utils";
import { AgreementSummaryDto } from "../types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";

export function AgreementCard({
  agreement,
}: {
  agreement: AgreementSummaryDto;
}) {
  const progress = getProgressValue(
    agreement.completedObligationsCount,
    agreement.obligationsCount,
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="group rounded-[28px] border border-white/70 bg-white/95 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-ambient"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge classname={getAgreementStatusTone(agreement.status)}>
            {getStatusLabel(agreement.status)}
          </Badge>
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-950">
              {agreement.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {agreement.description}
            </p>
          </div>
        </div>
        <Link
          href={`/agreements/${agreement.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Open
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 lg:gridcols-[1.4fr,0,0.8fr">
        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Execution progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {agreement.completedObligationsCount} done
            </span>
            <span className="inline-flex items-center gap-2">
              <XCircle className="inline-flex items-center gap-2" />
              {agreement.failedObligationsCount} failed
            </span>
            <span>{agreement.obligationsCount} total obligations</span>
          </div>
        </div>
        <div className="space-y-4 rounded-[24px] border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarClock className="h-4 w-4 text-sky-500" />
            <span className={getDueDateAccent(agreement.dueDate)}>
              Due {formatDateLabel(agreement.dueDate)}
            </span>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Participants
            </p>
            <div className="flex flex-wrap gap-3">
              {agreement.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2"
                >
                  <Avatar
                    name={participant.user.name}
                    email={participant.user.email}
                    classname="h-9 w-9 rounded-xl text-[10px]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {participant.user.name || participant.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Trust {participant.user.trustScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
