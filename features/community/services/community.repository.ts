import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { communityPrograms } from '@/data/mockData';
import type { CommunityItem } from '../types/community.types';
import * as communityApi from './community.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<CommunityItem[]> {
  if (DATA_SOURCE === 'api') return communityApi.fetchCommunityItems();
  return delay(communityPrograms);
}

export async function getById(id: string): Promise<CommunityItem | null> {
  if (DATA_SOURCE === 'api') return communityApi.fetchCommunityItemById(id);
  return delay(communityPrograms.find((item) => item.id === id) ?? null);
}
