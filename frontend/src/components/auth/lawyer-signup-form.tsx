"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Clock,
  CreditCard,
  IdCard,
  Info,
  Landmark,
  Lock,
  Mail,
  Pencil,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { LawyerShell } from "@/components/auth/lawyer-shell";
import { Field, iconPad, inputClass } from "@/components/auth/field";
import { FileDrop } from "@/components/auth/file-drop";
import { PasswordToggle, useReveal } from "@/components/auth/password-toggle";
import {
  ADVOCATE_LEVELS,
  BAR_COUNCILS,
  COURT_OPTIONS,
  EXPERIENCE_OPTIONS,
  LANGUAGES,
  PROVINCES,
  SPECIALIZATIONS,
} from "@/lib/constants";
import { api, persistAuth, type AuthResponse } from "@/lib/api";
import { EMPTY_DRAFT, clearDraft, loadDraft, saveDraft, type LawyerDraft } from "@/lib/lawyer-draft";

type Docs = {
  cnic_front: File | null;
  cnic_back: File | null;
  bar_card: File | null;
  passport_photo: File | null;
  additional_document: File | null;
};

const emptyDocs: Docs = {
  cnic_front: null,
  cnic_back: null,
  bar_card: null,
  passport_photo: null,
  additional_document: null,
};

