import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { VolunteerProgramItem } from '../types/volunteer-programs.types';

export async function fetchVolunteerPrograms(): Promise<VolunteerProgramItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<VolunteerProgramItem>>('/volunteer-programs');
  return data.data;
}

export async function fetchVolunteerProgramById(id: string): Promise<VolunteerProgramItem> {
  const { data } = await apiClient.get<ApiResponse<VolunteerProgramItem>>(`/volunteer-programs/${id}`);
  return data.data;
}
