import type { INotification } from '@/data/mockData';

export type NotificationItem = INotification;

export interface NotificationsState {
  items: NotificationItem[];
  selected: NotificationItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
