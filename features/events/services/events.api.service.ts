import apiClient from '@/core/services/apiClient.service';
import type { EventItem, CreateEventDto } from '../types/events.types';

// Backend returns { data: [], meta: {} } directly (no success wrapper)
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchEvents(page = 1, limit = 20): Promise<EventItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<EventItem>>('/events', {
    params: { page, limit },
  });
  return data.data ?? [];
}

export async function fetchEventById(id: string): Promise<EventItem> {
  const { data } = await apiClient.get<EventItem>(`/events/${id}`);
  return data;
}

export async function createEvent(dto: CreateEventDto): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>('/events', dto);
  return data;
}

export async function registerForEvent(id: string): Promise<EventItem> {
  const { data } = await apiClient.post<EventItem>(`/events/${id}/register`);
  return data;
}

export async function unregisterFromEvent(id: string): Promise<void> {
  await apiClient.delete(`/events/${id}/register`);
}

export async function deleteEvent(id: string): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}
