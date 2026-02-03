import { DATA_SOURCE } from '@/shared/utils/dataSource';
import type { GiveItem } from '../types/give.types';
import * as giveApi from './give.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<GiveItem[]> {
  if (DATA_SOURCE === 'api') return giveApi.fetchGiveItems();
  return delay([]);
}

export async function getById(id: string): Promise<GiveItem | null> {
  if (DATA_SOURCE === 'api') return giveApi.fetchGiveItemById(id);
  return delay(null);
}
