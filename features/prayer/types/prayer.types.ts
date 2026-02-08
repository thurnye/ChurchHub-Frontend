// Backend Prayer entity types

export enum PrayerCategory {
  HEALTH = 'health',
  FAMILY = 'family',
  FINANCE = 'finance',
  SPIRITUAL = 'spiritual',
  THANKSGIVING = 'thanksgiving',
  OTHER = 'other',
}

export enum PrayerStatus {
  OPEN = 'open',
  ANSWERED = 'answered',
  CLOSED = 'closed',
}

export interface PrayerItem {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  authorId: string;
  title: string;
  description: string;
  category: PrayerCategory;
  status: PrayerStatus;
  isAnonymous: boolean;
  isPrivate: boolean;
  prayedBy: string[];
  prayerCount: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  hasPrayed?: boolean;
}

export interface CreatePrayerDto {
  title: string;
  description: string;
  category: PrayerCategory;
  isAnonymous?: boolean;
  isPrivate?: boolean;
}

export interface PrayerState {
  items: PrayerItem[];
  myPrayers: PrayerItem[];
  selected: PrayerItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
