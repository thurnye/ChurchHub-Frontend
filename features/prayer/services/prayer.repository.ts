import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { prayerRequests } from '@/data/mockData';
import type { PrayerItem, CreatePrayerDto, PrayerCategory, PrayerStatus } from '../types/prayer.types';
import * as prayerApi from './prayer.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock data to match the PrayerItem type
function mapMockToPrayerItem(mock: typeof prayerRequests[0]): PrayerItem {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    authorId: mock.authorId || '',
    title: mock.title,
    description: mock.description || mock.request || '',
    category: (mock.category?.toLowerCase() || 'other') as PrayerCategory,
    status: (mock.status?.toLowerCase() || 'open') as PrayerStatus,
    isAnonymous: mock.isAnonymous || false,
    isPrivate: false,
    prayedBy: [],
    prayerCount: mock.prayerCount || 0,
    createdAt: mock.createdAt || new Date().toISOString(),
    updatedAt: mock.createdAt || new Date().toISOString(),
    author: mock.author ? {
      _id: mock.authorId || '',
      firstName: mock.author.split(' ')[0],
      lastName: mock.author.split(' ').slice(1).join(' '),
      avatar: mock.authorAvatar,
    } : undefined,
  };
}

export async function getAll(): Promise<PrayerItem[]> {
  if (DATA_SOURCE === 'api') return prayerApi.fetchPrayerItems();
  return delay(prayerRequests.map(mapMockToPrayerItem));
}

export async function getById(id: string): Promise<PrayerItem | null> {
  if (DATA_SOURCE === 'api') return prayerApi.fetchPrayerItemById(id);
  const mock = prayerRequests.find((item) => item.id === id);
  return delay(mock ? mapMockToPrayerItem(mock) : null);
}

export async function getMyPrayers(): Promise<PrayerItem[]> {
  if (DATA_SOURCE === 'api') return prayerApi.fetchMyPrayers();
  // Mock: return first 2 prayers as "my prayers"
  return delay(prayerRequests.slice(0, 2).map(mapMockToPrayerItem));
}

export async function create(dto: CreatePrayerDto): Promise<PrayerItem> {
  if (DATA_SOURCE === 'api') return prayerApi.createPrayer(dto);
  const mockPrayer: PrayerItem = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    authorId: 'mock-user',
    title: dto.title,
    description: dto.description,
    category: dto.category,
    status: 'open' as PrayerStatus,
    isAnonymous: dto.isAnonymous || false,
    isPrivate: dto.isPrivate || false,
    prayedBy: [],
    prayerCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockPrayer);
}

export async function prayFor(id: string): Promise<PrayerItem> {
  if (DATA_SOURCE === 'api') return prayerApi.prayForRequest(id);
  const mock = prayerRequests.find((item) => item.id === id);
  if (!mock) throw new Error('Prayer request not found');
  return delay({
    ...mapMockToPrayerItem(mock),
    hasPrayed: true,
    prayerCount: (mock.prayerCount || 0) + 1,
  });
}

export async function markAnswered(id: string): Promise<PrayerItem> {
  if (DATA_SOURCE === 'api') return prayerApi.markAsAnswered(id);
  const mock = prayerRequests.find((item) => item.id === id);
  if (!mock) throw new Error('Prayer request not found');
  return delay({
    ...mapMockToPrayerItem(mock),
    status: 'answered' as PrayerStatus,
  });
}
