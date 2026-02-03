import type { IDevotional } from '@/data/mockData';

export type DevotionalItem = IDevotional;

export interface DevotionalsState {
  items: DevotionalItem[];
  selected: DevotionalItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
