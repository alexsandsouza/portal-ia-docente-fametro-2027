export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export type RateScope = "enrollment" | "check_in" | "certificate_lookup";

export type RateBucket = {
  scope: RateScope;
  subjectKey: string;
  windowStartedAt: number;
  attempts: number;
};

export function registerInvalidAttempt(
  bucket: RateBucket | undefined,
  scope: RateScope,
  subjectKey: string,
  now: number,
): { bucket: RateBucket; blocked: boolean } {
  const current =
    bucket && now - bucket.windowStartedAt < RATE_LIMIT_WINDOW_MS
      ? bucket
      : { scope, subjectKey, windowStartedAt: now, attempts: 0 };

  if (current.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { bucket: current, blocked: true };
  }

  const next = { ...current, attempts: current.attempts + 1 };
  return { bucket: next, blocked: next.attempts >= RATE_LIMIT_MAX_ATTEMPTS };
}
