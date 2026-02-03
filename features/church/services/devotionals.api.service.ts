import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { DevotionalItem } from '../types/devotionals.types';

export async function fetchDevotionals(): Promise<DevotionalItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<DevotionalItem>>('/devotionals');
  return data.data;
}

export async function fetchDevotionalById(id: string): Promise<DevotionalItem> {
  const { data } = await apiClient.get<ApiResponse<DevotionalItem>>(`/devotionals/${id}`);
  return data.data;
}
