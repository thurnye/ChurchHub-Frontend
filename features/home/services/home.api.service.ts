import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { HomeItem } from '../types/home.types';

export async function fetchHomeItems(): Promise<HomeItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<HomeItem>>('/feed');
  return data.data;
}

export async function fetchHomeItemById(id: string): Promise<HomeItem> {
  const { data } = await apiClient.get<ApiResponse<HomeItem>>(`/feed/${id}`);
  return data.data;
}
