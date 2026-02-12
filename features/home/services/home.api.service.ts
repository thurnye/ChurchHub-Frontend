import apiClient from '@/core/services/apiClient.service';
import type { HomeItem } from '../types/home.types';

// Backend wraps responses in { success: true, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export async function fetchHomeItems(page: number = 1, limit: number = 10): Promise<PaginatedResponse<HomeItem>> {
  console.log('[fetchHomeItems] Fetching feed page:', page);
  try {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<HomeItem>>>('/feed', {
      params: { page, limit },
    });

    const result = data?.data ?? { data: [], total: 0, page: 1, limit: 10, hasNext: false };

    // Debug: Log items with videoUrl
    const videoItems = result.data?.filter(item => item.videoUrl);
    console.log('[fetchHomeItems] Total items:', result.data?.length, 'Video items:', videoItems?.length);
    if (videoItems?.length > 0) {
      console.log('[fetchHomeItems] First video item:', JSON.stringify(videoItems[0], null, 2));
    }

    return result;
  } catch (error: any) {
    console.error('[fetchHomeItems] Error:', error.message, error.response?.data);
    throw error;
  }
}

export async function fetchHomeItemById(id: string): Promise<HomeItem> {
  const { data } = await apiClient.get<ApiResponse<HomeItem>>(`/feed/${id}`);
  return data.data;
}
