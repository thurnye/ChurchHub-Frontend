/**
 * Backward compatibility wrapper for existing Bible feature imports.
 * The centralized store has moved to shared/stores/stores.ts
 * to follow the new feature-based architecture.
 */

export { store, type RootState, type AppDispatch } from '@/shared/stores/stores';
