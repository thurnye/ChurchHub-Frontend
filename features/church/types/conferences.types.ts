import type { Conference } from '@/data/mockData';

export type ConferenceItem = Conference;

export interface ConferencesState {
  items: ConferenceItem[];
  selected: ConferenceItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
