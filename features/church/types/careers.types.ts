import type { Career } from '@/data/mockData';

export type CareerItem = Career;

export interface CareersState {
  items: CareerItem[];
  selected: CareerItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
