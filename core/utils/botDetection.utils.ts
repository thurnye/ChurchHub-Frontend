/**
 * Bot-detection utilities – placeholders for future implementation.
 *
 * Intended use cases:
 *   - Flag requests that arrive suspiciously fast (no human could tap that quickly)
 *   - Honeypot field checks on forms (a field that should never be filled)
 *   - User-agent sniffing as a first-pass heuristic
 */

interface RequestMetadata {
  userAgent?: string;
  /** Milliseconds since the previous request from the same session. */
  requestIntervalMs?: number;
}

/**
 * Returns `true` when the request metadata matches basic bot heuristics.
 * Expand with ML-based scoring or a third-party service later.
 */
export function isSuspiciousRequest(metadata: RequestMetadata): boolean {
  if (!metadata.userAgent) return true;
  if (metadata.requestIntervalMs !== undefined && metadata.requestIntervalMs < 100) return true;
  return false;
}

/**
 * Checks whether a form submission includes a value in a honeypot field.
 * The honeypot field should be hidden and never filled by real users.
 */
export function isHoneypotTriggered(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}
