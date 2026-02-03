import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { churchNews } from '@/data/mockData';
import type { ChurchNewsItem } from '../types/church-news.types';
import * as churchNewsApi from './church-news.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<ChurchNewsItem[]> {
  if (DATA_SOURCE === 'api') return churchNewsApi.fetchChurchNews();
  return delay(churchNews);
}

export async function getById(id: string): Promise<ChurchNewsItem | null> {
  if (DATA_SOURCE === 'api') return churchNewsApi.fetchChurchNewsById(id);
  return delay(churchNews.find((item) => item.id === id) ?? null);
}
