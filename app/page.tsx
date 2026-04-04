import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (hasSupabaseEnv) {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf4ff]">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Social contract system
            </span>
            <div className="space-y-5">
              <h1 className="font-display text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                Agreements that turn trust into a living system.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                TrustLoop helps individuals and groups create agreements, assign
                responsibilities, watch progress in realtime, and measure trust
                based on actual follow-through.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20"
              >
                Start building trust
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700"
              >
                Open your dashboard
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-sky-500" />
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Trust scoring
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Scores move with delivery, not intention.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-sm">
                <Users className="h-5 w-5 text-emerald-500" />
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Shared visibility
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Everyone sees who promised what and when.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-sm">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  Realtime updates
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Changes reflect instantly across the team.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] border border-white/70 bg-white/90 p-6 shadow-ambient">
              <div className="rounded-[32px] bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Agreement pulse
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-bold">
                      Weekly launch checkpoint
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                    On track
                  </span>
                </div>
                <div className="mt-6 space-y-4 rounded-[28px] bg-white/10 p-5">
                  {[
                    "Publish campaign landing page",
                    "Finalize partner approval",
                    "Schedule contributor onboarding",
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-white/15 p-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          Owner {index + 1} • Trust synced live
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Participants
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold text-slate-950">
                    6
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    creators and contributors aligned
                  </p>
                </div>
                <div className="rounded-[28px] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Trust velocity
                  </p>
                  <p className="mt-3 font-display text-4xl font-bold text-emerald-600">
                    +18
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    points gained this sprint
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
