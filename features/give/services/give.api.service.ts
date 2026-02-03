import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { GiveItem } from '../types/give.types';

export async function fetchGiveItems(): Promise<GiveItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<GiveItem>>('/donations');
  return data.data;
}

export async function fetchGiveItemById(id: string): Promise<GiveItem> {
  const { data } = await apiClient.get<ApiResponse<GiveItem>>(`/donations/${id}`);
  return data.data;
}
