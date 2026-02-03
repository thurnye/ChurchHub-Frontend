import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { FeedItems } from '@/data/mockData';
import type { HomeItem } from '../types/home.types';
import * as homeApi from './home.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<HomeItem[]> {
  if (DATA_SOURCE === 'api') return homeApi.fetchHomeItems();
  return delay(FeedItems);
}

export async function getById(id: string): Promise<HomeItem | null> {
  if (DATA_SOURCE === 'api') return homeApi.fetchHomeItemById(id);
  return delay(FeedItems.find((item) => item.id === id) ?? null);
}
