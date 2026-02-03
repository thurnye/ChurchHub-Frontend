import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { ConferenceItem } from '../types/conferences.types';

export async function fetchConferences(): Promise<ConferenceItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<ConferenceItem>>('/conferences');
  return data.data;
}

export async function fetchConferenceById(id: string): Promise<ConferenceItem> {
  const { data } = await apiClient.get<ApiResponse<ConferenceItem>>(`/conferences/${id}`);
  return data.data;
}
