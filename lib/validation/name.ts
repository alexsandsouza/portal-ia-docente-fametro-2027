export function normalizeName(input: string): string | null {
  const value = input.trim();
  if (value.length === 0) return null;
  return value;
}
