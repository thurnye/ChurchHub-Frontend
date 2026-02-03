import type { IProfileData } from '@/data/mockData';

export type ProfileItem = IProfileData;

export interface ProfileState {
  items: ProfileItem[];
  selected: ProfileItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
