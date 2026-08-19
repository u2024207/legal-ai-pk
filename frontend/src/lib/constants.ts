export const LAWYER_STEPS = [
  { key: "account", title: "Account Information", short: "Account", hint: "Basic account details." },
  {
    key: "professional",
    title: "Professional Information",
    short: "Professional Info",
    hint: "Bar council and enrollment details.",
  },
  {
    key: "profile",
    title: "Professional Profile",
    short: "Professional Profile",
    hint: "Specializations and experience.",
  },
  { key: "verification", title: "Verification", short: "Verification", hint: "Documents and verification." },
  { key: "review", title: "Review & Submit", short: "Review & Submit", hint: "Review your information." },
] as const;

export const BAR_COUNCILS = [
  "Punjab Bar Council",
  "Sindh Bar Council",
  "Khyber Pakhtunkhwa Bar Council",
  "Balochistan Bar Council",
  "Islamabad Bar Council",
];

export const ADVOCATE_LEVELS = [
  "Advocate",
  "Advocate High Court",
  "Advocate Supreme Court",
  "Senior Advocate Supreme Court",
];

export const PROVINCES: Record<string, string[]> = {
  Punjab: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot"],
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Swat"],
  Balochistan: ["Quetta", "Gwadar", "Turbat"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu"],
  "Azad Jammu and Kashmir": ["Muzaffarabad", "Mirpur"],
};

export const SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Property Law",
  "Corporate Law",
  "Tax Law",
  "Labour Law",
  "Other",
];

export const LANGUAGES = ["English", "Urdu", "Punjabi", "Pashto", "Sindhi", "Balochi", "Other"];

export const EXPERIENCE_OPTIONS = ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years", "10+ Years"];

export const COURT_OPTIONS = [
  "District Courts",
  "High Court",
  "Federal Shariat Court",
  "Supreme Court",
];
