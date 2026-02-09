import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { SermonItem, SermonQueryParams } from '../types/sermon.types';
import * as sermonsApi from './sermons.api.service';
import type { FetchSermonsResult } from './sermons.api.service';

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

/** Return sermons with pagination. */
export async function getAll(params?: SermonQueryParams): Promise<FetchSermonsResult> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermons(params);

  // Mock implementation with filtering and pagination
  let filtered = sermons.map(mapMockToSermonItem);

  // Filter by tag
  if (params?.tag) {
    filtered = filtered.filter((s) => s.tags.includes(params.tag!));
  }

  // Filter by speaker
  if (params?.speaker) {
    filtered = filtered.filter((s) => s.speaker === params.speaker);
  }

  // Filter by search
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  // Apply pagination
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const start = (page - 1) * limit;
  const paginatedItems = filtered.slice(start, start + limit);

  return delay({
    items: paginatedItems,
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  });
}

/** Return a single sermon by id, or null if not found. */
export async function getById(id: string): Promise<SermonItem | null> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermonById(id);
  const mock = sermons.find((s) => s.id === id);
  return delay(mock ? mapMockToSermonItem(mock) : null);
}

/** Full-text search across title, speaker, topic, and church. */
export async function search(query: string): Promise<FetchSermonsResult> {
  if (DATA_SOURCE === 'api') return sermonsApi.searchSermons(query);

  const q = query.toLowerCase();
  const filtered = sermons
    .filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.church.toLowerCase().includes(q),
    )
    .map(mapMockToSermonItem);

  return delay({
    items: filtered,
    meta: {
      total: filtered.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(filtered.length / 20),
    },
  });
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
