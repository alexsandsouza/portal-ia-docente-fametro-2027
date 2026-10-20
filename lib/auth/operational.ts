import { normalizeEmail } from "@/lib/validation/email";

export function operationalEmails(): Set<string> {
  const raw = process.env.OPERATIONAL_EMAILS ?? "";
  const emails = raw
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter((item): item is string => item !== null);
  return new Set(emails);
}

export function isOperationalEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return operationalEmails().has(normalized);
}
