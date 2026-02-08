import apiClient from '@/core/services/apiClient.service';
import type { PrayerItem, CreatePrayerDto } from '../types/prayer.types';

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

export async function fetchPrayerItems(page = 1, limit = 20): Promise<PrayerItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<PrayerItem>>('/prayer', {
    params: { page, limit },
  });
  return data.data ?? [];
}

export async function fetchPrayerItemById(id: string): Promise<PrayerItem> {
  const { data } = await apiClient.get<PrayerItem>(`/prayer/${id}`);
  return data;
}

export async function fetchMyPrayers(): Promise<PrayerItem[]> {
  const { data } = await apiClient.get<PrayerItem[]>('/prayer/my-prayers');
  return data;
}

export async function createPrayer(dto: CreatePrayerDto): Promise<PrayerItem> {
  const { data } = await apiClient.post<PrayerItem>('/prayer', dto);
  return data;
}

export async function prayForRequest(id: string): Promise<PrayerItem> {
  const { data } = await apiClient.post<PrayerItem>(`/prayer/${id}/pray`);
  return data;
}

export async function markAsAnswered(id: string): Promise<PrayerItem> {
  const { data } = await apiClient.put<PrayerItem>(`/prayer/${id}/answered`);
  return data;
}
