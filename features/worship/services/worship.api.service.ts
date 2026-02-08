import apiClient from '@/core/services/apiClient.service';
import type {
  WorshipResource,
  WorshipSet,
  CreateWorshipResourceDto,
  CreateWorshipSetDto,
  WorshipItem,
} from '../types/worship.types';

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

// ========== RESOURCES ==========

export async function fetchWorshipResources(params: {
  page?: number;
  limit?: number;
  type?: string;
  tag?: string;
  search?: string;
} = {}): Promise<WorshipResource[]> {
  const { data } = await apiClient.get<ApiResponse<WorshipResource[]>>('/worships/resources', { params });
  return data.data;
}

export async function fetchWorshipResourceById(id: string): Promise<WorshipResource> {
  const { data } = await apiClient.get<ApiResponse<WorshipResource>>(`/worships/resources/${id}`);
  return data.data;
}

export async function createWorshipResource(dto: CreateWorshipResourceDto): Promise<WorshipResource> {
  const { data } = await apiClient.post<ApiResponse<WorshipResource>>('/worships/resources', dto);
  return data.data;
}

export async function updateWorshipResource(id: string, dto: Partial<CreateWorshipResourceDto>): Promise<WorshipResource> {
  const { data } = await apiClient.put<ApiResponse<WorshipResource>>(`/worships/resources/${id}`, dto);
  return data.data;
}

export async function archiveWorshipResource(id: string): Promise<WorshipResource> {
  const { data } = await apiClient.patch<ApiResponse<WorshipResource>>(`/worships/resources/${id}/archive`);
  return data.data;
}

export async function deleteWorshipResource(id: string): Promise<void> {
  await apiClient.delete(`/worships/resources/${id}`);
}

export async function fetchResourceTags(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/worships/resources/tags');
  return data.data;
}

export async function fetchResourceKeys(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/worships/resources/keys');
  return data.data;
}

// ========== SETS ==========

export async function fetchWorshipSets(params: {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
} = {}): Promise<WorshipSet[]> {
  const { data } = await apiClient.get<ApiResponse<WorshipSet[]>>('/worships/sets', { params });
  return data.data;
}

export async function fetchWorshipSetById(id: string): Promise<WorshipSet> {
  const { data } = await apiClient.get<ApiResponse<WorshipSet>>(`/worships/sets/${id}`);
  return data.data;
}

export async function fetchUpcomingWorshipSets(): Promise<WorshipSet[]> {
  const { data } = await apiClient.get<ApiResponse<WorshipSet[]>>('/worships/sets/upcoming');
  return data.data;
}

export async function createWorshipSet(dto: CreateWorshipSetDto): Promise<WorshipSet> {
  const { data } = await apiClient.post<ApiResponse<WorshipSet>>('/worships/sets', dto);
  return data.data;
}

export async function updateWorshipSet(id: string, dto: Partial<CreateWorshipSetDto>): Promise<WorshipSet> {
  const { data } = await apiClient.put<ApiResponse<WorshipSet>>(`/worships/sets/${id}`, dto);
  return data.data;
}

export async function publishWorshipSet(id: string): Promise<WorshipSet> {
  const { data } = await apiClient.patch<ApiResponse<WorshipSet>>(`/worships/sets/${id}/publish`);
  return data.data;
}

export async function deleteWorshipSet(id: string): Promise<void> {
  await apiClient.delete(`/worships/sets/${id}`);
}

// ========== BACKWARDS COMPATIBILITY ==========
// These are for existing components that use the old interface

export async function fetchWorshipItems(): Promise<WorshipItem[]> {
  return fetchWorshipResources();
}

export async function fetchWorshipItemById(id: string): Promise<WorshipItem> {
  return fetchWorshipResourceById(id);
}
