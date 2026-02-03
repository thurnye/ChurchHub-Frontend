import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { devotionals } from '@/data/mockData';
import type { DevotionalItem } from '../types/devotionals.types';
import * as devotionalsApi from './devotionals.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<DevotionalItem[]> {
  if (DATA_SOURCE === 'api') return devotionalsApi.fetchDevotionals();
  return delay(devotionals);
}

export async function getById(id: string): Promise<DevotionalItem | null> {
  if (DATA_SOURCE === 'api') return devotionalsApi.fetchDevotionalById(id);
  return delay(devotionals.find((item) => item.id === id) ?? null);
}
