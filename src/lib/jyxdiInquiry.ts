// Shared by the Art by Jyxdi enquiry forms and /api/jyxdi/inquiry.

export type InquiryKind = "commission" | "live-paint";

export const EVENT_TYPES = ["Wedding", "Birthday", "Engagement party", "Corporate event", "Baby shower", "Other"];

export const BUDGET_RANGES = ["Under $250", "$250 - $500", "$500 - $1,000", "$1,000 - $2,500", "$2,500+", "Not sure yet"];

type FieldSpec = { key: string; label: string; required?: boolean; max: number };

const CONTACT_FIELDS: FieldSpec[] = [
  { key: "name", label: "Name", required: true, max: 120 },
  { key: "email", label: "Email", required: true, max: 200 },
  { key: "phone", label: "Phone", max: 40 },
  { key: "budget", label: "Budget", required: true, max: 40 },
];

export const INQUIRY_FIELDS: Record<InquiryKind, FieldSpec[]> = {
  commission: [
    ...CONTACT_FIELDS,
    { key: "pieceType", label: "Type of piece", required: true, max: 60 },
    { key: "deadline", label: "Needed by", max: 20 },
    { key: "details", label: "Idea", required: true, max: 4000 },
  ],
  "live-paint": [
    ...CONTACT_FIELDS.map((field) => (field.key === "phone" ? { ...field, required: true } : field)),
    { key: "eventType", label: "Type of event", required: true, max: 60 },
    { key: "eventDate", label: "Event date", required: true, max: 20 },
    { key: "eventTime", label: "Start time", max: 20 },
    { key: "guests", label: "Guests", max: 10 },
    { key: "location", label: "Venue and address", required: true, max: 300 },
    { key: "details", label: "Event details", required: true, max: 4000 },
  ],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidInquiry = { kind: InquiryKind; fields: { label: string; value: string }[]; name: string; email: string };

// Trims and length-checks every field. Returns an error message, or the
// labelled fields in display order.
export function validateInquiry(body: Record<string, unknown>): { error: string } | ValidInquiry {
  const kind = body.kind;
  if (kind !== "commission" && kind !== "live-paint") return { error: "Unknown request type." };

  const fields: { label: string; value: string }[] = [];
  const values: Record<string, string> = {};
  for (const spec of INQUIRY_FIELDS[kind]) {
    const raw = body[spec.key];
    const value = typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
    if (spec.required && !value) return { error: `Please fill in ${spec.label.toLowerCase()}.` };
    if (value.length > spec.max) return { error: `${spec.label} is too long.` };
    values[spec.key] = value;
    if (value) fields.push({ label: spec.label, value });
  }

  if (!EMAIL_PATTERN.test(values.email)) return { error: "Please enter a valid email address." };
  return { kind, fields, name: values.name, email: values.email };
}

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
