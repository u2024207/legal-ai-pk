import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        We collect account details and, for lawyers, professional credentials and verification documents solely to
        operate LegalAI PK and verify advocates. Documents are stored securely and are not sold or shared with third
        parties except as required by law.
      </p>
      <Link href="/signup" className="mt-6 inline-block text-sm font-semibold text-brand">
        Back
      </Link>
    </main>
  );
}
