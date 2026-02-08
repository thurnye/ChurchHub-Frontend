import apiClient from '@/core/services/apiClient.service';
import type { GroupItem, CreateGroupDto } from '../types/groups.types';

// Backend returns { data: [], meta: {} } directly (no success wrapper)
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchGroups(page = 1, limit = 20): Promise<GroupItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<GroupItem>>('/groups', {
    params: { page, limit },
  });
  return data.data ?? [];
}

export async function fetchGroupById(id: string): Promise<GroupItem> {
  const { data } = await apiClient.get<GroupItem>(`/groups/${id}`);
  return data;
}

export async function fetchMyGroups(): Promise<GroupItem[]> {
  const { data } = await apiClient.get<GroupItem[]>('/groups/my-groups');
  return data;
}

export async function createGroup(dto: CreateGroupDto): Promise<GroupItem> {
  const { data } = await apiClient.post<GroupItem>('/groups', dto);
  return data;
}

export async function joinGroup(id: string): Promise<GroupItem> {
  const { data } = await apiClient.post<GroupItem>(`/groups/${id}/join`);
  return data;
}

export async function leaveGroup(id: string): Promise<void> {
  await apiClient.delete(`/groups/${id}/leave`);
}
