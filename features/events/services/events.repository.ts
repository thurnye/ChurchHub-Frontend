import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { events } from '@/data/mockData';
import type { EventItem } from '../types/events.types';
import * as eventsApi from './events.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<EventItem[]> {
  if (DATA_SOURCE === 'api') return eventsApi.fetchEvents();
  return delay(events);
}

export async function getById(id: string): Promise<EventItem | null> {
  if (DATA_SOURCE === 'api') return eventsApi.fetchEventById(id);
  return delay(events.find((item) => item.id === id) ?? null);
}
