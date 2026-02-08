import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { events } from '@/data/mockData';
import type { EventItem, CreateEventDto } from '../types/events.types';
import * as eventsApi from './events.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Map mock data to match the EventItem type
function mapMockToEventItem(mock: typeof events[0]): EventItem {
  return {
    _id: mock.id,
    id: mock.id,
    tenantId: '1',
    title: mock.title,
    description: mock.description || '',
    category: (mock.category?.toLowerCase() || 'other') as any,
    startDate: mock.date,
    endDate: mock.endDate || mock.date,
    location: mock.location || '',
    image: mock.image,
    requiresRegistration: false,
    isPublic: true,
    createdAt: mock.date,
    updatedAt: mock.date,
  };
}

export async function getAll(): Promise<EventItem[]> {
  if (DATA_SOURCE === 'api') return eventsApi.fetchEvents();
  return delay(events.map(mapMockToEventItem));
}

export async function getById(id: string): Promise<EventItem | null> {
  if (DATA_SOURCE === 'api') return eventsApi.fetchEventById(id);
  const mock = events.find((item) => item.id === id);
  return delay(mock ? mapMockToEventItem(mock) : null);
}

export async function create(dto: CreateEventDto): Promise<EventItem> {
  if (DATA_SOURCE === 'api') return eventsApi.createEvent(dto);
  const mockEvent: EventItem = {
    _id: `mock-${Date.now()}`,
    id: `mock-${Date.now()}`,
    tenantId: '1',
    ...dto,
    requiresRegistration: dto.requiresRegistration || false,
    isPublic: dto.isPublic ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return delay(mockEvent);
}

export async function register(id: string): Promise<EventItem> {
  if (DATA_SOURCE === 'api') return eventsApi.registerForEvent(id);
  const mock = events.find((item) => item.id === id);
  if (!mock) throw new Error('Event not found');
  return delay({ ...mapMockToEventItem(mock), isRegistered: true });
}

export async function unregister(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return eventsApi.unregisterFromEvent(id);
  return delay(undefined);
}

export async function remove(id: string): Promise<void> {
  if (DATA_SOURCE === 'api') return eventsApi.deleteEvent(id);
  return delay(undefined);
}
