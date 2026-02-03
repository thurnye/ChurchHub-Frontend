import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { SettingsItem } from '../types/settings.types';

export async function fetchSettingsItems(): Promise<SettingsItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<SettingsItem>>('/settings');
  return data.data;
}

export async function fetchSettingsItemById(key: string): Promise<SettingsItem> {
  const { data } = await apiClient.get<ApiResponse<SettingsItem>>(`/settings/${key}`);
  return data.data;
}
