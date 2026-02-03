import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { EventItem } from '../types/events.types';

export async function fetchEvents(): Promise<EventItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<EventItem>>('/events');
  return data.data;
}

export async function fetchEventById(id: string): Promise<EventItem> {
  const { data } = await apiClient.get<ApiResponse<EventItem>>(`/events/${id}`);
  return data.data;
}
