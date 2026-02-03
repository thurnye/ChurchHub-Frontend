import type { ICommunityProgram } from '@/data/mockData';

export type CommunityItem = ICommunityProgram;

export interface CommunityState {
  items: CommunityItem[];
  selected: CommunityItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
