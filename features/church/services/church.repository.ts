import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { churches } from '@/data/mockData';
import type { ChurchItem } from '../types/church.types';
import * as churchApi from './church.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<ChurchItem[]> {
  if (DATA_SOURCE === 'api') return churchApi.fetchChurches();
  return delay(churches);
}

export async function getById(id: string): Promise<ChurchItem | null> {
  if (DATA_SOURCE === 'api') return churchApi.fetchChurchById(id);
  return delay(churches.find((item) => item.id === id) ?? null);
}
