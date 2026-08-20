import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        LegalAI PK provides AI-assisted legal information for Pakistan. It is not a substitute for advice from a
        licensed advocate. By creating an account you agree to use the platform lawfully and to provide accurate
        information during registration and verification.
      </p>
      <Link href="/signup" className="mt-6 inline-block text-sm font-semibold text-brand">
        Back
      </Link>
    </main>
  );
}
