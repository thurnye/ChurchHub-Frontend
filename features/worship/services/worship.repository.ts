import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { WorshipItem } from '../types/worship.types';
import * as worshipApi from './worship.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<WorshipItem[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipItems();
  return delay(sermons);
}

export async function getById(id: string): Promise<WorshipItem | null> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipItemById(id);
  return delay(sermons.find((item) => item.id === id) ?? null);
}
