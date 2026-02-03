import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { WorshipItem } from '../types/worship.types';

export async function fetchWorshipItems(): Promise<WorshipItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<WorshipItem>>('/worship');
  return data.data;
}

export async function fetchWorshipItemById(id: string): Promise<WorshipItem> {
  const { data } = await apiClient.get<ApiResponse<WorshipItem>>(`/worship/${id}`);
  return data.data;
}
