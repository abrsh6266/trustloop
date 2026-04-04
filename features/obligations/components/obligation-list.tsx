"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ObligationDto } from "@/features/agreements/types";
import { useUpdateObligation } from "@/features/agreements/api";
import {
  formatDateTimeLabel,
  getObligationStatusTone,
  getStatusLabel,
} from "@/lib/utils";

export function ObligationList({
  agreementId,
  obligations,
  currentUserId,
  creatorId,
}: {
  agreementId: string;
  obligations: ObligationDto[];
  currentUserId?: string;
  creatorId: string;
}) {
  const updateObligation = useUpdateObligation(agreementId);

  return (
    <div className="space-y-4">
      {obligations.map((obligation) => {
        const canUpdate =
          currentUserId === creatorId || currentUserId === obligation.assignedTo.id;
        const isMutating =
          updateObligation.isPending &&
          updateObligation.variables?.obligationId === obligation.id;

        return (
          <div
            key={obligation.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <Badge className={getObligationStatusTone(obligation.status)}>
                  {getStatusLabel(obligation.status)}
                </Badge>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {obligation.description}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Updated {formatDateTimeLabel(obligation.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                  <Avatar
                    name={obligation.assignedTo.name}
                    email={obligation.assignedTo.email}
                    className="h-10 w-10 rounded-xl"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {obligation.assignedTo.name || obligation.assignedTo.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      Trust {obligation.assignedTo.trustScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant={obligation.status === "DONE" ? "primary" : "secondary"}
                  onClick={() =>
                    updateObligation.mutate({
                      obligationId: obligation.id,
                      payload: {
                        status: "DONE",
                      },
                    })
                  }
                  disabled={!canUpdate}
                  isLoading={isMutating}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark done
                </Button>
                <Button
                  variant={obligation.status === "FAILED" ? "danger" : "secondary"}
                  onClick={() =>
                    updateObligation.mutate({
                      obligationId: obligation.id,
                      payload: {
                        status: "FAILED",
                      },
                    })
                  }
                  disabled={!canUpdate}
                  isLoading={isMutating}
                >
                  <ShieldAlert className="h-4 w-4" />
                  Mark failed
                </Button>
              </div>
            </div>
            {!canUpdate ? (
              <p className="mt-4 text-xs text-slate-400">
                Only the assignee or agreement creator can change this obligation.
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
