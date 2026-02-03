import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { churches } from '@/data/mockData';
import type { DiscoverItem } from '../types/discover.types';
import * as discoverApi from './discover.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<DiscoverItem[]> {
  if (DATA_SOURCE === 'api') return discoverApi.fetchDiscoverItems();
  return delay(churches);
}

export async function getById(id: string): Promise<DiscoverItem | null> {
  if (DATA_SOURCE === 'api') return discoverApi.fetchDiscoverItemById(id);
  return delay(churches.find((item) => item.id === id) ?? null);
}
