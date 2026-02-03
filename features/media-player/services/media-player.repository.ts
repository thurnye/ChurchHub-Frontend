import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { MediaItem } from '../types/media-player.types';
import * as mediaPlayerApi from './media-player.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<MediaItem[]> {
  if (DATA_SOURCE === 'api') return mediaPlayerApi.fetchMediaItems();
  return delay(sermons);
}

export async function getById(id: string): Promise<MediaItem | null> {
  if (DATA_SOURCE === 'api') return mediaPlayerApi.fetchMediaItemById(id);
  return delay(sermons.find((item) => item.id === id) ?? null);
}
