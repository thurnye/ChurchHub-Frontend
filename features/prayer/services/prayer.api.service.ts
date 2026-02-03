import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { PrayerItem } from '../types/prayer.types';

export async function fetchPrayerItems(): Promise<PrayerItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<PrayerItem>>('/prayer-requests');
  return data.data;
}

export async function fetchPrayerItemById(id: string): Promise<PrayerItem> {
  const { data } = await apiClient.get<ApiResponse<PrayerItem>>(`/prayer-requests/${id}`);
  return data.data;
}
