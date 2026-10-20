const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: string): string | null {
  const value = input.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(value)) return null;
  return value;
}
