"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, Lock, Mail, Phone, User } from "lucide-react";
import { MarketingSidebar } from "@/components/auth/marketing-sidebar";
import { LanguageSelect } from "@/components/auth/language-select";
import { Field, iconPad, inputClass } from "@/components/auth/field";
import { PasswordToggle, useReveal } from "@/components/auth/password-toggle";
import { api, persistAuth, type AuthResponse } from "@/lib/api";

const LANGS = [
  { id: "english", label: "English", hint: "Recommended" },
  { id: "urdu", label: "Urdu (اردو)", hint: "اردو" },
  { id: "roman-urdu", label: "Roman Urdu", hint: "Roman Urdu" },
];

export default function ClientSignupPage() {
  const router = useRouter();
  const pass = useReveal();
  const confirm = useReveal();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    preferred_language: "english",
    agreed: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      const auth = await api<AuthResponse>("/api/auth/register/client", {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || null,
          password: form.password,
          preferred_language: form.preferred_language,
        }),
      });
      persistAuth(auth);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[36%_64%]">
      <div className="hidden lg:block">
        <MarketingSidebar />
      </div>
      <main className="flex min-h-screen flex-col bg-white px-5 py-6 sm:px-10">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <LanguageSelect />
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-ink">Sign Up as a Client</h1>
          <p className="mt-1 text-sm text-muted">Create your account to get started</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="full_name" label="Full Name" required icon={<User className="h-4 w-4" />}>
                <input
                  id="full_name"
                  required
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                />
              </Field>
              <Field id="email" label="Email Address" required icon={<Mail className="h-4 w-4" />}>
                <input
                  id="email"
                  type="email"
                  required
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field id="phone" label="Phone Number" icon={<Phone className="h-4 w-4" />}>
                <input
                  id="phone"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
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
                  minLength={8}
                  type={pass.show ? "text" : "password"}
                  className={`${inputClass} ${iconPad(true, true)}`}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </Field>
              <Field
                id="confirm_password"
                label="Confirm Password"
                required
                className="sm:col-span-2"
                icon={<Lock className="h-4 w-4" />}
                trailing={<PasswordToggle on={confirm.show} toggle={confirm.toggle} />}
              >
                <input
                  id="confirm_password"
                  required
                  type={confirm.show ? "text" : "password"}
                  className={`${inputClass} ${iconPad(true, true)}`}
                  placeholder="Confirm your password"
                  value={form.confirm_password}
                  onChange={(e) => set("confirm_password", e.target.value)}
                />
              </Field>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Preferred Language</p>
              <p className="mb-3 text-xs text-muted">Select your preferred language for a better experience</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {LANGS.map((lang) => {
                  const selected = form.preferred_language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => set("preferred_language", lang.id)}
                      className={`rounded-xl border px-4 py-3 text-left ${
                        selected ? "border-brand bg-brand-soft" : "border-slate-200"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-semibold text-ink">{lang.label}</span>
                        {selected ? <Check className="h-4 w-4 text-brand" /> : null}
                      </span>
                      <span className="text-xs text-muted">{lang.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 accent-brand"
                checked={form.agreed}
                onChange={(e) => set("agreed", e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-brand">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
