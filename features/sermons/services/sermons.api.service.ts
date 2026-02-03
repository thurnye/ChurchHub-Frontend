import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { SermonItem } from '../types/sermon.types';

/**
 * API service for sermons – stubbed for future backend integration.
 * These functions are called by the repository only when DATA_SOURCE === "api".
 */

export async function fetchSermons(): Promise<SermonItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<SermonItem>>('/sermons');
  return data.data;
}

export async function fetchSermonById(id: string): Promise<SermonItem> {
  const { data } = await apiClient.get<ApiResponse<SermonItem>>(`/sermons/${id}`);
  return data.data;
}

export async function searchSermons(query: string): Promise<SermonItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<SermonItem>>(
    '/sermons/search',
    { params: { q: query } },
  );
  return data.data;
}
