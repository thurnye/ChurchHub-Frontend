import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { GroupItem } from '../types/groups.types';

export async function fetchGroups(): Promise<GroupItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<GroupItem>>('/groups');
  return data.data;
}

export async function fetchGroupById(id: string): Promise<GroupItem> {
  const { data } = await apiClient.get<ApiResponse<GroupItem>>(`/groups/${id}`);
  return data.data;
}
