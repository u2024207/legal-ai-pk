"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { LawyerJoinIllustration } from "@/components/brand/illustrations";
import { LanguageSelect } from "@/components/auth/language-select";
import { HorizontalStepper, VerticalStepper } from "@/components/auth/stepper";

type Props = {
  step: number;
  children: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
};

export function LawyerShell({ step, children, backHref = "/signup", onBack }: Props) {
  const titles = [
    "Account Information",
    "Professional Information",
    "Professional Profile",
    "Verification",
    "Review & Submit",
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="hidden flex-col bg-[#efeafc] px-6 py-7 lg:flex">
        <BrandLogo />
        <h2 className="mt-8 text-2xl font-bold text-brand-dark">Join as a Lawyer</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Create your professional account and help clients get the legal support they need.
        </p>
        <div className="my-6">
          <LawyerJoinIllustration />
        </div>
        <VerticalStepper current={step} />
        <p className="mt-auto flex items-start gap-2 pt-8 text-xs text-muted">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Your information is secure and will only be used for verification.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col bg-[#f7f8fb] px-4 py-5 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          {onBack ? (
            <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-brand">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <Link href={backHref} className="inline-flex items-center gap-1 text-sm font-medium text-brand">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          )}
          <LanguageSelect />
        </div>
        <div className="mx-auto w-full max-w-5xl flex-1 rounded-2xl bg-white px-5 py-8 shadow-sm sm:px-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">Sign Up as a Lawyer</h1>
            <p className="mt-1 text-sm font-medium text-brand">
              Step {step + 1} of 5: {titles[step]}
            </p>
          </div>
          <div className="mt-8">
            <HorizontalStepper current={step} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
