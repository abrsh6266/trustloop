"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export function AuthForm({
  mode,
  redirectTo = "/dashboard",
}: {
  mode: "login" | "register";
  redirectTo?: string;
}) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  return (
    <AuthShell
      title={isLogin ? "Welcome back" : "Create your workspace"}
      description={
        isLogin
          ? "Sign in to manage live agreements, obligations, and trust across your network."
          : "Start a new TrustLoop workspace with secure Supabase authentication."
      }
      footer={
        isLogin ? (
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-slate-950">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-950">
              Sign in
            </Link>
          </>
        )
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setSuccess(null);
          setIsSubmitting(true);

          try {
            if (isLogin) {
              const result = await signIn({ email, password });

              if (result.error) {
                setError(result.error);
                return;
              }

              router.push(redirectTo);
              router.refresh();
              return;
            }

            const result = await signUp({ name, email, password });

            if (result.error) {
              setError(result.error);
              return;
            }

            if (result.needsEmailVerification) {
              setSuccess(
                "Account created. Check your email to verify the account, then sign in.",
              );
              return;
            }

            router.push("/dashboard");
            router.refresh();
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {!isLogin ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full name</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Amina Tesfaye"
              required
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {error ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            {success}
          </div>
        ) : null}

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          {isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
