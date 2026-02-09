// Backend Sermon entity types

export interface SermonItem {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  title: string;
  speaker: string;
  date: string;
  description?: string;
  notes?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  scriptureReferences: string[];
  duration?: number; // in seconds
  isPublished: boolean;
  isLive?: boolean; // Whether the sermon is currently live streaming
  publishedAt?: string;
  viewCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSermonDto {
  title: string;
  speaker: string;
  date: string;
  description?: string;
  notes?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  scriptureReferences?: string[];
  duration?: number;
  isPublished?: boolean;
}

export interface UpdateSermonDto extends Partial<CreateSermonDto> {}

export interface SermonQueryParams {
  page?: number;
  limit?: number;
  speaker?: string;
  tag?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  isPublished?: boolean;
}

export interface SermonsState {
  items: SermonItem[];
  selected: SermonItem | null;
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  speakers: string[];
  tags: string[];
  selectedTag: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
  // Pagination
  page: number;
  hasMore: boolean;
  loadingMore: boolean;
}
