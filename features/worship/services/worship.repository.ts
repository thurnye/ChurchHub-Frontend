import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type {
  WorshipResource,
  WorshipSet,
  WorshipItem,
  CreateWorshipResourceDto,
  CreateWorshipSetDto,
  WorshipResourceType,
} from '../types/worship.types';
import * as worshipApi from './worship.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock sermon data to WorshipResource for backwards compatibility
function mapMockToWorshipResource(mock: typeof sermons[0]): WorshipResource {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    title: mock.title,
    type: 'song' as WorshipResourceType,
    artist: mock.speaker,
    mediaUrl: mock.videoUrl,
    lyrics: '',
    tags: mock.topic ? [mock.topic] : [],
    isArchived: false,
    createdAt: mock.date,
    updatedAt: mock.date,
  };
}

// ========== RESOURCES ==========

export async function getAllResources(params?: {
  page?: number;
  limit?: number;
  type?: string;
  tag?: string;
  search?: string;
}): Promise<WorshipResource[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipResources(params);
  return delay(sermons.map(mapMockToWorshipResource));
}

export async function getResourceById(id: string): Promise<WorshipResource | null> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipResourceById(id);
  const mock = sermons.find((item) => item.id === id);
  return delay(mock ? mapMockToWorshipResource(mock) : null);
}

export async function createResource(dto: CreateWorshipResourceDto): Promise<WorshipResource> {
  if (DATA_SOURCE === 'api') return worshipApi.createWorshipResource(dto);
  const mockResource: WorshipResource = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    ...dto,
    tags: dto.tags || [],
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockResource);
}

export async function updateResource(id: string, dto: Partial<CreateWorshipResourceDto>): Promise<WorshipResource> {
  if (DATA_SOURCE === 'api') return worshipApi.updateWorshipResource(id, dto);
  const mock = sermons.find((item) => item.id === id);
  if (!mock) throw new Error('Resource not found');
  return delay({ ...mapMockToWorshipResource(mock), ...dto });
}

export async function archiveResource(id: string): Promise<WorshipResource> {
  if (DATA_SOURCE === 'api') return worshipApi.archiveWorshipResource(id);
  const mock = sermons.find((item) => item.id === id);
  if (!mock) throw new Error('Resource not found');
  return delay({ ...mapMockToWorshipResource(mock), isArchived: true });
}

export async function deleteResource(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return worshipApi.deleteWorshipResource(id);
  return delay(undefined);
}

export async function getResourceTags(): Promise<string[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchResourceTags();
  const tags = [...new Set(sermons.map((s) => s.topic))];
  return delay(tags);
}

export async function getResourceKeys(): Promise<string[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchResourceKeys();
  return delay(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
}

// ========== SETS ==========

export async function getAllSets(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}): Promise<WorshipSet[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipSets(params);
  // No mock data for sets
  return delay([]);
}

export async function getSetById(id: string): Promise<WorshipSet | null> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchWorshipSetById(id);
  return delay(null);
}

export async function getUpcomingSets(): Promise<WorshipSet[]> {
  if (DATA_SOURCE === 'api') return worshipApi.fetchUpcomingWorshipSets();
  return delay([]);
}

export async function createSet(dto: CreateWorshipSetDto): Promise<WorshipSet> {
  if (DATA_SOURCE === 'api') return worshipApi.createWorshipSet(dto);
  const mockSet: WorshipSet = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    title: dto.title,
    description: dto.description,
    scheduledAt: dto.scheduledAt,
    items: [],
    teamMembers: dto.teamMembers || [],
    notes: dto.notes,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockSet);
}

export async function updateSet(id: string, dto: Partial<CreateWorshipSetDto>): Promise<WorshipSet> {
  if (DATA_SOURCE === 'api') return worshipApi.updateWorshipSet(id, dto);
  throw new Error('Set not found');
}

export async function publishSet(id: string): Promise<WorshipSet> {
  if (DATA_SOURCE === 'api') return worshipApi.publishWorshipSet(id);
  throw new Error('Set not found');
}

export async function deleteSet(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return worshipApi.deleteWorshipSet(id);
  return delay(undefined);
}

// ========== BACKWARDS COMPATIBILITY ==========

export async function getAll(): Promise<WorshipItem[]> {
  return getAllResources();
}

export async function getById(id: string): Promise<WorshipItem | null> {
  return getResourceById(id);
}
