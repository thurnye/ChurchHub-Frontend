import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { CommunityItem } from '../types/community.types';

export async function fetchCommunityItems(): Promise<CommunityItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<CommunityItem>>('/community');
  return data.data;
}

export async function fetchCommunityItemById(id: string): Promise<CommunityItem> {
  const { data } = await apiClient.get<ApiResponse<CommunityItem>>(`/community/${id}`);
  return data.data;
}
