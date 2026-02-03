import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { conferences } from '@/data/mockData';
import type { ConferenceItem } from '../types/conferences.types';
import * as conferencesApi from './conferences.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<ConferenceItem[]> {
  if (DATA_SOURCE === 'api') return conferencesApi.fetchConferences();
  return delay(conferences);
}

export async function getById(id: string): Promise<ConferenceItem | null> {
  if (DATA_SOURCE === 'api') return conferencesApi.fetchConferenceById(id);
  return delay(conferences.find((item) => item.id === id) ?? null);
}
