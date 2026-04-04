"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutDashboard, LogOut } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getDisplayName } from "@/lib/utils";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef4fb]">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-4 lg:flex-row lg:gap-4 lg:px-6">
        <aside className="mb-4 rounded-[32px] border border-white/60 bg-white/70 p-4 shadow-ambient backdrop-blur lg:mb-0 lg:flex lg:w-[280px] lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <BrandMark />
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                        : "text-slate-600 hover:bg-slate-950/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
                <Bell className="h-4 w-4" />
                Live accountability
              </div>
              <p className="text-sm leading-6 text-white/70">
                Realtime agreement updates and trust shifts land here instantly
                as your team follows through.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-[24px] bg-slate-50 p-3">
            <Avatar name={user?.user_metadata?.name as string | undefined} email={user?.email} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {getDisplayName(user?.user_metadata?.name as string | undefined, user?.email)}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="h-9 w-9 rounded-xl p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </aside>

        <main className="flex-1 rounded-[32px] border border-white/60 bg-white/70 p-4 shadow-ambient backdrop-blur sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
