import type { IChurch } from '@/data/mockData';

export type DiscoverItem = IChurch;

export interface DiscoverState {
  items: DiscoverItem[];
  selected: DiscoverItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
