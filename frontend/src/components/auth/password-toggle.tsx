"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordToggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600" aria-label="Toggle password">
      {on ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

export function useReveal() {
  const [show, setShow] = useState(false);
  return { show, toggle: () => setShow((v) => !v) };
}
