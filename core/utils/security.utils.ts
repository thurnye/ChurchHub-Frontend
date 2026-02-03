/**
 * Security utilities – placeholders for future implementation.
 *
 * Intended use cases:
 *   - Input sanitisation before sending to the backend
 *   - Token structure validation (without verification – that lives server-side)
 *   - Simple rate-limiting helpers for client-side debounce
 */

/** Strip all HTML tags and trim whitespace.  Useful before sending user input to an API. */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/** Basic email format check (client-side only; always validate server-side too). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Returns `true` when the elapsed time since `lastCall` is less than `intervalMs`. */
export function isRateLimited(lastCall: number, intervalMs: number): boolean {
  return Date.now() - lastCall < intervalMs;
}
