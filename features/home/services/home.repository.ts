import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { FeedItems } from '@/data/mockData';
import type { HomeItem } from '../types/home.types';
import * as homeApi from './home.api.service';
import type { PaginatedResponse } from './home.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<HomeItem>> {
  if (DATA_SOURCE === 'api') {
    return homeApi.fetchHomeItems(page, limit);
  }

  // Mock pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = FeedItems.slice(start, end);

  return delay({
    data: paginatedItems,
    total: FeedItems.length,
    page,
    limit,
    hasNext: end < FeedItems.length,
  });
}

export async function getById(id: string): Promise<HomeItem | null> {
  if (DATA_SOURCE === 'api') return homeApi.fetchHomeItemById(id);
  return delay(FeedItems.find((item) => item.id === id) ?? null);
}
