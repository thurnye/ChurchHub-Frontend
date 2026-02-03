import type { ISermon } from '@/data/mockData';

export type MediaItem = ISermon;

export interface MediaState {
  items: MediaItem[];
  selected: MediaItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
