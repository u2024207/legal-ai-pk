"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { MarketingSidebar } from "@/components/auth/marketing-sidebar";
import { LanguageSelect } from "@/components/auth/language-select";
import { Field, iconPad, inputClass } from "@/components/auth/field";
import { PasswordToggle, useReveal } from "@/components/auth/password-toggle";
import { api, persistAuth, type AuthResponse } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const pass = useReveal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await api<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      persistAuth(auth);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[42%_58%]">
      <div className="hidden lg:block">
        <MarketingSidebar />
      </div>
      <main className="flex min-h-screen flex-col bg-white px-6 py-6 sm:px-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
            <ArrowLeft className="h-4 w-4" /> Sign Up
          </Link>
          <LanguageSelect />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <h1 className="text-center text-3xl font-bold text-brand-dark">Login</h1>
          <p className="mt-2 text-center text-sm text-muted">Welcome back to LegalAI PK</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field id="email" label="Email Address" required icon={<Mail className="h-4 w-4" />}>
              <input
                id="email"
                type="email"
                required
                className={`${inputClass} ${iconPad(true)}`}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field
              id="password"
              label="Password"
              required
              icon={<Lock className="h-4 w-4" />}
              trailing={<PasswordToggle on={pass.show} toggle={pass.toggle} />}
            >
              <input
                id="password"
                required
                type={pass.show ? "text" : "password"}
                className={`${inputClass} ${iconPad(true, true)}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
