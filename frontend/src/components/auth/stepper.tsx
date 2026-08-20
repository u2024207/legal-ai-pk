import { Check } from "lucide-react";
import { LAWYER_STEPS } from "@/lib/constants";

export function HorizontalStepper({ current }: { current: number }) {
  return (
    <ol className="mx-auto mb-8 hidden w-full max-w-3xl grid-cols-5 md:grid">
      {LAWYER_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.key} className="relative flex flex-col items-center text-center">
            {index < LAWYER_STEPS.length - 1 ? (
              <span
                className={`absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-4 h-0.5 ${
                  index < current ? "bg-brand" : "bg-slate-200"
                }`}
              />
            ) : null}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                done || active ? "bg-brand text-white" : "border-2 border-slate-200 bg-white text-slate-400"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span className={`mt-2 text-[11px] leading-tight ${active ? "font-semibold text-brand" : "text-slate-500"}`}>
              {step.short}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function VerticalStepper({ current }: { current: number }) {
  return (
    <ol className="space-y-2">
      {LAWYER_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.key}
            className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${
              active ? "bg-brand text-white shadow-sm" : ""
            }`}
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-white text-brand"
                  : done
                    ? "bg-brand text-white"
                    : "border border-slate-300 bg-white text-slate-400"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <span>
              <span className={`block text-sm font-semibold ${active ? "text-white" : "text-slate-700"}`}>
                {step.title}
              </span>
              <span className={`text-xs ${active ? "text-white/80" : "text-muted"}`}>{step.hint}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
