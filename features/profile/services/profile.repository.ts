import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { ProfileData } from '@/data/mockData';
import type { ProfileItem } from '../types/profile.types';
import * as profileApi from './profile.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<ProfileItem[]> {
  if (DATA_SOURCE === 'api') return profileApi.fetchProfiles();
  return delay(ProfileData);
}

export async function getById(id: string): Promise<ProfileItem | null> {
  if (DATA_SOURCE === 'api') return profileApi.fetchProfileById(id);
  return delay(ProfileData.find((item) => item.id === id) ?? null);
}
