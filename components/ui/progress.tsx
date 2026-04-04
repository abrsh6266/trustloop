import { cn } from "@/lib/utils";

export function Progress({
  value,
  fillClassName,
}: {
  value: number;
  fillClassName?: string;
}) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
      <div
        className={cn("h-full rounded-full bg-sky-500 transition-all", fillClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
