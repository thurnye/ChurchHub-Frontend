import type { ISermon } from '@/data/mockData';

// Re-export the mock interface as the canonical item type.
// When a backend schema is defined, replace this with the API-driven shape.
export type SermonItem = ISermon;

export interface SermonsState {
  items: SermonItem[];
  selected: SermonItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
