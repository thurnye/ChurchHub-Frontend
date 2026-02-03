import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { prayerRequests } from '@/data/mockData';
import type { PrayerItem } from '../types/prayer.types';
import * as prayerApi from './prayer.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<PrayerItem[]> {
  if (DATA_SOURCE === 'api') return prayerApi.fetchPrayerItems();
  return delay(prayerRequests);
}

export async function getById(id: string): Promise<PrayerItem | null> {
  if (DATA_SOURCE === 'api') return prayerApi.fetchPrayerItemById(id);
  return delay(prayerRequests.find((item) => item.id === id) ?? null);
}
