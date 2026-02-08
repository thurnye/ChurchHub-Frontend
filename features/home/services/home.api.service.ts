import apiClient from '@/core/services/apiClient.service';
import type { HomeItem } from '../types/home.types';

// Backend wraps responses in { success: true, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export async function fetchHomeItems(): Promise<HomeItem[]> {
  const { data } = await apiClient.get<ApiResponse<PaginatedData<HomeItem>>>('/feed');
  return data.data.data;
}

export async function fetchHomeItemById(id: string): Promise<HomeItem> {
  const { data } = await apiClient.get<ApiResponse<HomeItem>>(`/feed/${id}`);
  return data.data;
}