export function LawyerSignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LawyerDraft>(EMPTY_DRAFT);
  const [docs, setDocs] = useState<Docs>(emptyDocs);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pass = useReveal();
  const confirm = useReveal();

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  function update<K extends keyof LawyerDraft>(key: K, value: LawyerDraft[K]) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      saveDraft(next);
      return next;
    });
  }

  const cities = useMemo(() => PROVINCES[draft.province] ?? [], [draft.province]);

  function validateStep() {
    if (step === 0) {
      if (!draft.full_name || !draft.email || !draft.phone || !draft.password || !draft.confirm_password || !draft.cnic) {
        return "Please fill all required account fields.";
      }
      if (draft.password !== draft.confirm_password) return "Passwords do not match.";
      if (draft.password.length < 8) return "Password must be at least 8 characters.";
    }
    if (step === 1) {
      if (
        !draft.bar_council ||
        !draft.enrollment_number ||
        !draft.enrollment_date ||
        !draft.advocate_level ||
        !draft.bar_association ||
        !draft.province ||
        !draft.city ||
        !draft.practice_courts
      ) {
        return "Please complete your professional information.";
      }
    }
    if (step === 2) {
      if (
        !draft.primary_specialization ||
        !draft.court_practice ||
        !draft.consultation_type ||
        !draft.years_experience ||
        draft.languages_known.length === 0 ||
        !draft.professional_bio.trim()
      ) {
        return "Please complete your professional profile.";
      }
    }
    if (step === 3) {
      if (!docs.cnic_front || !docs.cnic_back || !docs.bar_card || !docs.passport_photo) {
        return "Please upload all required documents.";
      }
      if (!draft.info_confirmed) return "Please confirm that the information is true and correct.";
    }
    if (step === 4 && !draft.terms_accepted) {
      return "Please agree to the Terms of Service and Privacy Policy.";
    }
    return "";
  }

  async function onNext(e: FormEvent) {
    e.preventDefault();
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      const languages = [...draft.languages_known];
      if (languages.includes("Other") && draft.other_language) {
        languages.push(draft.other_language);
      }
      const payload = {
        ...draft,
        languages_known: languages,
        court_practice: draft.court_practice || draft.practice_courts,
      };
      const body = new FormData();
      body.append("payload", JSON.stringify(payload));
      body.append("cnic_front", docs.cnic_front as File);
      body.append("cnic_back", docs.cnic_back as File);
      body.append("bar_card", docs.bar_card as File);
      body.append("passport_photo", docs.passport_photo as File);
      if (docs.additional_document) body.append("additional_document", docs.additional_document);
      const auth = await api<AuthResponse>("/api/auth/register/lawyer", { method: "POST", body });
      persistAuth(auth);
      clearDraft();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit registration");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LawyerShell
      step={step}
      backHref="/signup"
      onBack={
        step > 0
          ? () => {
              setError("");
              setStep((s) => s - 1);
            }
          : undefined
      }
    >
      <form onSubmit={onNext} className="space-y-6">
        {step === 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="full_name" label="Full Name" required icon={<User className="h-4 w-4" />}>
                <input
                  id="full_name"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your full name"
                  value={draft.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                />
              </Field>
              <Field id="email" label="Email Address" required icon={<Mail className="h-4 w-4" />}>
                <input
                  id="email"
                  type="email"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your email address"
                  value={draft.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field id="phone" label="Phone Number" required icon={<Phone className="h-4 w-4" />}>
                <input
                  id="phone"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your phone number"
                  value={draft.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
              <Field
                id="password"
                label="Password"
                required
                icon={<Lock className="h-4 w-4" />}
                trailing={<PasswordToggle on={pass.show} toggle={pass.toggle} />}
              >
                <input
                  id="password"
                  type={pass.show ? "text" : "password"}
                  className={`${inputClass} ${iconPad(true, true)}`}
                  placeholder="Create a strong password"
                  value={draft.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </Field>
              <Field
                id="confirm_password"
                label="Confirm Password"
                required
                icon={<Lock className="h-4 w-4" />}
                trailing={<PasswordToggle on={confirm.show} toggle={confirm.toggle} />}
              >
                <input
                  id="confirm_password"
                  type={confirm.show ? "text" : "password"}
                  className={`${inputClass} ${iconPad(true, true)}`}
                  placeholder="Confirm your password"
                  value={draft.confirm_password}
                  onChange={(e) => update("confirm_password", e.target.value)}
                />
              </Field>
              <Field id="cnic" label="CNIC Number" required icon={<IdCard className="h-4 w-4" />}>
                <input
                  id="cnic"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your CNIC number"
                  value={draft.cnic}
                  onChange={(e) => update("cnic", e.target.value)}
                />
              </Field>
            </div>
            <div className="flex gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              Use a valid email and phone number. You will need to verify your account before continuing to the next
              steps.
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="bar_council" label="Bar Council" required>
                <select
                  id="bar_council"
                  className={`${inputClass} px-3`}
                  value={draft.bar_council}
                  onChange={(e) => update("bar_council", e.target.value)}
                >
                  <option value="">Select bar council</option>
                  {BAR_COUNCILS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field id="enrollment_number" label="Enrollment / Roll Number" required>
                <input
                  id="enrollment_number"
                  className={`${inputClass} px-3`}
                  placeholder="Enter your enrollment or roll number"
                  value={draft.enrollment_number}
                  onChange={(e) => update("enrollment_number", e.target.value)}
                />
              </Field>
              <Field id="enrollment_date" label="Enrollment Date" required icon={<Calendar className="h-4 w-4" />}>
                <input
                  id="enrollment_date"
                  type="date"
                  className={`${inputClass} ${iconPad(true)}`}
                  value={draft.enrollment_date}
                  onChange={(e) => update("enrollment_date", e.target.value)}
                />
              </Field>
              <Field id="advocate_level" label="Advocate Level" required>
                <select
                  id="advocate_level"
                  className={`${inputClass} px-3`}
                  value={draft.advocate_level}
                  onChange={(e) => update("advocate_level", e.target.value)}
                >
                  <option value="">Select your advocate level</option>
                  {ADVOCATE_LEVELS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field id="bar_association" label="Bar Association" required>
                <input
                  id="bar_association"
                  className={`${inputClass} px-3`}
                  placeholder="Enter your bar association"
                  value={draft.bar_association}
                  onChange={(e) => update("bar_association", e.target.value)}
                />
              </Field>
              <Field id="province" label="Province" required>
                <select
                  id="province"
                  className={`${inputClass} px-3`}
                  value={draft.province}
                  onChange={(e) => {
                    update("province", e.target.value);
                    update("city", "");
                  }}
                >
                  <option value="">Select your province</option>
                  {Object.keys(PROVINCES).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field id="city" label="City" required>
                <select
                  id="city"
                  className={`${inputClass} px-3`}
                  value={draft.city}
                  onChange={(e) => update("city", e.target.value)}
                >
                  <option value="">Select your city</option>
                  {cities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field id="practice_courts" label="Practice Courts / Jurisdiction" required className="sm:col-span-2">
                <input
                  id="practice_courts"
                  className={`${inputClass} px-3`}
                  placeholder="e.g. District Courts, High Court, Supreme Court"
                  value={draft.practice_courts}
                  onChange={(e) => update("practice_courts", e.target.value)}
                />
              </Field>
            </div>
            <div className="flex gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="font-semibold">Why we need this information?</p>
                <p>
                  This information helps us verify your professional credentials with the relevant Bar Council and
                  ensures trust and safety for our clients.
                </p>
              </div>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Field id="primary_specialization" label="Primary Specialization" required icon={<Briefcase className="h-4 w-4" />}>
              <select
                id="primary_specialization"
                className={`${inputClass} ${iconPad(true)}`}
                value={draft.primary_specialization}
                onChange={(e) => update("primary_specialization", e.target.value)}
              >
                <option value="">Select your primary specialization</option>
                {SPECIALIZATIONS.filter((item) => item !== "Other").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field id="court_practice" label="Court Practice / Jurisdiction" required icon={<Landmark className="h-4 w-4" />}>
              <select
                id="court_practice"
                className={`${inputClass} ${iconPad(true)}`}
                value={draft.court_practice}
                onChange={(e) => update("court_practice", e.target.value)}
              >
                <option value="">Select courts / jurisdiction</option>
                {COURT_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Other Specializations (Select all that apply)</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SPECIALIZATIONS.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={draft.other_specializations.includes(item)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...draft.other_specializations, item]
                          : draft.other_specializations.filter((x) => x !== item);
                        update("other_specializations", next);
                      }}
                      className="accent-brand"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Consultation Type<span className="ml-0.5 text-red-500">*</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["online", "Online", "Provide legal consultation online", Building2],
                    ["in-person", "In-Person", "Meet clients at office / physical location", User],
                  ] as const
                ).map(([value, title, hint, Icon]) => {
                  const selected = draft.consultation_type === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("consultation_type", value)}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left ${
                        selected ? "border-brand bg-brand-soft" : "border-slate-200"
                      }`}
                    >
                      <span className={`mt-0.5 h-4 w-4 rounded-full border ${selected ? "border-brand bg-brand" : "border-slate-300"}`} />
                      <span>
                        <Icon className="mb-1 h-5 w-5 text-brand" />
                        <span className="block font-semibold text-ink">{title}</span>
                        <span className="text-sm text-muted">{hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Field id="years_experience" label="Years of Experience" required icon={<Clock className="h-4 w-4" />}>
              <select
                id="years_experience"
                className={`${inputClass} ${iconPad(true)}`}
                value={draft.years_experience}
                onChange={(e) => update("years_experience", e.target.value)}
              >
                <option value="">Select your experience</option>
                {EXPERIENCE_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Languages Known<span className="ml-0.5 text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {LANGUAGES.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-brand"
                      checked={draft.languages_known.includes(item)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...draft.languages_known, item]
                          : draft.languages_known.filter((x) => x !== item);
                        update("languages_known", next);
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
              {draft.languages_known.includes("Other") ? (
                <input
                  className={`${inputClass} mt-2 px-3`}
                  placeholder="Specify other language"
                  value={draft.other_language}
                  onChange={(e) => update("other_language", e.target.value)}
                />
              ) : null}
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Professional Bio<span className="ml-0.5 text-red-500">*</span>
              </span>
              <textarea
                maxLength={500}
                rows={4}
                className={`${inputClass} px-3`}
                placeholder="Write a short professional bio"
                value={draft.professional_bio}
                onChange={(e) => update("professional_bio", e.target.value)}
              />
              <span className="mt-1 block text-xs text-muted">{draft.professional_bio.length}/500 characters</span>
            </label>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="flex gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="font-semibold">Professional Verification</p>
                <p>
                  We take verification seriously to maintain trust and safety on our platform. Please provide valid
                  documents and information.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="cnic_verify" label="CNIC Number" required icon={<CreditCard className="h-4 w-4" />}>
                <input
                  id="cnic_verify"
                  className={`${inputClass} ${iconPad(true)}`}
                  placeholder="Enter your CNIC number"
                  value={draft.cnic}
                  onChange={(e) => update("cnic", e.target.value)}
                />
              </Field>
              <FileDrop label="Upload CNIC (Front Side)" required file={docs.cnic_front} onFile={(file) => setDocs((d) => ({ ...d, cnic_front: file }))} />
              <FileDrop label="Upload CNIC (Back Side)" required file={docs.cnic_back} onFile={(file) => setDocs((d) => ({ ...d, cnic_back: file }))} />
              <FileDrop
                label="Upload Bar Council Enrollment / Membership Card"
                required
                file={docs.bar_card}
                onFile={(file) => setDocs((d) => ({ ...d, bar_card: file }))}
              />
              <FileDrop
                label="Upload Passport Size Photo"
                required
                file={docs.passport_photo}
                onFile={(file) => setDocs((d) => ({ ...d, passport_photo: file }))}
              />
              <FileDrop
                label="Additional Document (Optional)"
                file={docs.additional_document}
                onFile={(file) => setDocs((d) => ({ ...d, additional_document: file }))}
              />
            </div>
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Tips</p>
              <ul className="mt-1 list-disc pl-5">
                <li>Ensure all documents are clear and readable.</li>
                <li>Enrollment card must be issued by the relevant Bar Council.</li>
                <li>You will be notified via email once your profile is verified.</li>
              </ul>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 accent-brand"
                checked={draft.info_confirmed}
                onChange={(e) => update("info_confirmed", e.target.checked)}
              />
              I confirm that the information provided is true and correct to the best of my knowledge.
            </label>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Almost there! Please review your information before submitting. You can go back and edit any section if
              needed.
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <ReviewCard title="Account Information" onEdit={() => setStep(0)}>
                <Row label="Full Name" value={draft.full_name} />
                <Row label="Email" value={draft.email} />
                <Row label="Phone Number" value={draft.phone} />
                <Row label="CNIC" value={draft.cnic} />
              </ReviewCard>
              <ReviewCard title="Professional Information" onEdit={() => setStep(1)}>
                <Row label="Bar Council" value={draft.bar_council} />
                <Row label="Enrollment Number" value={draft.enrollment_number} />
                <Row label="Enrollment Date" value={draft.enrollment_date} />
                <Row label="Advocate Level" value={draft.advocate_level} />
                <Row label="Province / City" value={`${draft.province} / ${draft.city}`} />
                <Row label="Practice Courts" value={draft.practice_courts} />
              </ReviewCard>
              <ReviewCard title="Professional Profile" onEdit={() => setStep(2)}>
                <Row label="Primary Specialization" value={draft.primary_specialization} />
                <Row label="Other Specializations" value={draft.other_specializations.join(", ") || "—"} />
                <Row label="Years of Experience" value={draft.years_experience} />
                <Row label="Consultation Type" value={draft.consultation_type} />
                <Row label="Languages Known" value={draft.languages_known.join(", ")} />
                <Row label="Professional Bio" value={draft.professional_bio} />
              </ReviewCard>
              <ReviewCard title="Uploaded Documents" onEdit={() => setStep(3)}>
                <DocRow label="CNIC (Front)" ok={Boolean(docs.cnic_front)} />
                <DocRow label="CNIC (Back)" ok={Boolean(docs.cnic_back)} />
                <DocRow label="Bar Council Card" ok={Boolean(docs.bar_card)} />
                <DocRow label="Passport Photo" ok={Boolean(docs.passport_photo)} />
                <DocRow label="Additional Document" ok={Boolean(docs.additional_document)} optional />
              </ReviewCard>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-2 font-semibold text-amber-900">
                  <Clock className="h-4 w-4" /> Pending Verification
                </p>
                <p className="mt-2 text-sm text-amber-800">
                  Your profile will be reviewed by our admin team before it becomes visible to clients.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Lock className="h-4 w-4 text-brand" /> Your Information is Secure
                </p>
                <p className="mt-2 text-sm text-muted">We never share your information with anyone.</p>
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 accent-brand"
                checked={draft.terms_accepted}
                onChange={(e) => update("terms_accepted", e.target.checked)}
              />
              <span>
                I confirm this information is accurate and agree to the{" "}
                <Link href="/terms" className="text-brand">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {step === 0 ? (
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand">
                Login
              </Link>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((s) => s - 1);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-brand px-4 py-2.5 text-sm font-semibold text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 1
                ? "Previous: Account Information"
                : step === 2
                  ? "Previous: Professional Information"
                  : step === 3
                    ? "Previous: Professional Profile"
                    : "Previous: Verification"}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {step === 0
              ? "Next: Professional Information"
              : step === 1
                ? "Next: Professional Profile"
                : step === 2
                  ? "Next: Verification"
                  : step === 3
                    ? "Next: Review & Submit"
                    : loading
                      ? "Submitting..."
                      : "Submit for Verification"}
            {step === 4 ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </LawyerShell>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-ink">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-sm text-brand">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function DocRow({ label, ok, optional }: { label: string; ok: boolean; optional?: boolean }) {
  return (
    <p className="flex items-center justify-between text-sm">
      <span>{label}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1 text-emerald-600">
          <Check className="h-3.5 w-3.5" /> Uploaded
        </span>
      ) : (
        <span className="text-muted">{optional ? "Not Uploaded (Optional)" : "Missing"}</span>
      )}
    </p>
  );
}
