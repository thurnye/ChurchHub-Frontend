import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { ChurchNewsItem } from '../types/church-news.types';

export async function fetchChurchNews(): Promise<ChurchNewsItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<ChurchNewsItem>>('/church-news');
  return data.data;
}

export async function fetchChurchNewsById(id: string): Promise<ChurchNewsItem> {
  const { data } = await apiClient.get<ApiResponse<ChurchNewsItem>>(`/church-news/${id}`);
  return data.data;
}
