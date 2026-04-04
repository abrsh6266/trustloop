import { ShieldCheck } from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-emerald-400 opacity-90" />
        <ShieldCheck className="relative h-5 w-5" />
      </div>
      <div className={cn("space-y-0.5", compact && "hidden sm:block")}>
        <p className="font-display text-lg font-bold tracking-tight text-slate-950">
          {APP_NAME}
        </p>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Agreements in motion
        </p>
      </div>
    </div>
  );
}
