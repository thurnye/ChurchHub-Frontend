import type { Church } from '@/data/mockData';

export type ChurchItem = Church;

export interface ChurchState {
  items: ChurchItem[];
  selected: ChurchItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
