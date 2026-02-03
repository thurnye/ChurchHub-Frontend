import type { IFeedItem } from '@/data/mockData';

export type HomeItem = IFeedItem;

export interface HomeState {
  items: HomeItem[];
  selected: HomeItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
