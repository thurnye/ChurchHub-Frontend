import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { churchGroups } from '@/data/mockData';
import type { GroupItem } from '../types/groups.types';
import * as groupsApi from './groups.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<GroupItem[]> {
  if (DATA_SOURCE === 'api') return groupsApi.fetchGroups();
  return delay(churchGroups);
}

export async function getById(id: string): Promise<GroupItem | null> {
  if (DATA_SOURCE === 'api') return groupsApi.fetchGroupById(id);
  return delay(churchGroups.find((item) => item.id === id) ?? null);
}
