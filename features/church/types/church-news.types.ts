import type { IChurchNews } from '@/data/mockData';

export type ChurchNewsItem = IChurchNews;

export interface ChurchNewsState {
  items: ChurchNewsItem[];
  selected: ChurchNewsItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
