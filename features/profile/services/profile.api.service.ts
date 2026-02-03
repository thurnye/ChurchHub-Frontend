import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { ProfileItem } from '../types/profile.types';

export async function fetchProfiles(): Promise<ProfileItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<ProfileItem>>('/profiles');
  return data.data;
}

export async function fetchProfileById(id: string): Promise<ProfileItem> {
  const { data } = await apiClient.get<ApiResponse<ProfileItem>>(`/profiles/${id}`);
  return data.data;
}
