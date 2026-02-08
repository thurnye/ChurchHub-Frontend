// Backend Worship entity types

export enum WorshipResourceType {
  SONG = 'song',
  HYMN = 'hymn',
  SCRIPTURE = 'scripture',
  PRAYER = 'prayer',
  COMMUNION = 'communion',
  OTHER = 'other',
}

export interface WorshipResource {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  title: string;
  type: WorshipResourceType;
  artist?: string;
  mediaUrl?: string;
  lyrics?: string;
  chordChart?: string;
  key?: string;
  tempo?: number; // BPM
  duration?: number; // seconds
  tags: string[];
  ccliNumber?: string;
  notes?: string;
  isArchived: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorshipSetItem {
  resourceId: string;
  order: number;
  keyOverride?: string;
  notes?: string;
  resource?: WorshipResource; // Populated
}

export interface WorshipSet {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  title: string;
  description?: string;
  scheduledAt?: string;
  eventId?: string;
  items: WorshipSetItem[];
  leaderId?: string;
  teamMembers: string[];
  notes?: string;
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  leader?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// For backwards compatibility with existing components
export type WorshipItem = WorshipResource;

export interface CreateWorshipResourceDto {
  title: string;
  type: WorshipResourceType;
  artist?: string;
  mediaUrl?: string;
  lyrics?: string;
  chordChart?: string;
  key?: string;
  tempo?: number;
  duration?: number;
  tags?: string[];
  ccliNumber?: string;
  notes?: string;
}

export interface CreateWorshipSetDto {
  title: string;
  description?: string;
  scheduledAt?: string;
  eventId?: string;
  items?: {
    resourceId: string;
    order: number;
    keyOverride?: string;
    notes?: string;
  }[];
  leaderId?: string;
  teamMembers?: string[];
  notes?: string;
}

export interface WorshipState {
  resources: WorshipResource[];
  sets: WorshipSet[];
  upcomingSets: WorshipSet[];
  selectedResource: WorshipResource | null;
  selectedSet: WorshipSet | null;
  tags: string[];
  keys: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
  // For backwards compatibility
  items: WorshipResource[];
  selected: WorshipResource | null;
}
