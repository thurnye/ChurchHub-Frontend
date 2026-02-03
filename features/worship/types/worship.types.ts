import type { ISermon } from '@/data/mockData';

export type WorshipItem = ISermon;

export interface WorshipState {
  items: WorshipItem[];
  selected: WorshipItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
