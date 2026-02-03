import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { NotificationItem } from '../types/notifications.types';

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<NotificationItem>>('/notifications');
  return data.data;
}

export async function fetchNotificationById(id: string): Promise<NotificationItem> {
  const { data } = await apiClient.get<ApiResponse<NotificationItem>>(`/notifications/${id}`);
  return data.data;
}
