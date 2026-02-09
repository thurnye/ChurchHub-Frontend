import apiClient from '@/core/services/apiClient.service';
import type { SermonItem, SermonQueryParams } from '../types/sermon.types';

// Backend wraps responses with { success: true, data: <payload>, ... }
// The sermons controller returns { success, data: [...], meta: {...} }
// Then TransformInterceptor wraps it again, so final response is:
// { success, data: { success, data: [...], meta }, statusCode, ... }

interface ApiWrapper<T> {
  success: boolean;
  data: T;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

interface SermonsResponse {
  success: boolean;
  data: SermonItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchSermonsResult {
  items: SermonItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchSermons(params: SermonQueryParams = {}): Promise<FetchSermonsResult> {
  const { data: response } = await apiClient.get<ApiWrapper<SermonsResponse>>('/sermons', { params });
  // response.data is { success, data: [...sermons], meta }
  const innerData = response.data;
  return {
    items: innerData?.data ?? [],
    meta: innerData?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
  };
}

export async function fetchSermonById(id: string): Promise<SermonItem> {
  const { data: response } = await apiClient.get<ApiWrapper<{ success: boolean; data: SermonItem }>>(`/sermons/${id}`);
  // response.data is { success, data: sermon }
  return response.data?.data ?? response.data;
}

export async function searchSermons(query: string): Promise<FetchSermonsResult> {
  const { data: response } = await apiClient.get<ApiWrapper<SermonsResponse>>('/sermons', {
    params: { search: query },
  });
  const innerData = response.data;
  return {
    items: innerData?.data ?? [],
    meta: innerData?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
  };
}

export async function fetchSpeakers(): Promise<string[]> {
  const { data: response } = await apiClient.get<ApiWrapper<{ success: boolean; data: string[] }>>('/sermons/speakers');
  return response.data?.data ?? [];
}

export async function fetchTags(): Promise<string[]> {
  const { data: response } = await apiClient.get<ApiWrapper<{ success: boolean; data: string[] }>>('/sermons/tags');
  return response.data?.data ?? [];
}
