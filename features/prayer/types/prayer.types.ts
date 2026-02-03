import type { IPrayerRequest } from '@/data/mockData';

export type PrayerItem = IPrayerRequest;

export interface PrayerState {
  items: PrayerItem[];
  selected: PrayerItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
