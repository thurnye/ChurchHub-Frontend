import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { SermonItem, SermonQueryParams } from '../types/sermon.types';
import * as sermonsApi from './sermons.api.service';

/** Simulates network latency for mock calls so thunks behave identically to real API calls. */
function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock data to match the SermonItem type
function mapMockToSermonItem(mock: typeof sermons[0]): SermonItem {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    title: mock.title,
    speaker: mock.speaker,
    date: mock.date,
    description: mock.description || '',
    notes: '',
    mediaUrl: mock.videoUrl,
    thumbnailUrl: mock.thumbnail,
    tags: mock.topic ? [mock.topic] : [],
    scriptureReferences: [],
    duration: mock.duration ? parseInt(mock.duration) * 60 : undefined,
    isPublished: true,
    viewCount: mock.views || 0,
    createdAt: mock.date,
    updatedAt: mock.date,
  };
}

/** Return every sermon. */
export async function getAll(params?: SermonQueryParams): Promise<SermonItem[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermons(params);
  return delay(sermons.map(mapMockToSermonItem));
}

/** Return a single sermon by id, or null if not found. */
export async function getById(id: string): Promise<SermonItem | null> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermonById(id);
  const mock = sermons.find((s) => s.id === id);
  return delay(mock ? mapMockToSermonItem(mock) : null);
}

/** Full-text search across title, speaker, topic, and church. */
export async function search(query: string): Promise<SermonItem[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.searchSermons(query);

  const q = query.toLowerCase();
  return delay(
    sermons
      .filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.speaker.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q) ||
          s.church.toLowerCase().includes(q),
      )
      .map(mapMockToSermonItem),
  );
}

/** Get list of speakers. */
export async function getSpeakers(): Promise<string[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSpeakers();
  const speakers = [...new Set(sermons.map((s) => s.speaker))];
  return delay(speakers);
}

/** Get list of tags. */
export async function getTags(): Promise<string[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchTags();
  const tags = [...new Set(sermons.map((s) => s.topic))];
  return delay(tags);
}
