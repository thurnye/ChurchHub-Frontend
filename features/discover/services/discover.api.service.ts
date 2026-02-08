import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { DiscoverItem } from '../types/discover.types';

export async function fetchDiscoverItems(): Promise<DiscoverItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<DiscoverItem>>('/discover/churches');
  return data.data ?? [];
}

export async function fetchDiscoverItemById(id: string): Promise<DiscoverItem> {
  const { data } = await apiClient.get<ApiResponse<DiscoverItem>>(`/discover/churches/${id}`);
  return data.data;
}
