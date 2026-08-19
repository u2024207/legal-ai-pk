import { Brain, Lock, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { CreateAccountIllustration } from "@/components/brand/illustrations";

export function MarketingSidebar({
  title = "Create Your Account",
  description = "Join LegalAI PK to get AI-powered legal information or connect with verified lawyers for your legal needs.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <aside className="flex h-full flex-col justify-between bg-[#f3f0fb] px-8 py-8 lg:px-10">
      <div>
        <BrandLogo />
        <h1 className="mt-10 text-3xl font-bold tracking-tight text-brand-dark">{title}</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{description}</p>
      </div>
      <CreateAccountIllustration />
      <ul className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <li>
          <ShieldCheck className="mb-1 h-4 w-4 text-brand" />
          <p className="font-semibold text-ink">Trusted Platform</p>
          <p className="text-muted">Verified lawyers & secure services</p>
        </li>
        <li>
          <Brain className="mb-1 h-4 w-4 text-brand" />
          <p className="font-semibold text-ink">AI-Powered</p>
          <p className="text-muted">Get instant legal information</p>
        </li>
        <li>
          <Lock className="mb-1 h-4 w-4 text-brand" />
          <p className="font-semibold text-ink">Secure & Private</p>
          <p className="text-muted">Your data is safe with us</p>
        </li>
      </ul>
    </aside>
  );
}
