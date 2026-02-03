import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { CareerItem } from '../types/careers.types';

export async function fetchCareers(): Promise<CareerItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<CareerItem>>('/careers');
  return data.data;
}

export async function fetchCareerById(id: string): Promise<CareerItem> {
  const { data } = await apiClient.get<ApiResponse<CareerItem>>(`/careers/${id}`);
  return data.data;
}
