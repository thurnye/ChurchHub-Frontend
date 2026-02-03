import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { notifications } from '@/data/mockData';
import type { NotificationItem } from '../types/notifications.types';
import * as notificationsApi from './notifications.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<NotificationItem[]> {
  if (DATA_SOURCE === 'api') return notificationsApi.fetchNotifications();
  return delay(notifications);
}

export async function getById(id: string): Promise<NotificationItem | null> {
  if (DATA_SOURCE === 'api') return notificationsApi.fetchNotificationById(id);
  return delay(notifications.find((item) => item.id === id) ?? null);
}
