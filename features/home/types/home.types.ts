export enum FeedSourceType {
  Church = 'church',
  Clergy = 'clergy',
  Group = 'group',
  Event = 'event',
  Individual = 'individual',
  Community = 'community',
}
export interface IFeedItem {
  id: string;
  kind: 'video' | 'image' | 'live' | 'quote';
  thumbnail: string;
  videoUrl?: string;
  postOwner: string;
  denomination?: string;
  title?: string;
  speaker?: string;
  description?: string;
  isLive?: boolean;
  viewerCount?: number;
  sourceType: FeedSourceType;
  sourceId: string;
  primaryRoute: { pathname: string; params: Record<string, any> };
  hasAudio?: boolean;
}

export interface HomeState {
  items: IFeedItem[];
  selected: IFeedItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loadingMore: boolean;
  error: string | null;
  lastFetchedAt: number;
  // Pagination
  page: number;
  hasNext: boolean;
  total: number;
}
