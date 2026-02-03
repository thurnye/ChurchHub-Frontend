import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { SermonItem } from '../types/sermon.types';
import * as sermonsApi from './sermons.api.service';

/** Simulates network latency for mock calls so thunks behave identically to real API calls. */
function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Return every sermon. */
export async function getAll(): Promise<SermonItem[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermons();
  return delay(sermons);
}

/** Return a single sermon by id, or null if not found. */
export async function getById(id: string): Promise<SermonItem | null> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermonById(id);
  return delay(sermons.find((s) => s.id === id) ?? null);
}

/** Full-text search across title, speaker, topic, and church. */
export async function search(query: string): Promise<SermonItem[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.searchSermons(query);

  const q = query.toLowerCase();
  return delay(
    sermons.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.church.toLowerCase().includes(q),
    ),
  );
}
