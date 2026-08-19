"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";

const OPTIONS = ["English", "اردو", "Roman Urdu"];

export function LanguageSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("English");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
      >
        <Globe className="h-4 w-4 text-brand" />
        {value}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open ? (
        <ul className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-brand-soft"
                onClick={() => {
                  setValue(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
