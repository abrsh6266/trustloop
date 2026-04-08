"use client";
import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  email,
  classname,
}: {
  name?: string;
  email?: string;
  classname?: string;
}) {
  return (
    <div
      className={cn(
        "h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400 text-xs  font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-sky-500/20",
        classname,
      )}
    >
      {getInitials(name, email)}
    </div>
  );
}
