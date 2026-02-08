import apiClient from '@/core/services/apiClient.service';
import type { SermonItem, SermonQueryParams } from '../types/sermon.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchSermons(params: SermonQueryParams = {}): Promise<SermonItem[]> {
  const { data } = await apiClient.get<ApiResponse<SermonItem[]>>('/sermons', { params });
  return data.data;
}

export async function fetchSermonById(id: string): Promise<SermonItem> {
  const { data } = await apiClient.get<ApiResponse<SermonItem>>(`/sermons/${id}`);
  return data.data;
}

export async function searchSermons(query: string): Promise<SermonItem[]> {
  // Backend uses query params for filtering, not a separate search endpoint
  const { data } = await apiClient.get<ApiResponse<SermonItem[]>>('/sermons', {
    params: { search: query },
  });
  return data.data;
}

export async function fetchSpeakers(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/sermons/speakers');
  return data.data;
}

export async function fetchTags(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/sermons/tags');
  return data.data;
}
