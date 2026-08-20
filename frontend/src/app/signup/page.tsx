"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Check, User } from "lucide-react";
import { MarketingSidebar } from "@/components/auth/marketing-sidebar";
import { LanguageSelect } from "@/components/auth/language-select";

export default function SignupSelectPage() {
  return (
    <div className="min-h-screen bg-[#f4f5fb] lg:grid lg:grid-cols-[40%_60%]">
      <div className="hidden lg:block">
        <MarketingSidebar />
      </div>
      <main className="flex min-h-screen flex-col bg-white px-5 py-6 sm:px-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
          <LanguageSelect />
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
          <h1 className="text-center text-3xl font-bold text-brand-dark">Sign Up</h1>
          <p className="mt-2 text-center text-sm text-muted">Choose how you want to join LegalAI PK</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-violet-200 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-brand">
                <User className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-brand-dark">I&apos;m a Client</h2>
              <p className="mt-2 text-sm text-muted">I need legal information or want to consult with a lawyer.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {["Ask legal questions", "Get AI-powered answers", "Find verified lawyers", "Book consultations"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand" /> {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                href="/signup/client"
                className="mt-6 block rounded-lg bg-brand py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Sign Up as Client
              </Link>
            </article>
            <article className="flex flex-col rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-dark">
                <Briefcase className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-amber-dark">I&apos;m a Lawyer</h2>
              <p className="mt-2 text-sm text-muted">I want to connect with clients seeking legal assistance.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {[
                  "Create your professional profile",
                  "Get verified by our team",
                  "Connect with potential clients",
                  "Grow your legal practice",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup/lawyer"
                className="mt-6 block rounded-lg bg-amber py-2.5 text-center text-sm font-semibold text-white hover:bg-amber-dark"
              >
                Sign Up as Lawyer
              </Link>
            </article>
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand">
              Login
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-brand">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-brand">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
