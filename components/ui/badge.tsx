"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Badge({
  children,
  classname,
}: {
  children: ReactNode;
  classname?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 text-xs font-semibold ring-1 ring-inset",
        classname,
      )}
    >
      {children}
    </span>
  );
}
