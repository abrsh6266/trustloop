import { CheckCircle2, Edit3, Flame, Sparkles } from "lucide-react";

import type { ActivityLogDto } from "@/features/agreements/types";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

function getActivityIcon(action: ActivityLogDto["action"]) {
  if (action === "COMPLETED") {
    return CheckCircle2;
  }

  if (action === "FAILED") {
    return Flame;
  }

  if (action === "UPDATED") {
    return Edit3;
  }

  return Sparkles;
}

export function ActivityTimeline({ activity }: { activity: ActivityLogDto[] }) {
  return (
    <div className="space-y-4">
      {activity.map((item) => {
        const Icon = getActivityIcon(item.action);

        return (
          <div key={item.id} className="flex gap-4 rounded-[28px] bg-white p-4 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-2 h-full w-px bg-slate-200" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={item.user.name}
                    email={item.user.email}
                    className="h-9 w-9 rounded-xl"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.user.name || item.user.email}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.action}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {formatRelativeTime(item.timestamp)}
                </p>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {item.details || "Activity was recorded on this agreement."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
