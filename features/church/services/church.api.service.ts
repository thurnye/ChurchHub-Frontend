import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { ChurchItem } from '../types/church.types';

export async function fetchChurches(): Promise<ChurchItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<ChurchItem>>('/churches');
  return data.data;
}

export async function fetchChurchById(id: string): Promise<ChurchItem> {
  const { data } = await apiClient.get<ApiResponse<ChurchItem>>(`/churches/${id}`);
  return data.data;
}
