import apiClient from '@/core/services/apiClient.service';
import type { CommunityProgram, CreateProgramDto, ProgramType } from '../types/community.types';

// Backend wraps responses with { success: true, data: <payload>, ... }
interface ApiResponse<T> {
  success: boolean;
  data: T;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface QueryParams {
  page?: number;
  limit?: number;
  type?: ProgramType;
  category?: string;
}

export interface FetchProgramsResult {
  items: CommunityProgram[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchCommunityPrograms(params: QueryParams = {}): Promise<FetchProgramsResult> {
  const { data: response } = await apiClient.get<ApiResponse<PaginatedData<CommunityProgram>>>('/community/programs', {
    params,
  });
  return {
    items: response.data?.data ?? [],
    meta: response.data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
  };
}

export async function fetchProgramById(id: string): Promise<CommunityProgram> {
  const { data: response } = await apiClient.get<ApiResponse<CommunityProgram>>(`/community/programs/${id}`);
  return response.data;
}

export async function fetchCategories(): Promise<string[]> {
  const { data: response } = await apiClient.get<ApiResponse<{ data: string[] }>>('/community/programs/categories');
  return response.data?.data ?? [];
}

export async function fetchFeaturedPrograms(limit?: number): Promise<CommunityProgram[]> {
  const { data: response } = await apiClient.get<ApiResponse<{ data: CommunityProgram[] }>>('/community/programs/featured', {
    params: { limit },
  });
  return response.data?.data ?? [];
}

export async function createProgram(dto: CreateProgramDto): Promise<CommunityProgram> {
  const { data: response } = await apiClient.post<ApiResponse<CommunityProgram>>('/community/programs', dto);
  return response.data;
}

export async function updateProgram(id: string, dto: Partial<CreateProgramDto>): Promise<CommunityProgram> {
  const { data: response } = await apiClient.put<ApiResponse<CommunityProgram>>(`/community/programs/${id}`, dto);
  return response.data;
}

export async function deleteProgram(id: string): Promise<void> {
  await apiClient.delete(`/community/programs/${id}`);
}

export async function joinProgram(id: string): Promise<CommunityProgram> {
  const { data: response } = await apiClient.post<ApiResponse<CommunityProgram>>(`/community/programs/${id}/join`);
  return response.data;
}

export async function leaveProgram(id: string): Promise<void> {
  await apiClient.delete(`/community/programs/${id}/leave`);
}

// Backwards compatibility aliases
export const fetchCommunityItems = fetchCommunityPrograms;
