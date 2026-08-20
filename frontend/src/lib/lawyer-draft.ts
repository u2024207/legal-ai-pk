export type LawyerDraft = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  cnic: string;
  bar_council: string;
  enrollment_number: string;
  enrollment_date: string;
  advocate_level: string;
  bar_association: string;
  province: string;
  city: string;
  practice_courts: string;
  primary_specialization: string;
  court_practice: string;
  other_specializations: string[];
  consultation_type: "online" | "in-person" | "";
  years_experience: string;
  languages_known: string[];
  other_language: string;
  professional_bio: string;
  info_confirmed: boolean;
  terms_accepted: boolean;
};

export const EMPTY_DRAFT: LawyerDraft = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  cnic: "",
  bar_council: "",
  enrollment_number: "",
  enrollment_date: "",
  advocate_level: "",
  bar_association: "",
  province: "",
  city: "",
  practice_courts: "",
  primary_specialization: "",
  court_practice: "",
  other_specializations: [],
  consultation_type: "",
  years_experience: "",
  languages_known: ["English", "Urdu"],
  other_language: "",
  professional_bio: "",
  info_confirmed: false,
  terms_accepted: false,
};

const KEY = "legalai_lawyer_draft";

export function loadDraft(): LawyerDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...EMPTY_DRAFT, ...JSON.parse(raw) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveDraft(draft: LawyerDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(draft));
}

export function clearDraft() {
  sessionStorage.removeItem(KEY);
}
