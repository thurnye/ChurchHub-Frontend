// Backend Event entity types

export enum EventCategory {
  WORSHIP = 'worship',
  FELLOWSHIP = 'fellowship',
  OUTREACH = 'outreach',
  EDUCATION = 'education',
  YOUTH = 'youth',
  WOMEN = 'women',
  MEN = 'men',
  FAMILY = 'family',
  OTHER = 'other',
}

export interface EventItem {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  requiresRegistration: boolean;
  maxAttendees?: number;
  isPublic: boolean;
  registeredUsers?: string[];
  createdAt: string;
  updatedAt: string;
  // Computed fields
  attendeeCount?: number;
  isRegistered?: boolean;
}

export interface CreateEventDto {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  requiresRegistration?: boolean;
  maxAttendees?: number;
  isPublic?: boolean;
}

export interface EventsState {
  items: EventItem[];
  selected: EventItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
