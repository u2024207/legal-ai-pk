import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  required?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({ id, label, required, icon, trailing, children, className = "" }: Props) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}
        {children}
        {trailing ? <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span> : null}
      </div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export function iconPad(hasIcon: boolean, hasTrailing = false) {
  return `${hasIcon ? "pl-10" : "px-3"} ${hasTrailing ? "pr-10" : "pr-3"}`;
}
