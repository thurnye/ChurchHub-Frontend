import type { IChurchGroup } from '@/data/mockData';

export type GroupItem = IChurchGroup;

export interface GroupsState {
  items: GroupItem[];
  selected: GroupItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
