import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

export function AuthShell({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#edf4ff] px-4 py-8">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-8">
          <Link href="/" className="inline-flex">
            <BrandMark />
          </Link>
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 ring-1 ring-slate-200">
              Social contract operating system
            </span>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-slate-950">
              Build trust with agreements people can actually follow through on.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Track shared promises, assign obligations, surface accountability,
              and let trust evolve in realtime instead of living in memory.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Realtime loops</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Shared updates ripple instantly across agreements and timelines.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Trust scoring</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Every completed or failed obligation adjusts confidence over time.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Clear ownership</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Roles, expectations, and due dates stay visible for everyone.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-ambient backdrop-blur">
          <div className="mb-8 space-y-3">
            <h2 className="font-display text-3xl font-bold text-slate-950">{title}</h2>
            <p className="text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
          <div className="mt-6 text-sm text-slate-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}
