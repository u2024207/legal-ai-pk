"use client";

import { useRef, useState } from "react";
import { CloudUpload, FileCheck2 } from "lucide-react";

type Props = {
  label: string;
  required?: boolean;
  file: File | null;
  onFile: (file: File | null) => void;
};

export function FileDrop({ label, required, file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function accept(next: File | null) {
    if (!next) {
      onFile(null);
      return;
    }
    const okType = ["image/jpeg", "image/png", "application/pdf"].includes(next.type) || /\.(jpe?g|png|pdf)$/i.test(next.name);
    if (!okType) {
      setError("JPG, PNG or PDF only");
      return;
    }
    if (next.size > 5 * 1024 * 1024) {
      setError("Max 5MB");
      return;
    }
    setError("");
    onFile(next);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          accept(e.dataTransfer.files[0] ?? null);
        }}
        className="flex min-h-[140px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center hover:border-brand/50"
      >
        {file ? (
          <>
            <FileCheck2 className="h-7 w-7 text-emerald-500" />
            <p className="mt-2 max-w-full truncate text-xs font-medium text-slate-700">{file.name}</p>
          </>
        ) : (
          <>
            <CloudUpload className="h-7 w-7 text-brand" />
            <p className="mt-2 text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-muted">JPG, PNG or PDF (Max 5MB)</p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
