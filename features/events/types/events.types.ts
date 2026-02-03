import type { IEvent } from '@/data/mockData';

export type EventItem = IEvent;

export interface EventsState {
  items: EventItem[];
  selected: EventItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
