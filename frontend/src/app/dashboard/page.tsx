"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/logo";
import { api } from "@/lib/api";

type Me = {
  full_name: string;
  email: string;
  role: string;
  status: string;
  verification_status?: string | null;
};

export default function DashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Me>("/api/auth/me")
      .then(setMe)
      .catch((err) => setError(err instanceof Error ? err.message : "Please log in"));
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fb] px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <BrandLogo />
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-ink">Welcome to LegalAI PK</h1>
          {error ? (
            <p className="mt-4 text-sm text-red-600">
              {error}.{" "}
              <Link href="/login" className="text-brand">
                Login
              </Link>
            </p>
          ) : me ? (
            <div className="mt-4 space-y-1 text-sm text-slate-700">
              <p>
                Signed in as <strong>{me.full_name}</strong> ({me.email})
              </p>
              <p className="capitalize">
                Role: {me.role} · Status: {me.status.replaceAll("_", " ")}
              </p>
              {me.verification_status ? (
                <p className="capitalize">Verification: {me.verification_status}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Loading account...</p>
          )}
          <button
            type="button"
            className="mt-6 text-sm font-semibold text-brand"
            onClick={() => {
              localStorage.removeItem("legalai_token");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
