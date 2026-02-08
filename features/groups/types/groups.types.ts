// Backend Group entity types

export enum GroupType {
  SMALL_GROUP = 'small_group',
  MINISTRY = 'ministry',
  BIBLE_STUDY = 'bible_study',
  YOUTH_GROUP = 'youth_group',
  PRAYER_GROUP = 'prayer_group',
  CHOIR = 'choir',
  OTHER = 'other',
}

export interface GroupItem {
  _id: string;
  id?: string; // Alias for _id
  tenantId: string;
  name: string;
  description: string;
  type: GroupType;
  image?: string;
  leaderId: string;
  members: string[];
  meetingSchedule?: string;
  meetingLocation?: string;
  maxMembers: number;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed/populated fields
  leader?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  memberCount?: number;
}

export interface CreateGroupDto {
  name: string;
  description: string;
  type: GroupType;
  image?: string;
  meetingSchedule?: string;
  meetingLocation?: string;
  maxMembers?: number;
  isOpen?: boolean;
}

export interface GroupsState {
  items: GroupItem[];
  myGroups: GroupItem[];
  selected: GroupItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number;
}
