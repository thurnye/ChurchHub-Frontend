/**
 * Global data-source switch.
 *
 * "mock"  – every repository reads from data/mockData.ts (default, safe for local dev).
 * "api"   – repositories call the Axios-based API services in core/services/.
 *
 * Flip this value (or wire it to an env var) when you are ready to hit a real backend.
 */
export const DATA_SOURCE: 'mock' | 'api' = 'mock';
