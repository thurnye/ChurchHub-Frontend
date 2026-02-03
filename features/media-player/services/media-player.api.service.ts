import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { MediaItem } from '../types/media-player.types';

export async function fetchMediaItems(): Promise<MediaItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<MediaItem>>('/media');
  return data.data;
}

export async function fetchMediaItemById(id: string): Promise<MediaItem> {
  const { data } = await apiClient.get<ApiResponse<MediaItem>>(`/media/${id}`);
  return data.data;
}
